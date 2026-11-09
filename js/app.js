/* Inglês em 12 Semanas — telas no padrão Apple (iOS / iPadOS), navegação e o player de lições. */
(function () {
  "use strict";

  const S = window.Store;
  const SP = window.Speech;
  const C = window.CURRICULUM;

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
  function fmtMinutes(m) {
    if (m < 60) return { v: m, u: "min" };
    const h = Math.floor(m / 60), r = m % 60;
    return { v: h + (r ? ":" + String(r).padStart(2, "0") : ""), u: "h" };
  }
  const wordCount = (t) => (t.trim().match(/[A-Za-zÀ-ÿ0-9']+/g) || []).length;
  const isEnglish = (t) => /^[A-Za-z0-9 ,.'?!’_\-]+$/.test(t);
  const haptic = (ms) => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* ignora */ } };

  /* ───────── Ícones no estilo SF Symbols (traço, 24×24) ───────── */
  const ICON = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    calendar: '<rect x="3" y="4.5" width="18" height="16.5" rx="3"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
    cards: '<rect x="3" y="7" width="13" height="14" rx="2.5"/><path d="M8 3.5h10.5A2.5 2.5 0 0 1 21 6v11"/>',
    chart: '<path d="M5 20v-8M10 20V5M15 20v-5M20 20v-11"/>',
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
    chevR: '<path d="M9 5l7 7-7 7"/>',
    chevUD: '<path d="M8 9.5l4-4 4 4M8 14.5l4 4 4-4"/>',
    pencil: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4.5" height="6.5" rx="1.5"/><rect x="16.5" y="14" width="4.5" height="6.5" rx="1.5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
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
    star: '<path d="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1.03 6L12 17l-5.38 2.85 1.03-6L3.3 9.6l6-.9z" fill="currentColor" stroke="none"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10.5" rx="2.5" fill="currentColor" stroke="none"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    bolt: '<path d="M13.5 2 4.5 13.5H11L10 22l9.5-12H13z" fill="currentColor" stroke="none"/>',
    flameFill: '<path d="M12 21.5c4.1 0 7.2-2.8 7.2-6.8 0-3.2-2.1-5.6-3.7-7.2-.4 2-1.5 3.4-3 4C12.8 7.7 11 4.6 8.4 3c.3 3.1-1.8 5.2-3.1 7.1a7.4 7.4 0 0 0-.5 4.5c0 4 3.1 6.9 7.2 6.9z" fill="currentColor" stroke="none"/>',
    route: '<circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="5" r="2.2"/><path d="M8.2 19H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.8"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>'
  };
  const icon = (name, cls) => '<svg class="icon ' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true">' + ICON[name] + "</svg>";
  const chev = () => '<svg class="chev" viewBox="0 0 8 13" aria-hidden="true"><path d="M1.5 1.5 6.5 6.5l-5 5"/></svg>';
  const sq = (name, color, cls) => '<span class="sq ' + (cls || "") + '" style="background:var(--' + color + ')">' + icon(name) + "</span>";

  /* Célula de lista agrupada. Textos em title/sub/value já devem vir escapados. */
  function cell(o) {
    const tag = o.href ? "a" : o.action ? "button" : "div";
    let attrs = "";
    if (o.href) attrs += ' href="' + o.href + '"';
    if (o.action) attrs += ' type="button" data-action="' + o.action + '"';
    if (o.attrs) attrs += " " + o.attrs;
    const tappable = o.href || o.action;
    return "<" + tag + ' class="cell' + (tappable ? " tappable" : "") + (o.cls ? " " + o.cls : "") + '"' + attrs + ">" +
      (o.lead || (o.icon ? sq(o.icon, o.color || "blue") : "")) +
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

  /* ───────── Tema ───────── */
  let themeSetByApp = false;
  function applyTheme() {
    const t = S.state.settings.theme;
    const root = document.documentElement;
    if (t === "light" || t === "dark") { root.setAttribute("data-theme", t); themeSetByApp = true; }
    else if (themeSetByApp) { root.removeAttribute("data-theme"); themeSetByApp = false; }
  }

  /* ───────── Aviso (banner) e alerta (estilo iOS) ───────── */
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
    { id: "trilha", label: "Trilha", icon: "route" },
    { id: "plano", label: "Plano", icon: "calendar" },
    { id: "revisar", label: "Revisar", icon: "cards" },
    { id: "progresso", label: "Progresso", icon: "chart" },
    { id: "metodo", label: "Método", icon: "book" }
  ];

  function renderShell() {
    $("#app").innerHTML =
      '<div class="app">' +
      '<nav class="sidebar" aria-label="Navegação principal"><p class="side-title title2">Inglês em 12 Semanas</p>' +
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
    const navId = r.view === "semana" ? "plano" : r.view;
    $$("[data-nav]").forEach((a) => { if (a.dataset.nav === navId) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    const due = S.dueIds().length;
    $$('[data-badge="revisar"]').forEach((b) => { b.hidden = due === 0; b.textContent = due > 99 ? "99+" : due; });
    $("#navbar").hidden = !!meta.hideNav;
    $("#nav-title").textContent = meta.title;
    $("#nav-left").innerHTML = meta.back ? '<a class="back-btn" href="' + meta.back[0] + '">' + icon("chevL") + esc(meta.back[1]) + "</a>" : "";
    const foot = $("#side-foot");
    if (foot) foot.innerHTML = S.totals().lessons + " de " + S.TOTAL_DAYS + " dias concluídos.<br>Progresso salvo neste aparelho.";
    onScroll();
  }

  function onScroll() {
    const nb = $("#navbar");
    if (nb) nb.classList.toggle("scrolled", window.scrollY > 36);
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  function route() {
    const h = (location.hash || "").slice(1);
    const m = /^semana-(\d+)$/.exec(h);
    if (m) return { view: "semana", week: clamp(+m[1], 1, S.WEEKS) };
    if (h === "hoje") return { view: "trilha" };
    return { view: VIEWS[h] ? h : "trilha" };
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
    return '<header class="lt-header"><div>' +
      (opts.eyebrow ? '<p class="eyebrow' + (opts.tint ? " tint" : "") + '">' + opts.eyebrow + "</p>" : "") +
      '<h1 class="large-title">' + title + "</h1>" +
      (opts.sub ? '<p class="lt-sub">' + opts.sub + "</p>" : "") + "</div>" +
      (opts.avatar === false ? "" : '<a class="avatar" href="#ajustes" aria-label="Ajustes">' + initial() + "</a>") +
      "</header>";
  }

  /* ───────── Boas-vindas ───────── */
  function renderOnboarding() {
    let chosen = 25;
    $("#app").innerHTML =
      '<div class="welcome"><div class="welcome-inner">' +
      '<div class="app-icon" aria-hidden="true">12</div>' +
      '<h1 class="large-title center">Boas-vindas ao<br>Inglês em 12 Semanas</h1>' +
      '<div class="features">' +
      [["clock", "Lições de 15 minutos", "Cinco lições, um dia de imersão e uma revisão por semana. Do A1 ao B1 em 84 dias."],
        ["repeat", "Você não esquece", "As palavras voltam para revisão no momento certo, em 5 caixas de repetição espaçada."],
        ["mic", "Fale desde o primeiro dia", "Ouça frases reais, repita junto e teste sua pronúncia."],
        ["target", "Placar semanal", "A meta é executar 85% do plano. Constância conta mais que perfeição."]]
        .map((f) => '<div class="feature-row"><span class="ficon">' + icon(f[0]) + '</span><div><p class="headline">' + f[1] + '</p><p class="subhead secondary">' + f[2] + "</p></div></div>").join("") +
      "</div>" +
      '<form id="onboard-form" class="view" novalidate style="gap:24px">' +
      section("Seu plano", list([
        '<label class="cell" for="ob-name"><span class="cell-body"><span class="cell-title">Nome</span></span><input class="cell-input" id="ob-name" autocomplete="given-name" placeholder="Opcional" maxlength="40"></label>',
        '<label class="cell" for="ob-start"><span class="cell-body"><span class="cell-title">Início</span></span><input class="cell-input" type="date" id="ob-start" value="' + S.today() + '"></label>',
        '<div class="cell stack"><span class="cell-title">Tempo por dia</span><div class="segmented" role="group" aria-label="Tempo por dia" id="ob-goal">' +
        [15, 25, 40].map((m) => '<button type="button" data-goal="' + m + '" aria-pressed="' + (m === chosen) + '">' + m + " min</button>").join("") + "</div></div>"
      ]), "Sem cadastro. Seu progresso fica salvo neste aparelho e você pode fazer backup em Ajustes.") +
      '<button class="btn btn-filled btn-large" type="submit">Continuar</button>' +
      "</form></div></div>";

    $("#ob-goal").addEventListener("click", (e) => {
      const b = e.target.closest("[data-goal]");
      if (!b) return;
      chosen = +b.dataset.goal;
      $$("#ob-goal button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    });
    $("#onboard-form").addEventListener("submit", (e) => {
      e.preventDefault();
      S.state.profile = { name: $("#ob-name").value.trim(), goalMin: chosen, startDate: $("#ob-start").value || S.today(), createdAt: new Date().toISOString() };
      S.save();
      $("#app").innerHTML = "";
      location.hash = "trilha";
      render();
    });
  }

  /* ═══════════════════════ TELAS ═══════════════════════ */

  function kindLabel(kind) { return kind === "lesson" ? "Lição" : kind === "immersion" ? "Imersão" : "Revisão semanal"; }
  function contents(kind) {
    if (kind === "lesson") return ["4 palavras", "Gramática", "4 exercícios", "Shadowing", "Escrita"];
    if (kind === "immersion") return ["10 frases", "3 missões", "Missão da semana"];
    return ["10 questões", "Autoavaliação", "Placar"];
  }
  function estimate(kind) { return kind === "lesson" ? "15–20 min" : kind === "immersion" ? "20–30 min" : "10–15 min"; }

  function progressBar(pct, target) {
    return '<div class="progress' + (target && pct >= 85 ? " good" : "") + '" role="img" aria-label="' + pct + "%" + (target ? ", meta 85%" : "") + '"><span style="width:' + pct + '%"></span>' + (target ? '<i class="target" style="left:85%"></i>' : "") + "</div>";
  }

  function calendarNote(progressWeek) {
    const p = S.state.profile;
    const day = S.calendarDay();
    if (day < 1) return "Seu programa começa em " + S.fmtDate(p.startDate, { day: "numeric", month: "long" }) + ". Pode adiantar se quiser.";
    if (day > S.TOTAL_DAYS) return "Os 84 dias do calendário já passaram. Termine no seu ritmo.";
    const cw = S.calendarWeek();
    const diff = cw - progressWeek;
    const base = "Dia " + day + " de " + S.TOTAL_DAYS + " no calendário. ";
    if (diff <= 0) return base + "Você está em dia.";
    return base + "O calendário está na semana " + cw + " e você, " + plural(diff, "semana", "semanas") + " atrás. Siga no seu ritmo.";
  }

  function ringsSvg(vals) {
    const radii = [44, 31, 18];
    const cls = ["r-a", "r-b", "r-c"];
    let s = '<svg class="rings" viewBox="0 0 100 100" aria-hidden="true">';
    vals.forEach((v, i) => {
      const r = radii[i], c = 2 * Math.PI * r, p = clamp(v, 0, 1);
      s += '<circle class="r-track ' + cls[i] + '" cx="50" cy="50" r="' + r + '" fill="none" stroke-width="11"/>';
      if (p > 0) s += '<circle class="' + cls[i] + '" cx="50" cy="50" r="' + r + '" fill="none" stroke-width="11" stroke-linecap="round" stroke-dasharray="' + c.toFixed(2) + '" stroke-dashoffset="' + (c * (1 - p)).toFixed(2) + '" transform="rotate(-90 50 50)"/>';
    });
    return s + "</svg>";
  }

  /* ───────── Trilha ───────── */
  const PATH_X = [0, 48, 76, 48, 0, -48, -76];
  const STEP_Y = 96, PAD_Y = 30;
  const nodeSize = (d) => (d === 7 ? 78 : 68);
  const KIND_ICON = { lesson: "star", immersion: "headphones", review: "trophy" };

  function isLocked(id) {
    const nid = S.nextId();
    if (!nid || S.isDone(id)) return false;
    const ids = S.allIds();
    return ids.indexOf(id) > ids.indexOf(nid);
  }
  function nodeState(id, nid) {
    if (S.isDone(id)) return "done";
    if (id === nid) return "current";
    return "locked";
  }
  function daySummary(w, d) {
    const kind = S.dayKind(d);
    if (kind === "lesson") return '<span lang="en">' + esc(S.week(w).days[d - 1].vocab.map((v) => v[0]).join(" · ")) + "</span>";
    if (kind === "immersion") return "Maratona de shadowing e 3 missões";
    const cp = S.state.checkpoints["w" + w];
    return cp ? "Checkpoint: " + cp.score + "/" + cp.total + " acertos" : "Checkpoint, autoavaliação e placar";
  }

  function todayCard() {
    const st = S.state;
    const act = st.activity[S.today()] || { min: 0, lessons: 0, reviews: 0 };
    const goal = st.profile.goalMin;
    const due = S.dueIds().length;
    const words = S.totals().words;
    const reviewTotal = act.reviews + due;
    const rv = reviewTotal ? act.reviews / reviewTotal : words ? 1 : 0;
    return '<div class="card rings-card">' + ringsSvg([act.min / goal, act.lessons ? 1 : 0, rv]) +
      '<div class="ring-legend">' +
      '<div><p class="rl-label" style="color:var(--pink)">Minutos</p><p class="rl-value">' + act.min + "<small>/" + goal + " MIN</small></p></div>" +
      '<div><p class="rl-label" style="color:var(--green)">Lição</p><p class="rl-value">' + Math.min(act.lessons, 9) + "<small>/1</small></p></div>" +
      '<div><p class="rl-label" style="color:var(--cyan)">Revisão</p><p class="rl-value">' + (reviewTotal ? act.reviews + "<small>/" + reviewTotal + "</small>" : words ? "<small>EM DIA</small>" : "<small>—</small>") + "</p></div>" +
      "</div></div>";
  }

  function unitHtml(w, p, nid) {
    const wk = S.week(w);
    const pts = [];
    for (let d = 1; d <= 7; d++) { const s = nodeSize(d); pts.push({ d, x: PATH_X[d - 1], y: PAD_Y + (d - 1) * STEP_Y + s / 2, s }); }
    const H = PAD_Y + 6 * STEP_Y + nodeSize(7) + 40;
    let svg = '<svg class="path-line" width="400" height="' + H + '" viewBox="-200 0 400 ' + H + '" aria-hidden="true">';
    for (let i = 0; i < 6; i++) {
      const a = pts[i], b = pts[i + 1];
      const on = S.isDone(S.lessonId(w, a.d));
      svg += '<path class="seg' + (on ? " on" : "") + '" d="M' + a.x + " " + a.y + " C" + a.x + " " + (a.y + 50) + " " + b.x + " " + (b.y - 50) + " " + b.x + " " + b.y + '"/>';
    }
    svg += "</svg>";
    const done = S.weekDone(w);
    const nodes = pts.map((pt) => {
      const id = S.lessonId(w, pt.d);
      const state = nodeState(id, nid);
      const kind = S.dayKind(pt.d);
      const top = pt.y - pt.s / 2;
      let extra = "";
      if (state === "current") {
        const r = pt.s / 2 + 8, c = 2 * Math.PI * r, box = pt.s + 22;
        extra = '<svg class="node-ring" viewBox="0 0 ' + box + " " + box + '" aria-hidden="true"><circle class="track" cx="' + box / 2 + '" cy="' + box / 2 + '" r="' + r + '" fill="none" stroke-width="6"/>' +
          (done ? '<circle class="val" cx="' + box / 2 + '" cy="' + box / 2 + '" r="' + r + '" fill="none" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - done / 7)).toFixed(1) + '" transform="rotate(-90 ' + box / 2 + " " + box / 2 + ')"/>' : "") + "</svg>" +
          '<span class="node-bubble ' + (pt.x >= 0 ? "left" : "right") + '">' + (pt.d === 1 && w === 1 && !S.totals().lessons ? "Comece aqui" : "Começar") + "</span>";
      }
      if (state === "done") extra = '<span class="node-check">' + icon("check") + "</span>";
      const glyph = state === "locked" && kind === "lesson" ? "lock" : KIND_ICON[kind];
      return '<button class="node ' + state + " " + kind + '" data-action="node" data-id="' + id + '" data-x="' + pt.x + '" data-top="' + top + '" data-size="' + pt.s + '"' +
        ' style="top:' + top + "px;left:calc(50% + " + (pt.x - pt.s / 2) + "px);width:" + pt.s + "px;height:" + pt.s + 'px"' +
        ' aria-label="Dia ' + pt.d + ": " + esc(S.dayTitle(w, pt.d)) + ", " + { done: "concluído", current: "próxima atividade", locked: "bloqueado" }[state] + '">' +
        icon(glyph) + extra + "</button>";
    }).join("");
    return '<section class="unit" style="--c:var(--phase-' + p.n + ')" id="u' + w + '">' +
      '<header class="unit-head"><div><p class="unit-eyebrow">Fase ' + p.n + ", semana " + w + " · " + done + '/7</p><h2 class="unit-title">' + esc(wk.title) + "</h2></div>" +
      '<a class="unit-guide" href="#semana-' + w + '" aria-label="Guia da semana ' + w + '">' + icon("book") + "</a></header>" +
      '<div class="unit-path" style="height:' + H + 'px">' + svg + nodes + "</div></section>";
  }

  function viewTrilha() {
    const st = S.state;
    const nid = S.nextId();
    const due = S.dueIds().length;
    const t = S.totals();
    const streak = S.streak();
    const activeToday = !!st.activity[S.today()];
    let html = '<div class="statbar">' +
      '<a class="avatar" href="#ajustes" aria-label="Ajustes">' + initial() + "</a>" +
      '<div class="stats">' +
      '<a class="stat flame' + (activeToday ? " on" : "") + '" href="#progresso" aria-label="Sequência de ' + plural(streak, "dia", "dias") + '">' + icon("flameFill") + "<span>" + streak + "</span></a>" +
      '<a class="stat xp" href="#progresso" aria-label="' + t.xp + ' pontos de experiência">' + icon("bolt") + "<span>" + t.xp + "</span></a>" +
      '<a class="stat cards' + (due ? " due" : "") + '" href="#revisar" aria-label="' + plural(due, "cartão", "cartões") + ' para revisar">' + icon("cards") + "<span>" + due + "</span></a>" +
      "</div></div>";
    if (!S.storageOk) html += '<p class="tag" style="color:var(--orange-text);background:var(--orange-tint)">Este navegador não está salvando seu progresso (modo privado?).</p>';
    C.phases.forEach((p) => {
      html += '<div class="phase-divider"><span>Fase ' + p.n + " · " + esc(p.name) + " · " + p.cefr + "</span></div>";
      for (let w = p.weeks[0]; w <= p.weeks[1]; w++) html += unitHtml(w, p, nid);
    });
    html += '<div class="path-end">' + icon("trophy") + '<p class="headline">Fim da trilha</p><p class="subhead secondary">Uma conversa de 5 minutos em inglês.</p></div>';
    return { html, meta: { title: "Trilha", hideNav: true }, after: scrollToCurrent };
  }

  function scrollToCurrent() {
    requestAnimationFrame(() => {
      const n = $(".node.current");
      if (!n) return;
      const r = n.getBoundingClientRect();
      window.scrollTo(0, Math.max(0, window.scrollY + r.top - window.innerHeight * 0.45));
    });
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
    const { w, d } = S.parseId(id);
    const kind = S.dayKind(d);
    const state = nodeState(id, S.nextId());
    const pop = document.createElement("div");
    pop.className = "popover";
    pop.setAttribute("role", "dialog");
    pop.style.top = (+el.dataset.top + +el.dataset.size + 16) + "px";
    pop.style.setProperty("--ax", el.dataset.x + "px");
    let action;
    if (state === "locked") {
      action = '<p class="footnote secondary">Conclua as atividades anteriores da trilha para liberar.</p>' +
        '<button class="btn btn-plain" data-action="start" data-id="' + id + '" data-force="1">Abrir mesmo assim</button>';
    } else {
      action = '<button class="btn btn-filled btn-large" data-action="start" data-id="' + id + '" data-force="1">' + icon("play") + (state === "done" ? "Refazer" : "Começar") + "</button>";
    }
    pop.innerHTML = '<p class="eyebrow">Dia ' + d + " · " + kindLabel(kind) + " · " + estimate(kind) + "</p>" +
      '<p class="title3">' + esc(S.dayTitle(w, d)) + '</p><p class="subhead secondary">' + daySummary(w, d) + "</p>" + action;
    el.parentElement.appendChild(pop);
    el.classList.add("open-pop");
    const r = pop.getBoundingClientRect();
    const limit = window.innerHeight - 90;
    if (r.bottom > limit) window.scrollBy({ top: r.bottom - limit, behavior: "smooth" });
  }

  /* ───────── Plano ───────── */
  function weekBadge(w, cur) {
    if (S.weekDone(w) === 7) return '<span class="wbadge done">' + icon("check") + "</span>";
    return '<span class="wbadge' + (w === cur ? " current" : "") + '">' + w + "</span>";
  }

  function viewPlano() {
    const nid = S.nextId();
    const cur = nid ? S.parseId(nid).w : 0;
    const phases = C.phases.map((p) => {
      const rows = [];
      for (let w = p.weeks[0]; w <= p.weeks[1]; w++) {
        const wk = S.week(w);
        rows.push(cell({ href: "#semana-" + w, lead: weekBadge(w, cur), title: esc(wk.title), sub: esc(wk.grammar.title), value: S.weekDone(w) + "/7", chevron: true }));
      }
      return section("Fase " + p.n + " · " + esc(p.name) + " · " + p.cefr, list(rows, "icons"), esc(p.text));
    });
    const html =
      ltHeader("Plano", { eyebrow: "84 dias · A1 → B1" }) +
      '<p class="subhead secondary" style="padding:0 4px">Cada semana tem 5 lições, 1 dia de imersão e 1 revisão com placar. Você pode abrir qualquer dia.</p>' +
      phases.join("");
    return { html, meta: { title: "Plano" } };
  }

  /* ───────── Semana (detalhe) ───────── */
  function viewSemana(r) {
    const w = r.week;
    const wk = S.week(w);
    const ph = S.phaseOf(w);
    const nid = S.nextId();
    const ex = S.execution(w);
    const rows = [];
    for (let d = 1; d <= 7; d++) {
      const id = S.lessonId(w, d);
      const kind = S.dayKind(d);
      const done = S.isDone(id);
      const sub = daySummary(w, d);
      rows.push(cell({
        action: "start", attrs: 'data-id="' + id + '"',
        lead: '<span class="status ' + (done ? "done" : id === nid ? "next" : "locked") + '">' + icon(done || id === nid ? "check" : "lock") + "</span>",
        title: "Dia " + d + " · " + esc(S.dayTitle(w, d)), sub,
        value: done ? "Feito" : id === nid ? '<span style="color:var(--blue)">Próxima</span>' : "",
        chevron: true
      }));
    }
    const imm = S.state.immersion["w" + w] || [];
    const tasks = wk.immersion.map((t, i) =>
      '<label class="cell"><span class="cell-body"><span class="cell-title">' + esc(t) + "</span></span>" +
      '<input type="checkbox" class="check-circle" data-input="week-task" data-w="' + w + '" data-i="' + i + '" aria-label="Concluída"' + (imm[i] ? " checked" : "") + "></label>");
    const g = wk.grammar;
    const html =
      ltHeader(esc(wk.title), { eyebrow: "Semana " + w + " · " + esc(ph.name) + " · " + wk.cefr, sub: '<span lang="en">' + esc(wk.en) + "</span>", avatar: false }) +
      '<div class="card" style="display:flex;flex-direction:column;gap:12px">' +
      '<div class="exec-row"><span class="secondary">Execução</span>' + progressBar(ex, true) + "<b>" + ex + "%</b></div>" +
      '<p class="body"><b>Meta:</b> ' + esc(wk.goal) + "</p></div>" +
      section("Dias", list(rows, "icons"), "Toque em um dia para começar ou refazer.") +
      section("Gramática da semana", list([cell({ icon: "layers", color: "indigo", title: esc(g.title), sub: esc(g.body[0]) })]
        .concat(g.examples.map((x) => cell({ lead: '<button class="speak" data-action="speak" data-text="' + esc(x[0]) + '" aria-label="Ouvir">' + icon("speaker") + "</button>", title: esc(x[0]), sub: esc(x[1]), lang: "en" }))), "icons")) +
      section("Missões de imersão", list(tasks), "Marque o que já fez. Elas também aparecem no Dia 6.") +
      '<div class="week-nav">' +
      (w > 1 ? '<a class="btn btn-plain" href="#semana-' + (w - 1) + '">' + icon("chevL", "icon-sm") + "Semana " + (w - 1) + "</a>" : "<span></span>") +
      (w < S.WEEKS ? '<a class="btn btn-plain" href="#semana-' + (w + 1) + '">Semana ' + (w + 1) + icon("chevR", "icon-sm") + "</a>" : "<span></span>") +
      "</div>";
    return { html, meta: { title: wk.title, back: ["#plano", "Plano"] } };
  }

  /* ───────── Revisar ───────── */
  const BOX_LABEL = ["todo dia", "2 dias", "4 dias", "8 dias", "16 dias"];
  function viewRevisar() {
    const due = S.dueIds().length;
    const total = Object.keys(S.state.cards).length;
    const counts = S.boxCounts();
    const max = Math.max(1, ...counts);

    let hero;
    if (due) {
      hero = '<div class="card pad-lg" style="display:flex;flex-direction:column;gap:16px;align-items:stretch">' +
        '<div><p class="big-number">' + due + '</p><p class="subhead secondary">' + (due === 1 ? "cartão para revisar hoje" : "cartões para revisar hoje") + "</p></div>" +
        '<button class="btn btn-filled btn-large" data-action="review">' + icon("play") + "Revisar agora</button></div>";
    } else if (total) {
      hero = '<div class="card pad-lg" style="display:flex;flex-direction:column;gap:6px"><p class="title2">Tudo revisado</p><p class="subhead secondary">Amanhã: ' + plural(S.dueTomorrow(), "cartão", "cartões") + ".</p></div>";
    } else {
      hero = '<div class="card pad-lg" style="display:flex;flex-direction:column;gap:12px"><p class="title2">Nenhum cartão ainda</p><p class="subhead secondary">Cada lição concluída adiciona 4 palavras. Elas voltam amanhã e depois em intervalos cada vez maiores.</p><a class="btn btn-tinted btn-large" href="#trilha">Fazer a próxima lição</a></div>';
    }

    const boxes = '<div class="card"><div class="boxes" role="img" aria-label="Cartões por caixa: ' + counts.map((n, i) => "caixa " + (i + 1) + ", " + n).join("; ") + '">' +
      counts.map((n, i) => '<div class="box-col"><b>' + n + '</b><div class="box-bar"><span style="height:' + Math.round((n / max) * 100) + '%"></span></div><span class="caption">Caixa ' + (i + 1) + '</span><span class="caption secondary">' + BOX_LABEL[i] + "</span></div>").join("") +
      "</div></div>";

    const html =
      ltHeader("Revisar", { eyebrow: "Repetição espaçada" }) +
      hero +
      (total ? section("Suas caixas", boxes, "Acertou, o cartão sobe de caixa e demora mais para voltar. Errou, volta para a Caixa 1.") +
        section("", list([cell({ action: "practice", icon: "shuffle", color: "purple", title: "Treino livre", sub: "10 cartões aleatórios. Não altera as caixas.", chevron: true })], "icons")) +
        section("Vocabulário · " + total,
          '<label class="search">' + icon("search", "icon-sm") + '<span class="sr-only">Buscar</span><input id="dict-search" data-input="dict" type="search" placeholder="Buscar em inglês ou português"></label>' +
          list([dictItems("")], "", "dict-list")) : "");
    return { html, meta: { title: "Revisar" } };
  }

  function dictItems(q) {
    const nq = q.trim().toLowerCase();
    const rows = Object.keys(S.state.cards)
      .map((id) => Object.assign(S.cardContent(id) || {}, { box: S.state.cards[id].box }))
      .filter((c) => c.en && (!nq || c.en.toLowerCase().includes(nq) || c.pt.toLowerCase().includes(nq)))
      .sort((a, b) => a.en.localeCompare(b.en));
    if (!rows.length) return cell({ title: '<span class="secondary">Nenhuma palavra encontrada.</span>' });
    return rows.map((c) => cell({
      title: esc(c.en), sub: esc(c.pt), lang: "en",
      value: '<span class="caption">Caixa ' + c.box + "</span>",
      trail: '<button class="speak" data-action="speak" data-text="' + esc(c.en) + '" aria-label="Ouvir ' + esc(c.en) + '">' + icon("speaker") + "</button>"
    })).join("");
  }

  /* ───────── Progresso ───────── */
  function viewProgresso() {
    const t = S.totals();
    const st = S.state;
    const nid = S.nextId();
    const cur = nid ? S.parseId(nid).w : S.WEEKS;
    const mins = fmtMinutes(t.minutes);
    const streak = S.streak();

    const tiles = [
      ["flame", "orange", "Sequência", streak, streak === 1 ? "dia" : "dias"],
      ["zap", "yellow", "Pontos", t.xp, "XP"],
      ["textformat", "blue", "Palavras", t.words, ""],
      ["clock", "pink", "Estudo", mins.v, mins.u]
    ].map((x) => '<div class="tile"><p class="tile-head" style="color:var(--' + x[1] + ')">' + icon(x[0]) + x[2] + '</p><p class="tile-value">' + x[3] + "<small>" + x[4] + "</small></p></div>").join("");

    // Execução semanal: barras com meta de 85%
    const wide = window.innerWidth >= 700;
    const W = wide ? 640 : 360, H = wide ? 230 : 200, ml = 40, mr = 6, mt = 22, mb = 24;
    const iw = W - ml - mr, ih = H - mt - mb, band = iw / 12;
    const y = (v) => mt + ih - (v / 100) * ih;
    let svg = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Execução por semana, meta de 85%">';
    [0, 50, 100].forEach((v) => {
      svg += '<line class="grid-line" x1="' + ml + '" x2="' + (W - mr) + '" y1="' + y(v) + '" y2="' + y(v) + '"/>';
      svg += '<text x="' + (ml - 8) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + v + "%</text>";
    });
    for (let w = 1; w <= 12; w++) {
      const v = S.execution(w);
      const bw = band * 0.56;
      const x = ml + band * (w - 1) + (band - bw) / 2;
      const top = y(v), base = y(0);
      if (v > 0) {
        const r = Math.min(4, (base - top) / 2, bw / 2);
        svg += '<path class="bar-mark" d="M' + x + " " + base + "V" + (top + r) + "Q" + x + " " + top + " " + (x + r) + " " + top + "H" + (x + bw - r) + "Q" + (x + bw) + " " + top + " " + (x + bw) + " " + (top + r) + "V" + base + 'Z"/>';
      }
      svg += '<rect class="bar-hit" x="' + (ml + band * (w - 1)) + '" y="' + mt + '" width="' + band + '" height="' + ih + '"><title>Semana ' + w + ": " + v + "% (" + S.weekDone(w) + "/7)</title></rect>";
      svg += '<text x="' + (x + bw / 2) + '" y="' + (H - 7) + '" text-anchor="middle"' + (w === cur ? ' style="font-weight:700;fill:var(--label)"' : "") + ">" + w + "</text>";
    }
    svg += '<line class="target-line" x1="' + ml + '" x2="' + (W - mr) + '" y1="' + y(85) + '" y2="' + y(85) + '"/>';
    svg += '<text x="' + (W - mr) + '" y="' + (y(85) - 6) + '" text-anchor="end" style="font-weight:600;fill:var(--label)">meta 85%</text></svg>';

    // Calendário de 84 dias
    const goal = st.profile.goalMin;
    const start = st.profile.startDate;
    const todayK = S.today();
    let heat = "<span></span>";
    for (let w = 1; w <= 12; w++) heat += '<span class="col-label">' + w + "</span>";
    for (let d = 1; d <= 7; d++) {
      heat += "<span>D" + d + "</span>";
      for (let w = 1; w <= 12; w++) {
        const k = S.addDays(start, (w - 1) * 7 + (d - 1));
        const a = st.activity[k];
        const m = a ? a.min : 0;
        let cls = "cell-h";
        if (k > todayK) cls += " future";
        else if (m >= goal) cls += " l3";
        else if (m >= goal / 2) cls += " l2";
        else if (m > 0) cls += " l1";
        if (k === todayK) cls += " today";
        heat += '<span class="' + cls + '" title="' + S.fmtDate(k) + ": " + m + ' min"></span>';
      }
    }

    const cps = [];
    for (let w = 1; w <= 12; w++) {
      const cp = st.checkpoints["w" + w];
      if (!cp) continue;
      const self = { yes: "Consigo", almost: "Quase lá", no: "Ainda não" }[cp.selfcheck] || "—";
      cps.push(cell({ href: "#semana-" + w, lead: weekBadge(w, 0), title: esc(S.week(w).title), sub: "Meta: " + self + " · Execução " + S.execution(w) + "%", value: cp.score + "/" + cp.total, chevron: true }));
    }

    const journal = st.journal.slice().reverse().slice(0, 30).map((j) => cell({
      raw: '<span class="cell-body"><span class="cell-sub" style="display:flex;justify-content:space-between;gap:8px"><span>' + esc(j.label || "") + "</span><span>" + S.fmtDate(j.date) + '</span></span><span class="cell-title journal-text" lang="en">' + esc(j.text) + '</span><span class="cell-sub">' + esc(j.prompt) + "</span></span>"
    }));

    const html =
      ltHeader("Progresso", { eyebrow: "Seu placar" }) +
      section("Hoje", todayCard(), "O anel azul fecha quando não há cartões pendentes. " + t.lessons + " de " + S.TOTAL_DAYS + " dias concluídos.") +
      '<div class="tiles">' + tiles + "</div>" +
      section("Execução semanal", '<div class="card chart">' + svg + "</div>", "Dias feitos ÷ 7. Fazer 6 de 7 dias (86%) mantém o ritmo das 12 semanas.") +
      section("Calendário de 84 dias", '<div class="card" style="display:flex;flex-direction:column;gap:12px"><div class="heat" role="img" aria-label="Minutos de estudo por dia nas 12 semanas">' + heat + "</div>" +
        '<div class="legend"><span>Nada</span><i style="background:var(--heat-0)"></i><i style="background:var(--heat-1)"></i><i style="background:var(--heat-2)"></i><i style="background:var(--heat-3)"></i><span>Meta de ' + goal + " min</span></div></div>") +
      (cps.length ? section("Checkpoints", list(cps, "icons")) : "") +
      section("Diário de escrita · " + st.journal.length, list(journal.length ? journal : [cell({ title: '<span class="secondary">Os textos que você escreve nas lições aparecem aqui.</span>' })]));
    return { html, meta: { title: "Progresso" } };
  }

  /* ───────── Método ───────── */
  function viewMetodo() {
    const pillars = [
      ["headphones", "blue", "Input compreensível", "Frases reais, um pouco acima do seu nível, com tradução e áudio. Entender vem antes de falar."],
      ["repeat", "orange", "Repetição espaçada", "As palavras voltam em 1, 2, 4, 8 e 16 dias (sistema de Leitner), pouco antes de você esquecer."],
      ["mic", "pink", "Shadowing", "Ouvir e repetir junto, imitando ritmo e entonação. Treina pronúncia e escuta ao mesmo tempo."],
      ["zap", "yellow", "Recordação ativa", "Exercícios curtos em que você precisa lembrar a resposta, não só reconhecê-la."],
      ["pencil", "green", "Produção diária", "Todo dia você escreve sobre a sua vida. Usar a língua é o que vira fluência."],
      ["target", "red", "Execução em 12 semanas", "Meta clara, placar semanal e revisão aos domingos. O alvo é 85% do plano, não 100%."]
    ];
    const flow = [
      ["repeat", "orange", "Aquecimento", "Cartões que venceram", "2–4 min"],
      ["layers", "indigo", "Gramática", "A estrutura da semana", "2 min"],
      ["textformat", "blue", "Palavras novas", "4 palavras com áudio", "3 min"],
      ["zap", "yellow", "Prática", "4 exercícios", "3 min"],
      ["mic", "pink", "Shadowing", "2 frases, 3 repetições", "3 min"],
      ["pencil", "green", "Escrita", "Um texto curto", "4 min"]
    ];
    const html =
      ltHeader("Método", { eyebrow: "Como funciona" }) +
      '<p class="body secondary" style="padding:0 4px">Seis práticas com boa base em pesquisa de aquisição de linguagem, organizadas em ciclos curtos. Você não precisa decidir o que estudar: abra o app e faça a próxima atividade.</p>' +
      section("Pilares", list(pillars.map((p) => cell({ icon: p[0], color: p[1], title: p[2], sub: p[3] })), "icons")) +
      section("Uma lição · Dias 1 a 5", list(flow.map((f) => cell({ icon: f[0], color: f[1], title: f[2], sub: f[3], value: f[4] })), "icons"), "15 a 20 minutos por dia.") +
      section("O ritmo da semana", list([
        cell({ icon: "book", color: "blue", title: "Dias 1 a 5 · Lições", sub: "20 palavras, 1 ponto de gramática, 10 frases e 5 textos.", value: "15–20 min" }),
        cell({ icon: "globe", color: "teal", title: "Dia 6 · Imersão", sub: "Maratona de shadowing, 3 missões no mundo real e a missão da semana.", value: "20–30 min" }),
        cell({ icon: "trophy", color: "orange", title: "Dia 7 · Revisão semanal", sub: "Checkpoint, autoavaliação, placar de execução e reflexão.", value: "10–15 min" })
      ], "icons")) +
      section("Fases", list(C.phases.map((p) => cell({ lead: '<span class="wbadge">' + p.cefr + "</span>", title: esc(p.name) + ' <span class="secondary">· Semanas ' + p.weeks[0] + "–" + p.weeks[1] + "</span>", sub: esc(p.text) })), "icons"), "Níveis do Quadro Europeu Comum (CEFR): A1 iniciante, A2 básico, B1 independente.") +
      section("Regra dos 85%", '<div class="card prose body"><p>O placar semanal é a porcentagem dos 7 dias que você completou. Fazer 6 de 7 dias (86%) já mantém o progresso.</p><p class="secondary">Ficou abaixo? Use a reflexão do Dia 7 para descobrir o que atrapalhou e ajuste. Atrasos não zeram nada: a próxima lição continua de onde você parou.</p></div>') +
      section("Dicas", list([
        cell({ icon: "clock", color: "gray", title: "Mesmo horário, mesmo lugar", sub: "Hábito vence força de vontade." }),
        cell({ icon: "mic", color: "gray", title: "Fale em voz alta", sub: "Pensar a frase não treina a boca." }),
        cell({ icon: "repeat", color: "gray", title: "Revise antes da lição nova", sub: "Revisar custa minutos; reaprender custa dias." }),
        cell({ icon: "bulb", color: "gray", title: "Escreva sobre a sua vida", sub: "Frases que importam para você ficam na memória." })
      ], "icons"));
    return { html, meta: { title: "Método" } };
  }

  /* ───────── Ajustes ───────── */
  function viewAjustes() {
    const st = S.state;
    const p = st.profile;
    const s = st.settings;
    const seg = (name, val, opts, label, style) => '<div class="segmented" role="group" aria-label="' + label + '" data-setting="' + name + '"' + (style ? ' style="' + style + '"' : "") + ">" +
      opts.map((o) => '<button type="button" data-value="' + o[0] + '" aria-pressed="' + (String(val) === String(o[0])) + '">' + o[1] + "</button>").join("") + "</div>";
    const nid = S.nextId();
    const html =
      ltHeader("Ajustes", { avatar: false }) +
      list([cell({ lead: '<span class="avatar lg">' + initial() + "</span>", title: '<span class="title3">' + (p.name ? esc(p.name) : "Estudante") + "</span>", sub: (nid ? "Semana " + S.parseId(nid).w + " de 12" : "Programa concluído") + " · desde " + S.fmtDate(p.startDate, { day: "numeric", month: "long" }) })]) +
      section("Perfil", list([
        '<label class="cell" for="set-name"><span class="cell-body"><span class="cell-title">Nome</span></span><input class="cell-input" id="set-name" data-input="name" value="' + esc(p.name) + '" placeholder="Seu nome" maxlength="40"></label>',
        '<label class="cell" for="set-start"><span class="cell-body"><span class="cell-title">Início do programa</span></span><input class="cell-input" type="date" id="set-start" data-input="start" value="' + esc(p.startDate) + '"></label>'
      ])) +
      section("Meta diária", list(['<div class="cell">' + seg("goalMin", p.goalMin, [[15, "15 min"], [25, "25 min"], [40, "40 min"]], "Meta diária", "flex:1") + "</div>"]), "Usada no anel de minutos e no calendário de 84 dias.") +
      section("Áudio", list([
        '<div class="cell stack"><span class="cell-title">Velocidade da voz</span>' + seg("rate", s.rate, [[0.75, "Devagar"], [0.95, "Normal"], [1.1, "Rápida"]], "Velocidade da voz") + "</div>",
        '<label class="cell" for="set-voice">' + sq("wave", "pink") + '<span class="cell-body"><span class="cell-title">Voz</span></span><select class="cell-select" id="set-voice" data-input="voice"><option value="">Automática</option>' +
        SP.voices.map((v) => '<option value="' + esc(v.voiceURI) + '"' + (v.voiceURI === s.voiceURI ? " selected" : "") + ">" + esc(v.name) + " (" + esc(v.lang) + ")</option>").join("") + "</select>" + icon("chevUD", "icon-sm tertiary") + "</label>",
        '<label class="cell" for="set-autoplay">' + sq("speaker", "blue") + '<span class="cell-body"><span class="cell-title">Tocar palavras automaticamente</span></span><input type="checkbox" class="switch" id="set-autoplay" data-input="autoplay"' + (s.autoplay ? " checked" : "") + "></label>",
        cell({ action: "speak", attrs: 'data-text="Hello! Nice to meet you. How are you today?"', cls: "link", title: "Testar voz" })
      ], "icons"), SP.hasTTS ? "O áudio usa as vozes instaladas no aparelho. No iPhone, baixe vozes melhores em Ajustes › Acessibilidade › Conteúdo Falado › Vozes." : "Este navegador não tem voz sintetizada. Use Safari, Chrome ou Edge.") +
      section("Aparência", list(['<div class="cell">' + seg("theme", s.theme, [["system", "Automático"], ["light", "Claro"], ["dark", "Escuro"]], "Tema", "flex:1") + "</div>"])) +
      section("Backup", list([
        cell({ action: "backup-copy", cls: "link", title: "Copiar backup" }),
        '<div class="cell"><label class="sr-only" for="backup-box">Texto do backup</label><textarea id="backup-box" placeholder="Para restaurar, cole aqui o texto do backup" style="min-height:80px;font-size:15px"></textarea></div>',
        cell({ action: "backup-restore", cls: "link", title: "Restaurar backup" })
      ]), "Seu progresso fica só neste navegador. Copie o backup para guardar ou levar a outro aparelho.") +
      section("", list([cell({ action: "reset", cls: "destructive", title: "Apagar tudo e recomeçar" })]));
    return { html, meta: { title: "Ajustes" } };
  }

  const VIEWS = { trilha: viewTrilha, plano: viewPlano, semana: viewSemana, revisar: viewRevisar, progresso: viewProgresso, metodo: viewMetodo, ajustes: viewAjustes };

  /* ═══════════════════════ PLAYER ═══════════════════════ */

  let P = null;

  function weekVocab(wk) { return wk.days.flatMap((d) => d.vocab); }

  function makeChoice(q, correct, wrongs, extra) {
    const opts = shuffle([correct].concat(wrongs));
    return Object.assign({ type: "choice", q, o: opts, a: opts.indexOf(correct) }, extra || {});
  }

  function distractors(pool, item, field, n) {
    const seen = new Set([item[field].toLowerCase()]);
    const out = [];
    shuffle(pool).forEach((v) => {
      const val = v[field];
      if (out.length < n && !seen.has(val.toLowerCase())) { seen.add(val.toLowerCase()); out.push(val); }
    });
    return out;
  }

  function vocabQuestion(kind, v, pool) {
    if (kind === "listen" && !SP.hasTTS) kind = "reverse";
    if (kind === "meaning") return makeChoice("O que significa “" + v[0] + "”?", v[1], distractors(pool, v, 1, 2), { e: v[0] + " = " + v[1], say: v[0], label: "Vocabulário" });
    if (kind === "reverse") return makeChoice("Como se diz “" + v[1] + "” em inglês?", v[0], distractors(pool, v, 0, 2), { e: v[0] + " = " + v[1], say: v[0], label: "Vocabulário" });
    return makeChoice("Ouça e escolha o que você escutou.", v[0], distractors(pool, v, 0, 2), { listen: v[0], e: v[0] + " = " + v[1], label: "Escuta" });
  }

  function grammarStep(ex) {
    if (ex.order) return { type: "order", order: ex.order, pt: ex.pt, label: "Monte a frase" };
    const correct = ex.o[ex.a];
    const filled = ex.q.includes("___") && isEnglish(ex.q) ? ex.q.replace("___", correct) : null;
    return makeChoice(ex.q, correct, ex.o.filter((_, i) => i !== ex.a), { e: ex.e, say: filled, label: "Gramática" });
  }

  function buildSession(id) {
    const { w, d } = S.parseId(id);
    const wk = S.week(w);
    const kind = S.dayKind(d);
    const steps = [{ type: "intro" }];
    const pool = weekVocab(wk);

    if (kind !== "review") S.dueIds(8).forEach((cid) => steps.push({ type: "card", id: cid, warm: true }));

    if (kind === "lesson") {
      const day = wk.days[d - 1];
      steps.push({ type: "grammar", full: d === 1 });
      day.vocab.forEach((v, i) => steps.push({ type: "word", v, i }));
      const picks = shuffle(day.vocab);
      steps.push(vocabQuestion("meaning", picks[0], pool));
      steps.push(vocabQuestion("listen", picks[1], pool));
      day.ex.forEach((e) => steps.push(grammarStep(e)));
      day.say.forEach((s, i) => steps.push({ type: "shadow", en: s[0], pt: s[1], k: i + 1, n: day.say.length }));
      steps.push({ type: "write", p: day.write.p, s: day.write.s, min: 3, label: "Dia " + d + " · " + day.title });
    } else if (kind === "immersion") {
      steps.push({ type: "marathon", list: wk.days.flatMap((x) => x.say), checked: [] });
      steps.push({ type: "tasks" });
      steps.push({ type: "write", p: wk.goal, s: [], min: 10, long: true, label: "Missão · Semana " + w });
    } else {
      const v = shuffle(pool);
      const exs = shuffle(wk.days.flatMap((x) => x.ex));
      const choices = exs.filter((e) => !e.order).slice(0, 3);
      const order = exs.find((e) => e.order);
      const qs = [
        vocabQuestion("meaning", v[0], pool), vocabQuestion("meaning", v[1], pool), vocabQuestion("meaning", v[2], pool),
        vocabQuestion("reverse", v[3], pool), vocabQuestion("reverse", v[4], pool), vocabQuestion("listen", v[5], pool)
      ].concat(choices.map(grammarStep));
      if (order) qs.push(grammarStep(order));
      shuffle(qs).forEach((q, i) => { q.cp = i + 1; q.cpTotal = qs.length; steps.push(q); });
      steps.push({ type: "score" });
      steps.push({ type: "selfcheck" });
      steps.push({ type: "reflect" });
    }
    steps.push({ type: "finish" });
    return { mode: "session", id, w, d, kind, wk, steps, i: 0, correct: 0, total: 0, reviewed: 0, easy: 0, writes: [], missed: [], startedAt: Date.now() };
  }

  function buildReview(free) {
    const ids = free ? shuffle(Object.keys(S.state.cards)).slice(0, 10) : S.dueIds(40);
    const steps = ids.map((id) => ({ type: "card", id }));
    steps.push({ type: "finish" });
    return { mode: "review", free: !!free, steps, i: 0, correct: 0, total: 0, reviewed: 0, easy: 0, writes: [], missed: [], startedAt: Date.now() };
  }

  function openPlayer(session) {
    P = session;
    SP.stop();
    const el = document.createElement("div");
    el.className = "player";
    el.id = "player";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", P.mode === "review" ? "Revisão" : "Lição");
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
    if (P.i > 0 && step.type !== "finish" && P.mode === "session") {
      const ok = await alertDialog({ title: "Sair da lição?", text: "O que você fez nesta lição não será salvo. As revisões de cartões já feitas continuam valendo.", ok: "Sair", cancel: "Continuar lição", danger: true });
      if (!ok) return;
    }
    closePlayer();
  }

  function closePlayer() {
    SP.stop();
    const el = $("#player");
    if (el) el.remove();
    document.body.style.overflow = "";
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
  function speakBtn(text, cls, label) {
    return '<button class="speak ' + (cls || "") + '" data-action="speak" data-text="' + esc(text) + '" aria-label="' + esc(label || "Ouvir") + '">' + icon("speaker") + "</button>";
  }
  const eyebrow = (t) => '<p class="eyebrow tint">' + t + "</p>";

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

  /* ───────── Passos ───────── */
  const STEPS = {
    intro(step, el) {
      const { w, d, kind, wk } = P;
      const warm = P.steps.filter((s) => s.type === "card").length;
      let rows = [];
      if (warm) rows.push(["repeat", "orange", "Aquecimento", plural(warm, "cartão vencido", "cartões vencidos"), "3 min"]);
      if (kind === "lesson") {
        const day = wk.days[d - 1];
        rows = rows.concat([
          ["layers", "indigo", "Gramática", wk.grammar.title, "2 min"],
          ["textformat", "blue", "4 palavras novas", day.vocab.map((v) => v[0]).join(", "), "3 min"],
          ["zap", "yellow", "Prática", "4 exercícios", "3 min"],
          ["mic", "pink", "Shadowing", "2 frases para ouvir e repetir", "3 min"],
          ["pencil", "green", "Escrita", day.write.p, "4 min"]
        ]);
      } else if (kind === "immersion") {
        rows = rows.concat([
          ["mic", "pink", "Maratona de shadowing", "As 10 frases da semana", "8 min"],
          ["globe", "teal", "Missões de imersão", "3 tarefas no mundo real", "15 min"],
          ["target", "red", "Missão da semana", wk.goal, "5 min"]
        ]);
      } else {
        rows = [
          ["zap", "yellow", "Checkpoint", "10 questões sobre a semana", "6 min"],
          ["target", "red", "Autoavaliação", "Você consegue cumprir a meta?", "2 min"],
          ["chart", "blue", "Placar e reflexão", "Execução e ajustes para a próxima", "4 min"]
        ];
      }
      el.innerHTML =
        '<div class="step-head">' + eyebrow("Semana " + w + " · Dia " + d + " · " + kindLabel(kind)) +
        '<h1 class="title1">' + esc(S.dayTitle(w, d)) + "</h1>" +
        '<p class="body secondary">' + (kind === "lesson" ? esc(wk.title) + ' · <span lang="en">' + esc(wk.en) + "</span>" : kind === "immersion" ? "Hoje é dia de usar o inglês fora do app." : "Hora de medir a semana e ajustar a próxima.") + "</p></div>" +
        list(rows.map((r) => cell({ icon: r[0], color: r[1], title: r[2], sub: esc(r[3]), value: r[4] })), "icons");
      setFoot(primary("Começar"));
    },

    card(step, el) {
      const c = S.cardContent(step.id);
      const card = S.state.cards[step.id];
      if (!c || !card) { next(); return; }
      const n = P.steps.slice(0, P.i + 1).filter((s) => s.type === "card").length;
      const total = P.steps.filter((s) => s.type === "card").length;
      el.innerHTML =
        '<div class="step-head">' + eyebrow((step.warm ? "Aquecimento" : P.free ? "Treino livre" : "Revisão") + " · Cartão " + n + " de " + total) + "</div>" +
        '<div class="flash"><span class="tag">Caixa ' + card.box + '</span><p class="word-en" lang="en">' + esc(c.en) + "</p>" + speakBtn(c.en, "lg", "Ouvir " + c.en) +
        '<div class="answer" id="flash-answer" hidden><p class="title3">' + esc(c.pt) + '</p><p class="body" lang="en">' + esc(c.ex) + '</p><p class="subhead secondary">' + esc(c.exPt) + "</p></div></div>" +
        '<p class="footnote secondary center" id="flash-hint">Tente lembrar o significado antes de mostrar a resposta.</p>';
      setFoot(primary("Mostrar resposta", { action: "reveal" }));
      autoSpeak(c.en);
    },

    grammar(step, el) {
      const g = P.wk.grammar;
      const examples = list(g.examples.map((x) => cell({ lead: speakBtn(x[0], "", "Ouvir exemplo"), title: esc(x[0]), sub: esc(x[1]), lang: "en" })), "icons");
      const rules = list(g.body.map((b, i) => cell({ lead: '<span class="wbadge">' + (i + 1) + "</span>", title: esc(b) })), "icons");
      el.innerHTML = '<div class="step-head">' + eyebrow(step.full ? "Gramática da semana" : "Lembrete de gramática") + '<h1 class="title1">' + esc(g.title) + "</h1></div>" +
        (step.full ? rules + section("Exemplos", examples) : examples + '<details class="section"><summary class="section-header" style="cursor:pointer;color:var(--blue)">Ver a explicação completa</summary>' + rules + "</details>");
      setFoot(primary("Entendi"));
    },

    word(step, el) {
      const v = step.v;
      el.innerHTML =
        '<div class="step-head">' + eyebrow("Palavra nova " + (step.i + 1) + " de 4") + "</div>" +
        '<div class="word-card"><div class="word-top"><div style="min-width:0"><p class="word-en" lang="en">' + esc(v[0]) + '</p><p class="title3 secondary" style="font-weight:400;margin-top:4px">' + esc(v[1]) + "</p></div>" + speakBtn(v[0], "lg", "Ouvir " + v[0]) + "</div>" +
        '<div class="example">' + speakBtn(v[2], "", "Ouvir exemplo") + '<div style="min-width:0"><p class="headline" lang="en">' + esc(v[2]) + '</p><p class="subhead secondary">' + esc(v[3]) + "</p></div></div></div>" +
        '<p class="footnote secondary center">Ouça, repita em voz alta e pense numa frase sua com essa palavra.</p>';
      setFoot(primary("Continuar"));
      autoSpeak(v[0]);
    },

    choice(step, el) {
      const label = step.cp ? "Checkpoint · " + step.cp + " de " + step.cpTotal : (step.label || "Prática");
      const q = esc(step.q).replace("___", '<span class="blank" aria-label="lacuna"></span>');
      el.innerHTML = '<div class="step-head">' + eyebrow(label) + '<h1 class="title2 question">' + q + "</h1></div>" +
        (step.listen ? '<div class="controls"><button class="btn btn-tinted btn-capsule" data-action="speak" data-text="' + esc(step.listen) + '">' + icon("speaker") + 'Ouvir</button><button class="btn btn-capsule" data-action="speak" data-text="' + esc(step.listen) + '" data-rate="0.7">Mais devagar</button></div>' : "") +
        list(step.o.map((o, i) => '<button type="button" class="cell tappable opt" data-action="choose" data-i="' + i + '"><span class="cell-body"><span class="cell-title"' + (isEnglish(o) ? ' lang="en"' : "") + ">" + esc(o) + '</span></span><span class="opt-mark"></span></button>'));
      setFoot('<p class="foot-hint">Toque na resposta certa' + (step.listen ? " depois de ouvir" : "") + ".</p>");
      if (step.listen) setTimeout(() => SP.speak(step.listen), 300);
    },

    order(step, el) {
      if (!step.tiles) {
        const words = step.order.replace(/[.,?!]/g, "").split(" ");
        step.tiles = words.map((w, i) => (i === 0 && w !== "I" ? w.toLowerCase() : w));
        let idx = shuffle(step.tiles.map((_, i) => i));
        if (idx.length > 1 && idx.every((v, i) => v === i)) idx = idx.slice(1).concat(idx[0]);
        step.shuffled = idx;
        step.picked = [];
      }
      el.innerHTML = '<div class="step-head">' + eyebrow(step.cp ? "Checkpoint · " + step.cp + " de " + step.cpTotal : "Monte a frase") +
        '<h1 class="title2">' + esc(step.pt) + "</h1></div>" +
        '<div class="answer-area" id="answer-line" data-placeholder="Toque nas palavras na ordem certa" aria-label="Sua frase" lang="en"></div>' +
        '<div class="chips" id="tiles" lang="en"></div>';
      drawTiles(step);
    },

    shadow(step, el) {
      step.reps = step.reps || 0;
      el.innerHTML = '<div class="step-head">' + eyebrow("Shadowing · " + step.k + " de " + step.n) +
        '<p class="body secondary">Ouça e repita junto, imitando o ritmo e a entonação. Três vezes, em voz alta.</p></div>' +
        '<div class="shadow-card"><p class="title2" lang="en">' + esc(step.en) + '</p><p class="body secondary">' + esc(step.pt) + "</p>" +
        '<div class="controls"><button class="btn btn-filled btn-capsule" data-action="speak" data-text="' + esc(step.en) + '">' + icon("play") + "Ouvir</button>" +
        '<button class="btn btn-capsule" data-action="speak" data-text="' + esc(step.en) + '" data-rate="0.7">Devagar</button>' +
        (SP.hasMic ? '<button class="btn btn-capsule" data-action="mic">' + icon("mic") + "Pronúncia</button>" : "") + "</div>" +
        '<div class="mic-result" id="mic-result" hidden></div></div>' +
        '<div class="reps"><button class="btn btn-tinted" data-action="rep">' + icon("check") + 'Repeti em voz alta</button><div class="rep-dots" aria-live="polite">' + [0, 1, 2].map((i) => '<span class="' + (i < step.reps ? "on" : "") + '"></span>').join("") + "</div></div>";
      shadowFoot(step);
      autoSpeak(step.en);
    },

    write(step, el) {
      step.text = step.text || "";
      el.innerHTML = '<div class="step-head">' + eyebrow(step.long ? "Missão da semana" : "Escrita") +
        '<h1 class="title2">' + esc(step.p) + "</h1>" +
        '<p class="subhead secondary">Escreva em inglês' + (step.long ? ", com pelo menos 10 palavras" : "") + ". Errar faz parte: o objetivo é usar o que você aprendeu.</p></div>" +
        (step.s.length ? '<div class="starters">' + step.s.map((s) => '<button class="btn btn-tinted btn-capsule" data-action="starter" data-text="' + esc(s) + '" lang="en">' + esc(s) + "</button>").join("") + "</div>" : "") +
        '<div class="list"><div class="cell"><label class="sr-only" for="write-box">Seu texto em inglês</label><textarea id="write-box" data-input="write" lang="en" spellcheck="true" autocapitalize="sentences" placeholder="Write here...">' + esc(step.text) + "</textarea></div></div>" +
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><button class="btn btn-plain" data-action="speak-write" style="padding-left:4px">' + icon("speaker") + 'Ouvir meu texto</button><span class="word-count"><span id="wc" class="num">' + wordCount(step.text) + "</span> palavras</span></div>";
      writeFoot(step);
    },

    marathon(step, el) {
      el.innerHTML = '<div class="step-head">' + eyebrow("Maratona de shadowing") + '<h1 class="title1">As 10 frases da semana</h1><p class="body secondary">Ouça cada frase, repita junto em voz alta e marque.</p></div>' +
        list(step.list.map((s, i) =>
          '<div class="cell">' + speakBtn(s[0], "", "Ouvir frase") + '<label class="cell-body" for="mar-' + i + '"><span class="cell-title" lang="en">' + esc(s[0]) + '</span><span class="cell-sub">' + esc(s[1]) + "</span></label>" +
          '<input class="check-circle" type="checkbox" id="mar-' + i + '" data-input="marathon" data-i="' + i + '" aria-label="Repeti esta frase"' + (step.checked[i] ? " checked" : "") + "></div>"), "icons");
      marathonFoot(step);
    },

    tasks(step, el) {
      const st = S.state.immersion["w" + P.w] || [];
      el.innerHTML = '<div class="step-head">' + eyebrow("Missões de imersão") + '<h1 class="title1">Use o inglês no mundo real</h1><p class="body secondary">Faça hoje o que conseguir. Dá para marcar depois na página da semana.</p></div>' +
        list(P.wk.immersion.map((t, i) => '<label class="cell"><span class="cell-body"><span class="cell-title">' + esc(t) + '</span></span><input type="checkbox" class="check-circle" data-input="task" data-i="' + i + '" aria-label="Concluída"' + (st[i] ? " checked" : "") + "></label>"));
      setFoot(primary("Continuar"));
    },

    score(step, el) {
      const pct = P.total ? Math.round((P.correct / P.total) * 100) : 0;
      const msg = pct >= 80 ? "Excelente. Você domina o conteúdo da semana." : pct >= 60 ? "Bom resultado. Os cartões que você errou vão voltar mais vezes." : "Vale reforçar antes de seguir. Refaça as lições da semana com calma.";
      el.innerHTML = '<div class="step-head center" style="align-items:center">' + eyebrow("Checkpoint") +
        '<p class="big-number" style="font-size:72px">' + P.correct + '<span class="secondary" style="font-size:36px">/' + P.total + "</span></p>" +
        '<p class="body secondary">' + msg + "</p></div>" +
        (P.missed.length ? section("Para revisar", list(P.missed.map((m) => cell({ title: esc(m.q), sub: 'Resposta: <b lang="en">' + esc(m.a) + "</b>" })))) : "");
      setFoot(primary("Continuar"));
    },

    selfcheck(step, el) {
      el.innerHTML = '<div class="step-head">' + eyebrow("Meta da semana") + '<h1 class="title2">' + esc(P.wk.goal) + "</h1>" +
        '<p class="body secondary">Teste agora: fale em voz alta por 1 minuto, sem ler. Depois responda com sinceridade.</p></div>' +
        list([["yes", "Sim, com confiança"], ["almost", "Quase lá, travei em algumas partes"], ["no", "Ainda não"]].map((o) =>
          '<button type="button" class="cell tappable opt' + (P.selfcheck === o[0] ? " selected" : "") + '" data-action="selfcheck" data-v="' + o[0] + '" aria-pressed="' + (P.selfcheck === o[0]) + '"><span class="cell-body"><span class="cell-title">' + o[1] + '</span></span><span class="opt-mark">' + (P.selfcheck === o[0] ? icon("check") : "") + "</span></button>"));
      setFoot(primary("Continuar", { disabled: !P.selfcheck }));
    },

    reflect(step, el) {
      const done = S.weekDone(P.w) + (S.isDone(P.id) ? 0 : 1);
      const pct = Math.round((done / 7) * 100);
      el.innerHTML = '<div class="step-head">' + eyebrow("Placar da semana " + P.w) + '<h1 class="title1">Execução de ' + pct + "%</h1>" +
        '<div class="exec-row">' + progressBar(pct, true) + "<b>" + done + "/7</b></div>" +
        '<p class="body secondary">' + (pct >= 85 ? "Meta de 85% batida. É esse ritmo que leva você até a semana 12." : "Abaixo da meta de 85%. Use as perguntas abaixo para ajustar a próxima semana.") + "</p></div>" +
        section("O que funcionou nesta semana?", '<div class="list"><div class="cell"><textarea id="ref-worked" data-input="worked" aria-label="O que funcionou nesta semana?" style="min-height:80px">' + esc(P.worked || "") + "</textarea></div></div>") +
        section("O que você vai ajustar na próxima?", '<div class="list"><div class="cell"><textarea id="ref-change" data-input="change" aria-label="O que você vai ajustar na próxima?" style="min-height:80px">' + esc(P.change || "") + "</textarea></div></div>");
      setFoot(primary("Concluir semana"));
    },

    finish(step, el) {
      const t = S.totals();
      let title, lead;
      if (P.mode === "review") {
        title = P.free ? "Treino concluído" : "Revisão concluída";
        lead = P.free ? "O treino livre não muda as caixas." : "Amanhã: " + plural(S.dueTomorrow(), "cartão", "cartões") + ".";
      } else if (P.kind === "review") {
        title = "Semana " + P.w + " concluída";
        lead = P.w < S.WEEKS ? "Próxima: semana " + (P.w + 1) + ", " + S.week(P.w + 1).title + "." : "Você terminou as 12 semanas. Parabéns pela constância.";
      } else {
        title = P.kind === "immersion" ? "Imersão concluída" : "Lição concluída";
        lead = "Sequência de " + plural(S.streak(), "dia", "dias") + "." + (P.kind === "lesson" ? " As palavras novas voltam amanhã." : "");
      }
      const xp = ["+" + P.xp, "XP"];
      const stats = P.mode === "review"
        ? [xp, [P.reviewed, "cartões"], [P.minutes, "min"]]
        : P.kind === "lesson" ? [xp, [P.correct + "/" + P.total, "acertos"], [P.minutes, "min"]]
          : P.kind === "review" ? [xp, [P.correct + "/" + P.total, "checkpoint"], [S.execution(P.w) + "%", "execução"]]
            : [xp, [P.steps.find((s) => s.type === "marathon").checked.filter(Boolean).length, "frases"], [P.minutes, "min"]];
      el.innerHTML = '<div class="step-head finish"><span class="finish-icon">' + icon("checkFill") + "</span>" +
        '<h1 class="title1">' + esc(title) + '</h1><p class="body secondary">' + esc(lead) + "</p></div>" +
        '<div class="summary center">' + stats.map((s) => "<div><b>" + s[0] + "</b><small>" + s[1] + "</small></div>").join("") + "</div>";
      const nid = S.nextId();
      setFoot(primary("Concluído", { action: "player-done", ghost: P.mode === "session" && nid ? ["next-lesson", "Próxima atividade"] : null }));
      haptic(20);
    }
  };

  function shadowFoot(step) { setFoot(primary("Continuar", { disabled: step.reps < 3, ghost: ["skip", "Agora não posso falar"] })); }
  function writeFoot(step) { setFoot(primary("Salvar e continuar", { disabled: wordCount(step.text) < step.min, ghost: ["skip", "Pular"] })); }
  function marathonFoot(step) {
    const n = step.checked.filter(Boolean).length;
    setFoot(primary("Continuar · " + n + " de " + step.list.length, { disabled: n < 5 }) + '<p class="footnote secondary center">Mínimo de 5 frases.</p>');
  }

  function drawTiles(step) {
    const line = $("#answer-line");
    const tiles = $("#tiles");
    if (!line || !tiles) return;
    line.innerHTML = step.picked.map((ti, pos) => '<button class="chip" data-action="unpick" data-pos="' + pos + '">' + esc(step.tiles[ti]) + "</button>").join("");
    tiles.innerHTML = step.shuffled.map((ti) => '<button class="chip' + (step.picked.includes(ti) ? " used" : "") + '" data-action="pick" data-t="' + ti + '"' + (step.picked.includes(ti) ? ' tabindex="-1" aria-hidden="true"' : "") + ">" + esc(step.tiles[ti]) + "</button>").join("");
    if (!step.answered) setFoot(primary("Verificar", { action: "check-order", disabled: step.picked.length !== step.tiles.length, ghost: step.picked.length ? ["clear-order", "Limpar"] : null }));
  }

  function answer(step, ok, shown) {
    P.total += 1;
    if (ok) P.correct += 1;
    else P.missed.push({ q: step.type === "order" ? step.pt : step.q, a: shown });
    haptic(ok ? 15 : [30, 40, 30]);
    const praise = ["Correto!", "Isso mesmo!", "Muito bem!", "Perfeito!"];
    const title = ok ? praise[Math.floor(Math.random() * praise.length)] : "Resposta certa: " + shown;
    const text = step.e && (!ok || step.type === "choice") ? step.e : "";
    setFoot('<div class="feedback ' + (ok ? "good" : "bad") + '">' + icon(ok ? "checkFill" : "xFill") + '<div><p class="feedback-title">' + esc(title) + "</p>" + (text ? '<p class="feedback-text">' + esc(text) + "</p>" : "") + "</div></div>" +
      primary("Continuar"), true);
    const say = step.type === "order" ? step.order : step.say || step.listen;
    if (say && SP.hasTTS) setTimeout(() => SP.speak(say), 150);
    const btn = $("#player [data-primary]");
    if (btn) btn.focus({ preventScroll: true });
  }

  function completeSession() {
    P.minutes = clamp(Math.round((Date.now() - P.startedAt) / 60000), 1, 60);
    P.xp = P.mode === "review" ? P.reviewed : P.kind === "lesson" ? 10 + P.correct + P.reviewed : P.kind === "immersion" ? 15 + P.reviewed : 20 + P.correct;
    const st = S.state;
    if (P.mode === "review") {
      S.logActivity({ min: P.minutes, reviews: P.reviewed, xp: P.xp });
    } else {
      st.lessons[P.id] = { at: S.today(), correct: P.correct, total: P.total, minutes: P.minutes };
      if (P.kind === "lesson") S.addCards(P.wk.days[P.d - 1].vocab.map((_, i) => S.cardId(P.w, P.d, i)));
      if (P.kind === "review") st.checkpoints["w" + P.w] = { score: P.correct, total: P.total, at: S.today(), selfcheck: P.selfcheck, worked: P.worked || "", change: P.change || "" };
      P.writes.forEach((w) => st.journal.push({ id: Date.now() + Math.random(), lesson: P.id, date: S.today(), prompt: w.prompt, text: w.text, label: w.label }));
      S.logActivity({ min: P.minutes, lessons: 1, reviews: P.reviewed, xp: P.xp });
    }
    S.save();
  }

  /* ═══════════════════════ EVENTOS ═══════════════════════ */

  const ACTIONS = {
    async start(el) {
      const id = el.dataset.id;
      if (!el.dataset.force && isLocked(id)) {
        const n = S.parseId(S.nextId());
        const ok = await alertDialog({ title: "Atividade bloqueada", text: "A próxima da trilha é a semana " + n.w + ", dia " + n.d + " (" + S.dayTitle(n.w, n.d) + "). Quer abrir esta mesmo assim?", ok: "Abrir", cancel: "Agora não" });
        if (!ok) return;
      }
      closePopover();
      openPlayer(buildSession(id));
    },
    node(el) { openPopover(el); },
    review() { if (S.dueIds().length) openPlayer(buildReview(false)); else toast("Nenhum cartão para revisar agora."); },
    practice() { if (Object.keys(S.state.cards).length) openPlayer(buildReview(true)); else toast("Faça uma lição para ter cartões."); },
    "player-close"() { requestClose(); },
    "player-done"() { closePlayer(); if (location.hash !== "#trilha") location.hash = "trilha"; },
    "next-lesson"() { const nid = S.nextId(); closePlayer(); if (nid) openPlayer(buildSession(nid)); },
    next() {
      const step = P && P.steps[P.i];
      if (step && step.type === "write" && wordCount(step.text || "") >= step.min) {
        P.writes = P.writes.filter((w) => w.prompt !== step.p);
        P.writes.push({ prompt: step.p, text: step.text.trim(), label: step.label });
      }
      if (step && step.type === "tasks") {
        S.state.immersion["w" + P.w] = $$("#player [data-input='task']").map((c) => c.checked);
        S.save();
      }
      next();
    },
    skip() { next(); },

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
      const card = S.state.cards[P.steps[P.i].id];
      const lab = (g) => "<small>" + (P.free ? "&nbsp;" : S.intervalLabel(card, g)) + "</small>";
      setFoot('<div class="grades">' +
        '<button class="grade again" data-action="grade" data-g="again">Errei' + lab("again") + "</button>" +
        '<button class="grade hard" data-action="grade" data-g="hard">Difícil' + lab("hard") + "</button>" +
        '<button class="grade easy" data-action="grade" data-g="easy" data-primary>Acertei' + lab("easy") + "</button></div>");
    },

    grade(el) {
      const step = P.steps[P.i];
      const g = el.dataset.g;
      if (!P.free) S.gradeCard(step.id, g);
      P.reviewed += 1;
      if (g === "easy") P.easy += 1;
      if (g === "again" && !step.again) {
        const fin = P.steps.findIndex((s) => s.type === "finish");
        const before = P.mode === "session" ? P.steps.findIndex((s, i) => i > P.i && s.type !== "card") : fin;
        P.steps.splice(before, 0, { type: "card", id: step.id, warm: step.warm, again: true });
      }
      if (!P.free) S.save();
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
      const built = step.picked.map((i) => step.tiles[i]).join(" ");
      $$("#tiles .chip, #answer-line .chip").forEach((b) => { b.disabled = true; });
      answer(step, SP.norm(built) === SP.norm(step.order), step.order);
    },

    rep() {
      const step = P.steps[P.i];
      step.reps = Math.min(3, step.reps + 1);
      $$("#player .rep-dots span").forEach((s, i) => s.classList.toggle("on", i < step.reps));
      haptic(10);
      shadowFoot(step);
    },

    async mic(el) {
      const step = P.steps[P.i];
      const out = $("#mic-result");
      SP.stop();
      el.disabled = true;
      el.innerHTML = icon("mic") + "Ouvindo…";
      out.hidden = false;
      out.textContent = "Fale a frase agora.";
      try {
        const alts = await SP.listen();
        const best = alts.map((a) => ({ a, s: SP.similarity(step.en, a) })).sort((x, y) => y.s - x.s)[0];
        const msg = best.s >= 85 ? "Excelente pronúncia!" : best.s >= 60 ? "Quase lá. Ouça de novo e repare nas palavras que faltaram." : "Tente de novo, mais devagar e articulando cada palavra.";
        out.innerHTML = 'Entendi: <b lang="en">“' + esc(best.a) + "”</b><br>" + best.s + "% das palavras reconhecidas. " + msg;
        if (best.s >= 70) { step.reps = 3; $$("#player .rep-dots span").forEach((s) => s.classList.add("on")); shadowFoot(step); }
      } catch (e) {
        out.textContent = e.message === "not-allowed" || e.message === "service-not-allowed"
          ? "Não foi possível usar o microfone aqui. Repita em voz alta e toque em “Repeti em voz alta”."
          : e.message === "no-speech" ? "Não ouvi nada. Toque de novo e fale perto do microfone." : "O reconhecimento de voz falhou. Repita em voz alta e marque abaixo.";
      }
      el.disabled = false;
      el.innerHTML = icon("mic") + "Pronúncia";
    },

    starter(el) {
      const box = $("#write-box");
      const step = P.steps[P.i];
      const add = el.dataset.text.replace(/\.\.\.$/, " ");
      box.value = box.value + (box.value && !/\s$/.test(box.value) ? " " : "") + add;
      step.text = box.value;
      box.focus();
      box.setSelectionRange(box.value.length, box.value.length);
      $("#wc").textContent = wordCount(step.text);
      writeFoot(step);
    },
    "speak-write"(el) {
      const t = ($("#write-box") || {}).value || "";
      if (!t.trim()) { toast("Escreva algo primeiro."); return; }
      el.dataset.text = t;
      ACTIONS.speak(el);
    },

    selfcheck(el) {
      P.selfcheck = el.dataset.v;
      $$("#player [data-action='selfcheck']").forEach((b) => {
        const on = b === el;
        b.classList.toggle("selected", on);
        b.setAttribute("aria-pressed", String(on));
        $(".opt-mark", b).innerHTML = on ? icon("check") : "";
      });
      setFoot(primary("Continuar"));
    },

    async "backup-copy"() {
      const data = S.exportJSON();
      try {
        await navigator.clipboard.writeText(data);
        toast("Backup copiado");
      } catch (e) {
        const box = $("#backup-box");
        box.value = data;
        box.focus();
        box.select();
        toast("Copie o texto selecionado");
      }
    },
    "backup-restore"() {
      try {
        S.importJSON($("#backup-box").value.trim());
        toast("Backup restaurado");
        $("#app").innerHTML = "";
        render();
      } catch (e) {
        toast("Texto inválido. Cole o backup completo.");
      }
    },
    async reset() {
      const ok = await alertDialog({ title: "Apagar todo o progresso?", text: "Lições, cartões, diário e estatísticas deste aparelho serão apagados. Isso não pode ser desfeito.", ok: "Apagar", danger: true });
      if (!ok) return;
      S.reset();
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

  document.addEventListener("input", (e) => {
    const el = e.target;
    const kind = el.dataset && el.dataset.input;
    if (!kind) return;
    if (kind === "dict") { $("#dict-list").innerHTML = dictItems(el.value); return; }
    if (kind === "write" && P) {
      const step = P.steps[P.i];
      step.text = el.value;
      $("#wc").textContent = wordCount(el.value);
      writeFoot(step);
      return;
    }
    if (kind === "worked" && P) { P.worked = el.value; return; }
    if (kind === "change" && P) { P.change = el.value; return; }
    if (kind === "name") { S.state.profile.name = el.value.trim(); S.save(); }
  });

  document.addEventListener("change", (e) => {
    const el = e.target;
    const kind = el.dataset && el.dataset.input;
    if (!kind) return;
    const st = S.state;
    if (kind === "marathon" && P) {
      P.steps[P.i].checked[+el.dataset.i] = el.checked;
      marathonFoot(P.steps[P.i]);
    } else if (kind === "task" && P) {
      st.immersion["w" + P.w] = $$("#player [data-input='task']").map((c) => c.checked);
      S.save();
    } else if (kind === "week-task") {
      const key = "w" + el.dataset.w;
      const arr = (st.immersion[key] || []).slice();
      arr[+el.dataset.i] = el.checked;
      st.immersion[key] = arr;
      S.save();
    } else if (kind === "start" && el.value) {
      st.profile.startDate = el.value; S.save(); toast("Data de início atualizada");
    } else if (kind === "voice") {
      st.settings.voiceURI = el.value; S.save();
    } else if (kind === "autoplay") {
      st.settings.autoplay = el.checked; S.save();
    }
  });

  // Controles segmentados de Ajustes
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-setting] [data-value]");
    if (!b) return;
    const group = b.closest("[data-setting]");
    const key = group.dataset.setting;
    const st = S.state;
    if (key === "goalMin") st.profile.goalMin = +b.dataset.value;
    else if (key === "rate") st.settings.rate = +b.dataset.value;
    else if (key === "theme") { st.settings.theme = b.dataset.value; applyTheme(); }
    S.save();
    $$("[data-value]", group).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    if (key === "rate" && SP.hasTTS) SP.speak("This is how I sound.");
  });

  document.addEventListener("keydown", (e) => {
    if (!P || $(".alert-backdrop")) return;
    const tag = (e.target.tagName || "").toLowerCase();
    if (e.key === "Escape") { e.preventDefault(); requestClose(); return; }
    if (tag === "textarea" || tag === "input" || tag === "select") return;
    const step = P.steps[P.i];
    if (/^[1-4]$/.test(e.key)) {
      const sel = (step.type === "choice" && !step.answered) || step.type === "selfcheck" ? "#player .opt" : step.type === "card" ? "#player .grade" : null;
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

  if (window.speechSynthesis && window.speechSynthesis.addEventListener) {
    window.speechSynthesis.addEventListener("voiceschanged", () => {
      const active = document.activeElement;
      if (!P && route().view === "ajustes" && S.state.profile && !(active && active.matches && active.matches("input, textarea, select"))) render();
    });
  }

  /* ───────── Início ───────── */
  try { if ("scrollRestoration" in history) history.scrollRestoration = "manual"; } catch (e) { /* ignora */ }
  S.save();
  render();
})();
