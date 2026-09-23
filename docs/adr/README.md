# Orbit — Architectural Decision Records

Each ADR records a significant architectural decision, its context, the decision itself, and its consequences.

## Format

- Filename: `NNNN-short-title.md`
- Numbered sequentially
- Status: Proposed / Accepted / Deprecated / Superseded by ADR-XXXX

## Index

| # | Title | Status | Date |
|---|---|---|---|
| [0001](./0001-local-first-architecture.md) | Use Local-First Architecture | Accepted | 2026-09-23 |
| [0002](./0002-separate-architecture-from-trd.md) | Separate System Architecture from TRD | Accepted | 2026-09-23 |
| [0003](./0003-supabase-for-backend-services.md) | Use Supabase for Auth, Realtime, and Postgres | Accepted | 2026-09-23 |
| [0004](./0004-server-authoritative-conflict-resolution.md) | Server-Authoritative Conflict Resolution | Accepted | 2026-09-23 |
| [0005](./0005-client-generated-uuids.md) | Client-Generated UUIDs for Optimistic Creation | Accepted | 2026-09-23 |
| [0006](./0006-aurora-is-a-projection.md) | Aurora Is a Projection, Not a Database | Accepted | 2026-09-23 |

## When to write a new ADR

Write an ADR when:

- A decision is architectural (affects system boundaries, ownership, or contracts).
- A decision is not obvious from the code.
- A decision might be re-litigated in the future.
- A decision involves trade-offs the team (you) should remember.

## When NOT to write an ADR

Don't write an ADR for:

- Routine implementation details.
- Trivial choices (variable naming, folder layout).
- Temporary decisions that will be reverted.
