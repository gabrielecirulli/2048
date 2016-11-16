import {KeyboardInputManagerConstructor, IKeyboardInputManager} from "./KeyboardInputManager";
import {LocalStorageManagerConstructor, ILocalStorageManager} from "./LocalStorageManager";
import {HTMLActuatorConstructor, IHTMLActuator} from "./HtmlActuator";
import {Grid, IGrid} from "./Grid";
import {Tile} from "./Tile";
import {IPoint2D} from "./Point2D";
import {Movement} from "./Movement";

export interface IGameState
{
	grid?:IGrid;
	score:number;
	over:boolean;
	won:boolean;
	allowKeepPlaying?:boolean;
	bestScore?:number;
	terminated?:boolean;
}

export const TileMovementVectors:IPoint2D[] = Object.freeze([
	Object.freeze({x: 0, y: -1}), // Up
	Object.freeze({x: 1, y: 0}),  // Right
	Object.freeze({x: 0, y: 1}),  // Down
	Object.freeze({x: -1, y: 0})  // Left
]);

export class GameManager implements IGameState
{

	public readonly startTiles:number;
	protected _inputManager:IKeyboardInputManager;
	protected _actuator:IHTMLActuator;
	protected _storageManager:ILocalStorageManager;

	protected _grid:Grid;
	protected _score:number;
	protected _over:boolean;
	protected _won:boolean;
	protected _keepPlaying:boolean;

	constructor(
		public readonly size:number,
		InputManager:KeyboardInputManagerConstructor,
		Actuator:HTMLActuatorConstructor,
		StorageManager:LocalStorageManagerConstructor)
	{
		this.size = size; // Size of the _grid
		this._inputManager = new InputManager();
		this._actuator = new Actuator();
		this._storageManager = new StorageManager();

		this.startTiles = 2;

		this._inputManager.on("move", this.move.bind(this));
		this._inputManager.on("restart", this.restart.bind(this));
		this._inputManager.on("keepPlaying", this.keepPlaying.bind(this));

		this.setup();
	}

	get grid():IGrid
	{
		return this._grid;
	}

	get won():boolean
	{
		return this._won;
	}

	get over():boolean
	{
		return this._over;
	}

	get score():number
	{
		return this._score;
	}

	/**
	 * Restart the game
	 */
	restart():void
	{
		this._storageManager.clearGameState();
		this._actuator.continueGame(); // Clear the game _won/lost message
		this.setup();
	}

	/**
	 * Keep playing after winning (allows going _over 2048)
	 */
	keepPlaying():void
	{
		this._keepPlaying = true;
		this._actuator.continueGame(); // Clear the game _won/lost message
	}

	get allowKeepPlaying():boolean
	{
		return this._keepPlaying;
	}

	/**
	 * Return true if the game is lost, or has _won and the user hasn't kept playing
	 * @returns {boolean}
	 */
	isGameTerminated():boolean
	{
		return this._over || (this._won && !this._keepPlaying);
	}

	get terminated():boolean {
		return this.isGameTerminated();
	}

	/**
	 * Set up the game
	 */
	setup():void
	{
		let previousState = this._storageManager.getGameState();

		// Reload the game from a previous game if present
		if(previousState)
		{
			this._grid = new Grid(
				previousState.grid!.size,
				previousState.grid!.cells); // Reload _grid
			this._score = previousState.score;
			this._over = previousState.over;
			this._won = previousState.won;
			this._keepPlaying = previousState.allowKeepPlaying!;
		}
		else
		{
			this._grid = new Grid(this.size);
			this._score = 0;
			this._over = false;
			this._won = false;
			this._keepPlaying = false;

			// Add the initial tiles
			this.addStartTiles();
		}

		// Update the _actuator
		this.actuate();
	}

	/**
	 * Set up the initial tiles to start the game with
	 */
	addStartTiles():void
	{
		for(let i = 0; i<this.startTiles; i++)
		{
			this.addRandomTile();
		}
	}


	/**
	 * Adds a tile in a random position
	 */
	addRandomTile():boolean
	{
		let cell = this._grid.randomAvailableCell();
		if(cell)
		{
			let value = Math.random()<0.9 ? 2 : 4;
			let tile = new Tile(cell, value);

			this._grid.insertTile(tile);
			return true;
		}
		return false;
	}

	/**
	 * Sends the updated _grid to the _actuator
	 */
	actuate():void
	{
		let sm = this._storageManager;
		if(sm.getBestScore()<this._score)
		{
			sm.setBestScore(this._score);
		}

		// Clear the state when the game is _over (game _over only, not win)
		if(this._over)
		{
			sm.clearGameState();
		}
		else
		{
			sm.setGameState(this.serialize());
		}

		this._actuator.actuate(this._grid, {
			score: this._score,
			over: this._over,
			won: this._won,
			bestScore: sm.getBestScore(),
			terminated: this.isGameTerminated()
		});

	}

