/* eslint no-new: "off" */

import { GameManager } from "./game_manager.js";
import Render from "./render.js";
import Input from "./keyboard_input_manager.js";
import Storage from "./local_storage_manager.js";

const boot       = window.requestAnimationFrame;
const boards     = 9; // 3x3
const boardSize  = 4; // 4x4
const startTiles = 2;

boot(() => {
  const view    = GameManager.createGames(Render, Storage, boards, boardSize, startTiles);
  const input   = new Input();

  new GameManager(view, input, 4);
});
