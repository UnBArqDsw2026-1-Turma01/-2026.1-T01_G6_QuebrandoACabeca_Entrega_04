"""
Dependências globais da aplicação — injetadas via FastAPI Depends().

Expõe:
    DbSession       — tipo anotado para sessão do banco (uso: `db: DbSession`)
    CurrentUser     — tipo anotado para usuário autenticado (uso: `user: CurrentUser`)
    OptionalUser    — tipo anotado para usuário opcional (puzzle sem login)

Antes estava espalhado em auth_router.py e importado pelos outros routers.
Centralizar aqui evita importações circulares e acopla menos os routers.
"""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from infrastructure.database.session import get_db
from infrastructure.database.models import User

# ---------------------------------------------------------------------------
# Sessão do banco
# ---------------------------------------------------------------------------

DbSession = Annotated[Session, Depends(get_db)]

# ---------------------------------------------------------------------------
# Helpers de autenticação
# ---------------------------------------------------------------------------

# Importado aqui para não gerar dependência circular:
# auth_router → dependencies → auth_router (evitado mantendo _SESSIONS aqui fora)
# A fonte de verdade das sessões ativas continua em auth_router._SESSIONS,
# mas o acesso a ela é feito via função importada abaixo.

def _resolve_user(
    authorization: str | None,
    db: Session,
    *,
    required: bool,
) -> User | None:
    """
    Lógica central de resolução de usuário a partir do header Authorization.

    Args:
        authorization: valor bruto do header (ex: "Bearer abc123")
        db: sessão do banco
        required: se True, lança 401 em caso de falha; se False, retorna None
    """
    # Importação local para evitar circular import:
    # auth_router precisa de get_db (infrastructure), não de dependencies.
    # dependencies precisa de _SESSIONS (auth_router) → importação tardia.
    from api.routers.auth_router import _SESSIONS  # noqa: PLC0415

    if not authorization or not authorization.startswith("Bearer "):
        if required:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token de autenticação ausente ou inválido.",
            )
        return None

    token = authorization.removeprefix("Bearer ").strip()
    email = _SESSIONS.get(token)

    if not email:
        if required:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Sessão expirada ou inválida. Faça login novamente.",
            )
        return None

    user = db.query(User).filter(User.email == email).first()
    if not user:
        if required:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Sessão expirada ou inválida. Faça login novamente.",
            )
        return None

    return user


# ---------------------------------------------------------------------------
# Dependências prontas para Depends()
# ---------------------------------------------------------------------------

def get_current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> User:
    """Exige usuário autenticado. Lança 401 se ausente ou inválido."""
    return _resolve_user(authorization, db, required=True)  # type: ignore[return-value]


def get_optional_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> User | None:
    """Aceita requisição sem token — retorna None se não autenticado."""
    return _resolve_user(authorization, db, required=False)


# ---------------------------------------------------------------------------
# Tipos anotados — use estes nos parâmetros dos endpoints
# ---------------------------------------------------------------------------

CurrentUser  = Annotated[User,        Depends(get_current_user)]
OptionalUser = Annotated[User | None, Depends(get_optional_user)]