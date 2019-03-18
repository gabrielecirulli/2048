import Game from "./game.js";
import EventSource from "./event.js";

export default class GameManager extends EventSource {
  constructor(games, input, storage, controlIndex) {
    super();

    this.games        = games;
    this.input        = input;
    this.storage      = storage;
    this.controlIndex = controlIndex;

    this.input.on("move", this.move.bind(this));
    this.input.bind("restart", this);
    this.input.bind("keepPlaying", this);

    this.on("restart", this.restart.bind(this));
    this.on("keepPlaying", this.keepPlaying.bind(this));
  }

  move(direction) {
    // 0: up, 1: right, 2: down, 3: left
    this.games[this.controlIndex].move(direction);
    this.games.forEach((g, i) => {
      if (this.controlIndex !== i) {
        g.move((direction + i) % 4);
      }
    });
  }

  restart() {
    this.games.forEach((g) => { g.restart(); });
  }

  keepPlaying() {
    this.games.forEach((g) => { g.keepPlaying(); });
  }

  static createGames(Render, count, size, startTiles) {
    const games = [];
    for (let i = 0; i < count; i += 1) {
      games.push(new Game(new Render(size), startTiles));
    }
    return games;
  }
}
