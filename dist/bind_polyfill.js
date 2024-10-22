"use strict";

/* 
Polyfill: Function.prototype.bind
Compatible for:
Chrome below v7
Edge below v12
Firefox below v4
*/
Function.prototype.bind = Function.prototype.bind || function (target) {
  let self = this;
  return function (args) {
    if (!(args instanceof Array)) {
      args = [args];
    }
    self.apply(target, args);
  };
};