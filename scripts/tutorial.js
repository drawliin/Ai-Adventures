import {cellSize, movePlayer, drawMaze, drawPlayer, createEnemy, moveEnemy, changeDirection, drawEnemy, player, checkPlayerEnemyCollision} from "../utils/script.js";

let gameWinSound = new Audio('../assets/sounds/gameWin.wav');

// Config
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let score = 0;

// Labyrinthe (0 = Path, 1 = Wall)
const tutorialMaze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
canvas.width = tutorialMaze[0].length * cellSize;
canvas.height = tutorialMaze.length * cellSize;

// Données à collecter
let dataPoints = [
    { x: 3 * cellSize, y: 5 * cellSize, collected: false, type: 'data', color: '#ffcd56' },
    { x: 8 * cellSize, y: 3 * cellSize, collected: false, type: 'data', color: '#ffcd56' },
    { x: 15 * cellSize, y: 8 * cellSize, collected: false, type: 'data', color: '#ffcd56' },
    { x: 17 * cellSize, y: 15 * cellSize, collected: false, type: 'data', color: '#ffcd56' }
];

// Create Enemies
let enemies = [
    createEnemy(5 * cellSize, 5 * cellSize),
    createEnemy(13 * cellSize, 12 * cellSize)
];

function drawDataPoints() {
    dataPoints.forEach(point => {
        if (!point.collected) {
            ctx.beginPath();
            ctx.arc(point.x + cellSize/2, point.y + cellSize/2, cellSize/3, 0, Math.PI * 2);
            ctx.fillStyle = point.color;
            ctx.fill();
            ctx.closePath();
        }
    });
}

// My onColision Function
function onCollision(){
    score += 10;
    document.getElementById('score').textContent = score;
    // Vérifier si toutes les données sont collectées
    const allCollected = dataPoints.every(p => p.collected);
    if (allCollected) {
        const nextButton = document.getElementById('next-button');
        document.getElementById('current-task').textContent = 
            "Félicitations! Vous avez collecté toutes les données. Niveau suivant: Apprentissage supervisé.";
        gameWinSound.play();
        setTimeout(()=>{
            alert("Bravoo👏👏.. Passer Vers le niveau suivant!!");
            nextButton.style.display = 'block'; // Show the button
        }, 1000);

        
    }
}




function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    movePlayer(tutorialMaze, dataPoints, onCollision);

    enemies.forEach(enemy => {
        drawEnemy(ctx, enemy);
        changeDirection(enemy, tutorialMaze);
        moveEnemy(enemy, tutorialMaze);
    });

            // Check for collisions only if not all data points are collected
    const allCollected = dataPoints.every(point => point.collected);
    if (!allCollected) {
        checkPlayerEnemyCollision(player, enemies);
    }
    
    drawMaze(ctx, tutorialMaze);
    drawDataPoints();
    drawPlayer(ctx);
    
    requestAnimationFrame(gameLoop);
}

gameLoop();


