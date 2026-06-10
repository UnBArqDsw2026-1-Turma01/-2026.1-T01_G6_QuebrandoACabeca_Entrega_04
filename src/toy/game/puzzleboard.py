from PIL import Image

from src.toy.difficulty.base import Difficulty
from src.toy.game.move import Move
from src.toy.game.piece import Piece


class PuzzleBoard:
    # Que biblioteca de imagem usar?
    def __init__(
        self, image: Image.Image, difficulty: Difficulty, shuffleOrder: list[int]
    ):
        self.image = image
        self.difficulty = difficulty
        self.shuffleOrder = shuffleOrder
        # pieces está em ordem de raster da imagem original (não-embaralhada), ou seja, E->D e C->B
        self.pieces = []
        for i in range(difficulty.get_num_pieces()):
            for j in range(difficulty.get_num_pieces()):
                cropRect = (
                    # TODO: Implementar get_piece_size em Difficulty
                    j * difficulty.get_piece_size(image.size),
                    i * difficulty.get_piece_size(image.size),
                    (j + 1) * difficulty.get_piece_size(image.size),
                    (i + 1) * difficulty.get_piece_size(image.size),
                )
                pieceImage = image.crop(cropRect)
                piece = Piece(pieceImage, cropRect, (i, j))
                self.pieces.append(piece)
        # Lista de referências para as peças em ordem embaralhada
        self.shuffledPieces = [self.pieces[i] for i in shuffleOrder]
        # Lista de referências para as peças colocadas corretamente, ou seja, na posição original da imagem
        self.correctPieces = []

        def try_move_piece(self, move: Move) -> bool:
            # Verificar se o destino da peça a ser movida está vazio
            if move.piece.cropRect == move.targetPos:
                self.correctPieces.append(move.piece)
                return True
            return False
