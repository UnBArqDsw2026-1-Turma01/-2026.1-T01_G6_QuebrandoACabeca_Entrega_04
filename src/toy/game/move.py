from src.toy.game.piece import Piece


class Move:
    def __init__(self, piece: Piece, targetPos: tuple[int, int]):
        self.piece = piece
        self.targetPos = targetPos
