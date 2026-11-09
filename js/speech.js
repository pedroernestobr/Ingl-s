/* Áudio com as vozes do próprio aparelho (Web Speech API).
   - Fala: speechSynthesis (funciona offline na maioria dos celulares e computadores).
   - Escuta: SpeechRecognition (Chrome, Edge e Safari recentes); se não existir, o app usa autoavaliação. */
(function () {
  "use strict";

  const synth = window.speechSynthesis || null;
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  let voices = [];

  function loadVoices() {
    if (!synth) return;
    try { voices = synth.getVoices().filter((v) => /^en[-_]/i.test(v.lang) || v.lang === "en"); } catch (e) { voices = []; }
  }
  if (synth) {
    loadVoices();
    if (typeof synth.addEventListener === "function") synth.addEventListener("voiceschanged", loadVoices);
    else synth.onvoiceschanged = loadVoices;
  }

  function pickVoice() {
    const s = window.Store.state.settings;
    if (s.voiceURI) {
      const chosen = voices.find((v) => v.voiceURI === s.voiceURI);
      if (chosen) return chosen;
    }
    const us = voices.filter((v) => /en[-_]US/i.test(v.lang));
    const pool = us.length ? us : voices;
    return pool.find((v) => /natural|premium|enhanced|google|samantha|aria|jenny/i.test(v.name)) || pool[0] || null;
  }

  function speak(text, opts) {
    return new Promise((resolve) => {
      if (!synth) return resolve(false);
      try {
        synth.cancel();
        const u = new SpeechSynthesisUtterance(text);
        const v = pickVoice();
        if (v) u.voice = v;
        u.lang = v ? v.lang : "en-US";
        u.rate = (opts && opts.rate) || window.Store.state.settings.rate || 0.95;
        u.onend = () => resolve(true);
        u.onerror = () => resolve(false);
        synth.speak(u);
        // Alguns navegadores não disparam onend; garante a resolução.
        setTimeout(() => resolve(true), Math.max(2500, text.length * 120));
      } catch (e) { resolve(false); }
    });
  }

  function stop() { try { if (synth) synth.cancel(); } catch (e) { /* ignora */ } }

  function listen() {
    return new Promise((resolve, reject) => {
      if (!Recognition) return reject(new Error("unsupported"));
      let rec;
      try { rec = new Recognition(); } catch (e) { return reject(new Error("unsupported")); }
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 3;
      let done = false;
      rec.onresult = (ev) => {
        done = true;
        const alts = Array.from(ev.results[0] || []).map((a) => a.transcript);
        resolve(alts);
      };
      rec.onerror = (ev) => { if (!done) { done = true; reject(new Error(ev.error || "error")); } };
      rec.onend = () => { if (!done) { done = true; reject(new Error("no-speech")); } };
      try { rec.start(); } catch (e) { reject(new Error("error")); }
    });
  }

  const norm = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();

  /* Percentual de palavras do alvo que apareceram no que foi reconhecido. */
  function similarity(target, heard) {
    const t = norm(target).split(" ").filter(Boolean);
    const h = norm(heard).split(" ").filter(Boolean);
    if (!t.length) return 0;
    const pool = h.slice();
    let hit = 0;
    t.forEach((w) => { const i = pool.indexOf(w); if (i >= 0) { hit += 1; pool.splice(i, 1); } });
    return Math.round((hit / t.length) * 100);
  }

  window.Speech = {
    get hasTTS() { return !!synth; },
    get hasMic() { return !!Recognition; },
    get voices() { return voices; },
    speak, stop, listen, similarity, norm
  };
})();
