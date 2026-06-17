from __future__ import annotations

from abc import ABC, abstractmethod

from .puzzle import QuebraCabecaDificil, QuebraCabecaFacil, QuebraCabecaMedio


class PuzzleConstrutor(ABC):
    """
    <<interface>> PuzzleConstrutor
    Define os passos de construção de um quebra-cabeça.
    Conforme diagrama Builder do GOF Criacional.
    """

    @abstractmethod
    def criacao_pecas(self) -> None:
        """Cria e configura as peças do quebra-cabeça."""
        ...

    @abstractmethod
    def criacao_tabuleiro(self) -> None:
        """Cria e configura o tabuleiro."""
        ...

    @abstractmethod
    def distribuir_pecas(self) -> None:
        """Distribui as peças no tabuleiro."""
        ...

    @abstractmethod
    def get_resultado(
        self,
    ) -> QuebraCabecaFacil | QuebraCabecaMedio | QuebraCabecaDificil:
        """
        Retorna o produto construído e reseta o builder
        para que possa ser reutilizado.
        """
        ...

