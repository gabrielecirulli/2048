import GameManager from "./game_manager.js";
import {HTMLActuator} from "./html_actuator.js"
import {KeyboardInputManager} from "./keyboard_input_manager.js"
import {LocalStorageManager} from "./local_storage_manager.js"

const boot = window.requestAnimationFrame;
const boardSize = 4; // 4x4
const startTiles = 3;

boot(() => {
  new GameManager(boardSize, startTiles, KeyboardInputManager, HTMLActuator, LocalStorageManager);
});
