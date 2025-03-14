export let gamePaused = false;
export const MovingDirection = {
    up: 0,
    down: 1,
    left: 2,
    right: 3
};

export let gameOverSound = new Audio("../assets/sounds/gameOver.wav");
export let gameWinSound = new Audio("../assets/sounds/gameWin.wav");

export const cellSize = 30;
const scale = 1.2;

// Player Spritesheet
const spriteSheet = new Image();
let spriteLoaded = false;
spriteSheet.src = "../assets/DataBot/DataBot.png";
spriteSheet.onload = () => {
    spriteLoaded = true;
};

// Player Properties
export const player = {
    x: cellSize, 
    y: cellSize,
    hitboxWidth: 18, // Smaller than sprite width
    hitboxHeight: 20, // Smaller than sprite height
    speed: 3, // Slightly increased speed
    frameX: 0,
    frameY: 0,
    frameCount: 4,
    frameDelay: 10,
    frameTimer: 0,
};

// Keyboard State
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// Event listeners for keyboard input
window.addEventListener("keydown", (event) => {
    switch(event.key) {
        case "ArrowUp":
            keys.ArrowUp = true;
            break;
        case "ArrowDown":
            keys.ArrowDown = true;
            break;
        case "ArrowLeft":
            keys.ArrowLeft = true;
            break;
        case "ArrowRight":
            keys.ArrowRight = true;
            break;
    }
});

window.addEventListener("keyup", (event) => {
    switch(event.key) {
        case "ArrowUp":
            keys.ArrowUp = false;
            break;
        case "ArrowDown":
            keys.ArrowDown = false;
            break;
        case "ArrowLeft":
            keys.ArrowLeft = false;
            break;
        case "ArrowRight":
            keys.ArrowRight = false;
            break;
    }
});

// Wall Collision Check
function checkWallCollision(x, y, maze) {
    const hitboxWidth = player.hitboxWidth;  // Use player hitbox width
    const hitboxHeight = player.hitboxHeight; // Use player hitbox height

    // Calculate the scaled hitbox dimensions
    const hitboxWidthScaled = hitboxWidth * scale;
    const hitboxHeightScaled = hitboxHeight * scale;

    // Calculate grid positions based on the player position and hitbox size
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);

    // Check all four corners of the hitbox
    const points = [
        { x: gridX, y: gridY }, // Top-left
        { x: Math.floor((x + hitboxWidthScaled - 1) / cellSize), y: gridY }, // Top-right
        { x: gridX, y: Math.floor((y + hitboxHeightScaled - 1) / cellSize) }, // Bottom-left
        { x: Math.floor((x + hitboxWidthScaled - 1) / cellSize), y: Math.floor((y + hitboxHeightScaled - 1) / cellSize) } // Bottom-right
    ];

    for (let point of points) {
        // Ensure point is within maze bounds
        if (point.x < 0 || point.x >= maze[0].length || 
            point.y < 0 || point.y >= maze.length) {
            return true; 
        }

        // Check if the point collides with a wall
        if (maze[point.y][point.x] === 1) {
            return true;
        }
    }
    return false; // No collision detected
}

// Move Player
export function movePlayer(maze, objects, onCollision) {
    if (gamePaused) return;
    let newX = player.x;
    let newY = player.y;
    let isMoving = false;

    // Determine movement and direction
    if (keys.ArrowUp) {
        newY -= player.speed;
        player.frameY = 2; // Up animation row
        isMoving = true;
    }
    if (keys.ArrowDown) {
        newY += player.speed;
        player.frameY = 0; // Down animation row
        isMoving = true;
    }
    if (keys.ArrowLeft) {
        newX -= player.speed;
        player.frameY = 3; // Left animation row
        isMoving = true;
    }
    if (keys.ArrowRight) {
        newX += player.speed;
        player.frameY = 1; // Right animation row
        isMoving = true;
    }

    // Check wall collisions separately for X and Y
    const canMoveX = !checkWallCollision(newX, player.y, maze);
    const canMoveY = !checkWallCollision(player.x, newY, maze);

    // Update position if movement is allowed
    if (canMoveX) {
        player.x = newX;
    }
    if (canMoveY) {
        player.y = newY;
    }

    // Handle animation
    if (isMoving) {
        player.frameTimer++;
        if (player.frameTimer >= player.frameDelay) {
            player.frameX = (player.frameX + 1) % player.frameCount;
            player.frameTimer = 0;
        }
    } else {
        player.frameX = 0; // Reset to first frame when not moving
    }

    // Check data collision
    checkDataCollision(objects, onCollision);
}

// Draw Player
export function drawPlayer(ctx) {
    if (!spriteLoaded) return;

    const spriteSize = 32; // Original sprite crop size
    const displaySize = spriteSize * scale; // Final drawn size of sprite

    // Calculate scaled hitbox dimensions
    const hitboxWidthScaled = player.hitboxWidth * scale;
    const hitboxHeightScaled = player.hitboxHeight * scale;

    // Draw background rectangle for the hitbox (for debugging/visualization)
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)"; // A semi-transparent red
    ctx.fillRect(player.x , player.y , hitboxWidthScaled, hitboxHeightScaled);

    // Draw the player sprite on top
    ctx.drawImage(
        spriteSheet,
        player.frameX * spriteSize,
        player.frameY * spriteSize,
        spriteSize,
        spriteSize,
        player.x - Math.ceil(player.hitboxWidth / 2),
        player.y - Math.ceil(player.hitboxHeight / 2),
        displaySize,
        displaySize
    );
}

