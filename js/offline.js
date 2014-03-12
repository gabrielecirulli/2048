// handle offline/cache updating
if (typeof window.applicationCache !== 'undefined') {
  window.addEventListener('load', function () {
    // event handler for new cache manifest
    window.applicationCache.addEventListener('updateready', function () {
      // load new resources and reload the page to complete the experience
      window.applicationCache.swapCache();
      window.location.reload();
    });

    // check for new verion of cache manifest
    window.applicationCache.update();
  });
}