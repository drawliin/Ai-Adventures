const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let gameOver = false;

// Game loop
function gameLoop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  // Update and draw game objects here
  dataBot.draw(ctx);

  requestAnimationFrame(gameLoop);
}

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
      this.x += dx * this.speed;
      this.y += dy * this.speed;
    }
}

const dataBot = new DataBot(250, 250, 20, "red", 5);

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") dataBot.move(0, -1);
    if (e.key === "ArrowDown") dataBot.move(0, 1);
    if (e.key === "ArrowLeft") dataBot.move(-1, 0);
    if (e.key === "ArrowRight") dataBot.move(1, 0);
  });



// Start the game loop
gameLoop();