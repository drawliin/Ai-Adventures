const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Complex labyrinth
const labyrinth = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Draw the labyrinth
function drawLabyrinth() {
  const cellSize = 20; // Smaller cell size
  for (let row = 0; row < labyrinth.length; row++) {
    for (let col = 0; col < labyrinth[row].length; col++) {
      if (labyrinth[row][col] === 1) {
        ctx.fillStyle = "#333"; // Dark gray walls
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }
}

// Game variables
let gameOver = false;
let score = 0;

// DataBot class
class DataBot {
  constructor(x, y, size, color, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speed = speed;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  move(dx, dy) {
    const newX = this.x + dx * this.speed;
    const newY = this.y + dy * this.speed;

    if (this.canMove(newX, newY)) {
      this.x = newX;
      this.y = newY;
    }
  }

  canMove(newX, newY) {
    const cellSize = 20;
    const row = Math.floor(newY / cellSize);
    const col = Math.floor(newX / cellSize);

    if (
      row >= 0 &&
      row < labyrinth.length &&
      col >= 0 &&
      col < labyrinth[0].length &&
      labyrinth[row][col] === 0
    ) {
      return true;
    }
    return false;
  }

  collectData(dataPoints) {
    dataPoints.forEach((point, index) => {
      if (
        this.x < point.x + point.size &&
        this.x + this.size > point.x &&
        this.y < point.y + point.size &&
        this.y + this.size > point.y
      ) {
        dataPoints.splice(index, 1); // Remove the collected data point
        score += 10; // Increase the score
        console.log("Data collected! Score:", score);
      }
    });
  }
}

// DataPoint class
class DataPoint {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

// Enemy class
class Enemy {
  constructor(x, y, size, color, speed, dx, dy) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speed = speed;
    this.dx = dx; // Horizontal direction
    this.dy = dy; // Vertical direction
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  move() {
    const newX = this.x + this.dx * this.speed;
    const newY = this.y + this.dy * this.speed;

    if (this.canMove(newX, newY)) {
      this.x = newX;
      this.y = newY;
    } else {
      this.turnAround(); // Turn around if hitting a wall
    }
  }

  canMove(newX, newY) {
    const cellSize = 40;
    const row = Math.floor(newY / cellSize);
    const col = Math.floor(newX / cellSize);

    if (
      row >= 0 &&
      row < labyrinth.length &&
      col >= 0 &&
      col < labyrinth[0].length &&
      labyrinth[row][col] === 0
    ) {
      return true;
    }
    return false;
  }

  turnAround() {
    this.dx *= -1; // Reverse direction
    this.dy *= -1;
  }
}

// Create game objects
const dataBot = new DataBot(1 * 20 + 5, 1 * 20 + 5, 10, "blue", 5);
const dataPoints = [
  new DataPoint(4 * 20 + 5, 2 * 20 + 5, 5, "green"),
  new DataPoint(8 * 20 + 5, 5 * 20 + 5, 5, "green"),
  new DataPoint(12 * 20 + 5, 9 * 20 + 5, 5, "green"),
  new DataPoint(16 * 20 + 5, 13 * 20 + 5, 5, "green"),
  new DataPoint(20 * 20 + 5, 17 * 20 + 5, 5, "green")
];
const enemies = [
  new Enemy(5 * 20 + 5, 3 * 20 + 5, 10, "red", 1, 1, 0), // Moving right
  new Enemy(10 * 20 + 5, 7 * 20 + 5, 10, "red", 1, -1, 0), // Moving left
  new Enemy(15 * 20 + 5, 11 * 20 + 5, 10, "red", 1, 0, 1), // Moving down
  new Enemy(20 * 20 + 5, 15 * 20 + 5, 10, "red", 1, 0, -1) // Moving up
];

// Handle keyboard input
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") dataBot.move(0, -1);
  if (e.key === "ArrowDown") dataBot.move(0, 1);
  if (e.key === "ArrowLeft") dataBot.move(-1, 0);
  if (e.key === "ArrowRight") dataBot.move(1, 0);
});

// Check for game over
function checkGameOver() {
  enemies.forEach(enemy => {
    if (
      dataBot.x < enemy.x + enemy.size &&
      dataBot.x + dataBot.size > enemy.x &&
      dataBot.y < enemy.y + enemy.size &&
      dataBot.y + dataBot.size > enemy.y
    ) {
      gameOver = true;
      console.log("Game Over!");
    }
  });
}

// Draw the score
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Game loop
function gameLoop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  drawLabyrinth(); // Draw the labyrinth
  dataBot.draw(ctx);
  dataPoints.forEach(point => point.draw(ctx));
  dataBot.collectData(dataPoints);

  enemies.forEach(enemy => {
    enemy.draw(ctx);
    enemy.move(); // Move enemies
  });

  checkGameOver();
  drawScore();

  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();