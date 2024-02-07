function updateProgress(grid) {
  const numbers = [
    2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768,
    65536, 131072, 262144,
  ];
  //   console.log(grid);
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
    let el = document.querySelector(`#progress-${numbers[i]}`);
    el.classList.remove("progress-not-display", "progress-not-open");
    el.classList.add("progress-open");
  }
}
