export interface IPoint2D {
	x:number;
	y:number;
}

export class Point2D implements IPoint2D
{

	x:number;
	y:number;

	constructor(point:IPoint2D)
	constructor(x:number, y:number)
	constructor(x:number|IPoint2D, y:number = NaN)
	{
		this.updatePosition(<any>x,y);
	}

	updatePosition(point:IPoint2D)
	updatePosition(x:number, y:number)
	updatePosition(x:number|IPoint2D, y:number = NaN)
	{
		if(typeof x!="number") { y = x.y; x = x.x; }
		this.x = x;
		this.y = y;
	}
}