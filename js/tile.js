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
      chars = 'αβγδεƒghijkmnpqrsστμνωχyzπλθ∑Δ∞';

  wang = Math.ceil(Math.random() * (value) * 4);

  // Decimal number
  if (random > 0.935) {
    wang = wang.toString() + '.' + Math.ceil(Math.random() * 9).toString();
  }
  // Negative number
  else if (random < 0.04) {
    wang = '-' + wang.toString();
  }
  // Random letter
  else if (random > 0.042 && random < 0.046) {
    wang = chars[Math.floor(Math.random() * chars.length)];
  }
  // Zero
  else if (random > 0.46 && random < 0.465) {
    wang = 0;
  }
  // Two digit number
  else if (random > 0.16 && random < 0.19) {
    wang = wang + Math.floor(Math.random() * 100);
  }
  // Three digit number
  else if (random > 0.09 && random < 0.12) {
    wang = wang + Math.floor(Math.random() * 1000);
  }
  // Four digit number
  else if (random > 0.05 && random < 0.08) {
    wang = wang + Math.floor(Math.random() * 10000);
  }
  // Five digit number
  else if (random > 0.080 && random < 0.082) {
    wang = wang + Math.floor(Math.random() * 100000);
  }
  // Six digit number
  else if (random > 0.085 && random < 0.086) {
    wang = wang + Math.floor(Math.random() * 1000000);
  }
  // Subtraction
  else if (random > 0.150 && random < 0.152) {
    wang = wang.toString() + '-' + Math.ceil(Math.random() * 10).toString();
  }
  // Addition
  else if (random > 0.155 && random < 0.157) {
    wang = wang.toString() + '+' + Math.ceil(Math.random() * 10).toString();
  }
  // Square root
  else if (random > 0.200 && random < 0.202) {
    wang = '√' + wang.toString();
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
