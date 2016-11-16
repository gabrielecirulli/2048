(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var KEY_MAP = Object.freeze({
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
        65: 3 // A
    });
    var KeyboardInputManager = (function () {
        function KeyboardInputManager() {
            this._listeners = {};
            var mpe = window.navigator.msPointerEnabled; //Internet Explorer 10 style
            this.eventTouchstart = mpe ? "MSPointerDown" : "touchstart";
            this.eventTouchmove = mpe ? "MSPointerMove" : "touchmove";
            this.eventTouchend = mpe ? "MSPointerUp" : "touchend";
            this.listen();
        }
        KeyboardInputManager.prototype.on = function (eventName, callback) {
            if (!this._listeners[eventName]) {
                this._listeners[eventName] = [];
            }
            this._listeners[eventName].push(callback);
        };
        ;
        KeyboardInputManager.prototype.emit = function (eventName, data) {
            var callbacks = this._listeners[eventName];
            if (callbacks) {
                for (var _i = 0, callbacks_1 = callbacks; _i < callbacks_1.length; _i++) {
                    var callback = callbacks_1[_i];
                    callback(data);
                }
            }
        };
        ;
        KeyboardInputManager.prototype.listen = function () {
            var _this = this;
            // Respond to direction keys
            document.addEventListener("keydown", function (event) {
                var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
                    event.shiftKey;
                var mapped = KEY_MAP[event.which];
                if (!modifiers) {
                    if (mapped !== undefined) {
                        event.preventDefault();
                        _this.emit("move", mapped);
                    }
                }
                // R key restarts the game
                if (!modifiers && event.which === 82) {
                    _this.restart.call(self, event);
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
                    event.targetTouches.length > 1) {
                    return; // Ignore if touching with more than 1 finger
                }
                if (window.navigator.msPointerEnabled) {
                    touchStartClientX = event.pageX;
                    touchStartClientY = event.pageY;
                }
                else {
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
                    event.targetTouches.length > 0) {
                    return; // Ignore if still touching with one or more fingers
                }
                var touchEndClientX, touchEndClientY;
                if (window.navigator.msPointerEnabled) {
                    touchEndClientX = event.pageX;
                    touchEndClientY = event.pageY;
                }
                else {
                    touchEndClientX = event.changedTouches[0].clientX;
                    touchEndClientY = event.changedTouches[0].clientY;
                }
                var dx = touchEndClientX - touchStartClientX;
                var absDx = Math.abs(dx);
                var dy = touchEndClientY - touchStartClientY;
                var absDy = Math.abs(dy);
                if (Math.max(absDx, absDy) > 10) {
                    // (right : left) : (down : up)
                    _this.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
                }
            });
        };
        ;
        KeyboardInputManager.prototype.restart = function (event) {
            event.preventDefault();
            this.emit("restart");
        };
        ;
        KeyboardInputManager.prototype.keepPlaying = function (event) {
            event.preventDefault();
            this.emit("keepPlaying");
        };
        ;
        KeyboardInputManager.prototype.bindButtonPress = function (selector, fn) {
            var button = document.querySelector(selector);
            button.addEventListener("click", fn.bind(this));
            button.addEventListener(this.eventTouchend, fn.bind(this));
        };
        ;
        return KeyboardInputManager;
    }());
    exports.KeyboardInputManager = KeyboardInputManager;
});
//# sourceMappingURL=KeyboardInputManager.js.map