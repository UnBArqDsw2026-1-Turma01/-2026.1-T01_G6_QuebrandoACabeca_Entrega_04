from typing import Any, Generic, Self, TypeVar

T = TypeVar("T", covariant=True)


def _serialize(value: Any) -> Any:
    if isinstance(value, BasePayload):
        return value.to_dict()

    if isinstance(value, list):
        return [_serialize(v) for v in value]

    if isinstance(value, dict):
        return {k: _serialize(v) for k, v in value.items()}

    return value


class BasePayload:
    """
    Classe base para as DTOs (Data Transfer Objects) usados na aplicação.

    A forma de utilizar é simples: crie uma nova classe que herde disso, e defina os atributos usando __slots__.

    Notes:
        These are mutable DTOs optimized for CLI startup performance.
        We use __slots__ instead of dataclasses to keep import time minimal.

    Methods:
        __repr__: A string representation of the object, useful for debugging.
        __eq__: A method to compare two payload objects for equality.
        to_dict: A method to convert the object to a dictionary recursively, useful for serialization.
        from_dict(dict[str, Any]): A class method to create a payload object from a dictionary, useful for deserialization.
    """

    __slots__ = ()

    def __repr__(self) -> str:
        attrs = ", ".join(f"{slot}={getattr(self, slot)!r}" for slot in self.__slots__)
        return f"{self.__class__.__name__}({attrs})"

    def __eq__(self, other: Any) -> bool:
        if self.__class__ is not other.__class__:
            return NotImplemented

        return all(
            getattr(self, slot) == getattr(other, slot) for slot in self.__slots__
        )

    def to_dict(self) -> dict[str, Any]:
        """Convert payload to dictionary, recursively converting nested payloads."""

        return {s: _serialize(getattr(self, s)) for s in self.__slots__}

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Self:
        return cls(**{s: data[s] for s in cls.__slots__ if s in data})


class ExamplePayload(BasePayload):
    __slots__ = ("name", "age", "friends")

    def __init__(self, name: str, age: int, friends: list[str]) -> None:
        self.name = name
        self.age = age
        self.friends = friends


# Implementação do Result Pattern. Uso disso é operacional, não forçado, mas nessa aplicação, deve-se usar
# ao invés de lançar exceções para lidar com erros, retornando um ResultPayload com success=False e mensagens de erro.
# Note que o ResultPayload é apenas mais uma DTO.
class ResultPayload(BasePayload, Generic[T]):
    """
    Payload de resposta para operações. Deve ser usado para retornar o resultado de uma função,
        incluindo mensagens de sucesso, dados e erros. USAR ISSO AO INVÉS DE LANÇAR EXCEÇÕES.

    Ao definir o retorno dessa classe, use "ResultPayload[TipoDoDado]" para especificar o tipo do dado que será retornado.

    Attributes:
        success: A boolean indicating whether the operation was successful or not.
        message: A list of strings containing any messages that should be returned to the user.
        error: A list of strings containing any error messages that should be returned to the user.
        data: Any data that should be returned to the user, can be of any type
    """

    __slots__ = (
        "success",
        "message",
        "error",
        "data",
    )

    def __init__(
        self,
        success: bool,
        message: list[str] | None = None,
        error: list[str] | None = None,
        data: T | None = None,
    ):
        self.success = success
        self.message = message or []
        self.error = error or []
        self.data = data


class GetToyDifficultyPayload(BasePayload):
    __slots__ = ("difficulty",)

    def __init__(self, difficulty: str) -> None:
        self.difficulty = difficulty
