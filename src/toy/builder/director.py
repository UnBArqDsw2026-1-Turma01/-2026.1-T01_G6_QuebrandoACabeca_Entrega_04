from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from dtos import ResultPayload

from .base import PuzzleConstrutor
from .puzzle import QuebraCabecaDificil, QuebraCabecaFacil, QuebraCabecaMedio

QuebraCabeca = QuebraCabecaFacil | QuebraCabecaMedio | QuebraCabecaDificil


class Director:
    """
    Director — orquestra a construção do quebra-cabeça usando
    um PuzzleConstrutor concreto.
    """

    def __init__(self, construtor: PuzzleConstrutor | None = None) -> None:
        self._construtor = construtor

    @property
    def construtor(self) -> PuzzleConstrutor:
        if self._construtor:
            return self._construtor
        else:
            raise ValueError("Nenhum construtor (PuzzleConstrutor) foi definido.")

    @construtor.setter
    def construtor(self, construtor: PuzzleConstrutor) -> None:
        self._construtor = construtor

    def criar_quebra_cabeca(
        self, builder: PuzzleConstrutor | None = None
    ) -> ResultPayload[QuebraCabeca]:
        if builder is not None:
            self._construtor = builder

        if self._construtor is None:
            return ResultPayload(
                success=False,
                error=["Nenhum construtor (PuzzleConstrutor) foi definido."],
            )

        try:
            self._construtor.criacao_pecas()
            self._construtor.criacao_tabuleiro()
            self._construtor.distribuir_pecas()
            qc = self._construtor.get_resultado()
            return ResultPayload(
                success=True,
                message=["Quebra-cabeça criado com sucesso!"],
                data=qc,
            )
        except Exception as e:
            return ResultPayload(
                success=False,
                error=[f"Erro ao criar quebra-cabeça: {str(e)}"],
            )
