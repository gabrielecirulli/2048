function HTMLActuator() {
  this.tileContainer = document.getElementsByClassName("tile-container")[0];
}

HTMLActuator.prototype.actuate = function (grid) {
  var self = this;

  this.clearContainer();

  grid.cells.forEach(function (column) {
    column.forEach(function (cell) {
      if (cell) {
        self.addTile(cell);
      }
    });
  });
};

HTMLActuator.prototype.clearContainer = function () {
  while (this.tileContainer.firstChild) {
    this.tileContainer.removeChild(this.tileContainer.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var element = document.createElement("div");

  var x = tile.x + 1;
  var y = tile.y + 1;
  var position = "tile-position-" + x + "-" + y;

  element.classList.add("tile", "tile-" + tile.value, position);
  element.textContent = tile.value;

  this.tileContainer.appendChild(element);
};
