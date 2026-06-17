from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # App
    APP_NAME: str = "Quebrando a Cabeça — API"
    VERSION: str = "1.0.0"

    # CORS
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]

    # Banco de dados
    DATABASE_URL: str = "sqlite:///./quebra_cabeca.db"

    # JWT
    SECRET_KEY: str = "troque-em-producao"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

settings = Settings()