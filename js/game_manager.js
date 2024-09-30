function GameManager(size, InputManager, Actuator, StorageManager, scoreGoal) {
  // TODO change name to gridSize
  this.size           = size; // Size of the grid
  this.inputManager   = new InputManager;
  this.storageManager = new StorageManager;
  this.actuator       = new Actuator;
  this.scoreGoal = 2048;

  this.startTiles     = 2;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

  rangeInput.addEventListener("input", () => {
    this.updateGoal();
  });

  this.setup();
}

const rangeInput = document.getElementById("rangeInput");
const rangeValueDisplay = document.getElementById("rangeValue");
const introDisplay = document.getElementById("intro");

// Default Values
rangeInput.value = 4;
rangeValueDisplay.textContent = 2048;

// Update the tile target
GameManager.prototype.updateGoal = function () {
  const sliderValue = parseInt(rangeInput.value);

  // Target is always a multiple of 2
  const tickValue = 128 * Math.pow(2, sliderValue);

  rangeValueDisplay.textContent = tickValue;
  introDisplay.textContent =  tickValue.toString()+" tile!";
  
  this.scoreGoal = tickValue;
  this.storageManager.clearGameState();
  this.setup();
  
};

// TODO remove comment

// Restart the game
GameManager.prototype.restart = function () {
  this.storageManager.clearGameState();
  this.actuator.continueGame(); // Clear the game won/lost message
  this.setup();
};

// Keep playing after winning (allows going over 2048)
GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  this.actuator.continueGame(); // Clear the game won/lost message
};


// TODO: remove comment
// Return true if the game is lost, or has won and the user hasn't kept playing
GameManager.prototype.isGameTerminated = function () {
  return this.over || (this.won && !this.keepPlaying);
};

// TODO: remove comment (and change name to setupGame?)
// Set up the game
GameManager.prototype.setup = function () {
  let previousState = this.storageManager.getGameState();

  //TODO: remove comments
  // Reload the game from a previous game if present
  if (previousState) {
    this.grid        = new Grid(previousState.grid.size,
                                previousState.grid.cells); // Reload grid
    this.score       = previousState.score;
    this.over        = previousState.over;
    this.won         = previousState.won;
    this.keepPlaying = previousState.keepPlaying;
  } else {
    this.grid        = new Grid(this.size);
    this.score       = 0;
    this.over        = false;
    this.won         = false;
    this.keepPlaying = false;

    // TODO: remove comment
    // Add the initial tiles
    this.addStartTiles();
  }

  // TODO: remove comment
  // Update the actuator
  this.actuate();
};

// TODO: remove comment
// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function () {
  for (let i = 0; i < this.startTiles; i++) {
    this.addRandomTile();
  }
};

// TODO reomve comment (and change name to addTileToRandomPosition?)
// Adds a tile in a random position
GameManager.prototype.addRandomTile = function () {
  if (this.grid.cellsAvailable()) {
    let value = Math.random() < 0.9 ? 2 : 4;
    let tile = new Tile(this.grid.randomAvailableCell(), value);

    this.grid.insertTile(tile);
  }
};

// TODO: change to better name (not sure tho, because the library function is also called "actuate")
// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  if (this.storageManager.getBestScore() < this.score) {
    this.storageManager.setBestScore(this.score);
  }

  // TODO: remove comment (and change this.over to this.lost/this.gameOver?)
  // Clear the state when the game is over (game over only, not win)
  if (this.over) {
    this.storageManager.clearGameState();
  } else {
    this.storageManager.setGameState(this.serialize());
  }

  this.actuator.actuate(this.grid, {
    score:      this.score,
    over:       this.over,
    won:        this.won,
    bestScore:  this.storageManager.getBestScore(),
    terminated: this.isGameTerminated()
  });

};

// Represent the current game as an object
GameManager.prototype.serialize = function () {
  return {
    grid:        this.grid.serialize(),
    score:       this.score,
    over:        this.over,
    won:         this.won,
    keepPlaying: this.keepPlaying
  };
};

// TODO: name seems not to describe what the comment does
// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

// TODO: remove comment
// Move a tile and its representation
GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {
  // TODO: remove
  // 0: up, 1: right, 2: down, 3: left

  var scoreGoal = this.scoreGoal;
  var self = this;

  console.log(scoreGoal);

  // TODO: move up in function ++ remove comment
  if (this.isGameTerminated()) return; // Don't do anything if the game's over

  let cell, tile;

  let vector     = this.getVector(direction);
  let traversals = this.buildTraversals(vector);
  let moved      = false;

  // TODO: remove comment
  // Save the current tile positions and remove merger information
  this.prepareTiles();

  // TODO: extract to separate function + remove comments
  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);


      if (tile) {
        let positions = self.findFarthestPosition(cell, vector);
        let next      = self.grid.cellContent(positions.next);

        // TODO: what does this comment mean?
        // Only one merger per row traversal?
        if (next && next.value === tile.value && !next.mergedFrom) {
          let merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // Update the score
          self.score += merged.value;
          // The mighty 2048 tile
          if (merged.value === scoreGoal) self.won = true;
        } else {
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });

  if (moved) {
    this.addRandomTile();

    if (!this.movesAvailable()) {
      this.over = true; // Game over!
    }

    this.actuate();
  }
};

//TODO: remove first 2 comments
// Get the vector representing the chosen direction
GameManager.prototype.getVector = function (direction) {
  // Vectors representing tile movement
  let map = {
    0: { x: 0,  y: -1 }, // Up
    1: { x: 1,  y: 0 },  // Right
    2: { x: 0,  y: 1 },  // Down
    3: { x: -1, y: 0 }   // Left
  };

  return map[direction];
};

// TODO: remove comment
// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function (vector) {
  let traversals = { x: [], y: [] };

  for (let pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.toReversed();
  if (vector.y === 1) traversals.y = traversals.y.toReversed();

  return traversals;
};

// TODO: maybe change name so it is more clear what it does
GameManager.prototype.findFarthestPosition = function (cell, vector) {
  let previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

//TODO: check if it uses lazy evaluation
GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
GameManager.prototype.tileMatchesAvailable = function () {
  for (let x = 0; x < this.size; x++) {
    for (let y = 0; y < this.size; y++) {
      if (this.tilesMatch(x, y)) return true
    }
  }

  return false;
};

GameManager.prototype.tilesMatch = function(x, y){  
  let self = this;
  let tile;

  tile = this.grid.cellContent({ x: x, y: y });

  if (!tile) return false 
  for (let direction = 0; direction < 4; direction++) {
    let vector = self.getVector(direction);
    let cell   = { x: x + vector.x, y: y + vector.y };

    let other  = self.grid.cellContent(cell);

    if (other && other.value === tile.value) {
      return true;
    }
  }
}

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};
