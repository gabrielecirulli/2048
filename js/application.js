// Wait till the browser is ready to render the game (avoids glitches)

const rangeInput = document.getElementById('rangeInput');
const rangeValue = document.getElementById('rangeValue');

// Function to update the displayed value
function updateValue() {
  rangeValue.textContent = rangeInput.value;
}

// Event listener to detect changes in the range input
rangeInput.addEventListener('input', updateValue);

// Set the initial value when the page loads
updateValue();

window.requestAnimationFrame(function () {
  new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager, rangeInput.value);
});
