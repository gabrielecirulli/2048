var mvRandom = (function() {
	var p = {};
	p.play = function(gm) {
		gm.move(Math.floor(Math.random() * 4));
	};
	return p;
}());
var mvCircle = (function() {
	var count = 0;
	var p = {};
	p.play = function(gm) {
		gm.move(count % 4);
		count = count + 1;
	};
	return p;
}());
var mvCorner = (function() {
	var count = 0;
	var p = {};
	p.play = function(gm) {
		gm.move(count % 2);
		count = count + 1;
	};
	return p;
}());

var mvTrivial = (function() {
	var p = {};
	p.play = function(gm) {
		var ai = new AI2kGameManager(gm.size, gm.grid);
		if (ai.movesAvailable()){
			var best = ai.getMax(ai.getPlayerMoves());
			if (best.directionMoved >= 0){
				// only move if moved
				gm.move(best.directionMoved);
			} else {
				console.log("------- random!");
				mvRandom.play(gm);
			}
		}
	};
	return p;
}());

// slow search tree
var mvMiniMax = (function() {
	var p = {};
	p.play = function(gm) {
		var ai = new AI2kGameManager(gm.size, gm.grid);
		if (ai.movesAvailable()){
			var best = ai.startMinimax(5);
			document.getElementById("eval-container").textContent = best.v;
			// console.log("move: " + best.getDirectionMoved());
			if (best.c.directionMoved >= 0){
				// only move if moved
				gm.move(best.c.directionMoved);
			} else {
				console.log("------- random!");
				mvRandom.play(gm);
			}
		}
	};
	return p;
}());

var mvAlphaBeta = (function() {
	var p = {};
	p.play = function(gm) {
		var ai = new AI2kGameManager(gm.size, gm.grid);
		if (ai.movesAvailable()){
			var depth = 4;
			if (ai.maxLastCellValue > 512){
				depth = 5;
			}
			if (ai.maxLastCellValue > 1024){
				depth = 7;
			}
			if (ai.emptyFields() <= 2){
				depth = 7;
			}
			
			depth +=2
			var best = ai.startAlphaBeta(depth);
			if (best.c.directionMoved >= 0){
				// only move if moved
				gm.move(best.c.directionMoved);
			} else {
				console.log("------- random!");
				mvRandom.play(gm);
			}
		}
	};
	return p;
}());

var mvCompare = (function() {
	var p = {};
	p.play = function(gm) {
		var ai = new AI2kGameManager(gm.size, gm.grid);
		if (ai.movesAvailable()){
			var best = ai.startAlphaBeta(5);
			var best2 = ai.startMinimax(5);
			
			if (best.v - best2.v != 0){
				console.log("not same result");
			}
			// console.log("move: " + best.getDirectionMoved());
			if (best.c.directionMoved >= 0){
				// only move if moved
				gm.move(best.c.directionMoved);
			} else {
				console.log("------- random!");
				mvRandom.play(gm);
			}
		}
	};
	return p;
}());

fnPlayLoop = function(heuristic) {
	if (!gm.isGameTerminated()) {
		heuristic.play(gm);
		setTimeout(function() {
			fnPlayLoop(heuristic);
		}, 50);
	}
};

var ai2k = (function() {
	var gm = null;
	var p = {};
	p.log = function(msg) {
		console.log(msg);
	};
	p.init = function(gameManager) {
		this.gm = gameManager;
		return "GameContainer set.";
	};
	var evalCells = 

	p.eval = function() {
		if (this.gm != null) {
			var cells = this.gm.grid.cells;
			var ai = new AI2kGameManager(this.gm.size,this.gm.grid);
			console.log("current");
			ai.eval();
			console.log("eval moves");
			var best = ai.getMax(ai.getPlayerMoves());
			console.log("best move " + best.getDirectionMoved());
		} else {
			this.log("GameManager is null, please initialize");
			return;
		}
	};

	/*
	 * Helper functions copied from game_manager, disconnected from actuators
	 */

	return p;
}());

function AI2kGameManager(size, grid) {
		// Reload the game from a previous game if present
		for (var i = 0; i < size; i++){
			for (var j = 0; j < size; j++){
				if (grid.cells[i][j] != null){
					grid.cells[i][j].position = {x:i,y:j};
				}
			}
		}
		
		this.grid = new Grid(size, grid.cells); // Reload grid
		this.score = 0;
		this.over = false;
		this.won = false;
		this.keepPlaying = false;
		this.tile = null;
		this.size = size;
		this.directionMoved = -1; // -1 = not moved
		this.algoConsiderFours = true;
};


AI2kGameManager.prototype.startAlphaBeta = function (depth){
	return this.alphabeta(this, depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true);
}

