// Service worker for the offline web app / iOS home-screen app. The build copies this to <app root>/sw.js.
// Everything the game needs (UI, JS engine, model weights) is precached, so it runs with no network at all.
const CACHE_NAME = 'scopone-offline-v2';
const ASSETS = [
  './',
  'index.html',
  'static/style.css',
  'static/script.js',
  'static/config.js',
  'static/manifest.json',
  'static/offline/engine.js',
  'static/offline/ai.js',
  'static/offline/backend.js',
  'static/models/pulcino.bin',
  'static/models/volpe.bin',
  'static/models/leone.bin',
  'static/icons/icon-180.png',
  'static/icons/icon-192.png',
  'static/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// Cache first, then network (and remember whatever else the page asks for)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((hit) => hit || fetch(event.request).then((resp) => {
      if (resp && resp.status === 200 && resp.type === 'basic') {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      }
      return resp;
    }))
  );
});
