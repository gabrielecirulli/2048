import {IGrid} from "./Grid";
import {IPoint2D} from "./Point2D";
import {ITile} from "./Tile";
import {IGameState} from "./GameManager";

export interface IHTMLActuator
{
	actuate(grid:IGrid, state:IGameState):void;
	continueGame():void;
	addTile(tile:ITile):void;
	updateScore(score:number):void;
	updateBestScore(bestScore:number):void;
	message(won:boolean):void;
	clearMessage():void;
}

export interface HTMLActuatorConstructor
{
	new ():IHTMLActuator;
}

export class HTMLActuator implements IHTMLActuator
{
	private readonly tileContainer:Element;
	private readonly scoreContainer:Element;
	private readonly bestContainer:Element;
	private readonly messageContainer:Element;

	score:number = 0;

	constructor()
	{
		this.tileContainer = document.querySelector(".tile-container");
		this.scoreContainer = document.querySelector(".score-container");
		this.bestContainer = document.querySelector(".best-container");
		this.messageContainer = document.querySelector(".game-message");
	}

	actuate(grid:IGrid, state:IGameState):void
	{
		window.requestAnimationFrame(() =>
		{
			clearContainer(this.tileContainer);

			grid.cells.forEach((column) =>
			{
				column.forEach((cell) =>
				{
					if(cell)
					{
						this.addTile(cell);
					}
				});
			});

			this.updateScore(state.score);
			this.updateBestScore(state.bestScore || 0);

			if(state.terminated)
			{
				if(state.over)
				{
					this.message(false); // You lose
				}
				else if(state.won)
				{
					this.message(true); // You win!
				}
			}

		});
	}

	// Continues the game (both restart and keep playing)
	continueGame():void
	{
		this.clearMessage();
	}

	addTile(tile):void
	{
		let wrapper = document.createElement("div");
		let inner = document.createElement("div");
		let position = tile.previousPosition || {x: tile.x, y: tile.y};
		let positionClass = getPositionClass(position);

		// We can't use classlist because it somehow glitches when replacing classes
		let classes = ["tile", "tile-" + tile.value, positionClass];

		if(tile.value>2048) classes.push("tile-super");

		applyClasses(wrapper, classes);

		inner.classList.add("tile-inner");
		inner.textContent = tile.value;

		if(tile.previousPosition)
		{
			// Make sure that the tile gets rendered in the previous position first
			window.requestAnimationFrame(() =>
			{
				classes[2] = getPositionClass({x: tile.x, y: tile.y});
				applyClasses(wrapper, classes); // Update the position
			});
		}
		else if(tile.mergedFrom)
		{
			classes.push("tile-merged");
			applyClasses(wrapper, classes);

			// Render the tiles that merged
			tile.mergedFrom.forEach((merged) =>
			{
				this.addTile(merged);
			});
		}
		else
		{
			classes.push("tile-new");
			applyClasses(wrapper, classes);
		}

		// Add the inner part of the tile to the wrapper
		wrapper.appendChild(inner);

		// Put the tile on the board
		this.tileContainer.appendChild(wrapper);
	}


	updateScore(score:number):void
	{
		clearContainer(this.scoreContainer);

		let difference = score - this.score;
		this.score = score;

		this.scoreContainer.textContent = score + "";

		if(difference>0)
		{
			let addition = document.createElement("div");
			addition.classList.add("_score-addition");
			addition.textContent = "+" + difference;

			this.scoreContainer.appendChild(addition);
		}
	}

	updateBestScore(bestScore:number):void
	{
		this.bestContainer.textContent = bestScore + "";
	}

	message(won:boolean):void
	{
		let mc = this.messageContainer;

		mc.classList.add(
			won ? "game-_won" : "game-_over");

		mc.getElementsByTagName("p")[0].textContent =
			won ? "You win!" : "Game _over!";
	}

	clearMessage():void
	{
		// IE only takes one value to remove at a time.
		let cl = this.messageContainer.classList;
		cl.remove("game-_won");
		cl.remove("game-_over");
	}

}

function clearContainer(container:Element):void
{
	while(container.firstChild)
	{
		container.removeChild(container.firstChild);
	}
}


function applyClasses(element:Element, classes:string[]):void
{
	element.setAttribute("class", classes.join(" "));
}

function normalizePosition(position:IPoint2D):IPoint2D
{
	return {
		x: position.x + 1,
		y: position.y + 1
	};
}

function getPositionClass(position:IPoint2D):string
{
	position = normalizePosition(position);
	return "tile-position-" + position.x + "-" + position.y;
}
