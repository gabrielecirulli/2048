import GameManager from "./game_manager.js";
import {HTMLActuator} from "./html_actuator.js"
import {KeyboardInputManager} from "./keyboard_input_manager.js"
import {LocalStorageManager} from "./local_storage_manager.js"

const boot = window.requestAnimationFrame;

boot(function () {
  new GameManager(4, 2, KeyboardInputManager, HTMLActuator, LocalStorageManager);
});
