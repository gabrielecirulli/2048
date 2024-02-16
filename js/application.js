// Wait till the browser is ready to render the game (avoids glitches)
window.onload = () => {
  const closeWelcome = document.querySelector("#progress-text-close-welcome");
  closeWelcome.addEventListener("click", () => {
    // remove info message
    const boxWelcome = document.querySelector("#welcome-info");
    const messageEl = document.querySelector(".game-message");
    messageEl.classList.remove("game-info");
    boxWelcome.classList.add("hidden");
    localStorage.setItem("closeWelcomeMessage", "true");

    // start game
    window.requestAnimationFrame(function () {
      new GameManager(
        5,
        KeyboardInputManager,
        HTMLActuator,
        LocalStorageManager
      );
    });
  });
  if (localStorage.getItem("closeWelcomeMessage") !== "true") {
    const boxWelcome = document.querySelector("#welcome-info");
    const messageEl = document.querySelector(".game-message");
    messageEl.classList.add("game-info");
    boxWelcome.classList.remove("hidden");
  } else {
    window.requestAnimationFrame(function () {
      new GameManager(
        5,
        KeyboardInputManager,
        HTMLActuator,
        LocalStorageManager
      );
    });
  }
};

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("../sw.js");
}
