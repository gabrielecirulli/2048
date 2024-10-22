"use strict";

/* 
Polyfill: requestAnimationFrame
Compatible for:
Chrome below v24 (Full Compatability)
  * Chrome below v10: Implemented with vendorkit: webkit
Edge below v12
Firefox below v23
*/

/* 
Polyfill: cancelAnimationFrame
Compatible for:
Chrome below v24
Edge below v12
Firefox below v23
*/

(function () {
  let lastTime = 0;
  let vendors = ['webkit', 'moz'];
  for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) {
      let currTime = new Date().getTime();
      let timeToCall = Math.max(0, 16 - (currTime - lastTime));
      let id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }
})();