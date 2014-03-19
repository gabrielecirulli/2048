function Tile(position, value) {
  this.x                = position.x;
  this.y                = position.y;
  this.value            = value || 2;
  this.wangValue        = null;

  this.previousPosition = null;
  this.mergedFrom       = null; // Tracks tiles that merged together
}

Tile.prototype.generateWangValue = function () {
  var value = this.value,
      wang  = '',
      random = Math.random(),
      chars = 'abcdefghijklmnopqrstuvwxyz';

  wang = Math.ceil(Math.random() * (value - (value/2)) * 4);

  if (random > 0.94) {
    wang = wang.toString() + '.' + Math.ceil(Math.random() * 9).toString();
  }
  else if (random < 0.04) {
    wang = '-' + wang.toString();
  }
  else if (random > 0.04 && random < 0.046) {
    wang = chars[Math.floor(Math.random() * chars.length)];
  }
  else if (random > 0.05 && random < 0.08) {
    wang = wang + Math.floor(Math.random() * 10000);
  }

  this.wangValue = wang;
}

Tile.prototype.savePosition = function () {
  this.previousPosition = { x: this.x, y: this.y };
};

Tile.prototype.updatePosition = function (position) {
  this.x = position.x;
  this.y = position.y;
};
