import random

class GameState:
    def __init__(self):
        # Initialize the scores for both players
        self.score_player_1 = 0
        self.score_player_2 = 0
        self.game_over = False
        self.score_limit = 5
        self.player1_y = 50  # Paddle position for player 1
        self.player2_y = 50  # Paddle position for player 2
        self.ball_position = {"x": 50, "y": 50}  # Ball position
        self.ball_velocity = {"x": 1, "y": 1}    # Ball velocity (speed)
        self.obstacles = self.generate_obstacles()  # Obstacles

    def check_game_over(self):
        if self.score_player_1 >= self.score_limit:
            self.game_over = True
            return 1  # Player 1 wins
        elif self.score_player_2 >= self.score_limit:
            self.game_over = True
            return 2  # Player 2 wins
        return 0  # Game not over

    def generate_obstacles(self):
        """Generates two obstacles with random positions."""
        return [
            {"x": random.randint(20, 80), "y": random.randint(20, 80), "size": 10}
            for _ in range(2)
        ]

    def update_paddle(self, player, direction):
        """Updates the position of the player's paddle based on the direction."""
        move_speed = 5
        if player == 1:
            if direction == 'up' and self.player1_y > 0:
                self.player1_y -= move_speed
            elif direction == 'down' and self.player1_y < 90:  # Paddle height limit
                self.player1_y += move_speed
        elif player == 2:
            if direction == 'up' and self.player2_y > 0:
                self.player2_y -= move_speed
            elif direction == 'down' and self.player2_y < 90:
                self.player2_y += move_speed

    def update_ball_position(self):
        """Updates the ball position and handles boundary collisions."""
        self.ball_position["x"] += self.ball_velocity["x"]
        self.ball_position["y"] += self.ball_velocity["y"]

        # Bounce off left or right boundary
        if self.ball_position["x"] <= 0 or self.ball_position["x"] >= 100:
            self.ball_velocity["x"] *= -1

        # Bounce off top or bottom boundary
        if self.ball_position["y"] <= 0 or self.ball_position["y"] >= 100:
            self.ball_velocity["y"] *= -1

        # TODO: Add paddle and obstacle collision logic (to be implemented later)

    def reset_game(self):
        self.score_player_1 = 0
        self.score_player_2 = 0
        # Reset all other game state parameters
        # This will reset the game when needed

    def update_score(self, player):
        if player == 1:
            self.score_player_1 += 1
        elif player == 2:
            self.score_player_2 += 1

    def get_scores(self):
        return self.score_player_1, self.score_player_2