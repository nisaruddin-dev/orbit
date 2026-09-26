"""
End-to-end tests for the task routes.

Uses the overridden auth dependency from conftest.py to act as a
fixed test user. Every test runs against the real database.
"""

from uuid import UUID, uuid4

import httpx
import pytest

from tests.conftest import TEST_USER_ID


async def test_health(client: httpx.AsyncClient) -> None:
    """The health endpoint is public."""
    r = await client.get("/api/v1/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert body["database"] == "connected"


async def test_missing_token_returns_401(client: httpx.AsyncClient) -> None:
    """Requests without a token are rejected."""
    # Clear the override so the real dependency runs.
    from app.main import app

    app.dependency_overrides.clear()
    try:
        r = await client.get("/api/v1/tasks")
        assert r.status_code == 401
        assert r.json()["error"]["code"] == "MISSING_TOKEN"
    finally:
        # Restore for subsequent tests.
        from app.auth import get_current_user

        async def _fake() -> UUID:
            return TEST_USER_ID

        app.dependency_overrides[get_current_user] = _fake


async def test_full_task_lifecycle(client: httpx.AsyncClient) -> None:
    """Create, read, update, complete, restore, archive, unarchive."""
    # Create
    r = await client.post(
        "/api/v1/tasks",
        json={
            "title": "Lifecycle test",
            "ring": "today",
            "priority": 2,
            "orbit_angle": 0.0,
            "orbit_radius": 4.0,
        },
    )
    assert r.status_code == 201
    created = r.json()
    task_id = created["id"]
    assert created["title"] == "Lifecycle test"
    assert created["status"] == "idle"
    assert created["version"] == 1
    assert created["user_id"] == str(TEST_USER_ID)

    # Read
    r = await client.get(f"/api/v1/tasks/{task_id}")
    assert r.status_code == 200
    assert r.json()["title"] == "Lifecycle test"

    # List
    r = await client.get("/api/v1/tasks")
    assert r.status_code == 200
    ids = [t["id"] for t in r.json()["tasks"]]
    assert task_id in ids

    # Update
    r = await client.patch(
        f"/api/v1/tasks/{task_id}",
        json={"title": "Updated lifecycle"},
    )
    assert r.status_code == 200
    assert r.json()["title"] == "Updated lifecycle"
    assert r.json()["version"] == 2

    # Complete
    r = await client.post(f"/api/v1/tasks/{task_id}/complete")
    assert r.status_code == 200
    assert r.json()["status"] == "completed"
    assert r.json()["completed_at"] is not None

    # Restore
    r = await client.post(f"/api/v1/tasks/{task_id}/restore")
    assert r.status_code == 200
    assert r.json()["status"] == "idle"
    assert r.json()["completed_at"] is None

    # Archive
    r = await client.delete(f"/api/v1/tasks/{task_id}")
    assert r.status_code == 204

    # Confirm archived
    r = await client.get(f"/api/v1/tasks/{task_id}")
    assert r.status_code == 200
    assert r.json()["status"] == "archived"

    # Unarchive
    r = await client.post(f"/api/v1/tasks/{task_id}/unarchive")
    assert r.status_code == 200
    assert r.json()["status"] == "idle"


async def test_not_found(client: httpx.AsyncClient) -> None:
    """A random UUID returns 404 with the correct error code."""
    r = await client.get(f"/api/v1/tasks/{uuid4()}")
    assert r.status_code == 404
    assert r.json()["error"]["code"] == "TASK_NOT_FOUND"


async def test_invalid_create_payload(client: httpx.AsyncClient) -> None:
    """A payload with an invalid ring value is rejected."""
    r = await client.post(
        "/api/v1/tasks",
        json={"title": "Bad", "ring": "never", "priority": 1},
    )
    assert r.status_code == 422


async def test_task_events_written(client: httpx.AsyncClient) -> None:
    """
    Every mutation writes a row to task_events.

    Verified by querying the database directly with the service
    role, which bypasses RLS.
    """
    from app.db import engine
    from sqlalchemy import text

    r = await client.post(
        "/api/v1/tasks",
        json={"title": "Events test", "ring": "week", "priority": 1},
    )
    task_id = r.json()["id"]

    await client.patch(
        f"/api/v1/tasks/{task_id}",
        json={"title": "Events test updated"},
    )
    await client.post(f"/api/v1/tasks/{task_id}/complete")

    async with engine.connect() as conn:
        result = await conn.execute(
            text("SELECT event_type FROM task_events WHERE task_id = :tid ORDER BY created_at ASC"),
            {"tid": task_id},
        )
        events = [row[0] for row in result.fetchall()]

    assert events == ["created", "updated", "completed"]


@pytest.mark.parametrize(
    "ring",
    ["today", "week", "someday"],
)
async def test_all_rings_accepted(
    client: httpx.AsyncClient,
    ring: str,
) -> None:
    """All three ring values are valid."""
    r = await client.post(
        "/api/v1/tasks",
        json={"title": f"Ring {ring}", "ring": ring, "priority": 1},
    )
    assert r.status_code == 201
    assert r.json()["ring"] == ring
