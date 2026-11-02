// Checks one rule of 2048 against the real game code in js/.
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const vm = require("node:vm");

// Load the game's logic. These three files never touch the browser.
const game = vm.createContext({});
for (const file of ["tile.js", "grid.js", "game_manager.js"]) {
  vm.runInContext(fs.readFileSync("js/" + file, "utf8"), game);
}

// A do-nothing stand-in for the keyboard, the screen, and storage.
function Fake() {}
for (const method of ["on", "actuate", "getGameState", "setGameState",
                      "clearGameState", "getBestScore", "setBestScore"]) {
  Fake.prototype[method] = function () {};
}

test("two 2s merge into a 4", () => {
  const manager = new game.GameManager(4, Fake, Fake, Fake);
  manager.grid = new game.Grid(4); // start from an empty board
  manager.grid.insertTile(new game.Tile({ x: 0, y: 0 }, 2));
  manager.grid.insertTile(new game.Tile({ x: 1, y: 0 }, 2));

  manager.move(3); // 3 means "left"

  assert.strictEqual(manager.grid.cells[0][0].value, 4);
});