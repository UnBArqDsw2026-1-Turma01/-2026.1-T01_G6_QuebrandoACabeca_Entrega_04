"""
Modelos de banco de dados (ORM) — SQLAlchemy.

Cada classe aqui mapeia para uma tabela no banco. Os routers/services devem
ler e escrever através destes modelos em vez de manter dicts em memória.

Tabelas:
    User          — conta de usuário (substitui o dict _USERS do auth_router)
    PuzzleState   — snapshot do estado atual de um quebra-cabeça em andamento
                    (substitui o dict _PUZZLES do puzzle_router)
    ScoreEntry    — pontuação registrada por um usuário (substitui _SCORES)
    GameSession   — sala multiplayer (substitui _ROOMS do session_router)
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from infrastructure.database.session import Base


def _new_uuid() -> str:
    return str(uuid.uuid4())


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# User
# ---------------------------------------------------------------------------

class User(Base):
    """Conta de usuário. Substitui o dict _USERS do auth_router."""

    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_new_uuid)
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False, unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=_utcnow)

    puzzles: Mapped[list["PuzzleState"]] = relationship(back_populates="owner")
    scores: Mapped[list["ScoreEntry"]] = relationship(back_populates="user")


# ---------------------------------------------------------------------------
# PuzzleState — snapshot do tabuleiro (sem histórico de movimentos)
# ---------------------------------------------------------------------------

class PuzzleState(Base):
    """
    Estado atual de um quebra-cabeça em andamento.

    Guardamos a lista de peças serializada em JSON (campo `pieces_json`),
    pois o número de peças e seus atributos variam por dificuldade — usar
    uma coluna JSON evita criar uma tabela separada por peça, já que apenas
    o snapshot mais recente importa (decisão: sem histórico de movimentos).
    """

    __tablename__ = "puzzle_states"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_new_uuid)
    owner_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=True)
    difficulty: Mapped[str] = mapped_column(String, nullable=False)
    effect_applied: Mapped[str] = mapped_column(String, nullable=False)

    # Lista de peças serializada: [{"id": 0, "posicao_x": ..., "encaixada": ...}, ...]
    pieces_json: Mapped[list] = mapped_column(JSON, nullable=False)

    completo: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=_utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=_utcnow, onupdate=_utcnow
    )

    owner: Mapped["User | None"] = relationship(back_populates="puzzles")


# ---------------------------------------------------------------------------
# ScoreEntry
# ---------------------------------------------------------------------------

class ScoreEntry(Base):
    """Pontuação registrada por um usuário ao completar um puzzle."""

    __tablename__ = "score_entries"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_new_uuid)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    puzzle_id: Mapped[str] = mapped_column(String, nullable=False)
    score: Mapped[int] = mapped_column(Integer, nullable=False)
    time_seconds: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=_utcnow)

    user: Mapped["User"] = relationship(back_populates="scores")


# ---------------------------------------------------------------------------
# GameSession — sala multiplayer
# ---------------------------------------------------------------------------

class GameSession(Base):
    """Sala multiplayer. Substitui o dict _ROOMS do session_router."""

    __tablename__ = "game_sessions"

    room_id: Mapped[str] = mapped_column(String, primary_key=True)
    host_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    puzzle_id: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, default="waiting")

    # Lista simples de user_ids dos jogadores na sala
    players_json: Mapped[list] = mapped_column(JSON, nullable=False, default=list)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=_utcnow)