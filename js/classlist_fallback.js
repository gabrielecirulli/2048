(function() {
  // if target doesn't have a classList property, emulate one based
  // on className concatenation operations - good enough to play
  if(document.body.classList === undefined) {
    Object.defineProperty(HTMLElement.prototype, 'classList', {get: function() {
      var self = this;
      return {
        add: function(aClass) {
          self.className += " " + aClass;
        },
        remove: function(aClass) {
          self.className = self.className.replace(aClass, '');
        }
      }
    }});
  }
})();
