Function.prototype.bind = Function.prototype.bind || function (target) {
  let self = this;
  return function (args:any) {
    if (!(args instanceof Array)) {
      args = [args];
    }
    self.apply(target, args);
  };
};
