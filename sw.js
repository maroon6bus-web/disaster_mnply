const CACHE_NAME = 'disaster-mnply-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './main.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install event: cache assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(ASSETS);
    })
  );
});

// Fetch event: serve from cache if available, else fetch from network
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Return cached response if found
      if (response) return response;

      // Otherwise fetch from network
      return fetch(e.request).then((networkResponse) => {
        // Don't cache if not a success or not a GET request
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
          return networkResponse;
        }

        // Cache the new resource if it's from our origin or a known CDN
        const url = new URL(e.request.url);
        if (url.origin === location.origin || url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com') || url.hostname.includes('cdn.jsdelivr.net')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }

        return networkResponse;
      }).catch(() => {
        // Fallback for HTML requests
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// Activate event: cleanup old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});
