# ADR-0004: Server-Authoritative Conflict Resolution

**Status:** Accepted
**Date:** 2026-09-23
**Deciders:** Owner

## Context

Because Orbit is local-first (ADR-0001) and multi-device, two devices can edit the same task simultaneously. The system must resolve conflicts deterministically.

Options considered:

1. **Last-write-wins by client timestamp** — simple, but vulnerable to clock skew.
2. **Last-write-wins by server timestamp** — better, but conflates field edits with lifecycle transitions.
3. **Server-authoritative optimistic concurrency** — client sends version, server rejects stale writes.
4. **CRDTs** — technically elegant, but overkill for single-user.

## Decision

Use **server-authoritative optimistic concurrency**.

Every task carries a `version` integer maintained by the server. Every mutation includes an `If-Match: <version>` header.

- If the client's version matches the server's current version: apply, increment version, return 200.
- If the client's version is stale: return `409 Conflict` with the current task.

On `409`, the client discards its local mutation, refetches the task, and re-evaluates whether to re-apply.

**Lifecycle transitions receive higher semantic priority than field edits.** A client cannot silently revert `completed → idle` by editing the title on a stale version.

## Consequences

**Positive:**
- Deterministic — same inputs always produce same result.
- No clock-skew dependency.
- Field edits and lifecycle transitions can be handled differently.

**Negative:**
- Every mutation must carry a version.
- The client must handle `409` responses.
- Slightly more complex than last-write-wins.

**Mitigations:**
- Idempotency keys prevent duplicate mutations.
- Realtime invalidation means conflicts are rare in practice.

## Related Decisions

- ADR-0001: Use Local-First Architecture
- ADR-0005: Client-Generated UUIDs for Optimistic Creation
