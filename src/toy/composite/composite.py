from __future__ import annotations

from .component import Component


class Composite(Component):
    """
    Composite — representa um grupo de peças que se movem juntas.

    Permite tratar um conjunto de peças (já encaixadas entre si) como
    uma única unidade, viabilizando a lógica de montar subgrupos antes
    de completar o quebra-cabeça inteiro.

    Atributos:
        componentes: List<Component>

    Métodos extras além da interface Component:
        adicionar(c)  – adiciona um componente ao grupo
        remover(c)    – remove um componente do grupo
        get_filhos()  – retorna todos os componentes filhos
    """

    def __init__(self) -> None:
        self._componentes: list[Component] = []

    # Gerenciamento de filhos

    def adicionar(self, c: Component) -> None:
        """Adiciona um componente (PecaUnica ou outro Composite) ao grupo."""
        if c is self:
            raise ValueError("Um Composite não pode conter a si mesmo.")
        self._componentes.append(c)

    def remover(self, c: Component) -> None:
        """Remove um componente do grupo."""
        self._componentes.remove(c)

    def get_filhos(self) -> list[Component]:
        """Retorna a lista de componentes filhos."""
        return list(self._componentes)

    # Component interface — delega para todos os filhos

    def mover(self, delta_x: float, delta_y: float) -> None:
        """Move todos os componentes do grupo."""
        for componente in self._componentes:
            componente.mover(delta_x, delta_y)

    def verificar_colisao(self) -> bool:
        """
        Retorna True somente se TODOS os componentes filhos
        estiverem na posição correta.
        Retorna False se o grupo estiver vazio.
        """
        if not self._componentes:
            return False
        return all(c.verificar_colisao() for c in self._componentes)

    def get_posicao(self) -> list[float]:
        """
        Retorna a posição média do grupo (centroide).
        Retorna [0.0, 0.0] se o grupo estiver vazio.
        """
        if not self._componentes:
            return [0.0, 0.0]

        posicoes = [c.get_posicao() for c in self._componentes]
        media_x = sum(p[0] for p in posicoes) / len(posicoes)
        media_y = sum(p[1] for p in posicoes) / len(posicoes)
        return [media_x, media_y]

    def __len__(self) -> int:
        return len(self._componentes)

    def __repr__(self) -> str:
        return (
            f"Composite(filhos={len(self._componentes)}, "
            f"todos_encaixados={self.verificar_colisao()})"
        )
