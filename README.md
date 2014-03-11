# 2048 AI

AI for [2048](https://github.com/gabrielecirulli/2048).

See it in action [here](http://ov3y.github.io/2048-AI/). (Hit the auto-run button to let the AI solve it by itself)

The algorithm is iterative deepening depth first alpha-beta search. The evaluation function tries to minimize the number of tiles on the grid while keeping same/similar tiles in line with each other.

You can tweak the thinking time via global var `animationDelay`. Higher = more time/deeper search.

I think there are still some bugs as it tends to make some weird moves and die during the endgame, but in my testing it almost always gets 1024 and usually gets very close to 2048, achieving scores of roughly 8-10k.

### Suggested Improvements

1.  Caching. It's not really taking advantage of the iterative deepening yet, as it doesn't remember the move orderings from previous iterations. Consequently, there aren't very many alpha-beta cutoffs. With caching, I think the tree could get pruned much more.

2. Put the search in a webworker. Parallelizing minimax is really hard, but just running it like normal but in another thread would let the animations run smoother.

3. Evaluation tweaks. There are currently three heuristics. Change the weights between them, run a lot of test games and track statistics to find an optimal eval function.

4. Comments and cleanup. It's pretty hacky right now but I've spent too much time already. There are probably lots of low-hanging fruit optimizations.
