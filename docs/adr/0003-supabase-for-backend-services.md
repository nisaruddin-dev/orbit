# ADR-0003: Use Supabase for Auth, Realtime, and Postgres

**Status:** Accepted
**Date:** 2026-09-23
**Deciders:** Owner

## Context

Orbit needs three backend infrastructure services:

1. **PostgreSQL database** — durable persistence of tasks and events.
2. **Authentication** — proving the owner's identity.
3. **Realtime transport** — broadcasting row changes to other devices.

Options considered:

1. **Self-hosted** — run Postgres, an auth service, and a WebSocket server on a VPS.
2. **Supabase** — managed Postgres + Auth + Realtime in one service.
3. **Separate providers** — e.g., Neon for DB, Clerk for auth, Pusher for realtime.

## Decision

Use **Supabase** for all three services. Free tier. Region Singapore.

## Consequences

**Positive:**
- One account, one dashboard, one billing relationship (none, on free tier).
- Row-Level Security is built-in — critical for the security model.
- Realtime is integrated with Postgres row changes.
- Free tier is generous (500 MB DB, 50k MAU, 1 GB storage).

**Negative:**
- Single provider dependency for three critical services.
- Supabase-specific concepts (RLS, Realtime publications) are in the codebase.
- Free tier could change pricing.

**Mitigations:**
- Standard Postgres — can be exported and moved.
- Standard JWT auth — can be re-implemented with another provider.
- Realtime is replaceable with polling if it fails.

## Related Decisions

- ADR-0001: Use Local-First Architecture
