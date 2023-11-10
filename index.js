let canvas;
let context;

let ballX;
let ballY;

let ballDx = 2;
let ballDy = -2;

const ballRadius = 15;

const paddleHeight = 15;
const paddleWidth = 105;

let paddleX;

let rightArrowPressed = false;
let leftArrowPressed = false;

const brickRowCount = 4;
const brickColumnCount = 7;
const brickWidth = 75;
const brickHeight = 25;
const brickPadding = 15;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];

let score = 0;

let lives = 3;

let interval;

window.onload = () => {
    if (confirm('start the game?')) {
        canvas = document.getElementById('canvas-game');
        context = canvas.getContext('2d');
    
        ballX = canvas.width / 2;
        ballY = canvas.height - 30;
    
        paddleX = (canvas.width - paddleWidth) / 2;
    
        document.addEventListener('keydown', keyDownHandler, false);
        document.addEventListener('keyup', keyUpHandler, false);
        document.addEventListener("mousemove", mouseMoveHandler, false);
    
    
        assignBricks(bricks);
        
        interval = setInterval(draw, 10);
    } else {
        alert('reload the page in case you want to play');
    }
}

function assignBricks(bricks) {
    for (let i = 0; i < brickColumnCount; i++) {
        bricks[i] = [];
        for (let j = 0; j < brickRowCount; j++) {
            bricks[i][j] = { x: 0, y: 0, status: 1 };
        }
    }
}

function keyDownHandler(event) {
  if (event.key === "Right" || event.key === "ArrowRight") {
    rightArrowPressed = true;
  } else if (event.key === "Left" || event.key === "ArrowLeft") {
    leftArrowPressed = true;
  }
}

function keyUpHandler(event) {
  if (event.key === "Right" || event.key === "ArrowRight") {
    rightArrowPressed = false;
  } else if (event.key === "Left" || event.key === "ArrowLeft") {
    leftArrowPressed = false;
  }
}

function mouseMoveHandler(event) {
    const relativeX = event.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth / 2;
    }
  }

function drawBall() {
    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    context.fillStyle = 'red';
    context.fill();
    context.closePath();
}

function drawPaddle() {
    context.beginPath();
    context.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    context.fillStyle = 'red';
    context.fill();
    context.closePath();
}

function drawBricks() {
    for (let i = 0; i < brickColumnCount; i++) {
        for (let j = 0; j < brickRowCount; j++) {
            if (bricks[i][j].status === 1) {
                const brickX = i * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = j * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;
                context.beginPath();
                context.rect(brickX, brickY, brickWidth, brickHeight);
                context.fillStyle = 'red';
                context.fill();
                context.closePath();
            }
        }
    }
}  

function collisionDetection() {
    for (let i = 0; i < brickColumnCount; i++) {
        for (let j = 0; j < brickRowCount; j++) {
            const b = bricks[i][j];
            if (b.status === 1) {
                if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
                    ballDy = -ballDy;
                    b.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                        clearInterval(interval); // Needed for Chrome to end game
                    }
                }
            }
        }
    }
}

function drawScore() {
    context.font = '16 px Arial';
    context.fillStyle = 'black';
    context.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
    context.font = '16px Arial';
    context.fillStyle = 'black';
    context.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}
  

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if(ballX + ballDx > canvas.width-ballRadius || ballX + ballDx < ballRadius) {
        ballDx = -ballDx;
    }

    if(ballY + ballDy < ballRadius) {
        ballDy = -ballDy;
    }

    else if(ballY + ballDy > canvas.height-ballRadius) {
        if(ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballDy = -ballDy;
        }
        else {
            lives--;
            if (!lives) {
              alert("GAME OVER");
              document.location.reload();
              clearInterval(interval); // Needed for Chrome to end game
            } else {
              ballX = canvas.width / 2;
              ballY = canvas.height - 30;
              ballDx = 2;
              ballDy = -2;
              paddleX = (canvas.width - paddleWidth) / 2;
            }            
        }
    }

    if (rightArrowPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    } 
    
    if (leftArrowPressed) {
        paddleX -= 7;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }
    
    ballX += ballDx;
    ballY += ballDy;

}