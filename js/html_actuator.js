function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");
  this.sharingContainer = document.querySelector(".score-sharing");
  this.announcer        = document.querySelector(".announcer");
  this.gameContainer    = document.querySelector('.game-container')
  this.rotateButton     = document.querySelector(".rotate-button");
  this.boardContainer   = document.querySelector(".board-container");

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
HTMLActuator.prototype.continue = function () {
  if (typeof ga !== "undefined") {
    ga("send", "event", "game", "restart");
  }

  // Reset board rotate status
  this.boardContainer.classList.remove('got-gif');
  this.boardContainer.classList.remove('rotated');

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
  inner.textContent = tile.wangValue;

  // Some percent chance of seeing a flipped number
  if (Math.random() > 0.993) {
    inner.classList.add("flipped");
  }

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

  // Fit numberwang values
  var wangLength = String(tile.wangValue).length
  if (wangLength >= 3) {
    if (wangLength > 6) {
      wangLength = 6;
    }
    classes.push("tile-small-" + wangLength);
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
  this.clearContainer(this.announcer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = _randomScore();

    this.scoreContainer.appendChild(addition);
  }

  if (!this.announcer.hasChildNodes() && Math.random() > 0.9 && score > 8 ) {
    this.announce()
    // multiple unreleated animationEnd events might fire
    // before rotate is done so setTimeout instead
    setTimeout(this.clearContainer.bind(this,this.announcer),3000);
  }

  function _randomScore() {
    var random = Math.random(),
        sign = "+",
        wang = Math.ceil(Math.random() * (difference - (difference/2)) * 4);

    // Decimal number
    if (random > 0.94) {
      wang = wang.toString() + '.' + Math.ceil(Math.random() * 9).toString();
    }
    // Negative number
    else if (random < 0.04) {
      sign = '-';
    }
    // Zero
    else if (random > 0.46 && random < 0.465) {
      wang = 0;
    }
    // Hundred digit number
    else if (random > 0.09 && random < 0.12) {
      wang = wang + Math.floor(Math.random() * 1000);
    }
    // Four digit number
    else if (random > 0.05 && random < 0.08) {
      wang = wang + Math.floor(Math.random() * 10000);
    }
    // Five digit number
    else if (random > 0.080 && random < 0.082) {
      wang = wang + Math.floor(Math.random() * 100000);
    }
    // Six digit number
    else if (random > 0.085 && random < 0.086) {
      wang = wang + Math.floor(Math.random() * 1000000);
    }
    return sign + wang;
  }

  // Once player hits a score threshold, go get a random GIF and start tee-ing up for board rotate
  if (!this.boardContainer.classList.contains('got-gif') && score > 1500) {
    var request = new XMLHttpRequest(),
        self = this.boardContainer;

    request.onload = loadGif;
    request.open('GET', 'http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC', true);
    request.send(null);

    function loadGif () {
      var response = this.responseText,
          json = JSON.parse(response),
          imageUrl = json.data.image_url;

      document.querySelector('.behind-board').style.backgroundImage = "url('" + imageUrl + "')";
      self.classList.add('got-gif');
    }
  }

  // Once player hits a score threshold, some percent chance that board will rotate
  if (!this.boardContainer.classList.contains('rotated') && Math.random() > 0.95 && score > 3100) {
    this.boardContainer.classList.add('rotate');
    this.boardContainer.classList.add('rotated');

    //this.announce("It’s time for Wangernumb. Let’s rotate the board!");
    this.announce("Let’s rotate the board!");
    var self = this
    setTimeout(function () {
      self.boardContainer.classList.remove('rotate');
      // self.announce("Welcome back!");
    }, 8000) // Match this number to rotate time of CSS
  }

};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  this.clearContainer(this.announcer);

  var type    = won ? "game-won" : "game-over";
  var message = won ? "You’re the Numberwang!" : "You’ve been Wangernumbed!";

  if (typeof ga !== "undefined") {
    ga("send", "event", "game", "end", type, this.score);
  }

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;

  this.clearContainer(this.sharingContainer);
  this.sharingContainer.appendChild(this.scoreTweetButton());
  twttr.widgets.load();
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};

HTMLActuator.prototype.scoreTweetButton = function () {
  var tweet = document.createElement("a");
  tweet.classList.add("twitter-share-button");
  tweet.setAttribute("href", "https://twitter.com/share");
  tweet.setAttribute("data-via", "saikofish");
  tweet.setAttribute("data-url", "http://bit.ly/1pg9uRF");
  tweet.setAttribute("data-counturl", "http://louh.github.io/2048-numberwang/");
  tweet.textContent = "Tweet";

  var text = "I am the Numberwang! #2048numberwang";
  tweet.setAttribute("data-text", text);

  return tweet;
};

HTMLActuator.prototype.announce = function (message) {
  message = message || "That’s Numberwang!";
  var announce = document.createElement("p");
  announce.classList.add("announcement");
  announce.textContent = message;
  this.announcer.appendChild(announce);
};

/*
// Manual rotate button is disabled
HTMLActuator.prototype.rotate = function () {
  this.boardContainer.classList.add('rotate');
  this.rotateButton.textContent = "Board rotated!"
}
*/
