var auto_move_flag = false;
var auto_move_time;
var auto_move_direction = 0;
// 0: up, 1: right, 2:down, 3: left

function start_auto_move() {
    auto_move_flag = true;
    auto_move();
}

function auto_move() {
    if (auto_move_flag === false)
        return;
    var direction = Math.floor(Math.random() * 4);
    //GM.move(direction);

    // Replace left moves with right moves
    GM.move(direction == 3 ? 1 : direction);

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

function stop_auto_move() {
    auto_move_flag = false;
}

function toggle_auto_move() {
    auto_move_flag = !auto_move_flag;
    auto_move();
}

window.requestAnimationFrame(function () {
    document.getElementById("auto-move-run").addEventListener("click", function () {
        var time = parseInt(document.getElementById("auto-move-input-time").value);
        if (!isNaN(time)) {
            auto_move_time = time;
            if (auto_move_flag === false) {
                start_auto_move();
            }
        }
    });
    document.getElementById("auto-move-stop").addEventListener("click", function () {
        stop_auto_move();
    });
});