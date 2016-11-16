import {IGameState} from "./GameManager";
const VOID0 = void 0;

export interface ILocalStorage {
	clear(): void;
	getItem(key: string): string | null;
	removeItem(key: string): void;
	setItem(key: string, data: string): void;
}

class FakeStorage implements ILocalStorage
{
	private _data: {[key:string]:string};
	constructor() {
		this._data = {};
	}

	setItem(key: string, data: string): void
	{
		this._data[key] = data;
	}

	getItem(key: string): string | null
	{
		let data = this._data[key];
		return data===VOID0
			? null
			: data;
	}

	removeItem(key: string): void
	{
		delete this._data[key];
	}

	clear()
	{
		return this._data = {};
	}
}

export function isStorageSupported():boolean
{
	let testKey = "test";
	try
	{
		let storage = window.localStorage;
		storage.setItem(testKey, "1");
		storage.removeItem(testKey);
		return true;
	}
	catch(error)
	{
		return false;
	}
}

const STORAGE:ILocalStorage = isStorageSupported()
	? window.localStorage
	: new FakeStorage();

const KEYS = Object.freeze({
	BEST_SCORE : "bestScore",
	GAME_STATE : "gameState"
});

export interface ILocalStorageManager {
	getBestScore():number;
	setBestScore(score:number):void;
	getGameState():IGameState;
	setGameState(gameState:IGameState):void
	clearGameState():void;
}

export interface LocalStorageManagerConstructor {
	new ():ILocalStorageManager;
}

export class LocalStorageManager implements ILocalStorageManager
{
	getBestScore():number
	{
		let score = STORAGE.getItem(KEYS.BEST_SCORE);
		return score ? Number(score) : 0;
	}


	setBestScore(score:number):void
	{
		STORAGE.setItem(KEYS.BEST_SCORE, <any>score);
	}

	// Game state getters/setters and clearing
	getGameState():IGameState
	{
		let stateJSON = STORAGE.getItem(KEYS.GAME_STATE);
		return stateJSON && JSON.parse(stateJSON);
	}

	setGameState(gameState:IGameState):void
	{
		STORAGE.setItem(
			KEYS.GAME_STATE,
			JSON.stringify(gameState));
	}

	clearGameState():void
	{
		STORAGE.removeItem(KEYS.GAME_STATE);
	}

}

