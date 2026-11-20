/* Raff Maff service worker: app-shell + offline lessons.
   - /_next/static: cache-first (immutable, hashed)
   - pages: network-first, fall back to the last visited copy, then /offline
   - /api: never cached (progress state is mirrored in localStorage by the app) */
const VERSION = "v1";
const STATIC = `rm-static-${VERSION}`;
const PAGES = `rm-pages-${VERSION}`;

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(PAGES).then((c) => c.addAll(["/offline", "/icons/icon-192.png"])).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => ![STATIC, PAGES].includes(k)).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(caches.open(STATIC).then(async (c) => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) c.put(req, res.clone());
      return res;
    }));
    return;
  }

  if (req.mode === "navigate" || req.headers.get("accept")?.includes("text/html") || url.searchParams.has("_rsc")) {
    event.respondWith((async () => {
      const cache = await caches.open(PAGES);
      try {
        const res = await fetch(req);
        if (res.ok && !res.redirected) cache.put(req, res.clone());
        return res;
      } catch {
        const hit = (await cache.match(req)) || (await cache.match(url.pathname));
        if (hit) return hit;
        if (req.mode === "navigate") return (await cache.match("/offline")) || new Response("Offline", { status: 503 });
        return new Response("", { status: 503 });
      }
    })());
  }
});
