import {cellSize, movePlayer, drawMaze, drawPlayer} from "../utils/script.js";

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
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
canvas.width = tutorialMaze[0].length * cellSize;
canvas.height = tutorialMaze.length * cellSize;

// Données à collecter
let dataPoints = [
    { x: 3 * cellSize, y: 5 * cellSize, collected: false, type: 'circle', color: '#ffcd56' }, // Yellow
    { x: 8 * cellSize, y: 3 * cellSize, collected: false, type: 'circle', color: '#ff6f61' }, // Red
    { x: 5 * cellSize, y: 1 * cellSize, collected: false, type: 'square', color: '#ffcd56' }, // Yellow
    { x: 12 * cellSize, y: 5 * cellSize, collected: false, type: 'square', color: '#9966ff' }, // Purple
    { x: 16 * cellSize, y: 1 * cellSize, collected: false, type: 'triangle', color: '#ffcd56' }, // Yellow
    { x: 13 * cellSize, y: 7 * cellSize, collected: false, type: 'triangle', color: '#ff6f61' }, // Red
    { x: 14 * cellSize, y: 5 * cellSize, collected: false, type: 'star', color: '#9966ff' } // Purple
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
        if (point.collected) {
            const shapeDiv = document.createElement('div');
            shapeDiv.classList.add('shape', point.type);
            shapeDiv.style.backgroundColor = point.color;
            shapeDiv.onclick = () => {
                if (!shapeDiv.classList.contains('clicked')) {
                    addToBasket(point);
                    shapeDiv.classList.add('clicked');
                }
            };
            collectedContainer.appendChild(shapeDiv);
        }
    });
}

function addToBasket(point) {
    const basketType = document.querySelector('input[name="sort-type"]:checked').value;
    let basketId;
    if (basketType === 'shape') {
        basketId = `basket-${point.type}`;
    } else if (basketType === 'color') {
        basketId = `basket-${point.color.replace('#', '')}`;
    }
    const basketContainer = document.getElementById(basketId);
    const shapeDiv = document.createElement('div');
    shapeDiv.classList.add('shape', point.type);
    shapeDiv.style.backgroundColor = point.color;
    basketContainer.appendChild(shapeDiv);

    // Check if all shapes are in the correct order
    const correctOrderShape = ['circle', 'square', 'triangle', 'star'];
    const correctOrderColor = ['ffcd56', 'ff6f61', '9966ff'];
    const collectedShapes = Array.from(basketContainer.children).map(div => basketType === 'shape' ? div.classList[1] : div.style.backgroundColor.replace('#', ''));

    if (collectedShapes.length === (basketType === 'shape' ? correctOrderShape.length : correctOrderColor.length)) {
        if (JSON.stringify(collectedShapes) === JSON.stringify(basketType === 'shape' ? correctOrderShape : correctOrderColor)) {
            // Removed showWinAnimation call
        } else {
            alert("Wrong answer! Try again.");
        }
    }
}

// My onCollision Function
function onCollision(){
    score += 10;
    document.getElementById('score').textContent = score;
    // Vérifier si toutes les données sont collectées
    const allCollected = dataPoints.every(p => p.collected);
    if (allCollected) {
        document.getElementById('current-task').textContent = 
            "Félicitations! Vous avez collecté toutes les données. Choisissez comment les trier.";
        document.getElementById('sorting-options').style.display = 'block';
    }
    displayCollectedShapes();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawMaze(ctx, tutorialMaze); // Ensure the maze is always drawn
    movePlayer(tutorialMaze, dataPoints, onCollision);
    
    drawDataPoints();
    drawPlayer(ctx);
    
    requestAnimationFrame(gameLoop);
}

gameLoop();

