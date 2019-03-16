/* eslint no-new: "off" */

import GameManager from "./game_manager.js";
import Render from "./render.js";
import { KeyboardInputManager } from "./keyboard_input_manager.js";
import { LocalStorageManager } from "./local_storage_manager.js";

const boot       = window.requestAnimationFrame;
const boards     = 9; // 3x3
const boardSize  = 4; // 4x4
const startTiles = 3;

boot(() => {
  const view    = Render.createView(boards, boardSize, boardSize);
  const input   = new KeyboardInputManager();
  const storage = new LocalStorageManager();

  new GameManager(boardSize, startTiles, input, view[4], storage);
});
