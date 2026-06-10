from __future__ import annotations

import importlib

from dtos import GetToyDifficultyPayload, ResultPayload

from .base import Difficulty


def get_difficulty(dto: GetToyDifficultyPayload) -> ResultPayload[Difficulty]:
    """
    Importa e instancia a classe de dificuldade selecionada dinamicamente.
    Args:
        selected_difficulty (str): A dificuldade selecionada.
    Returns:
        Difficulty: A instância da dificuldade selecionada.
    """
    selected_difficulty = dto.difficulty

    try:
        module = importlib.import_module(
            f".{selected_difficulty.lower()}", package=__package__
        )

        class_name = f"{selected_difficulty.capitalize()}Difficulty"
        backend_class = getattr(module, class_name)

        if not issubclass(backend_class, Difficulty):
            raise ValueError(
                f"Class '{class_name}' in '{selected_difficulty}.py' module does not implement Difficulty."
            )

        return ResultPayload(
            success=True, message=["Was able to get difficulty!"], data=backend_class()
        )
    except ImportError:
        return ResultPayload(
            success=False,
            error=[f"Difficulty '{selected_difficulty}' not found."],
        )

    except AttributeError:
        return ResultPayload(
            success=False,
            error=[
                f"Class '{class_name}' not found in '{selected_difficulty}.py' module."
            ],
        )
