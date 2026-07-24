import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")
    PROJECT_NAME: str = "KAVACH AI Backend"
    API_V1_STR: str = "/api/v1"
    JWT_SECRET: str = os.getenv("JWT_SECRET", "supersecretkey_karnataka_police_2026_change_me")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days for ease of session operations
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "sqlite+aiosqlite:///c:/Users/user/OneDrive/Desktop/Competition/DataThon/backend/kavach_demo.db"
    )
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    NEO4J_URI: str = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    NEO4J_USER: str = os.getenv("NEO4J_USER", "neo4j")
    NEO4J_PASSWORD: str = os.getenv("NEO4J_PASSWORD", "KspSecureGraph2026")
    CHROMA_HOST: str = os.getenv("CHROMA_HOST", "localhost")
    CHROMA_PORT: int = int(os.getenv("CHROMA_PORT", "8000"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    def __init__(self, **values):
        super().__init__(**values)
        if self.ENVIRONMENT == "production" and "change_me" in self.JWT_SECRET:
            raise ValueError("CRITICAL SECURITY VIOLATION: Default JWT secret token keys cannot be used in production mode!")

settings = Settings()
