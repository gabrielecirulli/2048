(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Grid", "./Tile"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Grid_1 = require("./Grid");
    var Tile_1 = require("./Tile");
    exports.TileMovementVectors = Object.freeze([
        Object.freeze({ x: 0, y: -1 }),
        Object.freeze({ x: 1, y: 0 }),
        Object.freeze({ x: 0, y: 1 }),
        Object.freeze({ x: -1, y: 0 }) // Left
    ]);
    var GameManager = (function () {
        function GameManager(size, InputManager, Actuator, StorageManager) {
            this.size = size;
            this.size = size; // Size of the _grid
            this._inputManager = new InputManager();
            this._actuator = new Actuator();
            this._storageManager = new StorageManager();
            this.startTiles = 2;
            this._inputManager.on("move", this.move.bind(this));
            this._inputManager.on("restart", this.restart.bind(this));
            this._inputManager.on("keepPlaying", this.keepPlaying.bind(this));
            this.setup();
        }
        Object.defineProperty(GameManager.prototype, "grid", {
            get: function () {
                return this._grid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameManager.prototype, "won", {
            get: function () {
                return this._won;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameManager.prototype, "over", {
            get: function () {
                return this._over;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameManager.prototype, "score", {
            get: function () {
                return this._score;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Restart the game
         */
        GameManager.prototype.restart = function () {
            this._storageManager.clearGameState();
            this._actuator.continueGame(); // Clear the game _won/lost message
            this.setup();
        };
        /**
         * Keep playing after winning (allows going _over 2048)
         */
        GameManager.prototype.keepPlaying = function () {
            this._keepPlaying = true;
            this._actuator.continueGame(); // Clear the game _won/lost message
        };
        Object.defineProperty(GameManager.prototype, "allowKeepPlaying", {
            get: function () {
                return this._keepPlaying;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Return true if the game is lost, or has _won and the user hasn't kept playing
         * @returns {boolean}
         */
        GameManager.prototype.isGameTerminated = function () {
            return this._over || (this._won && !this._keepPlaying);
        };
        Object.defineProperty(GameManager.prototype, "terminated", {
            get: function () {
                return this.isGameTerminated();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Set up the game
         */
        GameManager.prototype.setup = function () {
            var previousState = this._storageManager.getGameState();
            // Reload the game from a previous game if present
            if (previousState) {
                this._grid = new Grid_1.Grid(previousState.grid.size, previousState.grid.cells); // Reload _grid
                this._score = previousState.score;
                this._over = previousState.over;
                this._won = previousState.won;
                this._keepPlaying = previousState.allowKeepPlaying;
            }
            else {
                this._grid = new Grid_1.Grid(this.size);
                this._score = 0;
                this._over = false;
                this._won = false;
                this._keepPlaying = false;
                // Add the initial tiles
                this.addStartTiles();
            }
            // Update the _actuator
            this.actuate();
        };
        /**
         * Set up the initial tiles to start the game with
         */
        GameManager.prototype.addStartTiles = function () {
            for (var i = 0; i < this.startTiles; i++) {
                this.addRandomTile();
            }
        };
        /**
         * Adds a tile in a random position
         */
        GameManager.prototype.addRandomTile = function () {
            var cell = this._grid.randomAvailableCell();
            if (cell) {
                var value = Math.random() < 0.9 ? 2 : 4;
                var tile = new Tile_1.Tile(cell, value);
                this._grid.insertTile(tile);
                return true;
            }
            return false;
        };
        /**
         * Sends the updated _grid to the _actuator
         */
        GameManager.prototype.actuate = function () {
            var sm = this._storageManager;
            if (sm.getBestScore() < this._score) {
                sm.setBestScore(this._score);
            }
            // Clear the state when the game is _over (game _over only, not win)
            if (this._over) {
                sm.clearGameState();
            }
            else {
                sm.setGameState(this.serialize());
            }
            this._actuator.actuate(this._grid, {
                score: this._score,
                over: this._over,
                won: this._won,
                bestScore: sm.getBestScore(),
                terminated: this.isGameTerminated()
            });
        };
        /**
         * Represent the current game as an object
         * @returns {{grid: IGrid, score: number, over: boolean, won: boolean, allowKeepPlaying: boolean}}
         */
        GameManager.prototype.serialize = function () {
            return {
                grid: this._grid.serialize(),
                score: this._score,
                over: this._over,
                won: this._won,
                allowKeepPlaying: this._keepPlaying
            };
        };
        /**
         * Save all tile positions and remove merger info
         */
        GameManager.prototype.prepareTiles = function () {
            this._grid.eachCell(function (x, y, tile) {
                if (tile) {
                    tile.mergedFrom = null;
                    tile.savePosition();
                }
            });
        };
        ;
        /**
         * Move a tile and its representation
         * @param tile
         * @param cell
         */
        GameManager.prototype.moveTile = function (tile, cell) {
            var cells = this._grid.cells;
            cells[tile.x][tile.y] = null;
            cells[cell.x][cell.y] = tile;
            tile.updatePosition(cell);
        };
        // Move tiles on the _grid in the specified direction
        GameManager.prototype.move = function (direction) {
            // 0: up, 1: right, 2: down, 3: left
            var _this = this;
            if (this.isGameTerminated())
                return; // Don't do anything if the game's _over
            var grid = this._grid;
            var cell, tile;
            var vector = exports.TileMovementVectors[direction];
            var traversals = this.buildTraversals(vector);
            var moved = false;
            // Save the current tile positions and remove merger information
            this.prepareTiles();
            // Traverse the _grid in the right direction and move tiles
            traversals.x.forEach(function (x) {
                traversals.y.forEach(function (y) {
                    cell = { x: x, y: y };
                    tile = grid.cellContent(cell);
                    if (tile) {
                        var positions = _this.findFarthestPosition(cell, vector);
                        var next = grid.cellContent(positions.next);
                        // Only one merger per row traversal?
                        if (next && next.value === tile.value && !next.mergedFrom) {
                            var merged = new Tile_1.Tile(positions.next, tile.value * 2);
                            merged.mergedFrom = [tile, next];
                            grid.insertTile(merged);
                            grid.removeTile(tile);
                            // Converge the two tiles' positions
                            tile.updatePosition(positions.next);
                            // Update the _score
                            _this._score += merged.value;
                            // The mighty 2048 tile
                            if (merged.value === 2048)
                                _this._won = true;
                        }
                        else {
                            _this.moveTile(tile, positions.farthest);
                        }
                        if (!positionsEqual(cell, tile)) {
                            moved = true; // The tile moved from its original cell!
                        }
                    }
                });
            });
            if (moved) {
                this.addRandomTile();
                if (!this.movesAvailable()) {
                    this._over = true; // Game _over!
                }
                this.actuate();
            }
        };
        ;
        // Build a list of positions to traverse in the right order
        GameManager.prototype.buildTraversals = function (vector) {
            var traversals = { x: [], y: [] };
            for (var pos = 0; pos < this.size; pos++) {
                traversals.x.push(pos);
                traversals.y.push(pos);
            }
            // Always traverse from the farthest cell in the chosen direction
            if (vector.x === 1)
                traversals.x = traversals.x.reverse();
            if (vector.y === 1)
                traversals.y = traversals.y.reverse();
            return traversals;
        };
        ;
        GameManager.prototype.findFarthestPosition = function (cell, vector) {
            var previous;
            // Progress towards the vector direction until an obstacle is found
            do {
                previous = cell;
                cell = { x: previous.x + vector.x, y: previous.y + vector.y };
            } while (this._grid.withinBounds(cell) &&
                this._grid.cellAvailable(cell));
            return {
                farthest: previous,
                next: cell // Used to check if a merge is required
            };
        };
        ;
        GameManager.prototype.movesAvailable = function () {
            return this._grid.cellsAvailable() || this.tileMatchesAvailable();
        };
        // Check for available matches between tiles (more expensive check)
        GameManager.prototype.tileMatchesAvailable = function () {
            var tile;
            for (var x = 0; x < this.size; x++) {
                for (var y = 0; y < this.size; y++) {
                    tile = this._grid.cellContent({ x: x, y: y });
                    if (tile) {
                        for (var direction = 0; direction < 4; direction++) {
                            var vector = exports.TileMovementVectors[direction];
                            var cell = { x: x + vector.x, y: y + vector.y };
                            var other = this._grid.cellContent(cell);
                            if (other && other.value === tile.value) {
                                return true; // These two tiles can be merged
                            }
                        }
                    }
                }
            }
            return false;
        };
        return GameManager;
    }());
    exports.GameManager = GameManager;
    function positionsEqual(first, second) {
        return first.x === second.x && first.y === second.y;
    }
});
//# sourceMappingURL=GameManager.js.map