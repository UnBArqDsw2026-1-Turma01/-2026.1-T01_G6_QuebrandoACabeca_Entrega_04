"""
Representa um movimento de peça no tabuleiro e um contexto de domínio rico, não tem aplicação real ao funcionamento do projeto em tempo de execução.

Alinhamento com o frontend (Jogo.tsx / MoveRequest no puzzle_router):
  - `piece`      → a peça sendo arrastada
  - `target_pos` → (linha, coluna) da célula onde o usuário soltou a peça
"""

from __future__ import annotations
from domain.game.piece import Piece


class Move:
    def __init__(self, piece: Piece, target_pos: tuple[int, int]):
        """
        Args:
            piece:      A peça que está sendo movida.
            target_pos: Coordenada (linha, coluna) de destino na grade.
        """
        self.piece      = piece
        self.target_pos = target_pos

    def is_correct(self) -> bool:
        """Atalho: retorna True se o destino é a posição correta da peça."""
        return self.target_pos == self.piece.board_pos

    def __repr__(self) -> str:
        return f"Move(piece={self.piece.board_pos!r} → target={self.target_pos!r})"