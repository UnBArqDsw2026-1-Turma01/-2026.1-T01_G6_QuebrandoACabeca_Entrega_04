"""
Representa uma peça individual do quebra-cabeça e um contexto de domínio rico, não tem aplicação real ao funcionamento do projeto em tempo de execução.

Alinhamento com o frontend (Jogo.tsx):
  - `current_pos`  ↔  posição arrastada pelo usuário (drag)
  - `correct_pos`  ↔  posição-alvo da célula no tabuleiro
  - `is_placed`    ↔  cell.filled no board do React
  - tolerância de encaixe verificada em PuzzleBoard.try_move_piece
"""

from __future__ import annotations
from PIL import Image


class Piece:
    def __init__(
        self,
        image: Image.Image,
        crop_rect: tuple[int, int, int, int],
        board_pos: tuple[int, int],
        num_pieces: int,
    ):
        """
        Args:
            image:      Fragmento recortado da imagem original.
            crop_rect:  (x0, y0, x1, y1) em pixels — região da imagem original.
            board_pos:  (linha, coluna) na grade — posição correta da peça.
            num_pieces: Tamanho N da grade N×N (varia por dificuldade).
        """
        self.image      = image
        self.crop_rect  = crop_rect
        self.board_pos  = board_pos
        self.num_pieces = num_pieces

        # Posição atual em coordenadas de grade — sobrescrita após embaralhamento
        self.current_pos: tuple[int, int] = board_pos

        # True quando o usuário encaixou a peça na célula certa
        self.is_placed: bool = False

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @property
    def piece_id(self) -> int:
        """ID único: linha * N + coluna — mesmo cálculo usado em to_pieces_json."""
        row, col = self.board_pos
        return row * self.num_pieces + col

    def __repr__(self) -> str:
        r, c = self.board_pos
        return (
            f"Piece(id={self.piece_id}, board=({r},{c}), "
            f"current={self.current_pos}, placed={self.is_placed})"
        )