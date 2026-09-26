"""
Orbit API — Pydantic schemas.

The wire format for the API. Separate from the SQLAlchemy models
because the API sends and receives a different shape than what the
database stores.

For example:
  - The client does not send `id`, `user_id`, `version`, or any
    of the timestamp columns when creating a task. The server
    fills those in.
  - The client receives all of those when reading a task.

TaskCreate  — the request body for POST /tasks
TaskUpdate  — the request body for PATCH /tasks/{id}
TaskRead    — the response body for a single task
TaskList    — the response body for GET /tasks
ErrorDetail — the inner object of the error envelope
ErrorResponse — the outer envelope for all errors

The error envelope matches TRD §28:

    {"error": {"code": "...", "message": "...", "request_id": "..."}}

Source: TRD §11 (Database Model), TRD §28 (API Response Model),
System Architecture §10 (Task Entity).
"""

from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

# Type aliases matching the database constraints.
TaskRing = Literal["today", "week", "someday"]
TaskPriority = Literal[0, 1, 2, 3]
TaskStatus = Literal["idle", "in_progress", "completed", "archived"]
TaskRecurrence = Literal["daily", "weekly", "monthly"]


class TaskCreate(BaseModel):
    """
    Request body for POST /tasks.

    Only the fields the client controls. The server sets id,
    user_id, status (defaults to 'idle'), version (defaults to 1),
    and all timestamps.
    """

    title: str = Field(min_length=1, max_length=200)
    notes: str = ""
    ring: TaskRing
    priority: TaskPriority = 1
    due_at: datetime | None = None
    recurrence: TaskRecurrence | None = None
    orbit_angle: float | None = None
    orbit_radius: float | None = None


class TaskUpdate(BaseModel):
    """
    Request body for PATCH /tasks/{id}.

    Every field is optional. Only provided fields are updated.
    Missing fields are left unchanged.
    """

    title: str | None = Field(default=None, min_length=1, max_length=200)
    notes: str | None = None
    ring: TaskRing | None = None
    priority: TaskPriority | None = None
    status: TaskStatus | None = None
    due_at: datetime | None = None
    recurrence: TaskRecurrence | None = None
    orbit_angle: float | None = None
    orbit_radius: float | None = None


class TaskRead(BaseModel):
    """
    Response body for a single task.

    Built directly from a SQLAlchemy Task instance. `from_attributes`
    lets Pydantic read attributes off the ORM object.
    """

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    title: str
    notes: str
    ring: TaskRing
    priority: TaskPriority
    status: TaskStatus
    due_at: datetime | None
    recurrence: TaskRecurrence | None
    created_at: datetime
    updated_at: datetime
    completed_at: datetime | None
    archived_at: datetime | None
    orbit_angle: float | None
    orbit_radius: float | None
    version: int


class TaskList(BaseModel):
    """Response body for GET /tasks."""

    tasks: list[TaskRead]


class ErrorDetail(BaseModel):
    """The inner object of the error envelope."""

    code: str = Field(
        description="Machine-readable error code, e.g. TASK_NOT_FOUND.",
    )
    message: str = Field(
        description="Human-readable error message. Safe to display.",
    )
    request_id: str | None = Field(
        default=None,
        description="Request ID for correlating with server logs.",
    )


class ErrorResponse(BaseModel):
    """
    The outer envelope for all error responses.

    Matches TRD §28.
    """

    error: ErrorDetail
