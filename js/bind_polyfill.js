Function.prototype.bind = Function.prototype.bind || function (target) {
  let self = this;
  return function (args) {
    if (!(args instanceof Array)) {
      args = [args];
    }
    self.apply(target, args);
  };
};
