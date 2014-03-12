function Grid(sizeX, sizeY) {
  this.sizeX = sizeX;
  this.sizeY = sizeY;

  this.cells = [];

  this.build();
}

// Build a grid of the specified size
Grid.prototype.build = function () {
  for (var y = 0; y < this.sizeY; y++) {
    var row = this.cells[y] = [];

    for (var x = 0; x < this.sizeX; x++) {
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

  this.eachCell(function (x, y, tile) {
    if (!tile) {
      cells.push({ x: x, y: y });
    }
  });

  return cells;
};

// Call callback for every cell
Grid.prototype.eachCell = function (callback) {
  for (var y = 0; y < this.sizeY; y++) {
    for (var x = 0; x < this.sizeX; x++) {
      callback(x, y, this.cells[y][x]);
    }
  }
};

// Check if there are any cells available
Grid.prototype.cellsAvailable = function () {
  return !!this.availableCells().length;
};

// Check if the specified cell is taken
Grid.prototype.cellAvailable = function (cell) {
  return !this.cellOccupied(cell);
};

Grid.prototype.cellOccupied = function (cell) {
  return !!this.cellContent(cell);
};

Grid.prototype.cellContent = function (cell) {
  if (this.withinBounds(cell)) {
    return this.cells[cell.y][cell.x];
  } else {
    return null;
  }
};

// Inserts a tile at its position
Grid.prototype.insertTile = function (tile) {
  this.cells[tile.y][tile.x] = tile;
};

Grid.prototype.removeTile = function (tile) {
  this.cells[tile.y][tile.x] = null;
};

Grid.prototype.withinBounds = function (position) {
  return position.x >= 0 && position.x < this.sizeX &&
         position.y >= 0 && position.y < this.sizeY;
};
