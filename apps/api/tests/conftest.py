"""
Pytest fixtures for Orbit API tests.

Provides:
  - an async HTTP client against the FastAPI app
  - a fixture that overrides the auth dependency to return a
    fixed test user ID
  - a fixture that cleans up test rows after each test

The auth override lets us test the positive path (200 responses,
correct payloads) without needing a real Supabase JWT. That token
does not exist locally.
"""

from collections.abc import AsyncIterator, Iterator
from uuid import UUID

import httpx
import pytest
from app.auth import get_current_user
from app.db import engine
from app.main import app
from sqlalchemy import text

# A fixed test user. Different from the placeholder used in 8a-6.
TEST_USER_ID = UUID("11111111-1111-1111-1111-111111111111")


@pytest.fixture(autouse=True)
def _override_auth() -> Iterator[None]:
    """
    Override the auth dependency for every test in this suite.

    The override returns a fixed UUID. Tests that want to verify
    the 401 path must explicitly opt out by clearing overrides
    inside the test.
    """

    async def _fake_user() -> UUID:
        return TEST_USER_ID

    app.dependency_overrides[get_current_user] = _fake_user
    yield
    app.dependency_overrides.clear()


@pytest.fixture(autouse=True)
async def _cleanup_test_rows() -> AsyncIterator[None]:
    """
    Delete all rows owned by TEST_USER_ID before and after each test.

    Async so it shares the pytest-asyncio event loop with the
    tests themselves. Using asyncio.run() here would create a
    separate loop and break the SQLAlchemy engine's connection
    pool.
    """

    async def _cleanup() -> None:
        async with engine.begin() as conn:
            await conn.execute(
                text("DELETE FROM tasks WHERE user_id = :uid"),
                {"uid": str(TEST_USER_ID)},
            )

    await _cleanup()
    yield
    await _cleanup()


@pytest.fixture(scope="session")
async def client() -> AsyncIterator[httpx.AsyncClient]:
    """An HTTP client wired to the FastAPI app."""
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as c:
        yield c
