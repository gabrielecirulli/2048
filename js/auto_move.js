var auto_move_flag      = false;
var auto_move_time;
var auto_move_direction = 0;
// 0: up, 1: right, 2:down, 3: left

function auto_move() {
  if (auto_move_flag === false)
    return;
  //var direction = Math.floor(Math.random() * 4);
  //GM.move(direction);
  // Replace left moves with right moves
  //if (!GM.move(direction == 3 ? 1 : direction)) {

  var rn = Math.random();
  // 50% right, 35% down, 15% up, 0% left
  var direction = rn < 0.03 ? 3 :
                  rn < 0.53 ? 1 :
                  rn < 0.88 ? 2 :
                  0;

  if (!GM.move(direction)) {
    if (!GM.move(1)) {     // right
      if (!GM.move(2)) {   // down
        if (!GM.move(0)) { // up
          GM.move(3);      // left
          GM.move(1);      // right
        }
      }
    }
  }

  //var rn = Math.random();
  //direction = rn < 0.5 ? 1 : rn < 0.75 ? 0 : 2;
  //direction = 1;
  //if (!GM.move(1)) {
  //    GM.move(2);
  //    GM.move(0);
  //    GM.move(1);
  //    GM.move(0);
  //}
  //GM.move(1); GM.move(2);
  //GM.move(2); GM.move(2);

  // Move up until no move, right until no move, then up again.
  // If neither works, go down once, then start going up again.
  //if (!GM.move(auto_move_direction)) {
  //    auto_move_direction = 1 - auto_move_direction;
  //    if (!GM.move(auto_move_direction)) {
  //        GM.move(2);
  //        auto_move_direction = 0;
  //    }
  //}

  setTimeout("auto_move()", auto_move_time);
}

function toggle_auto_move() {
  auto_move_flag                                 = !auto_move_flag;
  document.getElementById("auto-move-run").value = auto_move_flag ? "Stop" : "Run";
  getMoveTime();
  auto_move();
}

function stop_auto_move() {
  if (auto_move_flag)
    toggle_auto_move();
}

function getMoveTime() {
  var time = parseInt(document.getElementById("auto-move-input-time").value);
  if (!isNaN(time)) {
    auto_move_time = time;
  }
}
window.requestAnimationFrame(function () {
  document.getElementById("auto-move-run").addEventListener("click", function () {
    toggle_auto_move();
  });
});