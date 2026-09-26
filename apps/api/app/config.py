"""
Orbit API — Application configuration.

Reads environment variables via Pydantic Settings. All required
variables are validated at import time. If any is missing or
malformed, the application refuses to start.

Source: System Architecture §89 (Configuration Architecture),
TRD §99 (Environment Configuration).
"""

from functools import lru_cache
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings, loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Environment
    environment: Literal["development", "production"] = "development"
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"

    # Database
    database_url: str = Field(
        ...,
        description="PostgreSQL connection string using the asyncpg driver.",
    )

    # Supabase
    supabase_url: str = Field(
        ...,
        description="Supabase project URL, e.g. https://xxx.supabase.co",
    )
    supabase_publishable_key: str = Field(
        ...,
        description="Supabase publishable key. Public. Reaches the frontend.",
    )
    supabase_secret_key: str = Field(
        ...,
        description="Supabase secret key. Backend-only. Never shipped to the frontend.",
    )

    # CORS
    cors_origins: str = Field(
        default="http://localhost:5173,http://127.0.0.1:5173",
        description="Comma-separated list of allowed CORS origins.",
    )

    @field_validator("database_url")
    @classmethod
    def validate_database_url(cls, value: str) -> str:
        """Ensure the URL uses the asyncpg driver."""
        if not value.startswith("postgresql+asyncpg://"):
            msg = (
                "DATABASE_URL must use the asyncpg driver "
                "(postgresql+asyncpg://...)."
            )
            raise ValueError(msg)
        return value

    @field_validator("supabase_url")
    @classmethod
    def validate_supabase_url(cls, value: str) -> str:
        """Ensure the URL looks like a Supabase project URL."""
        if not value.startswith("https://") or ".supabase.co" not in value:
            msg = (
                "SUPABASE_URL must look like https://xxx.supabase.co."
            )
            raise ValueError(msg)
        return value.rstrip("/")

    @property
    def cors_origin_list(self) -> list[str]:
        """Return CORS origins as a list, split on commas and trimmed."""
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def is_production(self) -> bool:
        """True when running in production."""
        return self.environment == "production"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """
    Return the settings singleton.

    Cached so the environment is read once per process. In tests,
    clear the cache with `get_settings.cache_clear()` to re-read
    the environment.
    """
    return Settings()  # type: ignore[call-arg]
