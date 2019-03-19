const drawcall = window.requestAnimationFrame;

export default class Render {
  constructor(size) {
    const board = Render.createBoard(size, size);

    this.world = document.querySelector(".board");
    this.world.appendChild(board.node);

    this.size  = size;

    this.tileContainer    = board.tile;
    this.scoreContainer   = document.querySelector(".score-container");
    this.bestContainer    = document.querySelector(".best-container");
    this.messageContainer = board.msg;

    this.score = 0;
  }

  draw(grid, metadata) {
    drawcall(() => {
      Render.clearContainer(this.tileContainer);

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
      drawcall(() => {
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
    this.tileContainer.appendChild(wrapper);
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

  static createBoard(width, height) {
    const c = (name, ...classes) => {
      const e = document.createElement(name);
      // eslint-disable-next-line no-restricted-syntax
      for (const cl of classes) {
        e.classList.add(cl);
      }
      return e;
    };

    const board = c("div", "game-container", "board-items");
    const gameMessage = c("div", "game-message");
    const gridContainer = c("div", "grid-container");
    const tileContainer = c("div", "tile-container");

    const lower = c("div", "lower");
    gameMessage.appendChild(lower);

    for (let y = 0; y < height; y += 1) {
      const row = c("div", "grid-row");
      for (let x = 0; x < width; x += 1) {
        const cell = c("div", "grid-cell");
        row.appendChild(cell);
      }
      gridContainer.appendChild(row);
    }

    board.appendChild(gameMessage);
    board.appendChild(gridContainer);
    board.appendChild(tileContainer);

    return {
      node: board,
      msg: gameMessage,
      grid: gridContainer,
      tile: tileContainer
    };
  }
}
