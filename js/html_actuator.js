export class HTMLActuator {
  constructor() {
    this.tileContainer    = document.querySelectorAll(".tile-container");
    this.scoreContainer   = document.querySelector(".score-container");
    this.bestContainer    = document.querySelector(".best-container");
    this.messageContainer = document.querySelector(".game-message");

    this.score = 0;
  }

  actuate(grid, metadata) {
    var self = this;

    window.requestAnimationFrame(function () {
      self.tileContainer.forEach(function (container) {
        self.clearContainer(container);
      });

      grid.cells.forEach(function (column) {
        column.forEach(function (cell) {
          if (cell) {
            self.addTile(cell);
          }
        });
      });

      self.updateScore(metadata.score);
      self.updateBestScore(metadata.bestScore);

      if (metadata.terminated) {
        if (metadata.over) {
          self.message(false); // You lose
        } else if (metadata.won) {
          self.message(true); // You win!
        }
      }

    });
  }

  // Continues the game (both restart and keep playing)
  continueGame() {
    this.clearMessage();
  }

  clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  addTile(tile) {
    var self = this;

    this.tileContainer.forEach(function (container) {
      var wrapper   = document.createElement("div");
      var inner     = document.createElement("div");
      var position  = tile.previousPosition || { x: tile.x, y: tile.y }
      var positionClass = self.positionClass(position);

      // We can't use classlist because it somehow glitches when replacing classes
      var classes = ["tile", "tile-" + tile.value, positionClass];

      if (tile.value > 2048) classes.push("tile-super");

      self.applyClasses(wrapper, classes);

      inner.classList.add("tile-inner");
      inner.textContent = tile.value;

      if (tile.previousPosition) {
        // Make sure that the tile gets rendered in the previous position first
        window.requestAnimationFrame(function () {
          classes[2] = self.positionClass({ x: tile.x, y: tile.y });
          self.applyClasses(wrapper, classes); // Update the position
        });
      } else if (tile.mergedFrom) {
        classes.push("tile-merged");
        self.applyClasses(wrapper, classes);

        // Render the tiles that merged
        tile.mergedFrom.forEach(function (merged) {
          self.addTile(merged);
        });
      } else {
        classes.push("tile-new");
        self.applyClasses(wrapper, classes);
      }

      // Add the inner part of the tile to the wrapper
      wrapper.appendChild(inner);

      // Put the tile on the board
      container.appendChild(wrapper);
    });
  }

  applyClasses(element, classes) {
    element.setAttribute("class", classes.join(" "));
  }

  normalizePosition(position) {
    return { x: position.x + 1, y: position.y + 1 }
  }

  positionClass(position) {
    position = this.normalizePosition(position);
    return "tile-position-" + position.x + "-" + position.y;
  }

  updateScore(score) {
    this.clearContainer(this.scoreContainer);

    var difference = score - this.score;
    this.score = score;

    this.scoreContainer.textContent = this.score;

    if (difference > 0) {
      var addition = document.createElement("div");
      addition.classList.add("score-addition");
      addition.textContent = "+" + difference;

      this.scoreContainer.appendChild(addition);
    }
  }

  updateBestScore(bestScore) {
    this.bestContainer.textContent = bestScore;
  }

  message(won) {
    var type    = won ? "game-won" : "game-over";
    var message = won ? "You win!" : "Game over!";

    this.messageContainer.classList.add(type);
    this.messageContainer.getElementsByTagName("p")[0].textContent = message;
  }

  clearMessage() {
    // IE only takes one value to remove at a time.
    this.messageContainer.classList.remove("game-won");
    this.messageContainer.classList.remove("game-over");
  }
}