AI2kGameManager.prototype.alphabeta = function (node, depth, alpha, beta, maximizePlayer){
	if (depth == 0 || !node.movesAvailable()){
		node.eval();
		//console.log("SCORE: " + node.score);
		return {v : node.score, c : null};
	}

	if (maximizePlayer){
		//console.log("MAX");
		var children = node.getPlayerMoves();
		var bestChild = null;
		for (var i = 0; i < children.length; i++){
			var value = this.alphabeta(children[i], depth-1, alpha, beta, false);
			if (value.v > alpha){
				bestChild = children[i];
				alpha = value.v
			}
			if (value.v >= beta){
				//console.log("beta cut-off at " + depth);
				break;
			}
		}
		return {v : alpha, c : bestChild};
	
	} else {
		var children = node.getComputerMoves();
		var bestChild = null;
		for (var i = 0; i < children.length; i++){
			var value = this.alphabeta(children[i], depth-1, alpha, beta, true);
			if (value.v < beta){
				bestChild = children[i];
				beta = value.v;	
			}
			if (value.v <= alpha){
				//console.log("alpha cut-off at " + depth);
				break;
			}			
		}
		return {v : beta, c : bestChild};
	}
}

AI2kGameManager.prototype.startMinimax = function(depth){
	return this.minimax(this, depth, true);
}

// calculates the best move according to 'depth' lookahead steps
AI2kGameManager.prototype.minimax = function(node, depth, maximizePlayer){
	if (depth == 0 || !node.movesAvailable()){
		node.eval();
		// console.log("SCORE: " + node.score);
		return {v : node.score, c : null};
	}
	
	if (maximizePlayer){
		//console.log("MAX");
		var bestValue = Number.NEGATIVE_INFINITY;
		var children = node.getPlayerMoves();
		// console.log(children);
		var bestChild = null;
		for (var i = 0; i < children.length; i++){
			var value = this.minimax(children[i], depth-1, false);
			// console.log("i:" + i + "/" + value.v + " vs " + bestValue);
			bestChild = bestValue > value.v ? bestChild : children[i];
			bestValue = bestValue > value.v ? bestValue : value.v;
		}
		return {v : bestValue, c : bestChild};
	} else {
		//console.log("MIN");
		var bestValue = Number.POSITIVE_INFINITY;
		var children = node.getComputerMoves();
		var bestChild = null;
		for (var i = 0; i < children.length; i++){
			var value = this.minimax(children[i], depth-1, true);
			bestChild = bestValue < value.v ? bestChild : children[i];
			bestValue = bestValue < value.v ? bestValue : value.v;
		}
		return {v : bestValue, c : bestChild};
	}
}

// return the best child, or null if no moves
AI2kGameManager.prototype.getMax = function(states){
	var max = null;
	if (states !== []){
		max = states[0];
		for (var i = 1; i < states.length; i++){
			// only take moves, not moving is not allowed
			if (states[i].directionMoved >= 0 && states[i].score > max.score){
				max = states[i];
			}
		}
	}
	return max;
}


// return the worst child
AI2kGameManager.prototype.getMin = function(states){
	var min = null;
	if (states !== []){
		min = states[0];
		for (var i = 1; i < states.length; i++){
			// only take moves, not moving is not allowed
			if (states[i].score < min.score){
				min = states[i];
			}
		}
	}
	return min;
}

// calculates the boards of 4 available moves and evaluates them
AI2kGameManager.prototype.getPlayerMoves = function(){
	var states = [];
	
	// 0: up, 1: right, 2: down, 3: left
	var moves = [1,2,0,3];
	
	// do all possible moves
	if (this.movesAvailable()){
		// 4 moves
		for (var i = 0; i < 4; i++){
			var ai2gm = new AI2kGameManager(this.size, this.grid);
			// do sth where player changes the board
			ai2gm.move(moves[i]);
			// console.log("move " + i);
			if (ai2gm.directionMoved != -1){
				ai2gm.eval();
				// console.log("score -> " + ai2gm.score);
				states.push(ai2gm);
			}
		}
	}
	
	return states;
}


AI2kGameManager.prototype.getComputerMoves = function(){
	var states = [];
	
	// fill all possible fields
	for (var x = 0; x < this.size; x++){
		for (var y = 0; y < this.size; y++){
			var cell = this.grid.cells[x][y];
			if (cell == null){
				// do sth where computer changes the board
				// case "2"
				var ai2gm = new AI2kGameManager(this.size, this.grid);
				ai2gm.grid.cells[x][y] = new Tile({x:x, y:y}, 2);
				ai2gm.eval();
				states.push(ai2gm);
				
				if (this.algoConsiderFours){
					// case "4"
					ai2gm = new AI2kGameManager(this.size, this.grid);
					ai2gm.grid.cells[x][y] = new Tile({x:x, y:y}, 4);
					ai2gm.eval();
					states.push(ai2gm);
				}
			} // cell == null
		} // for y
	} // for x
	
	return states;
}

