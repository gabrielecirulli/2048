const GameManager = require('../js/game_manager.js');

const mockInputManager = jest.fn().mockImplementation(() => {
    return {
        on: jest.fn()
    };
});

const mockActuator = jest.fn().mockImplementation(() => {
    return {
        actuate: jest.fn(),
        continueGame: jest.fn()
    };
});

const mockStorageManager = jest.fn().mockImplementation(() => {
    return {
        getGameState: jest.fn(),
        clearGameState: jest.fn(),
        setGameState: jest.fn(),
        getBestScore: jest.fn(() => 0), // Mocking getBestScore method
        setBestScore: jest.fn() // Mock other methods if needed
    };
});

describe('GameManager', () => {
    let gameManager;

    beforeEach(() => {
        gameManager = new GameManager(4, mockInputManager, mockActuator, mockStorageManager);
    });

    test('initialization', () => {
        expect(gameManager.size).toBe(4);
        expect(gameManager.startTiles).toBe(2);
    });
});
