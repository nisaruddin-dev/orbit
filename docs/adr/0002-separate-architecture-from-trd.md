# ADR-0002: Separate System Architecture from TRD

**Status:** Accepted
**Date:** 2026-09-23
**Deciders:** Owner

## Context

A typical project has a PRD ("what") and a TRD ("how"). During drafting, it became clear that the "how" had two distinct concerns that were being conflated:

1. **How each piece is built** — libraries, versions, patterns.
2. **How the pieces fit together** — boundaries, contracts, ownership.

Mixing these into a single TRD made both harder to navigate and created contradictions when subsystem boundaries changed but individual implementations did not.

## Decision

Split the technical documentation into two documents:

- **TRD.md** — implementation constraints, stack choices, version pins.
- **SYSTEM-ARCHITECTURE.md** — system boundaries, ownership, contracts, data flow.

The System Architecture document sits **between** the PRD and the TRD in the source-of-truth hierarchy.

## Consequences

**Positive:**
- Boundaries and implementation are documented separately.
- The System Architecture document can reference the PRD for intent and the TRD for details.
- Changes to one rarely require changes to the other.

**Negative:**
- Two documents must be kept consistent.
- New contributors (or future-you) must read both.

**Mitigations:**
- Clear hierarchy: PRD > System Architecture > TRD > UI/UX > Choreography > Implementation.
- Explicit cross-references between documents.

## Related Decisions

- ADR-0001: Use Local-First Architecture
- ADR-0003: Use Supabase for Auth, Realtime, and Postgres
