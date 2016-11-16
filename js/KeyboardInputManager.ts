const KEY_MAP = Object.freeze({
	38: 0, // Up
	39: 1, // Right
	40: 2, // Down
	37: 3, // Left
	75: 0, // Vim up
	76: 1, // Vim right
	74: 2, // Vim down
	72: 3, // Vim left
	87: 0, // W
	68: 1, // D
	83: 2, // S
	65: 3  // A
});

export interface IKeyboardInputManager {
	on(eventName:string, callback:(data?:any)=>void):void;
}

export interface KeyboardInputManagerConstructor {
	new (): IKeyboardInputManager;
}

export class KeyboardInputManager implements IKeyboardInputManager
{

	private _listeners:{[key:string]:any};

	readonly eventTouchstart:string;
	readonly eventTouchmove:string;
	readonly eventTouchend:string;

	constructor()
	{
		this._listeners = {};

		let mpe = window.navigator.msPointerEnabled; //Internet Explorer 10 style

		this.eventTouchstart = mpe ? "MSPointerDown" : "touchstart";
		this.eventTouchmove = mpe ? "MSPointerMove" : "touchmove";
		this.eventTouchend = mpe ? "MSPointerUp" : "touchend";

		this.listen();
	}

	on(eventName:string, callback:(data?:any)=>void):void
	{
		if(!this._listeners[eventName])
		{
			this._listeners[eventName] = [];
		}
		this._listeners[eventName].push(callback);
	};

	protected emit(eventName:string, data?:any):void
	{
		let callbacks = this._listeners[eventName];
		if(callbacks)
		{
			for(let callback of callbacks)
				callback(data);
		}
	};

	protected listen():void
	{
		// Respond to direction keys
		document.addEventListener("keydown", (event:KeyboardEvent)=>
		{
			let modifiers = event.altKey || event.ctrlKey || event.metaKey ||
				event.shiftKey;
			let mapped = KEY_MAP[event.which];

			if(!modifiers)
			{
				if(mapped!==undefined)
				{
					event.preventDefault();
					this.emit("move", mapped);
				}
			}

			// R key restarts the game
			if(!modifiers && event.which===82)
			{
				this.restart.call(self, event);
			}
		});

		// Respond to button presses
		this.bindButtonPress(".retry-button", this.restart);
		this.bindButtonPress(".restart-button", this.restart);
		this.bindButtonPress(".keep-playing-button", this.keepPlaying);

		// Respond to swipe events
		let touchStartClientX, touchStartClientY;
		let gameContainer = document.getElementsByClassName("game-container")[0];

		gameContainer.addEventListener(this.eventTouchstart, (event:MouseEvent & TouchEvent)=>
		{
			if((!window.navigator.msPointerEnabled && event.touches.length>1) ||
				event.targetTouches.length>1)
			{
				return; // Ignore if touching with more than 1 finger
			}

			if(window.navigator.msPointerEnabled)
			{
				touchStartClientX = event.pageX;
				touchStartClientY = event.pageY;
			}
			else
			{
				touchStartClientX = event.touches[0].clientX;
				touchStartClientY = event.touches[0].clientY;
			}

			event.preventDefault();
		});

		gameContainer.addEventListener(this.eventTouchmove, (event:MouseEvent & TouchEvent)=>
		{
			event.preventDefault();
		});

		gameContainer.addEventListener(this.eventTouchend, (event:MouseEvent & TouchEvent)=>
		{
			if((!window.navigator.msPointerEnabled && event.touches.length>0) ||
				event.targetTouches.length>0)
			{
				return; // Ignore if still touching with one or more fingers
			}

			let touchEndClientX, touchEndClientY;

			if(window.navigator.msPointerEnabled)
			{
				touchEndClientX = event.pageX;
				touchEndClientY = event.pageY;
			}
			else
			{
				touchEndClientX = event.changedTouches[0].clientX;
				touchEndClientY = event.changedTouches[0].clientY;
			}

			let dx = touchEndClientX - touchStartClientX;
			let absDx = Math.abs(dx);

			let dy = touchEndClientY - touchStartClientY;
			let absDy = Math.abs(dy);

			if(Math.max(absDx, absDy)>10)
			{
				// (right : left) : (down : up)
				this.emit("move", absDx>absDy ? (dx>0 ? 1 : 3) : (dy>0 ? 2 : 0));
			}
		});
	};

	protected restart(event:Event):void
	{
		event.preventDefault();
		this.emit("restart");
	};

	protected keepPlaying(event:Event):void
	{
		event.preventDefault();
		this.emit("keepPlaying");
	};

	protected bindButtonPress(selector:string, fn:Function):void
	{
		let button = document.querySelector(selector);
		button.addEventListener("click", fn.bind(this));
		button.addEventListener(this.eventTouchend, fn.bind(this));
	};

}
