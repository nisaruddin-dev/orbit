"""
Orbit API — Task routes.

CRUD, complete, restore, archive, unarchive. Every mutation writes
an event row for synchronization and audit.

Every route requires an authenticated user via the `get_current_user`
dependency. Tasks are scoped to that user.

Source: PRD §20 (API Model), TRD §26 (API Design),
System Architecture §78 (API Contract).
"""

from datetime import UTC, datetime
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.db import get_session
from app.models import Task, TaskEvent
from app.schemas import TaskCreate, TaskList, TaskRead, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])

SessionDep = Annotated[AsyncSession, Depends(get_session)]
UserDep = Annotated[UUID, Depends(get_current_user)]


async def _get_owned_task(
    session: AsyncSession,
    task_id: UUID,
    user_id: UUID,
) -> Task:
    """Fetch a task by ID, scoped to the user. Raises 404 if missing."""
    result = await session.execute(
        select(Task).where(Task.id == task_id, Task.user_id == user_id),
    )
    task = result.scalar_one_or_none()
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "code": "TASK_NOT_FOUND",
                "message": f"Task {task_id} not found.",
            },
        )
    return task


def _log_event(
    session: AsyncSession,
    task: Task,
    event_type: str,
    payload: dict[str, object],
) -> None:
    """Append a TaskEvent to the session. Does not commit."""
    session.add(
        TaskEvent(
            task_id=task.id,
            user_id=task.user_id,
            event_type=event_type,
            payload=payload,
        ),
    )


@router.get("", response_model=TaskList)
async def list_tasks(session: SessionDep, user_id: UserDep) -> TaskList:
    """
    List all tasks for the authenticated user.

    Returns archived and completed tasks too — the frontend
    filters by status.
    """
    result = await session.execute(
        select(Task).where(Task.user_id == user_id).order_by(Task.created_at.asc()),
    )
    tasks = result.scalars().all()
    return TaskList(tasks=[TaskRead.model_validate(t) for t in tasks])


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    payload: TaskCreate,
    session: SessionDep,
    user_id: UserDep,
) -> TaskRead:
    """Create a new task."""
    task = Task(
        user_id=user_id,
        title=payload.title,
        notes=payload.notes,
        ring=payload.ring,
        priority=payload.priority,
        status="idle",
        due_at=payload.due_at,
        recurrence=payload.recurrence,
        orbit_angle=payload.orbit_angle,
        orbit_radius=payload.orbit_radius,
    )
    session.add(task)
    await session.flush()

    _log_event(session, task, "created", {"title": task.title})
    await session.commit()
    await session.refresh(task)

    return TaskRead.model_validate(task)


@router.get("/{task_id}", response_model=TaskRead)
async def read_task(
    task_id: UUID,
    session: SessionDep,
    user_id: UserDep,
) -> TaskRead:
    """Read a single task by ID."""
    task = await _get_owned_task(session, task_id, user_id)
    return TaskRead.model_validate(task)


@router.patch("/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: UUID,
    payload: TaskUpdate,
    session: SessionDep,
    user_id: UserDep,
) -> TaskRead:
    """
    Update fields on a task.

    Only provided fields are changed. Every update increments
    `version` for optimistic concurrency.
    """
    task = await _get_owned_task(session, task_id, user_id)

    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(task, field, value)

    task.version += 1
    task.updated_at = datetime.now(UTC)

    _log_event(session, task, "updated", {"fields": list(updates.keys())})
    await session.commit()
    await session.refresh(task)

    return TaskRead.model_validate(task)


@router.post("/{task_id}/complete", response_model=TaskRead)
async def complete_task(
    task_id: UUID,
    session: SessionDep,
    user_id: UserDep,
) -> TaskRead:
    """
    Mark a task as completed. Idempotent.
    """
    task = await _get_owned_task(session, task_id, user_id)

    if task.status != "completed":
        task.status = "completed"
        task.completed_at = datetime.now(UTC)
        task.version += 1
        task.updated_at = datetime.now(UTC)
        _log_event(session, task, "completed", {})
        await session.commit()
        await session.refresh(task)

    return TaskRead.model_validate(task)


@router.post("/{task_id}/restore", response_model=TaskRead)
async def restore_task(
    task_id: UUID,
    session: SessionDep,
    user_id: UserDep,
) -> TaskRead:
    """
    Restore a task from completed or archived back to idle. Idempotent.
    """
    task = await _get_owned_task(session, task_id, user_id)

    if task.status != "idle":
        task.status = "idle"
        task.completed_at = None
        task.archived_at = None
        task.version += 1
        task.updated_at = datetime.now(UTC)
        _log_event(session, task, "restored", {})
        await session.commit()
        await session.refresh(task)

    return TaskRead.model_validate(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def archive_task(
    task_id: UUID,
    session: SessionDep,
    user_id: UserDep,
) -> None:
    """
    Soft-delete a task by archiving it.
    """
    task = await _get_owned_task(session, task_id, user_id)

    if task.status != "archived":
        task.status = "archived"
        task.archived_at = datetime.now(UTC)
        task.version += 1
        task.updated_at = datetime.now(UTC)
        _log_event(session, task, "archived", {})
        await session.commit()


@router.post("/{task_id}/unarchive", response_model=TaskRead)
async def unarchive_task(
    task_id: UUID,
    session: SessionDep,
    user_id: UserDep,
) -> TaskRead:
    """
    Restore an archived task to idle.
    """
    task = await _get_owned_task(session, task_id, user_id)

    if task.status != "idle":
        task.status = "idle"
        task.archived_at = None
        task.version += 1
        task.updated_at = datetime.now(UTC)
        _log_event(session, task, "unarchived", {})
        await session.commit()
        await session.refresh(task)

    return TaskRead.model_validate(task)
