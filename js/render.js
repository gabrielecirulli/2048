export default class Render {
  constructor() {
    this.tileContainer    = document.querySelectorAll(".tile-container");
    this.scoreContainer   = document.querySelector(".score-container");
    this.bestContainer    = document.querySelector(".best-container");
    this.messageContainer = document.querySelector(".game-message");

    this.score = 0;
  }

  draw(grid, metadata) {
    window.requestAnimationFrame(() => {
      this.tileContainer.forEach((container) => {
        Render.clearContainer(container);
      });

      grid.cells.forEach((column) => {
        column.forEach((cell) => {
          if (cell) {
            this.addTile(cell);
          }
        });
      });

      this.updateScore(metadata.score);
      this.updateBestScore(metadata.bestScore);

      if (metadata.terminated) {
        if (metadata.over) {
          this.message(false); // You lose
        } else if (metadata.won) {
          this.message(true); // You win!
        }
      }
    });
  }

  // Continues the game (both restart and keep playing)
  continueGame() {
    this.clearMessage();
  }

  static clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  addTile(tile) {
    this.tileContainer.forEach((container) => {
      const wrapper   = document.createElement("div");
      const inner     = document.createElement("div");
      const position  = tile.previousPosition || { x: tile.x, y: tile.y };
      const positionClass = Render.positionClass(position);

      // We can't use classlist because it somehow glitches when replacing classes
      const classes = ["tile", `tile-${tile.value}`, positionClass];

      if (tile.value > 2048) classes.push("tile-super");

      Render.applyClasses(wrapper, classes);

      inner.classList.add("tile-inner");
      inner.textContent = tile.value;

      if (tile.previousPosition) {
        // Make sure that the tile gets rendered in the previous position first
        window.requestAnimationFrame(() => {
          classes[2] = Render.positionClass({ x: tile.x, y: tile.y });
          Render.applyClasses(wrapper, classes); // Update the position
        });
      } else if (tile.mergedFrom) {
        classes.push("tile-merged");
        Render.applyClasses(wrapper, classes);

        // Render the tiles that merged
        tile.mergedFrom.forEach((merged) => {
          this.addTile(merged);
        });
      } else {
        classes.push("tile-new");
        Render.applyClasses(wrapper, classes);
      }

      // Add the inner part of the tile to the wrapper
      wrapper.appendChild(inner);

      // Put the tile on the board
      container.appendChild(wrapper);
    });
  }

  static applyClasses(element, classes) {
    element.setAttribute("class", classes.join(" "));
  }

  static normalizePosition(position) {
    return { x: position.x + 1, y: position.y + 1 };
  }

  static positionClass(pos) {
    const n = this.normalizePosition(pos);
    return `tile-position-${n.x}-${n.y}`;
  }

  updateScore(score) {
    Render.clearContainer(this.scoreContainer);

    const difference = score - this.score;
    this.score = score;

    this.scoreContainer.textContent = this.score;

    if (difference > 0) {
      const addition = document.createElement("div");
      addition.classList.add("score-addition");
      addition.textContent = `+${difference}`;

      this.scoreContainer.appendChild(addition);
    }
  }

  updateBestScore(bestScore) {
    this.bestContainer.textContent = bestScore;
  }

  message(won) {
    const type    = won ? "game-won" : "game-over";
    const message = won ? "You win!" : "Game over!";

    this.messageContainer.classList.add(type);
    this.messageContainer.getElementsByTagName("p")[0].textContent = message;
  }

  clearMessage() {
    // IE only takes one value to remove at a time.
    this.messageContainer.classList.remove("game-won");
    this.messageContainer.classList.remove("game-over");
  }
}
