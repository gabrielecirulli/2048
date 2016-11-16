(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var HTMLActuator = (function () {
        function HTMLActuator() {
            this.score = 0;
            this.tileContainer = document.querySelector(".tile-container");
            this.scoreContainer = document.querySelector(".score-container");
            this.bestContainer = document.querySelector(".best-container");
            this.messageContainer = document.querySelector(".game-message");
            console.log(this);
        }
        HTMLActuator.prototype.actuate = function (grid, state) {
            var _this = this;
            window.requestAnimationFrame(function () {
                clearContainer(_this.tileContainer);
                grid.cells.forEach(function (column) {
                    column.forEach(function (cell) {
                        if (cell) {
                            _this.addTile(cell);
                        }
                    });
                });
                _this.updateScore(state.score);
                _this.updateBestScore(state.bestScore || 0);
                if (state.terminated) {
                    if (state.over) {
                        _this.message(false); // You lose
                    }
                    else if (state.won) {
                        _this.message(true); // You win!
                    }
                }
            });
        };
        // Continues the game (both restart and keep playing)
        HTMLActuator.prototype.continueGame = function () {
            this.clearMessage();
        };
        HTMLActuator.prototype.addTile = function (tile) {
            var _this = this;
            var wrapper = document.createElement("div");
            var inner = document.createElement("div");
            var position = tile.previousPosition || { x: tile.x, y: tile.y };
            var positionClass = getPositionClass(position);
            // We can't use classlist because it somehow glitches when replacing classes
            var classes = ["tile", "tile-" + tile.value, positionClass];
            if (tile.value > 2048)
                classes.push("tile-super");
            applyClasses(wrapper, classes);
            inner.classList.add("tile-inner");
            inner.textContent = tile.value;
            if (tile.previousPosition) {
                // Make sure that the tile gets rendered in the previous position first
                window.requestAnimationFrame(function () {
                    classes[2] = getPositionClass({ x: tile.x, y: tile.y });
                    applyClasses(wrapper, classes); // Update the position
                });
            }
            else if (tile.mergedFrom) {
                classes.push("tile-merged");
                applyClasses(wrapper, classes);
                // Render the tiles that merged
                tile.mergedFrom.forEach(function (merged) {
                    _this.addTile(merged);
                });
            }
            else {
                classes.push("tile-new");
                applyClasses(wrapper, classes);
            }
            // Add the inner part of the tile to the wrapper
            wrapper.appendChild(inner);
            // Put the tile on the board
            this.tileContainer.appendChild(wrapper);
        };
        HTMLActuator.prototype.updateScore = function (score) {
            console.log(score);
            clearContainer(this.scoreContainer);
            var difference = score - this.score;
            this.score = score;
            this.scoreContainer.textContent = score + "";
            if (difference > 0) {
                var addition = document.createElement("div");
                addition.classList.add("_score-addition");
                addition.textContent = "+" + difference;
                this.scoreContainer.appendChild(addition);
            }
        };
        HTMLActuator.prototype.updateBestScore = function (bestScore) {
            this.bestContainer.textContent = bestScore + "";
        };
        HTMLActuator.prototype.message = function (won) {
            var mc = this.messageContainer;
            mc.classList.add(won ? "game-_won" : "game-_over");
            mc.getElementsByTagName("p")[0].textContent =
                won ? "You win!" : "Game _over!";
        };
        HTMLActuator.prototype.clearMessage = function () {
            // IE only takes one value to remove at a time.
            var cl = this.messageContainer.classList;
            cl.remove("game-_won");
            cl.remove("game-_over");
        };
        return HTMLActuator;
    }());
    exports.HTMLActuator = HTMLActuator;
    function clearContainer(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
    function applyClasses(element, classes) {
        element.setAttribute("class", classes.join(" "));
    }
    function normalizePosition(position) {
        return {
            x: position.x + 1,
            y: position.y + 1
        };
    }
    function getPositionClass(position) {
        position = normalizePosition(position);
        return "tile-position-" + position.x + "-" + position.y;
    }
});
//# sourceMappingURL=HtmlActuator.js.map