window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    return this._data[id] = String(val);
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};

function LocalStorageManager() {
  this.bestScoreKey     = "bestScore";
  this.gameStateKey     = "gameState";

  this.totalMovesKey    = "totalMoves";   /* Changes*/
  this.lastMoveKey      = "move#";        /* Changes*/

  var supported = this.localStorageSupported();
  this.storage = supported ? window.localStorage : window.fakeStorage;
}

LocalStorageManager.prototype.localStorageSupported = function () {
  var testKey = "test";

  try {
    var storage = window.localStorage;
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

// Best score getters/setters
LocalStorageManager.prototype.getBestScore = function () {
  return this.storage.getItem(this.bestScoreKey) || 0;
};

LocalStorageManager.prototype.setBestScore = function (score) {
  this.storage.setItem(this.bestScoreKey, score);
};

// Game state getters/setters and clearing
LocalStorageManager.prototype.getGameState = function () {
  var stateJSON = this.storage.getItem(this.gameStateKey);
  return stateJSON ? JSON.parse(stateJSON) : null;
};

LocalStorageManager.prototype.setGameState = function (gameState) {
  this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
};

LocalStorageManager.prototype.clearGameState = function () {
  this.storage.removeItem(this.gameStateKey);
};


// Changes (implementacao do UNDO)
LocalStorageManager.prototype.getLastMove = function (willUse) {
  var i=this.getTotalMoves();
  var stateJSON = this.storage.getItem(this.lastMoveKey+i.toString());
  if (willUse && JSON.parse(stateJSON)) {
    this.storage.removeItem(this.lastMoveKey+i.toString());
    this.setTotalMoves(--i);
  }
  return stateJSON ? JSON.parse(stateJSON) : null;
};

LocalStorageManager.prototype.setLastMove = function (lastMove) {
  var i=this.getTotalMoves();
  this.storage.setItem(this.lastMoveKey+(++i).toString(), JSON.stringify(lastMove));
  this.setTotalMoves(i);
};

LocalStorageManager.prototype.clearLastMoves = function () {
  for (var i=this.getTotalMoves(); i > 0; i--) {
    this.storage.removeItem(this.lastMoveKey+i.toString());
  };
  this.storage.removeItem(this.totalMovesKey);
};

LocalStorageManager.prototype.getTotalMoves = function () {
  return this.storage.getItem(this.totalMovesKey) || 0;
};

LocalStorageManager.prototype.setTotalMoves = function (moves) {
  this.storage.setItem(this.totalMovesKey, moves);
};
// End CHANGES