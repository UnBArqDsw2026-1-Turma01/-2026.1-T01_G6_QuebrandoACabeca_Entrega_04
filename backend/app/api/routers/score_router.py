"""
Router de Pontuação.

Endpoints:
    GET  /score/me          — pontuação do usuário autenticado
    POST /score/submit      — registra nova pontuação
    GET  /score/ranking     — top 10 global

Persistência: SQLAlchemy + SQLite (tabela `score_entries`).
"""

from __future__ import annotations

from fastapi import APIRouter, status
from pydantic import BaseModel, Field
from sqlalchemy import func

from infrastructure.database.models import ScoreEntry as ScoreEntryModel
from infrastructure.database.models import User
from core.dependencies import CurrentUser, DbSession

router = APIRouter()

# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class SubmitScoreRequest(BaseModel):
    puzzle_id: str
    score: int = Field(..., ge=0)
    time_seconds: int = Field(..., ge=0)


class ScoreEntry(BaseModel):
    user_id: str
    puzzle_id: str
    score: int
    time_seconds: int


class RankingEntry(BaseModel):
    user_id: str
    best_score: int

# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/submit", response_model=ScoreEntry, status_code=status.HTTP_201_CREATED)
def submit_score(
    req: SubmitScoreRequest,
    user: CurrentUser,
    db: DbSession,
) -> ScoreEntry:
    entry = ScoreEntryModel(
        user_id=user.id,
        puzzle_id=req.puzzle_id,
        score=req.score,
        time_seconds=req.time_seconds,
    )
    db.add(entry)
    db.commit()

    return ScoreEntry(
        user_id=user.id,
        puzzle_id=req.puzzle_id,
        score=req.score,
        time_seconds=req.time_seconds,
    )


@router.get("/me", response_model=list[ScoreEntry])
def my_scores(user: CurrentUser, db: DbSession) -> list[ScoreEntry]:
    entries = (
        db.query(ScoreEntryModel)
        .filter(ScoreEntryModel.user_id == user.id)
        .order_by(ScoreEntryModel.created_at.desc())
        .all()
    )
    return [
        ScoreEntry(
            user_id=e.user_id,
            puzzle_id=e.puzzle_id,
            score=e.score,
            time_seconds=e.time_seconds,
        )
        for e in entries
    ]


@router.get("/ranking", response_model=list[RankingEntry])
def ranking(db: DbSession) -> list[RankingEntry]:
    rows = (
        db.query(
            ScoreEntryModel.user_id,
            func.max(ScoreEntryModel.score).label("best_score"),
        )
        .group_by(ScoreEntryModel.user_id)
        .order_by(func.max(ScoreEntryModel.score).desc())
        .limit(10)
        .all()
    )
    return [RankingEntry(user_id=row.user_id, best_score=row.best_score) for row in rows]