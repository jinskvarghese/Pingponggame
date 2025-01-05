# Multiplayer Ping Pong Game with Dynamic Obstacles

This is a simple multiplayer ping pong game where two players can play in real-time on different browser tabs. The game includes dynamic obstacles that randomly appear on the canvas, affecting the ball's movement and adding an extra layer of challenge.

## Setup Instructions

### 1. Clone the Repository
To begin, clone this repository to your local machine:

```
git clone https://github.com/jinskvarghese/Pingponggame
```

### 2. Install Dependencies (if needed)
This project does not require additional dependencies, but you will need a local server to run it. You can use any of the following options:

- **Live Server** extension in VS Code
- **Python HTTP Server**

To use Python's HTTP server, navigate to the project directory and run:

```
python -m http.server
```

### 3. Open the Game in the Browser
Once the server is running, open the game in two separate browser tabs by navigating to:

```
http://127.0.0.1:8001
```

### 4. Start Playing
- **Player 1**: Use the **W** (up) and **S** (down) keys to control the paddle.
- **Player 2**: Use the **Up Arrow** (up) and **Down Arrow** (down) keys to control the paddle.

## How to Run the Game

### 1. Start the Server
To start the server and run the game with WebSocket support for real-time multiplayer functionality, use the following command in your terminal:

```
node server.js
```

### 2. Open the Game in Multiple Tabs
After the server is running, open two separate browser tabs, both pointing to:

```
http://127.0.0.1:8001
```

You will now be able to play the game in real-time, with one player on each tab.

## Game Mechanics

### Controls:
- **Player 1**: Use the **W** and **S** keys to move the paddle up and down.
- **Player 2**: Use the **Arrow Up** and **Arrow Down** keys to move the paddle.

### Scoring:
- A player scores when the ball crosses the opponent's paddle (left or right).
- The first player to reach 5 points wins the game.

### Obstacles:
- Two obstacles appear randomly on the canvas at the start of the game.
- The ball bounces off the obstacles, changing its trajectory and speed.

### Game Over:
- The game ends when a player scores 5 points.
- The winner is announced, and the game restarts automatically after a short delay.

## Technical Choices

### WebSockets:
WebSockets were used to enable real-time multiplayer communication between the two players, ensuring low latency and consistent gameplay.

### HTML5 Canvas:
The game is rendered using the `<canvas>` element for smooth animation and efficient rendering of game objects such as paddles, the ball, and obstacles.

### Vanilla JavaScript:
Plain JavaScript was used to implement the game logic, ensuring simplicity and complete control over the game mechanics.

## Known Limitations
- **Mobile Responsiveness**: The game is designed for desktop and not optimized for mobile devices.
- **Obstacle Mechanics**: Obstacles are static after being generated at the start of the game.
- **Minor Bugs**: Some unpredictable ball behavior may occur near the canvas edges.

## Assumptions Made
- The ball always starts at the center of the canvas after each point is scored.
- Players control their paddles using keyboard inputs.
- The game assumes two-player interaction, with no support for single-player mode.

## Future Improvements
- Adding support for mobile devices and touch controls.
- Dynamic obstacles that change position during gameplay.
- Implementing additional game modes, such as single-player with AI or power-ups.

## AI Assistance
AI tools were used to assist in portions of the code, particularly in WebSocket communication, ball physics, and game loop mechanics to speed up development.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.