from __future__ import annotations

from .efeito_imagem import EfeitoImagem


class EfeitoGradeQuadricular(EfeitoImagem):
    """
    Estratégia concreta: corte em grade quadricular.
    Divide a imagem em blocos retangulares de tamanho uniforme.
    """

    def executar(self, imagem: list[list[int]]) -> list[list[int]]:
        """
        Aplica o efeito de grade quadricular na imagem.
        Cada célula da grade recebe a média dos pixels do bloco.
        """
        if not imagem or not imagem[0]:
            return imagem

        altura = len(imagem)
        largura = len(imagem[0])
        tamanho_bloco = max(1, min(altura, largura) // 4)

        resultado = [linha[:] for linha in imagem]

        for i in range(0, altura, tamanho_bloco):
            for j in range(0, largura, tamanho_bloco):
                bloco = [
                    imagem[x][y]
                    for x in range(i, min(i + tamanho_bloco, altura))
                    for y in range(j, min(j + tamanho_bloco, largura))
                ]
                media = sum(bloco) // len(bloco)
                for x in range(i, min(i + tamanho_bloco, altura)):
                    for y in range(j, min(j + tamanho_bloco, largura)):
                        resultado[x][y] = media

        return resultado

    def get_nome(self) -> str:
        return "Efeito Grade Quadricular"

