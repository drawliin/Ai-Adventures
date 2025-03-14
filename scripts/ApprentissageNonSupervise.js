import { cellSize, movePlayer, drawMaze, drawPlayer, createEnemy, moveEnemy, changeDirection, drawEnemy, player, checkPlayerEnemyCollision, gamePaused, gameOverSound, gameWinSound } from "../utils/script.js";

const sortingOptions = document.querySelectorAll('input[name="sort-type"]');
const basketsContainer = document.querySelector('.baskets');

sortingOptions.forEach(option => {
    option.addEventListener('change', (event) => {
        const selectedOption = event.target.value; // Get the selected option (shape or color)
        generateBaskets(selectedOption); // Generate baskets based on the selected option
    });
});

function generateBaskets(sortType) {
    // Clear existing baskets
    basketsContainer.innerHTML = '';

    if (sortType === 'shape') {
        // Generate baskets for shapes
        const shapes = ['circle', 'square', 'triangle', 'star'];
        shapes.forEach(shape => {
            const basket = document.createElement('div');
            basket.classList.add('basket');
            basket.id = `${shape}-basket`;

            const title = document.createElement('h3');
            title.textContent = `${shape.charAt(0).toUpperCase() + shape.slice(1)} Basket`;
            basket.appendChild(title);

            // Add slots for shapes
            for (let i = 0; i < 2; i++) {
                const slot = document.createElement('div');
                slot.classList.add('slot');
                basket.appendChild(slot);
            }

            basketsContainer.appendChild(basket);
        });
    } else if (sortType === 'color') {
        // Generate baskets for colors
        const colors = ['#ffcd56', '#ff6f61', '#9966ff', '#4aa8db']; // Yellow, Red, Purple, blue
        colors.forEach(color => {
            const basket = document.createElement('div');
            basket.classList.add('basket');
            basket.id = `${color.replace('#', '')}-basket`;

            const title = document.createElement('h3');
            title.textContent = `Color Basket (${color})`;
            basket.appendChild(title);

            // Add slots for colors
            for (let i = 0; i < 2; i++) {
                const slot = document.createElement('div');
                slot.classList.add('slot');
                basket.appendChild(slot);
            }

            basketsContainer.appendChild(basket);
        });
    }
}

function checkSorting() {
    const baskets = document.querySelectorAll('.basket');
    let allCorrect = true;

    const sortType = document.querySelector('input[name="sort-type"]:checked').value;

    baskets.forEach(basket => {
        let expectedType;
        if (sortType === 'shape') {
            expectedType = basket.id.replace('-basket', ''); // Get the shape type (circle, square, etc.)
        } else if (sortType === 'color') {
            expectedType = `#${basket.id.replace('-basket', '')}`; // Get the color type (e.g., #ffcd56)
        }

        const slots = basket.querySelectorAll('.slot');

        // Check if all shapes in this basket match the expected type
        const shapesMatch = Array.from(slots).every(slot => {
            const shape = slot.querySelector('.shape');
            if (!shape) return false;

            if (sortType === 'shape') {
                return shape.classList.contains(expectedType);
            } else if (sortType === 'color') {
                return shape.style.backgroundColor === expectedType;
            }
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

// Initialize baskets with the default sorting option (shape)
document.addEventListener('DOMContentLoaded', () => {
    const defaultSortType = document.querySelector('input[name="sort-type"]:checked').value;
    generateBaskets(defaultSortType);
});

function showWinAnimation(){
    const nextButton = document.getElementById('next-button');
    gameWinSound.play();
    setTimeout(()=>{
        alert("Bravoo👏👏.. Passer Vers le niveau suivant!!");
        nextButton.style.display = 'block'; // Show the button
    }, 1000);
}

function resetGame() {
    alert("You didn't Sort Correctly");
    gameOverSound.play();
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


// Config
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let score = 0;

// Labyrinthe (0 = Path, 1 = Wall)
const maze = [
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
canvas.width = maze[0].length * cellSize;
canvas.height = maze.length * cellSize;

// Données à collecter
let dataPoints = [
    { x: 2 * cellSize, y: 1 * cellSize, collected: false, type: 'circle', color: '#ffcd56' }, // Yellow
    { x: 3 * cellSize, y: 1 * cellSize, collected: false, type: 'circle', color: '#ff6f61' }, // Red
    { x: 4 * cellSize, y: 1 * cellSize, collected: false, type: 'square', color: '#ffcd56' }, // Yellow
    { x: 5 * cellSize, y: 1 * cellSize, collected: false, type: 'square', color: '#9966ff' }, // Purple
    { x: 5 * cellSize, y: 2 * cellSize, collected: false, type: 'triangle', color: '#4aa8db	' }, // blue
    { x: 4 * cellSize, y: 3 * cellSize, collected: false, type: 'triangle', color: '#ff6f61' }, // Red
    { x: 5 * cellSize, y: 3 * cellSize, collected: false, type: 'star', color: '#4aa8db	' }, // blue
    { x: 3 * cellSize, y: 3 * cellSize, collected: false, type: 'star', color: '#9966ff' }, // Purple
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
    // Get all baskets and their slots
    const allBaskets = document.querySelectorAll('.basket');
    let added = false;

    // Find the next available slot in any basket
    for (const basket of allBaskets) {
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
        if (added) break; // Stop searching once the shape is added
    }

    // Mark the specific clicked shape as "clicked"
    clickedShape.classList.add('clicked');

    // Check if all baskets are full
    const allBasketsFull = Array.from(allBaskets).every(basket => {
        const slots = basket.querySelectorAll('.slot');
        return Array.from(slots).every(slot => slot.children.length > 0);
    });

    // If all baskets are full, check if shapes are sorted correctly
    if (allBasketsFull) {
        checkSorting();
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
    
    drawMaze(ctx, maze); // Ensure the maze is always drawn
    movePlayer(maze, dataPoints, onCollision);
    
    drawDataPoints();
    drawPlayer(ctx);
    
    requestAnimationFrame(gameLoop);
}

gameLoop();

