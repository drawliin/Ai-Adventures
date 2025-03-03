
export const cellSize = 30;

// DataBot Position
export const player = {
    x: cellSize,
    y: cellSize,
    width: cellSize - 6,
    height: cellSize - 6,
    speed: 3,
    color: '#FF5994'
};

// DRAW PLAYER
export function drawPlayer(ctx) {
    ctx.beginPath();
    ctx.arc(player.x + cellSize/2, player.y + cellSize/2, player.width/2, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
}

// draw maze
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

// Wall Collision
function checkWallCollision(x, y, maze) {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    
    // Vérifier les 4 coins du joueur
    const points = [
        { x: gridX, y: gridY },
        { x: Math.floor((x + player.width) / cellSize), y: gridY },
        { x: gridX, y: Math.floor((y + player.height) / cellSize) },
        { x: Math.floor((x + player.width) / cellSize), y: Math.floor((y + player.height) / cellSize) }
    ];
    
    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        if (maze[point.y][point.x] === 1) {
            return true;
        }
    }
    
    return false;
}


// Detect Data Collision
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


// Moving DataBot
let direction = null;
window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") direction = "up";
    if (event.key === "ArrowDown") direction = "down";
    if (event.key === "ArrowLeft") direction = "left";
    if (event.key === "ArrowRight") direction = "right";
});

export function movePlayer(maze, objects, onCollision) {
    let newX = player.x;
    let newY = player.y;

    if (direction === "up") newY -= player.speed;
    if (direction === "down") newY += player.speed;
    if (direction === "left") newX -= player.speed;
    if (direction === "right") newX += player.speed;

    if (!checkWallCollision(newX, player.y, maze)) {
        player.x = newX;
    }
    if (!checkWallCollision(player.x, newY, maze)) {
        player.y = newY;
    }

    checkDataCollision(objects, onCollision)
}