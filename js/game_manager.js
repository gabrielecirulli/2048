function GameManager(size, actuator) {
  this.size       = size; // Grid size
  this.actuator   = actuator;

  this.startTiles = 2;
  this.grid       = [];

  this.setup();
}

// Set up the game
GameManager.prototype.setup = function () {
  this.buildGrid();
  this.addStartTiles();

  // Update the actuator
  this.update();
};

// Build a grid of the specified size
GameManager.prototype.buildGrid = function () {
  for (var y = 0; y < this.size; y++) {
    this.grid[y] = [];
    for (var x = 0; x < this.size; x++) {
      this.grid[y].push(null);
    }
  }
};

// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function () {
  for (var i = 0; i < this.startTiles; i++) {
    this.addTile();
  }
};

// Adds a tile in a random position
GameManager.prototype.addTile = function () {
  this.insertTile(new Tile(this.randomCell()));
};

// Find the first available random position
GameManager.prototype.randomCell = function () {
  // TODO: build a map of available positions and choose from it
  var self = this;

  var position;

  function randomPosition() {
    return Math.floor(Math.random() * self.size);
  }

  do {
    position = {
      x: randomPosition(),
      y: randomPosition()
    };
  } while (this.cellOccupied(position));

  return position;
};

// Check if the specified cell is taken
GameManager.prototype.cellOccupied = function (cell) {
  return !!this.grid[cell.x][cell.y];
};

// Insert a tile at the specified position
GameManager.prototype.insertTile = function (tile) {
  this.grid[tile.x][tile.y] = tile;
};

// Sends the updated grid to the actuator
GameManager.prototype.update = function () {
  this.actuator.update(this.grid);
};

// Move the grid in the specified direction
GameManager.prototype.move = function (direction) {
  // 0: up, 1: right, 2:down, 3: left

  this.update();
};
