function KeyboardInputManager() {
  this.events = {};

  this.listen();
}

KeyboardInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

KeyboardInputManager.prototype.listen = function () {
  var self = this;

  var map = {
    38: 0, // Up
    39: 1, // Right
    40: 2, // Down
    37: 3, // Left
    75: 0, // vim keybindings
    76: 1,
    74: 2,
    72: 3,
    87: 0, // W
    68: 1, // D
    83: 2, // S
    65: 3  // A
  };

  document.addEventListener("keydown", function (event) {
    var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
                    event.shiftKey;
    var mapped    = map[event.which];

    if (!modifiers) {
      if (mapped !== undefined) {
        event.preventDefault();
        self.emit("move", mapped);
      }

      if (event.which === 32) self.restart.bind(self)(event);
    }
  });

  var retry = document.getElementsByClassName("retry-button")[0];
  retry.addEventListener("click", this.restart.bind(this));

  // Listen to swipe events
  var touchStartClientX, touchStartClientY;
  var gameContainer = document.getElementsByClassName("game-container")[0];
  gameContainer.addEventListener("touchstart", function(event) {
    if (event.touches.length > 1) {
      return;
    }
    touchStartClientX = event.touches[0].clientX;
    touchStartClientY = event.touches[0].clientY
    event.preventDefault();
  });
  gameContainer.addEventListener("touchmove", function(event) {
    event.preventDefault();
  });
  gameContainer.addEventListener("touchend", function(event) {
    if (event.touches.length > 0) {
      return;
    }
    var dx = event.changedTouches[0].clientX - touchStartClientX;
    var absDx = Math.abs(dx);
    var dy = event.changedTouches[0].clientY - touchStartClientY;
    var absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) > 10) {
      self.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : 
        (dy > 0 ? 2 : 0)); // (right : left) : (down : up)
    }
  });
};

KeyboardInputManager.prototype.restart = function (event) {
  event.preventDefault();
  this.emit("restart");
};
