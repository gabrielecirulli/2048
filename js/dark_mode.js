/* ---------------------------------------------------------
   dark_mode.js
   Adds a Dark / Light toggle and remembers the choice.
   --------------------------------------------------------- */

function DarkMode() {
  this.storageKey = "darkMode";
  this.button     = document.querySelector(".dark-mode-button");

  // Apply whatever the player chose last time they visited.
  this.apply(this.isOn());

  // Flip it when the button is clicked.
  var self = this;
  this.button.addEventListener("click", function () {
    self.apply(!self.isOn());
  });
}

// Is dark mode currently switched on?
DarkMode.prototype.isOn = function () {
  return window.localStorage.getItem(this.storageKey) === "true";
};

// Turn it on or off, update the button, and remember the choice.
DarkMode.prototype.apply = function (on) {
  document.documentElement.classList.toggle("dark", on);
  this.button.textContent = on ? "Light mode" : "Dark mode";
  window.localStorage.setItem(this.storageKey, on);
};

// Start it once the page has loaded.
window.requestAnimationFrame(function () {
  new DarkMode();
});
