function Tile(position, value) {
  this.x                = position.x;
  this.y                = position.y;
  this.value            = value || 2;

  this.previousPosition = null;
  this.mergedFrom       = null; // Tracks tiles that merged together
}

Tile.prototype.savePosition = function () {
  this.previousPosition = { x: this.x, y: this.y };
};

Tile.prototype.updatePosition = function (position) {
  this.x = position.x;
  this.y = position.y;
};

Tile.prototype.copy = function () {
  return new Tile({x: this.x, y: this.y}, this.value);
}

Tile.prototype.copy2 = function () {
  return Object.create(Tile.prototype, { 
    x:                {writable: true, configurable: true, value: this.x},
    y:                {writable: true, configurable: true, value: this.y},
    value:            {writable: true, configurable: true, value: this.value},
    previousPosition: {writable: true, configurable: true, value: null},
    mergedFrom      : {writable: true, configurable: true, value: null}
  });
}
