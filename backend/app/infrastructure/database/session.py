"""
Configuração de conexão com o banco de dados.

Usa SQLite local — adequado para execução em máquina única (dev/avaliação).
O arquivo do banco é criado automaticamente em `backend/app/quebra_cabeca.db`
na primeira execução.

Uso típico em um router/service:

    from infrastructure.database.session import get_db

    @router.get("/exemplo")
    def exemplo(db: Session = Depends(get_db)):
        ...
"""

from __future__ import annotations


from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

import os

# ---------------------------------------------------------------------------
# Configuração da engine
# ---------------------------------------------------------------------------

# Diretório onde este arquivo está
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Sobe dois níveis para chegar em /app (se necessário) ou use caminho relativo
# Melhor: usar caminho relativo a partir do diretório de trabalho
# Como o WORKDIR é /app, podemos usar "./data/quebra_cabeca.db"

# Para garantir, usamos um caminho absoluto baseado no diretório de trabalho
# Ou simplesmente:
DATABASE_URL = "sqlite:///./quebra_cabeca.db"

# `check_same_thread=False` é necessário apenas para SQLite, pois por padrão
# ele bloqueia uso da mesma conexão em threads diferentes — e o FastAPI/Uvicorn
# atende requisições em threads diferentes.
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False,  # mude para True temporariamente se quiser ver o SQL gerado
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# ---------------------------------------------------------------------------
# Base declarativa — todas as classes em models.py devem herdar desta Base
# ---------------------------------------------------------------------------

class Base(DeclarativeBase):
    pass


# ---------------------------------------------------------------------------
# Dependency do FastAPI — injeta uma sessão de banco por requisição
# ---------------------------------------------------------------------------

def get_db() -> Generator[Session, None, None]:
    """
    Fornece uma sessão de banco de dados por requisição (padrão FastAPI Depends).
    Garante que a sessão é sempre fechada, mesmo se a requisição falhar.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """
    Cria todas as tabelas definidas em models.py, caso ainda não existam.
    Chame isso uma vez na inicialização da aplicação (em main.py).
    """
    # Import local para evitar import circular entre session.py e models.py
    from infrastructure.database import models  # noqa: F401

    Base.metadata.create_all(bind=engine)