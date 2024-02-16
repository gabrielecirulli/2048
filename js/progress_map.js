const numbers = [
  2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768,
  65536, 131072, 262144,
];

const stations = [
  "Pilát odsuzuje Ježíše k smrti",
  "Ježíš bere na sebe kříž",
  "Ježíš padá pod křížem",
  "Ježíš se setkává se svojí matkou",
  "Šimon z Kyrény pomáhá Ježíši nést kříž",
  "Veronika podává Ježíšovi roušku",
  "Ježíš padá pod křížem podruhé",
  "Dcery Jeruzalémské oplakávají Ježíše",
  "Ježíš padá pod křížem potřetí",
  "Ježíš vysvlečen ze šatů",
  "Ježíš je přibit na kříž",
  "Ježíš na kříži umírá",
  "Ježíšovo tělo sňaté z kříže je položeno do klína jeho matky",
  "Ježíšovo tělo položeno do hrobu",
  "Ježíš byl vzkříšen",
  "Petr a Jan u prázdného hrobu",
  "Setkání s Máří Magdalenou",
  "Na cestě do Emauz",
];

let lastMaxValue = 0;

function informAboutNewStation(station) {
  const messageEl = document.querySelector(".game-message");

  // handle click
  window.addEventListener("touchstart", () => {
    if (messageEl.classList.contains("game-info")) {
      el.innerHTML = "";
      messageEl.classList.remove("game-info");
    }
  });

  const el = document.querySelector("#new-station");
  el.innerHTML = `<p class="new-station-title">Objeveno ${
    numbers.indexOf(station) + 1
  }. zastavení:<br/>${stations[numbers.indexOf(station)]}</p>`;

  el.classList.add("tile-merged");

  messageEl.classList.add("game-info");

  setTimeout(() => {
    if (messageEl.classList.contains("game-info")) {
      el.innerHTML = "";
      messageEl.classList.remove("game-info");
    }
  }, 5000);
}

document.addEventListener("click", function (event) {
  // Získání elementu, na který bylo kliknuto
  var clickedElement = event.target;

  // Vypsání názvu tagu tohoto elementu
  console.log(clickedElement.tagName);
});

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
