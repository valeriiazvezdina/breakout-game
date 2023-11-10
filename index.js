// Variable for using canvas tag
let canvas;

// Initiliaze the context of canvas
let context;

// Coordinates of the ball
let ballX;
let ballY;

// Delta change of the ball speed
let ballDx = 2;
let ballDy = -2;

// Radius of the ball
const ballRadius = 15;

// Size of the paddle
const paddleHeight = 15;
const paddleWidth = 105;

// Position of the paddle
let paddleX;

// Arrow key state variables
let rightArrowPressed = false;
let leftArrowPressed = false;

// Brick grid dimensions and properties
const brickRowCount = 4;
const brickColumnCount = 7;
const brickWidth = 75;
const brickHeight = 25;
const brickPadding = 15;
const brickMarginTop = 30;
const brickMarginLeft = 30;

// Array to store brick grid
let bricks = [];

// Score variable
let score = 0;

// Lives variable
let lives = 3;

// Interval variable for game loop
let interval;

// Execute when the window is loaded
window.onload = () => {
    // Start only when user wants
    if (confirm('start the game?')) {
        // Get canvas and context
        canvas = document.getElementById('canvas-game');
        context = canvas.getContext('2d');
    
        // Initialize ball and paddle positions
        ballX = canvas.width / 2;
        ballY = canvas.height - 30;
        paddleX = (canvas.width - paddleWidth) / 2;
    
        // Set up event listeners for keyboard and mouse input
        document.addEventListener('keydown', keyDownHandler, false);
        document.addEventListener('keyup', keyUpHandler, false);
        document.addEventListener("mousemove", mouseMoveHandler, false);
    
        // Initialize bricks
        assignBricks(bricks);
        
        // Start game loop
        interval = setInterval(draw, 10);
    } else {
        // If user chooses not to start, provide a message
        alert('reload the page in case you want to play');
    }
}

/** Initialize brick positions and status
 * @param bricks - brick grid
 */
function assignBricks(bricks) {
    for (let i = 0; i < brickColumnCount; i++) {
        bricks[i] = [];
        for (let j = 0; j < brickRowCount; j++) {
            bricks[i][j] = { x: 0, y: 0, status: 1 };
        }
    }
}

/**
 * Handle key down events
 * @param event 
 */
function keyDownHandler(event) {
    if (event.key === "Right" || event.key === "ArrowRight") {
        rightArrowPressed = true;
    } else if (event.key === "Left" || event.key === "ArrowLeft") {
        leftArrowPressed = true;
    }
}

/**
 * Handle key up events
 * @param event 
 */
function keyUpHandler(event) {
    if (event.key === "Right" || event.key === "ArrowRight") {
        rightArrowPressed = false;
    } else if (event.key === "Left" || event.key === "ArrowLeft") {
        leftArrowPressed = false;
    }
}

/**
 * Handles mouse movement events
 * @param event 
 */
function mouseMoveHandler(event) {
    const relativeX = event.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

/**
 * Draws the ball
 */
function drawBall() {
    // Begins a new path (sequence of lines, curves, and etc.)
    context.beginPath();
    // Adds a circle to the path
    context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    // Sets up properties to the text 
    context.fillStyle = 'red';
    // Fills the current path
    context.fill();
    // Closes the path (sequence of lines, curves, and etc.)
    context.closePath();
}

/**
 * Draws the paddle
 */
function drawPaddle() {
    // Begins a new path (sequence of lines, curves, and etc.)
    context.beginPath();
    // Adds a rectangle to the path
    context.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    // Sets up properties to the text 
    context.fillStyle = 'red';
    // Fills the current path
    context.fill();
    // Closes the path (sequence of lines, curves, and etc.)
    context.closePath();
}

/**
 * Draws the bricks
 */
function drawBricks() {
    for (let i = 0; i < brickColumnCount; i++) {
        for (let j = 0; j < brickRowCount; j++) {
            if (bricks[i][j].status === 1) {
                const brickX = i * (brickWidth + brickPadding) + brickMarginLeft;
                const brickY = j * (brickHeight + brickPadding) + brickMarginTop;
                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;
                // Begins a new path (sequence of lines, curves, and etc.)
                context.beginPath();
                // Adds a rectangle to the path
                context.rect(brickX, brickY, brickWidth, brickHeight);
                // Sets up properties to the text 
                context.fillStyle = 'red';
                // Fills the current path
                context.fill();
                // Closes the path (sequence of lines, curves, and etc.)
                context.closePath();
            }
        }
    }
}  

/**
 * Checks collisions of the ball with bricks
 */
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
                        // Reloads the page
                        document.location.reload();
                        // Needed for Chrome to end game
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}

/**
 * Displays the gamer's score
 */
function drawScore() {
    // Sets up properties to the text 
    context.font = '16 px Arial';
    context.fillStyle = 'black';
    // Draws filled text on the canvas
    context.fillText(`Score: ${score}`, 8, 20);
}

/**
 * Displays the current amount of gamer's lives
 */
function drawLives() {
    // Sets up properties to the text 
    context.font = '16px Arial';
    context.fillStyle = 'black';
    // Draws filled text on the canvas
    context.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}
  
/**
 * Main function that starts the game loop
 */
function draw() {
    // Clears the specified rectangular area of the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Running all drawing functions
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();

    // Running collisions check
    collisionDetection();

    // Bounce the ball off the walls
    if(ballX + ballDx > (canvas.width - ballRadius) || ballX + ballDx < ballRadius) {
        ballDx = -ballDx;
    }

    // Bounce the ball off the top wall
    if(ballY + ballDy < ballRadius) {
        ballDy = -ballDy;
    }

    // Check if the ball hits the paddle or goes out of the bottom
    else if(ballY + ballDy > (canvas.height - ballRadius)) {
        if(ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballDy = -ballDy;
        }
        else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                // Reloads the page
                document.location.reload();
                // Needed for Chrome to end game
                clearInterval(interval);
            } else {
                // Reset ball and paddle positions
                ballX = canvas.width / 2;
                ballY = canvas.height - 30;
                ballDx = 2;
                ballDy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }            
        }
    }

    // Move the paddle to the right
    if (rightArrowPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = (canvas.width - paddleWidth);
        }
    } 
    
    // Move the paddle to the left
    if (leftArrowPressed) {
        paddleX -= 7;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }
    
    // Move the ball
    ballX += ballDx;
    ballY += ballDy;
}