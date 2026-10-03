// Minimal service worker — only lets Chrome install bakala as a standalone app.
// Caches nothing; every request passes straight through.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
