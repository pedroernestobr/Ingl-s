/* Estado do intensivo, repetição espaçada em minutos e cronômetro de 8 horas.
   Tudo fica no navegador (localStorage); nada é enviado para servidor. */
(function () {
  "use strict";

  const KEY = "intensivo500:v1";
  const W = window.WORDS;
  const N = W.length;            // 500
  const RS = 25;                 // palavras por rodada
  const ROUNDS = N / RS;         // 20
  const PER_BLOCK = 5;           // rodadas por bloco
  const BLOCKS = ROUNDS / PER_BLOCK; // 4
  const SESSION_MIN = 480;       // 8 horas
  const BREAK_EVERY = 50;        // minutos de estudo antes da pausa
  const BREAK_MIN = 10;          // duração da pausa
  const MIN = 60000;

  /* Caixas de Leitner com intervalos em minutos (para um dia intensivo).
     Caixa 1: 1 min · 2: 10 min · 3: 30 min · 4: 2 h · 5: amanhã.
     Uma palavra conta como "aprendida" a partir da caixa 3: foi lembrada duas vezes, com 10 min de intervalo. */
  const INTERVALS = [0, 1, 10, 30, 120, 1440];
  const LEARNED_BOX = 3;

  function blank() {
    return {
      version: 1,
      profile: null,
      settings: { rate: 0.9, voiceURI: "", theme: "light", autoplay: true },
      session: { startedAt: null, lastBreakEnd: null, breaks: [], finishedAt: null },
      cards: {},     // índice → { box, due, ok, bad, seen, learnedAt }
      notes: {},     // índice → anotação
      pad: "",       // caderno livre
      nodes: {},     // "r1".."r20", "c1".."c4" → { at, correct, total, min }
      talks: 0,      // conversas feitas
      spoken: 0      // frases ditas em voz alta
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      const data = JSON.parse(raw);
      const base = blank();
      return Object.assign(base, data, {
        settings: Object.assign(base.settings, data.settings || {}),
        session: Object.assign(base.session, data.session || {})
      });
    } catch (e) {
      return blank();
    }
  }

  let state = load();
  let storageOk = true;
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); storageOk = true; }
    catch (e) { storageOk = false; }
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
  function isDone(id) { return !!state.nodes[id]; }
  function nextId() { return nodeIds().find((id) => !isDone(id)) || null; }

  /* ───────── Repetição espaçada ───────── */
  const now = () => Date.now();
  function card(i) { return state.cards[i] || null; }

  function introduce(i) {
    if (!state.cards[i]) state.cards[i] = { box: 1, due: now() + INTERVALS[1] * MIN, ok: 0, bad: 0, seen: now(), learnedAt: null };
  }

  function setBox(c, box) {
    c.box = Math.max(1, Math.min(5, box));
    c.due = now() + INTERVALS[c.box] * MIN;
    if (c.box >= LEARNED_BOX && !c.learnedAt) c.learnedAt = now();
  }

  /* Exercício logo depois de aprender: acerto leva da caixa 1 para a 2; erro volta para a 1. */
  function quiz(i, ok) {
    introduce(i);
    const c = state.cards[i];
    if (ok) { c.ok += 1; if (c.box < 2) setBox(c, 2); }
    else { c.bad += 1; setBox(c, 1); }
  }

  /* Revisão: "again" (errei), "hard" (difícil), "easy" (acertei). */
  function nextBox(c, g) {
    if (g === "again") return 1;
    if (g === "hard") return c.box;
    return Math.min(5, c.box + 1);
  }
  function grade(i, g) {
    introduce(i);
    const c = state.cards[i];
    if (g === "again") c.bad += 1; else c.ok += 1;
    if (g === "hard") { c.due = now() + Math.max(1, Math.round(INTERVALS[c.box] / 2)) * MIN; return; }
    setBox(c, nextBox(c, g));
  }
  function intervalLabel(i, g) {
    const c = card(i) || { box: 1 };
    const m = g === "hard" ? Math.max(1, Math.round(INTERVALS[c.box] / 2)) : INTERVALS[nextBox(c, g)];
    if (m >= 1440) return "amanhã";
    if (m >= 60) return (m / 60) + " h";
    return m + " min";
  }

  function dueIds(limit, exclude) {
    const t = now();
    const ex = exclude ? new Set(exclude) : null;
    const list = Object.keys(state.cards).map(Number)
      .filter((i) => state.cards[i].due <= t && state.cards[i].box < 5 && !(ex && ex.has(i)))
      .sort((a, b) => state.cards[a].due - state.cards[b].due);
    return typeof limit === "number" ? list.slice(0, limit) : list;
  }
  /* Palavras já vistas que ainda não foram aprendidas, das mais urgentes para as menos. */
  function leftIds(limit) {
    const list = Object.keys(state.cards).map(Number)
      .filter((i) => state.cards[i].box < LEARNED_BOX)
      .sort((a, b) => state.cards[a].due - state.cards[b].due);
    return typeof limit === "number" ? list.slice(0, limit) : list;
  }
  function nextDueIn() {
    const t = now();
    const future = Object.values(state.cards).filter((c) => c.box < 5 && c.due > t).map((c) => c.due - t);
    return future.length ? Math.ceil(Math.min(...future) / MIN) : null;
  }

  function status(i) {
    const c = card(i);
    if (!c) return "new";
    return c.box >= LEARNED_BOX ? "learned" : "training";
  }
  function counts() {
    let seen = 0, learned = 0, fixed = 0;
    Object.values(state.cards).forEach((c) => { seen += 1; if (c.box >= LEARNED_BOX) learned += 1; if (c.box >= 5) fixed += 1; });
    return { seen, learned, training: seen - learned, fresh: N - seen, fixed };
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
  function paceTarget() { return Math.min(N, Math.round((Math.min(elapsedMin(), SESSION_MIN) / SESSION_MIN) * N)); }
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
    const base = blank();
    state = Object.assign(base, data, { settings: Object.assign(base.settings, data.settings || {}), session: Object.assign(base.session, data.session || {}) });
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
    save, reset, exportJSON, importJSON,
    N, RS, ROUNDS, PER_BLOCK, BLOCKS, SESSION_MIN, BREAK_EVERY, BREAK_MIN, INTERVALS, LEARNED_BOX,
    word, roundRange, blockOfRound, blockRange, nodeIds, isDone, nextId,
    card, introduce, quiz, grade, intervalLabel, dueIds, leftIds, nextDueIn, status, counts, boxCounts, accuracy,
    startSession, elapsedMin, sinceBreakMin, breakDue, logBreak, paceTarget, learnedSeries
  };
})();
