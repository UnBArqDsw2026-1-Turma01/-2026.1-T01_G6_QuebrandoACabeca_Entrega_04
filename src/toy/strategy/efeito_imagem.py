from __future__ import annotations

from abc import ABC, abstractmethod


class EfeitoImagem(ABC):
    """
    <<interface>> EfeitoImagem
    Define a interface comum para todos os algoritmos de corte/efeito.
    Conforme diagrama Strategy do GOF Comportamental.
    """

    @abstractmethod
    def executar(self, imagem: list[list[int]]) -> list[list[int]]:
        """
        Executa o efeito/corte na imagem.
        Args:
            imagem: Representação da imagem como matriz de pixels.
        Returns:
            Imagem processada.
        """
        ...

    @abstractmethod
    def get_nome(self) -> str:
        """Retorna o nome do efeito/algoritmo."""
        ...

