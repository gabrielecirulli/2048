class Grid {
  constructor(size, previousState) {
    this.size = size;
    this.cells = previousState ? this.fromState(previousState) : this.empty();
  }
  empty() {
    var cells = [];
    for (var x = 0; x < this.size; x++) {
      var row = cells[x] = [];;
      for (var y = 0; y < this.size; y++) {
        row.push(null)

      }

    }
    return cells
  }
}