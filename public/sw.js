// WishPix Teacher App Service Worker (v2)
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", () => {
  // Let the browser handle network requests directly so Next.js RSC streams,
  // dev chunks, and LAN requests never hang or fail with an undefined cache match.
});
