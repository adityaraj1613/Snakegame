const board_border = 'black';
const board_background = '#c8e6c9';
const snake_col = '#ff5722';
const snake_border = '#d32f2f';
const obstacle_col = '#3949ab';
const obstacle_border = '#1a237e';

let snake = [
  { x: 200, y: 200 },
  { x: 190, y: 200 },
  { x: 180, y: 200 },
  { x: 170, y: 200 },
  { x: 160, y: 200 },
];

let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let changing_direction = false;
let food_x;
let food_y;
let dx = 10;
let dy = 0;
let game_speed = 100;
let obstacles = [
  { x: 100, y: 100 },
  { x: 300, y: 100 },
  { x: 100, y: 300 },
  { x: 300, y: 300 }
];

const snakecanvas = document.getElementById('snakecanvas');
const snakecanvas_ctx = snakecanvas.getContext('2d');

document.getElementById('score').innerHTML = `Score: 0 | High Score: ${highScore}`;

main();
spawn_food();
document.addEventListener('keydown', change_direction);

function main() {
  if (has_game_ended()) {
    updateHighScore();
    return;
  }

  changing_direction = false;
  setTimeout(function onTick() {
    clear_canvas();
    makeFood();
    drawObstacles();
    move_snake();
    drawSnake();
    main();
  }, game_speed);
}

function clear_canvas() {
  snakecanvas_ctx.fillStyle = board_background;
  snakecanvas_ctx.strokestyle = board_border;
  snakecanvas_ctx.fillRect(0, 0, snakecanvas.width, snakecanvas.height);
  snakecanvas_ctx.strokeRect(0, 0, snakecanvas.width, snakecanvas.height);
}

function drawSnake() {
  snake.forEach(drawSnakePart);
}

function makeFood() {
  snakecanvas_ctx.fillStyle = '#8bc34a';
  snakecanvas_ctx.strokeStyle = '#388e3c';
  snakecanvas_ctx.fillRect(food_x, food_y, 10, 10);
  snakecanvas_ctx.strokeRect(food_x, food_y, 10, 10);
}

function drawSnakePart(snakePart) {
  snakecanvas_ctx.fillStyle = snake_col;
  snakecanvas_ctx.strokeStyle = snake_border;
  snakecanvas_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  snakecanvas_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawObstacles() {
  obstacles.forEach(obstacle => {
    snakecanvas_ctx.fillStyle = obstacle_col;
    snakecanvas_ctx.strokeStyle = obstacle_border;
    snakecanvas_ctx.fillRect(obstacle.x, obstacle.y, 10, 10);
    snakecanvas_ctx.strokeRect(obstacle.x, obstacle.y, 10, 10);
  });
}

function has_game_ended() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > snakecanvas.width - 10;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > snakecanvas.height - 10;
  
  const hitObstacle = obstacles.some(obstacle => 
    obstacle.x === snake[0].x && obstacle.y === snake[0].y
  );
  
  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall || hitObstacle;
}

function random_food(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function spawn_food() {
  food_x = random_food(0, snakecanvas.width - 10);
  food_y = random_food(0, snakecanvas.height - 10);
  snake.forEach(function has_snake_eaten_food(part) {
    const has_eaten = part.x == food_x && part.y == food_y;
    if (has_eaten) spawn_food();
  });
}

function change_direction(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  if (changing_direction) return;
  changing_direction = true;
  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;
  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

function move_snake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
  if (has_eaten_food) {
    score += 1;
    document.getElementById('score').innerHTML = `Score: ${score} | High Score: ${highScore}`;
    spawn_food();
  } else {
    snake.pop();
  }
}

function setDifficulty(level) {
  if (level === 'easy') {
    game_speed = 150;
  } else if (level === 'medium') {
    game_speed = 100;
  } else if (level === 'hard') {
    game_speed = 50;
  }
  main();
}

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
    document.getElementById('score').innerHTML = `Score: ${score} | High Score: ${highScore}`;
  }
}
