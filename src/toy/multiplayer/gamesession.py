from src.toy.game.puzzleboard import PuzzleBoard


class GameSession:
    def __init__(self, session_id: str, players: List[Player], board: PuzzleBoard):
        self.session_id = session_id
        self.players = players
        self.board = board
