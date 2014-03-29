function GameManagerII(size, InputManager, Actuator, StorageManager, Animator, socket, watch) {
    this.size           = size; // Size of the grid
    this.inputManager   = new InputManager;
    this.storageManager = new StorageManager;
    this.actuator       = new Actuator;

    this.watch          = watch ? watch : false;
    this.startTiles     = 2;
    this.moveCount      = 0;

    this.socket = socket.socket;
    this.opponent = null;

    if(!watch) {
        this.inputManager.on("move", this.move.bind(this));
        this.inputManager.on("restart", this.restart.bind(this));
        this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));
    } else {
        this.actuator.setTileContainer('.opponent-game-container .tile-container');
        this.actuator.setScoreContainer('.opponent-game-heading .score-container');
        this.actuator.setGameContainer('.opponent-game-container');
    }

    this.animator = new Animator(this.actuator);
    this.setup(!watch);
}

GameManagerII.prototype = GameManager.prototype;

// Restart the game
GameManagerII.prototype.restart = function () {
    this.socket.emit('left');
    this.storageManager.clearGameState();
    this.actuator.continueGame(); // Clear the game won/lost message
    this.setup(!this.watch);
    this.opponent.grid = new Grid(this.size);
    this.opponent.setup(this.watch);
    this.opponent.actuate();
};

// Adds a tile in a random position
GameManager.prototype.addRandomTile = function () {
    if (this.grid.cellsAvailable()) {
        var value = Math.random() < 0.9 ? 2 : 4;
        var tile = new Tile(this.grid.randomAvailableCell(), value);

        this.grid.insertTile(tile);
        return tile;
    }
};

// Set up the game
GameManagerII.prototype.setup = function (playable) {

    // Reload the game from a previous game if present
    this.grid        = new Grid(this.size);
    this.score       = 0;
    this.over        = false;
    this.won         = false;
    this.keepPlaying = false;

    if(playable) {
        // Add the initial tiles
        this.addStartTiles();

        // Update the actuator
        this.actuate();
        this.socket.emit('gameInitialized', this.grid);
    }
};

// Move tiles on the grid in the specified direction
GameManagerII.prototype.move = function (direction, newTile) {
    // 0: up, 1: right, 2: down, 3: left
    var self = this;

    if (this.isGameTerminated()) return; // Don't do anything if the game's over

    var cell, tile;

    var vector     = this.getVector(direction);
    var traversals = this.buildTraversals(vector);
    var moved      = false;

    // Save the current tile positions and remove merger information
    this.prepareTiles();

    // Traverse the grid in the right direction and move tiles
    traversals.x.forEach(function (x) {
        traversals.y.forEach(function (y) {
            cell = { x: x, y: y };
            tile = self.grid.cellContent(cell);

            if (tile) {
                var positions = self.findFarthestPosition(cell, vector);
                var next      = self.grid.cellContent(positions.next);

                // Only one merger per row traversal?
                if (next && next.value === tile.value && !next.mergedFrom) {
                    var merged = new Tile(positions.next, tile.value * 2);
                    merged.mergedFrom = [tile, next];

                    self.grid.insertTile(merged);
                    self.grid.removeTile(tile);

                    // Converge the two tiles' positions
                    tile.updatePosition(positions.next);

                    // Update the score
                    self.score += merged.value;

                    // The mighty 2048 tile
                    if (merged.value === 2048) self.won = true;
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
        if(this.watch) {
            this.grid.insertTile(new Tile(newTile, newTile.value));
        } else {
            var tile = this.addRandomTile();
            this.socket.emit('moved', {direction: direction, newTile: tile});
        }

        if (!this.movesAvailable()) {
            this.over = true; // Game over!
        }
        this.transform();
        this.actuate();
    }
};

GameManagerII.prototype.transform = function() {

    if(!this.score || !this.opponent.score) return;

    var win = this.score - this.opponent.score;
    var winningScore = win > 0 ? this.score : this.opponent.score;
    var ratioMod =  win > 0 ? (win + 10000) / (this.score + 10000) : (Math.abs(win) + 10000) / (this.opponent.score + 10000);
    var ratio = 1;

    if(win === 0) {
        this.animator.shrink(1);
        this.opponent.animator.shrink(1);
        this.animator.fade(1);
        this.opponent.animator.fade(1);
    } else if (win > 0) {
        ratio = (this.opponent.score + 100) / (this.score + 100);
        this.opponent.animator.shrink(ratio * ratioMod);
        this.opponent.animator.fade(ratio * ratioMod);
        this.animator.shrink(1);
        this.animator.fade(1);
    } else {
        ratio = (this.score + 100) / (this.opponent.score + 100);
        this.opponent.animator.shrink(1);
        this.opponent.animator.fade(1);
        this.animator.shrink(ratio * ratioMod);
        this.animator.fade(ratio * ratioMod);
    }

}
