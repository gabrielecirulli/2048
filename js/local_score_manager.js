window.fakeStorage = {
  _data       : {},
  setItem     : function (id, val) {
    console.log('set');
    return this._data[id] = String(val);
  },
  getItem     : function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },
  removeItem  : function (id) { return delete this._data[id]; },
  clear       : function () { return this._data = {}; }
};

function LocalScoreManager() {
  var localSupported = !!window.localStorage;
  this.key = 'bestScore';
  this.storage =  localSupported ? window.localStorage : window.fakeStorage;
}

LocalScoreManager.prototype.get = function () {
  var score = this.storage.getItem(this.key);
  if (typeof score === "undefined" || score === null) {
    score = 0;
  }
  return score;
};

LocalScoreManager.prototype.set = function (score) {
  this.storage.setItem(this.key, score);
};

