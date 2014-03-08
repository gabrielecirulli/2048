function Grid(size) {
  this.size = size;

  this.cells = [];

  this.build();
}

// Build a grid of the specified size
Grid.prototype.build = function () {
  for (var x = 0; x < this.size; x++) {
    var row = this.cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(null);
    }
  }
};

// Find the first available random position
Grid.prototype.randomAvailableCell = function () {
  var cells = this.availableCells();

  if (cells.length) {
    return cells[Math.floor(Math.random() * cells.length)];
  }
};

Grid.prototype.availableCells = function () {
  var cells = [];

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      var cell = { x: x, y: y };

      if (this.cellAvailable(cell)) {
        cells.push(cell);
      }
    }
  }

  return cells;
};

// Check if the specified cell is taken
Grid.prototype.cellAvailable = function (cell) {
  return !this.cellOccupied(cell);
};

Grid.prototype.cellOccupied = function (cell) {
  return !!this.cells[cell.x][cell.y];
};

// Inserts a tile at its position
Grid.prototype.insertTile = function (tile) {
  this.cells[tile.x][tile.y] = tile;
};
