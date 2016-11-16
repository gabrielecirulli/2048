(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Tile"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Tile_1 = require("./Tile");
    var Grid = (function () {
        function Grid(size, previousState) {
            this.size = size;
            this.cells = previousState
                ? this.fromState(previousState)
                : this.empty();
        }
        Grid.fill = function (size, factory) {
            var cells = [];
            for (var x = 0; x < size; x++) {
                cells[x] = [];
                var row = cells[x];
                for (var y = 0; y < size; y++) {
                    row.push(factory ? factory(x, y) : null);
                }
            }
            return cells;
        };
        /**
         * Build a _grid of the specified size
         * @returns {Array}
         */
        Grid.prototype.empty = function () {
            return Grid.fill(this.size);
        };
        Grid.prototype.fromState = function (state) {
            return Grid.fill(this.size, function (x, y) {
                var tile = state[x][y];
                return tile && new Tile_1.Tile(tile.position, tile.value);
            });
        };
        /**
         * Find the first available random position
         * @returns {IPoint2D}
         */
        Grid.prototype.randomAvailableCell = function () {
            var cells = this.availableCells();
            return cells.length
                ? cells[Math.floor(Math.random() * cells.length)]
                : null;
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
        /**
         * Call callback for every cell
         * @param callback
         */
        Grid.prototype.eachCell = function (callback) {
            var size = this.size;
            for (var x = 0; x < size; x++) {
                for (var y = 0; y < size; y++) {
                    if (callback(x, y, this.cells[x][y]) === false)
                        return;
                }
            }
        };
        /**
         * Check if there are any cells available
         * @returns {boolean}
         */
        Grid.prototype.cellsAvailable = function () {
            var available = false;
            this.eachCell(function (x, y, tile) {
                if (!tile) {
                    available = true;
                    return false; // causes enumeration to stop.
                }
            });
            return available;
        };
        /**
         * Check if the specified cell is taken
         * @param cell
         * @returns {boolean}
         */
        Grid.prototype.cellAvailable = function (cell) {
            return !this.cellOccupied(cell);
        };
        Grid.prototype.cellOccupied = function (cell) {
            return !!this.cellContent(cell);
        };
        Grid.prototype.cellContent = function (x, y) {
            if (y === void 0) { y = NaN; }
            if (typeof x != "number") {
                y = x.y;
                x = x.x;
            }
            return this.withinBounds(x, y)
                ? this.cells[x][y]
                : null;
        };
        /**
         * Inserts a tile at its position
         * @param tile
         */
        Grid.prototype.insertTile = function (tile) {
            this.cells[tile.x][tile.y] = tile;
        };
        Grid.prototype.removeTile = function (x, y) {
            if (y === void 0) { y = NaN; }
            if (typeof x != "number") {
                y = x.y;
                x = x.x;
            }
            this.cells[x][y] = null;
        };
        Grid.prototype.withinBounds = function (x, y) {
            if (y === void 0) { y = NaN; }
            if (typeof x != "number") {
                y = x.y;
                x = x.x;
            }
            return x >= 0 && y >= 0
                && x < this.size
                && y < this.size;
        };
        Grid.prototype.serialize = function () {
            var _this = this;
            var size = this.size;
            return {
                size: size,
                cells: Grid.fill(size, function (x, y) {
                    var tile = _this.cells[x][y];
                    return tile ? tile.serialize() : null;
                })
            };
        };
        return Grid;
    }());
    exports.Grid = Grid;
});
//# sourceMappingURL=grid.js.map