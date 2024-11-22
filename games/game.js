// Create a game canvas dynamically
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = 800;
canvas.height = 400;
canvas.style.background = "black";
canvas.style.border = "2px solid white";
const ctx = canvas.getContext("2d");

// Game settings
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

// Player, AI, and Ball objects
const player = { x: 0, y: canvas.height / 2 - paddleHeight / 2, score: 0 };
const ai = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, score: 0 };
const ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 4, dy: 4 };

// Player movement input
let playerMove = 0;
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") playerMove = -8;
  if (e.key === "ArrowDown") playerMove = 8;
});
document.addEventListener("keyup", () => (playerMove = 0));

// Draw functions
function drawRect(x, y, width, height, color = "white") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}
function drawBall(x, y, size, color = "white") {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
}
function drawText(text, x, y, size = "20px", color = "white") {
  ctx.fillStyle = color;
  ctx.font = `${size} Arial`;
  ctx.fillText(text, x, y);
}

// Reset ball position
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx *= -1; // Reverse direction
}

// Update game state
function update() {
  // Move player paddle
  player.y += playerMove;
  player.y = Math.max(0, Math.min(canvas.height - paddleHeight, player.y)); // Keep within bounds

  // AI paddle follows the ball
  ai.y += (ball.y - (ai.y + paddleHeight / 2)) * 0.1;

  // Ball movement
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Ball collision with top and bottom walls
  if (ball.y <= 0 || ball.y + ballSize >= canvas.height) ball.dy *= -1;

  // Ball collision with paddles
  if (
    (ball.x <= player.x + paddleWidth &&
      ball.y >= player.y &&
      ball.y <= player.y + paddleHeight) ||
    (ball.x + ballSize >= ai.x &&
      ball.y >= ai.y &&
      ball.y <= ai.y + paddleHeight)
  ) {
    ball.dx *= -1; // Reverse ball direction
  }

  // Scoring logic
  if (ball.x < 0) {
    ai.score++;
    resetBall();
  }
  if (ball.x > canvas.width) {
    player.score++;
    resetBall();
  }
}

// Render game objects
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
  drawRect(0, 0, canvas.width, canvas.height, "black"); // Background
  drawRect(player.x, player.y, paddleWidth, paddleHeight); // Player paddle
  drawRect(ai.x, ai.y, paddleWidth, paddleHeight); // AI paddle
  drawBall(ball.x, ball.y, ballSize); // Ball
  drawText(`Player: ${player.score}`, 20, 30); // Player score
  drawText(`AI: ${ai.score}`, canvas.width - 100, 30); // AI score
}

// Main game loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
