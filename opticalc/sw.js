const CACHE_NAME = "optical-calc-v1";
const urlsToCache = [
  "./index.html",
  "./manifest.json",
  "./manifesr.json",
  "./icon-192.png",
  "./icon-512.png",
  "./sw.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    }),
  );
});
