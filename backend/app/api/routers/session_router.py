"""
Router de Sessão Multiplayer.

Endpoints:
    POST /session/create    — cria uma sala
    POST /session/join      — entra numa sala existente
    GET  /session/{room_id} — estado atual da sala
    POST /session/leave     — sai da sala

Persistência: SQLAlchemy + SQLite (tabela `game_sessions`).
    `players_json` armazena a lista de user_ids dos jogadores na sala.
"""

from __future__ import annotations

import uuid

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from infrastructure.database.models import GameSession
from infrastructure.database.models import User
from core.dependencies import CurrentUser, DbSession

router = APIRouter()

# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class CreateSessionRequest(BaseModel):
    puzzle_id: str


class JoinSessionRequest(BaseModel):
    room_id: str


class SessionResponse(BaseModel):
    room_id: str
    host: str
    players: list[str]
    puzzle_id: str
    status: str


class MessageResponse(BaseModel):
    message: str

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_room(room_id: str, db: Session) -> GameSession:
    room = db.query(GameSession).filter(GameSession.room_id == room_id).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sala não encontrada.",
        )
    return room


def _to_response(room: GameSession) -> SessionResponse:
    return SessionResponse(
        room_id=room.room_id,
        host=room.host_id,
        players=room.players_json,
        puzzle_id=room.puzzle_id,
        status=room.status,
    )

# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/create", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
def create_session(
    req: CreateSessionRequest,
    user: CurrentUser,
    db: DbSession,
) -> SessionResponse:
    room_id = str(uuid.uuid4())[:8].upper()
    room = GameSession(
        room_id=room_id,
        host_id=user.id,
        puzzle_id=req.puzzle_id,
        status="waiting",
        players_json=[user.id],
    )
    db.add(room)
    db.commit()
    db.refresh(room)
    return _to_response(room)


@router.post("/join", response_model=SessionResponse)
def join_session(
    req: JoinSessionRequest,
    user: CurrentUser,
    db: DbSession,
) -> SessionResponse:
    room = _get_room(req.room_id, db)

    if user.id not in room.players_json:
        # SQLAlchemy não detecta mutação em listas JSON automaticamente —
        # é preciso reatribuir para marcar o campo como dirty
        room.players_json = [*room.players_json, user.id]
        db.commit()
        db.refresh(room)

    return _to_response(room)


@router.get("/{room_id}", response_model=SessionResponse)
def get_session(room_id: str, db: DbSession) -> SessionResponse:
    return _to_response(_get_room(room_id, db))


@router.post("/leave", response_model=MessageResponse)
def leave_session(
    req: JoinSessionRequest,
    user: CurrentUser,
    db: DbSession,
) -> MessageResponse:
    room = _get_room(req.room_id, db)

    updated_players = [p for p in room.players_json if p != user.id]

    if not updated_players:
        db.delete(room)
    else:
        room.players_json = updated_players

    db.commit()
    return MessageResponse(message="Saiu da sala com sucesso.")