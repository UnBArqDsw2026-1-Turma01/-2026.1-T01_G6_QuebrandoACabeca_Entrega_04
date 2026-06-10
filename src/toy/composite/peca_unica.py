from __future__ import annotations

from dataclasses import dataclass, field

from .component import Component

_TOLERANCIA = 0.02  # distância máxima para considerar encaixada


@dataclass
class PecaUnica(Component):
    """
    Leaf do padrão Composite.
    Representa uma peça individual do quebra-cabeça.

    formato_peca   : [x_origem, y_origem, largura, altura] em pixels/unidade
    """

    posicao_x: float = 0.0
    posicao_y: float = 0.0
    posicao_x_certa: float = 0.0
    posicao_y_certa: float = 0.0
    formato_peca: list[int] = field(default_factory=lambda: [0, 0, 100, 100])

    # Component interface

    def mover(self, delta_x: float, delta_y: float) -> None:
        """Desloca a peça pelos deltas fornecidos."""
        self.posicao_x += delta_x
        self.posicao_y += delta_y

    def verificar_colisao(self) -> bool:
        """
        Retorna True se a peça estiver suficientemente próxima
        da sua posição correta (encaixada).
        """
        return (
            abs(self.posicao_x - self.posicao_x_certa) <= _TOLERANCIA
            and abs(self.posicao_y - self.posicao_y_certa) <= _TOLERANCIA
        )

    def get_posicao(self) -> list[float]:
        return [self.posicao_x, self.posicao_y]

    # Extras específicos da Leaf

    def get_formato(self) -> list[int]:
        """Retorna o formato da peça [x_origem, y_origem, largura, altura]."""
        return list(self.formato_peca)

    def esta_montada(self) -> bool:
        """Tradução de verificar_colisao para a linguagem do jogo."""
        return self.verificar_colisao()

    def __repr__(self) -> str:
        return (
            f"PecaUnica(pos=({self.posicao_x:.2f},{self.posicao_y:.2f}), "
            f"certa=({self.posicao_x_certa:.2f},{self.posicao_y_certa:.2f}), "
            f"encaixada={self.esta_montada()})"
        )

