import {cellSize, movePlayer, drawMaze, drawPlayer, createEnemy, moveEnemy, changeDirection, drawEnemy, player, checkPlayerEnemyCollision, gamePaused} from "../utils/script.js";

// Config
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let score = 0;

// Labyrinthe (0 = Path, 1 = Wall)
const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
canvas.width = maze[0].length * cellSize;
canvas.height = maze.length * cellSize;

// Enemies
let enemies = [
    createEnemy(13 * cellSize, 9 * cellSize),
    createEnemy(13 * cellSize, 13 * cellSize)
];

// Données à collecter
let dataPoints = [
    { x: 2 * cellSize, y: 1 * cellSize, collected: false, clicked: false, type: 'circle', color: '#ffcd56' }, // Yellow
    { x: 1 * cellSize, y: 5 * cellSize, collected: false, clicked: false, type: 'circle', color: '#ff6f61' }, // Red
    { x: 1 * cellSize, y: 3 * cellSize, collected: false, clicked: false, type: 'square', color: '#9966ff' }, // Purple
    { x: 3 * cellSize, y: 3 * cellSize, collected: false, clicked: false, type: 'triangle', color: '#ffcd56' }, // Yellow
    { x: 1 * cellSize, y: 4 * cellSize, collected: false, clicked: false, type: 'square', color: '#ffcd56' }, // Yellow
    { x: 2 * cellSize, y: 3 * cellSize, collected: false, clicked: false, type: 'triangle', color: '#ff6f61' }, // Red
    { x: 3 * cellSize, y: 2 * cellSize, collected: false, clicked: false, type: 'star', color: '#9966ff' }, // Purple
    { x: 3 * cellSize, y: 1 * cellSize, collected: false, clicked: false, type: 'star', color: '#ff5994	' }, // Purple
];

function drawDataPoints() {
    dataPoints.forEach(point => {
        if (!point.collected) {
            ctx.beginPath();
            switch (point.type) {
                case 'circle':
                    ctx.arc(point.x + cellSize/2, point.y + cellSize/2, cellSize/3, 0, Math.PI * 2);
                    break;
                case 'square':
                    ctx.rect(point.x + cellSize/4, point.y + cellSize/4, cellSize/2, cellSize/2);
                    break;
                case 'triangle':
                    ctx.moveTo(point.x + cellSize/2, point.y + cellSize/4);
                    ctx.lineTo(point.x + cellSize/4, point.y + 3 * cellSize/4);
                    ctx.lineTo(point.x + 3 * cellSize/4, point.y + 3 * cellSize/4);
                    ctx.closePath();
                    break;
                case 'star':
                    // Draw a star shape
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

function displayCollectedShapes() {
    const collectedContainer = document.getElementById('collected-shapes');
    collectedContainer.innerHTML = ''; // Clear previous shapes

    dataPoints.forEach(point => {
        if (point.collected && !point.clicked) {
            const shapeDiv = document.createElement('div');
            shapeDiv.classList.add('shape', point.type);
            shapeDiv.style.backgroundColor = point.color;
            shapeDiv.onclick = () => {
                if (!shapeDiv.classList.contains('clicked')) {
                    addToBasket(point, shapeDiv); // Pass the clicked shape element
                    shapeDiv.classList.add('clicked');
                }
            };
            collectedContainer.appendChild(shapeDiv);
        }
    });
}

function addToBasket(point, clickedShape) {
    // Find the next available slot in any basket
    const baskets = document.querySelectorAll('.basket');
    let added = false;

    for (const basket of baskets) {
        const slots = basket.querySelectorAll('.slot');
        for (const slot of slots) {
            if (slot.children.length === 0) { // Check if the slot is empty
                const shapeDiv = document.createElement('div');
                shapeDiv.classList.add('shape', point.type);
                shapeDiv.style.backgroundColor = point.color;
                slot.appendChild(shapeDiv);
                added = true;
                break;
            }
        }
        if (added) break;
    }

    // Mark the specific clicked shape as "clicked"
    clickedShape.classList.add('clicked');

    // Check if all baskets are full
    const allBasketsFull = Array.from(baskets).every(basket => {
        const slots = basket.querySelectorAll('.slot');
        return Array.from(slots).every(slot => slot.children.length > 0);
    });

    // If all baskets are full, check if shapes are sorted correctly
    if (allBasketsFull) {
        checkSorting();
    }
}

function showWinAnimation(){
    setTimeout(()=>{
        alert("You won!!");
    }, 1000);
}

function checkSorting() {
    const baskets = document.querySelectorAll('.basket');
    let allCorrect = true;
    console.log('start checking');

    baskets.forEach(basket => {
        const basketType = basket.id.replace('-basket', ''); // Get the basket type (circle, square, etc.)
        const slots = basket.querySelectorAll('.slot');

        // Check if all shapes in this basket match the basket type
        const shapesMatch = Array.from(slots).every(slot => {
            const shape = slot.querySelector('.shape');
            return shape && shape.classList.contains(basketType);
        });

        if (!shapesMatch) {
            allCorrect = false;
        }
    });

    // Show result
    if (allCorrect) {
        showWinAnimation();
    } else {
        resetGame();
    }
}

function resetGame() {
    alert("You didn't Sort Correctly");
    setTimeout(()=>{
        score = 0;
        document.getElementById('score').textContent = score;
        document.getElementById('current-task').textContent = 
            "Utilisez les flèches du clavier pour déplacer DataBot et collecter les machins.";
        dataPoints.forEach(point => {
            point.collected = false;
            point.clicked = false;
        });
        document.getElementById('collected-shapes').innerHTML = '';
    
        // Clear all baskets
        const baskets = document.querySelectorAll('.basket');
        baskets.forEach(basket => {
            const slots = basket.querySelectorAll('.slot');
            slots.forEach(slot => slot.innerHTML = '');
        });
        gameLoop();
    }, 1000);
}

function onCollision() {
    score += 10;
    document.getElementById('score').textContent = score;

    // Check if all data points are collected
    const allCollected = dataPoints.every(p => p.collected);
    if (allCollected) {
        document.getElementById('current-task').textContent = 
            "Félicitations! Vous avez collecté toutes les données. Maintenant, triez-les par forme.";
    }

    // Update the collected shapes list
    displayCollectedShapes();
}


function gameLoop() {
    if (!gamePaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawMaze(ctx, maze); // Ensure the maze is always drawn
        movePlayer(maze, dataPoints, onCollision);

        enemies.forEach(enemy => {
            drawEnemy(ctx, enemy);
            changeDirection(enemy, maze);
            moveEnemy(enemy, maze);
        });

        checkPlayerEnemyCollision(player, enemies);
        drawDataPoints();
        drawPlayer(ctx);
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();

