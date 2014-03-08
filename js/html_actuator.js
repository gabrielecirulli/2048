function HTMLActuator() {

}

HTMLActuator.prototype.actuate = function (grid) {
  // Temporary debug visualizer
  grid.cells.forEach(function (row) {
    var mapped = row.map(function (tile) {
      return tile ? tile.value : " ";
    }).join(" | ");
    console.log(mapped);
  });
};
