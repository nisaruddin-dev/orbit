# ADR-0005: Client-Generated UUIDs for Optimistic Creation

**Status:** Accepted
**Date:** 2026-09-23
**Deciders:** Owner

## Context

In a local-first architecture (ADR-0001), a user can create a task while offline. The task must have a stable identity from the moment it appears in the UI — before the server has seen it.

Two approaches:

1. **Server-generated IDs** — the client waits for the server to assign an ID before rendering.
2. **Client-generated IDs** — the client generates a UUID, renders immediately, and reconciles with the server later.

## Decision

The client generates the task's UUID using `crypto.randomUUID()` or equivalent. The server accepts client-provided IDs and treats them as authoritative.

If a client-generated ID ever collides with an existing ID (extremely unlikely with UUID v4), the server rejects the mutation and the client retries with a new ID.

## Consequences

**Positive:**
- Tasks can be created offline.
- Immediate rendering — no waiting for server response.
- The same ID persists across local storage, server, and other devices.

**Negative:**
- The client can theoretically generate IDs that the server doesn't like (e.g., malformed).
- Migration between storage systems must preserve IDs.

**Mitigations:**
- Validation on server — malformed IDs rejected with clear error.
- UUID v4 collision probability is negligible (1 in 2^122).

## Related Decisions

- ADR-0001: Use Local-First Architecture
- ADR-0004: Server-Authoritative Conflict Resolution
