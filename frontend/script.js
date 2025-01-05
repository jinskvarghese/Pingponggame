const socket = new WebSocket('ws://127.0.0.1:8000/ws/game');

socket.onopen = () => {
    console.log('WebSocket connected');
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.game_over) {
        showGameOver(data.winner);
    }
};




// Setup Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 800;  // Set the width of the canvas (game area)
canvas.height = 400; // Set the height of the canvas (game area)

// Paddle dimensions
const paddleWidth = 10;
const paddleHeight = 100;

// Initial paddle positions
let paddle1Y = (canvas.height - paddleHeight) / 2;
let paddle2Y = (canvas.height - paddleHeight) / 2;

// Paddle movement speed
const paddleSpeed = 10;

let gameOver = false;

// Ball properties
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballRadius = 10;
let ballSpeedX = 5;
let ballSpeedY = 5;

let scorePlayer1 = 0;
let scorePlayer2 = 0;


// Obstacle properties
const obstacleSize = 30;
let obstacles = [];

// Generate two random obstacles
function generateObstacles() {
    for (let i = 0; i < 2; i++) {
        let obstacleX = Math.random() * (canvas.width - obstacleSize);
        let obstacleY = Math.random() * (canvas.height - obstacleSize);

        // Ensure obstacles do not overlap with the ball's initial position
        while (Math.abs(obstacleX - ballX) < obstacleSize + ballRadius &&
               Math.abs(obstacleY - ballY) < obstacleSize + ballRadius) {
            obstacleX = Math.random() * (canvas.width - obstacleSize);
            obstacleY = Math.random() * (canvas.height - obstacleSize);
        }

        // Ensure obstacles are not within the paddle region
        while ((obstacleY < paddleHeight || obstacleY > canvas.height - paddleHeight - obstacleSize) &&
               Math.abs(obstacleX - ballX) > obstacleSize + ballRadius) {
            obstacleX = Math.random() * (canvas.width - obstacleSize);
            obstacleY = Math.random() * (canvas.height - obstacleSize);
        }

        // Add the obstacle to the list
        obstacles.push({ x: obstacleX, y: obstacleY });
    }
}


// Paddle movement (keyboard controls)
document.addEventListener("keydown", (event) => {
    if (event.key === "w" && paddle1Y > 0) {
        paddle1Y -= paddleSpeed;  // Move paddle 1 up
    }
    if (event.key === "s" && paddle1Y + paddleHeight < canvas.height) {
        paddle1Y += paddleSpeed;  // Move paddle 1 down
    }
    if (event.key === "ArrowUp" && paddle2Y > 0) {
        paddle2Y -= paddleSpeed;  // Move paddle 2 up
    }
    if (event.key === "ArrowDown" && paddle2Y + paddleHeight < canvas.height) {
        paddle2Y += paddleSpeed;  // Move paddle 2 down
    }
});

// Ball-Obstacle Collision Detection
function checkBallObstacleCollision() {
    obstacles.forEach(obstacle => {
        const dx = ballX - (obstacle.x + obstacleSize / 2);
        const dy = ballY - (obstacle.y + obstacleSize / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ballRadius + obstacleSize / 2) {
            // Reflect ball on collision with obstacle
            ballSpeedX = -ballSpeedX;
            ballSpeedY = -ballSpeedY;
        }
    });
}

