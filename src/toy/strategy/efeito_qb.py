from __future__ import annotations

from .efeito_imagem import EfeitoImagem


class EfeitoQB:
    """
    Contexto do padrão Strategy.
    Mantém uma referência para a estratégia atual e delega
    a execução do efeito para ela.

    Conforme diagrama Strategy do GOF Comportamental:
        EfeitoQB
          - estrategia: EfeitoImagem
          + setEfeito(e: EfeitoImagem)
          + escolherEfeito()
          + aplicarEfeito()
          + getEfeito(): EfeitoImagem
    """

    def __init__(self, estrategia: EfeitoImagem | None = None) -> None:
        self._estrategia = estrategia

    def set_efeito(self, e: EfeitoImagem) -> None:
        """Define a estratégia de efeito a ser usada."""
        self._estrategia = e

    def get_efeito(self) -> EfeitoImagem | None:
        """Retorna a estratégia atual."""
        return self._estrategia

    def escolher_efeito(self) -> str:
        """Retorna o nome do efeito atual."""
        if self._estrategia is None:
            return "Nenhum efeito selecionado."
        return self._estrategia.get_nome()

    def aplicar_efeito(self, imagem: list[list[int]]) -> list[list[int]]:
        """
        Aplica o efeito atual na imagem.
        Args:
            imagem: Representação da imagem como matriz de pixels.
        Returns:
            Imagem processada pela estratégia atual.
        Raises:
            ValueError: Se nenhuma estratégia foi definida.
        """
        if self._estrategia is None:
            raise ValueError("Nenhum efeito (EfeitoImagem) foi definido.")
        return self._estrategia.executar(imagem)

