/* eslint-disable no-underscore-dangle */
export default class LocalStorageManager {
  constructor(db) {
    this.bestScoreKey = `${db}_best_score`;
    this.gameStateKey = `${db}_game_state`;

    const supported = LocalStorageManager.localStorageSupported();
    this.storage = supported ? window.localStorage : window.fakeStorage;
  }

  static localStorageSupported() {
    const testKey = "test";

    try {
      const storage = window.localStorage;
      storage.setItem(testKey, "1");
      storage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Best score getters/setters
  getBestScore() {
    return this.storage.getItem(this.bestScoreKey) || 0;
  }

  setBestScore(score) {
    this.storage.setItem(this.bestScoreKey, score);
  }

  // Game state getters/setters and clearing
  getGameState() {
    const stateJSON = this.storage.getItem(this.gameStateKey);
    return stateJSON ? JSON.parse(stateJSON) : null;
  }

  setGameState(gameState) {
    this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
  }

  clearGameState() {
    this.storage.removeItem(this.gameStateKey);
  }
}

window.fakeStorage = {
  _data: {},

  setItem(id, val) {
    this._data[id] = String(val);
  },

  getItem(id) {
    return Object.prototype.hasOwnProperty.call(this._data, id) ? this._data[id] : undefined;
  },

  removeItem(id) {
    delete this._data[id];
  },

  clear() {
    this._data = {};
  }
};
