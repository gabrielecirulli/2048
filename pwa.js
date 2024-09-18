if('serviseWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope) 
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err)
      })
  })
}
