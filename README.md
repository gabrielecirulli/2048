# 2048 AI

AI for [2048](https://github.com/gabrielecirulli/2048).

The algorithm is iterative deepening depth first alpha-beta search. The evaluation function tries to minimize the number of tiles on the grid while keeping same/similar tiles in line with each other.

You can tweak the thinking time via global var `animationDelay`. Higher = more time/deeper search.

I think there are still some bugs as it tends to make some weird moves and die during the endgame, but in my testing it almost always gets 1024 and usually gets very close to 2048, achieving scores of roughly 8-10k.

Code is real sloppy, sorry.
