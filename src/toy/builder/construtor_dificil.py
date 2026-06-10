from __future__ import annotations

from composite.peca_unica import PecaUnica

from .base import PuzzleConstrutor
from .puzzle import QuebraCabecaDificil


class ConstrutorDificil(PuzzleConstrutor):
    """
    Construtor concreto para quebra-cabeça difícil.
    - 64 peças (grade 8x8)
    - Com rotação
    """

    def __init__(self) -> None:
        self._resultado: QuebraCabecaDificil = QuebraCabecaDificil()

    def criacao_pecas(self) -> None:
        linhas, colunas = 8, 8
        largura_peca = 1.0 / colunas
        altura_peca = 1.0 / linhas

        for linha in range(linhas):
            for col in range(colunas):
                formato = [
                    int(col * largura_peca * 100),
                    int(linha * altura_peca * 100),
                    int(largura_peca * 100),
                    int(altura_peca * 100),
                ]
                peca = PecaUnica(
                    posicao_x=col * largura_peca,
                    posicao_y=linha * altura_peca,
                    posicao_x_certa=col * largura_peca,
                    posicao_y_certa=linha * altura_peca,
                    formato_peca=formato,
                )
                self._resultado.pecas.append(peca)

    def criacao_tabuleiro(self) -> None:
        self._resultado.rotacao = True

    def distribuir_pecas(self) -> None:
        import random

        for peca in self._resultado.pecas:
            peca.posicao_x = random.uniform(0.0, 1.0)
            peca.posicao_y = random.uniform(0.0, 1.0)

    def get_resultado(self) -> QuebraCabecaDificil:
        resultado = self._resultado
        self._resultado = QuebraCabecaDificil()
        return resultado
