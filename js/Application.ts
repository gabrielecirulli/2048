import {GameManager} from "./GameManager";
import {KeyboardInputManager} from "./KeyboardInputManager";
import {HTMLActuator} from "./HtmlActuator";
import {LocalStorageManager} from "./LocalStorageManager";

// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(() =>
{
	new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
});
