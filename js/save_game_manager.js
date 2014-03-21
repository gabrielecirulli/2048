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

function SaveGameManager() {
  this.key1     = "savedGameGrid";
  this.key2     = "savedGameScore";

  var supported = this.localStorageSupported();
  this.storage = supported ? window.localStorage : window.fakeStorage;
}

SaveGameManager.prototype.localStorageSupported = function () {
  var testKey = "test";
  var storage = window.localStorage;

  try {
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

SaveGameManager.prototype.get = function (grid) {
  if (this.storage.getItem(this.key1)){
    cellsJSON = this.storage.getItem(this.key1)
    cellsData = JSON.parse(cellsJSON)
    realCells = []
    cellsData.forEach( function(row){
      realCells.push([])
      row.forEach( function(cell){
        rowArray = realCells.pop()
        if (cell) {
          rowArray.push(new Tile({x: cell['x'], y: cell['y']}, cell['value']))
        }
        else {
          rowArray.push(null)
        }
        realCells.push(rowArray)
      })
    })
    return [realCells, parseInt(this.storage.getItem(this.key2))]
  }
  else {
    return [null, null]
  }
};

SaveGameManager.prototype.set = function (cells, score) {
  this.storage.setItem(this.key1, JSON.stringify(cells));
  this.storage.setItem(this.key2, score);
};

