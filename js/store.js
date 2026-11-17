/* Estado do intensivo, repetição espaçada como no Anki e cronômetro de 8 horas.
   Tudo fica no navegador (localStorage); nada é enviado para servidor. */
(function () {
  "use strict";

  const KEY = "intensivo500:v1";
  const W = window.WORDS;
  const N = W.length;            // 1000: as 500 essenciais + 500 das etapas por área
  const CORE = window.CORE_N || N; // 500 essenciais: o intensivo de 8 horas
  const RS = 25;                 // palavras por rodada
  const ROUNDS = CORE / RS;      // 20
  const PER_BLOCK = 5;           // rodadas por bloco
  const BLOCKS = ROUNDS / PER_BLOCK; // 4
  const SESSION_MIN = 480;       // 8 horas
  const BREAK_EVERY = 50;        // minutos de estudo antes da pausa
  const BREAK_MIN = 10;          // duração da pausa
  const MIN = 60000;

  /* Uma palavra conta como "fixada" quando se forma no Anki (caixa 3 ou mais): foi lembrada duas vezes,
     com 1 e 10 minutos de intervalo. */
  const LEARNED_BOX = 3;

  function blank() {
    return {
      version: 1,
      profile: null,
      settings: { rate: 0.9, voiceURI: "", theme: "light", autoplay: true, ankiNew: 20, ankiDir: "en" },
      session: { startedAt: null, lastBreakEnd: null, breaks: [], finishedAt: null },
      cards: {},     // índice → { box, due, ok, bad, seen, learnedAt }
      notes: {},     // índice → anotação
      pad: "",       // caderno livre
      nodes: {},     // "r1".."r20", "c1".."c4" → { at, correct, total, min }
      etapas: {},    // etapas por área: "w:comida", "f:comida", "s:balada", "g:d1", "k:treino1" → { at, correct, total, min }
      pcards: {},    // frases prontas: "comida.3" → { box, due, ok, bad, seen, learnedAt }
      pnotes: {},    // anotações por frase
      anki: null,    // registro do dia nos cards: { day, fresh, rev, extra, again }
      tobe: {},      // lições do verbo to be: "t1".."t11" → { at, correct, total, min }
      resumes: {},   // rodadas e lições em andamento: id → posição, para continuar de onde parou
      talks: 0,      // conversas feitas
      spoken: 0,     // frases ditas em voz alta
      savedAt: 0     // última alteração (para a sincronização escolher a versão mais nova)
    };
  }

  function merge(data) {
    const base = blank();
    return Object.assign(base, data, {
      settings: Object.assign(base.settings, data.settings || {}),
      session: Object.assign(base.session, data.session || {}),
      tobe: data.tobe || {},
      etapas: data.etapas || {},
      pcards: data.pcards || {},
      pnotes: data.pnotes || {},
      resumes: data.resumes || (data.resume ? { [data.resume.id]: data.resume } : {})
    });
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? merge(JSON.parse(raw)) : blank();
    } catch (e) {
      return blank();
    }
  }

  let state = load();
  let storageOk = true;
  /* Grava no navegador sem marcar como alteração nova. */
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); storageOk = true; }
    catch (e) { storageOk = false; }
  }
  /* Grava uma alteração: no navegador agora e na nuvem logo depois. */
  function save() {
    state.savedAt = Date.now();
    persist();
    if (window.Sync) window.Sync.schedule();
  }
  /* Cópia do progresso para a nuvem, com um resumo para consulta. */
  function snapshot() {
    const c = counts();
    return Object.assign({}, state, { meta: { learned: c.learned, seen: c.seen, tobe: Object.keys(state.tobe).length } });
  }
  /* Troca o progresso local pelo que veio da nuvem. */
  function replace(data) {
    const savedAt = data.savedAt || Date.now();
    delete data.meta;
    state = merge(data);
    state.savedAt = savedAt;
    persist();
  }

  /* ───────── Palavras e rodadas ───────── */
  function word(i) { const w = W[i]; return { i, en: w[0], pt: w[1], ex: w[2], exPt: w[3] }; }
  function roundRange(r) { const a = (r - 1) * RS; return Array.from({ length: RS }, (_, k) => a + k); }
  function blockOfRound(r) { return Math.ceil(r / PER_BLOCK); }
  function blockRange(b) { const a = (b - 1) * PER_BLOCK * RS; return Array.from({ length: PER_BLOCK * RS }, (_, k) => a + k); }

  /* Ordem da trilha: 5 rodadas e a prova de cada bloco. */
  function nodeIds() {
    const out = [];
    for (let b = 1; b <= BLOCKS; b++) {
      for (let k = 1; k <= PER_BLOCK; k++) out.push("r" + ((b - 1) * PER_BLOCK + k));
      out.push("c" + b);
    }
    return out;
  }
  function isDone(id) { return id.includes(":") ? !!state.etapas[id] : id[0] === "t" ? !!state.tobe[id] : !!state.nodes[id]; }
  function nextId() { return nodeIds().find((id) => !isDone(id)) || null; }
  const tobeIds = () => window.TOBE.map((l) => l.id);
  function nextTobe() { return tobeIds().find((id) => !state.tobe[id]) || null; }
  function tobeCount() { return tobeIds().filter((id) => state.tobe[id]).length; }

  /* Registra progresso feito antes (ou em outro aparelho sem sincronização): as palavras de 1 até n
     entram como estudadas e voltam para revisão agora; as rodadas completas ficam marcadas. */
  function markStudiedUpTo(n) {
    n = Math.max(0, Math.min(CORE, Math.floor(n)));
    const t = now();
    for (let i = 0; i < n; i++) {
      if (!state.cards[i]) state.cards[i] = { box: 2, due: t, ok: 1, bad: 0, seen: t, learnedAt: null, q: "learn", step: 1, ivl: 0, ease: 2.5, reps: 1, lapses: 0 };
    }
    for (let r = 1; r <= ROUNDS; r++) {
      if (r * RS <= n && !state.nodes["r" + r]) state.nodes["r" + r] = { at: t, correct: 0, total: 0, min: 0, manual: true };
    }
    if (!state.session.startedAt) { state.session.startedAt = t; state.session.lastBreakEnd = t; }
    save();
  }

  /* ───────── Repetição espaçada, como no Anki ─────────
     Card novo: passos de aprendizado de 1 e 10 minutos. "Bom" no último passo forma o card, que volta em 1 dia;
     "Fácil" forma direto em 4 dias. Nas revisões, o intervalo cresce pela facilidade, que começa em 2,5:
     Difícil = intervalo × 1,2 (facilidade −0,15) · Bom = intervalo × facilidade · Fácil = intervalo × facilidade × 1,3
     (facilidade +0,15). Errou numa revisão: o card volta a aprender (10 min), a facilidade cai 0,2 e o intervalo
     recomeça em 1 dia. O dia vira às 4h da manhã, como no Anki.
     Os cards guardam também "box" (1 a 5), usado pelo resto do app: 1–2 aprendendo, 3+ formado ("fixado"). */
  const LEARN_STEPS = [1, 10];
  const RELEARN_STEPS = [10];
  const GRAD_IVL = 1, EASY_IVL = 4, START_EASE = 2.5, MIN_EASE = 1.3, HARD_MULT = 1.2, EASY_BONUS = 1.3;
  const DAY = 1440 * MIN;
  const LEARN_AHEAD = 20 * MIN;
  const now = () => Date.now();
  function dayStart(t) { const d = new Date(t - 4 * 3600e3); d.setHours(0, 0, 0, 0); return d.getTime() + 4 * 3600e3; }
  function dayKey(t) { const d = new Date(dayStart(t)); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }

  function fresh() { return { box: 1, due: now(), ok: 0, bad: 0, seen: now(), learnedAt: null, q: "new", step: 0, ivl: 0, ease: START_EASE, reps: 0, lapses: 0 }; }
  /* Cards antigos (caixas de Leitner) passam para o formato do Anki na primeira vez que são lidos. */
  function ensure(c) {
    if (!c || c.q) return c;
    const b = c.box || 1;
    c.ease = START_EASE; c.reps = (c.ok || 0) + (c.bad || 0); c.lapses = 0;
    if (b <= 2) { c.q = "learn"; c.step = b - 1; c.ivl = 0; }
    else { c.q = "review"; c.step = 0; c.ivl = b >= 5 ? 3 : 1; if (!c.learnedAt) c.learnedAt = c.seen || now(); }
    return c;
  }
  function boxOf(c) {
    if (c.q === "new") return 1;
    if (c.q === "learn" || c.q === "relearn") return c.q === "learn" && c.step >= 1 ? 2 : 1;
    return c.ivl >= 7 ? 5 : c.ivl >= 2 ? 4 : 3;
  }

  /* O próximo estado de um card para cada botão, sem alterar nada. */
  function nextState(c, g) {
    const t = now();
    const s = { q: c.q || "new", step: c.step || 0, ivl: c.ivl || 0, ease: c.ease || START_EASE, due: t };
    const inMin = (m) => t + m * MIN;
    const inDays = (d) => dayStart(t) + d * DAY;
    if (s.q !== "review") {
      const relearn = s.q === "relearn";
      const steps = relearn ? RELEARN_STEPS : LEARN_STEPS;
      const stay = relearn ? "relearn" : "learn";
      if (s.q === "new") s.step = 0;
      if (g === "again") { s.q = stay; s.step = 0; s.due = inMin(steps[0]); return s; }
      if (g === "hard") { s.q = stay; s.due = inMin(s.step === 0 && steps.length > 1 ? (steps[0] + steps[1]) / 2 : steps[Math.min(s.step, steps.length - 1)]); return s; }
      if (g === "good" && s.step + 1 < steps.length) { s.q = stay; s.step += 1; s.due = inMin(steps[s.step]); return s; }
      const base = relearn ? Math.max(1, s.ivl) : g === "good" ? GRAD_IVL : EASY_IVL;
      s.q = "review"; s.step = 0; s.ivl = relearn && g === "easy" ? base + 1 : base; s.due = inDays(s.ivl);
      return s;
    }
    if (g === "again") { s.q = "relearn"; s.step = 0; s.ease = Math.max(MIN_EASE, s.ease - 0.2); s.ivl = 1; s.due = inMin(RELEARN_STEPS[0]); return s; }
    const hardIvl = Math.max(s.ivl + 1, Math.round(s.ivl * HARD_MULT));
    const goodIvl = Math.max(hardIvl + 1, Math.round(s.ivl * s.ease));
    const easyIvl = Math.max(goodIvl + 1, Math.round(s.ivl * s.ease * EASY_BONUS));
    if (g === "hard") { s.ivl = hardIvl; s.ease = Math.max(MIN_EASE, s.ease - 0.15); }
    else if (g === "good") s.ivl = goodIvl;
    else { s.ivl = easyIvl; s.ease += 0.15; }
    s.due = inDays(s.ivl);
    return s;
  }
  function apply(c, g) {
    ensure(c);
    const was = c.q;
    Object.assign(c, nextState(c, g));
    c.reps = (c.reps || 0) + 1;
    if (g === "again") { c.bad = (c.bad || 0) + 1; if (was === "review") c.lapses = (c.lapses || 0) + 1; }
    else c.ok = (c.ok || 0) + 1;
    c.box = boxOf(c);
    if (c.q === "review" && !c.learnedAt) c.learnedAt = now();
    return c;
  }
  /* Rótulo do botão, como no Anki: "1 min", "10 min", "1 d", "4 d", "2 meses". */
  function label(c, g) {
    const s = nextState(ensure(c ? Object.assign({}, c) : fresh()), g);
    if (s.q === "review") {
      const d = s.ivl;
      if (d < 30) return d + " d";
      if (d < 365) { const m = Math.round(d / 30); return m + (m === 1 ? " mês" : " meses"); }
      return (d / 365).toFixed(1).replace(".", ",") + " anos";
    }
    const m = Math.max(1, Math.round((s.due - now()) / MIN));
    return m < 60 ? m + " min" : Math.round(m / 60) + " h";
  }

  /* ── Palavras (pela posição na lista) ── */
  function card(i) { return ensure(state.cards[i] || null); }
  function introduce(i) {
    if (state.cards[i]) return;
    const c = fresh();
    c.q = "learn"; c.due = now() + LEARN_STEPS[0] * MIN;
    state.cards[i] = c;
  }
  /* Exercício logo depois de aprender: acerto avança um passo; erro volta ao começo (ou é um lapso). */
  function quizCard(c, ok) {
    ensure(c);
    if (ok) { if (c.q === "learn" && c.step === 0) apply(c, "good"); else c.ok = (c.ok || 0) + 1; }
    else apply(c, "again");
  }
  function quiz(i, ok) { introduce(i); quizCard(state.cards[i], ok); }
  /* Revisão: "again" (errei), "hard" (difícil), "good" (bom), "easy" (fácil). */
  function grade(i, g) { introduce(i); apply(state.cards[i], g); }
  function intervalLabel(i, g) { return label(state.cards[i] || null, g); }

  function dueIds(limit, exclude) {
    const t = now();
    const ex = exclude ? new Set(exclude) : null;
    const list = Object.keys(state.cards).map(Number)
      .filter((i) => state.cards[i].due <= t && !(ex && ex.has(i)))
      .sort((a, b) => state.cards[a].due - state.cards[b].due);
    return typeof limit === "number" ? list.slice(0, limit) : list;
  }
  /* Palavras já vistas que ainda não se formaram, das mais urgentes para as menos. */
  function leftIds(limit) {
    const list = Object.keys(state.cards).map(Number)
      .filter((i) => state.cards[i].box < LEARNED_BOX)
      .sort((a, b) => state.cards[a].due - state.cards[b].due);
    return typeof limit === "number" ? list.slice(0, limit) : list;
  }
  function nextDueIn() {
    const t = now();
    const future = Object.values(state.cards).filter((c) => c.due > t).map((c) => c.due - t);
    return future.length ? Math.ceil(Math.min(...future) / MIN) : null;
  }

  function status(i) {
    const c = state.cards[i];
    if (!c) return "new";
    return c.box >= LEARNED_BOX ? "learned" : "training";
  }
  /* Contagens de todas as palavras ou só das posições pedidas (ex.: as 500 essenciais). */
  function counts(idxs) {
    let seen = 0, learned = 0, fixed = 0;
    const list = idxs ? idxs.map((i) => state.cards[i]).filter(Boolean) : Object.values(state.cards);
    list.forEach((c) => { seen += 1; if (c.box >= LEARNED_BOX) learned += 1; if (c.box >= 5) fixed += 1; });
    return { seen, learned, training: seen - learned, fresh: (idxs ? idxs.length : N) - seen, fixed };
  }
  const coreIdx = Array.from({ length: CORE }, (_, i) => i);
  function coreCounts() { return counts(coreIdx); }

  /* ── Frases prontas: o mesmo agendamento, com chave "etapa.n" ── */
  function pcard(id) { return ensure(state.pcards[id] || null); }
  function pintroduce(id) {
    if (state.pcards[id]) return;
    const c = fresh();
    c.q = "learn"; c.due = now() + LEARN_STEPS[0] * MIN;
    state.pcards[id] = c;
  }
  function pquiz(id, ok) { pintroduce(id); quizCard(state.pcards[id], ok); }
  function pgrade(id, g) { pintroduce(id); apply(state.pcards[id], g); }
  function pintervalLabel(id, g) { return label(state.pcards[id] || null, g); }
  function pstatus(id) {
    const c = state.pcards[id];
    if (!c) return "new";
    return c.box >= LEARNED_BOX ? "learned" : "training";
  }
  function pdueIds(limit) {
    const t = now();
    const list = Object.keys(state.pcards)
      .filter((k) => state.pcards[k].due <= t)
      .sort((a, b) => state.pcards[a].due - state.pcards[b].due);
    return typeof limit === "number" ? list.slice(0, limit) : list;
  }
  function pcounts(ids) {
    let seen = 0, learned = 0;
    const list = ids ? ids.map((k) => state.pcards[k]).filter(Boolean) : Object.values(state.pcards);
    list.forEach((c) => { seen += 1; if (c.box >= LEARNED_BOX) learned += 1; });
    return { seen, learned };
  }

  /* ── Cards do Anki por chave: "w:12" (palavra) ou "p:comida.3" (frase) ── */
  const mapOf = (k) => (k[0] === "w" ? state.cards : state.pcards);
  const idOf = (k) => (k[0] === "w" ? +k.slice(2) : k.slice(2));
  function ak(k) { return ensure(mapOf(k)[idOf(k)] || null); }
  function akGrade(k, g) {
    const m = mapOf(k), id = idOf(k);
    if (!m[id]) m[id] = fresh();
    return apply(m[id], g);
  }
  function akLabel(k, g) { return label(mapOf(k)[idOf(k)] || null, g); }
  /* Para desfazer: cópia do card antes da resposta (ou null, se era novo). */
  function akSnap(k) { const c = mapOf(k)[idOf(k)]; return c ? JSON.parse(JSON.stringify(c)) : null; }
  function akRestore(k, snap) { const m = mapOf(k), id = idOf(k); if (snap) m[id] = snap; else delete m[id]; }
  /* Fila do Anki: aprendendo (vencidos) → revisões vencidas → novas (até o limite do dia) → aprendendo adiantado. */
  function akCounts(keys) {
    const t = now();
    let fresh = 0, learn = 0, due = 0;
    keys.forEach((k) => {
      const c = ak(k);
      if (!c || c.q === "new") fresh += 1;
      else if (c.q === "review") { if (c.due <= t) due += 1; }
      else if (c.due <= t + LEARN_AHEAD) learn += 1;
    });
    return { fresh: Math.min(fresh, akNewLeft()), unseen: fresh, learn, due };
  }
  function akNext(keys, opts) {
    const t = now();
    const skip = opts && opts.skip;
    const newOk = !(opts && opts.noNew) && akNewLeft() > 0;
    let learn = null, rev = null, nw = null, ahead = null;
    keys.forEach((k) => {
      const c = ak(k);
      if (!c || c.q === "new") { if (newOk && !nw) nw = k; return; }
      if (c.q === "review") { if (c.due <= t && (!rev || c.due < ak(rev).due)) rev = k; return; }
      if (c.due <= t) { if (!learn || c.due < ak(learn).due) learn = k; }
      else if (c.due <= t + LEARN_AHEAD && (!ahead || c.due < ak(ahead).due)) ahead = k;
    });
    const order = [learn, rev, nw, ahead].filter(Boolean);
    return order.find((k) => k !== skip) || order[0] || null;
  }
  /* Tempo até o próximo card de aprendizado (em minutos), para a tela de parabéns. */
  function akNextIn(keys) {
    const t = now();
    let best = null;
    keys.forEach((k) => { const c = ak(k); if (c && c.q !== "new" && c.due > t && (best === null || c.due < best)) best = c.due; });
    return best === null ? null : Math.ceil((best - t) / MIN);
  }
  /* Registro do dia: novas e revisões feitas nos cards, limite de novas e "estudar mais novas". */
  function akDay() {
    const k = dayKey(now());
    if (!state.anki || state.anki.day !== k) state.anki = { day: k, fresh: 0, rev: 0, extra: 0, again: 0 };
    return state.anki;
  }
  function akNewLeft() { const d = akDay(); return Math.max(0, (state.settings.ankiNew || 20) + d.extra - d.fresh); }
  function akLog(wasNew, g, sign) { const d = akDay(); const s = sign || 1; if (wasNew) d.fresh += s; else d.rev += s; if (g === "again") d.again += s; }
  function akMore(n) { akDay().extra += n; }
  /* Previsão: quantos cards vencem até o fim de amanhã (sem contar os de hoje). */
  function akForecast(keys) {
    const end = dayStart(now()) + 2 * DAY;
    const today = now();
    let n = 0;
    keys.forEach((k) => { const c = ak(k); if (c && c.q !== "new" && c.due > today && c.due <= end) n += 1; });
    return n;
  }
  /* Maturidade, como nas estatísticas do Anki: aprendendo, jovens (menos de 21 dias) e maduras. */
  function akMaturity(keys) {
    const out = { fresh: 0, learn: 0, young: 0, mature: 0 };
    keys.forEach((k) => { const c = ak(k); if (!c || c.q === "new") out.fresh += 1; else if (c.q !== "review") out.learn += 1; else if (c.ivl >= 21) out.mature += 1; else out.young += 1; });
    return out;
  }

  function boxCounts() {
    const out = [0, 0, 0, 0, 0];
    Object.values(state.cards).forEach((c) => { out[c.box - 1] += 1; });
    return out;
  }
  function accuracy() {
    let ok = 0, bad = 0;
    Object.values(state.cards).forEach((c) => { ok += c.ok; bad += c.bad; });
    return ok + bad ? Math.round((ok / (ok + bad)) * 100) : 0;
  }

  /* ───────── Cronômetro do intensivo ───────── */
  function startSession() {
    if (!state.session.startedAt) { state.session.startedAt = now(); state.session.lastBreakEnd = now(); save(); }
  }
  function elapsedMin() {
    const s = state.session.startedAt;
    return s ? Math.max(0, Math.floor((now() - s) / MIN)) : 0;
  }
  function sinceBreakMin() {
    const s = state.session.lastBreakEnd || state.session.startedAt;
    return s ? Math.floor((now() - s) / MIN) : 0;
  }
  function breakDue() { return !!state.session.startedAt && sinceBreakMin() >= BREAK_EVERY && counts().learned < N; }
  function logBreak(startAt) {
    state.session.breaks.push({ at: startAt, min: Math.round((now() - startAt) / MIN) });
    state.session.lastBreakEnd = now();
    save();
  }
  /* Quantas palavras aprendidas seria o ritmo ideal neste momento das 8 horas. */
  function paceTarget() { return Math.min(CORE, Math.round((Math.min(elapsedMin(), SESSION_MIN) / SESSION_MIN) * CORE)); }
  /* Série de aprendizado para o gráfico: [minuto, total aprendido]. */
  function learnedSeries() {
    const s = state.session.startedAt;
    if (!s) return [];
    return Object.values(state.cards).filter((c) => c.learnedAt).map((c) => Math.max(0, (c.learnedAt - s) / MIN)).sort((a, b) => a - b).map((m, k) => [m, k + 1]);
  }

  /* ───────── Backup ───────── */
  function exportJSON() { return JSON.stringify(state); }
  function importJSON(text) {
    const data = JSON.parse(text);
    if (!data || typeof data !== "object" || !("cards" in data) || !("nodes" in data)) throw new Error("formato");
    delete data.meta;
    state = merge(data);
    save();
  }
  function reset(keepProfile) {
    const p = state.profile, s = state.settings;
    state = blank();
    if (keepProfile) { state.profile = p; state.settings = s; }
    save();
  }

  window.Store = {
    get state() { return state; },
    get storageOk() { return storageOk; },
    save, persist, snapshot, replace, reset, exportJSON, importJSON, markStudiedUpTo, nextTobe, tobeCount,
    N, CORE, RS, ROUNDS, PER_BLOCK, BLOCKS, SESSION_MIN, BREAK_EVERY, BREAK_MIN, LEARNED_BOX, LEARN_STEPS,
    ak, akGrade, akLabel, akSnap, akRestore, akCounts, akNext, akNextIn, akNewLeft, akLog, akMore, akDay, akForecast, akMaturity,
    coreCounts, pcard, pintroduce, pquiz, pgrade, pintervalLabel, pstatus, pdueIds, pcounts,
    word, roundRange, blockOfRound, blockRange, nodeIds, isDone, nextId,
    card, introduce, quiz, grade, intervalLabel, dueIds, leftIds, nextDueIn, status, counts, boxCounts, accuracy,
    startSession, elapsedMin, sinceBreakMin, breakDue, logBreak, paceTarget, learnedSeries
  };
})();
