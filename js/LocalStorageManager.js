(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var VOID0 = void 0;
    var FakeStorage = (function () {
        function FakeStorage() {
            this._data = {};
        }
        FakeStorage.prototype.setItem = function (key, data) {
            this._data[key] = data;
        };
        FakeStorage.prototype.getItem = function (key) {
            var data = this._data[key];
            return data === VOID0
                ? null
                : data;
        };
        FakeStorage.prototype.removeItem = function (key) {
            delete this._data[key];
        };
        FakeStorage.prototype.clear = function () {
            return this._data = {};
        };
        return FakeStorage;
    }());
    function isStorageSupported() {
        var testKey = "test";
        try {
            var storage = window.localStorage;
            storage.setItem(testKey, "1");
            storage.removeItem(testKey);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    exports.isStorageSupported = isStorageSupported;
    var STORAGE = isStorageSupported()
        ? window.localStorage
        : new FakeStorage();
    var KEYS = Object.freeze({
        BEST_SCORE: "bestScore",
        GAME_STATE: "gameState"
    });
    var LocalStorageManager = (function () {
        function LocalStorageManager() {
        }
        LocalStorageManager.prototype.getBestScore = function () {
            var score = STORAGE.getItem(KEYS.BEST_SCORE);
            return score ? Number(score) : 0;
        };
        LocalStorageManager.prototype.setBestScore = function (score) {
            STORAGE.setItem(KEYS.BEST_SCORE, score);
        };
        // Game state getters/setters and clearing
        LocalStorageManager.prototype.getGameState = function () {
            var stateJSON = STORAGE.getItem(KEYS.GAME_STATE);
            return stateJSON && JSON.parse(stateJSON);
        };
        LocalStorageManager.prototype.setGameState = function (gameState) {
            STORAGE.setItem(KEYS.GAME_STATE, JSON.stringify(gameState));
        };
        LocalStorageManager.prototype.clearGameState = function () {
            STORAGE.removeItem(KEYS.GAME_STATE);
        };
        return LocalStorageManager;
    }());
    exports.LocalStorageManager = LocalStorageManager;
});
//# sourceMappingURL=LocalStorageManager.js.map