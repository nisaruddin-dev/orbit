# ADR-0006: Aurora Is a Projection, Not a Database

**Status:** Accepted
**Date:** 2026-09-23
**Deciders:** Owner

## Context

The Aurora is a visual component representing completed tasks as a ribbon of particles. A design question arose during drafting: should completed tasks be stored separately from active tasks, or should the Aurora derive its content from existing task data?

Options considered:

1. **Separate `aurora` table** — completed tasks copied on completion.
2. **Derived from `tasks`** — Aurora reads from `tasks` where `status = 'completed'`.

## Decision

The Aurora is **derived from the tasks table**, not stored separately.

Specifically: a task is projected into the Aurora if and only if:
- `status = 'completed'`
- `completed_at > now() - interval '7 days'`

The 7-day horizon is a **display filter**, not a data operation. No background job "moves" tasks to Aurora. No task is ever "in Aurora" as a state — it's a *view*.

For deeper history, the Archive view lists all tasks with `status = 'archived'`, regardless of age.

## Consequences

**Positive:**
- No duplicate data.
- No synchronization between two tables.
- Changing the Aurora window is a constant change, not a migration.

**Negative:**
- The Aurora window is a magic number (7 days) living in the experience layer.
- Aggregating "completions" for Aurora brightness requires a query.

**Mitigations:**
- The 7-day window is a documented constant, not scattered.
- Aurora brightness can be computed client-side from the task list — no server query needed.

## Related Decisions

- ADR-0003: Use Supabase for Auth, Realtime, and Postgres
