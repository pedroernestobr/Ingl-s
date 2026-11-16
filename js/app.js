/* Intensivo 500 — 500 palavras em 8 horas. Telas, navegação, trilha de rodadas e o player de estudo. */
(function () {
  "use strict";

  const S = window.Store;
  const SP = window.Speech;
  const BLOCKS = window.BLOCKS;
  const ROUND_NAMES = window.ROUND_NAMES;
  const MIN = 60000;

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
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'
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
    { id: "intensivo", label: "Intensivo", icon: "route" },
    { id: "palavras", label: "Palavras", icon: "textformat" },
    { id: "revisar", label: "Revisar", icon: "cards" },
    { id: "caderno", label: "Caderno", icon: "pencil" },
    { id: "metodo", label: "Método", icon: "book" }
  ];

  function renderShell() {
    $("#app").innerHTML =
      '<div class="app">' +
      '<nav class="sidebar" aria-label="Navegação principal"><p class="side-title title2">Intensivo 500</p>' +
      NAV.concat([{ id: "ajustes", label: "Ajustes", icon: "gear" }]).map((n) => '<a class="side-link" data-nav="' + n.id + '" href="#' + n.id + '">' + icon(n.icon) + "<span>" + n.label + '</span><span class="badge" data-badge="' + n.id + '" hidden></span></a>').join("") +
      '<p class="side-foot footnote secondary" id="side-foot"></p></nav>' +
      '<div class="main"><div class="main-inner">' +
      '<header class="navbar" id="navbar"><div class="navbar-inner"><div class="nav-left" id="nav-left"></div><div class="nav-title" id="nav-title"></div><div class="nav-right" id="nav-right"></div></div></header>' +
      '<main id="view" class="view" tabindex="-1"></main>' +
      "</div></div>" +
      '<nav class="tabbar" aria-label="Navegação principal">' +
      NAV.map((n) => '<a class="tab" data-nav="' + n.id + '" href="#' + n.id + '">' + icon(n.icon) + "<span>" + n.label + '</span><span class="badge" data-badge="' + n.id + '" hidden></span></a>').join("") +
      "</nav></div>";
  }

  function updateChrome(r, meta) {
    $$("[data-nav]").forEach((a) => { if (a.dataset.nav === r.view) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    const due = S.dueIds().length;
    $$('[data-badge="revisar"]').forEach((b) => { b.hidden = due === 0; b.textContent = due > 99 ? "99+" : due; });
    $("#navbar").hidden = !!meta.hideNav;
    $("#nav-title").textContent = meta.title;
    $("#nav-left").innerHTML = meta.back ? '<a class="back-btn" href="' + meta.back[0] + '">' + icon("chevL") + esc(meta.back[1]) + "</a>" : "";
    const c = S.counts();
    const foot = $("#side-foot");
    if (foot) foot.innerHTML = c.learned + " de " + S.N + " palavras aprendidas.<br>Progresso salvo neste aparelho.";
    onScroll();
  }

  function onScroll() {
    const nb = $("#navbar");
    if (nb) nb.classList.toggle("scrolled", window.scrollY > 36);
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  function route() {
    const h = (location.hash || "").slice(1);
    return { view: VIEWS[h] ? h : "intensivo" };
  }

  function render() {
    applyTheme();
    if (!S.state.profile) { renderOnboarding(); return; }
    if (!$("#view")) renderShell();
    const r = route();
    const out = VIEWS[r.view](r);
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
      '<div class="app-icon" aria-hidden="true">500</div>' +
      '<h1 class="h1 center two-tone">500 palavras.<span class="second">Em 8 horas. Hoje.</span></h1>' +
      '<div class="features">' +
      [["target", "As 500 que mais importam", "As palavras mais usadas do inglês, em ordem de frequência. As 100 primeiras já formam cerca de metade de qualquer texto."],
        ["layers", "5 palavras por vez", "Ver, ouvir, repetir em voz alta, anotar e testar. Em grupos pequenos, como fazem os poliglotas."],
        ["repeat", "Revisão no minuto certo", "Cada palavra volta em 1, 10 e 30 minutos e depois em 2 horas, antes de você esquecer."],
        ["chat", "Pronúncia e conversa", "Shadowing, falar frases em inglês e conversar com a IA em toda rodada."]]
        .map((f) => '<div class="feature-row"><span class="ficon">' + icon(f[0]) + '</span><div><p class="headline">' + f[1] + '</p><p class="subhead secondary">' + f[2] + "</p></div></div>").join("") +
      "</div>" +
      '<form id="onboard-form" class="view" novalidate style="gap:24px">' +
      section("", list(['<label class="cell" for="ob-name"><span class="cell-body"><span class="cell-title">Seu nome</span></span><input class="cell-input" id="ob-name" autocomplete="given-name" placeholder="Opcional" maxlength="40"></label>']),
        "Sem cadastro. Seu progresso fica salvo neste aparelho. O cronômetro de 8 horas só começa quando você mandar.") +
      '<button class="btn btn-filled btn-large" type="submit">Continuar</button>' +
      "</form></div></div>";
    $("#onboard-form").addEventListener("submit", (e) => {
      e.preventDefault();
      S.state.profile = { name: $("#ob-name").value.trim(), createdAt: new Date().toISOString() };
      S.save();
      $("#app").innerHTML = "";
      location.hash = "intensivo";
      render();
    });
  }

  /* ═══════════════════════ INTENSIVO ═══════════════════════ */

  const PATH_X = [0, 52, 78, 52, 0, -58];
  const STEP_Y = 96, PAD_Y = 30;
  const nodeSize = (k) => (k === 6 ? 78 : 68);

  function nodeInfo(id) {
    const n = +id.slice(1);
    if (id[0] === "r") {
      const words = S.roundRange(n);
      return { kind: "round", n, block: S.blockOfRound(n), title: ROUND_NAMES[n - 1], words, label: "Rodada " + n, est: "20 min" };
    }
    return { kind: "check", n, block: n, title: "Prova do bloco " + n, words: S.blockRange(n), label: "Prova", est: "10 min" };
  }
  function isLocked(id) {
    const nid = S.nextId();
    if (!nid || S.isDone(id)) return false;
    const ids = S.nodeIds();
    return ids.indexOf(id) > ids.indexOf(nid);
  }
  function nodeState(id, nid) { return S.isDone(id) ? "done" : id === nid ? "current" : "locked"; }
  const learnedIn = (idxs) => idxs.filter((i) => S.status(i) === "learned").length;

  function nextAction() {
    const st = S.state;
    const c = S.counts();
    const due = S.dueIds().length;
    const nid = S.nextId();
    if (!st.session.startedAt) return { label: "Começar o intensivo", action: "start-session" };
    if (due >= 15) return { label: "Revisar " + due + " palavras", action: "review", why: "Revisões vencidas vêm primeiro: é nessa hora que a memória fixa." };
    if (nid) {
      const info = nodeInfo(nid);
      return info.kind === "round"
        ? { label: "Começar a rodada " + info.n, action: "start", id: nid, why: info.title + " · palavras " + (info.words[0] + 1) + "–" + (info.words[24] + 1) + "." }
        : { label: "Fazer a prova do bloco " + info.n, action: "start", id: nid, why: "30 palavras do bloco: veja em português e diga em inglês." };
    }
    if (c.learned < S.N) return { label: "Maratona final · faltam " + (S.N - c.learned), action: "practice-left", why: "Treine as palavras que ainda não fixaram até chegar às 500." };
    return { label: "Revisão relâmpago", action: "practice-random", why: "Você aprendeu as 500. Amanhã, revise as que voltarem." };
  }

  function dashboard() {
    const st = S.state;
    const c = S.counts();
    const el = S.elapsedMin();
    const target = S.paceTarget();
    const diff = c.learned - target;
    const act = nextAction();
    const due = S.dueIds().length;
    let pace;
    if (c.learned >= S.N) pace = "Você chegou às 500 palavras.";
    else if (el >= S.SESSION_MIN) pace = "As 8 horas acabaram. Faltam " + (S.N - c.learned) + ": siga na maratona final.";
    else if (el < 20) pace = "Primeiros minutos. As palavras contam como aprendidas depois da segunda revisão, 10 minutos depois.";
    else if (diff >= 0) pace = "Você está " + plural(diff, "palavra", "palavras") + " à frente do ritmo das 8 horas.";
    else pace = "Você está " + plural(-diff, "palavra", "palavras") + " atrás do ritmo. Revisar agora ajuda a recuperar.";
    const wordsPct = Math.round((c.learned / S.N) * 100);
    const timePct = Math.round((Math.min(el, S.SESSION_MIN) / S.SESSION_MIN) * 100);
    return '<div class="card dash">' +
      '<div class="dash-stats">' +
      '<div><p class="eyebrow">Aprendidas</p><p class="dash-num"><span data-live="learned">' + c.learned + "</span><small>/" + S.N + "</small></p></div>" +
      '<div><p class="eyebrow">Tempo</p><p class="dash-num"><span data-live="elapsed">' + hm(Math.min(el, 999 * 60)) + "</span><small>/8:00</small></p></div>" +
      '<div><p class="eyebrow">Vistas</p><p class="dash-num">' + c.seen + "<small>/" + S.N + "</small></p></div>" +
      "</div>" +
      '<div class="dash-bars">' +
      '<div class="dash-bar"><span class="caption secondary">Palavras</span><div class="progress good" role="img" aria-label="' + wordsPct + '% das palavras"><span style="width:' + wordsPct + '%"></span><i class="target" style="left:' + Math.round((target / S.N) * 100) + '%" title="Ritmo ideal agora"></i></div></div>' +
      '<div class="dash-bar"><span class="caption secondary">Tempo</span><div class="progress" role="img" aria-label="' + timePct + '% do tempo"><span style="width:' + timePct + '%"></span></div></div>' +
      "</div>" +
      '<p class="subhead secondary" data-live="pace">' + esc(pace) + "</p>" +
      '<button class="btn btn-filled btn-large" data-action="' + act.action + '"' + (act.id ? ' data-id="' + act.id + '"' : "") + ">" + icon("play") + esc(act.label) + "</button>" +
      (act.why ? '<p class="footnote secondary center">' + esc(act.why) + "</p>" : "") +
      (due && act.action !== "review" ? '<button class="btn btn-plain" data-action="review" style="align-self:center">Revisar ' + plural(due, "palavra vencida", "palavras vencidas") + "</button>" : "") +
      (st.session.startedAt ? '<p class="footnote tertiary center">Começou às ' + clock(st.session.startedAt) + " · termina às " + clock(st.session.startedAt + S.SESSION_MIN * MIN) + "</p>" : "") +
      "</div>";
  }

  function startCard() {
    const end = Date.now() + S.SESSION_MIN * MIN;
    return '<div class="card dash">' +
      list([
        cell({ icon: "layers", title: "20 rodadas de 25 palavras", sub: "Cerca de 20 minutos cada, em grupos de 5 palavras." }),
        cell({ icon: "repeat", title: "Revisão espaçada em minutos", sub: "1 min, 10 min, 30 min, 2 horas e amanhã." }),
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

  function unitHtml(b, nid) {
    const blk = BLOCKS[b - 1];
    const ids = [];
    for (let k = 1; k <= S.PER_BLOCK; k++) ids.push("r" + ((b - 1) * S.PER_BLOCK + k));
    ids.push("c" + b);
    const pts = ids.map((id, k) => { const s = nodeSize(k + 1); return { id, k: k + 1, x: PATH_X[k], y: PAD_Y + k * STEP_Y + s / 2, s }; });
    const H = PAD_Y + 5 * STEP_Y + nodeSize(6) + 40;
    let svg = '<svg class="path-line" width="400" height="' + H + '" viewBox="-200 0 400 ' + H + '" aria-hidden="true">';
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], z = pts[i + 1];
      svg += '<path class="seg' + (S.isDone(a.id) ? " on" : "") + '" d="M' + a.x + " " + a.y + " C" + a.x + " " + (a.y + 50) + " " + z.x + " " + (z.y - 50) + " " + z.x + " " + z.y + '"/>';
    }
    svg += "</svg>";
    const words = S.blockRange(b);
    const nodes = pts.map((pt) => {
      const state = nodeState(pt.id, nid);
      const info = nodeInfo(pt.id);
      const top = pt.y - pt.s / 2;
      let extra = "";
      if (state === "current") {
        const r = pt.s / 2 + 8, c = 2 * Math.PI * r, box = pt.s + 22;
        const done = learnedIn(info.words) / info.words.length;
        extra = '<svg class="node-ring" viewBox="0 0 ' + box + " " + box + '" aria-hidden="true"><circle class="track" cx="' + box / 2 + '" cy="' + box / 2 + '" r="' + r + '" fill="none" stroke-width="6"/>' +
          (done ? '<circle class="val" cx="' + box / 2 + '" cy="' + box / 2 + '" r="' + r + '" fill="none" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - done)).toFixed(1) + '" transform="rotate(-90 ' + box / 2 + " " + box / 2 + ')"/>' : "") + "</svg>" +
          '<span class="node-bubble ' + (pt.x >= 0 ? "left" : "right") + '">' + (pt.id === "r1" && !S.state.session.startedAt ? "Comece aqui" : info.kind === "round" ? "Rodada " + info.n : "Prova") + "</span>";
      }
      const glyph = state === "locked" ? (info.kind === "check" ? "trophy" : "lock") : state === "done" && info.kind === "round" ? "check" : info.kind === "check" ? "trophy" : "star";
      return '<button class="node ' + state + " " + (info.kind === "check" ? "review" : "lesson") + '" data-action="node" data-id="' + pt.id + '" data-x="' + pt.x + '" data-top="' + top + '" data-size="' + pt.s + '"' +
        ' style="top:' + top + "px;left:calc(50% + " + (pt.x - pt.s / 2) + "px);width:" + pt.s + "px;height:" + pt.s + 'px"' +
        ' aria-label="' + esc(info.label + ": " + info.title) + ", " + { done: "concluída", current: "próxima", locked: "bloqueada" }[state] + '">' + icon(glyph) + extra + "</button>";
    }).join("");
    return '<section class="unit" style="--c:var(--phase-' + b + ')" id="b' + b + '">' +
      '<header class="unit-head"><div><p class="unit-eyebrow">Bloco ' + b + " · " + ((b - 1) * 2) + "h–" + (b * 2) + "h · " + learnedIn(words) + "/" + words.length + '</p><h2 class="unit-title">' + esc(blk.name) + "</h2></div>" +
      '<span class="unit-range caption secondary">' + (words[0] + 1) + "–" + (words[words.length - 1] + 1) + "</span></header>" +
      '<div class="unit-path" style="height:' + H + 'px">' + svg + nodes + "</div></section>";
  }

  function viewIntensivo() {
    const st = S.state;
    const c = S.counts();
    const due = S.dueIds().length;
    const started = !!st.session.startedAt;
    const name = st.profile.name;
    const nid = S.nextId();
    let html = '<div class="statbar">' +
      '<a class="avatar" href="#ajustes" aria-label="Ajustes">' + initial() + "</a>" +
      '<div class="stats">' +
      '<span class="stat" aria-label="Tempo de estudo">' + icon("clock") + '<span data-live="elapsed-chip">' + (started ? hm(Math.min(S.elapsedMin(), 999 * 60)) : "0:00") + "</span></span>" +
      '<a class="stat" href="#palavras" aria-label="' + c.learned + ' palavras aprendidas">' + icon("check") + "<span>" + c.learned + "</span></a>" +
      '<a class="stat cards' + (due ? " due" : "") + '" href="#revisar" aria-label="' + plural(due, "palavra", "palavras") + ' para revisar">' + icon("cards") + "<span>" + due + "</span></a>" +
      "</div></div>";
    html += ltHeader(started ? c.learned + " de 500." : "500 palavras.", {
      eyebrow: started ? (name ? esc(name) + " · " : "") + "intensivo de hoje" : (name ? "Olá, " + esc(name) : "Olá"),
      avatar: false, cls: "trail-hero",
      second: started ? (c.learned >= S.N ? "Meta batida." : "Faltam " + (S.N - c.learned) + ".") : "Em 8 horas. Hoje."
    });
    if (!S.storageOk) html += '<p class="tag">Este navegador não está salvando seu progresso (modo privado?).</p>';
    if (S.breakDue()) html += breakCard();
    html += started ? dashboard() : startCard();
    for (let b = 1; b <= S.BLOCKS; b++) {
      html += '<div class="phase-divider"><span>Bloco ' + b + " · horas " + ((b - 1) * 2) + " a " + b * 2 + "</span></div>";
      html += unitHtml(b, nid);
    }
    html += '<div class="path-end">' + icon("trophy") + '<p class="headline">Maratona final</p><p class="subhead secondary">Treine as que faltam até chegar às 500 aprendidas.</p>' +
      (!nid ? '<button class="btn btn-filled" data-action="practice-left" style="margin-top:12px">Treinar as que faltam</button>' : "") + "</div>";
    return { html, meta: { title: "Intensivo", hideNav: true } };
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
    const state = nodeState(id, S.nextId());
    const pop = document.createElement("div");
    pop.className = "popover";
    pop.setAttribute("role", "dialog");
    pop.style.top = (+el.dataset.top + +el.dataset.size + 16) + "px";
    pop.style.setProperty("--ax", el.dataset.x + "px");
    const sub = info.kind === "round"
      ? '<span lang="en">' + esc(info.words.slice(0, 10).map((i) => S.word(i).en).join(" · ")) + " …</span>"
      : "30 palavras do bloco. Você vê em português e diz em inglês.";
    const rec = S.state.nodes[id];
    const action = state === "locked"
      ? '<p class="footnote secondary">Conclua as etapas anteriores para liberar.</p><button class="btn btn-plain" data-action="start" data-id="' + id + '" data-force="1">Abrir mesmo assim</button>'
      : '<button class="btn btn-filled btn-large" data-action="start" data-id="' + id + '" data-force="1">' + icon("play") + (state === "done" ? "Refazer" : "Começar") + "</button>";
    pop.innerHTML = '<p class="eyebrow">' + esc(info.label) + " · " + info.est + " · " + learnedIn(info.words) + "/" + info.words.length + " aprendidas</p>" +
      '<p class="title3">' + esc(info.title) + '</p><p class="subhead secondary">' + sub + "</p>" +
      (rec ? '<p class="footnote secondary">Última vez: ' + rec.correct + "/" + rec.total + " acertos.</p>" : "") + action;
    el.parentElement.appendChild(pop);
    el.classList.add("open-pop");
    // O último nó do bloco abre o balão para cima, longe do cabeçalho do bloco seguinte.
    if (info.kind === "check") {
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
  const STATUS_LABEL = { new: "Nova", training: "Em treino", learned: "Aprendida" };

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
    return any ? out : '<p class="subhead secondary center" style="padding:24px 0">Nenhuma palavra aqui ainda.</p>';
  }

  function viewPalavras() {
    const c = S.counts();
    const seg = [["all", "Todas"], ["new", "Novas"], ["training", "Em treino"], ["learned", "Aprendidas"]];
    const html =
      ltHeader("500 palavras.", { eyebrow: "As mais usadas do inglês", second: c.learned + " aprendidas." }) +
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
    const close = () => { wrap.remove(); document.removeEventListener("keydown", onKey, true); if (route().view === "palavras") refreshWordGroups(); };
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

  /* ═══════════════════════ REVISAR ═══════════════════════ */
  const BOX_LABEL = ["1 min", "10 min", "30 min", "2 h", "amanhã"];
  function viewRevisar() {
    const due = S.dueIds().length;
    const c = S.counts();
    const counts = S.boxCounts();
    const max = Math.max(1, ...counts);
    const nextIn = S.nextDueIn();
    let hero;
    if (due) {
      hero = '<div class="card pad-lg" style="display:flex;flex-direction:column;gap:16px">' +
        '<div><p class="big-number">' + due + '</p><p class="subhead secondary">' + (due === 1 ? "palavra no ponto de revisão" : "palavras no ponto de revisão") + "</p></div>" +
        '<button class="btn btn-filled btn-large" data-action="review">' + icon("play") + "Revisar agora</button></div>";
    } else if (c.seen) {
      hero = '<div class="card pad-lg" style="display:flex;flex-direction:column;gap:6px"><p class="title2">Nada vencido agora.</p><p class="subhead secondary">' +
        (nextIn ? "A próxima revisão vence em " + plural(nextIn, "minuto", "minutos") + ". Enquanto isso, siga para a próxima rodada." : "Siga para a próxima rodada.") + "</p></div>";
    } else {
      hero = '<div class="card pad-lg" style="display:flex;flex-direction:column;gap:12px"><p class="title2">Ainda não há palavras.</p><p class="subhead secondary">Cada rodada adiciona 25 palavras. Elas voltam para revisão em 1, 10 e 30 minutos.</p><a class="btn btn-filled btn-large" href="#intensivo">Ir para o intensivo</a></div>';
    }
    const boxes = '<div class="card"><div class="boxes" role="img" aria-label="Palavras por caixa: ' + counts.map((n, i) => "caixa " + (i + 1) + ", " + n).join("; ") + '">' +
      counts.map((n, i) => '<div class="box-col"><b>' + n + '</b><div class="box-bar"><span style="height:' + Math.round((n / max) * 100) + '%"></span></div><span class="caption">Caixa ' + (i + 1) + '</span><span class="caption secondary">' + BOX_LABEL[i] + "</span></div>").join("") +
      "</div></div>";
    const html =
      ltHeader("Revisar.", { eyebrow: "Repetição espaçada", second: due ? plural(due, "palavra", "palavras") + " agora." : "Em dia." }) +
      hero +
      (c.seen ? section("Suas caixas", boxes, "Acertou, a palavra sobe de caixa e volta mais tarde. Errou, volta para a caixa 1. A partir da caixa 3 ela conta como aprendida.") +
        section("Treino extra", list([
          cell({ action: "practice-left", icon: "target", title: "Treinar as que faltam", sub: plural(c.training, "palavra vista e ainda não aprendida", "palavras vistas e ainda não aprendidas") + ".", chevron: true }),
          cell({ action: "practice-random", icon: "shuffle", title: "Revisão relâmpago", sub: "20 palavras aleatórias que você já viu.", chevron: true })
        ], "icons")) : "");
    return { html, meta: { title: "Revisar" } };
  }

  /* ═══════════════════════ CADERNO ═══════════════════════ */
  function viewCaderno() {
    const notes = Object.keys(S.state.notes).map(Number).filter((i) => (S.state.notes[i] || "").trim()).sort((a, b) => a - b);
    const html =
      ltHeader("Caderno.", { eyebrow: "Suas anotações", second: plural(notes.length, "nota de palavra", "notas de palavras") + "." }) +
      section("Anotações livres", '<div class="list"><div class="cell"><label class="sr-only" for="pad">Anotações livres</label><textarea id="pad" data-input="pad" placeholder="Escreva frases suas com as palavras do dia, dúvidas, regras que você percebeu…" style="min-height:220px">' + esc(S.state.pad) + "</textarea></div></div>",
        "Salva sozinho. Escrever frases sobre a sua vida fixa mais do que copiar.") +
      section("Notas por palavra", notes.length ? list(notes.map((i) => cell({
        action: "word", attrs: 'data-i="' + i + '"', lead: '<span class="wbadge rank">' + (i + 1) + "</span>",
        title: '<span lang="en">' + esc(S.word(i).en) + "</span> · " + esc(S.word(i).pt), sub: esc(S.state.notes[i]), chevron: true
      })), "icons") : list([cell({ title: '<span class="secondary">Anote associações ao aprender cada palavra. Elas aparecem aqui.</span>' })])) +
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
      ["repeat", "Repetição espaçada", "1 min, 10 min, 30 min, 2 horas e amanhã. Cada revisão chega quando você está quase esquecendo."],
      ["book", "Contexto", "Cada palavra vem numa frase real, com tradução e áudio."],
      ["mic", "Pronúncia em voz alta", "Ouça, repita e teste com o microfone. A boca também precisa treinar."],
      ["headphones", "Shadowing", "Repita junto com o áudio, imitando ritmo e entonação."],
      ["chat", "Tradução reversa e conversa", "Veja a frase em português e diga em inglês. Depois converse com a IA usando as palavras da rodada."],
      ["pencil", "Associação e anotação", "Um som parecido ou uma imagem exagerada liga a palavra nova ao que você já sabe."],
      ["coffee", "Pausas e sono", "10 minutos de pausa a cada 50. Dormir à noite consolida o que você estudou hoje."]
    ];
    const html =
      ltHeader("Método.", { eyebrow: "Como funciona", second: "O que os poliglotas fazem." }) +
      section("10 técnicas", list(tech.map((t) => cell({ icon: t[0], title: t[1], sub: t[2] })), "icons")) +
      section("O dia de 8 horas", list(BLOCKS.map((b, k) => cell({
        lead: '<span class="wbadge">' + (k + 1) + "</span>",
        title: esc(b.name) + ' <span class="secondary">· ' + (k * 2) + "h–" + ((k + 1) * 2) + "h</span>",
        sub: "Palavras " + (k * 125 + 1) + "–" + ((k + 1) * 125) + ". 5 rodadas, 1 prova e 2 pausas."
      })).concat([
        cell({ icon: "trophy", title: "Maratona final", sub: "Treine as que faltam até as 500 ficarem aprendidas." }),
        cell({ icon: "moon", title: "Amanhã", sub: "20 minutos de revisão: as palavras da caixa 5 voltam." })
      ]), "icons")) +
      section("Uma rodada · 20 min", list([
        cell({ icon: "repeat", title: "Aquecimento", sub: "Revisões vencidas, misturadas.", value: "3 min" }),
        cell({ icon: "layers", title: "5 grupos de 5 palavras", sub: "Ver, ouvir, repetir, anotar e testar.", value: "12 min" }),
        cell({ icon: "headphones", title: "Shadowing", sub: "3 frases da rodada.", value: "2 min" }),
        cell({ icon: "mic", title: "Fale em inglês", sub: "3 frases: do português para o inglês.", value: "2 min" }),
        cell({ icon: "chat", title: "Conversa com IA", sub: "Quando disponível, usando as palavras da rodada.", value: "3 min" })
      ], "icons")) +
      section("Expectativa realista", '<div class="card prose body"><p>Em 8 horas dá para reconhecer as 500 palavras e usar boa parte delas em frases simples.</p><p class="secondary">O app só conta uma palavra como aprendida depois que você lembra dela duas vezes, com 10 minutos de intervalo. Para guardar de vez, revise amanhã e daqui a 3 dias.</p></div>');
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
      list([cell({ lead: '<span class="avatar lg">' + initial() + "</span>", title: '<span class="title3">' + (st.profile.name ? esc(st.profile.name) : "Estudante") + "</span>", sub: c.learned + " de 500 aprendidas" + (st.session.startedAt ? " · começou às " + clock(st.session.startedAt) : "") })]) +
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
        cell({ action: "reset-timer", cls: "link", title: "Reiniciar o cronômetro de 8 horas" }),
        cell({ action: "reset", cls: "destructive", title: "Apagar tudo e recomeçar" })
      ]), "Reiniciar o cronômetro mantém as palavras aprendidas.");
    return { html, meta: { title: "Ajustes" } };
  }

  const VIEWS = { intensivo: viewIntensivo, palavras: viewPalavras, revisar: viewRevisar, caderno: viewCaderno, metodo: viewMetodo, ajustes: viewAjustes };

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
    el.innerHTML = '<div class="player-body"><div class="player-inner break-inner">' +
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
      if (info.kind === "round") {
        rows = [];
        if (warm) rows.push(["repeat", "Aquecimento", plural(warm, "revisão vencida", "revisões vencidas"), "3 min"]);
        rows = rows.concat([
          ["layers", "25 palavras em 5 grupos", info.words.slice(0, 8).map((i) => S.word(i).en).join(", ") + "…", "12 min"],
          ["headphones", "Shadowing", "3 frases para ouvir e repetir", "2 min"],
          ["mic", "Fale em inglês", "3 frases do português para o inglês", "2 min"]
        ]);
        if (P.steps.some((s) => s.type === "talk")) rows.push(["chat", "Conversa com IA", "Use as palavras da rodada", "3 min"]);
      } else {
        rows = [["trophy", "30 palavras do bloco", "Você vê em português e diz em inglês", "8 min"], ["repeat", "Conta como revisão", "Acertos sobem de caixa; erros voltam para a 1", ""]];
      }
      el.innerHTML = '<div class="step-head">' + eyebrow(esc(info.label) + " · Bloco " + info.block + " · " + info.est) +
        '<h1 class="title1">' + esc(info.title) + "</h1>" +
        (info.kind === "round" ? '<p class="body secondary">Palavras ' + (info.words[0] + 1) + " a " + (info.words[24] + 1) + " das 500.</p>" : "") + "</div>" +
        list(rows.map((r) => cell({ icon: r[0], title: r[1], sub: esc(r[2]), value: r[3] })), "icons");
      setFoot(primary("Começar"));
    },

    card(step, el) {
      const w = S.word(step.i);
      const c = S.card(step.i) || { box: 1 };
      const dir = step.dir || (c.box >= 3 ? "pt" : "en");
      step.dirUsed = dir;
      const n = P.steps.slice(0, P.i + 1).filter((s) => s.type === "card").length;
      const total = P.steps.filter((s) => s.type === "card").length;
      const lbl = step.check ? "Prova" : step.warm ? "Aquecimento" : P.kind === "left" ? "Maratona" : "Revisão";
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
        '<div class="step-head">' + eyebrow("Palavra " + step.n + " de 25 · grupo " + step.g + " · Nº " + (step.i + 1)) + "</div>" +
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
      el.innerHTML = '<div class="step-head">' + eyebrow(esc(step.label) + " · teste rápido") + '<h1 class="title2 question">' + esc(step.q) + "</h1></div>" +
        (step.listen ? '<div class="controls"><button class="btn btn-tinted btn-capsule" data-action="speak" data-text="' + esc(step.listen) + '">' + icon("speaker") + 'Ouvir</button><button class="btn btn-capsule" data-action="speak" data-text="' + esc(step.listen) + '" data-rate="0.6">Mais devagar</button></div>' : "") +
        list(step.o.map((o, i) => '<button type="button" class="cell tappable opt" data-action="choose" data-i="' + i + '"><span class="cell-body"><span class="cell-title"' + (isEnglish(o) ? ' lang="en"' : "") + ">" + esc(o) + '</span></span><span class="opt-mark"></span></button>'));
      setFoot('<p class="foot-hint">Toque na resposta certa.</p>');
      if (step.listen) setTimeout(() => SP.speak(step.listen), 300);
    },

    shadow(step, el) {
      const w = S.word(step.i);
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
      const w = S.word(step.i);
      el.innerHTML = '<div class="step-head">' + eyebrow("Fale em inglês · " + step.k + " de " + step.n) +
        '<h1 class="title2">' + esc(w.exPt) + "</h1>" +
        '<p class="body secondary">Diga a frase em inglês, em voz alta. Depois confira.</p></div>' +
        '<div class="controls">' + micButton("mic-sentence") + '<button class="btn btn-capsule" data-action="hint" data-i="' + step.i + '">Dica</button></div>' +
        '<div class="mic-result" id="mic-result" hidden></div>' +
        '<div class="shadow-card" id="speak-answer" hidden><p class="title2" lang="en">' + esc(w.ex) + "</p>" +
        '<div class="controls"><button class="btn btn-filled btn-capsule" data-action="speak" data-text="' + esc(w.ex) + '">' + icon("play") + "Ouvir</button></div></div>";
      setFoot(primary("Mostrar em inglês", { action: "reveal-sentence" }));
    },

    talk(step, el) {
      el.innerHTML = '<div class="step-head">' + eyebrow("Conversa com IA") +
        '<h1 class="title2">Converse em inglês.</h1>' +
        '<p class="body secondary">Responda com frases curtas. Use as palavras da rodada. A IA corrige com uma dica em português.</p></div>' +
        '<div class="chat" id="chat" aria-live="polite"></div>' +
        '<div class="composer"><label class="sr-only" for="talk-box">Sua resposta em inglês</label><textarea id="talk-box" data-input="talk" lang="en" rows="2" placeholder="Answer in English…"></textarea>' +
        (SP.hasMic ? '<button class="speak" data-action="talk-mic" aria-label="Falar">' + icon("mic") + "</button>" : "") +
        '<button class="speak send" data-action="talk-send" aria-label="Enviar">' + icon("send") + "</button></div>";
      drawChat(step);
      talkFoot(step);
      if (!step.msgs.length && !step.busy) aiTurn(step);
    },

    finish(step, el) {
      const c = S.counts();
      let title, lead, stats;
      if (P.mode === "review") {
        title = P.kind === "left" ? "Maratona concluída" : "Revisão concluída";
        lead = c.learned >= S.N ? "Você chegou às 500 palavras aprendidas." : "Faltam " + (S.N - c.learned) + " para as 500.";
        stats = [[P.reviewed, "palavras"], [P.easy, "acertos"], [c.learned, "aprendidas"]];
      } else if (P.info.kind === "check") {
        title = "Prova do bloco " + P.info.n + " concluída";
        lead = "Você lembrou " + P.easy + " de " + P.reviewed + " em inglês.";
        stats = [[P.easy + "/" + P.reviewed, "acertos"], [learnedIn(P.info.words) + "/125", "do bloco"], [c.learned, "aprendidas"]];
      } else {
        title = "Rodada " + P.info.n + " concluída";
        lead = "As palavras novas voltam em 10 e 30 minutos. " + (S.breakDue() ? "Hora de uma pausa." : "Siga para a próxima.");
        stats = [[25, "palavras novas"], [P.correct + "/" + P.total, "acertos"], [c.learned, "aprendidas"]];
      }
      el.innerHTML = '<div class="step-head finish"><span class="finish-icon">' + icon("checkFill") + "</span>" +
        '<h1 class="title1">' + esc(title) + '</h1><p class="body secondary">' + esc(lead) + "</p></div>" +
        '<div class="summary center">' + stats.map((s) => "<div><b>" + s[0] + "</b><small>" + s[1] + "</small></div>").join("") + "</div>";
      const nid = S.nextId();
      const ghost = S.breakDue() ? ["finish-break", "Fazer pausa de 10 min"] : P.mode === "node" && nid ? ["next-node", "Próxima etapa"] : null;
      setFoot(primary("Concluído", { action: "player-done", ghost }));
      haptic(20);
    }
  };

  function shadowFoot(step) { setFoot(primary("Continuar", { disabled: step.reps < 3, ghost: ["skip", "Agora não posso falar"] })); }
  function talkFoot(step) {
    const n = step.msgs.filter((m) => m.role === "me").length;
    setFoot(primary(n >= 3 ? "Concluir conversa" : "Responda " + (3 - n) + "×", { disabled: n < 3 && !step.failed, ghost: ["skip", "Pular conversa"] }));
  }

  /* ───────── Conversa com IA ───────── */
  function talkRules(words) {
    return "You are a warm, patient English conversation partner for a Brazilian beginner (level A1) who is learning the 500 most common English words today.\n" +
      "Words from the current round: " + words.map((i) => S.word(i).en).join(", ") + ".\n" +
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
    const turns = [{ role: "user", content: talkRules(step.words) + "\n\nStart the conversation: greet the learner and ask your first question." }];
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
    if (!ok && !step.again) {
      let at = P.steps.findIndex((s, k) => k > P.i && s.type !== "choice");
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
      S.state.nodes[P.id] = { at: Date.now(), correct: isCheck ? P.easy : P.correct, total: isCheck ? P.reviewed : P.total, min: P.minutes };
      if (P.steps.some((s) => s.type === "talk" && s.msgs.length > 1)) S.state.talks += 1;
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
      openPlayer(id[0] === "r" ? buildRound(+id.slice(1)) : buildCheck(+id.slice(1)));
    },
    node(el) { openPopover(el); },
    review() { if (S.dueIds().length) openPlayer(buildReview("due")); else toast("Nada vencido agora."); },
    "practice-left"() { if (S.leftIds().length) openPlayer(buildReview("left")); else toast(S.counts().seen ? "Todas as palavras vistas já estão aprendidas." : "Faça uma rodada primeiro."); },
    "practice-random"() { if (S.counts().seen) openPlayer(buildReview("random")); else toast("Faça uma rodada primeiro."); },
    "take-break"() { openBreak(); },
    "snooze-break"() { S.state.session.lastBreakEnd = Date.now() - (S.BREAK_EVERY - 10) * MIN; S.save(); render(); },
    "end-break"() { endBreak(); },
    "finish-break"() { closePlayer(); openBreak(); },
    "player-close"() { requestClose(); },
    "player-done"() { closePlayer(); if (location.hash !== "#intensivo") location.hash = "intensivo"; },
    "next-node"() { const nid = S.nextId(); closePlayer(); if (nid) openPlayer(nid[0] === "r" ? buildRound(+nid.slice(1)) : buildCheck(+nid.slice(1))); },
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
      setFoot('<div class="grades">' +
        '<button class="grade again" data-action="grade" data-g="again">Errei' + lab("again") + "</button>" +
        '<button class="grade hard" data-action="grade" data-g="hard">Difícil' + lab("hard") + "</button>" +
        '<button class="grade easy" data-action="grade" data-g="easy" data-primary>Acertei' + lab("easy") + "</button></div>");
    },
    grade(el) {
      const step = P.steps[P.i];
      const g = el.dataset.g;
      S.grade(step.i, g);
      P.reviewed += 1;
      if (g === "easy") P.easy += 1;
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
      runMic(el, S.word(step.i).ex, (best) => {
        if (step.type === "shadow" && best.s >= 70) { step.reps = 3; $$("#player .rep-dots span").forEach((s) => s.classList.add("on")); shadowFoot(step); }
      });
    },
    hint(el) {
      const w = S.word(+el.dataset.i);
      const words = w.ex.split(" ");
      toast("Começa com: “" + words.slice(0, Math.max(1, Math.ceil(words.length / 3))).join(" ") + "…”");
    },
    "reveal-sentence"() {
      const step = P.steps[P.i];
      $("#speak-answer").hidden = false;
      SP.speak(S.word(step.i).ex);
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
    if (kind === "note") {
      const v = el.value.trim();
      if (v) S.state.notes[+el.dataset.i] = el.value; else delete S.state.notes[+el.dataset.i];
      saveSoon();
      return;
    }
    if (kind === "pad") { S.state.pad = el.value; saveSoon(); return; }
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
    S.save();
    $$("[data-value]", group).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    if (key === "rate" && SP.hasTTS) SP.speak("This is how I sound.");
  });

  document.addEventListener("keydown", (e) => {
    if (!P || $(".alert-backdrop")) return;
    const tag = (e.target.tagName || "").toLowerCase();
    if (e.key === "Escape") { e.preventDefault(); requestClose(); return; }
    const step = P.steps[P.i];
    if (tag === "textarea" && step.type === "talk" && e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendTalk(); return; }
    if (tag === "textarea" || tag === "input" || tag === "select") return;
    if (/^[1-4]$/.test(e.key)) {
      const sel = step.type === "choice" && !step.answered ? "#player .opt" : step.type === "card" ? "#player .grade" : null;
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
    if (P) closePlayer();
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
  S.save();
  render();
})();
