function RemoteInputManager() {
  this.events = {};
  this.remote = new Remotes("preview");
  this.listen();
}

RemoteInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

RemoteInputManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

RemoteInputManager.prototype.listen = function() {
  var self = this;
  
  this.remote.on("swipe-up", function(event) {
    self.emit("move", 0);
  }).on("swipe-right", function(event) {
    self.emit("move", 1);
  }).on("swipe-down", function(event) {
    self.emit("move", 2);
  }).on("swipe-left", function(event) {
    self.emit("move", 3);
  });
};

KeyboardInputManager.prototype.restart = function (event) {
  event.preventDefault();
  this.emit("restart");
};
