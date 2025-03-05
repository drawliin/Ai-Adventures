export const cellSize = 35;

// Player Spritesheet
const spriteSheet = new Image();
let spriteLoaded = false;
spriteSheet.src = "../assets/DataBot/DataBot.png";
spriteSheet.onload = () => {
    spriteLoaded = true;
};

// Player Properties
export const player = {
    x: cellSize, // Increased starting position to ensure it's not on a wall
    y: cellSize,
    width: 32, // Match sprite size
    height: 32,
    speed: 3, // Slightly increased speed
    frameX: 0,
    frameY: 0,
    frameCount: 4,
    frameDelay: 10,
    frameTimer: 0,
};

// Keyboard State
export const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// Detailed event listeners with logging
window.addEventListener("keydown", (event) => {
    switch(event.key) {
        case "ArrowUp":
            keys.ArrowUp = true;
            console.log("Up key pressed");
            break;
        case "ArrowDown":
            keys.ArrowDown = true;
            console.log("Down key pressed");
            break;
        case "ArrowLeft":
            keys.ArrowLeft = true;
            console.log("Left key pressed");
            break;
        case "ArrowRight":
            keys.ArrowRight = true;
            console.log("Right key pressed");
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
    const spriteSize = 32;
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);

    // Check all four corners of the player
    const points = [
        { x: gridX, y: gridY },
        { x: Math.floor((x + spriteSize - 1) / cellSize), y: gridY },
        { x: gridX, y: Math.floor((y + spriteSize - 1) / cellSize) },
        { x: Math.floor((x + spriteSize - 1) / cellSize), y: Math.floor((y + spriteSize - 1) / cellSize) }
    ];

    for (let point of points) {
        // Ensure point is within maze bounds
        if (point.x < 0 || point.x >= maze[0].length || 
            point.y < 0 || point.y >= maze.length) {
            console.log("Out of bounds collision:", point);
            return true; // Treat out-of-bounds as wall
        }

        if (maze[point.y][point.x] === 1) {
            console.log("Wall collision detected at:", point);
            return true;
        }
    }
    return false;
}

// Move Player
export function movePlayer(maze, objects, onCollision) {
    let newX = player.x;
    let newY = player.y;
    let isMoving = false;

    // Determine movement and direction
    if (keys.ArrowUp) {
        newY -= player.speed;
        player.frameY = 2; // Up animation row
        isMoving = true;
        console.log("Attempting to move UP");
    }
    if (keys.ArrowDown) {
        newY += player.speed;
        player.frameY = 0; // Down animation row
        isMoving = true;
        console.log("Attempting to move DOWN");
    }
    if (keys.ArrowLeft) {
        newX -= player.speed;
        player.frameY = 3; // Left animation row
        isMoving = true;
        console.log("Attempting to move LEFT");
    }
    if (keys.ArrowRight) {
        newX += player.speed;
        player.frameY = 1; // Right animation row
        isMoving = true;
        console.log("Attempting to move RIGHT");
    }

    // Check wall collisions separately for X and Y
    const canMoveX = !checkWallCollision(newX, player.y, maze);
    const canMoveY = !checkWallCollision(player.x, newY, maze);

    // Update position if movement is allowed
    if (canMoveX) {
        player.x = newX;
        console.log("X movement allowed");
    }
    if (canMoveY) {
        player.y = newY;
        console.log("Y movement allowed");
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

    const spriteSize = 32; // Each sprite is 24x24 in the sheet
    const scale = 1; // Adjust scale as needed

    const displaySize = spriteSize * scale; // Scaled size

    // Draw a semi-transparent background box behind the player
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)"; // Red with transparency
    ctx.fillRect(player.x, player.y, displaySize, displaySize);

    ctx.drawImage(
        spriteSheet,
        player.frameX * spriteSize, // Crop X
        player.frameY * spriteSize, // Crop Y
        spriteSize, 
        spriteSize, // Crop size
        player.x, 
        player.y, // Position on canvas
        spriteSize * scale, 
        spriteSize * scale // Scale it up
    );
}

// Data Collision
export function checkDataCollision(objects, onCollision) {
    objects.forEach(obj => {
        if (!obj.collected) {
            const dx = (player.x + cellSize / 2) - (obj.x + cellSize / 2);
            const dy = (player.y + cellSize / 2) - (obj.y + cellSize / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < cellSize / 2) {
                obj.collected = true;
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