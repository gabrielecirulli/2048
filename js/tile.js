function Tile(position, value) {
  var nums = [2, 4, 8, 16, 32];
  this.x                = position.x;
  this.y                = position.y;
  this.value            = value || nums[Math.abs(Math.round(Math.random()*nums.length-1))];

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
