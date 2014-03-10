function HTMLActuator() {
  this.tileContainer    = document.getElementsByClassName("tile-container")[0];
  this.scoreContainer   = document.getElementsByClassName("score-container")[0];
  this.messageContainer = document.getElementsByClassName("game-message")[0];

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

    if (metadata.over) self.message(false); // You lose
    if (metadata.won) self.message(true); // You win!
  });
};

HTMLActuator.prototype.restart = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var element   = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  positionClass = this.positionClass(position);

  element.classList.add("tile", "tile-" + tile.value, positionClass);
  element.textContent = tile.value;

  this.tileContainer.appendChild(element);

  if (tile.previousPosition) {
    window.requestAnimationFrame(function () {
      element.classList.remove(element.classList[2]);
      element.classList.add(self.positionClass({ x: tile.x, y: tile.y }));
    });
  } else if (tile.mergedFrom) {
    element.classList.add("tile-merged");
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    element.classList.add("tile-new");
  }
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

HTMLActuator.prototype.message = function (won) {
  if (ga) ga("send", "event", "game", "end", type, this.score);

  var type    = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!"

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  this.messageContainer.classList.remove("game-won", "game-over");
};
