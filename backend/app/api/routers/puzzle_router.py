"""
Router de Puzzle — domínio principal do jogo.

Endpoints:
    POST /puzzle/create  — recebe imagem (base64) + dificuldade, devolve peças e estado
    POST /puzzle/move    — registra um movimento de peça
    GET  /puzzle/{id}    — retorna o estado atual do tabuleiro

Persistência: SQLAlchemy + SQLite (tabela `puzzle_states`).
    O campo `pieces_json` armazena o snapshot atual de todas as peças.
    Usuário é opcional — puzzle pode ser criado sem autenticação, mas se um
    token válido for enviado, o puzzle fica vinculado ao usuário (owner_id).
"""

from __future__ import annotations

import base64
import uuid
from typing import Any

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

# Infraestrutura
from infrastructure.database.models import PuzzleState

# Dependências centralizadas
from core.dependencies import DbSession, OptionalUser

# Domínio
from patterns.builder.construtor_dificil import ConstrutorDificil
from patterns.builder.construtor_facil import ConstrutorFacil
from patterns.builder.construtor_medio import ConstrutorMedio
from patterns.builder.director import Director
from patterns.factory.factory import get_difficulty
from domain.dtos import GetToyDifficultyPayload
from patterns.strategy.efeito_grade_quadricular import EfeitoGradeQuadricular
from patterns.strategy.efeito_jigsaw import EfeitoJigsaw
from patterns.strategy.efeito_qb import EfeitoQB
from patterns.strategy.grade_quadricular import GradeQuadricular

router = APIRouter()

# ---------------------------------------------------------------------------
# Mapeamentos internos
# ---------------------------------------------------------------------------

_BUILDERS = {
    "facil":   ConstrutorFacil,
    "medio":   ConstrutorMedio,
    "dificil": ConstrutorDificil,
    "easy":    ConstrutorFacil,
    "medium":  ConstrutorMedio,
    "hard":    ConstrutorDificil,
}

_DIFFICULTY_MAP = {
    "facil":   "easy",
    "medio":   "medium",
    "dificil": "hard",
    "easy":    "easy",
    "medium":  "medium",
    "hard":    "hard",
}

_EFFECTS = {
    "grade":  EfeitoGradeQuadricular,
    "jigsaw": EfeitoJigsaw,
    "qb":     GradeQuadricular,
}

# ---------------------------------------------------------------------------
# Schemas Pydantic (DTOs da API)
# ---------------------------------------------------------------------------

class CreatePuzzleRequest(BaseModel):
    """Payload enviado pelo frontend ao iniciar uma partida."""
    image: str = Field(..., description="Imagem codificada em base64 (JPEG/PNG/WEBP)")
    difficulty: str = Field(..., description="Dificuldade: facil | medio | dificil")
    effect: str = Field(default="grade", description="Efeito visual: grade | jigsaw | qb")


class PieceSchema(BaseModel):
    id: int
    posicao_x: float
    posicao_y: float
    posicao_x_certa: float
    posicao_y_certa: float
    encaixada: bool


class CreatePuzzleResponse(BaseModel):
    puzzle_id: str
    difficulty: str
    num_pieces: int
    pieces: list[PieceSchema]
    effect_applied: str


class MoveRequest(BaseModel):
    puzzle_id: str
    piece_id: int
    new_x: float
    new_y: float


class MoveResponse(BaseModel):
    piece_id: int
    encaixada: bool
    puzzle_completo: bool
    pieces_remaining: int


class PuzzleStateResponse(BaseModel):
    puzzle_id: str
    difficulty: str
    num_pieces: int
    pieces: list[PieceSchema]
    completo: bool

# ---------------------------------------------------------------------------
# Helpers internos
# ---------------------------------------------------------------------------

def _pieces_to_json(pieces: list[PieceSchema]) -> list[dict[str, Any]]:
    return [p.model_dump() for p in pieces]


def _pieces_from_json(raw: list[dict[str, Any]]) -> list[PieceSchema]:
    return [PieceSchema(**item) for item in raw]

# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post(
    "/create",
    response_model=CreatePuzzleResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Criar puzzle",
    description="Recebe imagem em base64 e dificuldade, devolve as peças processadas.",
)
def create_puzzle(
    req: CreatePuzzleRequest,
    db: DbSession,
    owner: OptionalUser,       # ← sem login é None; com login vincula ao usuário
) -> CreatePuzzleResponse:
    # 1. Valida dificuldade
    difficulty_key = _DIFFICULTY_MAP.get(req.difficulty)
    if not difficulty_key:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Dificuldade inválida: '{req.difficulty}'. Use facil, medio ou dificil.",
        )

    dto = GetToyDifficultyPayload(difficulty=difficulty_key)
    result_diff = get_difficulty(dto)
    if not result_diff.success:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result_diff.error)

    # 2. Valida imagem base64
    try:
        base64.b64decode(req.image, validate=True)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Imagem inválida. Envie uma string base64 válida.",
        )

    # 3. Monta quebra-cabeça via Builder + Director
    builder_class = _BUILDERS[req.difficulty]
    result_builder = Director().criar_quebra_cabeca(builder_class())
    if not result_builder.success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=result_builder.error,
        )
    if not result_builder.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno: dados do quebra-cabeça ausentes.",
        )

    qc = result_builder.data

    # 4. Aplica efeito visual via Strategy
    effect_class = _EFFECTS.get(req.effect, EfeitoGradeQuadricular)
    efeito_qb = EfeitoQB()
    efeito_qb.set_efeito(effect_class())
    effect_name = efeito_qb.escolher_efeito()

    # 5. Serializa peças
    pieces = [
        PieceSchema(
            id=i,
            posicao_x=p.posicao_x,
            posicao_y=p.posicao_y,
            posicao_x_certa=p.posicao_x_certa,
            posicao_y_certa=p.posicao_y_certa,
            encaixada=False,
        )
        for i, p in enumerate(qc.pecas)
    ]

    # 6. Persiste no banco
    puzzle_id = str(uuid.uuid4())
    db_puzzle = PuzzleState(
        id=puzzle_id,
        owner_id=owner.id if owner else None,
        difficulty=req.difficulty,
        effect_applied=effect_name,
        pieces_json=_pieces_to_json(pieces),
        completo=False,
    )
    db.add(db_puzzle)
    db.commit()

    return CreatePuzzleResponse(
        puzzle_id=puzzle_id,
        difficulty=req.difficulty,
        num_pieces=len(pieces),
        pieces=pieces,
        effect_applied=effect_name,
    )


@router.post(
    "/move",
    response_model=MoveResponse,
    summary="Mover peça",
    description="Registra o movimento de uma peça e verifica se encaixou na posição certa.",
)
def move_piece(req: MoveRequest, db: DbSession) -> MoveResponse:
    db_puzzle = db.query(PuzzleState).filter(PuzzleState.id == req.puzzle_id).first()
    if not db_puzzle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Puzzle '{req.puzzle_id}' não encontrado.",
        )

    pieces = _pieces_from_json(db_puzzle.pieces_json)

    piece = next((p for p in pieces if p.id == req.piece_id), None)
    if piece is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Peça {req.piece_id} não encontrada neste puzzle.",
        )

    # new_x == -1 sinaliza remoção (peça arrastada para fora do board)
    if req.new_x == -1 and req.new_y == -1:
        piece.encaixada = False
        remaining = sum(1 for p in pieces if not p.encaixada)
        db_puzzle.pieces_json = _pieces_to_json(pieces)
        db_puzzle.completo = False
        db.commit()
        return MoveResponse(
            piece_id=req.piece_id,
            encaixada=False,
            puzzle_completo=False,
            pieces_remaining=remaining,
        )

    piece.posicao_x = req.new_x
    piece.posicao_y = req.new_y

    # Peça encaixada SOMENTE quando colocada na sua própria célula.
    # O frontend envia new_x = posicao_x_certa da CÉLULA de destino.
    # Comparamos com posicao_x_certa da PEÇA — coincidem só quando é a célula certa.
    # Tolerância mínima para aritmética de float em coordenadas normalizadas (0-1).
    TOLERANCE = 0.001
    encaixada = (
        abs(piece.posicao_x - piece.posicao_x_certa) <= TOLERANCE
        and abs(piece.posicao_y - piece.posicao_y_certa) <= TOLERANCE
    )
    piece.encaixada = encaixada

    remaining = sum(1 for p in pieces if not p.encaixada)
    puzzle_completo = remaining == 0

    db_puzzle.pieces_json = _pieces_to_json(pieces)
    db_puzzle.completo = puzzle_completo
    db.commit()

    return MoveResponse(
        piece_id=req.piece_id,
        encaixada=encaixada,
        puzzle_completo=puzzle_completo,
        pieces_remaining=remaining,
    )

@router.delete(
    "/{puzzle_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Deletar puzzle",
    description="Remove um puzzle e todas as suas peças do banco de dados permanentemente.",
)
def delete_puzzle(puzzle_id: str, db: DbSession) -> None:
    """
    Deleta um puzzle pelo ID.
    Se o modelo PuzzleState tiver cascade configurado, as peças serão removidas em cascata.
    """
    db_puzzle = db.query(PuzzleState).filter(PuzzleState.id == puzzle_id).first()
    if not db_puzzle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Puzzle '{puzzle_id}' não encontrado.",
        )
    db.delete(db_puzzle)
    db.commit()
    # Retorno vazio com status 204 (No Content)

@router.get(
    "/{puzzle_id}",
    response_model=PuzzleStateResponse,
    summary="Estado do puzzle",
    description="Retorna o estado atual de todas as peças de um puzzle.",
)
def get_puzzle_state(puzzle_id: str, db: DbSession) -> PuzzleStateResponse:
    db_puzzle = db.query(PuzzleState).filter(PuzzleState.id == puzzle_id).first()
    if not db_puzzle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Puzzle '{puzzle_id}' não encontrado.",
        )

    pieces = _pieces_from_json(db_puzzle.pieces_json)
    return PuzzleStateResponse(
        puzzle_id=puzzle_id,
        difficulty=db_puzzle.difficulty,
        num_pieces=len(pieces),
        pieces=pieces,
        completo=db_puzzle.completo,
    )