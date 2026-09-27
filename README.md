# Orbit

> A personal, single-user, immersive 3D to-do environment.

**Status:** Paused — last worked on September 27, 2026. Runs locally. Not deployed. Not currently in daily use.

---

## What Orbit Is

Orbit is an attempt to answer a single question: *what if a to-do list was a place you could enter?*

Tasks live as physical objects in a persistent 3D world. They orbit a glowing Core in three concentric rings — Today, This Week, Someday. Completing a task is not a checkbox; it is a physical act of grabbing the task and dragging it into a completion zone, where it dissolves into particles and leaves a quiet trace in an outer aurora.

The design is driven by three feelings — **Arrival**, **Control**, and **Release** — and three laws — **Physicality**, **Chain**, and **Calm**. No red. No badges. No streaks. No guilt mechanics. The app is intended to feel more like a place than a tool.

---

## Current State

The working application includes:

- A full 3D world with atmospheric twilight lighting, fog, and a reflective floor
- A pulsing Core with three orbital rings at distinct radii
- Task nodes with four-layer anatomy (core sphere, wireframe shell, orbital ring, SDF label)
- A four-light rig with ACES Filmic tone mapping
- Post-processing: bloom, vignette, film grain
- A camera state machine with four states (Orbit, Focus, Timeline, Aurora) and Catmull-Rom spline transitions
- Interaction driven by a unified `InteractionIntent` abstraction
- Full drag-and-drop with a physics-based completion zone
- A six-phase completion choreography with particle dissolve and settle toast
- In-world editing with autosave (title, notes, priority, ring, due date, recurrence)
- A 5-second undo ghost after completion
- FastAPI backend with Supabase Postgres, JWT auth, and Row-Level Security
- Local-first sync with optimistic mutations, IndexedDB cache, and an offline mutation queue
- A semantic HTML mirror for screen readers
- A WebGL fallback that renders the semantic mirror when 3D is unavailable
- Error boundaries at the app, scene, and UI levels
- Reduced-motion variants for all animations

The application runs locally. It signs in with a real Supabase account, reads and writes to a real PostgreSQL database in Singapore, persists across reloads, and works offline.

It is not deployed. It is not in daily use. It is currently paused.

---

## Why It Is Paused

Orbit was built over five days as a personal project. It reached the point where every core feature was implemented and working. The remaining work — settings, audio, mobile optimization, and polish — is refinement, not core functionality.

The project was paused after the working version was complete. It was not abandoned because it failed. It was paused because it was finished enough to stop, and because the remaining work is refinement that can happen later, if at all.

See [`POST-MORTEM.md`](./POST-MORTEM.md) for the full retrospective.

---

## Reusable Patterns

Several pieces of Orbit are genuinely reusable:

| Pattern | Location | What It Does |
|---|---|---|
| **Intent abstraction** | `apps/web/src/input/intents.ts`, `useIntent.ts` | Unifies mouse, touch, and keyboard into a single stream of semantic intents. Components never read raw events. |
| **Choreography engine** | `apps/web/src/choreography/` | Declarative animation timelines with keyframed tracks, easing, and lifecycle. Replaces scattered `setTimeout` chains. |
| **Catmull-Rom spline** | `apps/web/src/lib/spline.ts` | Camera path interpolation that arcs through 3D space instead of sliding in a straight line. |
| **Semantic mirror** | `apps/web/src/a11y/SemanticMirror.tsx` | HTML representation of a 3D scene for screen readers. The 3D canvas is `aria-hidden`; every task is mirrored as a real DOM element. |
| **Offline mutation queue** | `apps/web/src/data/offlineQueue.ts` | IndexedDB-backed queue that stores mutations while offline and flushes them on reconnect. |

These patterns are worth reading if you are building similar systems.

---

## Architecture

The full architecture is documented in five specification documents in `docs/`:

- [`docs/PRD.md`](./docs/PRD.md) — Product Requirements (vision, scope, anti-principles)
- [`docs/TRD.md`](./docs/TRD.md) — Technical Requirements (stack, NFRs, milestones)
- [`docs/UI-UX.md`](./docs/UI-UX.md) — Design System (palette, lighting, motion, twenty design laws)
- [`docs/SYSTEM-ARCHITECTURE.md`](./docs/SYSTEM-ARCHITECTURE.md) — Blueprint (three planes, ownership, data flow)
- [`docs/CHOREOGRAPHY.md`](./docs/CHOREOGRAPHY.md) — Animation timelines (placeholder only)
- [`docs/adr/`](./docs/adr/) — Architectural Decision Records (0001–0006)

The documents are longer than the code. That is one of the project's lessons.

---

## Tech Stack

**Frontend:**
- React 19.3 + TypeScript 6.0
- Vite 8.3
- Three.js 0.186 + React Three Fiber 9.7 + Drei 10.7
- @react-three/postprocessing 3.1
- Troika (SDF text)
- Zustand 5.0 (state)
- TanStack Query 5 (server state)
- IndexedDB via `idb`
- Supabase JS client

**Backend:**
- FastAPI
- Python 3.12
- Pydantic v2 + pydantic-settings
- SQLAlchemy 2.0 (async)
- Alembic (migrations)
- asyncpg
- Supabase (Auth, Postgres, RLS)

**Tooling:**
- pnpm 12 (frontend package manager)
- uv 0.12 (Python package manager)
- ESLint 10 + Prettier 3.9
- Ruff + mypy (strict)
- GitHub Actions CI

---

## Running Locally

Orbit runs locally in WSL (Ubuntu) on Windows.

**Prerequisites:**
- WSL2 with Ubuntu 22.04+
- Node 20+ (via nvm)
- pnpm 12+
- Python 3.12+ (via uv)
- A Supabase project (see `docs/` for schema)

**Backend:**

```bash
cd apps/api
cp .env.example .env
# Edit .env with your Supabase credentials
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
Frontend (in a second terminal):

bash
cd apps/web
cp .env.example .env
# Edit .env with your Supabase URL and publishable key
pnpm install
pnpm dev
Open http://localhost:5173. Sign in with the email configured in your Supabase project. Press N to create a task. Press O, F, T, A to switch camera states. Press Escape to deselect.

Keyboard Reference
Key	Action
N	Create new task
O	Orbit camera (overview)
F	Focus camera (on selected node)
T	Timeline camera
A	Aurora camera (completed history)
J / K	Next / previous task
Enter	Focus selected task
Space	Complete selected task (planned)
Escape	Deselect / exit focus
M	Mute (not implemented)
Known Issues
See KNOWN-ISSUES.md.

What Is Not Built
The following were planned but are not implemented, and are out of scope for now:

Settings screen

Sound design (ambient bed, interaction tones, completion chime)

Mobile optimization

Code splitting for bundle size

Full LOD system

Archive browser

UI-level unarchive

Deployment

License
MIT. See LICENSE.

The code is provided as-is. It is a learning project, not audited for production use. Known issues are documented in KNOWN-ISSUES.md.

Final Note
Orbit is not a great to-do app. It is a complete full-stack application that demonstrates a range of engineering patterns — intent abstraction, choreography engines, offline-first sync, semantic accessibility for a 3D scene — that most personal projects never touch.

The code quality reflects the seriousness of the effort. The five specification documents, the six ADRs, the accessibility layer, and the tests are the parts worth looking at. The app is not the artifact. The rigor is.

— Nisar Uddin, September 2026
