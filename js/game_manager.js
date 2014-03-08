function GameManager(size, actuator) {
  this.size       = size; // Grid size
  this.actuator   = actuator;

  this.startTiles = 2;
  this.grid       = new Grid(this.size);

  this.setup();
}

// Set up the game
GameManager.prototype.setup = function () {
  this.addStartTiles();

  // Update the actuator
  this.actuate();
};

// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function () {
  for (var i = 0; i < this.startTiles; i++) {
    this.addRandomTile();
  }
};

// Adds a tile in a random position
GameManager.prototype.addRandomTile = function () {
  var tile = new Tile(this.grid.randomAvailableCell());
  this.grid.insertTile(tile);
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  this.actuator.actuate(this.grid);
};

// Move the grid in the specified direction
GameManager.prototype.move = function (direction) {
  // 0: up, 1: right, 2:down, 3: left

  this.actuate();
};
