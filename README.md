# 2048 AI

AI for the game [2048](https://github.com/gabrielecirulli/2048).

See it in action [here](http://ov3y.github.io/2048-AI/). (Hit the auto-run button to let the AI attempt to solve it by itself)

The algorithm is iterative deepening depth first alpha-beta search. The evaluation function tries to keep the rows and columns monotonic (either all decreasing or increasing) while aligning same-valued tiles and minimizing the number of tiles on the grid. For more detail on how it works, [check out my answer on stackoverflow](http://stackoverflow.com/a/22389702/1056032).

You can tweak the thinking time via global var `animationDelay`. Higher = more time/deeper search.

It achieves success rate of about 90% in my testing.
