/* Intensivo 1000 — as 500 palavras essenciais em 8 horas e mais 500 por área, em etapas com frases e situações.
   Telas, navegação, trilhas, etapas e o player de estudo. */
(function () {
  "use strict";

  const S = window.Store;
  const SP = window.Speech;
  const BLOCKS = window.BLOCKS;
  const ROUND_NAMES = window.ROUND_NAMES;
  const MIN = 60000;

  /* Etapas por área (js/areas.js, js/dodid.js, js/situacoes.js), na ordem das partes. */
  const PARTS = window.ETAPA_PARTS || [];
  const DODID = window.DODID || [];
  const SOM = window.SOM || [];
  const ETAPAS = PARTS.flatMap((p) => (window.ETAPAS || []).filter((e) => e.part === p.key));
  ETAPAS.forEach((e, k) => {
    e.n = k + 1;
    e.partIdx = PARTS.findIndex((p) => p.key === e.part);
    if (e.kind === "dialog") {
      e.mine = e.lines.filter((l) => l[0] === "v").map((l) => [l[1], l[2]]);
      e.phrases = e.mine.concat(e.extra || []);
    }
  });
  const etapaById = Object.fromEntries(ETAPAS.map((e) => [e.id, e]));

  /* ───────── Utilitários ───────── */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const plural = (n, one, many) => n + " " + (n === 1 ? one : many);
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const dot = (t) => (/[.?!…:]$/.test(t) ? t : t + ".");
  const isEnglish = (t) => /^[A-Za-z0-9 ,.'?!’_\-]+$/.test(t);
  const haptic = (ms) => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* ignora */ } };
  const hm = (m) => Math.floor(m / 60) + ":" + String(m % 60).padStart(2, "0");
  const clock = (ms) => new Date(ms).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  /* Conversa com IA: disponível quando o app roda como página do Claude. */
  let AI = null;
  let aiBlocked = false;
  if (window.claude && typeof window.claude.use === "function") {
    window.claude.use("sample").then((s) => { AI = s || null; }).catch(() => {});
  }
  const aiReady = () => !!AI && !aiBlocked;

  /* ───────── Ícones no estilo SF Symbols ───────── */
  const ICON = {
    route: '<circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="5" r="2.2"/><path d="M8.2 19H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.8"/>',
    cards: '<rect x="3" y="7" width="13" height="14" rx="2.5"/><path d="M8 3.5h10.5A2.5 2.5 0 0 1 21 6v11"/>',
    book: '<path d="M12 6.5C10 5 7 4.5 3.5 5v14c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5z"/><path d="M12 6.5v14"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    flame: '<path d="M12 21c4 0 7-2.7 7-6.6 0-3.1-2-5.4-3.6-7-.4 2-1.5 3.3-2.9 3.9C12.8 7.6 11 4.6 8.5 3c.3 3-1.7 5.1-3 7A7.2 7.2 0 0 0 5 14.4C5 18.3 8 21 12 21z"/>',
    speaker: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
    play: '<path d="M7.5 4.8v14.4a.8.8 0 0 0 1.2.7l11.2-7.2a.8.8 0 0 0 0-1.4L8.7 4.1a.8.8 0 0 0-1.2.7z" fill="currentColor" stroke="none"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    checkFill: '<circle cx="12" cy="12" r="10" fill="currentColor" stroke="none"/><path d="M7.5 12.3l3 3 6-6.3" stroke="#fff" stroke-width="2.2"/>',
    xFill: '<circle cx="12" cy="12" r="10" fill="currentColor" stroke="none"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="#fff" stroke-width="2.2"/>',
    chevL: '<path d="M15 5l-7 7 7 7"/>',
    chevUD: '<path d="M8 9.5l4-4 4 4M8 14.5l4 4 4-4"/>',
    pencil: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4.5" height="6.5" rx="1.5"/><rect x="16.5" y="14" width="4.5" height="6.5" rx="1.5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
    repeat: '<path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5"/><path d="M20 3.5v5h-5"/><path d="M20 12a8 8 0 0 1-13.7 5.6L4 15.5"/><path d="M4 20.5v-5h5"/>',
    layers: '<path d="M12 3 2.5 8 12 13l9.5-5z"/><path d="M2.5 12.5 12 17.5l9.5-5"/><path d="M2.5 16.5 12 21.5l9.5-5"/>',
    zap: '<path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12z"/>',
    textformat: '<path d="M4 7V5h16v2M9 19h6M12 5v14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    shuffle: '<path d="M3 7h3.5c4 0 6 10 10 10H21M3 17h3.5c1.6 0 2.8-1.5 3.9-3.3M13.6 10.3C14.7 8.5 15.9 7 17.5 7H21M18 4l3 3-3 3M18 14l3 3-3 3"/>',
    wave: '<path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2"/>',
    person: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4.5a3 3 0 0 0 3.5 4M16 6h3.5a3 3 0 0 1-3.5 4M12 13v4M8 21h8M9.5 17h5v4h-5z"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
    star: '<path d="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1.03 6L12 17l-5.38 2.85 1.03-6L3.3 9.6l6-.9z" fill="currentColor" stroke="none"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10.5" rx="2.5" fill="currentColor" stroke="none"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    chat: '<path d="M4 5.5h16v10H9l-4 3.5v-3.5H4z"/>',
    send: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    coffee: '<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3v3M12 3v3"/>',
    brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h0a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3h0a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    cloud: '<path d="M7 18.5a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 17.9 11a3.75 3.75 0 0 1-.4 7.5z"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
    hash: '<path d="M9.5 4 7.5 20M16.5 4l-2 16M4.5 9h15.5M4 15h15.5"/>',
    palette: '<path d="M12 3a9 9 0 0 0 0 18c1.4 0 2-1 2-2s-.8-1.6-.8-2.6c0-1.2 1-2.1 2.2-2.1H18a3 3 0 0 0 3-3C21 6.6 17 3 12 3z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10" cy="7" r="1.2"/><circle cx="15" cy="7.5" r="1.2"/>',
    apple: '<path d="M12 7.5c-1.5-1-5-1.3-6.3 1.7-1.4 3.3.6 8.6 3 10.6 1.2 1 2.2.6 3.3.1 1.1.5 2.1.9 3.3-.1 2.4-2 4.4-7.3 3-10.6C17 6.2 13.5 6.5 12 7.5z"/><path d="M12 7.5c0-2 1-3.5 3-4"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    hand: '<path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V12M11 11V5a1.5 1.5 0 0 1 3 0v6M14 11V6.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-.5a6 6 0 0 1-5-2.7L3 15.5a1.5 1.5 0 0 1 2.5-1.6L8 16"/>',
    question: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7M12 17h.01"/>',
    thumb: '<path d="M7 11v9H4v-9zM7 11l4-7c1.5 0 2.5 1.2 2.2 2.7L12.5 10H18a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 16.8 20H7"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4"/>',
    fork: '<path d="M7 3v8a2 2 0 0 0 2 2v8M5 3v5M9 3v5M17 21V3c-2 1-3 4-3 7s1 3 3 3"/>',
    bag: '<path d="M5 8h14l-1 12.5H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    shirt: '<path d="M8 3.5 3.5 6 5 10l2.5-1v11.5h9V9l2.5 1 1.5-4L16 3.5c-.5 1.5-2 2.5-4 2.5S8.5 5 8 3.5z"/>',
    plane: '<path d="M21 15.5 13 11V5.5a1.5 1.5 0 0 0-3 0V11l-8 4.5V17l8-2.5V19l-2.5 1.8V22l4-1 4 1v-1.2L13 19v-4.5l8 2.5z"/>',
    bed: '<path d="M3 18V6M3 14h18v4M21 14v-2.5a2.5 2.5 0 0 0-2.5-2.5H11v5"/><circle cx="7" cy="11" r="2"/>',
    map: '<path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6z"/><path d="M9 4v14M15 6v14"/>',
    siren: '<path d="M7 18v-6a5 5 0 0 1 10 0v6"/><path d="M5 18h14v3H5zM12 3v2M4.2 6.2l1.4 1.4M19.8 6.2l-1.4 1.4"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/>',
    people: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 4.8a3.2 3.2 0 0 1 0 6.4M17.5 14.2A6 6 0 0 1 21 20"/>',
    smile: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/>',
    pulse: '<path d="M3 12h4l2.5-6 4 12 2.5-6H21"/>',
    house: '<path d="M4 10.5 12 4l8 6.5V20h-5.5v-6h-5v6H4z"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18"/>',
    rocket: '<path d="M14 4c3-1.5 6-1 6-1s.5 3-1 6l-6 6-5-5z"/><path d="M8 10H5l-2 3 4 1M14 16v3l-3 2-1-4M15.5 8.5h.01"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
    money: '<rect x="2.5" y="6" width="19" height="12" rx="2.5"/><circle cx="12" cy="12" r="2.8"/><path d="M6 9.5v5M18 9.5v5"/>',
    music: '<path d="M9 18V5.5l11-2V16"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
    dumbbell: '<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>',
    passport: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><circle cx="12" cy="10.5" r="3"/><path d="M9 16.5h6"/>',
    car: '<path d="M5 16.5V12l2-5h10l2 5v4.5"/><path d="M3.5 12h17v4.5h-17z"/><circle cx="7.5" cy="18" r="1.6"/><circle cx="16.5" cy="18" r="1.6"/>',
    pill: '<rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-45 12 12)"/><path d="m9.5 9.5 5 5"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>'
  };
  const icon = (name, cls) => '<svg class="icon ' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true">' + ICON[name] + "</svg>";
  const chev = () => '<svg class="chev" viewBox="0 0 8 13" aria-hidden="true"><path d="M1.5 1.5 6.5 6.5l-5 5"/></svg>';
  const sq = (name) => '<span class="sq">' + icon(name) + "</span>";

  /* Célula de lista agrupada. Textos em title/sub/value já devem vir escapados. */
  function cell(o) {
    const tag = o.href ? "a" : o.action ? "button" : "div";
    let attrs = "";
    if (o.href) attrs += ' href="' + o.href + '"';
    if (o.action) attrs += ' type="button" data-action="' + o.action + '"';
    if (o.attrs) attrs += " " + o.attrs;
    const tappable = o.href || o.action;
    return "<" + tag + ' class="cell' + (tappable ? " tappable" : "") + (o.cls ? " " + o.cls : "") + '"' + attrs + ">" +
      (o.lead || (o.icon ? sq(o.icon) : "")) +
      (o.raw != null ? o.raw : '<span class="cell-body"><span class="cell-title"' + (o.lang ? ' lang="' + o.lang + '"' : "") + ">" + o.title + "</span>" + (o.sub ? '<span class="cell-sub">' + o.sub + "</span>" : "") + "</span>") +
      (o.value != null && o.value !== "" ? '<span class="cell-value">' + o.value + "</span>" : "") +
      (o.trail || "") +
      (o.chevron ? chev() : "") +
      "</" + tag + ">";
  }
  function section(header, body, footer) {
    return '<section class="section">' + (header ? '<h2 class="section-header">' + header + "</h2>" : "") + body + (footer ? '<p class="section-footer">' + footer + "</p>" : "") + "</section>";
  }
  const list = (items, cls, id) => '<div class="list' + (cls ? " " + cls : "") + '"' + (id ? ' id="' + id + '"' : "") + ">" + items.join("") + "</div>";
  const speakBtn = (text, cls, label) => '<button class="speak ' + (cls || "") + '" data-action="speak" data-text="' + esc(text) + '" aria-label="' + esc(label || "Ouvir") + '">' + icon("speaker") + "</button>";

  function applyTheme() {
    const t = S.state.settings.theme;
    document.documentElement.setAttribute("data-theme", t === "dark" || t === "auto" ? t : "light");
  }

  /* ───────── Aviso e alerta ───────── */
  let toastTimer;
  function toast(msg) {
    const old = $("#toast");
    if (old) old.remove();
    const el = document.createElement("div");
    el.id = "toast";
    el.className = "toast";
    el.setAttribute("role", "status");
    el.textContent = msg;
    document.body.appendChild(el);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.remove(); }, 2600);
  }

  function alertDialog(opts) {
    return new Promise((resolve) => {
      const wrap = document.createElement("div");
      wrap.className = "alert-backdrop";
      const cancel = opts.cancel || "Cancelar";
      const ok = opts.ok || "OK";
      const stacked = cancel.length + ok.length > 16;
      const okBtn = '<button data-m="yes" class="' + (opts.danger ? "destructive" : "") + '">' + esc(ok) + "</button>";
      const noBtn = '<button data-m="no" class="preferred">' + esc(cancel) + "</button>";
      wrap.innerHTML =
        '<div class="alert" role="alertdialog" aria-modal="true" aria-labelledby="alert-title">' +
        '<div class="alert-body"><h2 class="alert-title" id="alert-title">' + esc(opts.title) + "</h2>" +
        (opts.text ? '<p class="alert-msg">' + esc(opts.text) + "</p>" : "") + "</div>" +
        '<div class="alert-actions' + (stacked ? " stacked" : "") + '">' + (stacked ? okBtn + noBtn : noBtn + okBtn) + "</div></div>";
      const done = (v) => { wrap.remove(); document.removeEventListener("keydown", onKey, true); resolve(v); };
      const onKey = (e) => { if (e.key === "Escape") { e.stopPropagation(); done(false); } };
      wrap.addEventListener("click", (e) => { const b = e.target.closest("[data-m]"); if (b) done(b.dataset.m === "yes"); });
      document.addEventListener("keydown", onKey, true);
      document.body.appendChild(wrap);
      $('[data-m="no"]', wrap).focus();
    });
  }

  /* ───────── Navegação ───────── */
  const NAV = [
    { id: "ouvir", label: "Ouvir", icon: "headphones" },
    { id: "conversar", label: "Conversar", icon: "chat" },
    { id: "revisar", label: "Cards", icon: "cards" },
    { id: "caderno", label: "Caderno", icon: "pencil" },
    { id: "mais", label: "Mais", icon: "grid" }
  ];

  function renderShell() {
    $("#app").innerHTML =
      '<div class="app">' +
      '<nav class="sidebar" aria-label="Navegação principal"><p class="side-title title2">Intensivo 1000</p>' +
      NAV.slice(0, 4).concat([{ id: "semana", label: "Plano de 7 dias", icon: "calendar" }, { id: "intensivo", label: "Intensivo", icon: "route" }, { id: "etapas", label: "Etapas", icon: "grid" }, { id: "palavras", label: "Palavras", icon: "textformat" }, { id: "tobe", label: "To be", icon: "layers" }, { id: "metodo", label: "Método", icon: "book" }, { id: "ajustes", label: "Ajustes", icon: "gear" }]).map((n) => '<a class="side-link" data-nav="' + n.id + '" href="#' + n.id + '">' + icon(n.icon) + "<span>" + n.label + '</span><span class="badge" data-badge="' + n.id + '" hidden></span></a>').join("") +
      '<p class="side-foot footnote secondary" id="side-foot"></p></nav>' +
      '<div class="main"><div class="main-inner">' +
      '<header class="navbar" id="navbar"><div class="navbar-inner"><div class="nav-left" id="nav-left"></div><div class="nav-title" id="nav-title"></div><div class="nav-right" id="nav-right"></div></div></header>' +
      '<main id="view" class="view" tabindex="-1"></main>' +
      "</div></div>" +
      '<nav class="tabbar" aria-label="Navegação principal">' +
      NAV.map((n) => '<a class="tab" data-nav="' + n.id + '" href="#' + n.id + '">' + icon(n.icon) + "<span>" + n.label + '</span><span class="badge" data-badge="' + n.id + '" hidden></span></a>').join("") +
      "</nav></div>";
  }

  /* Telas visitadas nesta sessão (a última é a atual). Sustenta o botão Voltar de cada tela. */
  const VIEW_LABEL = { ouvir: "Ouvir", conversar: "Conversar", mais: "Mais", semana: "Semana", intensivo: "Intensivo", etapas: "Etapas", tobe: "To be", palavras: "Palavras", revisar: "Cards", caderno: "Caderno", metodo: "Método", ajustes: "Ajustes" };
  let trail = [];
  function trackView(key) {
    const i = trail.indexOf(key);
    if (i >= 0) trail = trail.slice(0, i + 1);
    else trail.push(key);
    if (trail.length > 30) trail = trail.slice(-30);
  }
  function labelOf(key) {
    if (key.startsWith("etapa-")) { const e = etapaById[key.slice(6)]; return e ? e.name : "Etapas"; }
    if (key.startsWith("dia-")) return "Dia " + key.slice(4);
    if (key.startsWith("deck-")) { const d = decks().byId[key.slice(5)]; return d ? d.name : "Cards"; }
    return VIEW_LABEL[key] || "Voltar";
  }
  function backFor(key) {
    if (key === "ouvir") return null;
    let prev = trail.length > 1 ? trail[trail.length - 2] : key.startsWith("deck-") ? "revisar" : "ouvir";
    if (prev === key) prev = "ouvir";
    return ["#" + prev, labelOf(prev)];
  }

  /* Qual aba fica acesa: Ouvir, Conversar, Cards, Caderno ou Mais. */
  function tabOf(r) {
    if (r.view === "deck") return "revisar";
    if (r.view === "etapa") { const e = etapaById[r.id]; return e && (e.kind === "listen" || e.id === "som") ? "ouvir" : e && e.kind === "dialog" ? "conversar" : "mais"; }
    return ["ouvir", "conversar", "revisar", "caderno"].includes(r.view) ? r.view : "mais";
  }

  function updateChrome(r, meta) {
    const navId = tabOf(r);
    $$("[data-nav]").forEach((a) => { if (a.dataset.nav === navId || a.dataset.nav === r.view) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    const ac = S.akCounts(decks().all.keys);
    const due = ac.learn + ac.due;
    $$('[data-badge="revisar"]').forEach((b) => { b.hidden = due === 0; b.textContent = due > 99 ? "99+" : due; });
    $("#navbar").hidden = !!meta.hideNav;
    $("#nav-title").textContent = meta.title;
    const back = meta.back || backFor(r.key);
    $("#nav-left").innerHTML = back ? '<a class="back-btn" href="' + back[0] + '" aria-label="Voltar para ' + esc(back[1]) + '">' + icon("chevL") + esc(back[1]) + "</a>" : "";
    const c = S.counts();
    const foot = $("#side-foot");
    if (foot) foot.innerHTML = c.seen + " de " + S.N + " palavras estudadas · " + c.learned + " fixadas.<br>" + esc(syncText()) + ".";
    onScroll();
  }

  function onScroll() {
    const nb = $("#navbar");
    if (nb) nb.classList.toggle("scrolled", window.scrollY > 36);
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  function route() {
    const h = decodeURIComponent((location.hash || "").slice(1));
    if (h.startsWith("etapa-") && etapaById[h.slice(6)]) return { view: "etapa", id: h.slice(6), key: h };
    if (/^dia-[1-7]$/.test(h)) return { view: "dia", day: +h.slice(4) - 1, key: h };
    if (h.startsWith("deck-") && decks().byId[h.slice(5)]) return { view: "deck", deck: h.slice(5), key: h };
    const view = VIEWS[h] && !["etapa", "dia", "deck"].includes(h) ? h : "ouvir";
    return { view, key: view };
  }

  function render() {
    applyTheme();
    if (!S.state.profile) { renderOnboarding(); return; }
    if (!$("#view")) renderShell();
    const r = route();
    const out = VIEWS[r.view](r);
    trackView(r.key);
    closePopover();
    $("#view").innerHTML = out.html;
    updateChrome(r, out.meta);
    if (out.after) out.after();
  }

  function initial() {
    const n = (S.state.profile && S.state.profile.name) || "";
    return n ? esc(n.trim().charAt(0).toUpperCase()) : icon("person", "icon-sm");
  }
  function ltHeader(title, opts) {
    opts = opts || {};
    return '<header class="lt-header' + (opts.cls ? " " + opts.cls : "") + '"><div>' +
      (opts.eyebrow ? '<p class="eyebrow">' + opts.eyebrow + "</p>" : "") +
      '<h1 class="large-title two-tone">' + title + (opts.second ? '<span class="second">' + opts.second + "</span>" : "") + "</h1>" +
      (opts.sub ? '<p class="lt-sub">' + opts.sub + "</p>" : "") + "</div>" +
      (opts.avatar === false ? "" : '<a class="avatar" href="#ajustes" aria-label="Ajustes">' + initial() + "</a>") +
      "</header>";
  }

  /* ───────── Boas-vindas ───────── */
  function renderOnboarding() {
    $("#app").innerHTML =
      '<div class="welcome"><div class="welcome-inner">' +
      '<div class="app-icon" aria-hidden="true">' + icon("headphones") + "</div>" +
      '<h1 class="h1 center two-tone">Entenda o inglês.<span class="second">Do jeito que o americano fala.</span></h1>' +
      '<div class="features">' +
      [["headphones", "Ouvido primeiro", "Frases reais, no ritmo do americano. Você ouve antes de ler."],
        ["pencil", "Escreva como ouviu", "Com letras do português, tipo “uárâzit mín”. O app mostra o que é em inglês e o que significa."],
        ["chat", "Converse", "Situações do dia a dia: ouça a outra pessoa e responda em voz alta."],
        ["cards", "Cards como no Anki", "Cada frase volta para revisão na hora certa."]]
        .map((f) => '<div class="feature-row"><span class="ficon">' + icon(f[0]) + '</span><div><p class="headline">' + f[1] + '</p><p class="subhead secondary">' + f[2] + "</p></div></div>").join("") +
      "</div>" +
      '<form id="onboard-form" class="view" novalidate style="gap:24px">' +
      section("", list(['<label class="cell" for="ob-name"><span class="cell-body"><span class="cell-title">Seu nome</span></span><input class="cell-input" id="ob-name" autocomplete="given-name" placeholder="Opcional" maxlength="40"></label>']),
        "Sem cadastro. Seu progresso fica salvo neste aparelho. O cronômetro de 8 horas só começa quando você mandar.") +
      '<button class="btn btn-filled btn-large" type="submit">Continuar</button>' +
      "</form>" +
      (window.Sync && Sync.inClaude ? "" : section("Já estudou em outro aparelho?", list(['<div class="cell stack"><label class="cell-title" for="ob-key">Cole o seu código de sincronização</label><div class="row-btns"><input class="note-box mono" id="ob-key" placeholder="0000-…" autocomplete="off" style="flex:1;min-width:0"><button class="btn" data-action="sync-use" data-field="#ob-key">Entrar</button></div></div>']),
        "O código fica em Ajustes, no aparelho onde você começou.")) +
      "</div></div>";
    $("#onboard-form").addEventListener("submit", (e) => {
      e.preventDefault();
      S.state.profile = { name: $("#ob-name").value.trim(), createdAt: new Date().toISOString() };
      S.save();
      $("#app").innerHTML = "";
      location.hash = "ouvir";
      render();
    });
  }

  /* ═══════════════════════ INTENSIVO ═══════════════════════ */

  const PATH_X = [0, 52, 78, 52, 0, -52, -78];
  const STEP_Y = 96, PAD_Y = 30;
  const TOBE = window.TOBE;
  const TOBE_PARTS = window.TOBE_PARTS;
  const tobeLesson = (id) => TOBE.find((l) => l.id === id);
  const poolOf = (id) => ({ d: DODID, p: SOM }[id[0]] || TOBE);
  const grammarLesson = (id) => poolOf(id).find((l) => l.id === id);
  const trailName = (lid) => ({ d: "Do, does e did", p: "Som real" }[lid[0]] || "Verbo to be");

  function nodeInfo(id) {
    if (id.includes(":")) return etapaInfo(id);
    const n = +id.slice(1);
    if (id[0] === "r") return { kind: "round", n, block: S.blockOfRound(n), title: ROUND_NAMES[n - 1], words: S.roundRange(n), label: "Rodada " + n, est: "20 min" };
    if (id[0] === "c") return { kind: "check", n, block: n, title: "Prova do bloco " + n, words: S.blockRange(n), label: "Prova", est: "10 min" };
    const l = tobeLesson(id);
    return { kind: "tobe", n, title: l.title, sub: l.sub, review: !!l.review, words: [], label: l.review ? "Revisão final" : "Lição " + n, est: l.review ? "8 min" : "6 min" };
  }
  const trailOf = (id) => (id[0] === "t" ? TOBE.map((l) => l.id) : S.nodeIds());
  const nextOf = (id) => (id[0] === "t" ? S.nextTobe() : S.nextId());
  function isLocked(id) {
    if (id.includes(":")) return false;
    const nid = nextOf(id);
    if (!nid || S.isDone(id)) return false;
    const ids = trailOf(id);
    return ids.indexOf(id) > ids.indexOf(nid);
  }
  function nodeState(id, nid) { return S.isDone(id) ? "done" : id === nid ? "current" : "locked"; }
  const learnedIn = (idxs) => idxs.filter((i) => S.status(i) === "learned").length;
  const seenIn = (idxs) => idxs.filter((i) => S.card(i)).length;
  const resumeFor = (id) => (S.state.resumes[id] && !S.isDone(id) ? S.state.resumes[id] : null);
  /* A etapa em andamento mais recente (de qualquer trilha). */
  const latestResume = (prefix) => Object.values(S.state.resumes).filter((r) => !S.isDone(r.id) && (!prefix || r.id[0] === prefix)).sort((x, y) => (y.at || 0) - (x.at || 0))[0] || null;
  const stepsLeft = (r) => (r.steps.length - 1);

  function nextAction() {
    const st = S.state;
    const c = S.coreCounts();
    const due = S.dueIds().length;
    const nid = S.nextId();
    if (!st.session.startedAt) return { label: "Começar o intensivo", action: "start-session" };
    const res = latestResume();
    if (res) {
      const info = nodeInfo(res.id);
      const what = info.etapa ? "a etapa " + info.n + " (" + info.title + ")" : info.kind === "tobe" ? "o to be (" + info.label.toLowerCase() + ")" : info.kind === "round" ? "a rodada " + info.n : "a prova do bloco " + info.n;
      return { label: "Continuar " + what, action: "start", id: res.id, why: "Você parou no passo " + (res.i + 1) + " de " + stepsLeft(res) + ". Continua exatamente de onde saiu." };
    }
    if (due >= 15) return { label: "Revisar " + due + " palavras", action: "review", why: "Revisões vencidas vêm primeiro: é nessa hora que a memória fixa." };
    const roundsDone = S.nodeIds().filter((id) => id[0] === "r" && S.isDone(id)).length;
    const tnext = S.nextTobe();
    if (tnext && S.tobeCount() < Math.floor(roundsDone / 2)) {
      const t = nodeInfo(tnext);
      return { label: "Verbo to be · " + t.label, action: "start", id: tnext, why: t.title + ". Uma lição de gramática a cada 2 rodadas de palavras." };
    }
    if (nid) {
      const info = nodeInfo(nid);
      return info.kind === "round"
        ? { label: "Começar a rodada " + info.n, action: "start", id: nid, why: info.title + " · palavras " + (info.words[0] + 1) + "–" + (info.words[24] + 1) + "." }
        : { label: "Fazer a prova do bloco " + info.n, action: "start", id: nid, why: "30 palavras do bloco: veja em português e diga em inglês." };
    }
    if (tnext) return { label: "Verbo to be · " + nodeInfo(tnext).label, action: "start", id: tnext, why: "Termine a trilha do to be." };
    if (c.learned < S.CORE) return { label: "Maratona final · faltam " + (S.CORE - c.learned), action: "practice-left", why: "Treine as palavras que ainda não fixaram até chegar às 500." };
    return { label: "Ir para as etapas por área", action: "go-etapas", why: "Você fixou as 500 essenciais. Agora: palavras por área, frases prontas e situações." };
  }

  function dashboard() {
    const st = S.state;
    const c = S.coreCounts();
    const el = S.elapsedMin();
    const target = S.paceTarget();
    const diff = c.seen - target;
    const act = nextAction();
    const due = S.dueIds().length;
    const tb = S.tobeCount();
    let pace;
    if (c.learned >= S.CORE) pace = "Você fixou as 500 palavras essenciais.";
    else if (el >= S.SESSION_MIN) pace = "As 8 horas acabaram. Faltam " + (S.CORE - c.learned) + " para fixar: siga na maratona final.";
    else if (el < 15) pace = "Primeiros minutos. Cada palavra estudada já fica registrada; ela fixa depois de duas revisões.";
    else if (diff >= 0) pace = "Você está " + plural(diff, "palavra", "palavras") + " à frente do ritmo das 8 horas.";
    else pace = "Você está " + plural(-diff, "palavra", "palavras") + " atrás do ritmo. Uma rodada agora recupera.";
    const pct = (n) => Math.round((n / S.CORE) * 100);
    const timePct = Math.round((Math.min(el, S.SESSION_MIN) / S.SESSION_MIN) * 100);
    const bar = (label, p, cls, mark) => '<div class="dash-bar"><span class="caption secondary">' + label + '</span><div class="progress ' + (cls || "") + '" role="img" aria-label="' + label + " " + p + '%"><span style="width:' + p + '%"></span>' + (mark != null ? '<i class="target" style="left:' + mark + '%" title="Ritmo ideal agora"></i>' : "") + "</div></div>";
    return '<div class="card dash">' +
      '<div class="dash-stats">' +
      '<div><p class="eyebrow">Estudadas</p><p class="dash-num">' + c.seen + "<small>/" + S.CORE + "</small></p></div>" +
      '<div><p class="eyebrow">Fixadas</p><p class="dash-num">' + c.learned + "<small>/" + S.CORE + "</small></p></div>" +
      '<div><p class="eyebrow">Tempo</p><p class="dash-num"><span data-live="elapsed">' + hm(Math.min(el, 999 * 60)) + "</span><small>/8:00</small></p></div>" +
      "</div>" +
      '<div class="dash-bars">' + bar("Estudadas", pct(c.seen), "good", pct(target)) + bar("Fixadas", pct(c.learned)) + bar("Tempo", timePct) + "</div>" +
      '<p class="subhead secondary" data-live="pace">' + esc(pace) + "</p>" +
      '<button class="btn btn-filled btn-large" data-action="' + act.action + '"' + (act.id ? ' data-id="' + act.id + '" data-force="1"' : "") + ">" + icon("play") + esc(act.label) + "</button>" +
      (act.why ? '<p class="footnote secondary center">' + esc(act.why) + "</p>" : "") +
      (due && act.action !== "review" ? '<button class="btn btn-plain" data-action="review" style="align-self:center">Revisar ' + plural(due, "palavra vencida", "palavras vencidas") + "</button>" : "") +
      list([
        cell({ href: "#tobe", icon: "layers", title: "Verbo to be", sub: "Trilha completa de gramática", value: tb + "/" + TOBE.length, chevron: true }),
        cell({ href: "#etapas", icon: "grid", title: "Etapas por área", sub: "Mais 500 palavras, frases e situações", value: etapasDoneCount() + "/" + ETAPAS.length, chevron: true })
      ], "icons flat") +
      '<p class="footnote tertiary center">Fixada = lembrada duas vezes, com 10 minutos de intervalo. Começou às ' + clock(st.session.startedAt) + " · termina às " + clock(st.session.startedAt + S.SESSION_MIN * MIN) + "</p>" +
      "</div>";
  }

  function startCard() {
    const end = Date.now() + S.SESSION_MIN * MIN;
    return '<div class="card dash">' +
      list([
        cell({ icon: "layers", title: "20 rodadas de 25 palavras", sub: "Cerca de 20 minutos cada, em grupos de 5 palavras." }),
        cell({ icon: "book", title: "Trilha completa do verbo to be", sub: "11 lições curtas, intercaladas com as rodadas." }),
        cell({ icon: "repeat", title: "Cards como no Anki", sub: "1 e 10 minutos para aprender; depois 1 dia, e o intervalo cresce a cada acerto." }),
        cell({ icon: "mic", title: "Pronúncia e conversa", sub: "Repetir em voz alta, shadowing, falar frases" + (aiReady() ? " e conversar com a IA." : ".") }),
        cell({ icon: "coffee", title: "Pausa de 10 min a cada 50", sub: "O descanso ajuda a memória a fixar." })
      ], "icons flat") +
      '<button class="btn btn-filled btn-large" data-action="start-session">' + icon("play") + "Começar o intensivo</button>" +
      '<p class="footnote secondary center">O cronômetro de 8 horas começa agora e termina por volta das ' + clock(end) + ".</p></div>";
  }

  function breakCard() {
    return '<div class="card break-card" role="status">' +
      '<div style="display:flex;gap:14px;align-items:flex-start">' + sq("coffee") + '<div><p class="headline">Hora da pausa</p><p class="subhead secondary">Você estudou ' + S.sinceBreakMin() + " minutos seguidos. Uma pausa de 10 minutos agora ajuda a fixar o que entrou.</p></div></div>" +
      '<div class="row-btns"><button class="btn btn-filled" data-action="take-break">Fazer pausa</button><button class="btn" data-action="snooze-break">Daqui a 10 min</button></div></div>';
  }

  /* Um trecho da trilha: cabeçalho fixo e os nós em zigue-zague. */
  function trailUnit(o) {
    const pts = o.ids.map((id, k) => {
      const info = nodeInfo(id);
      const big = info.kind === "check" || info.review;
      return { id, k, info, big, x: PATH_X[k % PATH_X.length], s: big ? 78 : 68 };
    });
    let yy = PAD_Y;
    pts.forEach((p) => { p.y = yy + p.s / 2; yy += STEP_Y; });
    const last = pts[pts.length - 1];
    const H = last.y + last.s / 2 + 40;
    let svg = '<svg class="path-line" width="400" height="' + H + '" viewBox="-200 0 400 ' + H + '" aria-hidden="true">';
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], z = pts[i + 1];
      svg += '<path class="seg' + (S.isDone(a.id) ? " on" : "") + '" d="M' + a.x + " " + a.y + " C" + a.x + " " + (a.y + 50) + " " + z.x + " " + (z.y - 50) + " " + z.x + " " + z.y + '"/>';
    }
    svg += "</svg>";
    const nodes = pts.map((pt) => {
      const state = nodeState(pt.id, o.nid);
      const info = pt.info;
      const top = pt.y - pt.s / 2;
      const res = resumeFor(pt.id);
      let extra = "";
      if (state === "current") {
        const r = pt.s / 2 + 8, c = 2 * Math.PI * r, box = pt.s + 22;
        const done = res ? res.i / stepsLeft(res) : info.kind === "round" ? seenIn(info.words) / info.words.length : 0;
        extra = '<svg class="node-ring" viewBox="0 0 ' + box + " " + box + '" aria-hidden="true"><circle class="track" cx="' + box / 2 + '" cy="' + box / 2 + '" r="' + r + '" fill="none" stroke-width="6"/>' +
          (done ? '<circle class="val" cx="' + box / 2 + '" cy="' + box / 2 + '" r="' + r + '" fill="none" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - Math.min(1, done))).toFixed(1) + '" transform="rotate(-90 ' + box / 2 + " " + box / 2 + ')"/>' : "") + "</svg>" +
          '<span class="node-bubble ' + (pt.x >= 0 ? "left" : "right") + '">' + (res ? "Continuar" : pt.id === "r1" && !S.state.session.startedAt ? "Comece aqui" : info.label) + "</span>";
      }
      const glyph = state === "locked" ? (pt.big ? "trophy" : "lock") : state === "done" && !pt.big ? "check" : pt.big ? "trophy" : "star";
      return '<button class="node ' + state + " " + (pt.big ? "review" : "lesson") + '" data-action="node" data-id="' + pt.id + '" data-x="' + pt.x + '" data-top="' + top + '" data-size="' + pt.s + '"' +
        ' style="top:' + top + "px;left:calc(50% + " + (pt.x - pt.s / 2) + "px);width:" + pt.s + "px;height:" + pt.s + 'px"' +
        ' aria-label="' + esc(info.label + ": " + info.title) + ", " + { done: "concluída", current: "próxima", locked: "bloqueada" }[state] + '">' + icon(glyph) + extra + "</button>";
    }).join("");
    return '<section class="unit" style="--c:var(--phase-' + o.color + ')" id="' + o.key + '">' +
      '<header class="unit-head"><div><p class="unit-eyebrow">' + o.eyebrow + '</p><h2 class="unit-title">' + esc(o.title) + "</h2></div>" +
      '<span class="unit-range caption secondary">' + o.range + "</span></header>" +
      '<div class="unit-path" style="height:' + H + 'px">' + svg + nodes + "</div></section>";
  }

  function blockUnit(b, nid) {
    const ids = [];
    for (let k = 1; k <= S.PER_BLOCK; k++) ids.push("r" + ((b - 1) * S.PER_BLOCK + k));
    ids.push("c" + b);
    const words = S.blockRange(b);
    return trailUnit({
      key: "b" + b, color: b, ids, nid, title: BLOCKS[b - 1].name,
      eyebrow: "Bloco " + b + " · " + ((b - 1) * 2) + "h–" + (b * 2) + "h · " + seenIn(words) + "/" + words.length,
      range: (words[0] + 1) + "–" + (words[words.length - 1] + 1)
    });
  }

  function syncText() {
    if (!window.Sync) return "Só neste aparelho";
    const where = Sync.inClaude ? "Salvo na sua conta do Claude" : "Salvo na nuvem";
    return { ok: where, saving: "Salvando…", error: "Sem conexão com a nuvem", offline: "Sem internet", idle: "Conectando…", off: "Só neste aparelho" }[Sync.status] || "Conectando…";
  }

  function viewIntensivo() {
    const st = S.state;
    const c = S.coreCounts();
    const due = S.dueIds().length;
    const started = !!st.session.startedAt;
    const name = st.profile.name;
    const nid = S.nextId();
    let html = '<div class="statbar">' +
      '<a class="avatar" href="#ajustes" aria-label="Ajustes">' + initial() + "</a>" +
      '<div class="stats">' +
      '<span class="stat" aria-label="Tempo de estudo">' + icon("clock") + '<span data-live="elapsed-chip">' + (started ? hm(Math.min(S.elapsedMin(), 999 * 60)) : "0:00") + "</span></span>" +
      '<a class="stat" href="#palavras" aria-label="' + c.seen + ' palavras estudadas">' + icon("textformat") + "<span>" + c.seen + "</span></a>" +
      '<a class="stat cards' + (due ? " due" : "") + '" href="#revisar" aria-label="' + plural(due, "palavra", "palavras") + ' para revisar">' + icon("cards") + "<span>" + due + "</span></a>" +
      '<a class="stat sync ' + (window.Sync ? Sync.status : "off") + '" href="#ajustes" data-live="sync-dot" aria-label="Sincronização: ' + syncText() + '">' + icon("cloud") + "</a>" +
      "</div></div>";
    html += ltHeader(started ? c.seen + " de 500." : "500 palavras.", {
      eyebrow: started ? (name ? esc(name) + " · " : "") + "palavras estudadas hoje" : (name ? "Olá, " + esc(name) : "Olá"),
      avatar: false, cls: "trail-hero",
      second: started ? (c.learned ? c.learned + " já fixadas." : "Faltam " + (S.CORE - c.seen) + ".") : "Em 8 horas. Hoje."
    });
    if (!S.storageOk) html += '<p class="tag">Este navegador não está salvando seu progresso (modo privado?).</p>';
    if (S.breakDue()) html += breakCard();
    html += started ? dashboard() : startCard();
    for (let b = 1; b <= S.BLOCKS; b++) {
      html += '<div class="phase-divider"><span>Bloco ' + b + " · horas " + ((b - 1) * 2) + " a " + b * 2 + "</span></div>";
      html += blockUnit(b, nid);
    }
    html += '<div class="path-end">' + icon("trophy") + '<p class="headline">Maratona final</p><p class="subhead secondary">Treine as que faltam até as 500 ficarem fixadas.</p>' +
      (!nid ? '<button class="btn btn-filled" data-action="practice-left" style="margin-top:12px">Treinar as que faltam</button>' : "") + "</div>" +
      list([
        cell({ href: "#etapas", icon: "grid", title: "Depois das 500: as etapas", sub: "Mais 500 palavras por área, frases prontas e situações do dia a dia", chevron: true }),
        cell({ href: "#metodo", icon: "bulb", title: "Como funciona o método", sub: "As técnicas e o plano das 8 horas", chevron: true })
      ], "icons");
    return { html, meta: { title: "Intensivo" } };
  }

  /* ═══════════════════════ VERBO TO BE ═══════════════════════ */
  function colaTable() {
    const rows = [
      ["I", "am · I'm", "was"],
      ["he, she, it", "is · he's, she's, it's", "was"],
      ["you, we, they", "are · you're, we're, they're", "were"],
      ["Negativa", "I'm not · isn't · aren't", "wasn't · weren't"],
      ["Pergunta", "Am I…? Is he…? Are you…?", "Was he…? Were you…?"],
      ["Há, tem", "there is · there are", "there was · there were"],
      ["Futuro", "will be · going to be", ""]
    ];
    return '<div class="card table-wrap"><table class="cola-table"><thead><tr><th></th><th>Presente</th><th>Passado</th></tr></thead><tbody>' +
      rows.map((r) => '<tr><th scope="row">' + esc(r[0]) + '</th><td lang="en">' + esc(r[1]) + '</td><td lang="en">' + esc(r[2]) + "</td></tr>").join("") +
      "</tbody></table></div>";
  }

  function viewTobe() {
    const done = S.tobeCount();
    const nid = S.nextTobe();
    const res = latestResume("t");
    const cta = res
      ? { label: "Continuar " + nodeInfo(res.id).label.toLowerCase(), id: res.id }
      : nid ? { label: (done ? "Fazer a " : "Começar pela ") + nodeInfo(nid).label.toLowerCase(), id: nid } : null;
    let html = ltHeader("Verbo to be.", { eyebrow: "Trilha de gramática · " + TOBE.length + " lições", second: done >= TOBE.length ? "Trilha concluída." : done + " de " + TOBE.length + " lições." }) +
      '<div class="card dash">' +
      '<div class="dash-bar"><span class="caption secondary">Trilha</span><div class="progress good"><span style="width:' + Math.round((done / TOBE.length) * 100) + '%"></span></div></div>' +
      '<p class="subhead secondary">Ser e estar no presente, no passado e no futuro: afirmar, negar, perguntar, there is e os usos que confundem o brasileiro. Cada lição leva uns 6 minutos.</p>' +
      (cta ? '<button class="btn btn-filled btn-large" data-action="start" data-id="' + cta.id + '" data-force="1">' + icon("play") + esc(cta.label) + "</button>" : '<button class="btn btn-tinted btn-large" data-action="start" data-id="t11" data-force="1">Refazer a revisão final</button>') +
      '<p class="footnote secondary center">No intensivo, o app sugere uma lição de to be a cada 2 rodadas de palavras.</p></div>' +
      section("Cola do verbo to be", colaTable(), "Toque numa lição da trilha para ver a explicação completa, com exemplos em áudio.");
    TOBE_PARTS.forEach((part, k) => {
      html += '<div class="phase-divider"><span>Parte ' + (k + 1) + " · " + esc(part.name) + "</span></div>";
      const ids = part.lessons;
      html += trailUnit({ key: "tp" + (k + 1), color: k + 1, ids, nid, title: part.name, eyebrow: "Parte " + (k + 1) + " · " + ids.filter((id) => S.isDone(id)).length + "/" + ids.length, range: "lições " + ids[0].slice(1) + "–" + ids[ids.length - 1].slice(1) });
    });
    return { html, meta: { title: "To be" } };
  }

  function closePopover() {
    const p = $(".popover");
    if (p) p.remove();
    $$(".node.open-pop").forEach((n) => n.classList.remove("open-pop"));
  }

  function openPopover(el) {
    const had = el.classList.contains("open-pop");
    closePopover();
    if (had) return;
    const id = el.dataset.id;
    const info = nodeInfo(id);
    const state = nodeState(id, nextOf(id));
    const res = resumeFor(id);
    const pop = document.createElement("div");
    pop.className = "popover";
    pop.setAttribute("role", "dialog");
    pop.style.top = (+el.dataset.top + +el.dataset.size + 16) + "px";
    pop.style.setProperty("--ax", el.dataset.x + "px");
    let sub, count;
    if (info.kind === "round") { sub = '<span lang="en">' + esc(info.words.slice(0, 10).map((i) => S.word(i).en).join(" · ")) + " …</span>"; count = seenIn(info.words) + "/25 estudadas"; }
    else if (info.kind === "check") { sub = "30 palavras do bloco. Você vê em português e diz em inglês."; count = learnedIn(info.words) + "/125 fixadas"; }
    else { sub = esc(info.sub) + (info.review ? " · 15 exercícios" : " · explicação, exemplos e 8 exercícios"); count = state === "done" ? "feita" : "verbo to be"; }
    const rec = info.kind === "tobe" ? S.state.tobe[id] : S.state.nodes[id];
    let action;
    if (res) {
      action = '<button class="btn btn-filled btn-large" data-action="start" data-id="' + id + '" data-force="1">' + icon("play") + "Continuar do passo " + (res.i + 1) + "</button>" +
        '<button class="btn btn-plain" data-action="restart" data-id="' + id + '">Recomeçar do início</button>';
    } else if (state === "locked") {
      action = '<p class="footnote secondary">Conclua as etapas anteriores para liberar.</p><button class="btn btn-plain" data-action="start" data-id="' + id + '" data-force="1">Abrir mesmo assim</button>';
    } else {
      action = '<button class="btn btn-filled btn-large" data-action="start" data-id="' + id + '" data-force="1">' + icon("play") + (state === "done" ? "Refazer" : "Começar") + "</button>";
    }
    pop.innerHTML = '<p class="eyebrow">' + esc(info.label) + " · " + info.est + " · " + count + "</p>" +
      '<p class="title3">' + esc(info.title) + '</p><p class="subhead secondary">' + sub + "</p>" +
      (rec && rec.total ? '<p class="footnote secondary">Última vez: ' + rec.correct + "/" + rec.total + " acertos.</p>" : "") + action;
    el.parentElement.appendChild(pop);
    el.classList.add("open-pop");
    const nodesIn = el.parentElement.querySelectorAll(".node");
    if (info.kind === "check" || info.review || el === nodesIn[nodesIn.length - 1]) {
      pop.classList.add("above");
      pop.style.top = (+el.dataset.top - pop.offsetHeight - 16) + "px";
    }
    const r = pop.getBoundingClientRect();
    const limit = window.innerHeight - 90;
    if (r.bottom > limit) window.scrollBy({ top: r.bottom - limit, behavior: "smooth" });
    else if (r.top < 140) window.scrollBy({ top: r.top - 140, behavior: "smooth" });
  }

  /* ═══════════════════════ PALAVRAS ═══════════════════════ */
  let wordFilter = "all";
  const STATUS_LABEL = { new: "Nova", training: "Em treino", learned: "Fixada" };

  function wordRow(i) {
    const w = S.word(i);
    const st = S.status(i);
    const note = S.state.notes[i];
    return cell({
      action: "word", attrs: 'data-i="' + i + '"',
      lead: '<span class="wbadge rank">' + (i + 1) + "</span>",
      title: '<span lang="en">' + esc(w.en) + "</span>", sub: esc(w.pt) + (note ? ' · <span class="note-mark">' + esc(note) + "</span>" : ""),
      value: '<span class="tag' + (st === "learned" ? " good" : st === "training" ? " tint" : "") + '">' + STATUS_LABEL[st] + "</span>"
    });
  }

  function wordGroups(q) {
    const nq = q.trim().toLowerCase();
    let out = "";
    let any = false;
    for (let r = 1; r <= S.ROUNDS; r++) {
      const rows = S.roundRange(r).filter((i) => {
        const w = S.word(i);
        if (wordFilter !== "all" && S.status(i) !== wordFilter) return false;
        return !nq || w.en.toLowerCase().includes(nq) || w.pt.toLowerCase().includes(nq);
      });
      if (!rows.length) continue;
      any = true;
      out += section("Rodada " + r + " · " + esc(ROUND_NAMES[r - 1]), list(rows.map(wordRow), "icons"));
    }
    ETAPAS.filter((e) => e.kind === "words").forEach((e) => {
      const rows = e.idx.filter((i) => {
        if (i < S.CORE) return false; // as essenciais já aparecem nas rodadas acima
        const w = S.word(i);
        if (wordFilter !== "all" && S.status(i) !== wordFilter) return false;
        return !nq || w.en.toLowerCase().includes(nq) || w.pt.toLowerCase().includes(nq);
      });
      if (!rows.length) return;
      any = true;
      out += section('<a href="#etapa-' + e.id + '">Etapa ' + e.n + " · " + esc(e.name) + "</a>", list(rows.map(wordRow), "icons"));
    });
    return any ? out : '<p class="subhead secondary center" style="padding:24px 0">Nenhuma palavra aqui ainda.</p>';
  }

  function viewPalavras() {
    const c = S.counts();
    const seg = [["all", "Todas"], ["new", "Novas"], ["training", "Em treino"], ["learned", "Fixadas"]];
    const html =
      ltHeader(S.N + " palavras.", { eyebrow: "As 500 essenciais e as das etapas", second: c.seen + " estudadas, " + c.learned + " fixadas." }) +
      '<div class="segmented" role="group" aria-label="Filtro" data-filter>' + seg.map((s) => '<button type="button" data-value="' + s[0] + '" aria-pressed="' + (wordFilter === s[0]) + '">' + s[1] + "</button>").join("") + "</div>" +
      '<label class="search">' + icon("search", "icon-sm") + '<span class="sr-only">Buscar</span><input id="word-search" data-input="wsearch" type="search" placeholder="Buscar em inglês ou português"></label>' +
      '<div id="word-groups" class="view" style="gap:30px">' + wordGroups("") + "</div>";
    return { html, meta: { title: "Palavras" } };
  }

  /* Folha de detalhes de uma palavra */
  function openWordSheet(i) {
    const w = S.word(i);
    const c = S.card(i);
    const st = S.status(i);
    const wrap = document.createElement("div");
    wrap.className = "sheet-backdrop";
    wrap.innerHTML =
      '<div class="sheet" role="dialog" aria-modal="true" aria-label="' + esc(w.en) + '"><div class="sheet-grabber"></div>' +
      '<div class="sheet-head"><span class="eyebrow">Nº ' + (i + 1) + " · " + STATUS_LABEL[st] + (c ? " · caixa " + c.box : "") + '</span><button class="close-btn" data-sheet-close aria-label="Fechar">' + icon("x") + "</button></div>" +
      '<div class="word-top"><p class="word-en" style="min-width:0"><span lang="en">' + esc(dot(w.en)) + '</span><span class="word-pt">' + esc(dot(w.pt)) + "</span></p>" + speakBtn(w.en, "lg", "Ouvir " + w.en) + "</div>" +
      '<div class="example">' + speakBtn(w.ex, "", "Ouvir exemplo") + '<div style="min-width:0"><p class="headline" lang="en">' + esc(w.ex) + '</p><p class="subhead secondary">' + esc(w.exPt) + "</p></div></div>" +
      (SP.hasMic ? '<div class="controls"><button class="btn" data-action="mic-word" data-i="' + i + '">' + icon("mic") + 'Testar pronúncia</button></div><div class="mic-result" id="mic-result" hidden></div>' : "") +
      '<div class="field-note"><label class="eyebrow" for="sheet-note">Sua anotação</label><textarea id="sheet-note" class="note-box" data-input="note" data-i="' + i + '" placeholder="Uma associação, um som parecido, uma frase sua">' + esc(S.state.notes[i] || "") + "</textarea></div>" +
      (c ? '<p class="footnote secondary">Acertos: ' + c.ok + " · Erros: " + c.bad + "</p>" : "") +
      "</div>";
    const close = () => {
      wrap.remove();
      document.removeEventListener("keydown", onKey, true);
      if (route().view === "palavras") refreshWordGroups();
      else if (route().view === "etapa" && !P) { const y = window.scrollY; render(); window.scrollTo(0, y); }
    };
    const onKey = (e) => { if (e.key === "Escape") { e.stopPropagation(); close(); } };
    wrap.addEventListener("click", (e) => { if (e.target === wrap || e.target.closest("[data-sheet-close]")) close(); });
    document.addEventListener("keydown", onKey, true);
    document.body.appendChild(wrap);
    if (S.state.settings.autoplay) setTimeout(() => SP.speak(w.en), 200);
  }
  function refreshWordGroups() {
    const box = $("#word-groups");
    if (box) box.innerHTML = wordGroups(($("#word-search") || {}).value || "");
  }

  /* ═══════════════════════ CARDS (como no Anki) ═══════════════════════
     Baralhos com Novas (azul), Aprendendo (vermelho) e Revisar (verde); estudo com frente e verso,
     quatro botões com o próximo intervalo, desfazer e atalhos de teclado (espaço, 1 a 4, Z). */
  let DECK_CACHE = null;
  function decks() {
    if (DECK_CACHE) return DECK_CACHE;
    const uniq = (a) => Array.from(new Set(a));
    const wk = (idxs) => idxs.map((i) => "w:" + i);
    const pk = (e) => (e.phrases || []).map((_, k) => "p:" + pidOf(e, k));
    const parts = [];
    const ess = [];
    for (let b = 1; b <= S.BLOCKS; b++) ess.push({ id: "b" + b, name: "Bloco " + b + " · " + BLOCKS[b - 1].name, keys: wk(S.blockRange(b)) });
    const essDeck = { id: "essenciais", name: "500 essenciais", keys: uniq(ess.flatMap((d) => d.keys)), children: ess };
    PARTS.forEach((p) => {
      const kids = ETAPAS.filter((e) => e.part === p.key && (e.idx || (e.phrases && e.phrases.length)))
        .map((e) => ({ id: "e-" + e.id, name: e.name, keys: uniq((e.idx ? wk(e.idx) : []).concat(pk(e))) }));
      if (kids.length) parts.push({ id: "p-" + p.key, name: p.name, keys: uniq(kids.flatMap((d) => d.keys)), children: kids, key: p.key });
    });
    /* O foco é ouvir: os baralhos de escuta e de conversa vêm primeiro, também na ordem das cartas novas. */
    const first = ["ouvido", "blocos", "situacoes"];
    const list = first.map((k) => parts.find((d) => d.key === k)).filter(Boolean)
      .concat([essDeck], parts.filter((d) => !first.includes(d.key)));
    const all = { id: "all", name: "Todas as cartas", keys: uniq(list.flatMap((d) => d.keys)), children: [] };
    const byId = { all };
    list.forEach((d) => { byId[d.id] = d; d.children.forEach((c) => { c.parent = d.id; byId[c.id] = c; }); });
    DECK_CACHE = { all, list, byId };
    return DECK_CACHE;
  }
  const deckOfEtapa = (e) => decks().byId["e-" + e.id];

  function countsHtml(c, cur) {
    const n = (cls, v, q) => '<span class="' + cls + (cur === q ? " cur" : "") + '">' + v + "</span>";
    return '<span class="ak-counts">' + n("ak-new", c.fresh, "new") + n("ak-learn", c.learn, "learn") + n("ak-due", c.due, "due") + "</span>";
  }
  function bigCounts(c) {
    const one = (cls, v, l) => '<div class="ak-big-item"><b class="' + cls + '">' + v + '</b><span class="caption secondary">' + l + "</span></div>";
    return '<div class="ak-big">' + one("ak-new", c.fresh, "Novas") + one("ak-learn", c.learn, "Aprendendo") + one("ak-due", c.due, "Revisar") + "</div>";
  }
  function deckRow(d, child) {
    return '<a class="deck-row' + (child ? " child" : "") + '" href="#deck-' + d.id + '"><span class="deck-name">' + esc(d.name) + "</span>" + countsHtml(S.akCounts(d.keys)) + "</a>";
  }
  function maturityTiles(keys) {
    const m = S.akMaturity(keys);
    const t = (v, l, s) => '<div class="tile"><span class="tile-value">' + v + '</span><span class="caption secondary">' + l + "</span>" + (s ? '<span class="caption tertiary">' + s + "</span>" : "") + "</div>";
    return '<div class="tiles">' + t(m.fresh, "Novas", "nunca vistas") + t(m.learn, "Aprendendo", "passos de 1 e 10 min") + t(m.young, "Jovens", "menos de 21 dias") + t(m.mature, "Maduras", "21 dias ou mais") + "</div>";
  }

  function viewRevisar() {
    const D = decks();
    const c = S.akCounts(D.all.keys);
    const day = S.akDay();
    const tomorrow = S.akForecast(D.all.keys);
    const nowN = c.learn + c.due;
    const done = day.fresh + day.rev;
    const html =
      ltHeader("Cards.", { eyebrow: "Repetição espaçada, como no Anki", second: nowN ? plural(nowN, "card", "cards") + " para agora." : c.fresh ? plural(c.fresh, "nova", "novas") + " para hoje." : "Em dia." }) +
      '<div class="card dash">' + bigCounts(c) +
      (c.fresh + nowN ? '<button class="btn btn-filled btn-large" data-action="anki" data-deck="all">' + icon("play") + "Estudar agora</button>" : '<p class="headline center">Parabéns! Nada para agora.</p>') +
      '<p class="footnote secondary center">Hoje: ' + plural(day.rev, "revisão", "revisões") + " e " + plural(day.fresh, "nova", "novas") +
      (done ? " · " + Math.round(((done - day.again) / done) * 100) + "% de acertos" : "") + ". Amanhã: " + plural(tomorrow, "card", "cards") + ".</p></div>" +
      section("Baralhos", '<div class="decks"><div class="deck-head"><span>Baralho</span><span class="ak-counts"><span class="ak-new">Novas</span><span class="ak-learn">Apr.</span><span class="ak-due">Rev.</span></span></div>' +
        deckRow(D.all) +
        D.list.map((d) => '<details class="deck-group"><summary class="deck-row"><span class="deck-tog" aria-hidden="true">' + chev() + '</span><a class="deck-name" href="#deck-' + d.id + '">' + esc(d.name) + "</a>" + countsHtml(S.akCounts(d.keys)) + "</summary>" +
          d.children.map((k) => deckRow(k, true)).join("") + "</details>").join("") + "</div>",
        "Toque num baralho para ver as opções e as cartas. Na seta, abra os baralhos de dentro.") +
      section("Como no Anki", list([
        cell({ icon: "repeat", title: "Errei · Difícil · Bom · Fácil", sub: "Cada botão mostra quando o card volta. Card novo: 1 e 10 minutos; depois 1 dia, e o intervalo cresce a cada acerto." }),
        cell({ icon: "target", title: S.state.settings.ankiNew + " novas por dia", sub: "Mude nas opções de qualquer baralho. As revisões não têm limite." }),
        cell({ icon: "zap", title: "Atalhos", sub: "Espaço mostra a resposta e marca Bom · 1 a 4 escolhem o botão · Z desfaz." })
      ], "icons")) +
      section("Maturidade", maturityTiles(D.all.keys)) +
      section("Estudo extra", list([
        cell({ action: "anki-more-home", icon: "layers", title: "Estudar mais 10 novas hoje", sub: "Aumenta o limite de hoje, como no estudo personalizado do Anki.", chevron: true }),
        cell({ action: "practice-left", icon: "target", title: "Treinar as que faltam", sub: "Palavras estudadas que ainda não se formaram.", chevron: true }),
        cell({ action: "practice-random", icon: "shuffle", title: "Revisão relâmpago", sub: "20 palavras aleatórias que você já viu.", chevron: true })
      ], "icons"));
    return { html, meta: { title: "Cards" } };
  }

  function cardRow(k) {
    const c = S.ak(k);
    let title, sub, attrs, action;
    if (k[0] === "w") { const w = S.word(+k.slice(2)); title = w.en; sub = w.pt; action = "word"; attrs = 'data-i="' + k.slice(2) + '"'; }
    else { const p = phraseById(k.slice(2)); title = p.en; sub = p.pt; action = "phrase"; attrs = 'data-pid="' + k.slice(2) + '"'; }
    let tag;
    if (!c || c.q === "new") tag = '<span class="tag">Nova</span>';
    else if (c.q !== "review") tag = '<span class="tag ak-learn-tag">Aprendendo</span>';
    else {
      const d = Math.max(0, Math.round((c.due - Date.now()) / 86400000));
      tag = '<span class="tag ' + (c.ivl >= 21 ? "good" : "tint") + '">' + (d ? "em " + d + " d" : "hoje") + "</span>";
    }
    return cell({ action, attrs, title: '<span lang="en">' + esc(title) + "</span>", sub: esc(sub), value: tag });
  }
  function viewDeck(r) {
    const D = decks();
    const d = D.byId[r.deck] || D.all;
    const c = S.akCounts(d.keys);
    const st = S.state.settings;
    const seg = (name, val, opts, label) => '<div class="segmented" role="group" aria-label="' + label + '" data-setting="' + name + '" style="flex:1">' +
      opts.map((o) => '<button type="button" data-value="' + o[0] + '" aria-pressed="' + (String(val) === String(o[0])) + '">' + o[1] + "</button>").join("") + "</div>";
    const shown = d.keys.slice(0, 80);
    const html =
      ltHeader(esc(d.name) + ".", { eyebrow: "Baralho", second: plural(d.keys.length, "carta", "cartas") + ".", avatar: false }) +
      '<div class="card dash">' + bigCounts(c) +
      (c.fresh + c.learn + c.due ? '<button class="btn btn-filled btn-large" data-action="anki" data-deck="' + d.id + '">' + icon("play") + "Estudar agora</button>" : '<p class="headline center">Parabéns! Nada para agora neste baralho.</p>') +
      '<p class="footnote secondary center">Novas por dia: ' + st.ankiNew + " (para todos os baralhos). Faltam " + S.akNewLeft() + " hoje.</p></div>" +
      section("Opções", list([
        '<div class="cell stack"><span class="cell-title">Novas por dia</span>' + seg("ankiNew", st.ankiNew, [[10, "10"], [20, "20"], [30, "30"], [50, "50"]], "Novas por dia") + "</div>",
        '<div class="cell stack"><span class="cell-title">Frente do card</span>' + seg("ankiDir", st.ankiDir, [["en", "Inglês"], ["pt", "Português"], ["both", "Alternar"]], "Frente do card") + "</div>"
      ]), "Inglês na frente treina entender; português na frente treina falar. Alternar faz os dois.") +
      section("Maturidade", maturityTiles(d.keys)) +
      section("Cartas", list(shown.map(cardRow), "icons"), d.keys.length > shown.length ? "Mostrando " + shown.length + " de " + d.keys.length + ". Abra um baralho menor para ver todas." : "Toque numa carta para ouvir, testar a pronúncia e anotar.");
    return { html, meta: { title: d.name } };
  }

  /* ───────── Estudo ───────── */
  let A = null;
  const ANKI_GRADES = [["again", "Errei"], ["hard", "Difícil"], ["good", "Bom"], ["easy", "Fácil"]];
  function openAnki(deckId, opts) {
    const d = decks().byId[deckId] || decks().all;
    if (P) closePlayer();
    if (A) ankiClose(true);
    if (!S.state.session.startedAt) S.startSession();
    A = { deck: d, opts: Object.assign({}, opts), cur: null, shown: false, history: [], studied: 0, good: 0, last: null, startedAt: Date.now() };
    const el = document.createElement("div");
    el.className = "player anki";
    el.id = "anki";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", "Cards: " + d.name);
    el.innerHTML =
      '<div class="player-head"><button class="close-btn" data-action="anki-close" aria-label="Fechar">' + icon("x") + "</button>" +
      '<div class="ak-title"><span class="ak-deck">' + esc(d.name) + '</span><span id="ak-counts"></span></div>' +
      '<button class="close-btn" data-action="anki-undo" id="ak-undo" aria-label="Desfazer a última resposta" disabled>' + icon("undo") + "</button></div>" +
      '<div class="player-body"><div class="player-inner" id="ak-card" tabindex="-1"></div></div>' +
      '<div class="player-foot"><div class="player-foot-inner" id="ak-foot"></div></div>';
    document.body.appendChild(el);
    document.body.style.overflow = "hidden";
    ankiNext();
  }
  function ankiClose(silent) {
    SP.stop();
    const el = $("#anki");
    if (el) el.remove();
    document.body.style.overflow = "";
    A = null;
    if (!silent) { const y = window.scrollY; render(); window.scrollTo(0, y); }
  }
  function ankiNext() {
    A.cur = S.akNext(A.deck.keys, { noNew: A.opts.noNew, skip: A.last });
    A.shown = false;
    ankiRender();
  }
  const akQueue = (c) => (!c || c.q === "new" ? "new" : c.q === "review" ? "due" : "learn");
  function ankiDir(k) {
    const s = S.state.settings.ankiDir || "en";
    if (s !== "both") return s;
    const c = S.ak(k);
    return c && c.reps % 2 === 1 ? "pt" : "en";
  }
  function ankiFace(k, dir) {
    if (k[0] === "w") {
      const i = +k.slice(2);
      const w = S.word(i);
      const note = S.state.notes[i];
      return {
        front: dir === "pt" ? '<p class="eyebrow">Diga em inglês</p><p class="ak-front">' + esc(w.pt) + "</p>" + micButton("mic-text", ' data-text="' + esc(w.en) + '"')
          : '<p class="ak-front" lang="en">' + esc(w.en) + "</p>" + speakBtn(w.en, "lg", "Ouvir " + w.en),
        back: (dir === "pt" ? '<p class="ak-back" lang="en">' + esc(w.en) + "</p>" + speakBtn(w.en, "", "Ouvir " + w.en) : '<p class="ak-back">' + esc(w.pt) + "</p>") +
          '<div class="example">' + speakBtn(w.ex, "", "Ouvir exemplo") + '<div style="min-width:0"><p class="headline" lang="en">' + esc(w.ex) + '</p><p class="subhead secondary">' + esc(w.exPt) + "</p></div></div>" +
          (note ? '<p class="footnote secondary">Sua nota: ' + esc(note) + "</p>" : ""),
        say: w.en
      };
    }
    const p = phraseById(k.slice(2));
    const note = S.state.pnotes[p.pid];
    const say = p.real || p.en;
    return {
      front: dir === "pt" ? '<p class="eyebrow">Diga em inglês</p><p class="ak-front ak-phrase">' + esc(p.pt) + "</p>" + micButton("mic-text", ' data-text="' + esc(p.en) + '"')
        : '<p class="ak-front ak-phrase" lang="en">' + esc(p.en) + "</p>" + speakBtn(say, "lg", "Ouvir"),
      back: (dir === "pt" ? '<p class="ak-back ak-phrase" lang="en">' + esc(p.en) + "</p>" + speakBtn(say, "", "Ouvir") : '<p class="ak-back">' + esc(p.pt) + "</p>") +
        soundBox(p.real, p.br) + (note ? '<p class="footnote secondary">Sua nota: ' + esc(note) + "</p>" : ""),
      say
    };
  }
  function ankiRender() {
    const el = $("#anki");
    if (!el || !A) return;
    const c = S.akCounts(A.deck.keys);
    if (A.opts.noNew) c.fresh = 0;
    $("#ak-counts").innerHTML = countsHtml(c, A.cur ? akQueue(S.ak(A.cur)) : null);
    $("#ak-undo").disabled = !A.history.length;
    const box = $("#ak-card");
    const foot = $("#ak-foot");
    box.style.animation = "none"; void box.offsetWidth; box.style.animation = "";
    if (!A.cur) {
      const nextIn = S.akNextIn(A.deck.keys);
      const unseen = S.akCounts(A.deck.keys).unseen;
      const mins = Math.max(1, Math.round((Date.now() - A.startedAt) / MIN));
      box.innerHTML = '<div class="step-head finish"><span class="finish-icon">' + icon("checkFill") + "</span>" +
        '<h1 class="title1">Parabéns!</h1><p class="body secondary">Você terminou ' + (A.deck.id === "all" ? "os cards" : "este baralho") + " por agora." +
        (nextIn !== null && nextIn < 720 ? " O próximo card de aprendizado volta em " + (nextIn < 60 ? plural(nextIn, "minuto", "minutos") : Math.round(nextIn / 60) + " h") + "." : " As revisões voltam nos próximos dias.") + "</p></div>" +
        '<div class="summary center"><div><b>' + A.studied + "</b><small>cards</small></div><div><b>" + (A.studied ? Math.round((A.good / A.studied) * 100) : 0) + "%</b><small>acertos</small></div><div><b>" + mins + "</b><small>min</small></div></div>";
      foot.innerHTML = '<button class="btn btn-filled btn-large" data-action="anki-close" data-primary>Concluído</button>' +
        (unseen ? '<button class="btn btn-plain" data-action="anki-more">Estudar mais 10 novas</button>' : "");
      haptic(20);
      return;
    }
    const dir = ankiDir(A.cur);
    const f = ankiFace(A.cur, dir);
    box.innerHTML = '<div class="ak-card"><div class="ak-q">' + f.front + "</div>" +
      (A.shown ? '<hr class="ak-sep"><div class="ak-a">' + f.back + "</div>" : "") +
      '<div class="mic-result" id="mic-result" hidden></div></div>';
    foot.innerHTML = A.shown
      ? '<div class="grades ak-grades">' + ANKI_GRADES.map(([g, l]) => '<button class="grade ' + g + '" data-action="anki-grade" data-g="' + g + '"' + (g === "good" ? " data-primary" : "") + "><small>" + S.akLabel(A.cur, g) + "</small>" + l + "</button>").join("") + "</div>"
      : '<button class="btn btn-filled btn-large" data-action="anki-show" data-primary>Mostrar resposta</button>';
    if (!A.shown && dir === "en") autoSpeak(f.say);
    if (A.shown && dir === "pt") SP.speak(f.say);
    try { box.focus({ preventScroll: true }); } catch (e) { /* ignora */ }
    $("#anki .player-body").scrollTop = 0;
  }

  /* ═══════════════════════ CADERNO ═══════════════════════ */
  function viewCaderno() {
    const notes = Object.keys(S.state.notes).map(Number).filter((i) => (S.state.notes[i] || "").trim()).sort((a, b) => a - b);
    const pnotes = Object.keys(S.state.pnotes).filter((k) => (S.state.pnotes[k] || "").trim() && phraseById(k));
    const html =
      ltHeader("Caderno.", { eyebrow: "Suas anotações", second: plural(notes.length, "nota de palavra", "notas de palavras") + "." }) +
      section("Anotações livres", '<div class="list"><div class="cell"><label class="sr-only" for="pad">Anotações livres</label><textarea id="pad" data-input="pad" placeholder="Escreva frases suas com as palavras do dia, dúvidas, regras que você percebeu…" style="min-height:220px">' + esc(S.state.pad) + "</textarea></div></div>",
        "Salva sozinho. Escrever frases sobre a sua vida fixa mais do que copiar.") +
      section("Notas por palavra", notes.length ? list(notes.map((i) => cell({
        action: "word", attrs: 'data-i="' + i + '"', lead: '<span class="wbadge rank">' + (i + 1) + "</span>",
        title: '<span lang="en">' + esc(S.word(i).en) + "</span> · " + esc(S.word(i).pt), sub: esc(S.state.notes[i]), chevron: true
      })), "icons") : list([cell({ title: '<span class="secondary">Anote associações ao aprender cada palavra. Elas aparecem aqui.</span>' })])) +
      section("Notas por frase", pnotes.length ? list(pnotes.map((k) => {
        const p = phraseById(k);
        return cell({ action: "phrase", attrs: 'data-pid="' + k + '"', title: '<span lang="en">' + esc(p.en) + "</span>", sub: esc(S.state.pnotes[k]), chevron: true });
      }), "icons") : list([cell({ title: '<span class="secondary">Anote ao decorar as frases das etapas. Elas aparecem aqui.</span>' })])) +
      section("Como anotar (técnica dos poliglotas)", list([
        cell({ icon: "wave", title: "Som parecido", sub: "<b>cheap</b> (barato) soa como “chip”: o chip é barato." }),
        cell({ icon: "bulb", title: "Imagem exagerada", sub: "<b>hungry</b> (com fome) lembra “Hungria”: imagine passar fome na Hungria." }),
        cell({ icon: "pencil", title: "Frase sobre você", sub: "<b>tired</b>: “I’m tired after work.” Uma frase sua vale mais que a tradução." })
      ], "icons"));
    return { html, meta: { title: "Caderno" } };
  }

  /* ═══════════════════════ MÉTODO ═══════════════════════ */
  function viewMetodo() {
    const tech = [
      ["target", "Frequência primeiro", "As 100 palavras mais comuns formam cerca de metade de tudo o que se lê em inglês. Você começa por elas."],
      ["layers", "Pedaços pequenos", "5 palavras por vez. A memória de trabalho segura poucas coisas ao mesmo tempo."],
      ["zap", "Recordação ativa", "Testar-se fixa mais do que reler. Toda palavra nova é cobrada logo em seguida."],
      ["repeat", "Repetição espaçada (Anki)", "O mesmo agendamento do Anki: 1 e 10 minutos para aprender, depois 1 dia, e cada acerto multiplica o intervalo. Cada revisão chega quando você está quase esquecendo."],
      ["book", "Contexto", "Cada palavra vem numa frase real, com tradução e áudio."],
      ["mic", "Pronúncia em voz alta", "Ouça, repita e teste com o microfone. A boca também precisa treinar."],
      ["headphones", "Shadowing", "Repita junto com o áudio, imitando ritmo e entonação."],
      ["chat", "Tradução reversa e conversa", "Veja a frase em português e diga em inglês. Depois converse com a IA usando as palavras da rodada."],
      ["pencil", "Associação e anotação", "Um som parecido ou uma imagem exagerada liga a palavra nova ao que você já sabe."],
      ["coffee", "Pausas e sono", "10 minutos de pausa a cada 50. Dormir à noite consolida o que você estudou hoje."],
      ["chat", "Frases prontas", "O nativo fala em blocos: “Can I get…?”, “I'm running late”. Decore a frase inteira, não só a palavra."],
      ["repeat", "Do, does e did", "Um verbo, nove frases: eu, você e ela, afirmando, negando e perguntando, no presente e no passado."],
      ["people", "Ensaio de situações", "Ensaie a balada, o restaurante e a reunião antes de viver a cena. Na hora, a frase sai sozinha."]
    ];
    const html =
      ltHeader("Método.", { eyebrow: "Como funciona", second: "O que os poliglotas fazem." }) +
      section(tech.length + " técnicas", list(tech.map((t) => cell({ icon: t[0], title: t[1], sub: t[2] })), "icons")) +
      section("O que a pesquisa diz", list([
        cell({ icon: "target", title: "Lei de Zipf", sub: "Poucas palavras fazem quase tudo: as 100 mais usadas formam cerca de 50% do Oxford English Corpus, e as 10 primeiras, cerca de 25%. Por isso a semana começa pelo topo da lista." }),
        cell({ icon: "chat", title: "Mais da metade da fala é pronta", sub: "Erman e Warren (2000) encontraram cerca de 58% de combinações prontas na fala e 52% na escrita. Aprender o bloco inteiro é aprender do jeito que o nativo fala." }),
        cell({ icon: "star", title: "Filmes e séries", sub: "Frequências tiradas de legendas de filmes e séries (SUBTLEX-US, Brysbaert e New, 2009) refletem melhor as palavras que as pessoas conhecem do que as de livros e jornais." }),
        cell({ icon: "layers", title: "Abordagem lexical", sub: "Michael Lewis (1993): a língua é feita de blocos de vocabulário mais do que de regras soltas. Os blocos ficam organizados por função: cumprimentar, pedir, reagir, opinar." }),
        cell({ icon: "link", title: "Expressões de várias palavras", sub: "Martinez e Schmitt (2012) listaram as 505 expressões de várias palavras mais frequentes do inglês, como verbos frasais e expressões idiomáticas. Traduzidas palavra por palavra, elas não fazem sentido." }),
        cell({ icon: "headphones", title: "Fala encadeada", sub: "Gonna, wanna e hafta aparecem cerca de uma vez a cada dois minutos de conversa espontânea, e o T entre vogais vira um R rápido. Treinar o som real é o que faz você entender as séries." }),
        cell({ icon: "brain", title: "Quanto vocabulário", sub: "Para entender bem a fala do dia a dia, as pesquisas apontam de 2.000 a 3.000 famílias de palavras para cerca de 95% de cobertura (Adolphs e Schmitt, 2003; Nation, 2006). As 1000 deste app são a parte mais rentável desse caminho." })
      ], "icons"), "Os números de cobertura são estimativas: variam com o tipo de texto e com a forma de contar as palavras.") +
      section("Depois das 500: as etapas", list(PARTS.map((p, k) => cell({ lead: '<span class="wbadge">' + (k + 1) + "</span>", title: esc(p.name), sub: esc(p.desc) })), "icons"),
        "Cada etapa é um card: estude as palavras, decore as frases com os cards de memória e ensaie as conversas.") +
      section("O dia de 8 horas", list(BLOCKS.map((b, k) => cell({
        lead: '<span class="wbadge">' + (k + 1) + "</span>",
        title: esc(b.name) + ' <span class="secondary">· ' + (k * 2) + "h–" + ((k + 1) * 2) + "h</span>",
        sub: "Palavras " + (k * 125 + 1) + "–" + ((k + 1) * 125) + ". 5 rodadas, 1 prova e 2 pausas."
      })).concat([
        cell({ icon: "trophy", title: "Maratona final", sub: "Treine as que faltam até as 500 ficarem fixadas." }),
        cell({ icon: "moon", title: "Amanhã", sub: "20 minutos de revisão: as palavras da caixa 5 voltam." })
      ]), "icons")) +
      section("Uma rodada · 20 min", list([
        cell({ icon: "repeat", title: "Aquecimento", sub: "Revisões vencidas, misturadas.", value: "3 min" }),
        cell({ icon: "layers", title: "5 grupos de 5 palavras", sub: "Ver, ouvir, repetir, anotar e testar.", value: "12 min" }),
        cell({ icon: "headphones", title: "Shadowing", sub: "3 frases da rodada.", value: "2 min" }),
        cell({ icon: "mic", title: "Fale em inglês", sub: "3 frases: do português para o inglês.", value: "2 min" }),
        cell({ icon: "chat", title: "Conversa com IA", sub: "Quando disponível, usando as palavras da rodada.", value: "3 min" })
      ], "icons")) +
      section("Expectativa realista", '<div class="card prose body"><p>Em 8 horas dá para reconhecer as 500 palavras e usar boa parte delas em frases simples.</p><p class="secondary">O app só conta uma palavra como fixada depois que você lembra dela duas vezes, com 10 minutos de intervalo. Para guardar de vez, revise amanhã e daqui a 3 dias.</p></div>');
    return { html, meta: { title: "Método" } };
  }

  /* ═══════════════════════ AJUSTES ═══════════════════════ */
  function viewAjustes() {
    const st = S.state;
    const s = st.settings;
    const seg = (name, val, opts, label, style) => '<div class="segmented" role="group" aria-label="' + label + '" data-setting="' + name + '"' + (style ? ' style="' + style + '"' : "") + ">" +
      opts.map((o) => '<button type="button" data-value="' + o[0] + '" aria-pressed="' + (String(val) === String(o[0])) + '">' + o[1] + "</button>").join("") + "</div>";
    const c = S.counts();
    const html =
      ltHeader("Ajustes.", { avatar: false }) +
      list([cell({ lead: '<span class="avatar lg">' + initial() + "</span>", title: '<span class="title3">' + (st.profile.name ? esc(st.profile.name) : "Estudante") + "</span>", sub: c.seen + " de " + S.N + " estudadas · " + c.learned + " fixadas" + (st.session.startedAt ? " · começou às " + clock(st.session.startedAt) : "") })]) +
      (window.Sync && Sync.inClaude
        ? section("Progresso na nuvem", list([
          cell({ icon: "cloud", title: "Status", value: '<span data-live="sync">' + esc(syncText()) + "</span>" }),
          cell({ action: "sync-now", cls: "link", title: "Salvar agora" })
        ], "icons"), "Neste link do Claude, o progresso fica salvo na sua conta do Claude alguns segundos depois de cada mudança. Abra este mesmo link em qualquer aparelho para continuar.")
        : section("Sincronização na nuvem", list([
        cell({ icon: "cloud", title: "Status", value: '<span data-live="sync">' + esc(syncText()) + "</span>" }),
        '<div class="cell stack"><span class="cell-title">Seu código de sincronização</span><input class="note-box mono" id="sync-code-box" readonly value="' + esc(window.Sync ? Sync.key : "") + '" aria-label="Código de sincronização"></div>',
        cell({ action: "sync-copy", cls: "link", title: "Copiar código" }),
        cell({ action: "sync-now", cls: "link", title: "Sincronizar agora" }),
        '<div class="cell stack"><label class="cell-title" for="sync-key">Continuar o progresso de outro aparelho</label><div class="row-btns"><input class="note-box mono" id="sync-key" placeholder="Cole o código aqui" autocomplete="off" style="flex:1;min-width:0"><button class="btn btn-filled" data-action="sync-use" data-field="#sync-key">Usar</button></div></div>'
      ], "icons"), "O progresso é salvo no Supabase alguns segundos depois de cada mudança. Para continuar em outro aparelho, use o mesmo código. Guarde-o.")) +
      section("Registrar progresso anterior", list(['<div class="cell stack"><label class="cell-title" for="upto">Já estudei até a palavra nº</label><div class="row-btns"><input class="note-box" id="upto" type="number" min="1" max="500" inputmode="numeric" placeholder="Ex.: 49" style="max-width:150px"><button class="btn btn-filled" data-action="mark-upto">Registrar</button></div></div>']),
        "Use se você estudou num aparelho ou link que não salvou. As palavras até esse número entram como estudadas e vão para revisão agora.") +
      section("Perfil", list(['<label class="cell" for="set-name"><span class="cell-body"><span class="cell-title">Nome</span></span><input class="cell-input" id="set-name" data-input="name" value="' + esc(st.profile.name) + '" placeholder="Seu nome" maxlength="40"></label>'])) +
      section("Áudio", list([
        '<div class="cell stack"><span class="cell-title">Velocidade da voz</span>' + seg("rate", s.rate, [[0.7, "Devagar"], [0.9, "Normal"], [1.05, "Rápida"]], "Velocidade da voz") + "</div>",
        '<label class="cell" for="set-voice">' + sq("wave") + '<span class="cell-body"><span class="cell-title">Voz</span></span><select class="cell-select" id="set-voice" data-input="voice"><option value="">Automática</option>' +
        SP.voices.map((v) => '<option value="' + esc(v.voiceURI) + '"' + (v.voiceURI === s.voiceURI ? " selected" : "") + ">" + esc(v.name) + " (" + esc(v.lang) + ")</option>").join("") + "</select>" + icon("chevUD", "icon-sm tertiary") + "</label>",
        '<label class="cell" for="set-autoplay">' + sq("speaker") + '<span class="cell-body"><span class="cell-title">Tocar palavras automaticamente</span></span><input type="checkbox" class="switch" id="set-autoplay" data-input="autoplay"' + (s.autoplay ? " checked" : "") + "></label>",
        cell({ action: "speak", attrs: 'data-text="Hello! Nice to meet you. How are you today?"', cls: "link", title: "Testar voz" })
      ], "icons"), SP.hasTTS ? "O áudio usa as vozes do aparelho. No iPhone, baixe vozes melhores em Ajustes › Acessibilidade › Conteúdo Falado › Vozes." : "Este navegador não tem voz sintetizada. Use Safari, Chrome ou Edge.") +
      section("Aparência", list(['<div class="cell">' + seg("theme", s.theme, [["light", "Claro"], ["dark", "Escuro"], ["auto", "Automático"]], "Tema", "flex:1") + "</div>"])) +
      section("Backup", list([
        cell({ action: "backup-copy", cls: "link", title: "Copiar backup" }),
        '<div class="cell"><label class="sr-only" for="backup-box">Texto do backup</label><textarea id="backup-box" placeholder="Para restaurar, cole aqui o texto do backup" style="min-height:80px;font-size:15px"></textarea></div>',
        cell({ action: "backup-restore", cls: "link", title: "Restaurar backup" })
      ]), "O progresso fica só neste navegador. Copie o backup para guardar ou levar a outro aparelho.") +
      section("", list([
        cell({ href: "#metodo", cls: "link", title: "Como funciona o método" }),
        cell({ action: "reset-timer", cls: "link", title: "Reiniciar o cronômetro de 8 horas" }),
        cell({ action: "reset", cls: "destructive", title: "Apagar tudo e recomeçar" })
      ]), "Reiniciar o cronômetro mantém as palavras estudadas e fixadas.");
    return { html, meta: { title: "Ajustes" } };
  }

  /* ═══════════════════════ ETAPAS ═══════════════════════
     Cada etapa é um card. Sessões de estudo: "w:" palavras, "f:" frases, "s:" situação (diálogo),
     "g:" lição de do/does/did e "k:" treino de verbos. Frases: chave "etapa.n". */
  const SESSION_KIND = { w: "wordset", f: "phrases", s: "dialog", g: "grammar", k: "drill", o: "listen" };
  const KIND_PREFIX = { phrases: "f:", dialog: "s:", grammar: "g:", drill: "k:", listen: "o:" };
  const pidOf = (e, k) => e.id + "." + k;
  let dialogPlaying = null;

  function phraseById(pid) {
    const cut = pid.lastIndexOf(".");
    const e = etapaById[pid.slice(0, cut)];
    const p = e && e.phrases && e.phrases[+pid.slice(cut + 1)];
    return p ? { pid, en: p[0], pt: p[1], real: p[2] || "", br: p[3] || "", swaps: Array.isArray(p[4]) ? p[4] : [], why: typeof p[4] === "string" ? p[4] : "", etapa: e } : null;
  }
  /* Como a frase soa na fala natural, escrita para o ouvido brasileiro, com áudio rápido e devagar. */
  function soundBox(real, br) {
    if (!br) return "";
    return '<div class="sound-box"><p class="eyebrow">Como soa de verdade</p>' +
      '<p class="sound-br">' + esc(br) + '</p><p class="sound-real" lang="en">' + esc(real) + "</p>" +
      '<div class="controls"><button class="btn btn-filled btn-capsule" data-action="speak" data-text="' + esc(real) + '">' + icon("play") + "Natural</button>" +
      '<button class="btn btn-capsule" data-action="speak" data-text="' + esc(real) + '" data-rate="0.65">Devagar</button></div></div>';
  }
  function swapsHtml(swaps) {
    if (!swaps || !swaps.length) return "";
    return '<div class="swaps"><p class="eyebrow">Troque o final e crie a sua</p><div class="chips" lang="en">' +
      swaps.map((x) => '<button class="chip" data-action="speak" data-text="' + esc(x) + '">' + esc(x) + "</button>").join("") + "</div></div>";
  }
  function sessionsOf(e) { return e.kind === "words" ? ["w:" + e.id, "f:" + e.id] : [KIND_PREFIX[e.kind] + e.id]; }
  const etapaDone = (e) => sessionsOf(e).every((sid) => S.isDone(sid)) || (e.kind === "listen" && S.isDone("f:" + e.id));
  function etapasDoneCount() { return ETAPAS.filter(etapaDone).length; }
  const phraseIds = (e) => (e.phrases || []).map((_, k) => pidOf(e, k));
  function etapaProgress(e) {
    const parts = sessionsOf(e).map((sid) => {
      if (S.isDone(sid)) return 1;
      const res = resumeFor(sid);
      let f = res ? res.i / Math.max(1, stepsLeft(res)) : 0;
      if (sid[0] === "w") f = Math.max(f, seenIn(e.idx) / e.idx.length);
      if (sid[0] === "f" || sid[0] === "s" || sid[0] === "o") f = Math.max(f, S.pcounts(phraseIds(e)).seen / Math.max(1, e.phrases.length));
      return Math.min(0.95, f);
    });
    return parts.reduce((a, b) => a + b, 0) / parts.length;
  }
  function etapaSummary(e) {
    if (e.kind === "words") return e.idx.length + " palavras · " + e.phrases.length + " frases";
    if (e.kind === "phrases") return e.phrases.length + " frases prontas";
    if (e.kind === "listen") return e.phrases.length + " frases para ouvir";
    if (e.kind === "dialog") return "Diálogo · " + e.lines.length + " falas";
    if (e.kind === "grammar") return "Lição · " + e.desc;
    return e.verbs.length + " verbos · 9 frases cada";
  }
  function etapaInfo(sid) {
    const e = etapaById[sid.slice(2)];
    const kind = SESSION_KIND[sid[0]];
    if (!e) return { kind: "unknown", n: 0, title: "Etapa", sub: "", words: [], label: "Etapa", est: "" };
    const base = { kind, etapa: e, n: e.n, title: e.name, sub: e.desc, words: [] };
    if (kind === "wordset") return Object.assign(base, { words: e.idx, label: "Etapa " + e.n + " · palavras", est: "15 min" });
    if (kind === "phrases") return Object.assign(base, { label: "Etapa " + e.n + " · frases", est: Math.max(5, Math.round(e.phrases.length * 0.7)) + " min" });
    if (kind === "dialog") return Object.assign(base, { label: "Etapa " + e.n + " · situação", est: "10 min" });
    if (kind === "listen") return Object.assign(base, { label: "Etapa " + e.n + " · ouvido", est: Math.max(6, Math.round(e.phrases.length * 1.2)) + " min" });
    if (kind === "grammar") {
      const l = grammarLesson(e.lesson);
      return Object.assign(base, { lesson: e.lesson, review: !!l.review, label: "Etapa " + e.n + " · lição", est: l.review ? "8 min" : "6 min" });
    }
    return Object.assign(base, { label: "Etapa " + e.n + " · treino", est: e.verbs.length * 2 + " min" });
  }

  /* ═══════════════════════ OUVIDO ═══════════════════════
     Do jeito que se ouve: o aluno escreve o que ouviu com letras do português e o app compara pelo som.
     soundKey() reduz qualquer escrita a uma "chave de som" (sem acentos, h = r, w = u, ch = x…). */
  function soundKey(t) {
    let s = String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");
    s = s.replace(/tch/g, "x").replace(/ch/g, "x").replace(/sh/g, "x").replace(/dj/g, "j").replace(/gu(?=[ei])/g, "g")
      .replace(/ph/g, "f").replace(/th/g, "t").replace(/ck/g, "k").replace(/qu/g, "k").replace(/c(?=[ei])/g, "s").replace(/c/g, "k")
      .replace(/h/g, "r").replace(/w/g, "u").replace(/y/g, "i").replace(/v/g, "f").replace(/z/g, "s").replace(/(.)\1+/g, "$1");
    return s;
  }
  function editDistance(a, b, free) {
    const n = a.length, m = b.length;
    let prev = new Array(m + 1);
    for (let j = 0; j <= m; j++) prev[j] = free ? 0 : j;
    for (let i = 1; i <= n; i++) {
      const cur = [i];
      for (let j = 1; j <= m; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return free ? Math.min(...prev) : prev[m];
  }
  /* 0 a 1: quanto a escrita do aluno se parece com o som da frase (inteira ou um pedaço dela). */
  function soundMatch(typed, target) {
    const a = soundKey(typed), b = soundKey(target);
    if (!a || !b) return 0;
    const whole = 1 - editDistance(a, b) / Math.max(a.length, b.length);
    const part = (1 - editDistance(a, b, true) / a.length) * (0.75 + 0.25 * Math.min(1, a.length / b.length));
    return Math.max(0, whole, a.length >= 4 ? part : 0);
  }
  let LISTEN_POOL = null;
  function listenPool() {
    if (!LISTEN_POOL) {
      LISTEN_POOL = [];
      ETAPAS.filter((e) => e.kind === "listen").forEach((e) => e.phrases.forEach((p, k) => { if (p[3]) LISTEN_POOL.push(phraseById(pidOf(e, k))); }));
    }
    return LISTEN_POOL;
  }
  function decode(text) {
    if (soundKey(text).length < 3) return [];
    return listenPool()
      .map((p) => ({ p, s: Math.max(soundMatch(text, p.br), soundMatch(text, p.real), soundMatch(text, p.en)) }))
      .filter((r) => r.s >= 0.45)
      .sort((x, y) => y.s - x.s)
      .filter((r, i, a) => a.findIndex((o) => o.p.en === r.p.en) === i)
      .slice(0, 5);
  }
  function decodeHtml(text) {
    const res = decode(text);
    if (!text.trim()) return "";
    if (!res.length) return '<p class="footnote secondary decode-empty">Ainda não achei. Tente escrever mais um pedaço, do jeito que soa.</p>';
    return list(res.map((r) =>
      '<div class="cell tappable" role="button" tabindex="0" data-action="phrase" data-pid="' + r.p.pid + '">' + speakBtn(r.p.real || r.p.en, "", "Ouvir") +
      '<span class="cell-body"><span class="cell-title decode-br">' + esc(r.p.br) + '</span><span class="cell-sub"><b lang="en">' + esc(r.p.en) + "</b> · " + esc(r.p.pt) + "</span></span>" +
      '<span class="cell-value"><span class="tag tint">' + Math.round(r.s * 100) + "%</span></span></div>"), "icons");
  }

  /* Sessão de escuta: ouvir sem ler e escrever como ouviu → ver o que é → escolher pelo som → falar igual. */
  function buildListen(e, sid) {
    const list = e.phrases;
    const all = list.map((_, k) => k);
    const steps = [{ type: "intro" }];
    for (let g = 0; g * 4 < list.length; g++) {
      const ks = all.slice(g * 4, g * 4 + 4);
      ks.forEach((k) => steps.push({ type: "hear", pid: pidOf(e, k), n: k + 1, of: list.length }));
      shuffle(ks).forEach((k, j) => {
        const p = list[k];
        const pool = list.filter((_, x) => x !== k);
        steps.push(j % 2 === 0
          ? makeChoice("O que você ouviu?", p[0], shuffle(pool).slice(0, 3).map((x) => x[0]), { listen: p[2] || p[0], pid: pidOf(e, k), e: p[0] + " = " + p[1], say: p[2] || p[0], label: "Escuta" })
          : makeChoice("O que significa o que você ouviu?", p[1], shuffle(pool).slice(0, 3).map((x) => x[1]), { listen: p[2] || p[0], pid: pidOf(e, k), e: p[0] + " = " + p[1], label: "Escuta" }));
      });
    }
    shuffle(all).slice(0, 3).forEach((k, j) => steps.push({ type: "shadow", en: list[k][2] || list[k][0], pt: list[k][1] + " · soa: " + list[k][3], k: j + 1, n: 3 }));
    steps.push({ type: "finish" });
    return sessionOf(sid, steps);
  }

  /* ───────── Sessões das etapas ───────── */
  function sessionOf(sid, steps) {
    return { mode: "node", id: sid, info: nodeInfo(sid), steps, i: 0, correct: 0, total: 0, reviewed: 0, easy: 0, startedAt: Date.now() };
  }
  /* Frases curtas e só com letras viram "monte a frase". */
  const orderable = (en) => { const n = en.replace(/[.,?!]/g, "").trim().split(/\s+/).length; return n >= 3 && n <= 9 && /^[A-Za-z' ,.?!-]+$/.test(en); };
  function phraseChoice(e, k) {
    const p = e.phrases[k];
    const wrongs = shuffle(e.phrases.filter((_, j) => j !== k).map((x) => x[0])).slice(0, 3);
    return makeChoice("Como se diz “" + p[1] + "”?", p[0], wrongs, { pid: pidOf(e, k), e: p[0] + " = " + p[1], say: p[0], label: "Frase" });
  }
  function buildEtapa(sid) {
    const e = etapaById[sid.slice(2)];
    const kind = SESSION_KIND[sid[0]];
    if (kind === "wordset") return buildWordSet(e, sid);
    if (kind === "phrases") return buildPhrases(e, sid);
    if (kind === "dialog") return buildDialog(e, sid);
    if (kind === "listen") return buildListen(e, sid);
    if (kind === "grammar") return buildTobe(e.lesson, sid);
    return buildDrill(e, sid);
  }
  function buildWordSet(e, sid) {
    const words = e.idx;
    const steps = [{ type: "intro" }];
    S.dueIds(10, words).forEach((i) => steps.push({ type: "card", i, warm: true }));
    const kinds = ["meaning", "reverse", "listen"];
    for (let g = 0; g * 5 < words.length; g++) {
      const group = words.slice(g * 5, g * 5 + 5);
      group.forEach((i, k) => steps.push({ type: "learn", i, n: g * 5 + k + 1, g: g + 1, of: words.length }));
      shuffle(group).forEach((i, k) => steps.push(quizStep(kinds[(g + k) % 3], i, words)));
    }
    shuffle(words).slice(0, 3).forEach((i, k) => steps.push({ type: "shadow", i, k: k + 1, n: 3 }));
    shuffle(words).slice(0, 3).forEach((i, k) => steps.push({ type: "speak", i, k: k + 1, n: 3 }));
    if (aiReady()) steps.push({ type: "talk", words, msgs: [] });
    steps.push({ type: "finish" });
    return sessionOf(sid, steps);
  }
  function buildPhrases(e, sid) {
    const list = e.phrases;
    const all = list.map((_, k) => k);
    const steps = [{ type: "intro" }];
    for (let g = 0; g * 5 < list.length; g++) {
      const ks = all.slice(g * 5, g * 5 + 5);
      ks.forEach((k) => steps.push({ type: "phrase", pid: pidOf(e, k), en: list[k][0], pt: list[k][1], real: list[k][2] || "", br: list[k][3] || "", swaps: Array.isArray(list[k][4]) ? list[k][4] : [], n: k + 1, of: list.length }));
      shuffle(ks).forEach((k, j) => steps.push(j % 2 === 0 && orderable(list[k][0])
        ? { type: "order", order: list[k][0], pt: list[k][1], label: "Monte a frase", pid: pidOf(e, k) }
        : phraseChoice(e, k)));
    }
    shuffle(all).slice(0, 2).forEach((k, j) => steps.push({ type: "shadow", en: list[k][2] || list[k][0], pt: list[k][1], k: j + 1, n: 2 }));
    shuffle(all).slice(0, 3).forEach((k, j) => steps.push({ type: "speak", en: list[k][0], pt: list[k][1], pid: pidOf(e, k), k: j + 1, n: 3 }));
    if (aiReady()) steps.push({ type: "talk", etapa: e.id, words: [], msgs: [] });
    steps.push({ type: "finish" });
    return sessionOf(sid, steps);
  }
  function buildDialog(e, sid) {
    const steps = [{ type: "intro" }, { type: "dialog", eid: e.id }];
    let m = 0;
    e.lines.forEach((l, k) => {
      if (l[0] !== "v") return;
      const prev = k > 0 && e.lines[k - 1][0] === "o" ? e.lines[k - 1] : null;
      steps.push({ type: "line", eid: e.id, pid: pidOf(e, m), en: l[1], pt: l[2], prevEn: prev ? prev[1] : "", prevPt: prev ? prev[2] : "", k: m + 1, n: e.mine.length });
      m += 1;
    });
    shuffle(e.mine.map((_, j) => j).filter((j) => orderable(e.mine[j][0]))).slice(0, 2)
      .forEach((j) => steps.push({ type: "order", order: e.mine[j][0], pt: e.mine[j][1], label: "Monte a frase", pid: pidOf(e, j) }));
    if (e.extra && e.extra.length) steps.push({ type: "extras", eid: e.id });
    if (aiReady()) steps.push({ type: "talk", dialog: e.id, words: [], msgs: [] });
    steps.push({ type: "finish" });
    return sessionOf(sid, steps);
  }
  function buildDrill(e, sid) {
    const steps = [{ type: "intro" }];
    e.verbs.forEach((v, vi) => {
      const forms = window.drillForms(v);
      steps.push({ type: "forms", eid: e.id, v: vi, n: vi + 1, of: e.verbs.length });
      shuffle(forms).slice(0, 2).forEach((f) => steps.push(makeChoice("Como se diz “" + f.pt + "”?", f.en, f.wrong, { e: f.tag + ": " + f.en, say: f.en, label: f.tag })));
      const f = forms[Math.floor(Math.random() * forms.length)];
      steps.push({ type: "speak", en: f.en, pt: f.pt, k: vi + 1, n: e.verbs.length });
    });
    steps.push({ type: "finish" });
    return sessionOf(sid, steps);
  }
  /* Cards de memória da etapa: palavras e frases, com as caixas de revisão. */
  function etapaIntroRows(info) {
    const e = info.etapa;
    const talk = P.steps.some((s) => s.type === "talk");
    if (info.kind === "phrases") {
      const min = Math.max(2, Math.ceil(e.phrases.length / 4)) + " min";
      const rows = [["chat", e.phrases.length + " frases prontas", "Ouça, repita e anote cada uma", min], ["zap", "Monte e escolha", "Cada frase volta num exercício", min], ["mic", "Fale em inglês", "3 frases do português para o inglês", "2 min"]];
      if (talk) rows.push(["chat", "Conversa com IA", "Use as frases desta etapa", "3 min"]);
      return rows;
    }
    if (info.kind === "listen") {
      return [
        ["headphones", e.phrases.length + " frases, sem ler", "Ouça e escreva do jeito que você ouviu, com letras do português", Math.ceil(e.phrases.length / 2) + " min"],
        ["bulb", "Veja o que é", "Como soa, o que é em inglês, o que significa e por que soa assim", ""],
        ["zap", "O que você ouviu?", "Escolha a frase e o significado só pelo som", Math.ceil(e.phrases.length / 3) + " min"],
        ["mic", "Fale igual", "Repita 3 frases no ritmo do americano", "2 min"]
      ];
    }
    if (info.kind === "dialog") {
      const rows = [["headphones", "A conversa completa", e.lines.length + " falas, com tradução e áudio", "2 min"], ["mic", "Sua vez", "Você diz as suas " + e.mine.length + " falas em inglês", "5 min"], ["zap", "Monte as falas", "2 exercícios", "1 min"]];
      if (e.extra && e.extra.length) rows.push(["chat", "Outras frases úteis", plural(e.extra.length, "frase", "frases") + " para a mesma situação", "1 min"]);
      if (talk) rows.push(["chat", "Ensaio com IA", "A IA faz o papel de " + e.who.toLowerCase(), "3 min"]);
      return rows;
    }
    return [
      ["repeat", e.verbs.length + " verbos", e.verbs.map((v) => v[0]).join(", "), ""],
      ["layers", "9 frases por verbo", "Eu, você e ela · presente e passado", ""],
      ["zap", "2 exercícios por verbo", "Escolha a forma certa", ""],
      ["mic", "1 frase por verbo", "Do português para o inglês", ""]
    ];
  }
  function etapaFinish() {
    const info = P.info;
    const e = info.etapa;
    const acc = P.total ? P.correct + "/" + P.total : "—";
    const title = "Etapa " + e.n + " · " + { wordset: "palavras concluídas", phrases: "frases concluídas", dialog: "conversa concluída", grammar: "lição concluída", drill: "treino concluído", listen: "ouvido treinado" }[info.kind];
    if (info.kind === "listen") {
      const ear = P.hearN ? Math.round(P.hearSum / P.hearN) : 0;
      return { title, lead: P.hearN ? "Seu ouvido chegou perto do som em " + ear + "% das frases que você escreveu. Repita amanhã: o ouvido acostuma rápido." : "Repita amanhã escrevendo o que ouvir: é o que treina o ouvido.", stats: [[e.phrases.length, "frases"], [acc, "pelo som"], [P.hearN ? ear + "%" : "—", "ouvido"]] };
    }
    if (info.kind === "wordset") return { title, lead: S.isDone("f:" + e.id) ? "As palavras novas voltam em 10 e 30 minutos." : "Agora decore as " + e.phrases.length + " frases prontas desta etapa.", stats: [[e.idx.length, "palavras"], [acc, "acertos"], [S.counts().seen, "estudadas"]] };
    if (info.kind === "phrases") return { title, lead: "As frases voltam nos cards e na aba Revisar.", stats: [[e.phrases.length, "frases"], [acc, "acertos"], [S.pcounts().seen, "frases vistas"]] };
    if (info.kind === "dialog") return { title, lead: "Ensaie de novo amanhã: na segunda vez a conversa sai mais solta.", stats: [[e.mine.length, "falas suas"], [acc, "acertos"], [P.minutes, "min"]] };
    if (info.kind === "grammar") {
      const gs = ETAPAS.filter((x) => x.kind === "grammar" && x.lesson[0] === e.lesson[0]);
      const lead = info.review ? "Você completou o do, does e did." : e.lesson[0] === "p" ? "Agora ouça os blocos prontos prestando atenção nesses sons." : "Use as frases da lição hoje, em voz alta.";
      return { title, lead, stats: [[acc, "acertos"], [gs.filter((x) => S.isDone("g:" + x.id)).length + "/" + gs.length, "lições"], [P.minutes, "min"]] };
    }
    return { title, lead: "Repita amanhã: com a repetição, a estrutura sai sem pensar.", stats: [[e.verbs.length, "verbos"], [acc, "acertos"], [P.minutes, "min"]] };
  }
  function etapaNextTarget(e, sid) {
    const own = sessionsOf(e).find((x) => x !== sid && !S.isDone(x));
    if (own) return { label: own[0] === "f" ? "Decorar as frases" : "Estudar as palavras", id: own };
    const nx = ETAPAS[e.n];
    return nx ? { label: "Próxima: " + nx.name, href: "etapa-" + nx.id } : null;
  }

  /* Texto simples para copiar e colar no caderno. */
  function copyText(e) {
    const out = ["Etapa " + e.n + " · " + e.name, dot(e.desc), ""];
    if (e.kind === "words") {
      out.push("PALAVRAS");
      e.idx.forEach((i) => { const w = S.word(i); out.push(w.en + " — " + w.pt); });
      out.push("");
    }
    if (e.kind === "dialog") {
      out.push("CONVERSA");
      e.lines.forEach((l) => out.push((l[0] === "v" ? "Você" : e.who) + ": " + l[1] + " (" + l[2] + ")"));
      out.push("");
      if (e.extra && e.extra.length) { out.push("OUTRAS FRASES"); e.extra.forEach((p) => out.push(p[0] + " — " + p[1])); }
    } else if (e.phrases) {
      out.push(e.phrases.some((p) => p[3]) ? "BLOCOS (inglês — português · como soa)" : "FRASES PRONTAS");
      e.phrases.forEach((p) => out.push(p[0] + " — " + p[1] + (p[3] ? " · soa: " + p[3] : "")));
    }
    if (e.kind === "grammar") {
      const l = grammarLesson(e.lesson);
      l.points.forEach((x) => out.push("• " + x));
      if (l.table) { out.push(""); l.table.forEach((r) => out.push(r.join(" — "))); }
      out.push("", "EXEMPLOS");
      l.examples.forEach((x) => out.push(x[0] + " — " + x[1]));
    }
    if (e.kind === "drill") {
      e.verbs.forEach((v) => {
        out.push(v[0].toUpperCase() + " · " + v[2]);
        window.drillForms(v).forEach((f) => out.push(f.en + " — " + f.pt));
        out.push("");
      });
    }
    return out.join("\n").trim();
  }

  function bubbleHtml(e, l, k) {
    const me = l[0] === "v";
    return '<div class="bubble ' + (me ? "me" : "ai") + '"' + (k != null ? ' data-line="' + k + '"' : "") + ">" +
      '<p class="who">' + (me ? "Você" : esc(e.who)) + '</p><p lang="en">' + esc(l[1]) + '</p><p class="tr">' + esc(l[2]) + "</p>" +
      speakBtn(l[1], "", "Ouvir") + "</div>";
  }
  const dialogHtml = (e) => '<div class="chat dialog">' + e.lines.map((l, k) => bubbleHtml(e, l, k)).join("") + "</div>";

  function tobeCard() {
    const done = S.tobeCount(), total = TOBE.length;
    return '<a class="etapa-card' + (done === total ? " done" : "") + '" href="#tobe" style="--c:var(--phase-3)"><span class="etapa-icon">' + icon("layers") + "</span>" +
      '<span class="etapa-body"><span class="etapa-num">Trilha · ' + done + "/" + total + ' lições</span><span class="etapa-title">Verbo to be</span>' +
      '<span class="etapa-sub">Ser e estar no presente, no passado e no futuro</span>' +
      '<span class="progress' + (done === total ? " good" : "") + '"><span style="width:' + Math.round((done / total) * 100) + '%"></span></span></span>' + chev() + "</a>";
  }
  function etapaCard(e) {
    const pr = Math.round(etapaProgress(e) * 100);
    const done = etapaDone(e);
    const going = sessionsOf(e).some((sid) => resumeFor(sid));
    const state = done ? "concluída" : going ? "em andamento" : pr ? "começada" : "";
    return '<a class="etapa-card' + (done ? " done" : "") + '" href="#etapa-' + e.id + '" style="--c:var(--phase-' + ((e.partIdx % 4) + 1) + ')">' +
      '<span class="etapa-icon">' + icon(e.icon || "grid") + "</span>" +
      '<span class="etapa-body"><span class="etapa-num">Etapa ' + e.n + (state ? " · " + state : "") + "</span>" +
      '<span class="etapa-title">' + esc(e.name) + "</span>" +
      '<span class="etapa-sub">' + esc(etapaSummary(e)) + "</span>" +
      '<span class="progress' + (done ? " good" : "") + '"><span style="width:' + (done ? 100 : pr) + '%"></span></span></span>' +
      (done ? '<span class="etapa-check">' + icon("checkFill") + "</span>" : chev()) + "</a>";
  }

  function viewEtapas() {
    const c = S.counts();
    const allP = ETAPAS.reduce((n, e) => n + (e.phrases ? e.phrases.length : 0), 0);
    const pc = S.pcounts();
    const done = etapasDoneCount();
    const res = Object.values(S.state.resumes).filter((r) => r.id.includes(":") && etapaById[r.id.slice(2)] && !S.isDone(r.id)).sort((x, y) => (y.at || 0) - (x.at || 0))[0];
    const nextE = ETAPAS.find((e) => !etapaDone(e));
    const bar = (label, n, total) => '<div class="dash-bar"><span class="caption secondary">' + label + '</span><div class="progress good" role="img" aria-label="' + label + ": " + n + " de " + total + '"><span style="width:' + Math.round((n / Math.max(1, total)) * 100) + '%"></span></div></div>';
    let cta;
    if (res) {
      const info = nodeInfo(res.id);
      cta = '<button class="btn btn-filled btn-large" data-action="start" data-id="' + res.id + '" data-force="1">' + icon("play") + "Continuar: " + esc(info.title) + "</button>";
    } else if (nextE) {
      cta = '<a class="btn btn-filled btn-large" href="#etapa-' + nextE.id + '">' + icon("play") + (done ? "Seguir: etapa " : "Começar: etapa ") + nextE.n + " · " + esc(nextE.name) + "</a>";
    } else {
      cta = '<p class="headline center">Você concluiu todas as etapas.</p>';
    }
    let html = ltHeader("Etapas.", { eyebrow: "Por área, em cards", second: c.seen + " de " + S.N + " palavras." }) +
      '<div class="card dash">' +
      '<div class="dash-stats">' +
      '<div><p class="eyebrow">Palavras</p><p class="dash-num">' + c.seen + "<small>/" + S.N + "</small></p></div>" +
      '<div><p class="eyebrow">Frases</p><p class="dash-num">' + pc.seen + "<small>/" + allP + "</small></p></div>" +
      '<div><p class="eyebrow">Etapas</p><p class="dash-num">' + done + "<small>/" + ETAPAS.length + "</small></p></div></div>" +
      '<div class="dash-bars">' + bar("Palavras", c.seen, S.N) + bar("Frases", pc.seen, allP) + bar("Etapas", done, ETAPAS.length) + "</div>" +
      cta +
      '<p class="footnote secondary center">Faça na ordem que quiser. Cada etapa tem palavras ou frases, cards de memória e uma lista para copiar no caderno.</p></div>';
    PARTS.forEach((p, k) => {
      const items = ETAPAS.filter((e) => e.part === p.key);
      html += '<div class="phase-divider"><span>Parte ' + (k + 1) + " · " + esc(p.name) + "</span></div>" +
        '<p class="subhead secondary center part-desc">' + esc(p.desc) + "</p>" +
        '<div class="etapa-grid">' + (p.key === "estruturas" ? tobeCard() : "") + items.map(etapaCard).join("") + "</div>";
    });
    return { html, meta: { title: "Etapas" } };
  }

  function phraseRow(e, k) {
    const p = e.phrases[k];
    const pid = pidOf(e, k);
    const st = S.pstatus(pid);
    const note = S.state.pnotes[pid];
    return cell({
      lead: speakBtn(p[2] || p[0], "", "Ouvir"), lang: "en",
      title: esc(p[0]), sub: esc(p[1]) + (p[3] ? ' · <span class="sound-inline">soa: ' + esc(p[3]) + "</span>" : "") + (note ? ' · <span class="note-mark">' + esc(note) + "</span>" : ""),
      trail: (st !== "new" ? '<span class="tag' + (st === "learned" ? " good" : " tint") + '">' + STATUS_LABEL[st] + "</span>" : "") +
        '<button class="icon-btn" data-action="phrase" data-pid="' + pid + '" aria-label="Anotar e treinar a pronúncia">' + icon("pencil") + "</button>"
    });
  }

  function viewEtapa(r) {
    const e = etapaById[r.id];
    const part = PARTS[e.partIdx];
    const btn = (sid, label, cls) => {
      const res = resumeFor(sid);
      const txt = res ? label + " · passo " + (res.i + 1) : S.isDone(sid) ? label + " de novo" : label;
      return '<button class="btn ' + (cls || "btn-filled") + ' btn-large" data-action="start" data-id="' + sid + '" data-force="1">' + icon(S.isDone(sid) && !res ? "repeat" : "play") + esc(txt) + "</button>";
    };
    let actions;
    if (e.kind === "words") actions = btn("w:" + e.id, "Estudar as " + e.idx.length + " palavras") + btn("f:" + e.id, "Decorar as " + e.phrases.length + " frases", "btn-tinted");
    else if (e.kind === "phrases") actions = btn("f:" + e.id, "Decorar as " + e.phrases.length + " frases");
    else if (e.kind === "listen") actions = btn("o:" + e.id, "Treinar o ouvido");
    else if (e.kind === "dialog") actions = btn("s:" + e.id, "Ensaiar a conversa") + '<button class="btn btn-tinted btn-large" data-action="play-dialog" data-eid="' + e.id + '">' + icon("headphones") + "Ouvir a conversa inteira</button>";
    else if (e.kind === "grammar") actions = btn("g:" + e.id, "Fazer a lição");
    else actions = btn("k:" + e.id, "Começar o treino");
    if (e.phrases || e.idx) actions += '<button class="btn btn-plain" data-action="deck" data-eid="' + e.id + '">' + icon("cards") + "Cards para memorizar</button>";
    const second = e.kind === "words" ? e.idx.length + " palavras e " + e.phrases.length + " frases."
      : e.kind === "phrases" ? e.phrases.length + " frases prontas."
        : e.kind === "listen" ? e.phrases.length + " frases para ouvir."
        : e.kind === "dialog" ? "Uma conversa de " + e.lines.length + " falas."
          : e.kind === "grammar" ? dot(e.desc) : e.verbs.length + " verbos, 9 frases cada.";
    let html = ltHeader(esc(e.name) + ".", { eyebrow: "Etapa " + e.n + " · " + esc(part.name), second: esc(second), avatar: false }) +
      '<div class="card dash"><p class="subhead secondary">' + esc(dot(e.desc)) + "</p>" +
      '<div class="dash-bar"><span class="caption secondary">Progresso</span><div class="progress good"><span style="width:' + (etapaDone(e) ? 100 : Math.round(etapaProgress(e) * 100)) + '%"></span></div></div>' +
      actions + "</div>";
    if (e.kind === "words") html += section("Palavras", list(e.idx.map(wordRow), "icons"), "Toque numa palavra para ouvir, testar a pronúncia e anotar.");
    if (e.kind === "dialog") {
      html += section("A conversa", dialogHtml(e), "Você conversa com: " + esc(e.who.toLowerCase()) + ". Toque no alto-falante para ouvir cada fala.");
      if (e.extra && e.extra.length) html += section("Outras frases úteis", list(e.extra.map((_, j) => phraseRow(e, e.mine.length + j)), "icons"));
    } else if (e.phrases) {
      html += section(e.kind === "words" ? "Frases prontas" : "Frases", list(e.phrases.map((_, k) => phraseRow(e, k)), "icons"), "Toque no lápis para anotar e testar a pronúncia. As frases também entram nos cards.");
    }
    if (e.kind === "grammar") {
      const l = grammarLesson(e.lesson);
      if (l.points.length) html += section("Explicação", list(l.points.map((pt, k) => cell({ lead: '<span class="wbadge">' + (k + 1) + "</span>", title: esc(pt) })), "icons"));
      if (l.table) html += section("Tabela", '<div class="card table-wrap"><table class="cola-table"><tbody>' + l.table.map((row) => "<tr>" + row.map((c, k) => (k ? "<td" + (k === 1 ? ' lang="en"' : "") + ">" : '<th scope="row">') + esc(c) + (k ? "</td>" : "</th>")).join("") + "</tr>").join("") + "</tbody></table></div>");
      html += section("Exemplos", list(l.examples.map((x) => cell({ lead: speakBtn(x[0], "", "Ouvir"), title: esc(x[0]), sub: esc(x[1]), lang: "en" })), "icons"));
    }
    if (e.kind === "drill") {
      html += e.verbs.map((v) => section('<span lang="en">' + esc(v[0]) + " · " + esc(v[2]) + "</span>",
        list(window.drillForms(v).map((f) => cell({ lead: speakBtn(f.en, "", "Ouvir"), title: esc(f.en), sub: esc(f.pt) + ' · <span class="tertiary">' + esc(f.tag) + "</span>", lang: "en" })), "icons"))).join("");
    }
    html += section("Para anotar no caderno",
      '<div class="card copy-card"><pre class="copy-text" id="copy-text">' + esc(copyText(e)) + "</pre></div>" +
      '<button class="btn btn-tinted copy-btn" data-action="copy-etapa" data-eid="' + e.id + '">' + icon("copy") + "Copiar a lista</button>",
      "Cole no seu caderno ou nas notas do celular. Escrever à mão ajuda a fixar.");
    const prev = ETAPAS[e.n - 2], nx = ETAPAS[e.n];
    const nav = [];
    if (prev) nav.push(cell({ href: "#etapa-" + prev.id, icon: prev.icon || "grid", title: "Etapa anterior", sub: esc(prev.name), chevron: true }));
    if (nx) nav.push(cell({ href: "#etapa-" + nx.id, icon: nx.icon || "grid", title: "Próxima etapa", sub: esc(nx.name), chevron: true }));
    nav.push(cell({ href: "#etapas", icon: "grid", title: "Todas as etapas", chevron: true }));
    html += list(nav, "icons");
    return { html, meta: { title: e.name } };
  }

  function openPhraseSheet(pid) {
    const p = phraseById(pid);
    if (!p) return;
    const c = S.pcard(pid);
    const wrap = document.createElement("div");
    wrap.className = "sheet-backdrop";
    wrap.innerHTML =
      '<div class="sheet" role="dialog" aria-modal="true" aria-label="Frase"><div class="sheet-grabber"></div>' +
      '<div class="sheet-head"><span class="eyebrow">Etapa ' + p.etapa.n + " · " + esc(p.etapa.name) + " · " + STATUS_LABEL[S.pstatus(pid)] + (c ? " · caixa " + c.box : "") + '</span><button class="close-btn" data-sheet-close aria-label="Fechar">' + icon("x") + "</button></div>" +
      '<div class="word-top"><p class="phrase-en" style="min-width:0"><span lang="en">' + esc(p.en) + '</span><span class="word-pt">' + esc(p.pt) + "</span></p>" + speakBtn(p.en, "lg", "Ouvir") + "</div>" +
      '<div class="controls"><button class="btn btn-capsule" data-action="speak" data-text="' + esc(p.en) + '" data-rate="0.6">Devagar</button>' +
      (SP.hasMic ? '<button class="btn btn-capsule" data-action="mic-text" data-text="' + esc(p.en) + '">' + icon("mic") + "Testar pronúncia</button>" : "") + "</div>" +
      '<div class="mic-result" id="mic-result" hidden></div>' +
      soundBox(p.real, p.br) + (p.why ? '<p class="subhead secondary why-line">' + icon("bulb", "icon-sm") + "<span>" + esc(p.why) + "</span></p>" : "") + swapsHtml(p.swaps) +
      '<div class="field-note"><label class="eyebrow" for="sheet-pnote">Sua anotação</label><textarea id="sheet-pnote" class="note-box" data-input="pnote" data-pid="' + pid + '" placeholder="Quando usar, uma variação, uma frase sua">' + esc(S.state.pnotes[pid] || "") + "</textarea></div>" +
      "</div>";
    const close = () => {
      wrap.remove();
      document.removeEventListener("keydown", onKey, true);
      if (!P) { const y = window.scrollY; render(); window.scrollTo(0, y); }
    };
    const onKey = (ev) => { if (ev.key === "Escape") { ev.stopPropagation(); close(); } };
    wrap.addEventListener("click", (ev) => { if (ev.target === wrap || ev.target.closest("[data-sheet-close]")) close(); });
    document.addEventListener("keydown", onKey, true);
    document.body.appendChild(wrap);
    if (S.state.settings.autoplay) setTimeout(() => SP.speak(p.real || p.en), 200);
  }

  /* ═══════════════════════ SEMANA ═══════════════════════
     Plano de 7 dias: as palavras em ordem de frequência (Lei de Zipf), os blocos prontos com o som real,
     a gramática e as situações. Cada tarefa é uma rodada, prova, lição ou sessão de etapa já existente. */
  const WEEK = [
    { title: "O núcleo da língua", goal: "Palavras 1 a 100, o som real, números e cores", upto: 100,
      tasks: ["g:som", "r1", "r2", "f:bl-oi", "r3", "r4", "t1", "w:numeros", "w:cores", "s:cafeteria"] },
    { title: "Ação e vontade", goal: "Palavras 101 a 200, gonna e wanna, do e don't", upto: 200,
      tasks: ["r5", "c1", "f:bl-gonna", "r6", "r7", "t2", "r8", "g:d1", "w:frutas", "w:calendario", "s:restaurante"] },
    { title: "Perguntar e reagir", goal: "Palavras 201 a 300, perguntas e reações das séries", upto: 300,
      tasks: ["r9", "r10", "c2", "f:bl-perguntas", "r11", "t3", "t4", "r12", "g:d2", "f:bl-reacoes", "w:comida", "w:compras", "s:balada", "s:academia"] },
    { title: "Pedir e resolver", goal: "Palavras 301 a 400, pedidos e viagem", upto: 400,
      tasks: ["r13", "r14", "f:bl-pedir", "r15", "c3", "t5", "r16", "g:d3", "k:treino1", "w:roupas", "w:aeroporto", "w:hotel", "s:checkin", "s:imigracao"] },
    { title: "Fechando as 500", goal: "Palavras 401 a 500, verbos frasais e o passado com did", upto: 500,
      tasks: ["r17", "r18", "f:bl-frasais", "r19", "r20", "c4", "t6", "t7", "g:d4", "k:treino2", "w:transporte", "w:emergencias", "w:ligacao", "s:hospedagem", "s:uber"] },
    { title: "Pessoas e opinião", goal: "Relacionamentos, família, sentimentos e a rotina", upto: 500,
      tasks: ["f:bl-opiniao", "f:bl-rotina", "w:relacionamentos", "t8", "t9", "w:familia", "g:d5", "w:sentimentos", "k:treino3", "w:saude", "w:casa", "s:encontro", "s:loja", "s:farmacia", "s:direcoes"] },
    { title: "Trabalho e séries", goal: "Negócios, startups e as falas dos filmes e séries", upto: 500,
      tasks: ["f:bl-trabalho", "f:bl-series", "w:negocios", "t10", "t11", "w:startups", "g:d6", "k:treino4", "w:escritorio", "w:dinheiro", "s:reuniao", "s:pitch", "s:entrevista"] }
  ];
  const dayDone = (d) => d.tasks.filter((id) => S.isDone(id)).length;
  const currentDay = () => { const k = WEEK.findIndex((d) => dayDone(d) < d.tasks.length); return k < 0 ? WEEK.length - 1 : k; };

  function taskInfo(id) {
    if (id.includes(":")) {
      const info = nodeInfo(id);
      const e = info.etapa;
      const prefix = { wordset: "Palavras", phrases: e.part === "blocos" ? "Blocos" : "Frases", dialog: "Situação", grammar: "Lição", drill: "Treino" }[info.kind];
      return { title: prefix + ": " + e.name, sub: etapaSummary(e), icon: e.icon || "grid", est: info.est };
    }
    const info = nodeInfo(id);
    if (info.kind === "round") return { title: "Rodada " + info.n + ": " + info.title, sub: "Palavras " + (info.words[0] + 1) + " a " + (info.words[24] + 1), icon: "layers", est: info.est };
    if (info.kind === "check") return { title: "Prova do bloco " + info.n, sub: "30 palavras do bloco, do português para o inglês", icon: "trophy", est: info.est };
    return { title: "To be: " + info.title, sub: info.sub, icon: "book", est: info.est };
  }
  function taskRow(id, next) {
    const t = taskInfo(id);
    const done = S.isDone(id);
    const res = resumeFor(id);
    const tag = done ? '<span class="tag good">Feita</span>' : res ? '<span class="tag tint">Passo ' + (res.i + 1) + "</span>" : id === next ? '<span class="tag tint">Próxima</span>' : '<span class="caption secondary">' + esc(t.est) + "</span>";
    return cell({ action: "start", attrs: 'data-id="' + id + '" data-force="1"', icon: t.icon, title: esc(t.title), sub: esc(t.sub), value: tag, cls: done ? "done-row" : "" });
  }

  /* ───────── A Lei de Zipf: quanto do texto as N palavras mais usadas cobrem ─────────
     Modelo: frequência ∝ 1/posição. Calibrado para as 100 primeiras cobrirem cerca de 50%
     (Oxford English Corpus). É uma estimativa por forma de palavra. */
  const ZIPF_V = 18000;
  const HARM = [0];
  for (let k = 1; k <= ZIPF_V; k++) HARM[k] = HARM[k - 1] + 1 / k;
  const coverage = (n) => Math.round((HARM[Math.max(0, Math.min(ZIPF_V, Math.round(n)))] / HARM[ZIPF_V]) * 100);

  function zipfChart(you) {
    const W = 340, H = 210, L = 38, R = 14, T = 16, B = 34;
    const x = (n) => L + (n / 1000) * (W - L - R);
    const y = (pct) => T + (1 - pct / 100) * (H - T - B);
    const pts = [];
    for (let n = 0; n <= 1000; n += n < 30 ? 1 : n < 200 ? 5 : 20) pts.push([n, coverage(n)]);
    const line = pts.map((p, k) => (k ? "L" : "M") + x(p[0]).toFixed(1) + " " + y(p[1]).toFixed(1)).join(" ");
    const youN = Math.max(0, Math.min(1000, you));
    const areaPts = pts.filter((p) => p[0] <= youN).concat([[youN, coverage(youN)]]);
    const area = youN > 0 ? "M" + x(0) + " " + y(0) + " " + areaPts.map((p) => "L" + x(p[0]).toFixed(1) + " " + y(p[1]).toFixed(1)).join(" ") + " L" + x(youN).toFixed(1) + " " + y(0) + " Z" : "";
    const grid = [25, 50, 75, 100].map((g) => '<line class="grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + y(g) + '" y2="' + y(g) + '"/><text class="tick" x="' + (L - 6) + '" y="' + (y(g) + 4) + '" text-anchor="end">' + g + "%</text>").join("");
    const xt = [0, 250, 500, 750, 1000].map((n) => '<text class="tick" x="' + x(n) + '" y="' + (H - B + 16) + '" text-anchor="middle">' + n + "</text>").join("");
    const marks = [[100, "start"], [500, "middle"], [1000, "end"]].map(([n, anchor]) =>
      '<circle class="mark" cx="' + x(n) + '" cy="' + y(coverage(n)) + '" r="4.5"/>' +
      '<text class="mark-label" x="' + (x(n) + (anchor === "start" ? 8 : 0)) + '" y="' + (y(coverage(n)) + (anchor === "start" ? 16 : 18)) + '" text-anchor="' + anchor + '">' + n + " · " + coverage(n) + "%</text>").join("");
    const youMark = youN > 0
      ? '<line class="you-line" x1="' + x(youN) + '" x2="' + x(youN) + '" y1="' + y(coverage(youN)) + '" y2="' + y(0) + '"/>' +
        '<circle class="you-dot" cx="' + x(youN) + '" cy="' + y(coverage(youN)) + '" r="5"/>' +
        '<text class="you-label" x="' + Math.min(W - R - 2, Math.max(L + 2, x(youN))) + '" y="' + (y(coverage(youN)) - 10) + '" text-anchor="' + (youN > 850 ? "end" : youN < 60 ? "start" : "middle") + '">Você: ' + youN + "</text>"
      : "";
    return '<div class="zipf" id="zipf"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Curva da Lei de Zipf: com 100 palavras você cobre cerca de ' + coverage(100) + "% do texto, com 500 cerca de " + coverage(500) + "% e com 1000 cerca de " + coverage(1000) + '%. Você está em ' + youN + ' palavras.">' +
      grid + xt + (area ? '<path class="area" d="' + area + '"/>' : "") + '<path class="curve" d="' + line + '"/>' + marks + youMark +
      '<line class="cross" x1="0" x2="0" y1="' + T + '" y2="' + y(0) + '" hidden/>' +
      '<text class="axis-title" x="' + ((L + W - R) / 2) + '" y="' + (H - 4) + '" text-anchor="middle">Palavras aprendidas, das mais usadas para as menos</text>' +
      '</svg><div class="zipf-tip" role="status" hidden></div></div>';
  }
  function bindZipf() {
    const box = $("#zipf");
    if (!box) return;
    const svg = $("svg", box), tip = $(".zipf-tip", box), cross = $(".cross", box);
    const W = 340, L = 38, R = 14;
    const show = (ev) => {
      const r = svg.getBoundingClientRect();
      const vx = ((ev.clientX - r.left) / r.width) * W;
      const n = Math.round(Math.max(0, Math.min(1000, ((vx - L) / (W - L - R)) * 1000)));
      cross.setAttribute("x1", vx); cross.setAttribute("x2", vx); cross.hidden = vx < L || vx > W - R;
      tip.hidden = cross.hidden;
      tip.textContent = n + " palavras ≈ " + coverage(n) + "% do texto";
      tip.style.left = Math.max(0, Math.min(r.width - 150, ev.clientX - r.left - 75)) + "px";
    };
    svg.addEventListener("pointermove", show);
    svg.addEventListener("pointerdown", show);
    svg.addEventListener("pointerleave", () => { tip.hidden = true; cross.hidden = true; });
  }

  function zipfStudy(you) {
    return '<div class="card zipf-card">' + zipfChart(you) +
      '<table class="cola-table zipf-table"><thead><tr><th>Palavras mais usadas</th><th>Quanto do texto cobrem</th></tr></thead><tbody>' +
      [10, 100, 500, 1000].map((n) => "<tr><th scope=\"row\">" + n + "</th><td>≈ " + coverage(n) + "%</td></tr>").join("") + "</tbody></table></div>" +
      list([
        cell({ icon: "zap", title: "A curva despenca", sub: "No seu gráfico, “de” aparece o dobro de “a” e o triplo de “que”. No inglês é igual: the, be, to, of, and. Só as 10 primeiras já são cerca de 25% de tudo." }),
        cell({ icon: "target", title: "Por isso a semana começa pelo topo", sub: "As 100 primeiras palavras formam cerca de metade de qualquer texto. Cada palavra do começo da fila rende muito mais do que uma do fim." }),
        cell({ icon: "chat", title: "Depois, o que mais rende são os blocos", sub: "Passando das 1000, cada palavra nova acrescenta pouco. Mas mais da metade do que o nativo fala é feita de blocos prontos. Por isso a semana mistura palavras e blocos todo dia." })
      ], "icons");
  }

  function dayCard(d, k, cur) {
    const done = dayDone(d), total = d.tasks.length;
    const finished = done === total;
    const state = finished ? "concluído" : k === cur ? "hoje" : done ? "começado" : "";
    return '<a class="etapa-card' + (finished ? " done" : "") + (k === cur ? " today" : "") + '" href="#dia-' + (k + 1) + '" style="--c:var(--phase-' + ((k % 4) + 1) + ')">' +
      '<span class="etapa-icon day-num">' + (k + 1) + "</span>" +
      '<span class="etapa-body"><span class="etapa-num">Dia ' + (k + 1) + (state ? " · " + state : "") + "</span>" +
      '<span class="etapa-title">' + esc(d.title) + "</span>" +
      '<span class="etapa-sub">' + esc(d.goal) + " · " + done + "/" + total + "</span>" +
      '<span class="progress' + (finished ? " good" : "") + '"><span style="width:' + Math.round((done / total) * 100) + '%"></span></span></span>' +
      (finished ? '<span class="etapa-check">' + icon("checkFill") + "</span>" : chev()) + "</a>";
  }
  function dayCta(d) {
    const res = d.tasks.find((id) => resumeFor(id) && !S.isDone(id));
    const next = res || d.tasks.find((id) => !S.isDone(id));
    if (!next) return { next: null, html: '<p class="headline center">Dia concluído. Amanhã, comece pela aba Revisar.</p>' };
    return { next, html: '<button class="btn btn-filled btn-large" data-action="start" data-id="' + next + '" data-force="1">' + icon("play") + (res ? "Continuar: " : "Começar: ") + esc(taskInfo(next).title) + "</button>" };
  }

  function viewSemana() {
    const cur = currentDay();
    const d = WEEK[cur];
    const cta = dayCta(d);
    const you = S.coreCounts().seen;
    const allDone = WEEK.every((x) => dayDone(x) === x.tasks.length);
    const html =
      ltHeader("Sua semana.", { eyebrow: "Plano de 7 dias", second: allDone ? "Semana concluída." : "Hoje é o dia " + (cur + 1) + "." }) +
      '<div class="card dash"><p class="eyebrow">Hoje · Dia ' + (cur + 1) + "</p>" +
      '<p class="title2">' + esc(d.title) + '</p><p class="subhead secondary">' + esc(d.goal) + ". Cerca de 2 a 3 horas, no seu ritmo.</p>" +
      '<div class="dash-bar"><span class="caption secondary">Hoje</span><div class="progress good"><span style="width:' + Math.round((dayDone(d) / d.tasks.length) * 100) + '%"></span></div></div>' +
      cta.html + "</div>" +
      section("Tarefas de hoje", list(d.tasks.map((id) => taskRow(id, cta.next)), "icons"), "Faça na ordem: as palavras vêm das mais usadas para as menos usadas, e cada dia mistura palavras, blocos prontos, gramática e uma situação.") +
      section("O gráfico: poucas palavras fazem quase tudo", zipfStudy(you), "Estimativa pela Lei de Zipf, contando cada forma de palavra. A linha mostra quanto do texto você cobre conforme aprende as palavras mais usadas.") +
      section("Os 7 dias", '<div class="etapa-grid">' + WEEK.map((x, k) => dayCard(x, k, cur)).join("") + "</div>") +
      list([
        cell({ href: "#metodo", icon: "bulb", title: "O método e a pesquisa", sub: "Lei de Zipf, blocos prontos, filmes e séries e a fala encadeada", chevron: true }),
        cell({ href: "#intensivo", icon: "route", title: "Prefere fazer as 500 num dia?", sub: "O intensivo de 8 horas continua disponível", chevron: true })
      ], "icons");
    return { html, meta: { title: "Semana", hideNav: false }, after: bindZipf };
  }

  function viewDia(r) {
    const k = r.day;
    const d = WEEK[k];
    const cta = dayCta(d);
    const prev = WEEK[k - 1], nx = WEEK[k + 1];
    const nav = [];
    if (prev) nav.push(cell({ href: "#dia-" + k, icon: "calendar", title: "Dia " + k, sub: esc(prev.title), chevron: true }));
    if (nx) nav.push(cell({ href: "#dia-" + (k + 2), icon: "calendar", title: "Dia " + (k + 2), sub: esc(nx.title), chevron: true }));
    const html =
      ltHeader("Dia " + (k + 1) + ".", { eyebrow: "Plano de 7 dias", second: esc(d.title) + ".", avatar: false }) +
      '<div class="card dash"><p class="subhead secondary">' + esc(d.goal) + "." + (d.upto <= 500 && k < 5 ? " Ao fim do dia, as " + d.upto + " palavras mais usadas cobrem cerca de " + coverage(d.upto) + "% de tudo que se lê e ouve." : "") + "</p>" +
      '<div class="dash-bar"><span class="caption secondary">Progresso</span><div class="progress good"><span style="width:' + Math.round((dayDone(d) / d.tasks.length) * 100) + '%"></span></div></div>' +
      cta.html + "</div>" +
      section("Tarefas", list(d.tasks.map((id) => taskRow(id, cta.next)), "icons"), "Toque numa tarefa para começar ou refazer.") +
      list(nav, "icons");
    return { html, meta: { title: "Dia " + (k + 1) } };
  }

  /* ═══════════════════════ OUVIR · CONVERSAR · MAIS ═══════════════════════
     O app gira em torno de ouvir e conversar como o americano fala. Vocabulário e gramática ficam em "Mais". */
  function startBtn(id, label, cls) {
    return '<button class="btn ' + (cls || "btn-filled") + ' btn-large" data-action="start" data-id="' + id + '" data-force="1">' + icon("play") + esc(label) + "</button>";
  }
  function viewOuvir() {
    const listens = ETAPAS.filter((e) => e.kind === "listen");
    const ear = listens.filter((e) => e.part === "ouvido");
    const blocks = listens.filter((e) => e.part !== "ouvido");
    const ids = listens.flatMap(phraseIds);
    const pc = S.pcounts(ids);
    const res = Object.values(S.state.resumes).filter((r) => (r.id.startsWith("o:") || r.id === "g:som") && etapaById[r.id.slice(2)] && !S.isDone(r.id)).sort((x, y) => (y.at || 0) - (x.at || 0))[0];
    const som = etapaById.som;
    const nextE = ear.concat(blocks).find((e) => !etapaDone(e));
    let cta = "";
    if (res) cta = startBtn(res.id, "Continuar: " + nodeInfo(res.id).title);
    else if (som && !etapaDone(som)) cta = startBtn("g:som", "Começar: as regras do som americano");
    else if (nextE) cta = startBtn("o:" + nextE.id, "Treinar: " + nextE.name);
    const html =
      ltHeader("Ouvir.", { eyebrow: "Escuta e fonética", second: "Entenda o que o americano fala." }) +
      '<div class="card dash"><p class="subhead secondary">Primeiro o ouvido, depois a gramática. Ouça sem ler, escreva do jeito que ouviu, veja o que é em inglês e o que significa. Depois fale igual.</p>' +
      '<div class="dash-bar"><span class="caption secondary">Frases</span><div class="progress good" role="img" aria-label="' + pc.seen + " de " + ids.length + ' frases ouvidas"><span style="width:' + Math.round((pc.seen / Math.max(1, ids.length)) * 100) + '%"></span></div></div>' +
      '<p class="footnote secondary">' + pc.seen + " de " + ids.length + " frases ouvidas · " + pc.learned + " já fixadas nos cards.</p>" + cta + "</div>" +
      section("Escreva o que você ouviu",
        '<div class="card decode-card"><label class="sr-only" for="decode-box">O que você ouviu</label>' +
        '<input class="note-box hear-box" id="decode-box" data-input="decode" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Ex.: uarzirevtudumi">' +
        '<div id="decode-results"></div></div>',
        "Ouviu algo numa série ou na rua? Escreva com letras do português, do jeito que soou. O app procura a frase, mostra o que é em inglês e o que significa.") +
      section("Comece aqui", list([cell({ action: "start", attrs: 'data-id="g:som" data-force="1"', icon: "bulb", title: "As regras do som americano", sub: "Gonna, o T que vira R, o you que vira iâ e as palavras que se juntam", value: som && etapaDone(som) ? '<span class="tag good">Feita</span>' : "", chevron: true })], "icons")) +
      '<div class="phase-divider"><span>Treino de ouvido</span></div>' +
      '<div class="etapa-grid">' + ear.map(etapaCard).join("") + "</div>" +
      '<div class="phase-divider"><span>Frases do dia a dia</span></div>' +
      '<div class="etapa-grid">' + blocks.map(etapaCard).join("") + "</div>" +
      list([
        cell({ href: "#conversar", icon: "chat", title: "Conversar", sub: "Ouça a outra pessoa e responda em situações reais", chevron: true }),
        cell({ href: "#revisar", icon: "cards", title: "Cards", sub: "Revise as frases que você ouviu, como no Anki", chevron: true })
      ], "icons");
    return { html, meta: { title: "Ouvir" } };
  }

  function viewConversar() {
    const ds = ETAPAS.filter((e) => e.kind === "dialog");
    const done = ds.filter(etapaDone).length;
    const res = Object.values(S.state.resumes).filter((r) => r.id.startsWith("s:") && etapaById[r.id.slice(2)] && !S.isDone(r.id)).sort((x, y) => (y.at || 0) - (x.at || 0))[0];
    const next = ds.find((e) => !etapaDone(e));
    const cta = res ? startBtn(res.id, "Continuar: " + nodeInfo(res.id).title) : next ? startBtn("s:" + next.id, "Ensaiar: " + next.name) : "";
    const html =
      ltHeader("Conversar.", { eyebrow: "Situações reais", second: "Ouça e responda como o americano." }) +
      '<div class="card dash"><p class="subhead secondary">Primeiro você ouve a conversa inteira, no ritmo real. Depois a outra pessoa fala e você responde em inglês, em voz alta. A tradução e o som de cada fala ficam na tela.</p>' +
      '<div class="dash-bar"><span class="caption secondary">Conversas</span><div class="progress good"><span style="width:' + Math.round((done / Math.max(1, ds.length)) * 100) + '%"></span></div></div>' +
      '<p class="footnote secondary">' + done + " de " + ds.length + " conversas ensaiadas.</p>" + cta + "</div>" +
      '<div class="etapa-grid">' + ds.map(etapaCard).join("") + "</div>";
    return { html, meta: { title: "Conversar" } };
  }

  function viewMais() {
    const c = S.counts();
    const core = S.coreCounts();
    const html =
      ltHeader("Mais.", { eyebrow: "Para depois", second: "Vocabulário e gramática." }) +
      '<p class="subhead secondary">O foco agora é ouvir e conversar. Aqui ficam as outras trilhas, com todo o seu progresso guardado.</p>' +
      section("Vocabulário", list([
        cell({ href: "#semana", icon: "calendar", title: "Plano de 7 dias", sub: "As palavras em ordem de frequência (Lei de Zipf)", chevron: true }),
        cell({ href: "#intensivo", icon: "route", title: "Intensivo de 8 horas", sub: "As 500 palavras essenciais · " + core.seen + " de 500 estudadas", chevron: true }),
        cell({ href: "#etapas", icon: "grid", title: "Etapas por área", sub: "Números, comida, aeroporto, negócios, startups e mais", chevron: true }),
        cell({ href: "#palavras", icon: "textformat", title: "Todas as palavras", sub: c.seen + " de " + S.N + " estudadas", chevron: true })
      ], "icons")) +
      section("Gramática", list([
        cell({ href: "#tobe", icon: "layers", title: "Verbo to be", sub: S.tobeCount() + " de " + TOBE.length + " lições", chevron: true }),
        cell({ href: "#etapa-d1", icon: "book", title: "Do, does e did", sub: "Afirmar, negar e perguntar no presente e no passado", chevron: true })
      ], "icons")) +
      section("App", list([
        cell({ href: "#metodo", icon: "bulb", title: "Método e pesquisa", chevron: true }),
        cell({ href: "#ajustes", icon: "gear", title: "Ajustes", sub: "Nuvem, voz, tema e backup", chevron: true })
      ], "icons"));
    return { html, meta: { title: "Mais" } };
  }

  const VIEWS = { ouvir: viewOuvir, conversar: viewConversar, mais: viewMais, semana: viewSemana, dia: viewDia, deck: viewDeck, intensivo: viewIntensivo, etapas: viewEtapas, etapa: viewEtapa, tobe: viewTobe, palavras: viewPalavras, revisar: viewRevisar, caderno: viewCaderno, metodo: viewMetodo, ajustes: viewAjustes };

  /* ═══════════════════════ PAUSA ═══════════════════════ */
  let breakTimer = null;
  function openBreak() {
    const startAt = Date.now();
    const endAt = startAt + S.BREAK_MIN * MIN;
    const el = document.createElement("div");
    el.className = "player break";
    el.id = "break";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Pausa");
    el.innerHTML = '<div class="player-head"><button class="close-btn" data-action="end-break" aria-label="Voltar a estudar">' + icon("x") + "</button></div>" +
      '<div class="player-body"><div class="player-inner break-inner">' +
      '<p class="eyebrow center">Pausa</p><p class="break-clock" id="break-clock">10:00</p>' +
      '<h1 class="large-title two-tone center">Descanse.<span class="second">A memória trabalha agora.</span></h1>' +
      list([
        cell({ icon: "coffee", title: "Beba água e levante", sub: "Ande um pouco. O corpo parado cansa a cabeça." }),
        cell({ icon: "moon", title: "Longe da tela", sub: "Olhe pela janela, para longe." }),
        cell({ icon: "mic", title: "Se quiser, fale sozinho", sub: "Diga em voz alta 5 palavras que você lembra." })
      ], "icons") +
      "</div></div>" +
      '<div class="player-foot"><div class="player-foot-inner"><button class="btn btn-filled btn-large" data-action="end-break">Voltar a estudar</button></div></div>';
    el.dataset.start = startAt;
    document.body.appendChild(el);
    document.body.style.overflow = "hidden";
    const tick = () => {
      const left = Math.max(0, endAt - Date.now());
      const m = Math.floor(left / MIN), s = Math.floor((left % MIN) / 1000);
      const c = $("#break-clock");
      if (c) c.textContent = m + ":" + String(s).padStart(2, "0");
      if (!left) { clearInterval(breakTimer); if (c) c.textContent = "Pronto"; haptic([40, 60, 40]); }
    };
    tick();
    breakTimer = setInterval(tick, 1000);
  }
  function endBreak() {
    const el = $("#break");
    if (!el) return;
    clearInterval(breakTimer);
    S.logBreak(+el.dataset.start);
    el.remove();
    document.body.style.overflow = "";
    render();
  }

  /* ═══════════════════════ PLAYER ═══════════════════════ */

  let P = null;

  function makeChoice(q, correct, wrongs, extra) {
    const opts = shuffle([correct].concat(wrongs));
    return Object.assign({ type: "choice", q, o: opts, a: opts.indexOf(correct) }, extra || {});
  }
  function distractors(pool, i, field, n) {
    const target = S.word(i)[field].toLowerCase();
    const seen = new Set([target]);
    const out = [];
    shuffle(pool).forEach((j) => {
      const val = S.word(j)[field];
      if (out.length < n && !seen.has(val.toLowerCase())) { seen.add(val.toLowerCase()); out.push(val); }
    });
    return out;
  }
  function quizStep(kind, i, pool) {
    const w = S.word(i);
    if (kind === "listen" && !SP.hasTTS) kind = "reverse";
    const base = { wi: i, e: w.en + " = " + w.pt, say: w.en };
    if (kind === "meaning") return makeChoice("O que significa “" + w.en + "”?", w.pt, distractors(pool, i, "pt", 3), Object.assign(base, { label: "Significado" }));
    if (kind === "reverse") return makeChoice("Como se diz “" + w.pt + "” em inglês?", w.en, distractors(pool, i, "en", 3), Object.assign(base, { label: "Em inglês" }));
    return makeChoice("Ouça e escolha a palavra.", w.en, distractors(pool, i, "en", 3), Object.assign(base, { listen: w.en, label: "Escuta" }));
  }

  function buildRound(r) {
    const words = S.roundRange(r);
    const steps = [{ type: "intro" }];
    S.dueIds(15, words).forEach((i) => steps.push({ type: "card", i, warm: true }));
    const kinds = ["meaning", "reverse", "listen"];
    for (let g = 0; g < 5; g++) {
      const group = words.slice(g * 5, g * 5 + 5);
      group.forEach((i, k) => steps.push({ type: "learn", i, n: g * 5 + k + 1, g: g + 1 }));
      shuffle(group).forEach((i, k) => steps.push(quizStep(kinds[(g + k) % 3], i, words)));
    }
    shuffle(words).slice(0, 3).forEach((i, k) => steps.push({ type: "shadow", i, k: k + 1, n: 3 }));
    shuffle(words).slice(0, 3).forEach((i, k) => steps.push({ type: "speak", i, k: k + 1, n: 3 }));
    if (aiReady()) steps.push({ type: "talk", words, msgs: [] });
    steps.push({ type: "finish" });
    return { mode: "node", id: "r" + r, info: nodeInfo("r" + r), steps, i: 0, correct: 0, total: 0, reviewed: 0, easy: 0, startedAt: Date.now() };
  }

  function buildCheck(b) {
    const words = S.blockRange(b);
    const notLearned = shuffle(words.filter((i) => S.status(i) !== "learned"));
    const learned = shuffle(words.filter((i) => S.status(i) === "learned"));
    const pick = notLearned.slice(0, 20).concat(learned).slice(0, 30);
    const steps = [{ type: "intro" }].concat(shuffle(pick).map((i) => ({ type: "card", i, dir: "pt", check: true })));
    steps.push({ type: "finish" });
    return { mode: "node", id: "c" + b, info: nodeInfo("c" + b), steps, i: 0, correct: 0, total: 0, reviewed: 0, easy: 0, startedAt: Date.now() };
  }

  function buildReview(kind) {
    let ids;
    if (kind === "left") ids = S.leftIds(30);
    else if (kind === "random") ids = shuffle(Object.keys(S.state.cards).map(Number)).slice(0, 20);
    else ids = S.dueIds(40);
    const steps = ids.map((i) => ({ type: "card", i }));
    steps.push({ type: "finish" });
    return { mode: "review", kind, steps, i: 0, correct: 0, total: 0, reviewed: 0, easy: 0, startedAt: Date.now() };
  }

  function grammarStep(ex) {
    if (ex.order) return { type: "order", order: ex.order, pt: ex.pt, label: "Monte a frase" };
    const correct = ex.o[ex.a];
    const filled = ex.q.includes("___") && isEnglish(ex.q) ? ex.q.replace("___", correct) : null;
    return makeChoice(ex.q, correct, ex.o.filter((_, i) => i !== ex.a), { e: ex.e, say: filled, label: "Exercício" });
  }

  function buildTobe(id, sid) {
    const l = grammarLesson(id);
    const pool = poolOf(id);
    const steps = [{ type: "intro" }];
    let exs;
    if (l.review) {
      exs = shuffle(pool.filter((x) => !x.review).flatMap((x) => x.ex)).slice(0, 15);
    } else {
      steps.push({ type: "explain", lid: id });
      steps.push({ type: "examples", lid: id });
      exs = l.ex;
    }
    exs.forEach((e) => steps.push(grammarStep(e)));
    const ex = shuffle(l.examples);
    ex.slice(0, 2).forEach((x, k) => steps.push({ type: "shadow", en: x[0], pt: x[1], k: k + 1, n: 2 }));
    const say = ex.slice(2, l.review ? 5 : 4);
    say.forEach((x, k) => steps.push({ type: "speak", en: x[0], pt: x[1], k: k + 1, n: say.length }));
    if (aiReady()) steps.push({ type: "talk", tobe: id, words: [], msgs: [] });
    steps.push({ type: "finish" });
    const nid = sid || id;
    return { mode: "node", id: nid, info: nodeInfo(nid), steps, i: 0, correct: 0, total: 0, reviewed: 0, easy: 0, startedAt: Date.now() };
  }

  /* Recria uma rodada ou lição salva no meio, no mesmo passo em que parou. */
  function revive(res) {
    const R = JSON.parse(JSON.stringify(res));
    R.info = nodeInfo(R.id);
    R.startedAt = Date.now() - (res.elapsed || 0);
    R.steps.forEach((st) => { st.busy = false; });
    const cur = R.steps[R.i];
    if (cur) { cur.answered = false; if (cur.type === "order") cur.picked = []; }
    return R;
  }

  function startNode(id) {
    const res = resumeFor(id);
    if (res && res.i < res.steps.length - 1) { openPlayer(revive(res)); toast("Continuando do passo " + (res.i + 1)); return; }
    if (id.includes(":") && !etapaById[id.slice(2)]) { toast("Esta etapa não existe mais."); return; }
    openPlayer(id.includes(":") ? buildEtapa(id) : id[0] === "r" ? buildRound(+id.slice(1)) : id[0] === "c" ? buildCheck(+id.slice(1)) : buildTobe(id));
  }

  function openPlayer(session) {
    if (!S.state.session.startedAt) S.startSession();
    P = session;
    SP.stop();
    const el = document.createElement("div");
    el.className = "player";
    el.id = "player";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", P.mode === "review" ? "Revisão" : "Rodada");
    el.innerHTML =
      '<div class="player-head"><button class="close-btn" data-action="player-close" aria-label="Fechar">' + icon("x") + "</button>" +
      '<div class="player-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-label="Progresso"><span></span></div><span class="player-step"></span></div>' +
      '<div class="player-body"><div class="player-inner" tabindex="-1"></div></div>' +
      '<div class="player-foot"><div class="player-foot-inner"></div></div>';
    document.body.appendChild(el);
    document.body.style.overflow = "hidden";
    renderStep();
  }

  async function requestClose() {
    if (!P) return;
    const step = P.steps[P.i];
    if (P.i > 0 && step.type !== "finish" && P.mode === "node") {
      const ok = await alertDialog({ title: "Sair agora?", text: "As palavras que você já viu e as revisões feitas ficam salvas. A rodada só conta como concluída se você chegar ao fim.", ok: "Sair", cancel: "Continuar", danger: true });
      if (!ok) return;
    }
    closePlayer();
  }

  function closePlayer() {
    SP.stop();
    if (P && P.ctl) P.ctl.abort();
    const el = $("#player");
    if (el) el.remove();
    document.body.style.overflow = "";
    S.save();
    P = null;
    render();
  }

  const body = () => $("#player .player-inner");
  function setFoot(html, sheet) {
    const f = $("#player .player-foot");
    f.className = "player-foot" + (sheet ? " sheet" : "");
    $(".player-foot-inner", f).innerHTML = html;
  }
  function primary(label, opts) {
    opts = opts || {};
    return '<button class="btn btn-filled btn-large" data-action="' + (opts.action || "next") + '" data-primary' + (opts.disabled ? " disabled" : "") + ">" + label + "</button>" +
      (opts.ghost ? '<button class="btn btn-plain" data-action="' + opts.ghost[0] + '">' + opts.ghost[1] + "</button>" : "");
  }
  const eyebrow = (t) => '<p class="eyebrow">' + t + "</p>";

  function next() {
    if (!P) return;
    SP.stop();
    P.i += 1;
    if (P.i >= P.steps.length) { closePlayer(); return; }
    if (P.steps[P.i].type === "finish") completeSession();
    renderStep();
  }
  function autoSpeak(text) { if (S.state.settings.autoplay && SP.hasTTS) setTimeout(() => SP.speak(text), 250); }

  function renderStep() {
    const step = P.steps[P.i];
    const last = P.steps.length - 1;
    const pct = last ? Math.round((P.i / last) * 100) : 100;
    const bar = $("#player .player-progress");
    $("span", bar).style.width = pct + "%";
    bar.setAttribute("aria-valuenow", pct);
    $("#player .player-step").textContent = step.type === "finish" ? "" : (P.i + 1) + " de " + last;
    const inner = body();
    inner.style.animation = "none";
    void inner.offsetWidth;
    inner.style.animation = "";
    if (P.mode === "node" && step.type !== "finish" && P.i > 0) {
      S.state.resumes[P.id] = { id: P.id, mode: P.mode, i: P.i, steps: P.steps, correct: P.correct, total: P.total, reviewed: P.reviewed, easy: P.easy, elapsed: Date.now() - P.startedAt, at: Date.now() };
      S.save();
    }
    STEPS[step.type](step, inner);
    $("#player .player-body").scrollTop = 0;
    try { inner.focus({ preventScroll: true }); } catch (e) { /* ignora */ }
  }

  function micResultHtml(target, best) {
    const msg = best.s >= 85 ? "Ótima pronúncia!" : best.s >= 60 ? "Quase lá. Ouça de novo e repare no que faltou." : "Tente de novo, mais devagar.";
    return 'Entendi: <b lang="en">“' + esc(best.a) + "”</b><br>" + best.s + "% de acerto. " + msg;
  }
  function micErrorText(e) {
    const m = e && e.message;
    if (m === "not-allowed" || m === "service-not-allowed") return "Sem acesso ao microfone aqui. Repita em voz alta mesmo assim.";
    if (m === "no-speech") return "Não ouvi nada. Toque de novo e fale perto do microfone.";
    if (m === "unavailable") return "Reconhecimento de voz indisponível aqui. Repita em voz alta mesmo assim.";
    return "O reconhecimento de voz falhou. Tente de novo.";
  }
  function micButton(action, attrs) {
    return SP.hasMic ? '<button class="btn btn-capsule" data-action="' + action + '"' + (attrs || "") + ">" + icon("mic") + "Falar</button>" : "";
  }

  /* ───────── Passos ───────── */
  const STEPS = {
    intro(step, el) {
      if (P.mode !== "node") { next(); return; }
      const info = P.info;
      const warm = P.steps.filter((s) => s.type === "card" && s.warm).length;
      let rows;
      if (info.kind === "round" || info.kind === "wordset") {
        rows = [];
        if (warm) rows.push(["repeat", "Aquecimento", plural(warm, "revisão vencida", "revisões vencidas"), "3 min"]);
        rows = rows.concat([
          ["layers", info.words.length + " palavras em " + Math.ceil(info.words.length / 5) + " grupos", info.words.slice(0, 8).map((i) => S.word(i).en).join(", ") + "…", "12 min"],
          ["headphones", "Shadowing", "3 frases para ouvir e repetir", "2 min"],
          ["mic", "Fale em inglês", "3 frases do português para o inglês", "2 min"]
        ]);
        if (P.steps.some((s) => s.type === "talk")) rows.push(["chat", "Conversa com IA", "Use as palavras da rodada", "3 min"]);
      } else if (info.kind === "check") {
        rows = [["trophy", "30 palavras do bloco", "Você vê em português e diz em inglês", "8 min"], ["repeat", "Conta como revisão", "Acertos sobem de caixa; erros voltam para a 1", ""]];
      } else if (info.etapa && info.kind !== "grammar") {
        rows = etapaIntroRows(info);
      } else {
        const nEx = P.steps.filter((s) => s.type === "choice" || s.type === "order").length;
        rows = (info.review ? [] : [["book", "Explicação", "Regras com tabela, em português", "2 min"], ["speaker", "Exemplos com áudio", "Ouça e repita", "1 min"]]).concat([
          ["zap", nEx + " exercícios", "Complete, escolha e monte frases", info.review ? "5 min" : "3 min"],
          ["headphones", "Shadowing e fale em inglês", info.kind !== "grammar" ? "Frases com o verbo to be" : info.lesson[0] === "p" ? "Frases no ritmo natural" : "Frases com do, does e did", "2 min"]
        ]);
        if (P.steps.some((s) => s.type === "talk")) rows.push(["chat", "Conversa com IA", info.kind !== "grammar" ? "Pratique o verbo to be conversando" : info.lesson[0] === "p" ? "Converse no ritmo natural" : "Pratique perguntas com do e did", "3 min"]);
      }
      el.innerHTML = '<div class="step-head">' + eyebrow(info.etapa ? esc(info.label) + " · " + info.est : info.kind === "tobe" ? "Verbo to be · " + esc(info.label) + " · " + info.est : esc(info.label) + " · Bloco " + info.block + " · " + info.est) +
        '<h1 class="title1">' + esc(info.title) + "</h1>" +
        (info.etapa ? '<p class="body secondary">' + esc(dot(info.sub)) + "</p>" : info.kind === "round" ? '<p class="body secondary">Palavras ' + (info.words[0] + 1) + " a " + (info.words[24] + 1) + " das 500.</p>" : info.kind === "tobe" ? '<p class="body secondary">' + esc(info.sub) + ".</p>" : "") + "</div>" +
        list(rows.map((r) => cell({ icon: r[0], title: r[1], sub: esc(r[2]), value: r[3] })), "icons");
      setFoot(primary("Começar"));
    },

    explain(step, el) {
      const l = grammarLesson(step.lid);
      el.innerHTML = '<div class="step-head">' + eyebrow(trailName(step.lid) + " · explicação") + '<h1 class="title1">' + esc(l.title) + '</h1><p class="body secondary">' + esc(l.sub) + ".</p></div>" +
        list(l.points.map((pt, k) => cell({ lead: '<span class="wbadge">' + (k + 1) + "</span>", title: esc(pt) })), "icons") +
        (l.table ? '<div class="card table-wrap"><table class="cola-table"><tbody>' + l.table.map((r) => "<tr>" + r.map((c, k) => (k ? "<td>" : '<th scope="row">') + esc(c) + (k ? "</td>" : "</th>")).join("") + "</tr>").join("") + "</tbody></table></div>" : "");
      setFoot(primary("Entendi"));
    },

    examples(step, el) {
      const l = grammarLesson(step.lid);
      el.innerHTML = '<div class="step-head">' + eyebrow(trailName(step.lid) + " · exemplos") + '<h1 class="title1">Ouça e repita.</h1><p class="body secondary">Toque no alto-falante de cada frase e repita em voz alta.</p></div>' +
        list(l.examples.map((x) => cell({ lead: speakBtn(x[0], "", "Ouvir"), title: esc(x[0]), sub: esc(x[1]), lang: "en" })), "icons");
      setFoot(primary("Continuar"));
    },

    order(step, el) {
      if (!step.tiles) {
        const words = step.order.replace(/[.,?!]/g, "").split(" ");
        step.tiles = words.map((w, k) => (k === 0 && !/^I($|')/.test(w) ? w.toLowerCase() : w));
        let idx = shuffle(step.tiles.map((_, k) => k));
        if (idx.length > 1 && idx.every((v, k) => v === k)) idx = idx.slice(1).concat(idx[0]);
        step.shuffled = idx;
      }
      step.picked = step.picked || [];
      el.innerHTML = '<div class="step-head">' + eyebrow("Monte a frase") + '<h1 class="title2">' + esc(step.pt) + "</h1></div>" +
        '<div class="answer-area" id="answer-line" data-placeholder="Toque nas palavras na ordem certa" aria-label="Sua frase" lang="en"></div>' +
        '<div class="chips" id="tiles" lang="en"></div>';
      drawTiles(step);
    },

    card(step, el) {
      const w = S.word(step.i);
      const c = S.card(step.i) || { box: 1 };
      const dir = step.dir || (c.box >= 3 ? "pt" : "en");
      step.dirUsed = dir;
      const n = P.steps.slice(0, P.i + 1).filter((s) => s.type === "card").length;
      const total = P.steps.filter((s) => s.type === "card").length;
      const lbl = step.check ? "Prova" : step.warm ? "Aquecimento" : P.kind === "deck" ? "Cards" : P.kind === "left" ? "Maratona" : "Revisão";
      const front = dir === "pt"
        ? '<p class="eyebrow">Diga em inglês</p><p class="word-en">' + esc(w.pt) + "</p>" + micButton("mic-card")
        : '<p class="word-en" lang="en">' + esc(w.en) + "</p>" + speakBtn(w.en, "lg", "Ouvir " + w.en);
      const back = dir === "pt"
        ? '<p class="title1" lang="en">' + esc(w.en) + "</p>" + speakBtn(w.en, "", "Ouvir " + w.en)
        : '<p class="title1 steel">' + esc(w.pt) + "</p>";
      el.innerHTML =
        '<div class="step-head">' + eyebrow(lbl + " · " + n + " de " + total + " · caixa " + c.box) + "</div>" +
        '<div class="flash">' + front + '<div class="mic-result" id="mic-result" hidden></div>' +
        '<div class="answer" id="flash-answer" hidden>' + back + '<p class="body" lang="en">' + esc(w.ex) + '</p><p class="subhead secondary">' + esc(w.exPt) + "</p>" +
        (S.state.notes[step.i] ? '<p class="footnote secondary">Sua nota: ' + esc(S.state.notes[step.i]) + "</p>" : "") + "</div></div>" +
        '<p class="footnote secondary center" id="flash-hint">' + (dir === "pt" ? "Lembre a palavra em inglês e diga em voz alta." : "Lembre o significado antes de mostrar a resposta.") + "</p>";
      setFoot(primary("Mostrar resposta", { action: "reveal" }));
      if (dir === "en") autoSpeak(w.en);
    },

    learn(step, el) {
      const w = S.word(step.i);
      S.introduce(step.i);
      el.innerHTML =
        '<div class="step-head">' + eyebrow("Palavra " + step.n + " de " + (step.of || 25) + " · grupo " + step.g + " · Nº " + (step.i + 1)) + "</div>" +
        '<div class="word-card"><div class="word-top"><p class="word-en" style="min-width:0"><span lang="en">' + esc(dot(w.en)) + '</span><span class="word-pt">' + esc(dot(w.pt)) + "</span></p>" + speakBtn(w.en, "lg", "Ouvir " + w.en) + "</div>" +
        '<div class="controls"><button class="btn btn-capsule" data-action="speak" data-text="' + esc(w.en) + '" data-rate="0.6">Devagar</button>' + micButton("mic-word", ' data-i="' + step.i + '"') + "</div>" +
        '<div class="mic-result" id="mic-result" hidden></div>' +
        '<div class="example">' + speakBtn(w.ex, "", "Ouvir exemplo") + '<div style="min-width:0"><p class="headline" lang="en">' + esc(w.ex) + '</p><p class="subhead secondary">' + esc(w.exPt) + "</p></div></div>" +
        '<div class="field-note"><label class="eyebrow" for="note-' + step.i + '">Anotação (opcional)</label><input class="note-box" id="note-' + step.i + '" data-input="note" data-i="' + step.i + '" value="' + esc(S.state.notes[step.i] || "") + '" placeholder="Associação, som parecido, frase sua" autocomplete="off"></div>' +
        "</div>" +
        '<p class="footnote secondary center">Ouça e repita em voz alta duas vezes.</p>';
      setFoot(primary("Continuar"));
      autoSpeak(w.en);
    },

    choice(step, el) {
      el.innerHTML = '<div class="step-head">' + eyebrow(esc(step.label) + (step.wi != null ? " · teste rápido" : "")) + '<h1 class="title2 question">' + esc(step.q).replace("___", '<span class="blank" aria-label="lacuna"></span>') + "</h1></div>" +
        (step.listen ? '<div class="controls"><button class="btn btn-tinted btn-capsule" data-action="speak" data-text="' + esc(step.listen) + '">' + icon("speaker") + 'Ouvir</button><button class="btn btn-capsule" data-action="speak" data-text="' + esc(step.listen) + '" data-rate="0.6">Mais devagar</button></div>' : "") +
        list(step.o.map((o, i) => '<button type="button" class="cell tappable opt" data-action="choose" data-i="' + i + '"><span class="cell-body"><span class="cell-title"' + (isEnglish(o) ? ' lang="en"' : "") + ">" + esc(o) + '</span></span><span class="opt-mark"></span></button>'));
      setFoot('<p class="foot-hint">Toque na resposta certa.</p>');
      if (step.listen) setTimeout(() => SP.speak(step.listen), 300);
    },

    shadow(step, el) {
      const w = sentenceOf(step);
      step.reps = step.reps || 0;
      el.innerHTML = '<div class="step-head">' + eyebrow("Shadowing · " + step.k + " de " + step.n) +
        '<p class="body secondary">Ouça e fale junto com o áudio, imitando o ritmo. Três vezes, em voz alta.</p></div>' +
        '<div class="shadow-card"><p class="title2" lang="en">' + esc(w.ex) + '</p><p class="body secondary">' + esc(w.exPt) + "</p>" +
        '<div class="controls"><button class="btn btn-filled btn-capsule" data-action="speak" data-text="' + esc(w.ex) + '">' + icon("play") + "Ouvir</button>" +
        '<button class="btn btn-capsule" data-action="speak" data-text="' + esc(w.ex) + '" data-rate="0.6">Devagar</button>' + micButton("mic-sentence") + "</div>" +
        '<div class="mic-result" id="mic-result" hidden></div></div>' +
        '<div class="reps"><button class="btn btn-tinted" data-action="rep">' + icon("check") + 'Repeti em voz alta</button><div class="rep-dots" aria-live="polite">' + [0, 1, 2].map((i) => '<span class="' + (i < step.reps ? "on" : "") + '"></span>').join("") + "</div></div>";
      shadowFoot(step);
      autoSpeak(w.ex);
    },

    speak(step, el) {
      const w = sentenceOf(step);
      el.innerHTML = '<div class="step-head">' + eyebrow("Fale em inglês · " + step.k + " de " + step.n) +
        '<h1 class="title2">' + esc(w.exPt) + "</h1>" +
        '<p class="body secondary">Diga a frase em inglês, em voz alta. Depois confira.</p></div>' +
        '<div class="controls">' + micButton("mic-sentence") + '<button class="btn btn-capsule" data-action="hint" data-text="' + esc(w.ex) + '">Dica</button></div>' +
        '<div class="mic-result" id="mic-result" hidden></div>' +
        '<div class="shadow-card" id="speak-answer" hidden><p class="title2" lang="en">' + esc(w.ex) + "</p>" +
        '<div class="controls"><button class="btn btn-filled btn-capsule" data-action="speak" data-text="' + esc(w.ex) + '">' + icon("play") + "Ouvir</button></div></div>";
      setFoot(primary("Mostrar em inglês", { action: "reveal-sentence" }));
    },

    talk(step, el) {
      el.innerHTML = '<div class="step-head">' + eyebrow("Conversa com IA") +
        '<h1 class="title2">Converse em inglês.</h1>' +
        '<p class="body secondary">' + (step.dialog ? "Ensaie a cena: a IA faz o papel de " + esc(etapaById[step.dialog].who.toLowerCase()) + ". Responda em inglês; ela corrige com uma dica em português." : step.etapa ? "Responda usando as frases desta etapa. A IA corrige com uma dica em português." : step.tobe ? (step.tobe[0] === "d" ? "Responda com frases completas usando do, does ou did. A IA corrige com uma dica em português." : "Responda com frases curtas usando o verbo to be. A IA corrige com uma dica em português.") : "Responda com frases curtas. Use as palavras da rodada. A IA corrige com uma dica em português.") + "</p></div>" +
        '<div class="chat" id="chat" aria-live="polite"></div>' +
        '<div class="composer"><label class="sr-only" for="talk-box">Sua resposta em inglês</label><textarea id="talk-box" data-input="talk" lang="en" rows="2" placeholder="Answer in English…"></textarea>' +
        (SP.hasMic ? '<button class="speak" data-action="talk-mic" aria-label="Falar">' + icon("mic") + "</button>" : "") +
        '<button class="speak send" data-action="talk-send" aria-label="Enviar">' + icon("send") + "</button></div>";
      drawChat(step);
      talkFoot(step);
      if (!step.msgs.length && !step.busy) aiTurn(step);
    },

    hear(step, el) {
      const p = phraseById(step.pid);
      S.pintroduce(step.pid);
      step.answered = false;
      el.innerHTML = '<div class="step-head">' + eyebrow("Ouça · frase " + step.n + " de " + step.of) +
        '<h1 class="title2">Escreva do jeito que você ouviu.</h1><p class="body secondary">Sem ler antes. Pode usar letras do português. Ouça quantas vezes quiser.</p></div>' +
        '<div class="hear-card"><button class="hear-play" data-action="speak" data-text="' + esc(p.real || p.en) + '" aria-label="Ouvir de novo">' + icon("play") + "</button>" +
        '<div class="controls"><button class="btn btn-capsule" data-action="speak" data-text="' + esc(p.real || p.en) + '" data-rate="0.6">Devagar</button></div>' +
        '<label class="sr-only" for="hear-box">O que você ouviu</label><input class="note-box hear-box" id="hear-box" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Ex.: uárâzit mín"></div>' +
        '<div id="hear-answer"></div>';
      setFoot(primary("Ver o que é", { action: "hear-reveal" }));
      setTimeout(() => { if (P && P.steps[P.i] === step) SP.speak(p.real || p.en); }, 350);
    },

    phrase(step, el) {
      S.pintroduce(step.pid);
      el.innerHTML =
        '<div class="step-head">' + eyebrow("Frase " + step.n + " de " + step.of) + "</div>" +
        '<div class="word-card"><div class="word-top"><p class="phrase-en" style="min-width:0"><span lang="en">' + esc(step.en) + '</span><span class="word-pt">' + esc(step.pt) + "</span></p>" + speakBtn(step.en, "lg", "Ouvir") + "</div>" +
        '<div class="controls"><button class="btn btn-capsule" data-action="speak" data-text="' + esc(step.en) + '" data-rate="0.6">Devagar</button>' + micButton("mic-text", ' data-text="' + esc(step.en) + '"') + "</div>" +
        '<div class="mic-result" id="mic-result" hidden></div>' +
        soundBox(step.real, step.br) + swapsHtml(step.swaps) +
        '<div class="field-note"><label class="eyebrow" for="pnote">Anotação (opcional)</label><input class="note-box" id="pnote" data-input="pnote" data-pid="' + step.pid + '" value="' + esc(S.state.pnotes[step.pid] || "") + '" placeholder="Quando usar, uma frase sua, um macete" autocomplete="off"></div>' +
        "</div>" +
        '<p class="footnote secondary center">' + (step.br ? "Repita no ritmo natural, juntando as palavras. Depois anote se quiser." : "Ouça, repita em voz alta duas vezes e anote se quiser.") + "</p>";
      setFoot(primary("Continuar"));
      autoSpeak(step.real || step.en);
    },

    dialog(step, el) {
      const e = etapaById[step.eid];
      el.innerHTML = '<div class="step-head">' + eyebrow("Situação · ouça a conversa") + '<h1 class="title1">' + esc(e.name) + "</h1>" +
        '<p class="body secondary">' + esc(e.desc) + " Você conversa com: " + esc(e.who.toLowerCase()) + ".</p></div>" +
        '<div class="controls"><button class="btn btn-filled btn-capsule" data-action="play-dialog" data-eid="' + e.id + '">' + icon("play") + "Ouvir a conversa</button></div>" +
        dialogHtml(e);
      setFoot(primary("Agora é a sua vez"));
    },

    line(step, el) {
      const e = etapaById[step.eid];
      el.innerHTML = '<div class="step-head">' + eyebrow("Sua vez · fala " + step.k + " de " + step.n) + "</div>" +
        (step.prevEn ? '<div class="chat dialog">' + bubbleHtml(e, ["o", step.prevEn, step.prevPt]) + "</div>" : "") +
        '<div class="say-card"><p class="eyebrow">Responda em inglês</p><h1 class="title2">' + esc(step.pt) + "</h1>" +
        '<div class="controls">' + micButton("mic-sentence") + '<button class="btn btn-capsule" data-action="hint" data-text="' + esc(step.en) + '">Dica</button></div>' +
        '<div class="mic-result" id="mic-result" hidden></div></div>' +
        '<div class="shadow-card" id="speak-answer" hidden><p class="title2" lang="en">' + esc(step.en) + "</p>" +
        '<div class="controls"><button class="btn btn-filled btn-capsule" data-action="speak" data-text="' + esc(step.en) + '">' + icon("play") + "Ouvir</button>" +
        '<button class="btn btn-capsule" data-action="speak" data-text="' + esc(step.en) + '" data-rate="0.6">Devagar</button></div></div>';
      setFoot(primary("Mostrar a fala", { action: "reveal-sentence" }));
      if (step.prevEn) autoSpeak(step.prevEn);
    },

    extras(step, el) {
      const e = etapaById[step.eid];
      e.extra.forEach((_, j) => S.pintroduce(pidOf(e, e.mine.length + j)));
      el.innerHTML = '<div class="step-head">' + eyebrow("Outras frases úteis") + '<h1 class="title1">Na mesma situação.</h1>' +
        '<p class="body secondary">Ouça e repita. Elas também entram nos seus cards.</p></div>' +
        list(e.extra.map((x) => cell({ lead: speakBtn(x[0], "", "Ouvir"), title: esc(x[0]), sub: esc(x[1]), lang: "en" })), "icons");
      setFoot(primary("Continuar"));
    },

    forms(step, el) {
      const v = etapaById[step.eid].verbs[step.v];
      const forms = window.drillForms(v);
      const groups = [["Eu e você · presente", 0], ["Ela · presente", 3], ["Passado (did)", 6]];
      el.innerHTML = '<div class="step-head">' + eyebrow("Verbo " + step.n + " de " + step.of) +
        '<h1 class="title1"><span lang="en">' + esc(v[0]) + " · " + esc(v[2]) + "</span></h1>" +
        '<p class="body secondary">Ouça e repita as 9 frases em voz alta. Repare onde entra o do, o does e o did.</p></div>' +
        groups.map((g) => section(g[0], list(forms.slice(g[1], g[1] + 3).map((f) => cell({ lead: speakBtn(f.en, "", "Ouvir"), title: esc(f.en), sub: esc(f.pt), lang: "en" })), "icons"))).join("");
      setFoot(primary("Continuar"));
    },

    finish(step, el) {
      const c = S.counts();
      let title, lead, stats;
      if (P.mode === "review") {
        const cards = P.kind === "deck" || P.kind === "phrases";
        title = P.kind === "left" ? "Maratona concluída" : P.kind === "deck" ? "Cards concluídos" : P.kind === "phrases" ? "Revisão de frases concluída" : "Revisão concluída";
        lead = cards ? "Você lembrou " + P.easy + " de " + P.reviewed + ". As que você errou voltam antes." : c.learned >= S.N ? "Você fixou as " + S.N + " palavras." : "Você já fixou " + c.learned + " de " + S.N + " palavras.";
        stats = [[P.reviewed, cards ? "cards" : "palavras"], [P.easy, "acertos"], cards ? [S.pcounts().learned, "frases fixadas"] : [c.learned, "fixadas"]];
      } else if (P.info.etapa) {
        ({ title, lead, stats } = etapaFinish());
      } else if (P.info.kind === "check") {
        title = "Prova do bloco " + P.info.n + " concluída";
        lead = "Você lembrou " + P.easy + " de " + P.reviewed + " em inglês.";
        stats = [[P.easy + "/" + P.reviewed, "acertos"], [learnedIn(P.info.words) + "/125", "do bloco"], [c.learned, "fixadas"]];
      } else if (P.info.kind === "tobe") {
        const nt = S.nextTobe();
        title = P.info.review ? "Trilha do to be concluída" : "Lição " + P.info.n + " de to be concluída";
        lead = nt ? "Próxima: " + nodeInfo(nt).title + ". Agora volte às palavras." : "Você completou as 11 lições do verbo to be.";
        stats = [[P.correct + "/" + P.total, "acertos"], [S.tobeCount() + "/" + TOBE.length, "lições"], [P.minutes, "min"]];
      } else {
        title = "Rodada " + P.info.n + " concluída";
        lead = "As palavras novas voltam em 10 e 30 minutos. " + (S.breakDue() ? "Hora de uma pausa." : "Siga para a próxima.");
        stats = [[25, "palavras novas"], [P.correct + "/" + P.total, "acertos"], [c.seen, "estudadas"]];
      }
      el.innerHTML = '<div class="step-head finish"><span class="finish-icon">' + icon("checkFill") + "</span>" +
        '<h1 class="title1">' + esc(title) + '</h1><p class="body secondary">' + esc(lead) + "</p></div>" +
        '<div class="summary center">' + stats.map((s) => "<div><b>" + s[0] + "</b><small>" + s[1] + "</small></div>").join("") + "</div>";
      const nid = S.nextId();
      let ghost = S.breakDue() ? ["finish-break", "Fazer pausa de 10 min"] : P.mode === "node" && nid && !P.info.etapa ? ["next-node", "Próxima etapa"] : null;
      if (!ghost && P.mode === "node" && P.info.etapa) {
        P.nextTarget = etapaNextTarget(P.info.etapa, P.id);
        if (P.nextTarget) ghost = ["etapa-next", P.nextTarget.label];
      }
      setFoot(primary("Concluído", { action: "player-done", ghost }));
      haptic(20);
    }
  };

  const sentenceOf = (step) => (step.en ? { ex: step.en, exPt: step.pt } : S.word(step.i));

  function drawTiles(step) {
    const line = $("#answer-line");
    const tiles = $("#tiles");
    if (!line || !tiles) return;
    line.innerHTML = step.picked.map((ti, pos) => '<button class="chip" data-action="unpick" data-pos="' + pos + '">' + esc(step.tiles[ti]) + "</button>").join("");
    tiles.innerHTML = step.shuffled.map((ti) => '<button class="chip' + (step.picked.includes(ti) ? " used" : "") + '" data-action="pick" data-t="' + ti + '"' + (step.picked.includes(ti) ? ' tabindex="-1" aria-hidden="true"' : "") + ">" + esc(step.tiles[ti]) + "</button>").join("");
    if (!step.answered) setFoot(primary("Verificar", { action: "check-order", disabled: step.picked.length !== step.tiles.length, ghost: step.picked.length ? ["clear-order", "Limpar"] : null }));
  }

  function shadowFoot(step) { setFoot(primary("Continuar", { disabled: step.reps < 3, ghost: ["skip", "Agora não posso falar"] })); }
  function talkFoot(step) {
    const n = step.msgs.filter((m) => m.role === "me").length;
    setFoot(primary(n >= 3 ? "Concluir conversa" : "Responda " + (3 - n) + "×", { disabled: n < 3 && !step.failed, ghost: ["skip", "Pular conversa"] }));
  }

  /* ───────── Conversa com IA ───────── */
  function talkRules(step) {
    const l = step.tobe ? grammarLesson(step.tobe) : null;
    const dlg = step.dialog ? etapaById[step.dialog] : null;
    const ph = step.etapa ? etapaById[step.etapa] : null;
    const focus = dlg
      ? "ROLE-PLAY. Situation: " + dlg.name + ". You play: " + dlg.who + ". The learner plays themself, a Brazilian. Stay in character and move the scene forward with one short line or question at a time. Reference conversation:\n" + dlg.lines.map((x) => (x[0] === "v" ? "Learner: " : "You: ") + x[1]).join("\n") + "\n"
      : ph
        ? "Today's ready-made phrases. Create small situations where the learner can use them: " + ph.phrases.map((x) => x[0]).join(" | ") + "\n"
        : l && l.id[0] === "p"
          ? "Today the learner is practicing natural American connected speech: gonna, wanna, gotta, ya, the flap T and linked words. Speak casually and use these reduced forms in your replies. In \"tip\", show how the learner's last sentence would sound in casual speech.\n"
        : l && l.id[0] === "d"
          ? "Today the learner is practicing DO, DOES and DID. Lesson: \"" + l.title + "\" (" + l.sub + "). Ask simple questions in the present or the past (Do you...? Does she...? Did you...?) that make the learner answer with full sentences. In \"tip\", focus on do, does, did and the base form of the verb.\n"
          : l
            ? "Today the learner is practicing the verb TO BE. Lesson: \"" + l.title + "\" (" + l.sub + "). Ask questions that make the learner answer with this form of the verb to be (am, is, are, was, were, will be, there is, there are). In \"tip\", focus on the verb to be.\n"
            : "Words from the current round: " + step.words.map((i) => S.word(i).en).join(", ") + ".\n";
    return "You are a warm, patient English conversation partner for a Brazilian beginner (level A1) who is learning English today.\n" + focus +
      "Rules:\n" +
      "- Write simple English with very common words. Use two or three of the round words naturally.\n" +
      "- \"reply\": at most two short sentences, ending with ONE simple question about the learner's life.\n" +
      "- \"tip\": one short line in Brazilian Portuguese. Correct the learner's last message gently and show the corrected English sentence, or praise it if it was right. Empty on your first message.\n" +
      "- \"translation\": the Brazilian Portuguese translation of your reply.\n" +
      "Reply with only JSON: {\"tip\": \"...\", \"reply\": \"...\", \"translation\": \"...\"}";
  }
  function drawChat(step) {
    const box = $("#chat");
    if (!box) return;
    box.innerHTML = step.msgs.map((m) => {
      if (m.role === "me") return '<div class="bubble me" lang="en">' + esc(m.text) + "</div>";
      return (m.tip ? '<p class="tip">' + icon("bulb", "icon-sm") + "<span>" + esc(m.tip) + "</span></p>" : "") +
        '<div class="bubble ai"><p lang="en">' + esc(m.text) + "</p>" + (m.tr ? '<p class="tr">' + esc(m.tr) + "</p>" : "") +
        speakBtn(m.text, "", "Ouvir") + "</div>";
    }).join("") +
      (step.busy ? '<div class="bubble ai typing" aria-label="Escrevendo"><span></span><span></span><span></span></div>' : "") +
      (step.error ? '<p class="tip warn">' + esc(step.error) + "</p>" : "");
    box.scrollIntoView({ block: "end" });
  }
  async function aiTurn(step) {
    if (!AI) return;
    step.busy = true;
    step.error = "";
    drawChat(step);
    const turns = [{ role: "user", content: talkRules(step) + "\n\nStart the conversation: greet the learner and ask your first question." }];
    step.msgs.forEach((m) => {
      if (m.role === "ai") turns.push({ role: "assistant", content: JSON.stringify({ tip: m.tip || "", reply: m.text, translation: m.tr || "" }) });
      else turns.push({ role: "user", content: m.text });
    });
    if (step.msgs.length) turns[turns.length - 1].content += "\n\n(Answer with the JSON only.)";
    P.ctl = new AbortController();
    try {
      const out = await AI.json(turns, { modelTier: "quick", cache: false, signal: P.ctl.signal });
      const reply = out && typeof out.reply === "string" ? out.reply.trim() : "";
      if (!reply) throw { code: "empty_completion" };
      step.msgs.push({ role: "ai", text: reply, tip: (out.tip || "").trim(), tr: (out.translation || "").trim() });
      if (S.state.settings.autoplay) SP.speak(reply);
    } catch (e) {
      const code = e && e.code;
      if (code === "cancelled") return;
      if (code === "not_granted" || code === "sampling_disabled" || code === "capability_disabled" || code === "not_declared") {
        aiBlocked = true;
        step.error = "A conversa com IA não está liberada aqui. Pule para continuar.";
      } else if (code === "rate_limited") {
        step.error = "Muitas mensagens seguidas. Espere alguns segundos e envie de novo.";
      } else {
        step.error = "Não consegui responder agora. Tente enviar de novo ou pule a conversa.";
      }
      step.failed = true;
    } finally {
      step.busy = false;
      if (P && P.steps[P.i] === step) { drawChat(step); talkFoot(step); }
    }
  }
  function sendTalk() {
    const step = P && P.steps[P.i];
    if (!step || step.type !== "talk" || step.busy) return;
    const box = $("#talk-box");
    const text = (box.value || "").trim();
    if (!text) { toast("Escreva ou fale sua resposta."); return; }
    box.value = "";
    step.msgs.push({ role: "me", text });
    S.state.spoken += 1;
    talkFoot(step);
    aiTurn(step);
  }

  function answer(step, ok, shown) {
    P.total += 1;
    if (ok) P.correct += 1;
    if (step.wi != null) S.quiz(step.wi, ok);
    if (step.pid) S.pquiz(step.pid, ok);
    if (!ok && !step.again && step.type === "choice") {
      let at = P.steps.findIndex((s, k) => k > P.i && s.type !== "choice" && s.type !== "order");
      if (at < 0) at = P.steps.length - 1;
      const o = shuffle(step.o);
      P.steps.splice(at, 0, Object.assign({}, step, { again: true, answered: false, o, a: o.indexOf(shown) }));
    }
    haptic(ok ? 15 : [30, 40, 30]);
    const praise = ["Correto!", "Isso mesmo!", "Muito bem!", "Perfeito!"];
    const title = ok ? praise[Math.floor(Math.random() * praise.length)] : "Resposta certa: " + shown;
    setFoot('<div class="feedback ' + (ok ? "good" : "bad") + '">' + icon(ok ? "checkFill" : "xFill") + '<div><p class="feedback-title">' + esc(title) + "</p>" + (step.e ? '<p class="feedback-text">' + esc(step.e) + (ok ? "" : " · volta no fim do grupo") + "</p>" : "") + "</div></div>" +
      primary("Continuar"), true);
    if (step.say && SP.hasTTS) setTimeout(() => SP.speak(step.say), 150);
    const btn = $("#player [data-primary]");
    if (btn) btn.focus({ preventScroll: true });
  }

  function completeSession() {
    P.minutes = clamp(Math.round((Date.now() - P.startedAt) / MIN), 1, 90);
    if (P.mode === "node") {
      const isCheck = P.info.kind === "check";
      const rec = { at: Date.now(), correct: isCheck ? P.easy : P.correct, total: isCheck ? P.reviewed : P.total, min: P.minutes };
      if (P.id.includes(":")) S.state.etapas[P.id] = rec;
      else if (P.info.kind === "tobe") S.state.tobe[P.id] = rec;
      else S.state.nodes[P.id] = rec;
      if (P.steps.some((s) => s.type === "talk" && s.msgs.length > 1)) S.state.talks += 1;
      delete S.state.resumes[P.id];
    }
    S.save();
  }

  /* ═══════════════════════ EVENTOS ═══════════════════════ */

  async function runMic(el, target, after) {
    const out = $("#mic-result");
    SP.stop();
    const label = el.innerHTML;
    let listening;
    try { listening = SP.listen(); } catch (e) { listening = Promise.reject(e); }
    el.disabled = true;
    el.innerHTML = icon("mic") + "Ouvindo…";
    if (out) { out.hidden = false; out.textContent = "Fale agora."; }
    try {
      const alts = await listening;
      const best = alts.map((a) => ({ a, s: SP.similarity(target, a) })).sort((x, y) => y.s - x.s)[0];
      if (out) out.innerHTML = micResultHtml(target, best);
      S.state.spoken += 1;
      if (after) after(best);
    } catch (e) {
      if (out) out.textContent = micErrorText(e);
    }
    el.disabled = false;
    el.innerHTML = label;
  }

  const ACTIONS = {
    "start-session"() { S.startSession(); render(); toast("Cronômetro iniciado. Bons estudos!"); },
    async start(el) {
      const id = el.dataset.id;
      if (!el.dataset.force && isLocked(id)) {
        const ok = await alertDialog({ title: "Etapa bloqueada", text: "A ordem ajuda as revisões a caírem na hora certa. Quer abrir esta mesmo assim?", ok: "Abrir", cancel: "Agora não" });
        if (!ok) return;
      }
      closePopover();
      startNode(id);
    },
    restart(el) {
      if (S.state.resumes[el.dataset.id]) { delete S.state.resumes[el.dataset.id]; S.save(); }
      closePopover();
      startNode(el.dataset.id);
    },
    pick(el) {
      const step = P.steps[P.i];
      if (step.answered) return;
      const t = +el.dataset.t;
      if (!step.picked.includes(t)) step.picked.push(t);
      drawTiles(step);
    },
    unpick(el) {
      const step = P.steps[P.i];
      if (step.answered) return;
      step.picked.splice(+el.dataset.pos, 1);
      drawTiles(step);
    },
    "clear-order"() { const step = P.steps[P.i]; step.picked = []; drawTiles(step); },
    "check-order"() {
      const step = P.steps[P.i];
      if (step.answered) return;
      step.answered = true;
      const built = step.picked.map((k) => step.tiles[k]).join(" ");
      $$("#tiles .chip, #answer-line .chip").forEach((b) => { b.disabled = true; });
      answer(Object.assign(step, { say: step.order }), SP.norm(built) === SP.norm(step.order), step.order);
      S.save();
    },
    node(el) { openPopover(el); },
    review() { openAnki("all", { noNew: true }); },
    anki(el) { openAnki(el.dataset.deck || "all", el.dataset.nonew ? { noNew: true } : null); },
    "anki-show"() { if (!A || !A.cur) return; A.shown = true; ankiRender(); },
    "anki-grade"(el) {
      if (!A || !A.cur || !A.shown) return;
      const g = el.dataset.g;
      const key = A.cur;
      const before = S.ak(key);
      const wasNew = !before || before.q === "new";
      A.history.push({ key, snap: S.akSnap(key), wasNew, g });
      S.akGrade(key, g);
      S.akLog(wasNew, g);
      A.studied += 1;
      if (g !== "again") A.good += 1;
      A.last = key;
      S.save();
      haptic(10);
      ankiNext();
    },
    "anki-undo"() {
      if (!A || !A.history.length) return;
      const h = A.history.pop();
      S.akRestore(h.key, h.snap);
      S.akLog(h.wasNew, h.g, -1);
      A.studied -= 1;
      if (h.g !== "again") A.good -= 1;
      A.cur = h.key; A.shown = false; A.last = null;
      S.save();
      ankiRender();
      toast("Resposta desfeita");
    },
    "anki-more"() { S.akMore(10); S.save(); if (A) { A.opts.noNew = false; ankiNext(); } },
    "anki-more-home"() { S.akMore(10); S.save(); toast("Mais 10 novas liberadas para hoje"); render(); },
    "anki-close"() { ankiClose(); },
    "practice-left"() { if (S.leftIds().length) openPlayer(buildReview("left")); else toast(S.counts().seen ? "Todas as palavras estudadas já estão fixadas." : "Faça uma rodada primeiro."); },
    "practice-random"() { if (S.counts().seen) openPlayer(buildReview("random")); else toast("Faça uma rodada primeiro."); },
    "take-break"() { openBreak(); },
    "snooze-break"() { S.state.session.lastBreakEnd = Date.now() - (S.BREAK_EVERY - 10) * MIN; S.save(); render(); },
    "end-break"() { endBreak(); },
    "finish-break"() { closePlayer(); openBreak(); },
    "player-close"() { requestClose(); },
    "player-done"() { closePlayer(); },
    "go-etapas"() { location.hash = "etapas"; },
    "etapa-next"() {
      const t = P && P.nextTarget;
      closePlayer();
      if (!t) return;
      if (t.id) startNode(t.id); else location.hash = t.href;
    },
    deck(el) { const e = etapaById[el.dataset.eid]; if (e) openAnki("e-" + e.id); },
    phrase(el) { openPhraseSheet(el.dataset.pid); },
    "mic-text"(el) { runMic(el, el.dataset.text); },
    "review-phrases"() { openAnki("all", { noNew: true }); },
    async "copy-etapa"(el) {
      const text = copyText(etapaById[el.dataset.eid]);
      try { await navigator.clipboard.writeText(text); toast("Lista copiada. Cole no seu caderno."); }
      catch (err) {
        const pre = $("#copy-text");
        if (pre) { const r = document.createRange(); r.selectNodeContents(pre); const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r); }
        toast("Copie o texto selecionado");
      }
    },
    async "play-dialog"(el) {
      const e = etapaById[el.dataset.eid];
      if (!e || !SP.hasTTS) { toast("Áudio indisponível neste navegador."); return; }
      if (dialogPlaying) { dialogPlaying = null; SP.stop(); return; }
      const token = {};
      dialogPlaying = token;
      el.classList.add("playing");
      for (let k = 0; k < e.lines.length && dialogPlaying === token; k++) {
        const b = document.querySelector('.dialog [data-line="' + k + '"]');
        if (b) { b.classList.add("speaking"); b.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
        await SP.speak(e.lines[k][1]);
        if (b) b.classList.remove("speaking");
        await new Promise((r) => setTimeout(r, 250));
      }
      if (dialogPlaying === token) dialogPlaying = null;
      el.classList.remove("playing");
    },
    "next-node"() { const nid = S.nextId(); closePlayer(); if (nid) startNode(nid); },
    next() { next(); },
    skip() { next(); },
    word(el) { openWordSheet(+el.dataset.i); },

    async speak(el) {
      if (!SP.hasTTS) { toast("Áudio indisponível neste navegador."); return; }
      el.classList.add("playing");
      await SP.speak(el.dataset.text, el.dataset.rate ? { rate: +el.dataset.rate } : null);
      el.classList.remove("playing");
    },

    reveal() {
      $("#flash-answer").hidden = false;
      const hint = $("#flash-hint");
      if (hint) hint.hidden = true;
      const step = P.steps[P.i];
      if (step.dirUsed === "pt") SP.speak(S.word(step.i).en);
      const lab = (g) => "<small>" + S.intervalLabel(step.i, g) + "</small>";
      setFoot('<div class="grades ak-grades">' + ANKI_GRADES.map(([g, l]) => '<button class="grade ' + g + '" data-action="grade" data-g="' + g + '"' + (g === "good" ? " data-primary" : "") + ">" + lab(g) + l + "</button>").join("") + "</div>");
    },
    grade(el) {
      const step = P.steps[P.i];
      const g = el.dataset.g;
      S.grade(step.i, g);
      P.reviewed += 1;
      if (g === "good" || g === "easy") P.easy += 1;
      if (g === "again" && !step.again && !step.check) {
        const at = P.steps.findIndex((s, k) => k > P.i && s.type !== "card");
        P.steps.splice(at < 0 ? P.steps.length - 1 : at, 0, Object.assign({}, step, { again: true }));
      }
      S.save();
      haptic(10);
      next();
    },

    choose(el) {
      const step = P.steps[P.i];
      if (step.answered) return;
      step.answered = true;
      const i = +el.dataset.i;
      $$("#player .opt").forEach((b, j) => {
        b.disabled = true;
        if (j === step.a) { b.classList.add("correct"); $(".opt-mark", b).innerHTML = icon("checkFill"); }
        else if (j === i) { b.classList.add("wrong"); $(".opt-mark", b).innerHTML = icon("xFill"); }
      });
      answer(step, i === step.a, step.o[step.a]);
      S.save();
    },

    rep() {
      const step = P.steps[P.i];
      step.reps = Math.min(3, step.reps + 1);
      $$("#player .rep-dots span").forEach((s, i) => s.classList.toggle("on", i < step.reps));
      haptic(10);
      shadowFoot(step);
    },

    "mic-word"(el) { runMic(el, S.word(+el.dataset.i).en); },
    "mic-card"(el) { const step = P.steps[P.i]; runMic(el, S.word(step.i).en); },
    "mic-sentence"(el) {
      const step = P.steps[P.i];
      runMic(el, sentenceOf(step).ex, (best) => {
        if (step.type === "shadow" && best.s >= 70) { step.reps = 3; $$("#player .rep-dots span").forEach((s) => s.classList.add("on")); shadowFoot(step); }
      });
    },
    hint(el) {
      const words = el.dataset.text.split(" ");
      toast("Começa com: “" + words.slice(0, Math.max(1, Math.ceil(words.length / 3))).join(" ") + "…”");
    },
    "hear-reveal"() {
      const step = P && P.steps[P.i];
      if (!step || step.type !== "hear" || step.answered) return;
      step.answered = true;
      const p = phraseById(step.pid);
      const box = $("#hear-box");
      const typed = box ? box.value.trim() : "";
      if (box) box.disabled = true;
      let fb = "";
      if (typed) {
        const score = Math.round(Math.max(soundMatch(typed, p.br), soundMatch(typed, p.real), soundMatch(typed, p.en)) * 100);
        P.hearSum = (P.hearSum || 0) + score;
        P.hearN = (P.hearN || 0) + 1;
        fb = '<p class="hear-you">Você escreveu: <b>' + esc(typed) + "</b> · " + (score >= 75 ? "seu ouvido pegou o som!" : score >= 50 ? "chegou perto (" + score + "%)." : "o som é outro (" + score + "%). Ouça de novo comparando.") + "</p>";
      }
      $("#hear-answer").innerHTML = fb +
        '<div class="hear-reveal"><p class="eyebrow">Como soa</p><p class="sound-br">' + esc(p.br) + "</p>" +
        '<p class="eyebrow">Em inglês</p><p class="hear-en" lang="en">' + esc(p.en) + '</p><p class="sound-real" lang="en">' + esc(p.real) + "</p>" +
        '<p class="eyebrow">Significa</p><p class="headline">' + esc(p.pt) + "</p>" +
        (p.why ? '<p class="subhead secondary why-line">' + icon("bulb", "icon-sm") + "<span>" + esc(p.why) + "</span></p>" : "") +
        '<div class="controls"><button class="btn btn-filled btn-capsule" data-action="speak" data-text="' + esc(p.real || p.en) + '">' + icon("play") + "Natural</button>" +
        '<button class="btn btn-capsule" data-action="speak" data-text="' + esc(p.real || p.en) + '" data-rate="0.6">Devagar</button></div></div>';
      SP.speak(p.real || p.en);
      setFoot(primary("Continuar"));
    },
    "reveal-sentence"() {
      const step = P.steps[P.i];
      if (step.pid) S.pintroduce(step.pid);
      $("#speak-answer").hidden = false;
      SP.speak(sentenceOf(step).ex);
      S.state.spoken += 1;
      setFoot(primary("Continuar"));
    },

    "talk-send"() { sendTalk(); },
    "talk-mic"(el) {
      const box = $("#talk-box");
      let listening;
      try { listening = SP.listen(); } catch (e) { listening = Promise.reject(e); }
      el.classList.add("playing");
      listening.then((alts) => { box.value = (box.value ? box.value + " " : "") + alts[0]; box.focus(); })
        .catch((e) => toast(micErrorText(e)))
        .finally(() => el.classList.remove("playing"));
    },

    async "backup-copy"() {
      const data = S.exportJSON();
      try { await navigator.clipboard.writeText(data); toast("Backup copiado"); }
      catch (e) { const box = $("#backup-box"); box.value = data; box.focus(); box.select(); toast("Copie o texto selecionado"); }
    },
    "backup-restore"() {
      try { S.importJSON($("#backup-box").value.trim()); toast("Backup restaurado"); $("#app").innerHTML = ""; render(); }
      catch (e) { toast("Texto inválido. Cole o backup completo."); }
    },
    async "sync-copy"() {
      try { await navigator.clipboard.writeText(Sync.key); toast("Código copiado"); }
      catch (e) { const box = $("#sync-code-box"); if (box) { box.focus(); box.select(); } toast("Copie o código selecionado"); }
    },
    async "sync-now"() {
      toast("Sincronizando…");
      try { await Sync.pull(); await Sync.push(); } catch (e) { /* o status mostra o erro */ }
      toast(Sync.status === "ok" ? syncText() : Sync.status === "off" ? "A nuvem não está disponível aqui. Seu progresso continua salvo neste aparelho." : "Sem conexão com a nuvem agora. Seu progresso continua salvo neste aparelho.");
      render();
    },
    async "sync-use"(el) {
      const box = $(el.dataset.field || "#sync-key");
      const k = box ? box.value.trim() : "";
      if (!k) { toast("Cole o código de sincronização."); return; }
      el.disabled = true;
      try {
        await Sync.useKey(k);
        toast("Progresso carregado");
        $("#app").innerHTML = "";
        render();
      } catch (e) {
        toast(e.message === "codigo" ? "Código inválido. Ele tem 36 caracteres, com hifens." : e.message === "vazio" ? "Nenhum progresso salvo com esse código." : e.message === "indisponivel" ? "Use o código no site do app. Aqui o progresso já fica na sua conta do Claude." : "Não consegui conectar. Verifique a internet.");
      }
      el.disabled = false;
    },
    async "mark-upto"() {
      const n = Math.floor(+($("#upto") || {}).value);
      if (!(n >= 1 && n <= S.CORE)) { toast("Digite um número de 1 a 500."); return; }
      const ok = await alertDialog({ title: "Registrar até a palavra " + n + "?", text: "As palavras 1 a " + n + " entram como estudadas e vão para revisão agora. As rodadas completas ficam marcadas como feitas.", ok: "Registrar", cancel: "Cancelar" });
      if (!ok) return;
      S.markStudiedUpTo(n);
      toast("Registrado: " + n + " palavras estudadas");
      if (location.hash !== "#intensivo") location.hash = "intensivo"; else render();
    },
    async "reset-timer"() {
      const ok = await alertDialog({ title: "Reiniciar o cronômetro?", text: "As 8 horas recomeçam agora. Palavras, notas e revisões ficam como estão.", ok: "Reiniciar", cancel: "Cancelar" });
      if (!ok) return;
      S.state.session = { startedAt: Date.now(), lastBreakEnd: Date.now(), breaks: [], finishedAt: null };
      S.save();
      toast("Cronômetro reiniciado");
      render();
    },
    async reset() {
      const ok = await alertDialog({ title: "Apagar todo o progresso?", text: "Palavras, revisões, notas e o cronômetro deste aparelho serão apagados. Isso não pode ser desfeito.", ok: "Apagar", danger: true });
      if (!ok) return;
      S.reset(false);
      $("#app").innerHTML = "";
      location.hash = "";
      render();
    }
  };

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".popover, .node")) closePopover();
    const el = e.target.closest("[data-action]");
    if (!el || el.disabled) return;
    const fn = ACTIONS[el.dataset.action];
    if (fn) { e.preventDefault(); fn(el, e); }
  });

  let saveTimer;
  const saveSoon = () => { clearTimeout(saveTimer); saveTimer = setTimeout(() => S.save(), 400); };
  document.addEventListener("input", (e) => {
    const el = e.target;
    const kind = el.dataset && el.dataset.input;
    if (!kind) return;
    if (kind === "wsearch") { refreshWordGroups(); return; }
    if (kind === "decode") { const box = $("#decode-results"); if (box) box.innerHTML = decodeHtml(el.value); return; }
    if (kind === "note") {
      const v = el.value.trim();
      if (v) S.state.notes[+el.dataset.i] = el.value; else delete S.state.notes[+el.dataset.i];
      saveSoon();
      return;
    }
    if (kind === "pad") { S.state.pad = el.value; saveSoon(); return; }
    if (kind === "pnote") {
      const v = el.value.trim();
      if (v) S.state.pnotes[el.dataset.pid] = el.value; else delete S.state.pnotes[el.dataset.pid];
      saveSoon();
      return;
    }
    if (kind === "name") { S.state.profile.name = el.value.trim(); saveSoon(); }
  });

  document.addEventListener("change", (e) => {
    const el = e.target;
    const kind = el.dataset && el.dataset.input;
    if (!kind) return;
    if (kind === "voice") { S.state.settings.voiceURI = el.value; S.save(); }
    else if (kind === "autoplay") { S.state.settings.autoplay = el.checked; S.save(); }
  });

  document.addEventListener("click", (e) => {
    const f = e.target.closest("[data-filter] [data-value]");
    if (f) {
      wordFilter = f.dataset.value;
      $$("[data-filter] [data-value]").forEach((x) => x.setAttribute("aria-pressed", String(x === f)));
      refreshWordGroups();
      return;
    }
    const b = e.target.closest("[data-setting] [data-value]");
    if (!b) return;
    const group = b.closest("[data-setting]");
    const key = group.dataset.setting;
    if (key === "rate") S.state.settings.rate = +b.dataset.value;
    else if (key === "theme") { S.state.settings.theme = b.dataset.value; applyTheme(); }
    else if (key === "ankiNew") S.state.settings.ankiNew = +b.dataset.value;
    else if (key === "ankiDir") S.state.settings.ankiDir = b.dataset.value;
    S.save();
    $$("[data-value]", group).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    if (key === "rate" && SP.hasTTS) SP.speak("This is how I sound.");
    if (key === "ankiNew" || key === "ankiDir") { const y = window.scrollY; render(); window.scrollTo(0, y); }
  });

  document.addEventListener("keydown", (e) => {
    if (A && !$(".alert-backdrop") && !$(".sheet-backdrop")) {
      const t = (e.target.tagName || "").toLowerCase();
      if (t === "input" || t === "textarea" || t === "select") return;
      if (e.key === "Escape") { e.preventDefault(); ankiClose(); return; }
      if (e.key === " " || e.key === "Enter") {
        if (t === "button" && e.target.closest("#ak-card")) return;
        e.preventDefault();
        if (!A.cur) ankiClose(); else if (!A.shown) ACTIONS["anki-show"](); else ACTIONS["anki-grade"]({ dataset: { g: "good" } });
        return;
      }
      if (/^[1-4]$/.test(e.key) && A.shown) { e.preventDefault(); ACTIONS["anki-grade"]({ dataset: { g: ANKI_GRADES[+e.key - 1][0] } }); return; }
      if (e.key === "z" || e.key === "Z") { e.preventDefault(); ACTIONS["anki-undo"](); }
      return;
    }
    if (!P || $(".alert-backdrop")) return;
    const tag = (e.target.tagName || "").toLowerCase();
    if (e.key === "Escape") { e.preventDefault(); requestClose(); return; }
    const step = P.steps[P.i];
    if (tag === "textarea" && step.type === "talk" && e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendTalk(); return; }
    if (e.key === "Enter" && e.target.id === "hear-box") { e.preventDefault(); ACTIONS["hear-reveal"](); return; }
    if (tag === "textarea" || tag === "input" || tag === "select") return;
    if (/^[1-4]$/.test(e.key)) {
      const sel = step.type === "choice" && !step.answered ? "#player .opt" : step.type === "card" || step.type === "pcard" ? "#player .grade" : null;
      const b = sel && $$(sel)[+e.key - 1];
      if (b) { e.preventDefault(); b.click(); }
      return;
    }
    if ((e.key === "Enter" || e.key === " ") && (tag === "body" || e.target.classList.contains("player-inner") || e.target.id === "player")) {
      const btn = $("#player [data-primary]:not([disabled])");
      if (btn) { e.preventDefault(); btn.click(); }
    }
  });

  window.addEventListener("hashchange", () => {
    if (A) ankiClose();
    else if (P) closePlayer();
    else render();
    window.scrollTo(0, 0);
    onScroll();
  });

  /* Relógio: atualiza o tempo a cada 30 s e avisa a pausa sem recarregar a tela. */
  let breakShown = false;
  setInterval(() => {
    if (!S.state.profile || !S.state.session.startedAt) return;
    const el = Math.min(S.elapsedMin(), 999 * 60);
    $$('[data-live="elapsed"], [data-live="elapsed-chip"]').forEach((n) => { n.textContent = hm(el); });
    if (S.breakDue() && !breakShown && !P && !$("#break") && route().view === "intensivo" && !$(".break-card")) {
      breakShown = true;
      const active = document.activeElement;
      if (!(active && active.matches && active.matches("input, textarea"))) { const y = window.scrollY; render(); window.scrollTo(0, y); }
    }
    if (!S.breakDue()) breakShown = false;
  }, 30000);

  if (window.speechSynthesis && window.speechSynthesis.addEventListener) {
    window.speechSynthesis.addEventListener("voiceschanged", () => {
      const active = document.activeElement;
      if (!P && route().view === "ajustes" && S.state.profile && !(active && active.matches && active.matches("input, textarea, select"))) render();
    });
  }
  SP.onReady = () => { if (!P && S.state.profile && route().view !== "intensivo") render(); };

  /* ───────── Início ───────── */
  try { if ("scrollRestoration" in history) history.scrollRestoration = "manual"; } catch (e) { /* ignora */ }
  S.persist();
  render();
  if (window.Sync) {
    Sync.onRemote = () => { if (!P) { $("#app").innerHTML = ""; render(); } };
    Sync.onStatus(() => {
      $$('[data-live="sync"]').forEach((n) => { n.textContent = syncText(); });
      $$('[data-live="sync-dot"]').forEach((n) => { n.className = "stat sync " + Sync.status; n.setAttribute("aria-label", "Sincronização: " + syncText()); });
    });
    Sync.init();
  }
})();
