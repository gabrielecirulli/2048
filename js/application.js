var GM;

// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  GM = new GameManager(10, KeyboardInputManager, HTMLActuator, LocalStorageManager);
});
