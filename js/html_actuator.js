function HTMLActuator() {
  this.tileContainer = document.getElementsByClassName("tile-container")[0];
}

HTMLActuator.prototype.actuate = function (grid) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer();

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });
  });
};

HTMLActuator.prototype.clearContainer = function () {
  while (this.tileContainer.firstChild) {
    this.tileContainer.removeChild(this.tileContainer.firstChild);
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
