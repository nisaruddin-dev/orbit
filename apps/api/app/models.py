"""
Orbit API — SQLAlchemy models.

The canonical schema for tasks and task events. Mirrors the
schema in the PRD §18, TRD §11, and System Architecture §10.

Every column is declared with an explicit type and constraint.
Nullable columns are explicit. Defaults are set in the database,
not in Python, so the migration carries them.
"""

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    SmallInteger,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    """Base class for all ORM models."""


class Task(Base):
    """
    A task. The canonical unit of work in Orbit.

    Soft-delete model: tasks are archived, not destroyed.
    """

    __tablename__ = "tasks"

    # Identity
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        nullable=False,
    )

    # Content
    title: Mapped[str] = mapped_column(Text, nullable=False)
    notes: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        server_default="",
    )

    # Classification
    ring: Mapped[str] = mapped_column(String(16), nullable=False)
    priority: Mapped[int] = mapped_column(
        SmallInteger,
        nullable=False,
        server_default="1",
    )

    # Lifecycle
    status: Mapped[str] = mapped_column(
        String(16),
        nullable=False,
        server_default="idle",
    )
    due_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    recurrence: Mapped[str | None] = mapped_column(
        String(16),
        nullable=True,
    )

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    archived_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # Spatial memory
    orbit_angle: Mapped[float | None] = mapped_column(nullable=True)
    orbit_radius: Mapped[float | None] = mapped_column(nullable=True)

    # Concurrency
    version: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
        server_default="1",
    )

    # Relationships
    events: Mapped[list["TaskEvent"]] = relationship(
        back_populates="task",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        CheckConstraint(
            "char_length(title) BETWEEN 1 AND 200",
            name="tasks_title_length",
        ),
        CheckConstraint(
            "ring IN ('today', 'week', 'someday')",
            name="tasks_ring_values",
        ),
        CheckConstraint(
            "priority BETWEEN 0 AND 3",
            name="tasks_priority_range",
        ),
        CheckConstraint(
            "status IN ('idle', 'in_progress', 'completed', 'archived')",
            name="tasks_status_values",
        ),
        CheckConstraint(
            "recurrence IS NULL OR recurrence IN ('daily', 'weekly', 'monthly')",
            name="tasks_recurrence_values",
        ),
        Index("tasks_user_status_idx", "user_id", "status"),
        Index("tasks_user_ring_idx", "user_id", "ring"),
        Index("tasks_user_due_idx", "user_id", "due_at"),
    )


class TaskEvent(Base):
    """
    An event record for synchronization and debugging.

    Events are not a hidden analytics system. They exist so that
    mutations are auditable, idempotent, and replayable.
    """

    __tablename__ = "task_events"

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
    )
    task_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tasks.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        nullable=False,
    )
    event_type: Mapped[str] = mapped_column(String(32), nullable=False)
    payload: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    # Relationships
    task: Mapped[Task] = relationship(back_populates="events")

    __table_args__ = (
        Index("task_events_user_created_idx", "user_id", "created_at"),
        Index("task_events_task_id_idx", "task_id"),
    )
