const numbers = [
  2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768,
  65536, 131072, 262144,
];

function updateProgress(grid) {
  // console.log(grid);
  // get max value
  let maxValue = 0;
  grid.cells.map((row) =>
    row.map((tile) =>
      tile !== null
        ? tile.value > maxValue
          ? (maxValue = tile.value)
          : null
        : null
    )
  );
  for (let i = 0; numbers[i] <= maxValue; i += 1) {
    const el = document.querySelector(`#progress-${numbers[i]}`);
    el.classList.remove("progress-not-display", "progress-not-open");
    el.classList.add("progress-open");
  }
}

// Register onclick action
numbers.map((no) => {
  const icon = document.querySelector(`#progress-${no}`);
  const box = document.querySelector(`#progress-text-${no}`);
  const close = document.querySelector(`#progress-text-close-${no}`);

  icon.addEventListener("click", () => {
    if (!icon.classList.contains("progress-not-open")) {
      box.classList.remove("progress-not-display");
      box.scrollIntoView();
    }
  });
  close.addEventListener("click", () => {
    box.classList.add("progress-not-display");
    window.scrollTo(0, 0);
  });
});
