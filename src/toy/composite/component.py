from __future__ import annotations

from abc import ABC, abstractmethod


class Component(ABC):
    """
    <<interface>> Component
    Define a interface comum para PecaUnica e Composite.
    Conforme diagrama Composite do GOF Estrutural.
    """

    @abstractmethod
    def mover(self, delta_x: float, delta_y: float) -> None:
        """Move o componente (peça ou grupo) pelos deltas fornecidos."""
        ...

    @abstractmethod
    def verificar_colisao(self) -> bool:
        """
        Verifica se o componente está na posição correta
        (peça encaixada no lugar certo).
        """
        ...

    @abstractmethod
    def get_posicao(self) -> list[float]:
        """Retorna a posição atual [x, y]."""
        ...

