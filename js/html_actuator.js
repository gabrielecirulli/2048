function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");
  this.firstMove        = document.querySelector("#first-move");
  this.numMoves         = document.querySelector("#num-moves");
  //this.lastMoveNum = 0; // might be interesting if we get to permitting multiple moves between display updates
  //this.lastExponent = 1;
  this.mergeHist = document.querySelector("#stats-table");

  this.score = 0;
  // Need to provide a way for the user to select a locale they like.
  this.dtf = new Intl.DateTimeFormat("en-US", {
    weekday: 'short',
    year   : 'numeric',
    month  : 'short',
    day    : 'numeric',
    hour   : 'numeric',
    minute : 'numeric',
    second : 'numeric'
  });
}

HTMLActuator.prototype.display = function (mergeData, exponent, map) {
  var self = this.GM.actuator;

  var mergeDate   = mergeData[0];
  var numMoves    = mergeData[1];
  var predict     = mergeData[2] || false;
  var numThisTile = mergeData[3] || '';
  var vlu         = Math.pow(2, exponent);
  var value       = self.translateValue(vlu);

  var row       = document.createElement("tr");
  row.className = "merge-row";
  if (predict) row.classList.add("predict");

  // Number of each tile visible on the board
  var th = document.createElement("th");
  th.className = "numTiles right";
  th.appendChild(document.createTextNode(numThisTile));
  row.appendChild(th);

  // Tile-like display, e.g. 1/4G
  th           = document.createElement("th");
  th.className = "tile-" + exponent;
  th.appendChild(document.createTextNode(value.v + value.c));
  row.appendChild(th);

  // Two to the power of whatever
  var td       = document.createElement("td");
  td.className = "left";
  td.appendChild(document.createTextNode("2"));
  var sup = document.createElement("sup");
  sup.appendChild(document.createTextNode(exponent));
  td.appendChild(sup);
  row.appendChild(td);

  // Value
  td = document.createElement("td");
  td.appendChild(document.createTextNode(vlu.toLocaleString()));
  row.appendChild(td);

  // Timestamp of this merge
  td = document.createElement("td");
  td.appendChild(document.createTextNode(self.dtf.format(mergeDate)));
  row.appendChild(td);

  // Difference from start to this timestamp
  td           = document.createElement("td");
  td.className = "left";
  td.appendChild(document.createTextNode(self.formatDateDiff(mergeDate - self.firstMoveDate)));
  row.appendChild(td);

  // Number of moves
  td = document.createElement("td");
  td.appendChild(document.createTextNode(numMoves.toLocaleString()));
  row.appendChild(td);

  self.mergeHist.appendChild(row);
};

HTMLActuator.prototype.formatDateDiff = function (diff) {
  var d = diff;
  if (d <= 900) return '≈ ' + d.toLocaleString() + ' millisecond' + (d > 1 ? 's' : '');
  d = Math.round(diff / 1000);
  if (d <= 54) return '≈ ' + d.toLocaleString() + ' second' + (d > 1 ? 's' : '');
  d = Math.round(diff / 1000 / 60);
  if (d <= 54) return '≈ ' + d.toLocaleString() + ' minute' + (d > 1 ? 's' : '');
  d = Math.round(diff / 1000 / 60 / 60);
  if (d <= 21) return '≈ ' + d.toLocaleString() + ' hour' + (d > 1 ? 's' : '');
  d = Math.round(diff / 1000 / 60 / 60 / 24);
  if (d <= 7) return '≈ ' + d.toLocaleString() + ' day' + (d > 1 ? 's' : '');
  d = Math.round(diff / 1000 / 60 / 60 / 24 / 7);
  if (d <= 3) return '≈ ' + d.toLocaleString() + ' week' + (d > 1 ? 's' : '');
  d = Math.round(diff / 1000 / 60 / 60 / 24 / 30);
  if (d <= 11) return '≈ ' + d.toLocaleString() + ' month' + (d > 1 ? 's' : '');
  d = Math.round(diff / 1000 / 60 / 60 / 24 / 365);
  return '≈ ' + d.toLocaleString() + ' year' + (d > 1 ? 's' : '');
};

HTMLActuator.prototype.clearMergeHistoryDisplay = function () {
  var list = document.querySelectorAll('.merge-row');
  for (var i = 0; i < list.length; ++i) {
    this.mergeHist.removeChild(list[i]);
  }
};

function predictTimes(mergeHistory, numTiles) {
  if (mergeHistory.size == 0) return mergeHistory;
  var self   = this.GM.actuator;
  var result = new Map(mergeHistory);
  mergeHistory.forEach(function (val, key, map) {
    val[2] = false;
    val[3] = numTiles[key];
    result.set(key, val);
  })
  var lastExp   = [...result.keys()][result.size - 1];
  var lastDate  = result.get(lastExp)[0];
  var lastMove  = result.get(lastExp)[1];
  var timeDelta = lastDate - self.firstMoveDate;
  for (var i = lastExp + 1; i <= 38; i++) {
    lastMove *= 2;
    timeDelta *= 2;
    result.set(i, [self.firstMoveDate + timeDelta, lastMove, true]);
  }
  return result;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self           = this;
  self.firstMoveDate = metadata.firstMove;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    var numTiles = [];
    var cellExp  = 0;

    grid.cells.forEach(function (column) {
      column.filter(function (cell) { return cell; }).forEach(function (cell) {
        self.addTile(cell);
        cellExp           = Math.log2(cell.value);
        numTiles[cellExp] = (numTiles[cellExp] || 0) + 1;
      });
    });

    self.updateScore(metadata.score);
    self.bestContainer.textContent = metadata.bestScore.toLocaleString();
    self.numMoves.textContent      = metadata.numMoves.toLocaleString();
    self.firstMove.textContent     = metadata.numMoves > 0 ? self.dtf.format(metadata.firstMove) : "";
    self.clearMergeHistoryDisplay();
    predictTimes(metadata.mergeHistory, numTiles).forEach(self.display);

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

HTMLActuator.prototype.promote = function (unit) {
  switch (unit) {
    case '' :
      return 'K';
    case 'K' :
      return 'M';
    case 'M' :
      return 'G';
    case 'G' :
      return 'T';
    case 'T' :
      return 'P';
    case 'P' :
      return 'E';
    case 'E' :
      return 'Z';
    case 'Z' :
      return 'Y';
    default :
      return 'a lot & a lot'
  }
};

HTMLActuator.prototype.translateValue = function (value) {
  if (value < 128) {
    return {v: value, c: ''};
  } else if (value == 128) {
    return {v: '⅛', c: 'K'}
  } else if (value == 256) {
    return {v: '¼', c: 'K'}
  } else if (value == 512) {
    return {v: '½', c: 'K'}
  } else {
    v = this.translateValue(value / 1024);
    return {v: v.v, c: this.promote(v.c)};
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper       = document.createElement("div");
  var inner         = document.createElement("div");
  var position      = tile.previousPosition || {x: tile.x, y: tile.y};
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + Math.log2(tile.value), positionClass];
  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  textVal           = self.translateValue(tile.value);
  inner.textContent = textVal.v + textVal.c;

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({x: tile.x, y: tile.y});
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
  return {x: position.x + 1, y: position.y + 1};
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score     = score;

  this.scoreContainer.textContent = this.score.toLocaleString();

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference.toLocaleString();

    this.scoreContainer.appendChild(addition);
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
