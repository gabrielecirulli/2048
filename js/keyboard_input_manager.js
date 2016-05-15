function KeyboardInputManager() {
  this.events = {};

  if (window.navigator.msPointerEnabled) {
    //Internet Explorer 10 style
    this.eventTouchstart    = "MSPointerDown";
    this.eventTouchmove     = "MSPointerMove";
    this.eventTouchend      = "MSPointerUp";
  } else {
    this.eventTouchstart    = "touchstart";
    this.eventTouchmove     = "touchmove";
    this.eventTouchend      = "touchend";
  }

  this.pressedBefore = {};
  this.axisValueBefore = {};
  this.axisDirectionThreshold = 0.8;

  // See standard gamepad mapping: http://www.w3.org/TR/2015/WD-gamepad-20150414/#remapping
  this.buttons = {
    "D_PAD_DOWN": 13,
    "D_PAD_RIGHT": 15,
    "D_PAD_LEFT": 14,
    "D_PAD_UP": 12,
    "A": 0,
    "SELECT": 8
  };

  this.axes = {
    "LEFT_THUMB_HORIZONTAL": 0,
    "LEFT_THUMB_VERTICAL": 1
  };

  this.directions = {
    "LEFT": 3,
    "RIGHT": 1,
    "UP": 0,
    "DOWN": 2
  };

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
    75: 0, // Vim up
    76: 1, // Vim right
    74: 2, // Vim down
    72: 3, // Vim left
    87: 0, // W
    68: 1, // D
    83: 2, // S
    65: 3  // A
  };

  // Respond to direction keys
  document.addEventListener("keydown", function (event) {
    var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
                    event.shiftKey;
    var mapped    = map[event.which];

    // Ignore the event if it's happening in a text field
    if (self.targetIsInput(event)) return;

    if (!modifiers) {
      if (mapped !== undefined) {
        event.preventDefault();
        self.emit("move", mapped);
      }
    }

    // R key restarts the game
    if (!modifiers && event.which === 82) {
      self.restart.call(self, event);
    }
  });

  // Respond to button presses
  this.bindButtonPress(".retry-button", this.restart);
  this.bindButtonPress(".restart-button", this.restart);
  this.bindButtonPress(".keep-playing-button", this.keepPlaying);

  // Respond to swipe events
  var touchStartClientX, touchStartClientY;
  var gameContainer = document.getElementsByClassName("game-container")[0];

  gameContainer.addEventListener(this.eventTouchstart, function (event) {
    if ((!window.navigator.msPointerEnabled && event.touches.length > 1) ||
        event.targetTouches.length > 1 ||
        self.targetIsInput(event)) {
      return; // Ignore if touching with more than 1 finger or touching input
    }

    if (window.navigator.msPointerEnabled) {
      touchStartClientX = event.pageX;
      touchStartClientY = event.pageY;
    } else {
      touchStartClientX = event.touches[0].clientX;
      touchStartClientY = event.touches[0].clientY;
    }

    event.preventDefault();
  });

  gameContainer.addEventListener(this.eventTouchmove, function (event) {
    event.preventDefault();
  });

  gameContainer.addEventListener(this.eventTouchend, function (event) {
    if ((!window.navigator.msPointerEnabled && event.touches.length > 0) ||
        event.targetTouches.length > 0 ||
        self.targetIsInput(event)) {
      return; // Ignore if still touching with one or more fingers or input
    }

    var touchEndClientX, touchEndClientY;

    if (window.navigator.msPointerEnabled) {
      touchEndClientX = event.pageX;
      touchEndClientY = event.pageY;
    } else {
      touchEndClientX = event.changedTouches[0].clientX;
      touchEndClientY = event.changedTouches[0].clientY;
    }

    var dx = touchEndClientX - touchStartClientX;
    var absDx = Math.abs(dx);

    var dy = touchEndClientY - touchStartClientY;
    var absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 10) {
      // (right : left) : (down : up)
      self.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
    }
  });

  // Respond to gamepad input
  if (navigator.getGamepads || !!navigator.webkitGetGamepads || !!navigator.webkitGamepads) {
    if ('ongamepadconnected' in window) {
      window.addEventListener('gamepadconnected', startGamepadPolling);
    } else {
      startGamepadPolling();
    }
  }

  var gamepadPollingStarted = false;

  function startGamepadPolling() {
    if (!gamepadPollingStarted) {
      gamepadPollingStarted = true;
      checkGamepad();
    }
  }

  function checkGamepad() {
    var gamepads = (navigator.getGamepads && navigator.getGamepads()) || (navigator.webkitGetGamepads && navigator.webkitGetGamepads());

    for (var i = 0; i < gamepads.length; ++i) {
      var pad = gamepads[i];

      if (pad) {
        if (!!pad.buttons[self.buttons.A] && pad.buttons[self.buttons.A].pressed) {
          self.keepPlaying();
        }

        if (!!pad.buttons[self.buttons.SELECT] && pad.buttons[self.buttons.SELECT].pressed) {
          self.restart();
        }

        checkButton(pad, self.buttons.D_PAD_DOWN, self.directions.DOWN);
        checkButton(pad, self.buttons.D_PAD_RIGHT, self.directions.RIGHT);
        checkButton(pad, self.buttons.D_PAD_LEFT, self.directions.LEFT);
        checkButton(pad, self.buttons.D_PAD_UP, self.directions.UP);

        checkAxis(pad, self.axes.LEFT_THUMB_HORIZONTAL, self.directions.LEFT, self.directions.RIGHT);
        checkAxis(pad, self.axes.LEFT_THUMB_VERTICAL, self.directions.UP, self.directions.DOWN);
      }
    }

    window.requestAnimationFrame(checkGamepad);
  }

  function checkButton(pad, buttonId, direction) {
    var gamepadButton = pad.buttons[buttonId];

    if (!self.pressedBefore[buttonId] && gamepadButton && gamepadButton.pressed) {
      self.emit("move", direction);
    }
    self.pressedBefore[buttonId] = !!pad.buttons[buttonId] && pad.buttons[buttonId].pressed;
  }

  function checkAxis(pad, axisId, negativeDirection, positiveDirection) {
    var axisValue = pad.axes[axisId];

    if (Math.abs(self.axisValueBefore[axisId]) < self.axisDirectionThreshold && axisValue) {
      if (axisValue > self.axisDirectionThreshold) {
        self.emit("move", positiveDirection);
      }

      if (axisValue < self.axisDirectionThreshold * -1) {
        self.emit("move", negativeDirection);
      }
    }
    self.axisValueBefore[axisId] = axisValue;
  }
};

KeyboardInputManager.prototype.restart = function (event) {
  if (event) {
    event.preventDefault();
  }

  this.emit("restart");
};

KeyboardInputManager.prototype.keepPlaying = function (event) {
  if (event) {
    event.preventDefault();
  }

  this.emit("keepPlaying");
};

KeyboardInputManager.prototype.bindButtonPress = function (selector, fn) {
  var button = document.querySelector(selector);
  button.addEventListener("click", fn.bind(this));
  button.addEventListener(this.eventTouchend, fn.bind(this));
};

KeyboardInputManager.prototype.targetIsInput = function (event) {
  return event.target.tagName.toLowerCase() === "input";
};
