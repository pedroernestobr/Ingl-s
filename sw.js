/* Cache simples para o app funcionar offline depois da primeira visita.
   Ao publicar uma versão nova, aumente o número de VERSION. */
const VERSION = "intensivo500-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/config.js",
  "./js/words.js",
  "./js/tobe.js",
  "./js/sync.js",
  "./js/store.js",
  "./js/speech.js",
  "./js/app.js",
  "./manifest.webmanifest",
  "./icons/icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Rede primeiro (para receber atualizações), cache como reserva offline. */
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  if (req.url.includes(".supabase.co/rest/")) return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok && (new URL(req.url).origin === self.location.origin || req.url.startsWith("https://fonts."))) {
          const copy = res.clone();
          caches.open(VERSION).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match("./index.html")))
  );
});
