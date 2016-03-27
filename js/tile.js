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

Tile.prototype.serialize = function () {
  return {
    position: {
      x: this.x,
      y: this.y
    },
    value: this.value
  };
};

Tile.prototype.save = function (next) {
  var copy = {}
  copy.x = this.x;
  copy.y = this.y;
  copy.value = this.value;
  copy.previousPosition = {
    // In order to reverse the animation, we store the
    // next position as the previous
    x: next.x,
    y: next.y
  }
  return copy;
}
