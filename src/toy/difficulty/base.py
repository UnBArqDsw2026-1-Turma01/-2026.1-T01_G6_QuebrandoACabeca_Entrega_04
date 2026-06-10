from abc import ABC, abstractmethod


class Difficulty(ABC):
    """
    Implementa uma classe abstrata para representar a dificuldade do jogo.
    Os templates não devem ser reimplementados pelas subclasses, e irão
        estourar em um raise de TypeError caso sejam.
    Templates:
        get_difficulty_level: Retorna o nível de dificuldade do jogo.
    """

    def __init_subclass__(cls, **kwargs):
        """
        Método para garantir que os templates não sejam reimplementados pelas subclasses.
        Para adicionar mais um template, basta adicioná-lo na lista protected_methods.
        """
        super().__init_subclass__(**kwargs)
        protected_methods = [
            "get_difficulty_level",
        ]

        for method in protected_methods:
            if method in cls.__dict__:
                raise TypeError(
                    f"{method} is a protected method and must not be overridden."
                )

    def get_difficulty_level(self) -> str:
        """
        Retorna o nível de dificuldade do jogo.
        Returns:
            str: O nível de dificuldade do jogo.
        """
        return self.__class__.__name__.replace("Difficulty", "")

    @abstractmethod
    def get_num_pieces(self) -> int:
        """
        Retorna o número de peças do jogo.
        Returns:
            int: O número de peças do jogo.
        """
        pass

    # TODO: Definir um método para retornar o tamanho das peças, ou seja, o tamanho do lado de cada peça (em pixels).
