"""
Router de Autenticação.

Endpoints:
    POST /auth/register   — cria nova conta
    POST /auth/login      — autentica e retorna token de sessão
    POST /auth/logout     — invalida o token
    GET  /auth/me         — retorna dados do usuário autenticado
    POST /auth/recover    — solicita recuperação de senha

Nota: usuários são persistidos no banco (tabela `users`, via SQLAlchemy).
      Tokens de sessão continuam em memória (`_SESSIONS`) — são efêmeros por
      natureza e não precisam sobreviver a um restart do servidor.

      A dependência `get_current_user` foi movida para core/dependencies.py.
      Este módulo expõe apenas `_SESSIONS` (fonte de verdade dos tokens ativos),
      que é acessado por dependencies.py via importação tardia.
"""

from __future__ import annotations

import hashlib
import uuid

from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from infrastructure.database.models import User, ScoreEntry, PuzzleState, UserLevelProgress
from infrastructure.database.session import get_db
from core.dependencies import CurrentUser, DbSession

router = APIRouter()

# ---------------------------------------------------------------------------
# Sessões de login — em memória (token → email)
# Acessado por core/dependencies.py para validar tokens.
# ---------------------------------------------------------------------------

_SESSIONS: dict[str, str] = {}

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, description="Nome completo do usuário")
    email: EmailStr
    password: str = Field(..., min_length=6, description="Senha (mínimo 6 caracteres)")


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    token: str
    user_id: str
    name: str
    email: str


class UserResponse(BaseModel):
    user_id: str
    name: str
    email: str


class RecoverRequest(BaseModel):
    email: EmailStr


class MessageResponse(BaseModel):
    message: str

# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Cadastrar usuário",
)
def register(req: RegisterRequest, db: DbSession) -> AuthResponse:
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="E-mail já cadastrado.",
        )

    user = User(
        id=str(uuid.uuid4()),
        name=req.name,
        email=req.email,
        password_hash=_hash_password(req.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = str(uuid.uuid4())
    _SESSIONS[token] = user.email

    return AuthResponse(token=token, user_id=user.id, name=user.name, email=user.email)


@router.post(
    "/login",
    response_model=AuthResponse,
    summary="Login",
)
def login(req: LoginRequest, db: DbSession) -> AuthResponse:
    user = db.query(User).filter(User.email == req.email).first()
    if not user or user.password_hash != _hash_password(req.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos.",
        )

    token = str(uuid.uuid4())
    _SESSIONS[token] = user.email

    return AuthResponse(
        token=token,
        user_id=user.id,
        name=user.name,
        email=user.email,
    )


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Logout",
)
def logout(authorization: str | None = Header(default=None)) -> MessageResponse:
    if authorization and authorization.startswith("Bearer "):
        token = authorization.removeprefix("Bearer ").strip()
        _SESSIONS.pop(token, None)
    return MessageResponse(message="Logout realizado com sucesso.")


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Usuário autenticado",
)
def get_me(user: CurrentUser) -> UserResponse:
    return UserResponse(user_id=user.id, name=user.name, email=user.email)


@router.post(
    "/recover",
    response_model=MessageResponse,
    summary="Recuperar senha",
)
def recover_password(req: RecoverRequest, db: DbSession) -> MessageResponse:
    # Em produção: gerar token com expiração e enviar por e-mail
    # Retorna a mesma mensagem em ambos os casos — evita enumeração de usuários
    return MessageResponse(
        message="Se este e-mail estiver cadastrado, você receberá as instruções em breve."
    )

@router.delete("/users/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_me(user: CurrentUser, db: DbSession):
    """
    Deleta a conta do usuário logado e todos os dados associados:
    scores, progresso nos níveis, puzzles e o próprio usuário.
    """
    # Deletar scores
    db.query(ScoreEntry).filter(ScoreEntry.user_id == user.id).delete()
    # Deletar progresso dos níveis
    db.query(UserLevelProgress).filter(UserLevelProgress.user_id == user.id).delete()
    # Deletar puzzles
    db.query(PuzzleState).filter(PuzzleState.owner_id == user.id).delete()
    # Deletar o usuário
    db.delete(user)
    db.commit()
    return None