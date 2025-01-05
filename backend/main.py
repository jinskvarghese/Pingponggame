import asyncio
from fastapi import FastAPI, WebSocket
from game_state import GameState
from typing import List

app = FastAPI()

# Game state instance
game_state = GameState()

# Store active WebSocket connections
clients: List[WebSocket] = []

@app.get("/")
async def get():
    return {"message": "Ping Pong Game Backend Running"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    print(f"New connection from {websocket.client}")

    try:
        while True:
            # Receive player input (e.g., direction for paddle movement)
            data = await websocket.receive_json()

            # Update paddle positions
            if "player" in data and "direction" in data:
                game_state.update_paddle(data["player"], data["direction"])

            # Update ball position
            game_state.update_ball_position()

            # Broadcast updated game state to all connected clients
            state = {
                "player1_y": game_state.player1_y,
                "player2_y": game_state.player2_y,
                "ball_position": game_state.ball_position,
                "obstacles": game_state.obstacles,
            }

            # Send the updated game state to each client
            for client in clients:
                await client.send_json(state)

            await asyncio.sleep(0.016)  # ~60 FPS
    except:
        clients.remove(websocket)
        print(f"Connection closed: {websocket.client}")
