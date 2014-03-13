// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  if(document.location.hash == "#remote") {
    new GameManager(4, RemoteInputManager, HTMLActuator, LocalScoreManager);
  } else {
    new GameManager(4, KeyboardInputManager, HTMLActuator, LocalScoreManager);
  }
});
