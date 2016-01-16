var GM;

// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  GM = new GameManager(16, KeyboardInputManager, HTMLActuator, LocalStorageManager);
});
