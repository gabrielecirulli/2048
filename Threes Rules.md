Tile Values:
1, 2, 3, 6, 12, 24, 48, 96, 192, 384, 768, 1536, 3072
3072 = 10 merges

Probabilities of tiles:
- at the beginning:
    + 25% '3'
    + 37.5% '2'
    + 37.5% '1'

Moving tiles:
    + tiles move to open position
    Merge possibilities:
        + if tile is a two and it hits a 1, they merge into a 3
        + if tile is a 1 and hits a 2, they merge into a 3
        + if tile is not a 1 or 2 and hits a tile with the same value, they merge into a tile with double that value

    
To Do:
    ✔ fix frequency of 1 vs. 2 (1s should get more frequent if there are too many 2s and vice versa)
    + add random creation of higher numbers 
        * figure out how frequently higher numbers appear
    + add styling differences for higher numbers
    + add preview tile
    + add to github website
    + make every move go only one instead of all the way across
