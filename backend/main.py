import asyncio
from fastapi import FastAPI, WebSocket
from game_state import GameState
from typing import List

app = FastAPI()

game_state = GameState()

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
            data = await websocket.receive_json()

            if "player" in data and "direction" in data:
                game_state.update_paddle(data["player"], data["direction"])

            game_state.update_ball_position()

            state = {
                "player1_y": game_state.player1_y,
                "player2_y": game_state.player2_y,
                "ball_position": game_state.ball_position,
                "obstacles": game_state.obstacles,
            }

            for client in clients:
                await client.send_json(state)

            await asyncio.sleep(0.016)  # ~60 FPS
    except:
        clients.remove(websocket)
        print(f"Connection closed: {websocket.client}")