// Draw everything on the canvas
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    const paddleGradient1 = ctx.createLinearGradient(0, paddle1Y, paddleWidth, paddle1Y + paddleHeight);
    paddleGradient1.addColorStop(0, "#32CD32");  // Green
    paddleGradient1.addColorStop(1, "#228B22");  // Dark green
    ctx.fillStyle = paddleGradient1;
    ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight);  // Player 1 paddle

    const paddleGradient2 = ctx.createLinearGradient(canvas.width - paddleWidth, paddle2Y, canvas.width, paddle2Y + paddleHeight);
    paddleGradient2.addColorStop(0, "#FF6347");  // Tomato red
    paddleGradient2.addColorStop(1, "#FF4500");  // Orange red
    ctx.fillStyle = paddleGradient2;
    ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);  // Player 2 paddle
    // Draw obstacles
    ctx.fillStyle = "#ff0000";  // Red color for obstacles
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacleSize, obstacleSize);  // Draw obstacle
    });

    // Draw the ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD700";  // Gold color for the ball
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#FF4500";  // Ball shadow effect
    ctx.fill();
    ctx.shadowBlur = 0;  // Reset shadow

    // Move the ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom
    if (ballY - ballRadius <= 0 || ballY + ballRadius >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    if (ballX - ballRadius <= paddleWidth && ballY >= paddle1Y && ballY <= paddle1Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballX + ballRadius >= canvas.width - paddleWidth && ballY >= paddle2Y && ballY <= paddle2Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }


// Function to update score when a player scores
function updateScore(player) {
    if (player === 1) {
        scorePlayer1++;
    } else {
        scorePlayer2++;
    }
    // Display the updated score
    document.getElementById("score").innerText = `${scorePlayer1} - ${scorePlayer2}`;

    // Check if any player has won (5 points)
    if (scorePlayer1 >= 5) {
        displayWinner("Player 1 Wins!");
        gameOver = true;
    } else if (scorePlayer2 >= 5) {
        displayWinner("Player 2 Wins!");
        gameOver = true;
    }
}

// Ball out of bounds (left or right)
if (ballX - ballRadius <= 0) {
    updateScore(2);  // Player 2 scores
    resetBall();
} else if (ballX + ballRadius >= canvas.width) {
    updateScore(1);  // Player 1 scores
    resetBall();
}

// Check ball and obstacle collisions
checkBallObstacleCollision();

// Call the draw function again only if game is not over
if (!gameOver) {
    requestAnimationFrame(draw);
} else {
    // Optionally stop game mechanics like movement when the game ends
    cancelAnimationFrame(draw);  // Stop the animation
}
}

// Function to display winner
function displayWinner(winnerMessage) {
    const winnerText = document.createElement("div");
    winnerText.innerText = winnerMessage;
    winnerText.style.position = "absolute";
    winnerText.style.top = "50%";
    winnerText.style.left = "50%";
    winnerText.style.transform = "translate(-50%, -50%)";
    winnerText.style.fontSize = "30px";
    winnerText.style.color = "white";
    document.body.appendChild(winnerText);

    // Reset the game after 3 seconds
    setTimeout(() => {
        resetGame();  // Reset the game instead of refreshing the page
    }, 3000);
}

// Function to reset the game
function resetGame() {
    scorePlayer1 = 0;
    scorePlayer2 = 0;
    gameOver = false;  // Reset gameOver flag
    obstacles = [];  // Clear obstacles
    generateObstacles();  // Generate new obstacles
    resetBall();  // Reset ball position
    document.getElementById("score").innerText = "0 - 0";  // Reset score display
    requestAnimationFrame(draw);  // Restart the game loop
}


// Function to reset the ball's position and velocity
function resetBall() {
    // Randomize ball's starting position (not near paddles)
    ballX = canvas.width / 2;
    ballY = Math.random() * (canvas.height - ballRadius * 2) + ballRadius;  // Random Y position
    
    // Randomize ball's velocity direction and speed
    const angle = Math.random() * (Math.PI / 3) + Math.PI / 12;  // Random angle between 15° (Math.PI/12) and 75° (Math.PI/3)
    const speed = 4 + Math.random() * 3;  // Random speed between 4 and 7
    
    ballSpeedX = Math.cos(angle) * speed * (Math.random() < 0.5 ? 1 : -1);  // Randomize direction (left or right)
    ballSpeedY = Math.sin(angle) * speed * (Math.random() < 0.5 ? 1 : -1);  // Randomize direction (up or down)
}


// Function to show the game-over message
function showGameOver(winner) {
    const winnerText = winner === 1 ? "Player 1" : "Player 2";
    alert(`${winnerText} wins!`);
    document.getElementById("game-over-message").innerText = `${winnerText} wins!`;
    document.getElementById("game-over-message").style.display = "block";
    // Optionally reset the game
    resetBall();
    scorePlayer1 = 0;
    scorePlayer2 = 0;
    gameOver = false;
}


// Game loop
function gameLoop() {
    if (!gameOver) {
        moveBall();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

// Start the game loop after generating obstacles
generateObstacles();
draw();
