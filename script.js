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
  dataPoints.forEach(point => point.draw(ctx));
  dataBot.collectData(dataPoints); // Check for collisions

  requestAnimationFrame(gameLoop);
}

// DATABOT CLASS
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

    collectData(dataPoints) {
      dataPoints.forEach((point, index) => {
        if (
          this.x < point.x + point.size &&
          this.x + this.size > point.x &&
          this.y < point.y + point.size &&
          this.y + this.size > point.y
        ) {
          dataPoints.splice(index, 1); // Remove the collected data point
          console.log("Data collected!");
        }
      });
    }
}

// DATAPOINT CLASS
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
// DATABOT OBJECT
const dataBot = new DataBot(250, 250, 20, "red", 5);

// MOVING DATABOT
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") dataBot.move(0, -1);
    if (e.key === "ArrowDown") dataBot.move(0, 1);
    if (e.key === "ArrowLeft") dataBot.move(-1, 0);
    if (e.key === "ArrowRight") dataBot.move(1, 0);
  });


// CREATING DATAPOINTS OBJECTS
const dataPoints = [
  new DataPoint(300, 300, 10, "green"),
  new DataPoint(500, 200, 10, "green"),
  new DataPoint(100, 400, 10, "green")
];


// Start the game loop
gameLoop();