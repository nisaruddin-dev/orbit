# Orbit Documentation Set

The complete specification for Orbit is divided into five documents,
each with a distinct role.

## Source of Truth Hierarchy

1. **PRD.md** — What Orbit is and why it exists
2. **SYSTEM-ARCHITECTURE.md** — How all systems connect
3. **TRD.md** — How each piece is technically built
4. **UI-UX.md** — How it looks, feels, and behaves
5. **CHOREOGRAPHY.md** — When each animation and sound occurs

When documents disagree, the higher document wins.

## Document Purposes

| File | Purpose |
|---|---|
| `PRD.md` | Product vision, scope, and requirements |
| `SYSTEM-ARCHITECTURE.md` | System blueprint, state ownership, contracts |
| `TRD.md` | Technical stack, implementation constraints |
| `UI-UX.md` | Visual language, interactions, accessibility |
| `CHOREOGRAPHY.md` | Timelines, keyframes, sound synchronization |

## Reading Order

For a new contributor (or future-you):

1. Read `PRD.md` first to understand the vision.
2. Read `SYSTEM-ARCHITECTURE.md` second to understand the shape.
3. Read `TRD.md` third if you're going to write code.
4. Read `UI-UX.md` fourth if you're going to touch the interface.
5. Read `CHOREOGRAPHY.md` last — it's the fine grain.

## Change Discipline

When code and docs disagree, the code is wrong (or the docs are being intentionally updated in the same change). Never let them drift silently.
