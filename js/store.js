/* Estado do usuário, repetição espaçada (Leitner) e estatísticas.
   Tudo fica no localStorage do navegador — nada é enviado para servidor. */
(function () {
  "use strict";

  const STORAGE_KEY = "ingles12:v1";
  const C = window.CURRICULUM;

  /* ───────── Datas (sempre no fuso local, formato AAAA-MM-DD) ───────── */
  const pad = (n) => String(n).padStart(2, "0");
  function toKey(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function fromKey(k) { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); }
  function today() { return toKey(new Date()); }
  function addDays(k, n) { const d = fromKey(k); d.setDate(d.getDate() + n); return toKey(d); }
  function diffDays(a, b) { return Math.round((fromKey(b) - fromKey(a)) / 86400000); }
  function fmtDate(k, opts) {
    try { return fromKey(k).toLocaleDateString("pt-BR", opts || { day: "2-digit", month: "short" }); }
    catch (e) { return k; }
  }

  /* ───────── Persistência ───────── */
  function blank() {
    return {
      version: 1,
      profile: null,
      settings: { rate: 0.95, voiceURI: "", theme: "light", themeV: 2, autoplay: true },
      lessons: {},       // "w1d1": { at, correct, total, minutes }
      checkpoints: {},   // "w1": { score, total, at, selfcheck, worked, change }
      cards: {},         // "w1d1v0": { box, due, reps, lapses, added }
      journal: [],       // { id, lesson, date, prompt, text }
      immersion: {},     // "w1": [true, false, true]
      activity: {}       // "2026-11-09": { min, lessons, reviews }
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return blank();
      const data = JSON.parse(raw);
      const base = blank();
      const merged = Object.assign(base, data, { settings: Object.assign(base.settings, data.settings || {}) });
      // Versão 2 do visual: tema claro por padrão.
      if (merged.settings.themeV !== 2) { merged.settings.theme = "light"; merged.settings.themeV = 2; }
      return merged;
    } catch (e) {
      return blank();
    }
  }

  let state = load();
  let storageOk = true;

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); storageOk = true; }
    catch (e) { storageOk = false; }
  }

  /* ───────── Currículo ───────── */
  const WEEKS = C.weeks.length;            // 12
  const TOTAL_DAYS = WEEKS * 7;            // 84

  function week(n) { return C.weeks[n - 1]; }
  function phaseOf(n) { return C.phases.find((p) => n >= p.weeks[0] && n <= p.weeks[1]); }
  function lessonId(w, d) { return "w" + w + "d" + d; }
  function parseId(id) { const m = /^w(\d+)d(\d+)$/.exec(id); return m ? { w: +m[1], d: +m[2] } : null; }
  function dayKind(d) { return d <= 5 ? "lesson" : d === 6 ? "immersion" : "review"; }
  function dayTitle(w, d) {
    const k = dayKind(d);
    if (k === "lesson") return week(w).days[d - 1].title;
    if (k === "immersion") return "Imersão";
    return "Revisão semanal";
  }
  function allIds() {
    const out = [];
    for (let w = 1; w <= WEEKS; w++) for (let d = 1; d <= 7; d++) out.push(lessonId(w, d));
    return out;
  }
  function isDone(id) { return !!state.lessons[id]; }
  function nextId() { return allIds().find((id) => !isDone(id)) || null; }

  function cardId(w, d, i) { return lessonId(w, d) + "v" + i; }
  function cardContent(id) {
    const m = /^w(\d+)d(\d+)v(\d+)$/.exec(id);
    if (!m) return null;
    const wk = week(+m[1]);
    const day = wk && wk.days[+m[2] - 1];
    const v = day && day.vocab[+m[3]];
    return v ? { id, en: v[0], pt: v[1], ex: v[2], exPt: v[3], w: +m[1] } : null;
  }

  /* ───────── Repetição espaçada: sistema de Leitner com 5 caixas ───────── */
  const INTERVALS = [0, 1, 2, 4, 8, 16]; // dias até a próxima revisão, por caixa

  function addCards(ids) {
    const t = today();
    ids.forEach((id) => {
      if (!state.cards[id]) state.cards[id] = { box: 1, due: addDays(t, 1), reps: 0, lapses: 0, added: t };
    });
  }

  function dueIds(limit) {
    const t = today();
    const list = Object.keys(state.cards)
      .filter((id) => state.cards[id].due <= t && cardContent(id))
      .sort((a, b) => (state.cards[a].due < state.cards[b].due ? -1 : state.cards[a].due > state.cards[b].due ? 1 : state.cards[a].box - state.cards[b].box));
    return typeof limit === "number" ? list.slice(0, limit) : list;
  }

  function dueTomorrow() {
    const t = addDays(today(), 1);
    return Object.keys(state.cards).filter((id) => state.cards[id].due <= t).length;
  }

  /* grade: "again" (errei), "hard" (difícil), "easy" (acertei) */
  function nextSchedule(card, grade) {
    const t = today();
    if (grade === "again") return { box: 1, due: t };
    if (grade === "hard") return { box: card.box, due: addDays(t, 1) };
    const box = Math.min(5, card.box + 1);
    return { box, due: addDays(t, INTERVALS[box]) };
  }

  function gradeCard(id, grade) {
    const card = state.cards[id];
    if (!card) return;
    const next = nextSchedule(card, grade);
    card.box = next.box;
    card.due = next.due;
    card.reps += 1;
    if (grade === "again") card.lapses += 1;
  }

  function intervalLabel(card, grade) {
    const n = diffDays(today(), nextSchedule(card, grade).due);
    if (n <= 0) return "hoje";
    if (n === 1) return "amanhã";
    return n + " dias";
  }

  function boxCounts() {
    const out = [0, 0, 0, 0, 0];
    Object.values(state.cards).forEach((c) => { out[c.box - 1] += 1; });
    return out;
  }

  /* ───────── Atividade e estatísticas ───────── */
  function logActivity(patch) {
    const t = today();
    const a = state.activity[t] || { min: 0, lessons: 0, reviews: 0, xp: 0 };
    a.min += patch.min || 0;
    a.xp = (a.xp || 0) + (patch.xp || 0);
    a.lessons += patch.lessons || 0;
    a.reviews += patch.reviews || 0;
    state.activity[t] = a;
  }

  function minutesToday() { const a = state.activity[today()]; return a ? a.min : 0; }

  function streak() {
    let k = today();
    if (!state.activity[k]) k = addDays(k, -1);
    let n = 0;
    while (state.activity[k]) { n += 1; k = addDays(k, -1); }
    return n;
  }

  function totals() {
    const minutes = Object.values(state.activity).reduce((s, a) => s + a.min, 0);
    const xp = Object.values(state.activity).reduce((s, a) => s + (a.xp || 0), 0);
    const lessons = Object.keys(state.lessons).length;
    const words = Object.keys(state.cards).length;
    const mastered = Object.values(state.cards).filter((c) => c.box >= 4).length;
    return { minutes, lessons, words, mastered, xp };
  }

  function weekDone(w) {
    let n = 0;
    for (let d = 1; d <= 7; d++) if (isDone(lessonId(w, d))) n += 1;
    return n;
  }
  function execution(w) { return Math.round((weekDone(w) / 7) * 100); }

  /* Dia do calendário desde a data de início (1 = primeiro dia). */
  function calendarDay() {
    if (!state.profile) return 1;
    return diffDays(state.profile.startDate, today()) + 1;
  }
  function calendarWeek() {
    const d = calendarDay();
    if (d < 1) return 0;
    return Math.min(WEEKS, Math.ceil(d / 7));
  }

  /* ───────── Backup ───────── */
  function exportJSON() { return JSON.stringify(state); }
  function importJSON(text) {
    const data = JSON.parse(text);
    if (!data || typeof data !== "object" || !("lessons" in data) || !("cards" in data)) throw new Error("formato");
    const base = blank();
    state = Object.assign(base, data, { settings: Object.assign(base.settings, data.settings || {}) });
    save();
  }
  function reset() { state = blank(); save(); }

  window.Store = {
    get state() { return state; },
    get storageOk() { return storageOk; },
    save, reset, exportJSON, importJSON,
    today, addDays, diffDays, fmtDate, fromKey, toKey,
    WEEKS, TOTAL_DAYS, INTERVALS,
    week, phaseOf, lessonId, parseId, dayKind, dayTitle, allIds, isDone, nextId,
    cardId, cardContent, addCards, dueIds, dueTomorrow, gradeCard, intervalLabel, boxCounts,
    logActivity, minutesToday, streak, totals, weekDone, execution, calendarDay, calendarWeek
  };
})();
