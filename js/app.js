/* Inglês em 12 Semanas — telas, navegação e o player de lições. */
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
    if (m < 60) return m + " min";
    const h = Math.floor(m / 60), r = m % 60;
    return h + " h" + (r ? " " + String(r).padStart(2, "0") : "");
  }
  const wordCount = (t) => (t.trim().match(/[A-Za-zÀ-ÿ0-9']+/g) || []).length;
  const isEnglish = (t) => /^[A-Za-z0-9 ,.'?!’_\-]+$/.test(t);

  /* ───────── Ícones (traço, 24×24) ───────── */
  const ICON = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    calendar: '<rect x="3" y="4.5" width="18" height="16.5" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
    cards: '<rect x="3" y="7" width="13" height="14" rx="2"/><path d="M8 3.5h11a2 2 0 0 1 2 2V17"/>',
    chart: '<path d="M4 20V11M10 20V5M16 20v-6M2.5 20.5h19"/>',
    book: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5z"/><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H20"/>',
    sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    flame: '<path d="M12 21c4 0 7-2.7 7-6.6 0-3.1-2-5.4-3.6-7-.4 2-1.5 3.3-2.9 3.9C12.8 7.6 11 4.6 8.5 3c.3 3-1.7 5.1-3 7A7.2 7.2 0 0 0 5 14.4C5 18.3 8 21 12 21z"/>',
    speaker: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    pencil: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4.5" height="6.5" rx="1.5"/><rect x="16.5" y="14" width="4.5" height="6.5" rx="1.5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
    repeat: '<path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5"/><path d="M20 3.5v5h-5"/><path d="M20 12a8 8 0 0 1-13.7 5.6L4 15.5"/><path d="M4 20.5v-5h5"/>',
    layers: '<path d="M12 3 2.5 8 12 13l9.5-5z"/><path d="M2.5 12.5 12 17.5l9.5-5"/><path d="M2.5 16.5 12 21.5l9.5-5"/>',
    zap: '<path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12z"/>',
    word: '<path d="M4 7V5h16v2M9 19h6M12 5v14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
  };
  const icon = (name, cls) => '<svg class="icon ' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true">' + ICON[name] + "</svg>";

  /* ───────── Tema ───────── */
  let themeSetByApp = false;
  function applyTheme() {
    const t = S.state.settings.theme;
    const root = document.documentElement;
    if (t === "light" || t === "dark") { root.setAttribute("data-theme", t); themeSetByApp = true; }
    else if (themeSetByApp) { root.removeAttribute("data-theme"); themeSetByApp = false; }
  }

  /* ───────── Toast e modal ───────── */
  let toastTimer;
  function toast(msg) {
    let el = $("#toast");
    if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2600);
  }

  function confirmModal(opts) {
    return new Promise((resolve) => {
      const wrap = document.createElement("div");
      wrap.className = "modal-backdrop";
      wrap.innerHTML =
        '<div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="modal-title">' +
        '<h2 id="modal-title">' + esc(opts.title) + "</h2>" +
        (opts.text ? '<p class="muted">' + esc(opts.text) + "</p>" : "") +
        '<div class="modal-actions">' +
        '<button class="btn" data-m="no">' + esc(opts.cancel || "Cancelar") + "</button>" +
        '<button class="btn ' + (opts.danger ? "btn-danger" : "btn-primary") + '" data-m="yes">' + esc(opts.ok || "Confirmar") + "</button>" +
        "</div></div>";
      const done = (v) => { wrap.remove(); document.removeEventListener("keydown", onKey, true); resolve(v); };
      const onKey = (e) => { if (e.key === "Escape") { e.stopPropagation(); done(false); } };
      wrap.addEventListener("click", (e) => {
        const b = e.target.closest("[data-m]");
        if (b) done(b.dataset.m === "yes");
        else if (e.target === wrap) done(false);
      });
      document.addEventListener("keydown", onKey, true);
      document.body.appendChild(wrap);
      $('[data-m="no"]', wrap).focus();
    });
  }

  /* ───────── Navegação ───────── */
  const NAV = [
    { id: "hoje", label: "Hoje", icon: "home" },
    { id: "plano", label: "Plano", icon: "calendar" },
    { id: "revisar", label: "Revisar", icon: "cards" },
    { id: "progresso", label: "Progresso", icon: "chart" },
    { id: "metodo", label: "Método", icon: "book" }
  ];

  function brand() {
    return '<a class="brand" href="#hoje"><span class="brand-badge">12</span><span class="brand-text">Inglês em 12 semanas</span></a>';
  }

  function renderShell() {
    $("#app").innerHTML =
      '<div class="app">' +
      '<nav class="rail" aria-label="Navegação principal">' + brand() +
      NAV.map((n) => '<a class="rail-link" data-nav="' + n.id + '" href="#' + n.id + '">' + icon(n.icon) + "<span>" + n.label + '</span><span class="tab-badge num" data-badge="' + n.id + '" hidden></span></a>').join("") +
      '<a class="rail-link" data-nav="ajustes" href="#ajustes">' + icon("sliders") + "<span>Ajustes</span></a>" +
      '<div class="rail-foot" id="rail-foot"></div>' +
      "</nav>" +
      '<div class="main"><div class="main-inner">' +
      '<header class="topbar">' + brand() +
      '<div class="topbar-actions"><span class="streak-chip" id="streak-chip" title="Dias seguidos estudando">' + icon("flame") + '<span class="num"></span></span>' +
      '<a class="icon-btn" href="#ajustes" aria-label="Ajustes">' + icon("sliders") + "</a></div></header>" +
      '<main id="view" tabindex="-1"></main>' +
      "</div></div>" +
      '<nav class="tabbar" aria-label="Navegação principal">' +
      NAV.map((n) => '<a class="tab" data-nav="' + n.id + '" href="#' + n.id + '">' + icon(n.icon) + "<span>" + n.label + '</span><span class="tab-badge num" data-badge="' + n.id + '" hidden></span></a>').join("") +
      "</nav></div>";
  }

  function updateChrome(view) {
    $$("[data-nav]").forEach((a) => { if (a.dataset.nav === view) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    const due = S.dueIds().length;
    $$('[data-badge="revisar"]').forEach((b) => { b.hidden = due === 0; b.textContent = due > 99 ? "99+" : due; });
    const chip = $("#streak-chip .num");
    if (chip) { const s = S.streak(); chip.textContent = plural(s, "dia", "dias"); }
    const foot = $("#rail-foot");
    if (foot) {
      const t = S.totals();
      foot.innerHTML = "<b>" + t.lessons + "</b> de " + S.TOTAL_DAYS + " dias concluídos<br>Progresso salvo neste aparelho.";
    }
  }

  function route() {
    const h = (location.hash || "").slice(1);
    const m = /^semana-(\d+)$/.exec(h);
    if (m) return { view: "plano", week: clamp(+m[1], 1, S.WEEKS) };
    return { view: VIEWS[h] ? h : "hoje" };
  }

  function render() {
    applyTheme();
    if (!S.state.profile) { renderOnboarding(); return; }
    if (!$("#view")) renderShell();
    const r = route();
    updateChrome(r.view);
    $("#view").innerHTML = VIEWS[r.view](r);
    if (r.week) {
      const el = document.getElementById("semana-" + r.week);
      if (el) setTimeout(() => el.scrollIntoView({ block: "start", behavior: "smooth" }), 30);
    }
  }

  /* ───────── Onboarding ───────── */
  function renderOnboarding() {
    const goal = 25;
    $("#app").innerHTML =
      '<div class="onboard"><div class="onboard-card">' + brand() +
      '<div class="stack"><h1>Do “hello” a uma conversa de 5 minutos em <span class="mark">84 dias</span>.</h1>' +
      '<p class="step-lead">Um plano de 12 semanas com lições curtas, revisão espaçada, shadowing e um placar semanal para você não se perder.</p></div>' +
      '<ul class="onboard-points">' +
      '<li><span class="ico">' + icon("clock", "icon-sm") + "</span><span><b>15 a 25 minutos por dia.</b> Cinco lições, um dia de imersão e uma revisão por semana.</span></li>" +
      '<li><span class="ico">' + icon("repeat", "icon-sm") + "</span><span><b>Você não esquece o que aprendeu.</b> Os cartões voltam no momento certo, em 5 caixas.</span></li>" +
      '<li><span class="ico">' + icon("target", "icon-sm") + "</span><span><b>Meta de 85% de execução.</b> Constância conta mais que perfeição.</span></li>" +
      "</ul>" +
      '<form id="onboard-form" class="stack" novalidate>' +
      '<div class="field"><label for="ob-name">Como você quer ser chamado?</label><input class="input" id="ob-name" name="name" autocomplete="given-name" placeholder="Seu nome" maxlength="40"></div>' +
      '<div class="field"><span class="label" id="goal-label">Quanto tempo por dia?</span><div class="segmented" role="group" aria-labelledby="goal-label" id="ob-goal">' +
      [15, 25, 40].map((m) => '<button type="button" data-goal="' + m + '" aria-pressed="' + (m === goal) + '">' + m + " min</button>").join("") +
      "</div></div>" +
      '<div class="field"><label for="ob-start">Data de início</label><input class="input" type="date" id="ob-start" value="' + S.today() + '"></div>' +
      '<button class="btn btn-primary btn-lg btn-block" type="submit">Começar a Semana 1 ' + icon("arrow") + "</button>" +
      "</form>" +
      '<p class="muted">Sem cadastro: seu progresso fica salvo neste navegador. Você pode fazer backup em Ajustes.</p>' +
      "</div></div>";

    const form = $("#onboard-form");
    let chosen = goal;
    $("#ob-goal").addEventListener("click", (e) => {
      const b = e.target.closest("[data-goal]");
      if (!b) return;
      chosen = +b.dataset.goal;
      $$("#ob-goal button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const start = $("#ob-start").value || S.today();
      S.state.profile = { name: $("#ob-name").value.trim(), goalMin: chosen, startDate: start, createdAt: new Date().toISOString() };
      S.save();
      $("#app").innerHTML = "";
      location.hash = "hoje";
      render();
    });
  }

  /* ═══════════════════════ TELAS ═══════════════════════ */

  function kindLabel(kind) { return kind === "lesson" ? "Lição" : kind === "immersion" ? "Imersão" : "Revisão"; }
  function contents(kind) {
    if (kind === "lesson") return ["4 palavras", "gramática", "4 exercícios", "2 frases de shadowing", "1 texto"];
    if (kind === "immersion") return ["10 frases de shadowing", "3 missões", "missão da semana"];
    return ["checkpoint de 10 questões", "autoavaliação", "placar de execução"];
  }
  function estimate(kind) { return kind === "lesson" ? "15–20 min" : kind === "immersion" ? "20–30 min" : "10–15 min"; }

  function ring(value, max, label) {
    const r = 26, c = 2 * Math.PI * r;
    const pct = max ? clamp(value / max, 0, 1) : 0;
    return '<svg class="ring" viewBox="0 0 64 64" role="img" aria-label="' + esc(label) + '">' +
      '<circle class="ring-track" cx="32" cy="32" r="' + r + '" fill="none" stroke-width="7"/>' +
      '<circle class="ring-value" cx="32" cy="32" r="' + r + '" fill="none" stroke-width="7" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - pct)).toFixed(1) + '" transform="rotate(-90 32 32)"/>' +
      '<text class="ring-text num" x="32" y="37" text-anchor="middle">' + Math.round(pct * 100) + "%</text></svg>";
  }

  function execBar(pct) {
    return '<div class="bar' + (pct >= 85 ? " good" : "") + '" role="img" aria-label="Execução ' + pct + '%, meta 85%"><span style="width:' + pct + '%"></span><i class="target" style="left:85%"></i></div>';
  }

  function calendarNote(progressWeek) {
    const p = S.state.profile;
    const day = S.calendarDay();
    if (day < 1) return "Seu programa começa em " + S.fmtDate(p.startDate, { day: "2-digit", month: "long" }) + ". Pode adiantar se quiser.";
    if (day > S.TOTAL_DAYS) return "As 84 dias do calendário já passaram. Termine no seu ritmo.";
    const cw = S.calendarWeek();
    const diff = cw - progressWeek;
    const base = "Dia " + day + " de " + S.TOTAL_DAYS + " no calendário. ";
    if (diff <= 0) return base + "Você está em dia.";
    return base + "O calendário está na Semana " + cw + "; você está " + plural(diff, "semana", "semanas") + " atrás. Sem culpa: siga no seu ritmo.";
  }

  /* ───────── Hoje ───────── */
  function viewHoje() {
    const st = S.state;
    const name = st.profile.name;
    const h = new Date().getHours();
    const hello = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
    const nid = S.nextId();
    const due = S.dueIds().length;
    const mins = S.minutesToday();
    const goal = st.profile.goalMin;
    const streak = S.streak();

    let hero, wkN;
    if (nid) {
      const { w, d } = S.parseId(nid);
      wkN = w;
      const wk = S.week(w);
      const kind = S.dayKind(d);
      hero =
        '<section class="next-lesson" aria-labelledby="next-title">' +
        '<div><p class="eyebrow">Próxima · Semana ' + w + " · Dia " + d + " · " + kindLabel(kind) + "</p>" +
        '<h2 id="next-title">' + esc(S.dayTitle(w, d)) + "</h2>" +
        '<p class="en" lang="en">' + esc(wk.en) + "</p></div>" +
        '<div class="lesson-contents">' + contents(kind).map((c) => "<span>" + c + "</span>").join("") + "</div>" +
        '<div class="next-lesson-foot"><button class="btn btn-primary btn-lg" data-action="start" data-id="' + nid + '">Começar ' + icon("arrow") + "</button>" +
        "<small>" + icon("clock", "icon-sm") + " " + estimate(kind) + "</small></div></section>";
    } else {
      wkN = S.WEEKS;
      hero =
        '<section class="next-lesson"><p class="eyebrow">84 de 84 dias</p><h2>Você concluiu as 12 semanas.</h2>' +
        "<p>Continue revisando os cartões todo dia e refaça as lições que achou difíceis. Para o próximo passo, converse em inglês pelo menos 3 vezes por semana.</p>" +
        '<div class="next-lesson-foot"><a class="btn btn-primary btn-lg" href="#progresso">Ver minha evolução</a></div></section>';
    }

    const wk = S.week(wkN);
    const days = [];
    for (let d = 1; d <= 7; d++) {
      const id = S.lessonId(wkN, d);
      const done = S.isDone(id);
      const cls = done ? "done" : id === nid ? "current" : "";
      days.push('<button class="day-cell ' + cls + '" data-action="start" data-id="' + id + '" aria-label="Dia ' + d + ": " + esc(S.dayTitle(wkN, d)) + (done ? ", concluído" : "") + '"><span class="dot">' + icon("check", "icon-sm") + "</span>D" + d + "</button>");
    }
    const ex = S.execution(wkN);

    const journey = [];
    for (let w = 1; w <= S.WEEKS; w++) {
      const pct = Math.round((S.weekDone(w) / 7) * 100);
      journey.push('<span class="' + (w === wkN && nid ? "now" : "") + '" title="Semana ' + w + ": " + pct + '%"><i style="width:' + pct + '%"></i></span>');
    }

    return (
      '<div class="stack-lg">' +
      '<header class="greeting"><h1>' + hello + (name ? ", " + esc(name) : "") + ".</h1>" +
      "<p>" + calendarNote(wkN) + "</p>" +
      (S.storageOk ? "" : '<p class="pill warn">Este navegador não está salvando seu progresso (modo anônimo?).</p>') +
      "</header>" +
      hero +
      '<div class="today-grid">' +
      '<div class="panel tile">' + ring(mins, goal, "Meta de hoje: " + mins + " de " + goal + " minutos") +
      '<div class="tile-body"><p class="tile-title">Meta de hoje</p><p class="tile-sub num">' + mins + " de " + goal + " min · " + (mins >= goal ? "meta batida" : "faltam " + (goal - mins) + " min") + "</p>" +
      '<p class="tile-sub">' + icon("flame", "icon-sm") + " Sequência: " + plural(streak, "dia", "dias") + "</p></div></div>" +
      '<div class="panel tile review-tile"><span class="count num">' + due + "</span>" +
      '<div class="tile-body"><p class="tile-title">' + (due ? (due === 1 ? "cartão para revisar" : "cartões para revisar") : S.totals().words ? "Revisões em dia" : "Nenhum cartão ainda") + "</p>" +
      '<p class="tile-sub">' + (due ? "Revise antes da lição: leva uns " + Math.max(1, Math.round(due / 4)) + " min." : S.totals().words ? "Amanhã: " + plural(S.dueTomorrow(), "cartão", "cartões") + "." : "Cada lição adiciona 4 palavras, que voltam para revisão a partir de amanhã.") + "</p>" +
      (due ? '<button class="btn btn-sm" data-action="review">Revisar agora</button>' : "") + "</div></div>" +
      "</div>" +
      '<section class="panel stack"><div class="spread"><div><p class="eyebrow">Semana ' + wkN + " de 12 · " + esc(wk.cefr) + '</p><h2 style="font-size:var(--step-1)">' + esc(wk.title) + '</h2></div><a class="link-btn" href="#semana-' + wkN + '">Ver semana</a></div>' +
      '<div class="week-strip">' + days.join("") + "</div>" +
      '<div class="score-line"><span class="label">Execução</span>' + execBar(ex) + '<b class="num">' + ex + "%</b></div>" +
      '<p class="goal-box"><span class="eyebrow">Meta da semana</span><br>' + esc(wk.goal) + "</p></section>" +
      '<section class="journey" aria-label="Jornada de 12 semanas"><div class="spread"><h2 style="font-size:var(--step-1)">Jornada</h2><span class="muted num">' + S.totals().lessons + " / " + S.TOTAL_DAYS + " dias</span></div>" +
      '<div class="journey-bar">' + journey.join("") + "</div>" +
      '<div class="journey-labels">' + C.phases.map((p) => "<span>" + esc(p.name) + " · " + p.cefr + "</span>").join("") + "</div></section>" +
      "</div>"
    );
  }

  /* ───────── Plano ───────── */
  function viewPlano(r) {
    const nid = S.nextId();
    const cur = nid ? S.parseId(nid).w : 0;
    const openWeek = r.week || cur;
    const phases = C.phases.map((p) => {
      const weeks = [];
      for (let w = p.weeks[0]; w <= p.weeks[1]; w++) {
        const wk = S.week(w);
        const done = S.weekDone(w);
        const cls = done === 7 ? "is-done" : w === cur ? "is-current" : "";
        const rows = [];
        for (let d = 1; d <= 7; d++) {
          const id = S.lessonId(w, d);
          const kind = S.dayKind(d);
          const isDone = S.isDone(id);
          let sub;
          if (kind === "lesson") sub = wk.days[d - 1].vocab.map((v) => v[0]).join(" · ");
          else if (kind === "immersion") sub = "Maratona de shadowing e 3 missões de imersão";
          else {
            const cp = S.state.checkpoints["w" + w];
            sub = cp ? "Checkpoint: " + cp.score + "/" + cp.total + " acertos" : "Checkpoint de 10 questões e placar da semana";
          }
          rows.push(
            '<li><button class="day-row ' + (isDone ? "done" : id === nid ? "next" : "") + '" data-action="start" data-id="' + id + '">' +
            '<span class="check">' + icon("check", "icon-sm") + "</span>" +
            '<span><span class="day-row-title">Dia ' + d + " · " + esc(S.dayTitle(w, d)) + '</span><span class="day-row-sub" lang="' + (kind === "lesson" ? "en" : "pt-BR") + '">' + esc(sub) + "</span></span>" +
            '<span class="pill day-row-kind">' + (isDone ? "Refazer" : id === nid ? "Próxima" : kindLabel(kind)) + "</span></button></li>"
          );
        }
        weeks.push(
          '<details class="week ' + cls + '" id="semana-' + w + '"' + (w === openWeek ? " open" : "") + ">" +
          '<summary><span class="week-num num">' + w + "</span>" +
          '<span class="week-info"><span class="week-title">' + esc(wk.title) + '</span><span class="week-sub">' + esc(wk.grammar.title) + "</span></span>" +
          '<span class="week-mini"><span class="num">' + done + '/7</span><span class="bar' + (done === 7 ? " good" : "") + '"><span style="width:' + Math.round((done / 7) * 100) + '%"></span></span></span></summary>' +
          '<div class="week-body"><p class="week-goal"><b>Meta:</b> ' + esc(wk.goal) + "</p>" +
          '<ul class="day-list">' + rows.join("") + "</ul></div></details>"
        );
      }
      return '<section class="phase"><div class="phase-head"><span class="eyebrow">Fase ' + p.n + " · Semanas " + p.weeks[0] + "–" + p.weeks[1] + " · " + p.cefr + "</span></div>" +
        "<h2>" + esc(p.name) + '</h2><p class="phase-text">' + esc(p.text) + "</p>" + weeks.join("") + "</section>";
    });
    return (
      '<div class="stack-lg"><header class="stack"><p class="eyebrow">84 dias · 3 fases · A1 → B1</p><h1>Plano de 12 semanas</h1>' +
      '<p class="muted">Cada semana tem 5 lições, 1 dia de imersão e 1 revisão com placar. Você pode abrir qualquer dia; a próxima recomendada fica destacada. <a href="#metodo">Como o método funciona</a></p></header>' +
      phases.join("") + "</div>"
    );
  }

  /* ───────── Revisar ───────── */
  const BOX_LABEL = ["todo dia", "a cada 2 dias", "a cada 4 dias", "a cada 8 dias", "a cada 16 dias"];
  function viewRevisar() {
    const due = S.dueIds().length;
    const total = Object.keys(S.state.cards).length;
    const counts = S.boxCounts();
    const max = Math.max(1, ...counts);
    const boxes = counts.map((n, i) =>
      '<div class="box-col" title="Caixa ' + (i + 1) + ": " + plural(n, "cartão", "cartões") + ", revisão " + BOX_LABEL[i] + '"><b class="num">' + n + '</b><div class="box-bar"><span style="height:' + Math.round((n / max) * 100) + '%"></span></div><span>Caixa ' + (i + 1) + "</span><small>" + BOX_LABEL[i] + "</small></div>").join("");

    const hero = due
      ? '<div class="panel spread"><div><p class="eyebrow">Para hoje</p><p class="stat"><b class="num" style="font-size:var(--step-4);line-height:1">' + due + '</b></p><p class="muted">' + (due === 1 ? "cartão esperando revisão" : "cartões esperando revisão") + '</p></div><button class="btn btn-primary btn-lg" data-action="review">Revisar agora ' + icon("arrow") + "</button></div>"
      : total
        ? '<div class="panel spread"><div><p class="eyebrow">Para hoje</p><h2>Tudo revisado.</h2><p class="muted">Amanhã: ' + plural(S.dueTomorrow(), "cartão", "cartões") + ". Quer treinar mesmo assim?</p></div>" + (total >= 4 ? '<button class="btn" data-action="practice">Treino livre</button>' : "") + "</div>"
        : '<div class="panel stack"><h2>Sua caixa está vazia.</h2><p class="muted">Cada lição concluída adiciona 4 palavras aqui. Elas voltam para revisão amanhã e depois em intervalos cada vez maiores.</p><div><a class="btn btn-primary" href="#hoje">Fazer a próxima lição</a></div></div>';

    return (
      '<div class="stack-lg"><header class="stack"><p class="eyebrow">Sistema de Leitner · 5 caixas</p><h1>Revisão espaçada</h1>' +
      '<p class="muted">Você revisa cada palavra pouco antes de esquecê-la. Acertou, ela sobe de caixa e demora mais para voltar. Errou, volta para a Caixa 1.</p></header>' +
      hero +
      (total ? '<section class="panel stack"><div class="section-head"><h2>Suas caixas</h2><span class="muted num">' + plural(total, "palavra", "palavras") + "</span></div>" +
        '<div class="boxes" role="img" aria-label="Distribuição de cartões por caixa: ' + counts.map((n, i) => "caixa " + (i + 1) + " " + n).join(", ") + '">' + boxes + "</div>" +
        (due && total >= 4 ? '<div><button class="btn btn-sm" data-action="practice">Treino livre (não altera as caixas)</button></div>' : "") + "</section>" +
        '<section class="panel stack"><div class="section-head"><h2>Seu vocabulário</h2></div>' +
        '<label class="sr-only" for="dict-search">Buscar palavra</label><input class="input" id="dict-search" data-input="dict" type="search" placeholder="Buscar em inglês ou português">' +
        '<ul class="dict-list" id="dict-list">' + dictItems("") + "</ul></section>" : "") +
      "</div>"
    );
  }

  function dictItems(q) {
    const nq = q.trim().toLowerCase();
    const rows = Object.keys(S.state.cards)
      .map((id) => Object.assign(S.cardContent(id) || {}, { box: S.state.cards[id].box }))
      .filter((c) => c.en && (!nq || c.en.toLowerCase().includes(nq) || c.pt.toLowerCase().includes(nq)))
      .sort((a, b) => a.en.localeCompare(b.en));
    if (!rows.length) return '<li class="muted">Nenhuma palavra encontrada.</li>';
    return rows.map((c) =>
      '<li><span><b lang="en">' + esc(c.en) + "</b><small>" + esc(c.pt) + '</small></span><span class="pill' + (c.box >= 4 ? " good" : "") + '">Caixa ' + c.box + "</span>" +
      '<button class="speak" data-action="speak" data-text="' + esc(c.en) + '" aria-label="Ouvir ' + esc(c.en) + '">' + icon("speaker", "icon-sm") + "</button></li>").join("");
  }

  /* ───────── Progresso ───────── */
  function viewProgresso() {
    const t = S.totals();
    const st = S.state;
    const nid = S.nextId();
    const cur = nid ? S.parseId(nid).w : S.WEEKS;

    // Gráfico de execução semanal (barras, meta de 85%)
    const wide = window.innerWidth >= 700;
    const W = wide ? 640 : 360, H = wide ? 240 : 200, ml = 40, mr = 6, mt = 18, mb = 24;
    const iw = W - ml - mr, ih = H - mt - mb;
    const band = iw / 12;
    const y = (v) => mt + ih - (v / 100) * ih;
    let svg = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Execução por semana, meta de 85%">';
    [0, 25, 50, 75, 100].forEach((v) => {
      svg += '<line class="grid-line" x1="' + ml + '" x2="' + (W - mr) + '" y1="' + y(v) + '" y2="' + y(v) + '"/>';
      svg += '<text x="' + (ml - 8) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + v + "%</text>";
    });
    for (let w = 1; w <= 12; w++) {
      const v = S.execution(w);
      const bw = band * 0.56;
      const x = ml + band * (w - 1) + (band - bw) / 2;
      const top = y(v), base = y(0);
      if (v > 0) {
        const r = Math.min(4, base - top);
        svg += '<path class="bar-mark" d="M' + x + " " + base + "V" + (top + r) + "Q" + x + " " + top + " " + (x + r) + " " + top + "H" + (x + bw - r) + "Q" + (x + bw) + " " + top + " " + (x + bw) + " " + (top + r) + "V" + base + 'Z"/>';
      }
      svg += '<rect class="bar-hit" x="' + (ml + band * (w - 1)) + '" y="' + mt + '" width="' + band + '" height="' + ih + '"><title>Semana ' + w + ": " + v + "% (" + S.weekDone(w) + "/7)</title></rect>";
      svg += '<text x="' + (x + bw / 2) + '" y="' + (H - 8) + '" text-anchor="middle"' + (w === cur ? ' style="font-weight:700;fill:var(--ink)"' : "") + ">S" + w + "</text>";
    }
    svg += '<line class="target-line" x1="' + ml + '" x2="' + (W - mr) + '" y1="' + y(85) + '" y2="' + y(85) + '"/>';
    svg += '<text x="' + (W - mr) + '" y="' + (y(85) - 6) + '" text-anchor="end" style="font-weight:700;fill:var(--ink)">meta 85%</text></svg>';

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
        let cls = "cell";
        if (k > todayK) cls += " future";
        else if (m >= goal) cls += " l3";
        else if (m >= goal / 2) cls += " l2";
        else if (m > 0) cls += " l1";
        if (k === todayK) cls += " today";
        heat += '<span class="' + cls + '" title="' + S.fmtDate(k) + ": " + m + ' min"></span>';
      }
    }

    // Checkpoints
    const cpRows = [];
    for (let w = 1; w <= 12; w++) {
      const cp = st.checkpoints["w" + w];
      if (!cp) continue;
      const self = { yes: "Consigo", almost: "Quase lá", no: "Ainda não" }[cp.selfcheck] || "—";
      cpRows.push("<tr><td>Semana " + w + " · " + esc(S.week(w).title) + '</td><td class="num">' + cp.score + "/" + cp.total + '</td><td class="num">' + S.execution(w) + "%</td><td>" + self + "</td></tr>");
    }

    const journal = st.journal.slice().reverse().slice(0, 30).map((j) =>
      '<article class="journal-entry"><div class="spread"><span class="pill">' + esc(j.label || "") + '</span><span class="muted num">' + S.fmtDate(j.date) + '</span></div><p class="prompt">' + esc(j.prompt) + '</p><p class="text" lang="en">' + esc(j.text) + "</p></article>").join("");

    return (
      '<div class="stack-lg"><header class="stack"><p class="eyebrow">Seu placar</p><h1>Progresso</h1></header>' +
      '<div class="stats">' +
      '<div class="stat"><b>' + t.words + "</b><small>palavras aprendidas</small></div>" +
      '<div class="stat"><b>' + t.lessons + '<span class="muted" style="font-size:var(--step-1)">/' + S.TOTAL_DAYS + "</span></b><small>dias concluídos</small></div>" +
      '<div class="stat"><b>' + fmtMinutes(t.minutes) + "</b><small>de estudo</small></div>" +
      '<div class="stat"><b>' + S.streak() + "</b><small>dias seguidos</small></div>" +
      "</div>" +
      '<section class="panel stack"><div class="section-head"><h2>Execução semanal</h2><span class="muted">dias feitos ÷ 7</span></div>' +
      '<div class="chart chart-wrap">' + svg + "</div>" +
      '<p class="muted" style="font-size:var(--step--1)">Semanas com 85% ou mais (6 de 7 dias) mantêm o ritmo das 12 semanas. Abaixo disso, a semana seguinte começa com lacunas.</p></section>' +
      '<section class="panel stack"><div class="section-head"><h2>Calendário de 84 dias</h2><span class="muted">semanas × dias</span></div>' +
      '<div class="heat" role="img" aria-label="Minutos de estudo por dia nas 12 semanas">' + heat + "</div>" +
      '<div class="legend"><span>Nada</span><i style="background:var(--heat-0)"></i><i style="background:var(--heat-1)"></i><i style="background:var(--heat-2)"></i><i style="background:var(--heat-3)"></i><span>Meta de ' + goal + " min batida</span></div></section>" +
      (cpRows.length ? '<section class="panel stack"><div class="section-head"><h2>Checkpoints</h2></div><div class="chart-wrap"><table class="checkpoint-table"><thead><tr><th>Semana</th><th class="num">Acertos</th><th class="num">Execução</th><th>Meta</th></tr></thead><tbody>' + cpRows.join("") + "</tbody></table></div></section>" : "") +
      '<section class="panel"><div class="section-head"><h2>Diário de escrita</h2><span class="muted num">' + plural(st.journal.length, "texto", "textos") + "</span></div>" +
      (journal || '<p class="muted">Os textos que você escreve nas lições aparecem aqui. Relê-los daqui a algumas semanas mostra o quanto você evoluiu.</p>') + "</section>" +
      "</div>"
    );
  }

  /* ───────── Método ───────── */
  function viewMetodo() {
    const pillars = [
      ["headphones", "Input compreensível", "Você ouve e lê frases reais, um pouco acima do seu nível, com tradução ao lado. Entender vem antes de falar."],
      ["repeat", "Repetição espaçada", "As palavras voltam em 1, 2, 4, 8 e 16 dias (sistema de Leitner). Você revisa pouco antes de esquecer, que é quando a memória fixa."],
      ["mic", "Shadowing", "Ouvir e repetir junto, imitando ritmo e entonação. Treina pronúncia e listening ao mesmo tempo, sem precisar de parceiro."],
      ["zap", "Recordação ativa", "Exercícios curtos em que você precisa lembrar a resposta, não só reconhecê-la. Errar aqui faz parte do aprendizado."],
      ["pencil", "Produção diária", "Todo dia você escreve frases sobre a sua vida. Usar a língua para falar de você é o que transforma vocabulário em fluência."],
      ["target", "Execução em 12 semanas", "Uma semana vale como um mês: meta clara, placar semanal e revisão aos domingos. A meta é executar 85% do plano, não 100%."]
    ];
    const flow = [
      ["Aquecimento", "revisão dos cartões que venceram", "2–4 min"],
      ["Gramática", "a estrutura da semana, com exemplos em áudio", "2 min"],
      ["Palavras novas", "4 palavras com exemplo e pronúncia", "3 min"],
      ["Prática", "4 exercícios de vocabulário e gramática", "3 min"],
      ["Shadowing", "2 frases: ouvir, repetir 3 vezes, testar pronúncia", "3 min"],
      ["Escrita", "um texto curto sobre a sua vida, salvo no diário", "3–5 min"]
    ];
    return (
      '<div class="stack-lg"><header class="stack"><p class="eyebrow">Como funciona</p><h1>O método das 12 semanas</h1>' +
      '<div class="prose"><p>O programa junta seis práticas com boa base em pesquisa de aquisição de linguagem e organiza tudo em ciclos curtos de execução. Você não precisa decidir o que estudar: abra o app, faça a próxima lição e revise os cartões.</p></div></header>' +
      '<div class="pillars">' + pillars.map((p) => '<article class="pillar"><div class="pillar-head"><span class="ico">' + icon(p[0], "icon-sm") + "</span><h3>" + p[1] + "</h3></div><p>" + p[2] + "</p></article>").join("") + "</div>" +
      '<section class="panel stack"><div class="section-head"><h2>Uma lição (dias 1 a 5)</h2><span class="muted">15–20 min</span></div><ol class="flow">' +
      flow.map((f) => "<li><span><b>" + f[0] + "</b><br><small>" + f[1] + '</small></span><small class="num">' + f[2] + "</small></li>").join("") + "</ol></section>" +
      '<section class="panel stack"><div class="section-head"><h2>O ritmo da semana</h2></div><ol class="flow">' +
      "<li><span><b>Dias 1 a 5 · Lições</b><br><small>20 palavras novas, 1 ponto de gramática, 10 frases de shadowing e 5 textos.</small></span><small>15–20 min</small></li>" +
      "<li><span><b>Dia 6 · Imersão</b><br><small>Maratona de shadowing com as 10 frases da semana, 3 missões no mundo real e a missão da semana.</small></span><small>20–30 min</small></li>" +
      "<li><span><b>Dia 7 · Revisão semanal</b><br><small>Checkpoint de 10 questões, autoavaliação da meta, placar de execução e reflexão para ajustar a próxima semana.</small></span><small>10–15 min</small></li>" +
      "</ol></section>" +
      '<section class="stack"><h2>Três fases</h2>' +
      C.phases.map((p) => '<div class="panel"><p class="eyebrow">Semanas ' + p.weeks[0] + "–" + p.weeks[1] + " · nível " + p.cefr + "</p><h3>" + esc(p.name) + '</h3><p class="muted">' + esc(p.text) + "</p></div>").join("") +
      '<p class="muted" style="font-size:var(--step--1)">Os níveis seguem o Quadro Europeu Comum (CEFR): A1 iniciante, A2 básico, B1 independente.</p></section>' +
      '<section class="panel stack"><h2>Regra dos 85%</h2><div class="prose">' +
      "<p>Seu placar semanal é a porcentagem dos 7 dias que você completou. Fazer 6 de 7 dias (86%) já mantém o progresso: quem executa com constância chega ao fim das 12 semanas.</p>" +
      "<p>Ficou abaixo? Use a reflexão do Dia 7 para descobrir o que atrapalhou (horário, cansaço, dias corridos) e ajuste. Atrasos não zeram nada: a próxima lição continua de onde você parou.</p></div></section>" +
      '<section class="panel stack"><h2>Dicas para render mais</h2><ul class="prose" style="padding-left:1.2em;margin:0">' +
      "<li>Estude sempre no mesmo horário e lugar. Hábito vence força de vontade.</li>" +
      "<li>Fale em voz alta no shadowing, mesmo baixinho. Pensar a frase não treina a boca.</li>" +
      "<li>Faça as revisões antes da lição nova. Revisar custa minutos; reaprender custa dias.</li>" +
      "<li>Escreva sobre a sua vida real. Frases que importam para você ficam na memória.</li>" +
      "<li>Use o Treino livre em filas de espera e no transporte.</li></ul></section>" +
      "</div>"
    );
  }

  /* ───────── Ajustes ───────── */
  function viewAjustes() {
    const st = S.state;
    const p = st.profile;
    const s = st.settings;
    const voices = SP.voices;
    const seg = (name, val, opts) => '<div class="segmented" role="group" data-setting="' + name + '">' +
      opts.map((o) => '<button type="button" data-value="' + o[0] + '" aria-pressed="' + (String(val) === String(o[0])) + '">' + o[1] + "</button>").join("") + "</div>";
    return (
      '<div class="stack-lg"><header class="stack"><p class="eyebrow">Preferências</p><h1>Ajustes</h1></header>' +
      '<section class="panel stack"><h2>Perfil</h2>' +
      '<div class="field"><label for="set-name">Nome</label><input class="input" id="set-name" data-input="name" value="' + esc(p.name) + '" maxlength="40"></div>' +
      '<div class="field"><span class="label">Meta diária</span>' + seg("goalMin", p.goalMin, [[15, "15 min"], [25, "25 min"], [40, "40 min"]]) + "</div>" +
      '<div class="field"><label for="set-start">Data de início do programa</label><input class="input" type="date" id="set-start" data-input="start" value="' + esc(p.startDate) + '"></div></section>' +
      '<section class="panel stack"><h2>Áudio</h2>' +
      (SP.hasTTS ? "" : '<p class="pill warn">Este navegador não tem voz sintetizada. Tente o Chrome, Edge ou Safari.</p>') +
      '<div class="field"><span class="label">Velocidade da voz</span>' + seg("rate", s.rate, [[0.75, "Devagar"], [0.95, "Normal"], [1.1, "Rápida"]]) + "</div>" +
      '<div class="field"><label for="set-voice">Voz em inglês</label><select class="select" id="set-voice" data-input="voice"><option value="">Automática (inglês americano)</option>' +
      voices.map((v) => '<option value="' + esc(v.voiceURI) + '"' + (v.voiceURI === s.voiceURI ? " selected" : "") + ">" + esc(v.name) + " · " + esc(v.lang) + "</option>").join("") + "</select></div>" +
      '<label class="checkbox"><input type="checkbox" id="set-autoplay" data-input="autoplay"' + (s.autoplay ? " checked" : "") + "><span>Tocar o áudio das palavras automaticamente nas lições</span></label>" +
      '<div><button class="btn" data-action="speak" data-text="Hello! Nice to meet you. How are you today?">' + icon("speaker", "icon-sm") + " Testar voz</button></div></section>" +
      '<section class="panel stack"><h2>Aparência</h2><div class="field"><span class="label">Tema</span>' + seg("theme", s.theme, [["system", "Sistema"], ["light", "Claro"], ["dark", "Escuro"]]) + "</div></section>" +
      '<section class="panel stack"><h2>Backup</h2><p class="muted">Seu progresso fica neste navegador. Copie o backup para guardar ou levar a outro aparelho.</p>' +
      '<div class="row"><button class="btn" data-action="backup-copy">Copiar backup</button></div>' +
      '<div class="field"><label for="backup-box">Restaurar backup</label><textarea class="textarea" id="backup-box" placeholder="Cole aqui o texto do backup" style="min-height:90px;font-size:var(--step--1)"></textarea></div>' +
      '<div><button class="btn" data-action="backup-restore">Restaurar</button></div></section>' +
      '<section class="panel stack"><h2>Recomeçar</h2><p class="muted">Apaga lições, cartões, diário e estatísticas deste aparelho.</p><div><button class="btn btn-danger" data-action="reset">Apagar tudo e recomeçar</button></div></section>' +
      "</div>"
    );
  }

  const VIEWS = { hoje: viewHoje, plano: viewPlano, revisar: viewRevisar, progresso: viewProgresso, metodo: viewMetodo, ajustes: viewAjustes };

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

  function vocabQuestion(kind, v, pool, extra) {
    if (kind === "listen" && !SP.hasTTS) kind = "reverse";
    if (kind === "meaning") return makeChoice("O que significa “" + v[0] + "”?", v[1], distractors(pool, v, 1, 2), Object.assign({ e: v[0] + " = " + v[1], say: v[0], label: "Vocabulário" }, extra));
    if (kind === "reverse") return makeChoice("Como se diz “" + v[1] + "” em inglês?", v[0], distractors(pool, v, 0, 2), Object.assign({ e: v[0] + " = " + v[1], say: v[0], label: "Vocabulário" }, extra));
    return makeChoice("Ouça e escolha o que você escutou.", v[0], distractors(pool, v, 0, 2), Object.assign({ listen: v[0], e: v[0] + " = " + v[1], label: "Escuta" }, extra));
  }

  function grammarStep(ex, extra) {
    if (ex.order) return Object.assign({ type: "order", order: ex.order, pt: ex.pt, label: "Monte a frase" }, extra);
    const correct = ex.o[ex.a];
    const wrongs = ex.o.filter((_, i) => i !== ex.a);
    const filled = ex.q.includes("___") && isEnglish(ex.q) ? ex.q.replace("___", correct) : null;
    return makeChoice(ex.q, correct, wrongs, Object.assign({ e: ex.e, say: filled, label: "Gramática" }, extra));
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
      steps.push({ type: "write", p: "Missão da semana: " + wk.goal, s: [], min: 10, long: true, label: "Missão · Semana " + w });
    } else {
      const v = shuffle(pool);
      const exs = shuffle(wk.days.flatMap((x) => x.ex));
      const choices = exs.filter((e) => !e.order).slice(0, 3);
      const order = exs.find((e) => e.order);
      const qs = [
        vocabQuestion("meaning", v[0], pool), vocabQuestion("meaning", v[1], pool), vocabQuestion("meaning", v[2], pool),
        vocabQuestion("reverse", v[3], pool), vocabQuestion("reverse", v[4], pool), vocabQuestion("listen", v[5], pool)
      ].concat(choices.map((e) => grammarStep(e)));
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
    let ids = free ? shuffle(Object.keys(S.state.cards)).slice(0, 10) : S.dueIds(40);
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
      '<div class="player-head"><button class="icon-btn" data-action="player-close" aria-label="Fechar">' + icon("x") + "</button>" +
      '<div class="player-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-label="Progresso"><span></span></div><span class="player-step num"></span></div>' +
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
      const ok = await confirmModal({ title: "Sair da lição?", text: "O que você fez nesta lição não será salvo. As revisões de cartões já feitas continuam valendo.", ok: "Sair", cancel: "Continuar lição", danger: true });
      if (!ok) return;
    }
    closePlayer();
  }

  function closePlayer() {
    SP.stop();
    const el = $("#player");
    if (el) el.remove();
    document.body.style.overflow = "";
    const wasSession = P;
    P = null;
    render();
    if (wasSession) window.scrollTo(0, 0);
  }

  const body = () => $("#player .player-inner");
  function setFoot(html, cls) {
    const f = $("#player .player-foot");
    f.className = "player-foot" + (cls ? " " + cls : "");
    $(".player-foot-inner", f).innerHTML = html;
  }
  function primary(label, opts) {
    opts = opts || {};
    const btn = '<button class="btn btn-primary btn-lg" data-action="' + (opts.action || "next") + '" data-primary' + (opts.disabled ? " disabled" : "") + ">" + label + "</button>";
    if (opts.ghost) return '<div class="foot-row"><button class="btn btn-ghost" data-action="' + opts.ghost[0] + '">' + opts.ghost[1] + "</button>" + btn + "</div>";
    return '<div class="foot-row">' + btn + "</div>";
  }
  function speakBtn(text, cls, label) {
    return '<button class="speak ' + (cls || "") + '" data-action="speak" data-text="' + esc(text) + '" aria-label="' + esc(label || "Ouvir") + '">' + icon("speaker", cls === "lg" ? "" : "icon-sm") + "</button>";
  }
  function kicker(...pills) { return '<div class="step-kicker">' + pills.join("") + "</div>"; }
  const pill = (t, cls) => '<span class="pill ' + (cls || "") + '">' + t + "</span>";

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
    $("#player .player-step").textContent = step.type === "finish" ? "" : (P.i + 1) + "/" + last;
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
      if (warm) rows.push(["repeat", "Aquecimento", plural(warm, "cartão vencido", "cartões vencidos"), "2–4 min"]);
      if (kind === "lesson") {
        const day = wk.days[d - 1];
        rows = rows.concat([
          ["layers", "Gramática", wk.grammar.title, "2 min"],
          ["word", "4 palavras novas", day.vocab.map((v) => v[0]).join(", "), "3 min"],
          ["zap", "Prática", "4 exercícios", "3 min"],
          ["mic", "Shadowing", "2 frases para ouvir e repetir", "3 min"],
          ["pencil", "Escrita", day.write.p, "4 min"]
        ]);
      } else if (kind === "immersion") {
        rows = rows.concat([
          ["mic", "Maratona de shadowing", "as 10 frases da semana", "8 min"],
          ["globe", "Missões de imersão", "3 tarefas no mundo real", "15 min"],
          ["target", "Missão da semana", wk.goal, "5 min"]
        ]);
      } else {
        rows = [
          ["zap", "Checkpoint", "10 questões sobre a semana", "6 min"],
          ["target", "Autoavaliação", "você consegue cumprir a meta da semana?", "2 min"],
          ["chart", "Placar e reflexão", "execução, o que funcionou e o que ajustar", "4 min"]
        ];
      }
      el.innerHTML =
        kicker(pill("Semana " + w + " · Dia " + d, "accent"), pill(kindLabel(kind)), pill(wk.cefr)) +
        '<h1 class="step-title">' + esc(S.dayTitle(w, d)) + "</h1>" +
        '<p class="step-lead">' + (kind === "lesson" ? "Tema da semana: " + esc(wk.title) + ' · <i lang="en">' + esc(wk.en) + "</i>" : kind === "immersion" ? "Hoje é dia de usar o inglês fora do app." : "Hora de medir a semana e ajustar a próxima.") + "</p>" +
        '<ul class="intro-list">' + rows.map((r) => '<li><span class="ico">' + icon(r[0], "icon-sm") + "</span><span><b>" + r[1] + "</b><small>" + esc(r[2]) + '</small></span><small class="muted num">' + r[3] + "</small></li>").join("") + "</ul>";
      setFoot(primary("Começar"));
    },

    card(step, el) {
      const c = S.cardContent(step.id);
      const card = S.state.cards[step.id];
      if (!c || !card) { next(); return; }
      const reviewIdx = P.steps.slice(0, P.i + 1).filter((s) => s.type === "card").length;
      const totalCards = P.steps.filter((s) => s.type === "card").length;
      el.innerHTML =
        kicker(pill(step.warm ? "Aquecimento" : P.free ? "Treino livre" : "Revisão", "accent"), pill("Cartão " + reviewIdx + " de " + totalCards), pill("Caixa " + card.box)) +
        '<div class="flash"><div class="word-en" lang="en">' + esc(c.en) + "</div>" + speakBtn(c.en, "lg", "Ouvir " + c.en) +
        '<div class="answer" id="flash-answer" hidden><p class="word-pt">' + esc(c.pt) + '</p><p lang="en"><b>' + esc(c.ex) + '</b></p><p class="muted">' + esc(c.exPt) + "</p></div></div>" +
        '<p class="muted" id="flash-hint">Tente lembrar o significado antes de virar o cartão.</p>';
      setFoot(primary("Mostrar resposta", { action: "reveal" }));
      autoSpeak(c.en);
    },

    grammar(step, el) {
      const g = P.wk.grammar;
      const exList = '<div class="ex-list">' + g.examples.map((x) => '<div class="ex-item">' + speakBtn(x[0], "", "Ouvir exemplo") + '<div><p lang="en">' + esc(x[0]) + "</p><p>" + esc(x[1]) + "</p></div></div>").join("") + "</div>";
      const rules = "<ol>" + g.body.map((b) => "<li>" + esc(b) + "</li>").join("") + "</ol>";
      if (step.full) {
        el.innerHTML = kicker(pill("Gramática da semana", "accent")) + '<h1 class="step-title">' + esc(g.title) + "</h1>" +
          '<div class="grammar-card">' + rules + "</div><h3>Exemplos</h3>" + exList;
      } else {
        el.innerHTML = kicker(pill("Lembrete de gramática", "accent")) + '<h1 class="step-title">' + esc(g.title) + "</h1>" + exList +
          '<details class="grammar-card"><summary><b>Ver a explicação completa</b></summary>' + rules + "</details>";
      }
      setFoot(primary("Entendi"));
    },

    word(step, el) {
      const v = step.v;
      el.innerHTML =
        kicker(pill("Palavra nova " + (step.i + 1) + " de 4", "accent")) +
        '<div class="word-card"><div class="spread" style="align-items:flex-start;flex-wrap:nowrap"><div style="min-width:0"><div class="word-en" lang="en"><span class="mark">' + esc(v[0]) + '</span></div><p class="word-pt">' + esc(v[1]) + "</p></div>" + speakBtn(v[0], "lg", "Ouvir " + v[0]) + "</div>" +
        '<div class="example">' + speakBtn(v[2], "", "Ouvir exemplo") + '<div class="example-text"><p lang="en">' + esc(v[2]) + "</p><p>" + esc(v[3]) + "</p></div></div></div>" +
        '<p class="muted">Ouça, repita em voz alta e pense numa frase sua com essa palavra.</p>';
      setFoot(primary("Continuar"));
      autoSpeak(v[0]);
    },

    choice(step, el) {
      const label = step.cp ? pill("Checkpoint " + step.cp + " de " + step.cpTotal, "accent") : pill(step.label || "Prática", "accent");
      const q = esc(step.q).replace("___", '<span class="blank" aria-label="lacuna"></span>');
      el.innerHTML = kicker(label) +
        (step.listen ? '<div class="row">' + speakBtn(step.listen, "lg", "Ouvir de novo") + '<button class="btn btn-sm" data-action="speak" data-text="' + esc(step.listen) + '" data-rate="0.7">Mais devagar</button></div>' : "") +
        '<h2 class="question">' + q + "</h2>" +
        '<div class="options" role="group" aria-label="Opções">' + step.o.map((o, i) => '<button class="opt" data-action="choose" data-i="' + i + '"><span class="key">' + (i + 1) + "</span><span" + (isEnglish(o) ? ' lang="en"' : "") + ">" + esc(o) + "</span></button>").join("") + "</div>";
      setFoot('<p class="muted" style="text-align:center">Toque na resposta certa' + (step.listen ? " depois de ouvir" : "") + ".</p>");
      if (step.listen) setTimeout(() => SP.speak(step.listen), 300);
    },

    order(step, el) {
      if (!step.tiles) {
        const words = step.order.replace(/[.,?!]/g, "").split(" ");
        step.tiles = words.map((w, i) => (i === 0 && w !== "I" ? w.toLowerCase() : w));
        let idx = shuffle(step.tiles.map((_, i) => i));
        if (idx.every((v, i) => v === i) && idx.length > 1) idx = idx.slice(1).concat(idx[0]);
        step.shuffled = idx;
        step.picked = [];
      }
      el.innerHTML = kicker(pill(step.cp ? "Checkpoint " + step.cp + " de " + step.cpTotal : "Monte a frase", "accent")) +
        '<h2 class="question">' + esc(step.pt) + "</h2>" +
        '<p class="muted">Toque nas palavras na ordem certa.</p>' +
        '<div class="answer-line" id="answer-line" aria-label="Sua frase" lang="en"></div>' +
        '<div class="tiles" id="tiles" lang="en"></div>';
      drawTiles(step);
    },

    shadow(step, el) {
      step.reps = step.reps || 0;
      el.innerHTML = kicker(pill("Shadowing " + step.k + " de " + step.n, "accent")) +
        '<p class="step-lead">Ouça e repita junto, imitando o ritmo e a entonação. Faça três vezes, em voz alta.</p>' +
        '<div class="shadow-card"><p class="shadow-text" lang="en">' + esc(step.en) + '</p><p class="shadow-pt">' + esc(step.pt) + "</p>" +
        '<div class="shadow-controls"><button class="btn btn-primary" data-action="speak" data-text="' + esc(step.en) + '">' + icon("speaker", "icon-sm") + " Ouvir</button>" +
        '<button class="btn" data-action="speak" data-text="' + esc(step.en) + '" data-rate="0.7">Devagar</button>' +
        (SP.hasMic ? '<button class="btn" data-action="mic">' + icon("mic", "icon-sm") + " Testar pronúncia</button>" : "") + "</div>" +
        '<div class="mic-result" id="mic-result" hidden></div></div>' +
        '<div class="reps"><button class="btn" data-action="rep">' + icon("check", "icon-sm") + ' Repeti em voz alta</button><div class="rep-dots" aria-live="polite">' + [0, 1, 2].map((i) => '<span class="' + (i < step.reps ? "on" : "") + '"></span>').join("") + "</div></div>";
      shadowFoot(step);
      autoSpeak(step.en);
    },

    write(step, el) {
      step.text = step.text || "";
      el.innerHTML = kicker(pill(step.long ? "Missão da semana" : "Escrita", "accent")) +
        '<h1 class="step-title">' + esc(step.p) + "</h1>" +
        '<p class="muted">Escreva em inglês' + (step.long ? ", pelo menos 10 palavras" : "") + ". Errar faz parte: o objetivo é usar o que você aprendeu.</p>" +
        (step.s.length ? '<div class="starters">' + step.s.map((s) => '<button class="starter" data-action="starter" data-text="' + esc(s) + '" lang="en">' + esc(s) + "</button>").join("") + "</div>" : "") +
        '<label class="sr-only" for="write-box">Seu texto em inglês</label>' +
        '<textarea class="textarea" id="write-box" data-input="write" lang="en" spellcheck="true" autocapitalize="sentences" placeholder="Write here...">' + esc(step.text) + "</textarea>" +
        '<div class="spread"><button class="btn btn-sm btn-ghost" data-action="speak-write">' + icon("speaker", "icon-sm") + ' Ouvir meu texto</button><span class="word-count"><span id="wc" class="num">' + wordCount(step.text) + "</span> palavras</span></div>";
      writeFoot(step);
    },

    marathon(step, el) {
      el.innerHTML = kicker(pill("Maratona de shadowing", "accent")) +
        '<h1 class="step-title">As 10 frases da semana</h1><p class="step-lead">Ouça cada frase e repita junto, em voz alta. Marque as que você repetiu.</p>' +
        '<ul class="marathon">' + step.list.map((s, i) =>
          "<li>" + speakBtn(s[0], "", "Ouvir frase") + '<div><p lang="en">' + esc(s[0]) + "</p><p>" + esc(s[1]) + '</p></div><input class="check-sm" type="checkbox" data-input="marathon" data-i="' + i + '" aria-label="Repeti esta frase"' + (step.checked[i] ? " checked" : "") + "></li>").join("") + "</ul>";
      marathonFoot(step);
    },

    tasks(step, el) {
      const key = "w" + P.w;
      const st = S.state.immersion[key] || [];
      el.innerHTML = kicker(pill("Missões de imersão", "accent")) +
        '<h1 class="step-title">Use o inglês no mundo real</h1><p class="step-lead">Faça hoje o que conseguir. Marque o que concluir; dá para voltar e marcar depois pelo Plano.</p>' +
        '<div class="stack">' + P.wk.immersion.map((t, i) => '<label class="checkbox"><input type="checkbox" data-input="task" data-i="' + i + '"' + (st[i] ? " checked" : "") + "><span>" + esc(t) + "</span></label>").join("") + "</div>";
      setFoot(primary("Continuar"));
    },

    score(step, el) {
      const pct = P.total ? Math.round((P.correct / P.total) * 100) : 0;
      const msg = pct >= 80 ? "Excelente. Você domina o conteúdo da semana." : pct >= 60 ? "Bom resultado. Os cartões que você errou vão voltar mais vezes na revisão." : "Vale reforçar antes de seguir. Refaça as lições da semana com mais calma.";
      el.innerHTML = kicker(pill("Checkpoint", "accent")) +
        '<h1 class="step-title">Você acertou <span class="mark num">' + P.correct + " de " + P.total + "</span></h1>" +
        '<p class="step-lead">' + msg + "</p>" +
        (P.missed.length ? '<div class="panel stack"><h3>Para revisar</h3>' + P.missed.map((m) => '<div class="ex-item"><div><p>' + esc(m.q) + '</p><p>Resposta: <b lang="en">' + esc(m.a) + "</b></p></div></div>").join("") + "</div>" : "");
      setFoot(primary("Continuar"));
    },

    selfcheck(step, el) {
      el.innerHTML = kicker(pill("Meta da semana", "accent")) +
        '<h1 class="step-title">' + esc(P.wk.goal) + "</h1>" +
        '<p class="step-lead">Teste agora: fale em voz alta por 1 minuto, sem ler. Depois responda com sinceridade.</p>' +
        '<div class="options">' + [["yes", "Sim, com confiança"], ["almost", "Quase lá, travei em algumas partes"], ["no", "Ainda não"]].map((o) =>
          '<button class="opt" data-action="selfcheck" data-v="' + o[0] + '" aria-pressed="' + (P.selfcheck === o[0]) + '"' + (P.selfcheck === o[0] ? ' style="border-color:var(--accent)"' : "") + "><span>" + o[1] + "</span></button>").join("") + "</div>";
      setFoot(primary("Continuar", { disabled: !P.selfcheck }));
    },

    reflect(step, el) {
      const done = S.weekDone(P.w) + (S.isDone(P.id) ? 0 : 1);
      const pct = Math.round((done / 7) * 100);
      el.innerHTML = kicker(pill("Placar da semana " + P.w, "accent")) +
        '<h1 class="step-title">Execução: <span class="num">' + pct + "%</span></h1>" +
        '<div class="score-line">' + execBar(pct) + '<b class="num">' + done + "/7</b></div>" +
        '<p class="step-lead">' + (pct >= 85 ? "Meta de 85% batida. É esse ritmo que leva você até a Semana 12." : "Abaixo da meta de 85%. Sem problema: use as perguntas abaixo para ajustar a próxima semana.") + "</p>" +
        '<div class="field"><label for="ref-worked">O que funcionou nesta semana?</label><textarea class="textarea" id="ref-worked" data-input="worked" style="min-height:90px">' + esc(P.worked || "") + "</textarea></div>" +
        '<div class="field"><label for="ref-change">O que você vai ajustar na próxima?</label><textarea class="textarea" id="ref-change" data-input="change" style="min-height:90px">' + esc(P.change || "") + "</textarea></div>";
      setFoot(primary("Concluir semana"));
    },

    finish(step, el) {
      const t = S.totals();
      let title, lead;
      if (P.mode === "review") {
        title = P.free ? "Treino concluído" : "Revisão concluída";
        lead = P.free ? "O treino livre não muda as caixas. Volte amanhã para a revisão programada." : "Os cartões foram reprogramados. Amanhã: " + plural(S.dueTomorrow(), "cartão", "cartões") + ".";
      } else if (P.kind === "review") {
        title = "Semana " + P.w + " concluída";
        lead = P.w < S.WEEKS ? "Próxima: Semana " + (P.w + 1) + " · " + S.week(P.w + 1).title + "." : "Você terminou as 12 semanas. Parabéns pela constância.";
      } else {
        title = P.kind === "immersion" ? "Imersão concluída" : "Lição concluída";
        lead = "Sequência: " + plural(S.streak(), "dia", "dias") + ". " + (P.kind === "lesson" ? "As 4 palavras novas voltam amanhã na revisão." : "");
      }
      const stats = P.mode === "review"
        ? [[P.reviewed, "cartões"], [P.easy, "de primeira"], [P.minutes, "min"]]
        : P.kind === "lesson" ? [[4, "palavras novas"], [P.correct + "/" + P.total, "acertos"], [P.minutes, "min"]]
          : P.kind === "review" ? [[P.correct + "/" + P.total, "checkpoint"], [S.execution(P.w) + "%", "execução"], [t.words, "palavras no total"]]
            : [[(P.steps.find((s) => s.type === "marathon").checked.filter(Boolean).length), "frases repetidas"], [P.writes.length ? wordCount(P.writes[0].text) : 0, "palavras escritas"], [P.minutes, "min"]];
      el.innerHTML = '<div class="stack finish"><div class="finish-badge">' + icon("check") + "</div>" +
        '<h1 class="step-title">' + esc(title) + '</h1><p class="step-lead">' + esc(lead) + "</p>" +
        '<div class="finish-stats">' + stats.map((s) => '<div><b class="num">' + s[0] + "</b><small>" + s[1] + "</small></div>").join("") + "</div></div>";
      const nid = S.nextId();
      setFoot(primary("Voltar para Hoje", { action: "player-done", ghost: P.mode === "session" && nid ? ["next-lesson", "Próxima lição"] : null }));
    }
  };

  /* Pés de página dos passos com estado */
  function shadowFoot(step) {
    setFoot(primary("Continuar", { disabled: step.reps < 3, ghost: ["skip", "Agora não posso falar"] }));
  }
  function writeFoot(step) {
    const ok = wordCount(step.text) >= step.min;
    setFoot(primary("Salvar e continuar", { disabled: !ok, ghost: ["skip", "Pular"] }));
  }
  function marathonFoot(step) {
    const n = step.checked.filter(Boolean).length;
    setFoot('<p class="muted" style="text-align:center"><span class="num">' + n + "</span> de " + step.list.length + " repetidas · mínimo 5</p>" + primary("Continuar", { disabled: n < 5 }));
  }

  function drawTiles(step) {
    const line = $("#answer-line");
    const tiles = $("#tiles");
    if (!line || !tiles) return;
    line.innerHTML = step.picked.map((ti, pos) => '<button class="tile-word" data-action="unpick" data-pos="' + pos + '">' + esc(step.tiles[ti]) + "</button>").join("");
    tiles.innerHTML = step.shuffled.map((ti) => '<button class="tile-word' + (step.picked.includes(ti) ? " used" : "") + '" data-action="pick" data-t="' + ti + '"' + (step.picked.includes(ti) ? ' tabindex="-1" aria-hidden="true"' : "") + ">" + esc(step.tiles[ti]) + "</button>").join("");
    if (!step.answered) setFoot(primary("Verificar", { action: "check-order", disabled: step.picked.length !== step.tiles.length, ghost: step.picked.length ? ["clear-order", "Limpar"] : null }));
  }

  function answer(step, ok, shownAnswer) {
    P.total += 1;
    if (ok) P.correct += 1;
    else P.missed.push({ q: step.type === "order" ? step.pt : step.q, a: shownAnswer });
    const praise = ["Correto!", "Isso mesmo!", "Muito bem!", "Perfeito!"];
    const title = ok ? praise[Math.floor(Math.random() * praise.length)] : "Resposta certa: " + shownAnswer;
    const text = step.e && (!ok || step.type === "choice") ? step.e : "";
    setFoot('<div class="feedback-title">' + icon(ok ? "check" : "x") + " <span>" + esc(title) + "</span></div>" + (text ? '<p class="feedback-text">' + esc(text) + "</p>" : "") +
      '<div class="foot-row"><button class="btn ' + (ok ? "btn-good" : "btn-bad") + ' btn-lg btn-block" data-action="next" data-primary>Continuar</button></div>', ok ? "good" : "bad");
    const say = step.type === "order" ? step.order : step.say || step.listen;
    if (say && SP.hasTTS) setTimeout(() => SP.speak(say), 150);
    const btn = $("#player [data-primary]");
    if (btn) btn.focus({ preventScroll: true });
  }

  /* ───────── Concluir sessão ───────── */
  function completeSession() {
    P.minutes = clamp(Math.round((Date.now() - P.startedAt) / 60000), 1, 60);
    const st = S.state;
    if (P.mode === "review") {
      S.logActivity({ min: P.minutes, reviews: P.reviewed });
    } else {
      st.lessons[P.id] = { at: S.today(), correct: P.correct, total: P.total, minutes: P.minutes };
      if (P.kind === "lesson") S.addCards(P.wk.days[P.d - 1].vocab.map((_, i) => S.cardId(P.w, P.d, i)));
      if (P.kind === "review") {
        st.checkpoints["w" + P.w] = { score: P.correct, total: P.total, at: S.today(), selfcheck: P.selfcheck, worked: P.worked || "", change: P.change || "" };
      }
      P.writes.forEach((w) => st.journal.push({ id: Date.now() + Math.random(), lesson: P.id, date: S.today(), prompt: w.prompt, text: w.text, label: w.label }));
      S.logActivity({ min: P.minutes, lessons: 1, reviews: P.reviewed });
    }
    S.save();
  }

  /* ═══════════════════════ EVENTOS ═══════════════════════ */

  const ACTIONS = {
    start(el) { openPlayer(buildSession(el.dataset.id)); },
    review() { if (S.dueIds().length) openPlayer(buildReview(false)); else toast("Nenhum cartão para revisar agora."); },
    practice() { openPlayer(buildReview(true)); },
    "player-close"() { requestClose(); },
    "player-done"() { closePlayer(); location.hash = "hoje"; },
    "next-lesson"() { const nid = S.nextId(); closePlayer(); if (nid) openPlayer(buildSession(nid)); },
    next() { next(); },
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
      const step = P.steps[P.i];
      const card = S.state.cards[step.id];
      const lab = (g) => (P.free ? "" : "<small>" + S.intervalLabel(card, g) + "</small>");
      setFoot('<div class="grade-row">' +
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
      next();
    },

    choose(el) {
      const step = P.steps[P.i];
      if (step.answered) return;
      step.answered = true;
      const i = +el.dataset.i;
      const ok = i === step.a;
      $$("#player .opt").forEach((b, j) => {
        b.disabled = true;
        if (j === step.a) b.classList.add("correct");
        else if (j === i) b.classList.add("wrong");
      });
      answer(step, ok, step.o[step.a]);
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
      const ok = SP.norm(built) === SP.norm(step.order);
      $$("#tiles .tile-word, #answer-line .tile-word").forEach((b) => { b.disabled = true; });
      answer(step, ok, step.order);
    },

    rep() {
      const step = P.steps[P.i];
      step.reps = Math.min(3, step.reps + 1);
      $$("#player .rep-dots span").forEach((s, i) => s.classList.toggle("on", i < step.reps));
      shadowFoot(step);
    },

    async mic(el) {
      const step = P.steps[P.i];
      const out = $("#mic-result");
      SP.stop();
      el.disabled = true;
      el.innerHTML = icon("mic", "icon-sm") + " Ouvindo…";
      out.hidden = false;
      out.textContent = "Fale a frase agora.";
      try {
        const alts = await SP.listen();
        const best = alts.map((a) => ({ a, s: SP.similarity(step.en, a) })).sort((x, y) => y.s - x.s)[0];
        const msg = best.s >= 85 ? "Excelente pronúncia!" : best.s >= 60 ? "Quase lá. Ouça de novo e repare nas palavras que faltaram." : "Tente de novo, mais devagar e articulando cada palavra.";
        out.innerHTML = 'Entendi: <span class="heard" lang="en">“' + esc(best.a) + "”</span><br><b class=\"num\">" + best.s + "%</b> das palavras reconhecidas. " + msg;
        if (best.s >= 70) { step.reps = 3; $$("#player .rep-dots span").forEach((s) => s.classList.add("on")); shadowFoot(step); }
      } catch (e) {
        out.textContent = e.message === "not-allowed" || e.message === "service-not-allowed"
          ? "Não foi possível usar o microfone aqui. Repita em voz alta e marque abaixo."
          : e.message === "no-speech" ? "Não ouvi nada. Toque de novo e fale perto do microfone." : "O reconhecimento de voz falhou. Repita em voz alta e marque abaixo.";
      }
      el.disabled = false;
      el.innerHTML = icon("mic", "icon-sm") + " Testar pronúncia";
    },

    starter(el) {
      const box = $("#write-box");
      const step = P.steps[P.i];
      const add = el.dataset.text.replace(/\.\.\.$/, " ");
      const sep = box.value && !/\s$/.test(box.value) ? (/[.!?]$/.test(box.value.trim()) ? " " : " ") : "";
      box.value = box.value + sep + add;
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
        b.setAttribute("aria-pressed", String(on));
        b.style.borderColor = on ? "var(--accent)" : "";
      });
      setFoot(primary("Continuar"));
    },

    async "backup-copy"() {
      const data = S.exportJSON();
      try {
        await navigator.clipboard.writeText(data);
        toast("Backup copiado. Cole em um lugar seguro.");
      } catch (e) {
        const box = $("#backup-box");
        box.value = data;
        box.focus();
        box.select();
        toast("Copie o texto selecionado no campo de backup.");
      }
    },
    "backup-restore"() {
      const box = $("#backup-box");
      try {
        S.importJSON(box.value.trim());
        toast("Backup restaurado.");
        $("#app").innerHTML = "";
        render();
      } catch (e) {
        toast("Texto inválido. Cole o backup completo, do primeiro { ao último }.");
      }
    },
    async reset() {
      const ok = await confirmModal({ title: "Apagar todo o progresso?", text: "Lições, cartões, diário e estatísticas deste aparelho serão apagados. Isso não pode ser desfeito.", ok: "Apagar tudo", danger: true });
      if (!ok) return;
      S.reset();
      $("#app").innerHTML = "";
      location.hash = "";
      render();
    }
  };

  // Intercepta "next" no passo de escrita e reflexão para guardar o texto.
  const baseNext = ACTIONS.next;
  ACTIONS.next = function (el) {
    const step = P && P.steps[P.i];
    if (step && step.type === "write" && wordCount(step.text || "") >= step.min) {
      P.writes = P.writes.filter((w) => w.prompt !== step.p);
      P.writes.push({ prompt: step.p, text: step.text.trim(), label: step.label });
    }
    if (step && step.type === "tasks") {
      S.state.immersion["w" + P.w] = $$("#player [data-input='task']").map((c) => c.checked);
      S.save();
    }
    baseNext(el);
  };

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el || el.disabled) return;
    const fn = ACTIONS[el.dataset.action];
    if (fn) { e.preventDefault(); fn(el, e); }
  });

  document.addEventListener("input", (e) => {
    const el = e.target;
    const kind = el.dataset && el.dataset.input;
    if (!kind) return;
    const st = S.state;
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
    if (kind === "name") { st.profile.name = el.value.trim(); S.save(); return; }
  });

  document.addEventListener("change", (e) => {
    const el = e.target;
    const kind = el.dataset && el.dataset.input;
    if (!kind) return;
    const st = S.state;
    if (kind === "marathon" && P) {
      const step = P.steps[P.i];
      step.checked[+el.dataset.i] = el.checked;
      marathonFoot(step);
    } else if (kind === "task" && P) {
      S.state.immersion["w" + P.w] = $$("#player [data-input='task']").map((c) => c.checked);
      S.save();
    } else if (kind === "start" && el.value) {
      st.profile.startDate = el.value; S.save(); toast("Data de início atualizada.");
    } else if (kind === "voice") {
      st.settings.voiceURI = el.value; S.save();
    } else if (kind === "autoplay") {
      st.settings.autoplay = el.checked; S.save();
    }
  });

  // Botões segmentados de Ajustes
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-setting] [data-value]");
    if (!b) return;
    const group = b.closest("[data-setting]");
    const key = group.dataset.setting;
    const raw = b.dataset.value;
    const st = S.state;
    if (key === "goalMin") st.profile.goalMin = +raw;
    else if (key === "rate") st.settings.rate = +raw;
    else if (key === "theme") { st.settings.theme = raw; applyTheme(); }
    S.save();
    $$("[data-value]", group).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    if (key === "rate" && SP.hasTTS) SP.speak("This is how I sound.");
  });

  document.addEventListener("keydown", (e) => {
    if (!P || $(".modal-backdrop")) return;
    const tag = (e.target.tagName || "").toLowerCase();
    if (e.key === "Escape") { e.preventDefault(); requestClose(); return; }
    if (tag === "textarea" || tag === "input" || tag === "select") return;
    const step = P.steps[P.i];
    if (/^[1-4]$/.test(e.key)) {
      if (step.type === "choice" && !step.answered) {
        const b = $$("#player .opt")[+e.key - 1];
        if (b) { e.preventDefault(); b.click(); }
      } else if (step.type === "card") {
        const g = $$("#player .grade")[+e.key - 1];
        if (g) { e.preventDefault(); g.click(); }
      }
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
  });

  // Vozes chegam de forma assíncrona: atualiza a lista em Ajustes.
  if (window.speechSynthesis) {
    window.speechSynthesis.addEventListener && window.speechSynthesis.addEventListener("voiceschanged", () => {
      if (!P && route().view === "ajustes" && S.state.profile) render();
    });
  }

  /* ───────── Início ───────── */
  S.save();
  render();
})();
