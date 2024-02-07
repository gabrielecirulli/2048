const numbers = [
  2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768,
  65536, 131072, 262144,
];

const stations = [
  "Ježíš v&nbsp;zahradě Getsemanské",
  "Ježíš, zrazený Jidášem, je zatčen",
  "Ježíš je odsouzen",
  "Ježíš je zapřen Petrem",
  "Ježíš je souzen Pilátem",
  "Ježíš je zbičován a&nbsp;korunován trny",
  "Ježíš přijímá svůj kříž",
  "Šimon Kyrenský pomáhá Ježíši nést jeho kříž",
  "Ježíš se setkal s&nbsp;jeruzalémskými ženami",
  "Ježíš je ukřižován",
  "Ježíš slibuje své království odsouzenému zločinci",
  "Ježíš na kříži, jeho matka a&nbsp;učedník",
  "Ježíš umírá na kříži",
  "Ježíš je pohřben",
  "Ježíš v&nbsp;zahradě Getsemanské",
  "Ježíš byl vzkříšen",
  "Petr a&nbsp;Jan u&nbsp;prázdného hrobu",
  "Setkání s&nbsp;Máří Magdalenou",
  "Na cestě do Emauz",
];

let lastMaxValue = 0;

function informAboutNewStation(station) {
  const el = document.querySelector("#new-station");
  el.innerHTML = `<p class="new-station-title">Objeveno ${
    numbers.indexOf(station) + 1
  }. zastavení - ${stations[numbers.indexOf(station)]}</p>`;

  el.classList.add("tile-merged");

  setTimeout(() => {
    el.innerHTML = "";
  }, 5000);
}

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

  if (lastMaxValue < maxValue) {
    if (lastMaxValue !== 0) informAboutNewStation(maxValue);
    lastMaxValue = maxValue;
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
