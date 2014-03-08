function HTMLActuator() {

}

HTMLActuator.prototype.update = function (grid) {
  // Temporary debug visualizer
  grid.forEach(function (row) {
    var mapped = row.map(function (tile) {
      return tile ? tile.value : " ";
    }).join(" | ");
    console.log(mapped);
  });
};
