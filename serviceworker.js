const VERSION = '1';

const CACHE_URLS = [
  '/',
  '/style/main.css',
  '/js/bind_polyfill.js',
  '/js/classlist_polyfill.js',
  '/js/animframe_polyfill.js',
  '/js/keyboard_input_manager.js',
  '/js/html_actuator.js',
  '/js/grid.js',
  '/js/tile.js',
  '/js/local_storage_manager.js',
  '/js/game_manager.js',
  '/js/application.js',
];

const OPTIONAL_CACHE_URLS = [
  '/style/fonts/clear-sans.css',
  '/style/fonts/ClearSans-Regular-webfont.woff',
  '/style/fonts/ClearSans-Bold-webfont.woff'
];

function deleteOldCaches(keys) {
  return Promise.all(
    keys
      .filter(key => key !== VERSION)
      .map(key => caches.delete(key))
  )
  .catch(console.log);
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION).then(cache => {
      cache.addAll(OPTIONAL_CACHE_URLS);
      return cache.addAll(CACHE_URLS);
    })
    .catch(console.log)
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(deleteOldCaches)
  )
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
