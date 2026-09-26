"""
Orbit API — Database engine and session factory.

Uses SQLAlchemy 2.0 async with the asyncpg driver. One engine
per process. A session factory that produces async sessions
scoped per request.

Source: TRD §7 (Backend Technology Stack),
System Architecture §4.2 (Logic Plane).
"""

from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.config import get_settings

_settings = get_settings()

# The async engine. One per process.
# echo=False in all environments; set to True temporarily when
# debugging SQL queries.
engine: AsyncEngine = create_async_engine(
    _settings.database_url,
    echo=False,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=5,
    future=True,
)

# The session factory. Produces AsyncSession instances.
# expire_on_commit=False keeps objects usable after commit, which
# is what FastAPI route handlers expect.
async_session_factory: async_sessionmaker[AsyncSession] = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_session() -> AsyncIterator[AsyncSession]:
    """
    FastAPI dependency that yields an async session.

    The session is closed automatically when the request finishes,
    whether the request succeeded or raised. Use as:

        @app.get("/path")
        async def handler(session: AsyncSession = Depends(get_session)):
            ...
    """
    async with async_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()