let dataSound = new Audio("../assets/sounds/waka.wav");
// Data Collision
export function checkDataCollision(objects, onCollision) {
    objects.forEach(obj => {
        if (!obj.collected) {
            const dx = (player.x + cellSize / 2) - (obj.x + cellSize / 2);
            const dy = (player.y + cellSize / 2) - (obj.y + cellSize / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < cellSize / 2) {
                obj.collected = true;
                dataSound.play();

                onCollision();
            }
        }
    });
}

// Draw Maze
export function drawMaze(ctx, maze) {
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === 1) {
                ctx.fillStyle = '#6DD3FF';
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
}

// Enemy Functions
export function createEnemy(x, y) {
    return {
        x: x,
        y: y,
        speed: 2,
        movingDirection: Math.floor(Math.random() * Object.keys(MovingDirection).length),
        directionTimerDefault: random(100, 300),
        directionTimer: random(100, 300),
        image: loadImage("../assets/images/ghost.png")
    };
}

function loadImage(src) {
    const image = new Image();
    image.src = src;
    return image;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function moveEnemy(enemy, maze) {
    if (didCollideWithEnvironment(enemy, maze, enemy.movingDirection)) {
        changeDirection(enemy, maze);
    } else {
        switch (enemy.movingDirection) {
            case MovingDirection.up:
                enemy.y -= enemy.speed;
                break;
            case MovingDirection.down:
                enemy.y += enemy.speed;
                break;
            case MovingDirection.left:
                enemy.x -= enemy.speed;
                break;
            case MovingDirection.right:
                enemy.x += enemy.speed;
                break;
        }
    }
}

export function changeDirection(enemy, maze) {
    enemy.directionTimer--;
    let newMoveDirection = null;
    if (enemy.directionTimer === 0) {
        enemy.directionTimer = enemy.directionTimerDefault;
    
        let validDirectionFound = false;
        let attempts = 0;
    
        while (!validDirectionFound && attempts < 10) {
            newMoveDirection = Math.floor(Math.random() * Object.keys(MovingDirection).length);
            if (!didCollideWithEnvironment(enemy, maze, newMoveDirection)) {
                validDirectionFound = true;
                enemy.movingDirection = newMoveDirection;
            }
            attempts++;
        }
    }

    if (newMoveDirection != null && enemy.movingDirection != newMoveDirection) {
        if (Number.isInteger(enemy.x / cellSize) && Number.isInteger(enemy.y / cellSize)) {
            if (!didCollideWithEnvironment(enemy, maze, newMoveDirection)) {
                enemy.movingDirection = newMoveDirection;
            }
        }
    }
}

export function drawEnemy(ctx, enemy) {
    ctx.fillStyle = "black"; // Change color if needed
    ctx.fillRect(enemy.x, enemy.y, cellSize, cellSize); // Draw background
    ctx.drawImage(enemy.image, enemy.x, enemy.y, cellSize, cellSize);
}

function didCollideWithEnvironment(enemy, maze, direction = enemy.movingDirection) {
    let newX = enemy.x;
    let newY = enemy.y;

    switch (direction) {
        case MovingDirection.up:
            newY -= enemy.speed;
            break;
        case MovingDirection.down:
            newY += enemy.speed;
            break;
        case MovingDirection.left:
            newX -= enemy.speed;
            break;
        case MovingDirection.right:
            newX += enemy.speed;
            break;
    }

    const hitboxSize = cellSize * 0.8; // Adjust for a smaller hitbox
    const points = [
        { x: Math.floor(newX / cellSize), y: Math.floor(newY / cellSize) }, // Top-left
        { x: Math.floor((newX + hitboxSize) / cellSize), y: Math.floor(newY / cellSize) }, // Top-right
        { x: Math.floor(newX / cellSize), y: Math.floor((newY + hitboxSize) / cellSize) }, // Bottom-left
        { x: Math.floor((newX + hitboxSize) / cellSize), y: Math.floor((newY + hitboxSize) / cellSize) } // Bottom-right
    ];

    for (let point of points) {
        if (point.x < 0 || point.x >= maze[0].length || point.y < 0 || point.y >= maze.length || maze[point.y][point.x] === 1) {
            return true; // Collision detected
        }
    }

    return false; // No collision
}

let gameOver = false;
export function checkPlayerEnemyCollision(player, enemies) {
    enemies.forEach(enemy => {
        if (Math.abs(player.x - enemy.x) < cellSize / 2 && Math.abs(player.y - enemy.y) < cellSize / 2 && !gameOver) {
            gameOver = true;
            gameOverSound.play();
            alert("Game Over!");
            setTimeout(()=>{
                document.location.reload();
            }, 2000);
        }
    });
}