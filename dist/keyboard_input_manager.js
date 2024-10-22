"use strict";

function KeyboardInputManager() {
  this.events = {};
  if (window.navigator.msPointerEnabled) {
    //Internet Explorer 10 style
    this.eventTouchstart = "MSPointerDown";
    this.eventTouchmove = "MSPointerMove";
    this.eventTouchend = "MSPointerUp";
  } else {
    this.eventTouchstart = "touchstart";
    this.eventTouchmove = "touchmove";
    this.eventTouchend = "touchend";
  }
  this.listen();
}
KeyboardInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};
KeyboardInputManager.prototype.emit = function (event, data) {
  let callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};
KeyboardInputManager.prototype.listen = function () {
  let self = this;
  let keyMapping = {
    "k": 0,
    // Vim up
    "l": 1,
    // Vim right
    "j": 2,
    // Vim down
    "h": 3,
    // Vim left
    "w": 0,
    // W
    "d": 1,
    // D
    "s": 2,
    // S
    "a": 3,
    // A
    "ArrowUp": 0,
    "ArrowRight": 1,
    "ArrowDown": 2,
    "ArrowLeft": 3
  };

  // Respond to direction keys
  document.addEventListener("keydown", function (event) {
    let modifiers = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
    let mapped = keyMapping[event.key];
    if (!modifiers) {
      if (mapped !== undefined) {
        event.preventDefault();
        self.emit("move", mapped);
      }
    }

    // R key restarts the game
    if (!modifiers && event.key === "r") {
      self.restart.call(self, event);
    }
  });

  // Respond to button presses
  this.bindButtonPress(".retry-button", this.restart);
  this.bindButtonPress(".restart-button", this.restart);
  this.bindButtonPress(".keep-playing-button", this.keepPlaying);

  // Respond to swipe events
  let touchStartClientX, touchStartClientY;
  let gameContainer = document.getElementsByClassName("game-container")[0];
  gameContainer.addEventListener(this.eventTouchstart, function (event) {
    if (!window.navigator.msPointerEnabled && event.touches.length > 1 || event.targetTouches.length > 1) {
      return; // Ignore if touching with more than 1 finger
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
    if (!window.navigator.msPointerEnabled && event.touches.length > 0 || event.targetTouches.length > 0) {
      return; // Ignore if still touching with one or more fingers
    }
    let touchEndClientX, touchEndClientY;
    if (window.navigator.msPointerEnabled) {
      touchEndClientX = event.pageX;
      touchEndClientY = event.pageY;
    } else {
      touchEndClientX = event.changedTouches[0].clientX;
      touchEndClientY = event.changedTouches[0].clientY;
    }
    let dx = touchEndClientX - touchStartClientX;
    let absDx = Math.abs(dx);
    let dy = touchEndClientY - touchStartClientY;
    let absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) > 10) {
      // 0 = up, 1 = right, 3 = left, 2 = down
      let result;
      if (absDx > absDy) {
        result = dx > 0 ? 1 : 3;
      } else {
        result = dy > 0 ? 2 : 0;
      }
      self.emit("move", result);
    }
  });
};
KeyboardInputManager.prototype.restart = function (event) {
  event.preventDefault();
  this.emit("restart");
};
KeyboardInputManager.prototype.keepPlaying = function (event) {
  event.preventDefault();
  this.emit("keepPlaying");
};
KeyboardInputManager.prototype.bindButtonPress = function (selector, fn) {
  let button = document.querySelector(selector);
  button.addEventListener("click", fn.bind(this));
  button.addEventListener(this.eventTouchend, fn.bind(this));
};