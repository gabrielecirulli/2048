function HTMLActuator() {
  this.tileContainer      = document.querySelector(".tile-container");
  this.scoreContainer     = document.querySelector(".score-container");
  this.bestContainer      = document.querySelector(".best-container");
  this.bestTimeContainer  = document.querySelector(".best-time-container");
  this.messageContainer   = document.querySelector(".game-message");
  this.stopwatchContainer = document.querySelector("#stopwatch");
  window.stopwatchTimer   = new Stopwatch(HTMLActuator.prototype.updateTime,1000);
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
    self.updateBestTime(metadata.bestTime, metadata.won);

    if (metadata.terminated) {
      window.stopwatchTimer.stop(); 
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

HTMLActuator.prototype.startCountdown = function (container) {
	// window.intervalId = setInterval(this.updateTime, 1000);
  window.stopwatchTimer.reset();
  window.stopwatchTimer.start();
};

HTMLActuator.prototype.updateTime = function () {
	var stopwatch = document.getElementById("stopwatch");
  stopwatch.textContent = window.stopwatchTimer.toString();
  // updateBestTime(stopwatch.textContent, false);
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

HTMLActuator.prototype.updateBestTime = function (bestTime, won) {

  this.bestTimeContainer.textContent = bestTime;

  if (!window.timedGame) {
    this.bestTimeContainer.textContent = bestTime;
    return;
  }

  // Update best time only if the game is won
  // Everyone can lose the game in a couple of seconds :) 
  if (won) {
    var stopwatchContainerValue = this.stopwatchContainer.textContent;
    var stopwatchTimestamp = Date.parse("1970-01-01 ".concat(stopwatchContainerValue));
    var bestTimeTimestamp  = Date.parse("1970-01-01 ".concat(bestTime));

    // Compare the two timestamps and decide if the player has broken his/her record time.
    // But if the timestamp is 00:00:00 then this means the user has no record till now
    // so there is no point of restricting the update
    if (stopwatchTimestamp <= bestTimeTimestamp || bestTime === "00:00:00") {
     this.bestTimeContainer.textContent = stopwatchContainerValue;
    } 
  }
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

HTMLActuator.prototype.getBestTimeContainerText = function() {
  return this.bestTimeContainer.textContent;
}