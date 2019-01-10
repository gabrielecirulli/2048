function Grid(this:any, size?:any, previousState?:any) {
  this.size = size;
  this.cells = previousState ? this.fromState(previousState) : this.empty();
}

// Build a grid of the specified size
Grid.prototype.empty = function () {
  let cells:Cells = [];

  for (let x:number = 0; x < this.size; x++) {
    let row:Cells = cells[x] = [];

    for (let y:number = 0; y < this.size; y++) {
      row.push(null);
    }
  }

  return cells;
};

Grid.prototype.fromState = function (state:any) {
  let cells:Cells = [];

  for (let x:number = 0; x < this.size; x++) {
    var row:Cells = cells[x] = [];

    for (let y:number = 0; y < this.size; y++) {
      let tile:Tile = state[x][y];
      row.push(tile ? new Tile(tile.position, tile.value) : null);
    }
  }

  return cells;
};

// Find the first available random position
Grid.prototype.randomAvailableCell = function () {
  let cells = this.availableCells();

  if (cells.length) {
    return cells[Math.floor(Math.random() * cells.length)];
  }
};

Grid.prototype.availableCells = function () {
  let cells:Vector[] = [];

  this.eachCell(function (x:number, y:number, tile:number) {
    if (!tile) {
      cells.push({ x: x, y: y });
    }
  });

  return cells;
};

// Call callback for every cell
Grid.prototype.eachCell = function (callback:Function) {
  for (let x:number = 0; x < this.size; x++) {
    for (let y:number = 0; y < this.size; y++) {
      callback(x, y, this.cells[x][y]);
    }
  }
};

// Check if there are any cells available
Grid.prototype.cellsAvailable = function () {
  return !!this.availableCells().length;
};

// Check if the specified cell is taken
Grid.prototype.cellAvailable = function (cell:Vector) {
  return !this.cellOccupied(cell);
};

Grid.prototype.cellOccupied = function (cell:Vector) {
  return !!this.cellContent(cell);
};

Grid.prototype.cellContent = function (cell:Vector) {
  if (this.withinBounds(cell)) {
    return this.cells[cell.x][cell.y];
  } else {
    return null;
  }
};

// Inserts a tile at its position
Grid.prototype.insertTile = function (tile:Tile) {
  this.cells[tile.x][tile.y] = tile;
};

Grid.prototype.removeTile = function (tile:Tile) {
  this.cells[tile.x][tile.y] = null;
};

Grid.prototype.withinBounds = function (position:Vector) {
  return position.x >= 0 && position.x < this.size &&
         position.y >= 0 && position.y < this.size;
};

Grid.prototype.serialize = function () {
  let cellState:Cells = [];

  for (let x:number = 0; x < this.size; x++) {
    var row:Cells = cellState[x] = [];

    for (let y:number = 0; y < this.size; y++) {
      row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
    }
  }

  return {
    size: this.size,
    cells: cellState
  };
};
