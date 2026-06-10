from __future__ import annotations

from dataclasses import dataclass, field
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from composite.peca_unica import PecaUnica


@dataclass
class QuebraCabecaFacil:
    pecas: list["PecaUnica"] = field(default_factory=list)
    numero_pecas: int = 25
    rotacao: bool = False

    def __repr__(self) -> str:
        return (
            f"QuebraCabecaFácil("
            f"grade=5x5, "
            f"numero_pecas={self.numero_pecas}, "
            f"rotacao={self.rotacao}, "
            f"pecas_geradas={len(self.pecas)})"
        )


@dataclass
class QuebraCabecaMedio:
    pecas: list["PecaUnica"] = field(default_factory=list)
    numero_pecas: int = 36
    rotacao: bool = False

    def __repr__(self) -> str:
        return (
            f"QuebraCabecaMédio("
            f"grade=6x6, "
            f"numero_pecas={self.numero_pecas}, "
            f"rotacao={self.rotacao}, "
            f"pecas_geradas={len(self.pecas)})"
        )


@dataclass
class QuebraCabecaDificil:
    pecas: list["PecaUnica"] = field(default_factory=list)
    numero_pecas: int = 64
    rotacao: bool = True

    def __repr__(self) -> str:
        return (
            f"QuebraCabecaDifícil("
            f"grade=8x8, "
            f"numero_pecas={self.numero_pecas}, "
            f"rotacao={self.rotacao}, "
            f"pecas_geradas={len(self.pecas)})"
        )
