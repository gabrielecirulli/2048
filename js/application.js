document.addEventListener("DOMContentLoaded", function () {
  var actuator = new HTMLActuator;
  var manager  = new GameManager(4, actuator);
});