var scoreTable = {0:0, 1:1};
for (var i = 1; i < 24; i ++){
	scoreTable[i] = scoreTable[i-1]*2 + 1;
}

AI2kGameManager.prototype.emptyFields = function(debug){
	var cells = this.grid.cells;
	var sum = 0;
	for (var x = 0; x < this.size; x++) {
		for (var y = 0; y < this.size; y++) {
			if (cells[x] != undefined && cells[x][y] != undefined){
				// nothing
			} else {
				sum++;
			}
		}
	}
	
	return sum;
}

AI2kGameManager.prototype.eval = function(debug){
	var cells = this.grid.cells;
	
	if (this.over){
		this.score = Number.NEGATIVE_INFINITY;
		return;
	}
	
	for (var x = 0; x < this.size; x++) {
		for (var y = 0; y < this.size; y++) {
			if (cells[x] != undefined && cells[x][y] != undefined){
				var cell = cells[x][y];
				this.score += (cell.value-2)*(cell.value-2)*(x+1);//*(x+1)*(y+1);
			}
		}
	}
	

	// down vote small cells on the rhs
	for (var x = 0; x < this.size; x++) {
		for (var y = 0; y < this.size; y++) {
			if (cells[x] != undefined && cells[x][y] != undefined){
				var cell = cells[x][y];
				if (cell.value <= 128){
					var vd = ((128-cell.value))*(x+1);
					this.score -= vd;
					if (debug){
						console.log("votedown: " + cell.value + " with " + vd);
					}
				}
			}
		}
	}
	
	this.evalOrdering(debug);
}

// add penalties from blocks sitting not in line
AI2kGameManager.prototype.evalOrdering = function(debug) {
	var cells = this.grid.cells;
	var lastCellValue = 0;
	this.maxLastCellValue = Number.NEGATIVE_INFINITY;
	
	var step = 0;
	var numSteps = this.size*this.size;
	
	var fnLastValue = function(v){
		this.maxLastCellValue = this.maxLastCellValue >= v ? this.maxLastCellValue : v;
		
		var ret = 0;
		
		step +=1;
		
		if (lastCellValue > v && v != 0){
			ret =-((this.maxLastCellValue-2)*(lastCellValue/v));
		}
		
		ret += Math.floor(step*(v/10));
		
		if (debug != undefined){
			console.log(lastCellValue + "/" + v + " -> " + ret + " : " + (this.maxLastCellValue-2)*(lastCellValue/v));
		}
		
		lastCellValue = v;
		return ret;
	}
	
	for (var x = 0; x < this.size; x++) {
		if (x % 2 != 0){
			for (var y = 0; y < this.size; y++) {
				if (cells[x] != undefined && cells[x][y] != undefined){
					var cell = cells[x][y];
					this.score += fnLastValue(cell.value);
				} else {
					this.score += fnLastValue(0);
				}
			}
		} else {
			for (var y = this.size-1 ; y >= 0; y--) {
				if (cells[x] != undefined && cells[x][y] != undefined){
					var cell = cells[x][y];
					this.score += fnLastValue(cell.value);
				} else {
					this.score += fnLastValue(0);
				}
			}
		}
		
	}
	//console.log("score: " + this.score);
	//this.score = 16 - score;
};


AI2kGameManager.prototype.getDirectionMoved = function(){
	var ret = "not moved";
	switch (this.directionMoved){
		// 0: up, 1: right, 2: down, 3: left
		case 0: ret = "up"; break;
		case 1: ret = "right"; break;
		case 2: ret = "down"; break;
		case 3: ret = "left"; break;
		default: ret = "not moved";
	}
	return ret;
}


// Set up the initial tiles to start the game with
AI2kGameManager.prototype.addStartTiles = function() {
	for (var i = 0; i < this.startTiles; i++) {
		this.addRandomTile();
	}
};

// Adds a tile in a random position
AI2kGameManager.prototype.addRandomTile = function() {
	if (this.grid.cellsAvailable()) {
		var value = Math.random() < 0.9 ? 2 : 4;
		var tile = new Tile(this.grid.randomAvailableCell(), value);

		this.grid.insertTile(tile);
	}
};

