const CACHE_NAME = 'game-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style/main.css',
  '/js/animframe_polyfill.js',
  '/js/application.js',
  '/js/bind_polyfill.js',
  '/js/classlist_polyfill.js',
  '/js/game_manager.js',
  '/js/grid.js',
  '/js/html_actuator.js',
  '/js/keyboard_input_manager.js',
  '/js/local_storage_manager.js',
  '/js/tile.js',
  '/meta/apple-touch-icon.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Eğer önbellekte varsa, önbellekten döndür
        }
        return fetch(event.request).then(
          networkResponse => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(() => {
          // Eğer hem önbellekte hem de ağda kaynak bulunamazsa, bir fallback kullan (isteğe bağlı)
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (!cacheWhitelist.includes(key)) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});
