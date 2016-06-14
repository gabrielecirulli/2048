class LocalStorageManager {
  constructor() {
    this.bestScoreKey = "bestScore";
    this.gameStateKey = "gameState";
    var supported = this.localStorageSupported();
    this.storage = supported ? window.localStorage : window.localStorage;
  }
  localStorageSupported() {
    var testKey = "test";
    var storage = window.localStorage;
    try {
      storage.setItem(testKey, "1")
      storage.removeItem(testKey)
      return true;

    } catch (error) {
      return false;
    }
  }
  getBestScore() {
    return this.storage.getItem(this.bestScoreKey) || 0;
  }
  setBestScore(score) {
    this.storage.setItem(this.bestScoreKey, score)
  }
  getGameState() {
    var stateJSON = this.storage.getItem(this.gameStateKey);
    return stateJSON ? JSON.parse(stateJSON) : null
  }
  setGameState(gameState) {
    this.storage.setItem(this.gameStateKey, JSON.stringify(gameState))
  }
  clearGameState() {
    this.storage.removeItem(this.gameStateKey)
  }
}

window.fakeStorage = {
  _data: {},
  setItem: function(id, val) {
    return this._data[id] = String(val);
  },
  getItem: function(id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined
  },
  removeItem: function(id) {
    return delete(this._data[id])
  },
  clear: function() {
    return this._data = {};
  }
};