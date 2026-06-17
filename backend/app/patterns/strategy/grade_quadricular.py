from __future__ import annotations

from .efeito_imagem import EfeitoImagem


class GradeQuadricular(EfeitoImagem):
    """
    Estratégia concreta: grade quadricular com bordas visíveis.
    Similar ao EfeitoGradeQuadricular, mas desenha as linhas da grade
    explicitamente na imagem, tornando a divisão das peças visível ao jogador.
    """

    def executar(self, imagem: list[list[int]]) -> list[list[int]]:
        """
        Aplica grade quadricular com bordas desenhadas na imagem.
        """
        if not imagem or not imagem[0]:
            return imagem

        altura = len(imagem)
        largura = len(imagem[0])
        resultado = [linha[:] for linha in imagem]

        tamanho_bloco = max(1, min(altura, largura) // 4)

        # Desenha linhas horizontais da grade
        for i in range(0, altura, tamanho_bloco):
            for j in range(largura):
                resultado[i][j] = 0

        # Desenha linhas verticais da grade
        for j in range(0, largura, tamanho_bloco):
            for i in range(altura):
                resultado[i][j] = 0

        return resultado

    def get_nome(self) -> str:
        return "Grade Quadricular"

