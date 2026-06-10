from __future__ import annotations

from composite.peca_unica import PecaUnica

from .base import PuzzleConstrutor
from .puzzle import QuebraCabecaFacil


class ConstrutorFacil(PuzzleConstrutor):
    """
    Construtor concreto para quebra-cabeça fácil.
    - 25 peças (grade 5x5)
    - Sem rotação
    """

    def __init__(self) -> None:
        self._resultado: QuebraCabecaFacil = QuebraCabecaFacil()

    def criacao_pecas(self) -> None:
        linhas, colunas = 5, 5
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
        self._resultado.rotacao = False

    def distribuir_pecas(self) -> None:
        import random

        for peca in self._resultado.pecas:
            offset_x = random.uniform(-0.1, 0.1)
            offset_y = random.uniform(-0.1, 0.1)
            peca.posicao_x = max(0.0, min(1.0, peca.posicao_x_certa + offset_x))
            peca.posicao_y = max(0.0, min(1.0, peca.posicao_y_certa + offset_y))

    def get_resultado(self) -> QuebraCabecaFacil:
        resultado = self._resultado
        self._resultado = QuebraCabecaFacil()
        return resultado

