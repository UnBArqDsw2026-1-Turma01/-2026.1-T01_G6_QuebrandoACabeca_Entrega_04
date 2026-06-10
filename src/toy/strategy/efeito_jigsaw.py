from __future__ import annotations

from .efeito_imagem import EfeitoImagem


class EfeitoJigsaw(EfeitoImagem):
    """
    Estratégia concreta: corte com formato jigsaw.
    Simula o corte irregular característico de quebra-cabeças tradicionais,
    aplicando uma variação nos bordos de cada peça.
    """

    def executar(self, imagem: list[list[int]]) -> list[list[int]]:
        """
        Aplica o efeito jigsaw na imagem.
        Adiciona bordas irregulares simulando encaixes de quebra-cabeça.
        """
        if not imagem or not imagem[0]:
            return imagem

        altura = len(imagem)
        largura = len(imagem[0])
        resultado = [linha[:] for linha in imagem]

        tamanho_peca = max(1, min(altura, largura) // 4)
        offset = tamanho_peca // 4  # saliência do encaixe

        # Marca as bordas das peças com valor 0 (corte)
        for i in range(0, altura, tamanho_peca):
            for j in range(largura):
                if 0 <= i < altura:
                    resultado[i][j] = 0

        for j in range(0, largura, tamanho_peca):
            for i in range(altura):
                if 0 <= j < largura:
                    resultado[i][j] = 0

        # Adiciona saliências (encaixes) no meio de cada borda
        for i in range(tamanho_peca, altura, tamanho_peca):
            meio_j = tamanho_peca // 2
            for j in range(meio_j, largura, tamanho_peca):
                for di in range(-offset, offset + 1):
                    for dj in range(-offset, offset + 1):
                        ni, nj = i + di, j + dj
                        if 0 <= ni < altura and 0 <= nj < largura:
                            resultado[ni][nj] = 255  # saliência em branco

        return resultado

    def get_nome(self) -> str:
        return "Efeito Jigsaw"

