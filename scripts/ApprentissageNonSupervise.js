import { cellSize, movePlayer, drawMaze, drawPlayer, createEnemy, moveEnemy, changeDirection, drawEnemy, player, checkPlayerEnemyCollision } from "../utils/script.js";

// Config
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let score = 0;

// Maze (0 = Path, 1 = Wall)
const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
canvas.width = maze[0].length * cellSize;
canvas.height = maze.length * cellSize;

// Enemies
let enemies = [
    createEnemy(13 * cellSize, 3 * cellSize),
    createEnemy(1 * cellSize, 13 * cellSize)
];

// Data Points to Collect
let dataPoints = [
    { x: 3 * cellSize, y: 5 * cellSize, collected: false, type: 'circle', color: '#ffcd56' }, // Yellow
    { x: 9 * cellSize, y: 12 * cellSize, collected: false, type: 'circle', color: '#ff6f61' }, // Red
    { x: 16 * cellSize, y: 1 * cellSize, collected: false, type: 'square', color: '#9966ff' }, // Purple
    { x: 12 * cellSize, y: 5 * cellSize, collected: false, type: 'triangle', color: '#ffcd56' }, // Yellow
    { x: 1 * cellSize, y: 15 * cellSize, collected: false, type: 'square', color: '#ffcd56' }, // Yellow
    { x: 5 * cellSize, y: 1 * cellSize, collected: false, type: 'triangle', color: '#ff6f61' }, // Red
    { x: 18 * cellSize, y: 15 * cellSize, collected: false, type: 'star', color: '#9966ff' } // Purple
];

// Draw Data Points
function drawDataPoints() {
    dataPoints.forEach(point => {
        if (!point.collected) {
            ctx.beginPath();
            switch (point.type) {
                case 'circle':
                    ctx.arc(point.x + cellSize / 2, point.y + cellSize / 2, cellSize / 3, 0, Math.PI * 2);
                    break;
                case 'square':
                    ctx.rect(point.x + cellSize / 4, point.y + cellSize / 4, cellSize / 2, cellSize / 2);
                    break;
                case 'triangle':
                    ctx.moveTo(point.x + cellSize / 2, point.y + cellSize / 4);
                    ctx.lineTo(point.x + cellSize / 4, point.y + 3 * cellSize / 4);
                    ctx.lineTo(point.x + 3 * cellSize / 4, point.y + 3 * cellSize / 4);
                    ctx.closePath();
                    break;
                case 'star':
                    const outerRadius = cellSize / 3;
                    const innerRadius = cellSize / 6;
                    const centerX = point.x + cellSize / 2;
                    const centerY = point.y + cellSize / 2;
                    for (let i = 0; i < 5; i++) {
                        ctx.lineTo(centerX + outerRadius * Math.cos((18 + i * 72) * Math.PI / 180),
                                   centerY - outerRadius * Math.sin((18 + i * 72) * Math.PI / 180));
                        ctx.lineTo(centerX + innerRadius * Math.cos((54 + i * 72) * Math.PI / 180),
                                   centerY - innerRadius * Math.sin((54 + i * 72) * Math.PI / 180));
                    }
                    ctx.closePath();
                    break;
            }
            ctx.fillStyle = point.color;
            ctx.fill();
        }
    });
}

// Handle Click on Data Points
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    dataPoints.forEach(point => {
        if (!point.collected) {
            const distance = Math.sqrt(Math.pow(x - (point.x + cellSize / 2), 2) + Math.pow(y - (point.y + cellSize / 2), 2));
            if (distance < cellSize / 2) {
                point.collected = true;
                onCollision();
            }
        }
    });
});

// Display Collected Shapes
function displayCollectedShapes() {
    const collectedContainer = document.getElementById('collected-shapes');
    collectedContainer.innerHTML = ''; // Clear previous shapes
    dataPoints.forEach(point => {
        if (point.collected) {
            const shapeDiv = document.createElement('div');
            shapeDiv.classList.add('shape', point.type);
            shapeDiv.style.backgroundColor = point.color;
            shapeDiv.onclick = () => addToBasket(point);
            collectedContainer.appendChild(shapeDiv);
        }
    });
}

// Add Shape to Basket
function addToBasket(point) {
    const sortingCriteria = document.querySelector('input[name="sort-type"]:checked').value;
    let basketId;

    if (sortingCriteria === 'shape') {
        // Sort by shape
        basketId = `basket-${point.type}`;
    } else if (sortingCriteria === 'color') {
        // Sort by color
        const colorMap = {
            '#ffcd56': 'yellow', // Yellow
            '#ff6f61': 'red',    // Red
            '#9966ff': 'purple'  // Purple
        };
        basketId = `basket-${colorMap[point.color]}`;
    }

    const basket = document.getElementById(basketId);
    if (basket) {
        const shapeDiv = document.createElement('div');
        shapeDiv.classList.add('shape', point.type);
        shapeDiv.style.backgroundColor = point.color;
        basket.appendChild(shapeDiv);
        checkWinCondition();
    }
}

// Check Win Condition
function checkWinCondition() {
    const sortingCriteria = document.querySelector('input[name="sort-type"]:checked').value;
    let isCorrect = true;

    if (sortingCriteria === 'shape') {
        // Check if shapes are in the correct order: circle, square, triangle, star
        const correctOrder = ['circle', 'square', 'triangle', 'star'];
        const baskets = ['basket-circle', 'basket-square', 'basket-triangle', 'basket-star'];

        baskets.forEach((basketId, index) => {
            const basket = document.getElementById(basketId);
            if (!basket.children.length || basket.children[0].classList[1] !== correctOrder[index]) {
                isCorrect = false;
            }
        });
    } else if (sortingCriteria === 'color') {
        // Check if colors are in the correct order: yellow, red, purple
        const correctOrder = ['yellow', 'red', 'purple'];
        const baskets = ['basket-yellow', 'basket-red', 'basket-purple'];

        baskets.forEach((basketId, index) => {
            const basket = document.getElementById(basketId);
            if (!basket.children.length || basket.children[0].style.backgroundColor !== correctOrder[index]) {
                isCorrect = false;
            }
        });
    }

    if (isCorrect) {
        alert('Félicitations! Vous avez gagné!');
        resetGame();
    }
}

// Reset Game
function resetGame() {
    score = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('current-task').textContent = "Utilisez les flèches du clavier pour déplacer DataBot et collecter les machins.";
    document.getElementById('sorting-options').style.display = 'none';
    dataPoints.forEach(point => point.collected = false);
    document.getElementById('collected-shapes').innerHTML = '';
    document.querySelectorAll('.basket').forEach(basket => basket.innerHTML = '');
    gameLoop();
}

// On Collision
function onCollision() {
    score += 10;
    document.getElementById('score').textContent = score;
    const allCollected = dataPoints.every(p => p.collected);
    if (allCollected) {
        document.getElementById('current-task').textContent = "Félicitations! Vous avez collecté toutes les données. Maintenant, triez-les par forme ou par couleur.";
        document.getElementById('sorting-options').style.display = 'block';
        player.finishedCollecting = true; // Mark that the player has finished collecting
    }
    displayCollectedShapes();
}

// Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze(ctx, maze);
    movePlayer(maze, dataPoints, onCollision);

    enemies.forEach(enemy => {
        drawEnemy(ctx, enemy);
        changeDirection(enemy, maze);
        moveEnemy(enemy, maze);
    });

    if (!player.finishedCollecting) {
        checkPlayerEnemyCollision(player, enemies);
    }
    drawDataPoints();
    drawPlayer(ctx);
    requestAnimationFrame(gameLoop);
}

// Start Game
gameLoop();