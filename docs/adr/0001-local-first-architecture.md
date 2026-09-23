# ADR-0001: Use Local-First Architecture

**Status:** Accepted
**Date:** 2026-09-23
**Deciders:** Owner

## Context

Orbit is a single-user application that must remain usable when the network is unavailable. Users expect immediate feedback on every interaction — dragging a task, completing it, editing it — without waiting for a server round-trip.

Two architectural models were considered:

1. **Server-first** — every action goes to the API, and the UI updates only after a response.
2. **Local-first** — every action updates local state immediately, then syncs to the server.

## Decision

Orbit uses a **local-first architecture**. All user actions update a local state store (Zustand) immediately. Persistence to IndexedDB and synchronization with the backend happen asynchronously.

The canonical source of truth remains the server. But the *immediate reality* the user experiences is the local state.

## Consequences

**Positive:**
- User interactions feel instantaneous regardless of network latency.
- The app works offline.
- Data is more resilient (three persistence layers: memory, IndexedDB, Postgres).

**Negative:**
- Conflict resolution becomes necessary.
- Two sources of truth must be reconciled (local and server).
- Every mutation must handle optimistic update and rollback.

**Mitigations:**
- Server-authoritative optimistic concurrency (ADR-0004).
- Idempotent mutations via `Idempotency-Key` header.
- Deterministic conflict resolution rules.

## Related Decisions

- ADR-0004: Server-Authoritative Conflict Resolution
- ADR-0005: Client-Generated UUIDs for Optimistic Creation
