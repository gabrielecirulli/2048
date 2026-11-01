function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");

  this.score = 0;

  var self = this;
  var storage = new LocalStorageManager().storage;
  var numeralSelect = document.querySelector("#numeral-system");

  this.numeralSystem = storage.getItem("numeralSystem") ||
    (storage.getItem("easternArabicNumerals") === "true" ? "eastern-arabic" : "regular");
  if (["regular", "eastern-arabic", "chinese"].indexOf(this.numeralSystem) === -1) {
    this.numeralSystem = "regular";
  }
  numeralSelect.value = this.numeralSystem;
  this.updateNumbers();

  numeralSelect.addEventListener("change", function () {
    self.numeralSystem = numeralSelect.value;
    storage.setItem("numeralSystem", self.numeralSystem);
    self.updateNumbers();
  });
}

HTMLActuator.prototype.setNumber = function (element, value) {
  var digitSets = {
    "eastern-arabic": "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669",
    "chinese": "\u3007\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d"
  };
  var digits = digitSets[this.numeralSystem];
  var text = String(value);

  element.setAttribute("data-number", text);
  element.textContent = digits ? text.replace(/[0-9]/g, function (digit) {
    return digits.charAt(Number(digit));
  }) : text;
};

HTMLActuator.prototype.updateNumbers = function () {
  document.documentElement.setAttribute("data-numeral-system", this.numeralSystem);
  var elements = document.querySelectorAll("[data-number]");

  for (var index = 0; index < elements.length; index++) {
    this.setNumber(elements[index], elements[index].getAttribute("data-number"));
  }
};

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
  this.setNumber(inner, tile.value);

  if (tile.previousPosition) {
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
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
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

  var scoreValue = document.createElement("span");
  this.setNumber(scoreValue, this.score);
  this.scoreContainer.appendChild(scoreValue);

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    this.setNumber(addition, "+" + difference);

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.setNumber(this.bestContainer, bestScore);
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
