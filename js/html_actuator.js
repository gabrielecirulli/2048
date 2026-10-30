function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.trailContainer   = document.querySelector(".trail-container");
  this.effectContainer  = document.querySelector(".effect-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

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
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 2048) classes.push("tile-super");

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  inner.textContent = tile.value;

  if (tile.previousPosition) {
    this.addTrail(tile);

    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });

    this.addBurst(tile);
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

// Leave a fading light trail behind a tile as it slides across the grid
HTMLActuator.prototype.addTrail = function (tile) {
  var from  = tile.previousPosition;
  var dx    = tile.x - from.x;
  var dy    = tile.y - from.y;
  var cells = Math.abs(dx) + Math.abs(dy);

  if (!cells) return;

  var direction = dx > 0 ? "right" : dx < 0 ? "left" : dy > 0 ? "down" : "up";
  var trail     = this.createEffect(tile.value, from, "trail-" + direction);
  var axis      = document.createElement("div");
  var beam      = document.createElement("div");

  trail.style.setProperty("--cells", cells);
  axis.classList.add("trail-axis");
  beam.classList.add("trail-beam");

  axis.appendChild(beam);
  trail.appendChild(axis);
  this.trailContainer.appendChild(trail);
  this.removeLater(trail, 700);
};

// Shatter merging tiles into glowing fragments, like a derezzed program
HTMLActuator.prototype.addBurst = function (tile) {
  var burst  = this.createEffect(tile.value, tile, "tile-burst");
  var ring   = document.createElement("div");
  var shards = tile.value >= 2048 ? 28 : tile.value >= 128 ? 18 : 12;

  ring.classList.add("burst-ring");
  burst.appendChild(ring);

  for (var i = 0; i < shards; i++) {
    burst.appendChild(this.createShard(i / shards));
  }

  this.effectContainer.appendChild(burst);
  this.removeLater(burst, 1200);
};

// Distances are in tile widths, so the effect scales with the board
HTMLActuator.prototype.createShard = function (turn) {
  var shard = document.createElement("div");
  var angle = (turn + Math.random() * 0.08) * Math.PI * 2;
  var start = 0.15 + Math.random() * 0.25;
  var reach = 0.55 + Math.random() * 0.5;
  var style = shard.style;

  shard.classList.add("burst-shard");
  style.setProperty("--sx", (Math.cos(angle) * start).toFixed(3));
  style.setProperty("--sy", (Math.sin(angle) * start).toFixed(3));
  style.setProperty("--dx", (Math.cos(angle) * reach).toFixed(3));
  style.setProperty("--dy", (Math.sin(angle) * reach).toFixed(3));
  style.setProperty("--spin", Math.round(Math.random() * 540 - 270) + "deg");
  style.setProperty("--size", (0.04 + Math.random() * 0.06).toFixed(3));
  style.animationDuration = Math.round(450 + Math.random() * 350) + "ms";

  return shard;
};

HTMLActuator.prototype.createEffect = function (value, position, type) {
  var element = document.createElement("div");
  var classes = ["tile-fx", type, "tile-" + value,
                 this.positionClass(position)];

  if (value > 2048) classes.push("tile-super");

  this.applyClasses(element, classes);
  return element;
};

HTMLActuator.prototype.removeLater = function (element, delay) {
  window.setTimeout(function () {
    if (element.parentNode) element.parentNode.removeChild(element);
  }, delay);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
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
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "Portal reached" : "Derezzed";

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
