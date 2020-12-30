'use strict';

const BLOCK_SIZE = 20;
const AREA_WIDTH = 10;
const AREA_HEIGHT = 20;
const canvas = document.getElementById('game-window');
const canvasCur = document.getElementById('game-current_block');
const canvasNext = document.getElementById('game-next_block');
const canvasContext = canvas.getContext('2d');
const canvasCurContext = canvasCur.getContext('2d');
const canvasNextContext = canvasNext.getContext('2d');

const KEYS = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    ESC: 27,
    SPACE: 32,
};
const COLORS = [
    '',
    'blue',
    'red',
    'orange',
    'yellow',
    'purple',
    'cyan',
    'green',
];
const FORMS = [
    [],
    [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[2, 0, 0], [2, 2, 2], [0, 0, 0]],
    [[0, 0, 3], [3, 3, 3], [0, 0, 0]],
    [[4, 4], [4, 4]],
    [[0, 5, 5], [5, 5, 0], [0, 0, 0]],
    [[0, 6, 0], [6, 6, 6], [0, 0, 0]],
    [[7, 7, 0], [0, 7, 7], [0, 0, 0]],
];

let moves = {
    [KEYS.LEFT]: blockTemp => ({ ...blockTemp, x: blockTemp.x - 1 }),
    [KEYS.RIGHT]: blockTemp => ({ ...blockTemp, x: blockTemp.x + 1 }),
    [KEYS.DOWN]: blockTemp => ({ ...blockTemp, y: blockTemp.y + 1 }),
    [KEYS.SPACE]: blockTemp => ({ ...blockTemp, y: blockTemp.y + 1 }),
    [KEYS.UP]: blockTemp => blockTemp.rotate(),
};

let scores = {
    record: 0,
    lines: 0,
};

canvasInit(canvasContext, AREA_WIDTH, AREA_HEIGHT);
canvasInit(canvasCurContext, 4, 4);
canvasInit(canvasNextContext, 4, 4);

let gameWindow = new GameWindow();
let timer;

document.addEventListener('keydown', event => {
    if (moves[event.keyCode]) {
        event.preventDefault();
        let blockTemp = moves[event.keyCode](gameWindow.block);

        if (event.keyCode === KEYS.SPACE) {
            while (gameWindow.check(blockTemp)) {
                blockTemp = moves[KEYS.SPACE](blockTemp);
            }
        }
        else if (gameWindow.check(blockTemp)) {
            gameWindow.block.move(blockTemp);
            canvasContext.clearRect(
                0, 0, 
                canvasContext.canvas.width, canvasContext.canvas.height
            );
            gameWindow.draw();
        }
    }
})

document.querySelector(".game-button").addEventListener(
    'click', () => main()
);

function main() {
    reset();
    clearInterval(timer);
    timer = setInterval(() => play(), 50);
    gameWindow.draw();
}

function canvasInit(context, w, h) {
    context.canvas.width = w * BLOCK_SIZE;
    context.canvas.height = h * BLOCK_SIZE;
    context.scale(BLOCK_SIZE, BLOCK_SIZE);
}

function reset() {
    scores.lines = 0;
    gameWindow.reset();
}

function play() {
    if (gameWindow.move()) {
        canvasContext.clearRect(
            0, 0,
            canvasContext.canvas.width, canvasContext.canvas.height
        );
        gameWindow.draw();
        document.getElementById('game-record').getElementsByTagName('span').innerHTML = scores.record;
        document.getElementById('game-lines').getElementsByTagName('span').innerHTML = scores.lines;
    }
    else {
        clearInterval(timer);
    }
}