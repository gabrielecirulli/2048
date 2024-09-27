function Grid(size, previousState) {
  this.size = size;
  this.cells = previousState ? this.fromState(previousState) : this.empty();
}
// Build a grid of the specified size
// TODO change name to make it more clear
Grid.prototype.empty = function () {
  let cells = [];

  for (let x = 0; x < this.size; x++) {
    let row = cells[x] = [];

    for (let y = 0; y < this.size; y++) {
      row.push(null);
    }
  }

  return cells;
};

// TODO change name to make it more clear
Grid.prototype.fromState = function (state) {
  let cells = [];

  for (let x = 0; x < this.size; x++) {
    let row = cells[x] = [];

    for (let y = 0; y < this.size; y++) {
      let tile = state[x][y];
      row.push(tile ? new Tile(tile.position, tile.value) : null);
    }
  }

  return cells;
};

// Find the first available random position
// TODO what happens when cells.length is null/undefined?
Grid.prototype.randomAvailableCell = function () {
  let cells = this.availableCells();

  if (cells.length) {
    return cells[Math.floor(Math.random() * cells.length)];
  }
};

// TODO check if callback is the best way to do this.
Grid.prototype.availableCells = function () {
  let cells = [];

  this.eachCell(function (x, y, tile) {
    if (!tile) {
      cells.push({ x: x, y: y });
    }
  });

  return cells;
};

// Call callback for every cell
Grid.prototype.eachCell = function (callback) {
  for (let x = 0; x < this.size; x++) {
    for (let y = 0; y < this.size; y++) {
      callback(x, y, this.cells[x][y]);
    }
  }
};

// Check if there are any cells available
// TODO: feels like using length here is a bit of a hack, as well as !!
Grid.prototype.cellsAvailable = function () {
  return !!this.availableCells().length;
};

// Check if the specified cell is taken
Grid.prototype.cellAvailable = function (cell) {
  return !this.cellOccupied(cell);
};

// TODO: using cellContent for this seems like a hack
Grid.prototype.cellOccupied = function (cell) {
  return !!this.cellContent(cell);
};

Grid.prototype.cellContent = function (cell) {
  if (this.withinBounds(cell)) {
    return this.cells[cell.x][cell.y];
  } else {
    return null;
  }
};

// Inserts a tile at its position
Grid.prototype.insertTile = function (tile) {
  this.cells[tile.x][tile.y] = tile;
};

Grid.prototype.removeTile = function (tile) {
  this.cells[tile.x][tile.y] = null;
};

Grid.prototype.withinBounds = function (position) {
  return position.x >= 0 && position.x < this.size &&
         position.y >= 0 && position.y < this.size;
};

// TODO: Not sure what this is for...
Grid.prototype.serialize = function () {
  let cellState = [];

  for (let x = 0; x < this.size; x++) {
    let row = cellState[x] = [];

    for (let y = 0; y < this.size; y++) {
      row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
    }
  }

  return {
    size: this.size,
    cells: cellState
  };
};
