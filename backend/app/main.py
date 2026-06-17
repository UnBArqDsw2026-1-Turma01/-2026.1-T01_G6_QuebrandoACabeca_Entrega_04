"""
Ponto de entrada da aplicação FastAPI — Quebrando a Cabeça.

Responsabilidades deste módulo:
  - Instanciar o app FastAPI
  - Configurar o middleware de CORS (necessário para o frontend React em porta diferente)
  - Registrar os routers de cada domínio
  - Expor um endpoint de health-check

Execução:
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import auth_router, puzzle_router, score_router, session_router
from infrastructure.database.session import init_db
from core.config import settings  # ← configurações centralizadas


# ---------------------------------------------------------------------------
# Iniciar o Banco de dados
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Iniciando o banco de dados...")
    init_db()
    yield


# ---------------------------------------------------------------------------
# Instância principal
# ---------------------------------------------------------------------------

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend do jogo de quebra-cabeça digital.",
    version=settings.VERSION,
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS — permite que o frontend consuma a API
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers — cada domínio tem seu próprio arquivo em api/routers/
# ---------------------------------------------------------------------------

app.include_router(puzzle_router.router,  prefix="/puzzle",  tags=["Puzzle"])
app.include_router(auth_router.router,    prefix="/auth",    tags=["Autenticação"])
app.include_router(score_router.router,   prefix="/score",   tags=["Pontuação"])
app.include_router(session_router.router, prefix="/session", tags=["Sessão Multiplayer"])

# ---------------------------------------------------------------------------
# Health-check — útil para confirmar que o servidor está no ar
# ---------------------------------------------------------------------------

@app.get("/health", tags=["Sistema"])
def health_check() -> dict:
    return {"status": "ok", "service": "quebrando-a-cabeca-api"}


# ---------------------------------------------------------------------------
# Bloco __main__ — mantido apenas para testes rápidos de domínio via CLI.
# Para subir a API use `uvicorn main:app --reload` em vez de `python main.py`.
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import sys

    from patterns.builder.construtor_dificil import ConstrutorDificil
    from patterns.builder.construtor_facil import ConstrutorFacil
    from patterns.builder.construtor_medio import ConstrutorMedio
    from patterns.builder.director import Director
    from patterns.composite.composite import Composite
    from patterns.factory.factory import get_difficulty
    from domain.dtos import GetToyDifficultyPayload
    from patterns.strategy.efeito_grade_quadricular import EfeitoGradeQuadricular
    from patterns.strategy.efeito_jigsaw import EfeitoJigsaw
    from patterns.strategy.efeito_qb import EfeitoQB
    from patterns.strategy.grade_quadricular import GradeQuadricular

    BUILDERS = {
        "easy":   ConstrutorFacil,
        "medium": ConstrutorMedio,
        "hard":   ConstrutorDificil,
    }

    GRADES = {
        "easy":   5,
        "medium": 6,
        "hard":   8,
    }

    selected_difficulty = sys.argv[1] if len(sys.argv) > 1 else "easy"

    # --- Difficulty ---
    dto = GetToyDifficultyPayload(difficulty=selected_difficulty)
    result_difficulty = get_difficulty(dto)

    if not result_difficulty.success:
        for error in result_difficulty.error:
            print(f"Error: {error}")
        sys.exit(1)

    if not result_difficulty.data:
        print("Error: Difficulty data is missing.")
        sys.exit(1)

    difficulty = result_difficulty.data

    print(f"Dificuldade Selecionada: {difficulty.get_difficulty_level()}")
    print(f"Número de Peças: {difficulty.get_num_pieces()}")

    # --- Builder ---
    builder_class = BUILDERS.get(selected_difficulty, ConstrutorFacil)
    result_builder = Director().criar_quebra_cabeca(builder_class())
    if not result_builder.success:
        for error in result_builder.error:
            print(f"Error: {error}")
        sys.exit(1)

    if not result_builder.data:
        print("Error: Builder data is missing.")
        sys.exit(1)

    qc = result_builder.data
    print(f"Quebra-cabeça: {qc}")

    # --- Composite — encaixa as duas primeiras peças num grupo ---
    peca_1, peca_2 = qc.pecas[0], qc.pecas[1]
    peca_1.posicao_x, peca_1.posicao_y = peca_1.posicao_x_certa, peca_1.posicao_y_certa
    peca_2.posicao_x, peca_2.posicao_y = peca_2.posicao_x_certa, peca_2.posicao_y_certa

    grupo = Composite()
    grupo.adicionar(peca_1)
    grupo.adicionar(peca_2)
    print(f"Grupo encaixado: {grupo.verificar_colisao()}")

    # --- Strategy — imagem simulada com tamanho da grade da dificuldade ---
    tamanho = GRADES.get(selected_difficulty, 5)
    imagem_simulada = [
        [i * tamanho + j for j in range(tamanho)] for i in range(tamanho)
    ]

    efeito_qb = EfeitoQB()
    for estrategia in [EfeitoGradeQuadricular(), EfeitoJigsaw(), GradeQuadricular()]:
        efeito_qb.set_efeito(estrategia)
        resultado = efeito_qb.aplicar_efeito(imagem_simulada)
        print(
            f"Efeito aplicado: {efeito_qb.escolher_efeito()} → "
            f"{len(resultado)}x{len(resultado[0])} pixels"
        )