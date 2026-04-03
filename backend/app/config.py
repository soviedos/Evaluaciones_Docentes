from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    environment: str = "development"
    log_level: str = "info"
    secret_key: str = "change-this-in-production"
    allowed_origins: str = "http://localhost:3000"

    # Database
    database_url: str = "postgresql+asyncpg://eval_user:eval_pass_dev@localhost:5432/evaluaciones_docentes"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # MinIO
    minio_endpoint: str = "localhost:9000"
    minio_access_key: str = "minio_admin"
    minio_secret_key: str = "minio_pass_dev"
    minio_bucket: str = "evaluaciones"
    minio_secure: bool = False

    # Gemini
    gemini_api_key: str = ""

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
