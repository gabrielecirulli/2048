export default class Tile {
  constructor(pos, value) {
    this.x                = pos.x;
    this.y                = pos.y;
    this.value            = value || 2;

    this.previousPosition = null;
    this.mergedFrom       = null; // Tracks tiles that merged together
  }

  savePosition() {
    this.previousPosition = { x: this.x, y: this.y };
  }

  updatePosition(pos) {
    this.x = pos.x;
    this.y = pos.y;
  }

  serialize() {
    return {
      position: {
        x: this.x,
        y: this.y
      },
      value: this.value
    };
  }
}
