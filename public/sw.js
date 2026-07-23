const CACHE = "daigram-v1";
const CORE = ["/", "/favicon.svg", "/manifest.webmanifest"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // network-first for the page shell so deploys propagate; cache-first for hashed assets and fonts
  const cacheFirst = url.pathname.startsWith("/_astro/") || url.origin !== location.origin;
  e.respondWith(
    cacheFirst
      ? caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
          if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }
          return res;
        }))
      : fetch(e.request).then(res => {
          if (res.ok && url.origin === location.origin) {
            const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp));
          }
          return res;
        }).catch(() => caches.match(e.request).then(hit => hit || caches.match("/")))
  );
});
