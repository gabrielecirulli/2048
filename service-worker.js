const CACHE_NAME = 'pwa-task-manager';

const urlsToCache = [
  '/',
  '/index.html',
  '/style/main.css',
  '/meta/apple-touch-icon.png',
  '/js/application.js',
  '/js/game_manager.js',
  '/meta/apple-touch-startup-image-640x1096.png',
  '/meta/apple-touch-startup-image-640x920.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(res => res || fetch(event.request))
  )
})
