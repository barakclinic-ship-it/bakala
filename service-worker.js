// bakala – same pattern as TIGER. Bump the version when files change.
// Caches only the app files, never your data.
const CACHE_NAME = 'bakala-cache-v3';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-512-maskable.png', './apple-touch-icon.png'];

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(function (cache) { return cache.addAll(ASSETS); }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

// page: network-first (always newest from GitHub), cache when offline; other files: cache-first
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  if (new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then(function (res) {
        var copy = res.clone(); caches.open(CACHE_NAME).then(function (c) { c.put('./index.html', copy); }); return res;
      }).catch(function () { return caches.match('./index.html'); })
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') { var copy = res.clone(); caches.open(CACHE_NAME).then(function (c) { c.put(event.request, copy); }); }
        return res;
      });
    })
  );
});
