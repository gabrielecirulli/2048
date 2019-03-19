import { Board, BoardState } from "./board.js";
import EventSource from "./event.js";

class GameState {
  constructor() {
    this.turn = 0;
    this.boards = [];
  }
}

export default class GameManager extends EventSource {
  constructor(Render, input, storage, boardsCount, boardsSize, startTiles) {
    super();

    this.boards     = GameManager.createBoards(Render, boardsCount, boardsSize, startTiles);
    this.boardsSize = boardsSize;
    this.startTiles = startTiles;

    this.input        = input;
    this.storage      = storage;
    this.controlIndex = Math.floor(this.boards.length / 2);

    this.turn = 0;
    this.turnInput = {};

    const state = storage.getGameState();
    if (state == null) {
      this.restart();
    } else {
      this.state = state;
    }

    this.input.on("move", this.move.bind(this));
    this.input.bind("restart", this);
    this.input.bind("keepPlaying", this);

    this.on("restart", this.restart.bind(this));
    this.on("keepPlaying", this.keepPlaying.bind(this));
  }

  move(direction) {
    this.turn += 1;

    // 0: up, 1: right, 2: down, 3: left
    this.boards[this.controlIndex].move(direction);
    this.boards.forEach((g, i) => {
      if (this.controlIndex !== i) {
        g.move((direction + i) % 4);
      }
    });

    this.storage.setGameState(this.state);

    let score = 0;
    this.boards.forEach((g) => { score = Math.max(score, g.score); });
    if (this.storage.getBestScore() < score) {
      this.storage.setBestScore(score);
    }
  }

  restart() {
    this.storage.clearGameState();
    this.turn = 0;
    this.turnInput = {};
    this.boards.forEach((g) => { g.restart(); });
  }

  keepPlaying() {
    this.boards.forEach((g) => { g.keepPlaying(); });
  }

  set state(s) {
    this.turn = s.turn;
    s.boards.forEach((boardState, id) => {
      const board = this.boards[id];
      board.state = boardState;
      board.draw();
    });
  }

  // Represent the current game as an object
  get state() {
    const state = new GameState();
    state.turn  = this.turn;
    this.boards.forEach((g, i) => { state.boards[i] = g.state; });
    return state;
  }

  static createBoards(Render, count, size, startTiles) {
    const boards = [];
    for (let i = 0; i < count; i += 1) {
      boards.push(new Board(new BoardState(), new Render(size), startTiles));
    }
    return boards;
  }
}
