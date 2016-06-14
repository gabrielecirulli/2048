class KeyboardInputManager {
  constructor() {
    this.events = {};
    if (window.navigator.msPointerEnabled) {
      this.eventTouchstart = "MSPointerDown";;
      this.eventTouchmove = "MSPointerMove";;
      this.eventTouchend = "MSPointerUp";;

    } else {
      this.eventTouchstart = "touchstart";
      this.eventTouchmove = "touchmove";
      this.eventTouchend = "touchend";
    }
    this.listen()
  }
  on(event, callback) {
    if (!(this.events[event])) {
      this.events[event] = [];

    }
    this.events[event].push(callback)
  }
  emit(event, data) {
    var callbacks = this.events[event];
    if (callbacks) {
      callbacks.forEach(function(callback) {
        callback(data);
      });

    }
  }
  listen() {
    var self = this;
    var map = {
      38: 0,
      39: 1,
      40: 2,
      37: 3,
      75: 0,
      76: 1,
      74: 2,
      72: 3,
      87: 0,
      68: 1,
      83: 2,
      65: 3
    };
    document.addEventListener("keydown", function(event) {
      var modifiers = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
      var mapped = map[event.which];
      if (!(modifiers)) {
        if (mapped !== undefined) {
          event.preventDefault();
          self.emit("move", mapped);

        };

      }
      if (!(modifiers) && event.which === 82) {
        self.restart.call(self, event);

      }
    })
    this.bindButtonPress(".retry-button", this.restart)
    this.bindButtonPress(".restart-button", this.restart)
    this.bindButtonPress(".keep-playing-button", this.keepPlaying)
    var touchStartClientX, touchStartClientY;
    var gameContainer = document.getElementsByClassName("game-container")[0];
    gameContainer.addEventListener(this.eventTouchstart, function(event) {
      if (!(window.navigator.msPointerEnabled) && event.touches.length > 1 || event.targetTouches.length > 1) {
        return;

      }
      if (window.navigator.msPointerEnabled) {
        touchStartClientX = event.pageX;;
        touchStartClientY = event.pageY;;

      } else {
        touchStartClientX = event.touches[0].clientX;
        touchStartClientY = event.touches[0].clientY;
      }
      event.preventDefault()
    })
    gameContainer.addEventListener(this.eventTouchmove, function(event) {
      event.preventDefault()
    })
    gameContainer.addEventListener(this.eventTouchend, function(event) {
      if (!(window.navigator.msPointerEnabled) && event.touches.length > 0 || event.targetTouches.length > 0) {
        return;

      }
      var touchEndClientX, touchEndClientY;
      if (window.navigator.msPointerEnabled) {
        touchEndClientX = event.pageX;;
        touchEndClientY = event.pageY;;

      } else {
        touchEndClientX = event.changedTouches[0].clientX;
        touchEndClientY = event.changedTouches[0].clientY;
      }

      var dx = touchEndClientX - touchStartClientX;
      var absDx = Math.abs(dx);
      var dy = touchEndClientY - touchStartClientY;
      var absDy = Math.abs(dy);
      if (Math.max(absDx, absDy) > 10) {
        self.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
      }
    })
  }
  restart(event) {
    event.preventDefault()
    this.emit("restart")
  }
  keepPlaying(event) {
    event.preventDefault()
    this.emit("keepPlaying")
  }
  bindButtonPress(selector, fn) {
    var button = document.querySelector(selector);
    button.addEventListener("click", fn.bind(this));
    button.addEventListener(this.eventTouchend, fn.bind(this));
  }
}