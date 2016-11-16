import {IPoint2D, Point2D} from "./Point2D";

export interface ITileState
{
	position:IPoint2D;
	value:number;
}

export interface ITile extends ITileState, IPoint2D
{
	value:number;
	savePosition():void;
	serialize():ITileState;
}


export class Tile extends Point2D implements ITile, ITileState
{
	previousPosition:IPoint2D|null;
	mergedFrom:[Tile, Tile]|null;

	constructor(
		position:IPoint2D,
		public value:number)
	{
		super(position);
		this.value = value || 2;

		this.previousPosition = null;
		this.mergedFrom = null; // Tracks tiles that merged together
	}

	savePosition():void
	{
		this.previousPosition = new Point2D(this);
	}

	serialize():ITileState
	{
		return {
			position: this.position,
			value: this.value
		};
	}

	get position():IPoint2D {
		return {
			x: this.x,
			y: this.y
		};
	}

}

