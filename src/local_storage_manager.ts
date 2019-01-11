window.fakeStorage = {
  _data: {},

  setItem: function (id:number, val:string) {
    return this._data[id] = String(val);
  },

  getItem: function (id:number) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id:number) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};
//Todo Make interface global
interface LocalStorageManager {
  bestScoreKey: any
  gameStateKey: any
  storage: any
}

class LocalStorageManager {

  constructor(){
    this.bestScoreKey     = "bestScore";
    this.gameStateKey     = "gameState";
    let supported:any     = this.localStorageSupported();
    this.storage          = supported ? window.localStorage : window.fakeStorage;
  }

  localStorageSupported () {
    let testKey = "test";

    try {
      let storage = window.localStorage;
      storage.setItem(testKey, "1");
      storage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Best score getters/setters
  getBestScore = function () {
    return this.storage.getItem(this.bestScoreKey) || 0;
  };

  setBestScore = function (score:number) {
    this.storage.setItem(this.bestScoreKey, score);
  };

  // Game state getters/setters and clearing
  getGameState = function () {
    var stateJSON = this.storage.getItem(this.gameStateKey);
    return stateJSON ? JSON.parse(stateJSON) : null;
  };

  setGameState = function (gameState:number) {
    this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
  };

  clearGameState = function () {
    this.storage.removeItem(this.gameStateKey);
  };
}
