// This code executes in its own worker or thread
const urlsToCache = [
  // TODO: specific all files
  "index.html",
  "style/main.css",
  "favicon.ico",
  "/js/animframe_polyfill.js",
  "/js/application.js",
  "/js/bind_polyfill.js",
  "/js/classlist_polyfill.js",
  "/js/game_manager.js",
  "/js/grid.js",
  "/js/html_actuator.js",
  "/js/keyboard_input_manager.js",
  "/js/local_storage_manager.js",
  "/js/progress_map.js",
  "/js/tile.js",
  "/style/fonts/Roboto-Black.woff",
  "/style/fonts/Roboto-Black.woff2",
  "/style/fonts/Roboto-Black.svg",
  "/style/fonts/Roboto-BoldItalic.woff",
  "/style/fonts/Roboto-BoldItalic.woff2",
  "/style/fonts/Roboto-BoldItalic.svg",
  "/style/fonts/Roboto-Bold.woff",
  "/style/fonts/Roboto-Bold.woff2",
  "/style/fonts/Roboto-Bold.svg",
  "/style/fonts/Roboto-BoldItalic.woff",
  "/style/fonts/Roboto-BoldItalic.woff2",
  "/style/fonts/Roboto-BoldItalic.svg",
  "/style/fonts/Roboto-Italic.woff",
  "/style/fonts/Roboto-Italic.woff2",
  "/style/fonts/Roboto-Italic.svg",
  "/style/fonts/Roboto-Light.woff",
  "/style/fonts/Roboto-Light.woff2",
  "/style/fonts/Roboto-Light.svg",
  "/style/fonts/Roboto-LightItalic.woff",
  "/style/fonts/Roboto-LightItalic.woff2",
  "/style/fonts/Roboto-LightItalic.svg",
  "/style/fonts/Roboto-Medium.woff",
  "/style/fonts/Roboto-Medium.woff2",
  "/style/fonts/Roboto-Medium.svg",
  "/style/fonts/Roboto-MediumItalic.woff",
  "/style/fonts/Roboto-MediumItalic.woff2",
  "/style/fonts/Roboto-MediumItalic.svg",
  "/style/fonts/Roboto-Regular.woff",
  "/style/fonts/Roboto-Regular.woff2",
  "/style/fonts/Roboto-Regular.svg",
  "/style/fonts/Roboto-Thin.woff",
  "/style/fonts/Roboto-Thin.woff2",
  "/style/fonts/Roboto-Thin.svg",
  "/style/fonts/Roboto-ThinItalic.woff",
  "/style/fonts/Roboto-ThinItalic.woff2",
  "/style/fonts/Roboto-ThinItalic.svg",
  "/icons/dark/01.svg",
  "/icons/dark/02.svg",
  "/icons/dark/03.svg",
  "/icons/dark/04.svg",
  "/icons/dark/05.svg",
  "/icons/dark/06.svg",
  "/icons/dark/07.svg",
  "/icons/dark/08.svg",
  "/icons/dark/09.svg",
  "/icons/dark/10.svg",
  "/icons/dark/11.svg",
  "/icons/dark/12.svg",
  "/icons/dark/13.svg",
  "/icons/dark/14.svg",
  "/icons/dark/15.svg",
  "/icons/dark/16.svg",
  "/icons/dark/17.svg",
  "/icons/dark/18.svg",
  "/icons/dark/01.svg",
  "/icons/dark/02.svg",
  "/icons/dark/03.svg",
  "/icons/dark/04.svg",
  "/icons/dark/05.svg",
  "/icons/dark/06.svg",
  "/icons/dark/07.svg",
  "/icons/dark/08.svg",
  "/icons/dark/09.svg",
  "/icons/dark/10.svg",
  "/icons/dark/11.svg",
  "/icons/dark/12.svg",
  "/icons/dark/13.svg",
  "/icons/dark/14.svg",
  "/icons/dark/15.svg",
  "/icons/dark/16.svg",
  "/icons/dark/17.svg",
  "/icons/dark/18.svg",
  "/icons/close.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(async () => {
    const cache = await caches.open("pwa-assets");
    return cache.addAll(urlsToCache);
  });
});

self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // It can update the cache to serve updated content on the next request
      return cachedResponse || fetch(event.request);
    })
  );
});
