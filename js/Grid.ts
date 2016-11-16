import {Tile, ITileState} from "./Tile";
import {IPoint2D} from "./Point2D";

export interface IGrid {
	size:number;
	cells:Array<ITileState|null>[];
}

export class Grid implements IGrid
{

	readonly size:number;
	readonly cells:Array<Tile|null>[];

	constructor(
		size:number,
		previousState?:Array<ITileState|null>[])
	{
		this.size = size;
		this.cells = previousState
			? this.fromState(previousState)
			: this.empty();
	}


	static fill(size:number):null[][]
	static fill<T>(
		size:number,
		factory:(x:number, y:number)=>T):T[][]
	static fill<T>(
		size:number,
		factory?:(x:number, y:number)=>T):Array<T|null>[]
	{
		let cells:Array<T|null>[] = [];

		for(let x = 0; x<size; x++)
		{
			cells[x] = [];
			let row = cells[x];

			for(let y = 0; y<size; y++)
			{
				row.push(factory ? factory(x,y) : null);
			}
		}

		return cells;
	}

	/**
	 * Build a _grid of the specified size
	 * @returns {Array}
	 */
	empty():Array<Tile|null>[]
	{
		return Grid.fill(this.size);
	}

	fromState(state:Array<ITileState|null>[])
	{
		return Grid.fill(this.size,(x,y)=>{
			let tile = state[x][y];
			return tile && new Tile(tile.position, tile.value);
		});
	}


	/**
	 * Find the first available random position
	 * @returns {IPoint2D}
	 */
	randomAvailableCell():IPoint2D|null
	{
		let cells = this.availableCells();

		return cells.length
			? cells[Math.floor(Math.random()*cells.length)]
			: null;
	}


	availableCells():IPoint2D[]
	{
		let cells:IPoint2D[] = [];

		this.eachCell((x, y, tile)=>
		{
			if(!tile)
			{
				cells.push({x: x, y: y});
			}
		});

		return cells;
	}

	/**
	 * Call callback for every cell
	 * @param callback
	 */
	eachCell(callback:(x:number, y:number, tile:Tile|null)=>void|boolean):void
	{
		let size = this.size;
		for(let x = 0; x<size; x++)
		{
			for(let y = 0; y<size; y++)
			{
				if(callback(x, y, this.cells[x][y])===false)
					return;
			}
		}
	}


	/**
	 * Check if there are any cells available
	 * @returns {boolean}
	 */
	cellsAvailable():boolean
	{
		let available = false;

		this.eachCell((x, y, tile)=>
		{
			if(!tile)
			{
				available = true;
				return false; // causes enumeration to stop.
			}
		});

		return available;
	}

	/**
	 * Check if the specified cell is taken
	 * @param cell
	 * @returns {boolean}
	 */
	cellAvailable(cell):boolean
	{
		return !this.cellOccupied(cell);
	}

	cellOccupied(cell):boolean
	{
		return !!this.cellContent(cell);
	}

	cellContent(point:IPoint2D):Tile|null
	cellContent(x:number, y:number):Tile|null
	cellContent(x:number|IPoint2D, y:number = NaN):Tile|null
	{
		if(typeof x!="number") { y = x.y; x = x.x; }
		return this.withinBounds(x,y)
			? this.cells[x][y]
			: null;
	}

	/**
	 * Inserts a tile at its position
	 * @param tile
	 */
	insertTile(tile:Tile):void
	{
		this.cells[tile.x][tile.y] = tile;
	}

	removeTile(point:IPoint2D):void
	removeTile(x:number, y:number):void
	removeTile(x:number|IPoint2D, y:number = NaN):void
	{
		if(typeof x!="number") { y = x.y; x = x.x; }
		this.cells[<number>x][<number>y] = null;
	}

	withinBounds(point:IPoint2D):boolean
	withinBounds(x:number, y:number):boolean
	withinBounds(x:number|IPoint2D, y:number = NaN):boolean
	{
		if(typeof x!="number") { y = x.y; x = x.x; }
		return x>=0 && y>=0
			&& x<this.size
			&& y<this.size;
	}

	serialize():IGrid
	{
		let size = this.size;
		return {
			size: size,
			cells: Grid.fill(size,(x,y)=>{
				let tile = this.cells[x][y];
				return tile ? tile.serialize() : null;
			})
		};
	}
}

