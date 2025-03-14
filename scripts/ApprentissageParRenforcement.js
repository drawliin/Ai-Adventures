import { 
    cellSize, movePlayer, drawMaze, drawPlayer, createEnemy, 
    moveEnemy, changeDirection, drawEnemy, player 
} from "../utils/script.js";

// Sounds
let gameWinSound = new Audio('../assets/sounds/gameWin.wav');
let gameOverSound = new Audio("../assets/sounds/gameOver.wav");

// Config
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let score = 0;
let gameOver = false;

canvas.width = 20 * cellSize;
canvas.height = 17 * cellSize;

// Maze (0 = Path, 1 = Wall)
const tutorialMaze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Data points to collect
let dataPoints = [
    { x: 3 * cellSize, y: 5 * cellSize, collected: false, color: '#ffcd56' },
    { x: 8 * cellSize, y: 3 * cellSize, collected: false, color: '#ffcd56' },
    { x: 15 * cellSize, y: 8 * cellSize, collected: false, color: '#ffcd56' },
    { x: 17 * cellSize, y: 15 * cellSize, collected: false, color: '#ffcd56' }
];

// Create Enemies
let enemies = [
    createEnemy(5 * cellSize, 5 * cellSize),
    createEnemy(15 * cellSize, 13 * cellSize),
    createEnemy(9 * cellSize, 13 * cellSize),
    createEnemy(3 * cellSize, 1 * cellSize)
];

console.log("Enemies created:", enemies);

function drawDataPoints() {
    dataPoints.forEach(point => {
        if (!point.collected) {
            ctx.beginPath();
            ctx.arc(point.x + cellSize / 2, point.y + cellSize / 2, cellSize / 3, 0, Math.PI * 2);
            ctx.fillStyle = point.color;
            ctx.fill();
            ctx.closePath();
        }
    });
}

// Collision function
function onCollision() {
    score += 10;
    document.getElementById('score').textContent = score;

    if (dataPoints.every(p => p.collected)) {
        document.getElementById('current-task').textContent = 
            "Félicitations! Niveau suivant: Apprentissage supervisé.";
        gameWinSound.play();
        alert("You won!");
        document.getElementById('nextButton').style.display = 'block'; // Show the button
    }
}

function checkPlayerEnemyCollision() {
    enemies.forEach(enemy => {
        if (
            Math.abs(player.x - enemy.x) < cellSize / 2 &&
            Math.abs(player.y - enemy.y) < cellSize / 2 &&
            !gameOver
        ) {
            gameOver = true;
            gameOverSound.play();
            alert("Game Over!");
            document.location.reload();
        }
    });
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    movePlayer(tutorialMaze, dataPoints, onCollision);

    enemies.forEach(enemy => {
        changeDirection(enemy, tutorialMaze);
        moveEnemy(enemy, tutorialMaze);
        drawEnemy(ctx, enemy);
        console.log("Enemy position:", enemy);
    });

    checkPlayerEnemyCollision();

    drawMaze(ctx, tutorialMaze);
    drawDataPoints();
    drawPlayer(ctx);
    
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();
