function RandomAlgorithmActuator(gameManager, interval) {
  this.events = {};
  const self = this;
  const id = setInterval(() => {
    const direction = Math.floor(Math.random() * 4 + 0);
    this.move(self, direction)
    console.log(gameManager.movesAvailable());
    if(gameManager.over) clearInterval(id);
  }, interval);
}

RandomAlgorithmActuator.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

RandomAlgorithmActuator.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

RandomAlgorithmActuator.prototype.move = function(self, direction) {
  console.log(this);
  self.emit("move", direction);
}

RandomAlgorithmActuator.prototype.restart = function () {
  this.emit("restart");
};

RandomAlgorithmActuator.prototype.keepPlaying = function () {
  this.emit("keepPlaying");
};