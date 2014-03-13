# 2048 AI

AI for the game [2048](https://github.com/gabrielecirulli/2048).

See it in action [here](http://ov3y.github.io/2048-AI/). (Hit the auto-run button to let the AI attempt to solve it by itself)

The algorithm is iterative deepening depth first alpha-beta search. The evaluation function tries to keep the rows and columns monotonic (either all decreasing or increasing) while aligning same-valued tiles and minimizing the number of tiles on the grid. For more detail on how it works, [check out my answer on stackoverflow](http://stackoverflow.com/a/22389702/1056032).

You can tweak the thinking time via global var `animationDelay`. Higher = more time/deeper search.

~~I think there are still some bugs as it tends to make some weird moves and die during the endgame, but in my testing it almost always gets 1024 and usually gets very close to 2048, achieving scores of roughly 8-10k.~~

The better heuristics now give it a success rate of about 90% in my testing (on a reasonably fast computer).

### Suggested Improvements

1.  Caching. It's not really taking advantage of the iterative deepening yet, as it doesn't remember the move orderings from previous iterations. Consequently, there aren't very many alpha-beta cutoffs. With caching, I think the tree could get pruned much more. This would also allow a higher branching factor for computer moves, which would help a lot because I think the few losses are due to unexpected random computer moves that had been pruned.

2. Put the search in a webworker. Parallelizing minimax is really hard, but just running it like normal in another thread would let the animations run more smoothly.

3. ~~Evaluation tweaks. There are currently four heuristics. Change the weights between them, run a lot of test games and track statistics to find an optimal eval function.~~

4. Comments and cleanup. It's pretty hacky right now but I've spent too much time already. There are probably lots of low-hanging fruit optimizations.