	/**
	 * Represent the current game as an object
	 * @returns {{grid: IGrid, score: number, over: boolean, won: boolean, allowKeepPlaying: boolean}}
	 */
	serialize():IGameState
	{
		return {
			grid: this._grid.serialize(),
			score: this._score,
			over: this._over,
			won: this._won,
			allowKeepPlaying: this._keepPlaying
		};
	}

	/**
	 * Save all tile positions and remove merger info
	 */
	prepareTiles():void
	{
		this._grid.eachCell((x, y, tile) =>
		{
			if(tile)
			{
				tile.mergedFrom = null;
				tile.savePosition();
			}
		});
	};

	/**
	 * Move a tile and its representation
	 * @param tile
	 * @param cell
	 */
	moveTile(tile:Tile, cell:IPoint2D):void
	{
		let cells = this._grid.cells;
		cells[tile.x][tile.y] = null;
		cells[cell.x][cell.y] = tile;
		tile.updatePosition(cell);
	}

// Move tiles on the _grid in the specified direction
	move(direction:Movement):void
	{
		// 0: up, 1: right, 2: down, 3: left

		if(this.isGameTerminated()) return; // Don't do anything if the game's _over

		const grid = this._grid;
		let cell:IPoint2D, tile:Tile|null;

		let vector = TileMovementVectors[direction];
		let traversals = this.buildTraversals(vector);
		let moved = false;

		// Save the current tile positions and remove merger information
		this.prepareTiles();

		// Traverse the _grid in the right direction and move tiles
		traversals.x.forEach(x =>
		{
			traversals.y.forEach(y =>
			{
				cell = {x: x, y: y};
				tile = grid.cellContent(cell);

				if(tile)
				{
					let positions = this.findFarthestPosition(cell, vector);
					let next = grid.cellContent(positions.next);

					// Only one merger per row traversal?
					if(next && next.value===tile.value && !next.mergedFrom)
					{
						let merged = new Tile(positions.next, tile.value*2);
						merged.mergedFrom = [tile, next];

						grid.insertTile(merged);
						grid.removeTile(tile);

						// Converge the two tiles' positions
						tile.updatePosition(positions.next);

						// Update the _score
						this._score += merged.value;

						// The mighty 2048 tile
						if(merged.value===2048) this._won = true;
					}
					else
					{
						this.moveTile(tile, positions.farthest);
					}

					if(!positionsEqual(cell, tile))
					{
						moved = true; // The tile moved from its original cell!
					}
				}
			});
		});

		if(moved)
		{
			this.addRandomTile();

			if(!this.movesAvailable())
			{
				this._over = true; // Game _over!
			}

			this.actuate();
		}
	};


// Build a list of positions to traverse in the right order
	buildTraversals(vector:IPoint2D)
	{
		let traversals = {x: <number[]>[], y: <number[]>[]};

		for(let pos = 0; pos<this.size; pos++)
		{
			traversals.x.push(pos);
			traversals.y.push(pos);
		}

		// Always traverse from the farthest cell in the chosen direction
		if(vector.x===1) traversals.x = traversals.x.reverse();
		if(vector.y===1) traversals.y = traversals.y.reverse();

		return traversals;
	};

	findFarthestPosition(cell, vector:IPoint2D)
	{
		let previous;

		// Progress towards the vector direction until an obstacle is found
		do {
			previous = cell;
			cell = {x: previous.x + vector.x, y: previous.y + vector.y};
		}
		while(this._grid.withinBounds(cell) &&
		this._grid.cellAvailable(cell));

		return {
			farthest: previous,
			next: cell // Used to check if a merge is required
		};
	};

	movesAvailable():boolean
	{
		return this._grid.cellsAvailable() || this.tileMatchesAvailable();
	}

// Check for available matches between tiles (more expensive check)
	tileMatchesAvailable():boolean
	{
		let tile;

		for(let x = 0; x<this.size; x++)
		{
			for(let y = 0; y<this.size; y++)
			{
				tile = this._grid.cellContent({x: x, y: y});

				if(tile)
				{
					for(let direction = 0; direction<4; direction++)
					{
						let vector = TileMovementVectors[direction];
						let cell = {x: x + vector.x, y: y + vector.y};

						let other = this._grid.cellContent(cell);

						if(other && other.value===tile.value)
						{
							return true; // These two tiles can be merged
						}
					}
				}
			}
		}

		return false;
	}


}

function positionsEqual(first:IPoint2D, second:IPoint2D):boolean
{
	return first.x===second.x && first.y===second.y;
}
