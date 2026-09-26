"""rls policies

Revision ID: fbe6ce664825
Revises: 86cf5526eb74
Create Date: 2026-09-26

"""

from collections.abc import Sequence

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "fbe6ce664825"
down_revision: str | Sequence[str] | None = "86cf5526eb74"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """
    Enable row-level security on tasks and task_events, and add
    policies that allow a user to read and modify only their own
    rows.

    The backend uses the Supabase service role, which bypasses
    RLS. The frontend, when it talks to Supabase directly for
    realtime subscriptions, uses the anon key, which respects
    these policies.

    Source: System Architecture §60-62, TRD §10, PRD NFR-302.
    """
    op.execute("ALTER TABLE tasks ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE task_events ENABLE ROW LEVEL SECURITY")

    op.execute(
        """
        CREATE POLICY tasks_select_own ON tasks
          FOR SELECT
          USING (auth.uid() = user_id)
        """
    )

    op.execute(
        """
        CREATE POLICY tasks_modify_own ON tasks
          FOR ALL
          USING (auth.uid() = user_id)
          WITH CHECK (auth.uid() = user_id)
        """
    )

    op.execute(
        """
        CREATE POLICY task_events_select_own ON task_events
          FOR SELECT
          USING (auth.uid() = user_id)
        """
    )

    op.execute(
        """
        CREATE POLICY task_events_insert_own ON task_events
          FOR INSERT
          WITH CHECK (auth.uid() = user_id)
        """
    )


def downgrade() -> None:
    """Drop the policies and disable RLS."""
    op.execute("DROP POLICY IF EXISTS task_events_insert_own ON task_events")
    op.execute("DROP POLICY IF EXISTS task_events_select_own ON task_events")
    op.execute("DROP POLICY IF EXISTS tasks_modify_own ON tasks")
    op.execute("DROP POLICY IF EXISTS tasks_select_own ON tasks")

    op.execute("ALTER TABLE task_events DISABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE tasks DISABLE ROW LEVEL SECURITY")
