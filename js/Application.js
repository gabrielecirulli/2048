(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./GameManager", "./KeyboardInputManager", "./HtmlActuator", "./LocalStorageManager"], factory);
    }
})(function (require, exports) {
    "use strict";
    var GameManager_1 = require("./GameManager");
    var KeyboardInputManager_1 = require("./KeyboardInputManager");
    var HtmlActuator_1 = require("./HtmlActuator");
    var LocalStorageManager_1 = require("./LocalStorageManager");
    // Wait till the browser is ready to render the game (avoids glitches)
    window.requestAnimationFrame(function () {
        new GameManager_1.GameManager(4, KeyboardInputManager_1.KeyboardInputManager, HtmlActuator_1.HTMLActuator, LocalStorageManager_1.LocalStorageManager);
    });
});
//# sourceMappingURL=Application.js.map