// Save all tile positions and remove merger info
AI2kGameManager.prototype.prepareTiles = function() {
	this.grid.eachCell(function(x, y, tile) {
		if (tile) {
			tile.mergedFrom = null;
			tile.savePosition();
		}
	});
};

// Move a tile and its representation
AI2kGameManager.prototype.moveTile = function(tile, cell) {
	this.grid.cells[tile.x][tile.y] = null;
	this.grid.cells[cell.x][cell.y] = tile;
	tile.updatePosition(cell);
};

// Move tiles on the grid in the specified direction
AI2kGameManager.prototype.move = function(direction) {
	// 0: up, 1: right, 2: down, 3: left
	var self = this;

	if (this.isGameTerminated())
		return; // Don't do anything if the game's over

	var cell, tile;

	var vector = this.getVector(direction);
	var traversals = this.buildTraversals(vector);
	var moved = false;

	// Save the current tile positions and remove merger information
	this.prepareTiles();

	// Traverse the grid in the right direction and move tiles
	traversals.x.forEach(function(x) {
		traversals.y.forEach(function(y) {
			cell = {
				x : x,
				y : y
			};
			tile = self.grid.cellContent(cell);

			if (tile) {
				var positions = self.findFarthestPosition(cell, vector);
				var next = self.grid.cellContent(positions.next);

				// Only one merger per row traversal?
				if (next && next.value === tile.value && !next.mergedFrom) {
					var merged = new Tile(positions.next, tile.value * 2);
					merged.mergedFrom = [ tile, next ];

					self.grid.insertTile(merged);
					self.grid.removeTile(tile);

					// Converge the two tiles' positions
					tile.updatePosition(positions.next);

					// Update the score
					self.score += merged.value;

					// The mighty 2048 tile
					if (merged.value === 4096)
						self.won = true;
				} else {
					self.moveTile(tile, positions.farthest);
				}

				if (!self.positionsEqual(cell, tile)) {
					moved = true; // The tile moved from its original
					// cell!
				}
			}
		});
	});

	if (moved) {
		this.directionMoved = direction;
		if (!this.movesAvailable()) {
			this.over = true; // Game over!
		}
	}
};

// Get the vector representing the chosen direction
AI2kGameManager.prototype.getVector = function(direction) {
	// Vectors representing tile movement
	var map = {
		0 : {
			x : 0,
			y : -1
		}, // Up
		1 : {
			x : 1,
			y : 0
		}, // Right
		2 : {
			x : 0,
			y : 1
		}, // Down
		3 : {
			x : -1,
			y : 0
		}
	// Left
	};

	return map[direction];
};

// Build a list of positions to traverse in the right order
AI2kGameManager.prototype.buildTraversals = function(vector) {
	var traversals = {
		x : [],
		y : []
	};

	for (var pos = 0; pos < this.size; pos++) {
		traversals.x.push(pos);
		traversals.y.push(pos);
	}

	// Always traverse from the farthest cell in the chosen direction
	if (vector.x === 1)
		traversals.x = traversals.x.reverse();
	if (vector.y === 1)
		traversals.y = traversals.y.reverse();

	return traversals;
};

AI2kGameManager.prototype.findFarthestPosition = function(cell, vector) {
	var previous;

	// Progress towards the vector direction until an obstacle is found
	do {
		previous = cell;
		cell = {
			x : previous.x + vector.x,
			y : previous.y + vector.y
		};
	} while (this.grid.withinBounds(cell) && this.grid.cellAvailable(cell));

	return {
		farthest : previous,
		next : cell
	// Used to check if a merge is required
	};
};

AI2kGameManager.prototype.movesAvailable = function() {
	return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
AI2kGameManager.prototype.tileMatchesAvailable = function() {
	var self = this;

	var tile;

	for (var x = 0; x < this.size; x++) {
		for (var y = 0; y < this.size; y++) {
			tile = this.grid.cellContent({
				x : x,
				y : y
			});

			if (tile) {
				for (var direction = 0; direction < 4; direction++) {
					var vector = self.getVector(direction);
					var cell = {
						x : x + vector.x,
						y : y + vector.y
					};

					var other = self.grid.cellContent(cell);

					if (other && other.value === tile.value) {
						return true; // These two tiles can be merged
					}
				}
			}
		}
	}

	return false;
};

AI2kGameManager.prototype.positionsEqual = function(first, second) {
	return first.x === second.x && first.y === second.y;
};

// Keep playing after winning (allows going over 2048)
AI2kGameManager.prototype.keepPlaying = function() {
	this.keepPlaying = true;
};

// Return true if the game is lost, or has won and the user hasn't kept
// playing
AI2kGameManager.prototype.isGameTerminated = function() {
	return this.over || (this.won && !this.keepPlaying);
};
