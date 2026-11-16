/* Sincronização do progresso na nuvem.
   - No site (Vercel, GitHub Pages): Supabase. Cada aparelho tem uma chave secreta (código de
     sincronização); com o mesmo código, o progresso continua em outro aparelho.
   - No link do Claude: o banco de dados da própria página, na conta do Claude de quem estuda
     (lá a conexão com o Supabase é bloqueada).
   O progresso vai para a nuvem alguns segundos depois de cada mudança e volta ao abrir o app.
   Sem internet, tudo continua salvo no navegador. */
(function () {
  "use strict";

  const CFG = window.APP_CONFIG || {};
  const KEY_LS = "intensivo500:key";
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const MAX_DOC = 240000; // limite de um documento do banco do Claude: 256 KB
  const listeners = [];
  const inClaude = !!(window.claude && typeof window.claude.use === "function");

  let status = "idle"; // idle | saving | ok | error | offline | off
  let lastOk = null;
  let timer = null;
  let pending = false;
  let busy = false;
  let backend = null;  // { kind: "claude", ref } | { kind: "supabase" } | null
  let detecting = null;

  function newKey() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    const b = new Uint8Array(16);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(b);
    else for (let i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256);
    b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80;
    const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
    return h.slice(0, 8) + "-" + h.slice(8, 12) + "-" + h.slice(12, 16) + "-" + h.slice(16, 20) + "-" + h.slice(20);
  }
  let key = null;
  try { key = localStorage.getItem(KEY_LS); } catch (e) { /* ignora */ }
  if (!key || !UUID.test(key)) {
    key = newKey();
    try { localStorage.setItem(KEY_LS, key); } catch (e) { /* ignora */ }
  }

  function setStatus(s) { status = s; listeners.forEach((fn) => { try { fn(s); } catch (e) { /* ignora */ } }); }

  function detect() {
    if (detecting) return detecting;
    detecting = (async () => {
      if (inClaude) {
        try {
          const db = await window.claude.use("db");
          const user = db ? await window.claude.use("user") : null;
          const uid = user ? await user.id() : null;
          if (db && uid) backend = { kind: "claude", ref: db.doc("data/users/" + uid + "/progress") };
        } catch (e) { backend = null; }
        return backend;
      }
      backend = CFG.supabaseUrl && CFG.supabaseKey ? { kind: "supabase" } : null;
      return backend;
    })();
    return detecting;
  }

  /* ───────── Supabase ───────── */
  async function rpc(name, body) {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 12000);
    try {
      const payload = JSON.stringify(body);
      const res = await fetch(CFG.supabaseUrl + "/rest/v1/rpc/" + name, {
        method: "POST",
        headers: { apikey: CFG.supabaseKey, "Content-Type": "application/json" },
        body: payload,
        signal: ctl.signal,
        keepalive: name === "save_progress" && payload.length < 60000
      });
      if (!res.ok) throw new Error("http " + res.status);
      const text = await res.text();
      return text ? JSON.parse(text) : null;
    } finally {
      clearTimeout(t);
    }
  }

  /* Cabe no documento do Claude: se passar do limite, guarda só as 2 etapas em andamento mais recentes. */
  function fit(data) {
    let json = JSON.stringify(data);
    if (json.length > MAX_DOC && data.resumes) {
      const keep = Object.values(data.resumes).sort((a, b) => (b.at || 0) - (a.at || 0)).slice(0, 2);
      data = Object.assign({}, data, { resumes: Object.fromEntries(keep.map((r) => [r.id, r])) });
      json = JSON.stringify(data);
    }
    if (json.length > MAX_DOC) {
      data = Object.assign({}, data, { resumes: {} });
      json = JSON.stringify(data);
    }
    return json;
  }

  async function loadRemote() {
    if (!backend) return null;
    if (backend.kind === "claude") {
      const snap = await backend.ref.get();
      if (!snap.exists) return null;
      const d = snap.data();
      return d && typeof d.json === "string" ? JSON.parse(d.json) : null;
    }
    return rpc("load_progress", { p_key: key });
  }

  /* Retorna false quando a nuvem tem um progresso mais novo (de outro aparelho). */
  async function saveRemote(data) {
    if (!backend) return true;
    if (backend.kind === "claude") {
      const snap = await backend.ref.get();
      const remoteAt = snap.exists ? +(snap.data() || {}).savedAt || 0 : 0;
      if (remoteAt > (data.savedAt || 0)) return false;
      await backend.ref.set({ json: fit(data), savedAt: data.savedAt || Date.now() });
      return true;
    }
    const saved = await rpc("save_progress", { p_key: key, p_data: data });
    return saved !== null;
  }

  /* Traz da nuvem se lá estiver mais novo. Retorna true quando trocou o progresso local. */
  async function pull() {
    await detect();
    if (!backend) return false;
    const remote = await loadRemote();
    if (remote && typeof remote === "object" && (remote.savedAt || 0) > (window.Store.state.savedAt || 0)) {
      window.Store.replace(remote);
      return true;
    }
    return false;
  }

  async function push() {
    await detect();
    if (!backend) return;
    if (busy) { pending = true; return; }
    busy = true;
    setStatus("saving");
    try {
      const ok = await saveRemote(window.Store.snapshot());
      if (!ok && await pull() && window.Sync.onRemote) window.Sync.onRemote();
      lastOk = Date.now();
      setStatus("ok");
    } catch (e) {
      setStatus(navigator.onLine === false ? "offline" : "error");
    } finally {
      busy = false;
      if (pending) { pending = false; schedule(1500); }
    }
  }

  function schedule(ms) {
    clearTimeout(timer);
    timer = setTimeout(push, ms == null ? 2500 : ms);
  }

  async function init() {
    await detect();
    if (!backend) { setStatus("off"); return; }
    try {
      const changed = await pull();
      if (changed && window.Sync.onRemote) window.Sync.onRemote();
      if ((window.Store.state.savedAt || 0) > 0 && window.Store.state.profile) await push();
      else setStatus("ok");
    } catch (e) {
      setStatus(navigator.onLine === false ? "offline" : "error");
    }
  }

  /* Usa o código de outro aparelho (só no site, com o Supabase). */
  async function useKey(k) {
    k = (k || "").trim().toLowerCase();
    if (!UUID.test(k)) throw new Error("codigo");
    await detect();
    if (!backend || backend.kind !== "supabase") throw new Error("indisponivel");
    const remote = await rpc("load_progress", { p_key: k });
    if (!remote) throw new Error("vazio");
    key = k;
    try { localStorage.setItem(KEY_LS, key); } catch (e) { /* ignora */ }
    window.Store.replace(remote);
    lastOk = Date.now();
    setStatus("ok");
    return true;
  }

  window.addEventListener("online", () => schedule(500));
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden" && timer) { clearTimeout(timer); push(); } });

  window.Sync = {
    get key() { return key; },
    get status() { return status; },
    get lastOk() { return lastOk; },
    get kind() { return backend ? backend.kind : inClaude ? "claude-pending" : "none"; },
    get enabled() { return !!backend || (!inClaude && !!(CFG.supabaseUrl && CFG.supabaseKey)); },
    get inClaude() { return inClaude; },
    onStatus(fn) { listeners.push(fn); },
    onRemote: null,
    init, schedule, push, pull, useKey
  };
})();
