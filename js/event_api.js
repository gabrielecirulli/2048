function EventApi(move, restart) {
  // Listen for and preform moves
  document.addEventListener("doMove", function (event) {
    var directions = ["up", "right", "down", "left"];
    move(directions.indexOf(event.detail.direction));
  });

  // Listen for restart
  document.addEventListener("doRestart", function () {
    restart();
  });
}

// Event helper
function sendEvent(name, data) {
  var event = new CustomEvent(name, {"detail": data});
  document.dispatchEvent(event);
}

// Send event when a move is made
EventApi.prototype.move = function(direction) {
  sendEvent("move", {"direction": ["up", "right", "down", "left"][direction]});
};

// Send an event when the game restarts
EventApi.prototype.restart = function() {
  sendEvent("restart");
};

// Send an event if the player keeps playing after they win
EventApi.prototype.keepPlaying = function() {
  sendEvent("keepPlaying");
};

// Send an event when the game is over
EventApi.prototype.gameOver = function() {
  sendEvent("gameOver");
};
