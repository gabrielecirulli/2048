import Board from "./board.js";
import EventSource from "./event.js";

class GameState {
  constructor() {
    this.turn = 0;
    this.games = {};
  }
}

export default class GameManager extends EventSource {
  constructor(games, input, storage, controlIndex) {
    super();

    this.games        = games;
    this.input        = input;
    this.storage      = storage;
    this.controlIndex = controlIndex;

    this.turn = 0;
    this.turnInput = {};

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

    if (this.storage.getBestScore() < this.score) {
      this.storage.setBestScore(this.score);
    }

    // Clear the state when the game is over (game over only, not win)
    if (this.over) {
      this.storage.clearBoardState();
    } else {
      this.storage.setBoardState(this.serialize());
    }
  }

  restart() {
    this.storage.clearGameState();
    this.turn = 0;
    this.turnInput = {};
    this.games.forEach((g) => { g.restart(); });
  }

  keepPlaying() {
    this.games.forEach((g) => { g.keepPlaying(); });
  }

  serialize() {
    const state = new GameState();
    state.turn = this.turn;
    this.games.forEach((g, i) => { state.turn[i] = g.serialize(); });
    return state;
  }

  static createGames(Render, count, size, startTiles) {
    const games = [];
    for (let i = 0; i < count; i += 1) {
      games.push(new Board(new Render(size), startTiles));
    }
    return games;
  }
}
