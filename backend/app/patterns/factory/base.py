from abc import ABC, abstractmethod


class Difficulty(ABC):
    """
    Implementa uma classe abstrata para representar a dificuldade do jogo.
    Os templates não devem ser reimplementados pelas subclasses, e irão
        estourar em um raise de TypeError caso sejam.
    Templates:
        get_difficulty_level: Retorna o nível de dificuldade do jogo.
        get_piece_size: Retorna o tamanho do lado de cada peça, em pixels.
    """

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        protected_methods = [
            "get_difficulty_level",
            "get_piece_size",
        ]
        for method in protected_methods:
            if method in cls.__dict__:
                raise TypeError(
                    f"{method} is a protected method and must not be overridden."
                )

    def get_difficulty_level(self) -> str:
        """Retorna o nível de dificuldade do jogo."""
        return self.__class__.__name__.replace("Difficulty", "")

    def get_piece_size(self, image_size: tuple[int, int]) -> int:
        """
        Retorna o tamanho do lado de cada peça, em pixels.
        Divide a menor dimensão da imagem pelo número de colunas/linhas do grid.

        Args:
            image_size: Tupla (largura, altura) da imagem original em pixels.
        Returns:
            int: Tamanho do lado de cada peça em pixels.
        """
        largura, altura = image_size
        return min(largura, altura) // self.get_grid_size()

    @abstractmethod
    def get_num_pieces(self) -> int:
        """
        Retorna o número total de peças do jogo.
        Returns:
            int: Total de peças (ex: 25 para 5x5).
        """
        ...

    @abstractmethod
    def get_grid_size(self) -> int:
        """
        Retorna o número de colunas (e linhas) do grid.
        Returns:
            int: Lado do grid (ex: 5 para um grid 5x5).
        """
        ...