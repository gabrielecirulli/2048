// Add dark mode toggle functionality to the page
document.addEventListener("DOMContentLoaded", function () {
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const darkModeIcon = document.getElementById("dark-mode-icon");
  const darkModeText = document.getElementById("dark-mode-text");

  // Function to apply dark mode
  function applyDarkMode() {
    document.documentElement.classList.add("dark-mode");
    document.body.classList.add("dark-mode");
    darkModeIcon.classList.replace("fa-moon", "fa-sun");
    darkModeText.textContent = "Light Mode";
  }

  // Function to apply light mode
  function applyLightMode() {
    document.documentElement.classList.remove("dark-mode");
    document.body.classList.remove("dark-mode");
    darkModeIcon.classList.replace("fa-sun", "fa-moon");
    darkModeText.textContent = "Dark Mode";
  }

  // Check and apply the current mode from localStorage
  const currentMode = localStorage.getItem("darkMode");
  if (currentMode === "enabled") {
    applyDarkMode();
  }

  // Toggle dark mode on button click
  darkModeToggle.addEventListener("click", function () {
    if (document.documentElement.classList.contains("dark-mode")) {
      applyLightMode();
      localStorage.setItem("darkMode", "disabled");
    } else {
      applyDarkMode();
      localStorage.setItem("darkMode", "enabled");
    }
  });
});
