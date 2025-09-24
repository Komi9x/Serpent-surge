// This file contains the game's logic

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    { x: 12, y: 12 }
];
let direction = { x: 0, y: 0 };
let food = { x: 15, y: 15 };
let score = 0;

document.addEventListener('keydown', handleKeyPress);

window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const difficulty = urlParams.get('difficulty');

    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(difficulty)) {
        window.location.href = 'index.html';
    }
};

function handleKeyPress(event) {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
            if (direction.y === 0) {
                direction = { x: 0, y: -1 };
            }
            break;
        case 'ArrowDown':
        case 's':
            if (direction.y === 0) {
                direction = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
        case 'a':
            if (direction.x === 0) {
                direction = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
        case 'd':
            if (direction.x === 0) {
                direction = { x: 1, y: 0 };
            }
            break;
    }
}

function gameLoop() {
    updateSnakePosition();
    if (checkCollision()) {
        resetGame();
    }
    if (snakeAteFood()) {
        const urlParams = new URLSearchParams(window.location.search);
        const difficulty = urlParams.get('difficulty');
        score++;

        switch (difficulty) {
            case 'easy':
                intDifficulty = 1;
                break;
            case 'medium':
                intDifficulty = 2;
                break;
            case 'hard':
                intDifficulty = 3;
                break;
            default:
                console.log('Invalid difficulty level selected.');
        }

        shownScore = intDifficulty * score;

        document.getElementById('score').innerText = `${shownScore}`;
        growSnake();
        moveFood();
    }
    drawGame();
}

function updateSnakePosition() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    snake.pop();
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        if (score != 0) {
            saveScoreToDb()
        }
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            if (score != 0) {
                saveScoreToDb()
            }
            return true;
        }
    }

    return false;
}

// This function contain the endpoints of the frontend for saving the score
function saveScoreToDb() {
    const urlParams = new URLSearchParams(window.location.search);
    const difficulty = urlParams.get('difficulty');
    const name = urlParams.get('name').toUpperCase();

    if (name.length !== 3 || difficulty < 1 || difficulty > 3) {
        console.error("Invalid input");
        return;
    }

    switch (difficulty) {
        case 'easy':
            intDifficulty = 1;
            break;
        case 'medium':
            intDifficulty = 2;
            break;
        case 'hard':
            intDifficulty = 3;
            break;
        default:
            console.log('Invalid difficulty level selected.');
    }

    const data = {
        name: name,
        difficulty: intDifficulty,
        score: score,
    };

    fetch('/save-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
        })
        .catch(error => {
            console.error(error.message);
        });
}


function snakeAteFood() {
    return snake[0].x === food.x && snake[0].y === food.y;
}

function growSnake() {
    const tail = { ...snake[snake.length - 1] };
    snake.push(tail);
}

function moveFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#6adead';
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    });

    ctx.fillStyle = '#fe0605';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function resetGame() {
    snake = [{ x: 12, y: 12 }];
    direction = { x: 0, y: 0 };
    score = 0;
    document.getElementById('score').innerText = `${score}`;
}

const urlParams = new URLSearchParams(window.location.search);

const urlVar = urlParams.get('difficulty');

if (urlVar === 'easy') {
    var diffNumber = 140;
} else if (urlVar === 'hard') {
    var diffNumber = 60;
} else {
    var diffNumber = 100;
}

setInterval(gameLoop, diffNumber);
