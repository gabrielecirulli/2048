function GamepadInputManager() {
    this.events = {};

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

    this.bind();
    this.listen();
}

GamepadInputManager.prototype.on = function (event, callback) {
    if (!this.events[event]) {
        this.events[event] = [];
    }
    this.events[event].push(callback);
};

GamepadInputManager.prototype.emit = function (event, data) {
    var callbacks = this.events[event];
    if (callbacks) {
        callbacks.forEach(function (callback) {
            callback(data);
        });
    }
};

GamepadInputManager.prototype.bind = function () {
    this.bindButtonPress(".retry-button", this.restart);
    this.bindButtonPress(".restart-button", this.restart);
    this.bindButtonPress(".keep-playing-button", this.keepPlaying);
};

GamepadInputManager.prototype.listen = function() {
    var self = this;
    window.requestAnimationFrame(function () {
       self.listen();
    });

    var gamepads;
    if (!navigator || !navigator.getGamepads) {
        return;
    }

    gamepads = navigator.getGamepads();

    for (var i = 0; i < gamepads.length; ++i)
    {
        var pad = gamepads[i];

        if (pad) {
            if (pad.buttons[this.buttons.A].pressed) {
                this.keepPlaying(null);
            }

            if (pad.buttons[this.buttons.SELECT].pressed) {
                this.restart(null);
            }

            checkButton(pad, this.buttons.D_PAD_DOWN, this.directions.DOWN);
            checkButton(pad, this.buttons.D_PAD_RIGHT, this.directions.RIGHT);
            checkButton(pad, this.buttons.D_PAD_LEFT, this.directions.LEFT);
            checkButton(pad, this.buttons.D_PAD_UP, this.directions.UP);

            checkAxis(pad, this.axes.LEFT_THUMB_HORIZONTAL, this.directions.LEFT, this.directions.RIGHT);
            checkAxis(pad, this.axes.LEFT_THUMB_VERTICAL, this.directions.UP, this.directions.DOWN);
        }
    }

    function checkButton(pad, buttonId, direction) {
        var gamepadButton = pad.buttons[buttonId];

        if (!self.pressedBefore[buttonId] && gamepadButton && gamepadButton.pressed) {
            self.emit("move", direction);
        }
        self.pressedBefore[buttonId] = pad.buttons[buttonId].pressed;
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

GamepadInputManager.prototype.restart = function (event) {
    if (event) {
        event.preventDefault();
    }

    this.emit("restart");
};

GamepadInputManager.prototype.keepPlaying = function (event) {
    if (event) {
        event.preventDefault();
    }

    this.emit("keepPlaying");
};

GamepadInputManager.prototype.bindButtonPress = function (selector, fn) {
    var button = document.querySelector(selector);
    button.addEventListener("click", fn.bind(this));
    button.addEventListener(this.eventTouchend, fn.bind(this));
};