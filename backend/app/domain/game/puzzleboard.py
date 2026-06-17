"""
Tabuleiro do quebra-cabeça e um contexto de domínio rico, não tem aplicação real ao funcionamento do projeto em tempo de execução.

Responsabilidades:
  - Recortar a imagem em peças (grade N×N definida pela dificuldade)
  - Embaralhar as peças e rastrear suas posições atuais
  - Validar movimentos com tolerância de encaixe (espelho do Jogo.tsx)
  - Informar se o puzzle está completo

Alinhamento com o frontend (Jogo.tsx):
  - Grade N×N  ↔  BOARD_SIZE / DEF no React
  - Tolerância ↔  TOLERANCE em puzzle_router.py (10 px) e na lógica abaixo
  - `is_complete()` ↔  `next === TOTAL_TARGETS` que dispara navigate('/jogo/vitoria')
  - `shuffled_pieces` ↔  TRAY_INIT embaralhado no React
"""

from __future__ import annotations

import random
from PIL import Image

from patterns.factory.base import Difficulty
from domain.game.move import Move
from domain.game.piece import Piece


class PuzzleBoard:
    # Tolerância em unidades de grade para considerar encaixe correto.
    # Em pixels seria equivalente ao TOLERANCE=10 do puzzle_router.
    SNAP_TOLERANCE: int = 0

    def __init__(
        self,
        image: Image.Image,
        difficulty: Difficulty,
        shuffle_order: list[int] | None = None,
    ):
        """
        Args:
            image:         Imagem PIL já redimensionada.
            difficulty:    Objeto de dificuldade com get_num_pieces() e get_piece_size().
            shuffle_order: Ordem de embaralhamento (índices). Se None, embaralha aleatoriamente.
        """
        self.image      = image
        self.difficulty = difficulty
        n               = difficulty.get_num_pieces()

        # ------------------------------------------------------------------
        # Recorta a imagem em N×N peças em ordem raster (E→D, C→B)
        # ------------------------------------------------------------------
        self.pieces: list[Piece] = []

        for row in range(n):
            for col in range(n):
                piece_size  = difficulty.get_piece_size(image.size)
                crop_rect   = (
                    col * piece_size,
                    row * piece_size,
                    (col + 1) * piece_size,
                    (row + 1) * piece_size,
                )
                piece_image = image.crop(crop_rect)
                # num_pieces passado no construtor — sem atribuição externa
                piece       = Piece(piece_image, crop_rect, (row, col), num_pieces=n)
                self.pieces.append(piece)

        # ------------------------------------------------------------------
        # Embaralhamento
        # ------------------------------------------------------------------
        total = len(self.pieces)

        if shuffle_order is None:
            shuffle_order = list(range(total))
            random.shuffle(shuffle_order)

        if len(shuffle_order) != total:
            raise ValueError(
                f"shuffle_order tem {len(shuffle_order)} elementos, "
                f"esperado {total} (grade {n}×{n})."
            )

        self.shuffle_order: list[int] = shuffle_order
        # Peças na ordem em que aparecem no tray do frontend
        self.shuffled_pieces: list[Piece] = [self.pieces[i] for i in shuffle_order]

        # Atualiza current_pos de cada peça para refletir o embaralhamento
        for shuffled_idx, original_idx in enumerate(shuffle_order):
            row_s, col_s = divmod(shuffled_idx, n)
            self.pieces[original_idx].current_pos = (row_s, col_s)

        # Peças já encaixadas corretamente
        self.correct_pieces: list[Piece] = []

    # ------------------------------------------------------------------
    # Movimentação
    # ------------------------------------------------------------------

    def try_move_piece(self, move: Move) -> bool:
        """
        Tenta encaixar a peça no destino indicado pelo Move.

        Retorna True se a peça encaixou na posição correta (dentro da tolerância).
        Espelha a lógica de encaixe do Jogo.tsx:
            if (cell.color === cur.color) → peça correta na célula certa

        A tolerância aqui é em unidades de grade (SNAP_TOLERANCE=0 significa
        exato); o puzzle_router usa tolerância em pixels (10 px) porque lida
        com coordenadas de tela.
        """
        piece   = move.piece
        target  = move.target_pos
        correct = piece.board_pos

        # Peça já encaixada — ignora movimento
        if piece.is_placed:
            return False

        # Célula já ocupada por outra peça
        occupied = {p.current_pos for p in self.correct_pieces}
        if target in occupied:
            return False

        # Verifica tolerância em cada eixo
        row_ok = abs(target[0] - correct[0]) <= self.SNAP_TOLERANCE
        col_ok = abs(target[1] - correct[1]) <= self.SNAP_TOLERANCE

        if row_ok and col_ok:
            piece.current_pos = target
            piece.is_placed   = True
            self.correct_pieces.append(piece)
            return True

        # Movimento inválido — atualiza posição atual mesmo assim (peça foi arrastada)
        piece.current_pos = target
        return False

    # ------------------------------------------------------------------
    # Estado do tabuleiro
    # ------------------------------------------------------------------

    def is_complete(self) -> bool:
        """True quando todas as peças estão encaixadas — espelha `next === TOTAL_TARGETS`."""
        return len(self.correct_pieces) == len(self.pieces)

    @property
    def pieces_remaining(self) -> int:
        """Quantidade de peças ainda não encaixadas — espelha `pieces_remaining` do MoveResponse."""
        return len(self.pieces) - len(self.correct_pieces)

    # ------------------------------------------------------------------
    # Serialização — para persistência via puzzle_router / PuzzleState
    # ------------------------------------------------------------------

    def to_pieces_json(self) -> list[dict]:
        """
        Converte o estado atual para o formato esperado por PieceSchema no puzzle_router:
            { id, posicao_x, posicao_y, posicao_x_certa, posicao_y_certa, encaixada }
        """
        piece_size = self.difficulty.get_piece_size(self.image.size)

        return [
            {
                "id":              piece.piece_id,
                "posicao_x":       piece.current_pos[1] * piece_size,
                "posicao_y":       piece.current_pos[0] * piece_size,
                "posicao_x_certa": piece.board_pos[1] * piece_size,
                "posicao_y_certa": piece.board_pos[0] * piece_size,
                "encaixada":       piece.is_placed,
            }
            for piece in self.pieces
        ]

    def __repr__(self) -> str:
        n = self.difficulty.get_num_pieces()
        return (
            f"PuzzleBoard({n}×{n}, "
            f"{len(self.correct_pieces)}/{len(self.pieces)} encaixadas)"
        )