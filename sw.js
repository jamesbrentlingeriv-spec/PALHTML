const CACHE_NAME = 'pal-tools-v1';

// All files essential to the offline functionality of the app
const CACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './favicon.ico',
  './icon-192.png',
  './assets/loaders/index.gif',
  './WRITEUP.html',
  './contact.html',
  './PAL OPTICAL RECEIPT.HTML',
  './LABLENS.HTML',
  './lensavail.html',
  './PALQUOTE (1).HTML',
  './TracyFrameInventory.html',
  './opticalc.html',
  './lens-guide.html'
];

// 1. Install Event: Cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching Files');
        return cache.addAll(CACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((error) => console.error('Cache addAll failed:', error))
  );
});

// 2. Activate Event: Clean up old caches if the version name changes
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Take control of all clients immediately
  return self.clients.claim();
});

// 3. Fetch Event: Stale-While-Revalidate strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Update the cache with the fresh network response
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // If network fails, return the cached response
        return cachedResponse;
      });

      // Return cached response immediately if available, otherwise wait for network
      return cachedResponse || fetchPromise;
    })
  );
});
