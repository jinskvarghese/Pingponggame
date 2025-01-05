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




const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;  // Set the width of the canvas (game area)
canvas.height = 400; // Set the height of the canvas (game area)

const paddleWidth = 10;
const paddleHeight = 100;

let paddle1Y = (canvas.height - paddleHeight) / 2;
let paddle2Y = (canvas.height - paddleHeight) / 2;

const paddleSpeed = 10;

let gameOver = false;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballRadius = 10;
let ballSpeedX = 5;
let ballSpeedY = 5;

let scorePlayer1 = 0;
let scorePlayer2 = 0;


const obstacleSize = 30;
let obstacles = [];

function generateObstacles() {
    for (let i = 0; i < 2; i++) {
        let obstacleX = Math.random() * (canvas.width - obstacleSize);
        let obstacleY = Math.random() * (canvas.height - obstacleSize);

        while (Math.abs(obstacleX - ballX) < obstacleSize + ballRadius &&
               Math.abs(obstacleY - ballY) < obstacleSize + ballRadius) {
            obstacleX = Math.random() * (canvas.width - obstacleSize);
            obstacleY = Math.random() * (canvas.height - obstacleSize);
        }

        while ((obstacleY < paddleHeight || obstacleY > canvas.height - paddleHeight - obstacleSize) &&
               Math.abs(obstacleX - ballX) > obstacleSize + ballRadius) {
            obstacleX = Math.random() * (canvas.width - obstacleSize);
            obstacleY = Math.random() * (canvas.height - obstacleSize);
        }

        obstacles.push({ x: obstacleX, y: obstacleY });
    }
}

document.addEventListener("keydown", (event) => {
    if (event.key === "w" && paddle1Y > 0) {
        paddle1Y -= paddleSpeed; 
    }
    if (event.key === "s" && paddle1Y + paddleHeight < canvas.height) {
        paddle1Y += paddleSpeed; 
    }
    if (event.key === "ArrowUp" && paddle2Y > 0) {
        paddle2Y -= paddleSpeed; 
    }
    if (event.key === "ArrowDown" && paddle2Y + paddleHeight < canvas.height) {
        paddle2Y += paddleSpeed; 
    }
});

function checkBallObstacleCollision() {
    obstacles.forEach(obstacle => {
        const dx = ballX - (obstacle.x + obstacleSize / 2);
        const dy = ballY - (obstacle.y + obstacleSize / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ballRadius + obstacleSize / 2) {
            ballSpeedX = -ballSpeedX;
            ballSpeedY = -ballSpeedY;
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const paddleGradient1 = ctx.createLinearGradient(0, paddle1Y, paddleWidth, paddle1Y + paddleHeight);
    paddleGradient1.addColorStop(0, "#32CD32");
    paddleGradient1.addColorStop(1, "#228B22");
    ctx.fillStyle = paddleGradient1;
    ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight); 

    const paddleGradient2 = ctx.createLinearGradient(canvas.width - paddleWidth, paddle2Y, canvas.width, paddle2Y + paddleHeight);
    paddleGradient2.addColorStop(0, "#FF6347"); 
    paddleGradient2.addColorStop(1, "#FF4500"); 
    ctx.fillStyle = paddleGradient2;
    ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);  // Player 2 paddle
    ctx.fillStyle = "#ff0000";
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacleSize, obstacleSize);  // Draw obstacle
    });

    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD700";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#FF4500";
    ctx.fill();
    ctx.shadowBlur = 0; 

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY - ballRadius <= 0 || ballY + ballRadius >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballX - ballRadius <= paddleWidth && ballY >= paddle1Y && ballY <= paddle1Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballX + ballRadius >= canvas.width - paddleWidth && ballY >= paddle2Y && ballY <= paddle2Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }


function updateScore(player) {
    if (player === 1) {
        scorePlayer1++;
    } else {
        scorePlayer2++;
    }
    document.getElementById("score").innerText = `${scorePlayer1} - ${scorePlayer2}`;

    if (scorePlayer1 >= 5) {
        displayWinner("Player 1 Wins!");
        gameOver = true;
    } else if (scorePlayer2 >= 5) {
        displayWinner("Player 2 Wins!");
        gameOver = true;
    }
}

if (ballX - ballRadius <= 0) {
    updateScore(2);
    resetBall();
} else if (ballX + ballRadius >= canvas.width) {
    updateScore(1);
    resetBall();
}

checkBallObstacleCollision();

if (!gameOver) {
    requestAnimationFrame(draw);
} else {
    cancelAnimationFrame(draw);  // Stop the animation
}
}

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

    setTimeout(() => {
        resetGame();
    }, 3000);
}

function resetGame() {
    scorePlayer1 = 0;
    scorePlayer2 = 0;
    gameOver = false;
    obstacles = [];
    generateObstacles(); 
    resetBall(); 
    document.getElementById("score").innerText = "0 - 0"; 
    requestAnimationFrame(draw); 
}


function resetBall() {
    ballX = canvas.width / 2;
    ballY = Math.random() * (canvas.height - ballRadius * 2) + ballRadius;
    
    const angle = Math.random() * (Math.PI / 3) + Math.PI / 12; 
    const speed = 4 + Math.random() * 3; 
    
    ballSpeedX = Math.cos(angle) * speed * (Math.random() < 0.5 ? 1 : -1);
    ballSpeedY = Math.sin(angle) * speed * (Math.random() < 0.5 ? 1 : -1);
}


function showGameOver(winner) {
    const winnerText = winner === 1 ? "Player 1" : "Player 2";
    alert(`${winnerText} wins!`);
    document.getElementById("game-over-message").innerText = `${winnerText} wins!`;
    document.getElementById("game-over-message").style.display = "block";
    resetBall();
    scorePlayer1 = 0;
    scorePlayer2 = 0;
    gameOver = false;
}

function gameLoop() {
    if (!gameOver) {
        moveBall();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

generateObstacles();
draw();
