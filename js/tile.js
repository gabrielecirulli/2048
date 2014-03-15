function Tile(position, value) {
  this.x                = position.x;
  this.y                = position.y;
  this.value            = value || 2;

  this.previousPosition = null;
  this.mergedFrom       = null; // Tracks tiles that merged together
}

Tile.prototype.romanNumeral = function() {
  // map value to roman numeral from value
  var key = this.value;
  var numeralsMaps = [];
  numeralsMaps["2"]    = 'I';
  numeralsMaps["4"]    = 'II';
  numeralsMaps["8"]    = 'III';
  numeralsMaps["16"]   = 'IV';
  numeralsMaps["32"]   = 'V';
  numeralsMaps["64"]   = 'VI';
  numeralsMaps["128"]  = 'VII';
  numeralsMaps["256"]  = 'VIII';
  numeralsMaps["512"]  = 'IX';
  numeralsMaps["1024"] = 'X';
  numeralsMaps["2048"] = 'XI';

  if (numeralsMaps.hasOwnProperty) {
    return numeralsMaps[key];
  }
  return key;
}

Tile.prototype.savePosition = function () {
  this.previousPosition = { x: this.x, y: this.y };
};

Tile.prototype.updatePosition = function (position) {
  this.x = position.x;
  this.y = position.y;
};
