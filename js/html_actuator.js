var BEATLES_ALBUMS = {
  2: {
    title: "Please Please Me",
    image: "https://upload.wikimedia.org/wikipedia/en/2/2e/Please_Please_Me.png"
  },
  4: {
    title: "With the Beatles",
    image: "https://upload.wikimedia.org/wikipedia/en/5/52/With_the_Beatles.png"
  },
  8: {
    title: "A Hard Day's Night",
    image: "https://upload.wikimedia.org/wikipedia/en/e/e6/HardDayUK.jpg"
  },
  16: {
    title: "Beatles for Sale",
    image: "https://upload.wikimedia.org/wikipedia/en/4/40/Beatlesforsale.jpg"
  },
  32: {
    title: "Help!",
    image: "https://upload.wikimedia.org/wikipedia/en/d/d7/The_Beatles_-_Help%21.png"
  },
  64: {
    title: "Rubber Soul",
    image: "https://upload.wikimedia.org/wikipedia/en/5/5b/Rubber_Soul.png"
  },
  128: {
    title: "Revolver",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/M%26Prevolver.jpg/330px-M%26Prevolver.jpg"
  },
  256: {
    title: "Sgt. Pepper's Lonely Hearts Club Band",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Sgt._Pepper%27s_Lonely_Hearts_Club_Band_album_art.jpg/330px-Sgt._Pepper%27s_Lonely_Hearts_Club_Band_album_art.jpg"
  },
  512: {
    title: "The Beatles (White Album)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/TheBeatles68LP.jpg/330px-TheBeatles68LP.jpg"
  },
  1024: {
    title: "Yellow Submarine",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/TheBeatles-YellowSubmarinealbumcover.jpg/330px-TheBeatles-YellowSubmarinealbumcover.jpg"
  },
  2048: {
    title: "Abbey Road",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/The_Beatles_Abbey_Road_album_cover.jpg/330px-The_Beatles_Abbey_Road_album_cover.jpg"
  },
  4096: {
    title: "Let It Be",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/The_Beatles_-_Let_It_Be.png/330px-The_Beatles_-_Let_It_Be.png"
  }
};

function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
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
  var label     = document.createElement("span");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);
  var album = BEATLES_ALBUMS[tile.value] || BEATLES_ALBUMS[4096];

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 2048) classes.push("tile-super");

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  inner.style.backgroundImage = "url(" + album.image + ")";
  label.classList.add("tile-label");
  label.textContent = tile.value;
  wrapper.setAttribute("role", "img");
  wrapper.setAttribute("aria-label", tile.value + " - " + album.title + " album cover");
  wrapper.title = album.title;
  inner.appendChild(label);

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
