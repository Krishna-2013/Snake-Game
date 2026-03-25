const board = document.querySelector(".board");
const modal = document.querySelector(".modal");

const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");

const startbtn = document.querySelector(".btn-start");
const restartbtn = document.querySelector(".btn-restart");

const highScoreEl = document.querySelector("#high-score");
const ScoreEl = document.querySelector("#score");
const timeEl = document.querySelector("#time");

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = "00-00";

highScoreEl.innerText = highScore;

const blockHeight = 50;
const blockWidth = 50;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

const blocks = [];
let snake = [
  {
    x: 1,
    y: 3,
  },
];
let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

let direction = "right";
let intervalId = null;
let timerIntervalId = null;

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row}-${col}`] = block;
  }
}

function controls_and_gameLogic() {
  let head = null;

  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  }

  // Wall
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(intervalId);
    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
    return;
  }

  // snake body
  snake.forEach((el) => {
    if (el.x === head.x && el.y === head.y) {
      clearInterval(intervalId);
      modal.style.display = "flex";
      startGameModal.style.display = "none";
      gameOverModal.style.display = "flex";
      return;
    }
  });

  // if(head.x === food.x && head.y === food.y) {

  // }

  snake.forEach((el) => {
    blocks[`${el.x}-${el.y}`].classList.remove("fill", "head");
  });

  snake.unshift(head);
  snake.pop();

  //Food Part
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    blocks[`${food.x}-${food.y}`].classList.add("food");
    snake.unshift(head);

    // Score
    score += 10;
    ScoreEl.innerText = score;

    // highScore
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore.toString());
      highScoreEl.innerText = highScore;
    }
  }
}

function render() {
  blocks[`${food.x}-${food.y}`].classList.add("food");

  snake.forEach((el) => {
    blocks[`${el.x}-${el.y}`].classList.add("fill");
  });

  blocks[`${snake[0].x}-${snake[0].y}`].classList.add("head");
}

startbtn.addEventListener("click", (e) => {
  modal.style.display = "none";
  intervalId = setInterval(() => {
    controls_and_gameLogic();
    render();
  }, 300);
  timerIntervalId = setInterval(() => {
    let [min, sec] = time.split("-").map(Number);

    if (sec === 59) {
      min += 1;
      sec = 0;
    } else {
      sec += 1;
    }
    time = `${min}-${sec}`;
    timeEl.innerText = time;
  }, 1000);
});

restartbtn.addEventListener("click", restartGame);

function restartGame() {
  blocks[`${food.x}-${food.y}`].classList.remove("food");

  snake.forEach((el) => {
    blocks[`${el.x}-${el.y}`].classList.remove("fill", "head");
  });

  score = 0;
  time = "00-00";

  ScoreEl.innerText = score;
  highScoreEl.innerText = highScore;
  timeEl.innerText = time;

  modal.style.display = "none";
  direction = "down";

  snake = [{ x: 1, y: 3 }];

  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };

  intervalId = setInterval(() => {
    controls_and_gameLogic();
    render();
  }, 300);
}

addEventListener("keydown", (e) => {
  // console.log(e.code);
  const keyCode = e.code;
  if (keyCode === "ArrowUp" || keyCode === "KeyW") {
    direction = "up";
  } else if (keyCode === "ArrowDown" || keyCode === "KeyS") {
    direction = "down";
  } else if (keyCode === "ArrowRight" || keyCode === "KeyD") {
    direction = "right";
  } else if (keyCode === "ArrowLeft" || keyCode === "KeyA") {
    direction = "left";
  }
});
