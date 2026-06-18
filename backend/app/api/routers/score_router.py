"""
Router de Pontuação.

Endpoints:
    GET  /score/me          — pontuação do usuário autenticado
    POST /score/submit      — registra nova pontuação e atualiza progresso
    GET  /score/ranking     — top 10 global
    GET  /score/levels/progress — progresso dos níveis (estrelas e desbloqueio)

Persistência: SQLAlchemy + SQLite (tabelas `score_entries` e `user_level_progress`).
"""

from __future__ import annotations
from datetime import datetime

from fastapi import APIRouter, status
from pydantic import BaseModel, Field
from sqlalchemy import func

from infrastructure.database.models import (
    ScoreEntry as ScoreEntryModel,
    UserLevelProgress,
    User
)
from core.dependencies import CurrentUser, DbSession

router = APIRouter()

# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class SubmitScoreRequest(BaseModel):
    puzzle_id: str
    level_id: int = Field(..., ge=0, description="1-4 para níveis, 0 para imagem própria")  # permitir 0
    score: int = Field(..., ge=0)
    time_seconds: int = Field(..., ge=0)
    stars: int = Field(..., ge=0, le=3)
    hints_used: int = Field(..., ge=0)
    time_limit_on: bool
    shuffle_on: bool


class ScoreEntry(BaseModel):
    user_id: str
    puzzle_id: str
    level_id: int
    score: int
    time_seconds: int
    stars: int
    hints_used: int
    time_limit_on: bool
    shuffle_on: bool
    created_at: datetime

class RankingEntry(BaseModel):
    user_id: str
    name: str
    best_score: int


class LevelProgressResponse(BaseModel):
    level_id: int
    best_stars: int
    completed: bool


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/submit", response_model=ScoreEntry, status_code=status.HTTP_201_CREATED)
def submit_score(
    req: SubmitScoreRequest,
    user: CurrentUser,
    db: DbSession,
) -> ScoreEntry:
    # 1. Salvar entrada de score (sempre)
    entry = ScoreEntryModel(
        user_id=user.id,
        puzzle_id=req.puzzle_id,
        level_id=req.level_id,
        score=req.score,
        time_seconds=req.time_seconds,
        stars=req.stars,
        hints_used=req.hints_used,
        time_limit_on=req.time_limit_on,
        shuffle_on=req.shuffle_on,
    )
    db.add(entry)

    # 2. Atualizar progresso do nível SOMENTE se level_id > 0 (não é imagem própria)
    if req.level_id > 0:
        progress = db.query(UserLevelProgress).filter(
            UserLevelProgress.user_id == user.id,
            UserLevelProgress.level_id == req.level_id
        ).first()

        if not progress:
            progress = UserLevelProgress(
                user_id=user.id,
                level_id=req.level_id,
                best_stars=0,
                completed=False
            )
            db.add(progress)

        # Se as estrelas atuais são maiores que o melhor registro, atualiza
        if req.stars > progress.best_stars:
            progress.best_stars = req.stars

        # Se o jogador obteve pelo menos 1 estrela, marca como completado
        if req.stars > 0:
            progress.completed = True

    db.commit()
    db.refresh(entry)

    return ScoreEntry(
        user_id=user.id,
        puzzle_id=req.puzzle_id,
        level_id=req.level_id,
        score=req.score,
        time_seconds=req.time_seconds,
        stars=req.stars,
        hints_used=req.hints_used,
        time_limit_on=req.time_limit_on,
        shuffle_on=req.shuffle_on,
        created_at=entry.created_at,
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
            level_id=e.level_id,
            score=e.score,
            time_seconds=e.time_seconds,
            stars=e.stars,
            hints_used=e.hints_used,
            time_limit_on=e.time_limit_on,
            shuffle_on=e.shuffle_on,
            created_at=e.created_at,
        )
        for e in entries
    ]


@router.get("/ranking", response_model=list[RankingEntry])
def ranking(db: DbSession) -> list[RankingEntry]:
    rows = (
        db.query(
            ScoreEntryModel.user_id,
            User.name,
            func.sum(ScoreEntryModel.score).label("best_score"),
        )
        .join(User, User.id == ScoreEntryModel.user_id)
        .group_by(ScoreEntryModel.user_id, User.name)
        .order_by(func.sum(ScoreEntryModel.score).desc())
        .limit(10)
        .all()
    )
    return [RankingEntry(user_id=row.user_id, name=row.name, best_score=row.best_score) for row in rows]


@router.get("/levels/progress", response_model=list[LevelProgressResponse])
def get_level_progress(
    user: CurrentUser,
    db: DbSession,
) -> list[LevelProgressResponse]:
    """
    Retorna o progresso do usuário para todos os níveis (1 a 4).
    Se um nível ainda não tiver registro, retorna best_stars=0 e completed=False.
    """
    progresses = db.query(UserLevelProgress).filter(
        UserLevelProgress.user_id == user.id
    ).all()

    progress_map = {p.level_id: p for p in progresses}

    result = []
    for level_id in range(1, 5):
        p = progress_map.get(level_id)
        result.append(LevelProgressResponse(
            level_id=level_id,
            best_stars=p.best_stars if p else 0,
            completed=p.completed if p else False,
        ))
    return result