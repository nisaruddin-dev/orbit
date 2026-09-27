# Orbit

> A personal, single-user, immersive 3D to-do environment.

**Status:** Archived — completed September 2026. Preserved as a learning artifact and a library of reusable patterns. Not actively maintained. Not recommended for daily use.

---

## What Orbit Was

Orbit was an attempt to answer a single question: *what if a to-do list was a place you could enter?*

Tasks lived as physical objects in a persistent 3D world. They orbited a glowing Core in three concentric rings — Today, This Week, Someday. Completing a task was not a checkbox; it was a physical act of grabbing the task and dragging it into a completion zone, where it dissolved into particles and left a quiet trace in an outer aurora.

The design was driven by three feelings — **Arrival**, **Control**, and **Release** — and three laws — **Physicality**, **Chain**, and **Calm**. No red. No badges. No streaks. No guilt mechanics. The app was intended to feel more like a place than a tool.

---

## Why It Was Archived

Orbit succeeded technically. It failed experientially.

The working application included:

- A full 3D world with atmospheric twilight lighting, fog, and a reflective floor
- A pulsing Core with three orbital rings at distinct radii
- Task nodes with four-layer anatomy (core sphere, wireframe shell, orbital ring, SDF label)
- A four-light rig with ACES Filmic tone mapping
- Post-processing: bloom, vignette, film grain
- A camera state machine with four states (Orbit, Focus, Timeline, Aurora) and Catmull-Rom spline transitions
- Interaction driven by a unified `InteractionIntent` abstraction
- Full drag-and-drop with physics-based completion zone
- A six-phase completion choreography with particle dissolve and settle toast
- In-world editing with autosave (title, notes, priority, ring, due date, recurrence)
- A 5-second undo ghost after completion
- FastAPI backend with Supabase Postgres, JWT auth, and RLS
- Local-first sync with optimistic mutations, IndexedDB cache, and offline mutation queue
- A semantic HTML mirror for screen readers
- A WebGL fallback that renders the semantic mirror when 3D is unavailable
- Error boundaries at the app, scene, and UI levels
- Reduced-motion variants for all animations

And yet — the app was not pleasant to use daily.

A to-do list should be **faster than thinking of the task**. Orbit made users enter a 3D world first. The 3D metaphor was beautiful and slow. The design's core premise was that tasks feel better as objects; the reality was that tasks feel better as a list you can scan in 2 seconds.

This was not a bug. It was the wrong metaphor.

See [`POST-MORTEM.md`](./POST-MORTEM.md) for the full retrospective.

---

## What Lives On

Several pieces of Orbit are genuinely reusable and worth preserving. These are the artifacts of the project:

| Pattern | Location | What It Does |
|---|---|---|
| **Intent abstraction** | `apps/web/src/input/intents.ts`, `useIntent.ts` | Unifies mouse, touch, and keyboard into a single stream of semantic intents. Components never read raw events. |
| **Choreography engine** | `apps/web/src/choreography/` | Declarative animation timelines with keyframed tracks, easing, and lifecycle. Replaces scattered `setTimeout` chains. |
| **Catmull-Rom spline** | `apps/web/src/lib/spline.ts` | Camera path interpolation that arcs through 3D space instead of sliding in a straight line. |
| **Semantic mirror** | `apps/web/src/a11y/SemanticMirror.tsx` | HTML representation of a 3D scene for screen readers. The 3D canvas is `aria-hidden`; every task is mirrored as a real DOM element. |
| **Offline mutation queue** | `apps/web/src/data/offlineQueue.ts` | IndexedDB-backed queue that stores mutations while offline and flushes them on reconnect. |

These pieces are extracted and available at [link to be added] as reusable tools.

---

## Architecture

The full architecture is documented in five specification documents. They remain in `docs/` as a record of the design thinking:

- [`docs/PRD.md`](./docs/PRD.md) — Product Requirements (vision, scope, anti-principles)
- [`docs/TRD.md`](./docs/TRD.md) — Technical Requirements (stack, NFRs, milestones)
- [`docs/UI-UX.md`](./docs/UI-UX.md) — Design System (palette, lighting, motion, twenty design laws)
- [`docs/SYSTEM-ARCHITECTURE.md`](./docs/SYSTEM-ARCHITECTURE.md) — Blueprint (three planes, ownership, data flow)
- [`docs/CHOREOGRAPHY.md`](./docs/CHOREOGRAPHY.md) — Animation timelines (placeholder, would have been completed)
- [`docs/adr/`](./docs/adr/) — Architectural Decision Records (0001–0006)

The documents are longer than the code. That was the project's first lesson.

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

Orbit runs locally in WSL (Ubuntu) on Windows. It is not deployed.

**Prerequisites:**
- WSL2 with Ubuntu 22.04+
- Node 20+ (via nvm)
- pnpm 9+
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
cp .env.example .env.local
# Edit .env.local with your Supabase URL and publishable key
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
Space	Complete selected task
Escape	Deselect / exit focus
M	Mute (not implemented)
What Was Not Built
The following were planned but deferred, and are now permanently out of scope:

Settings screen

Sound design (ambient bed, interaction tones, completion chime)

Mobile optimization

Code splitting for bundle size

Full LOD system

Archive browser

Deployment

License
MIT. See LICENSE.

The code is provided as-is. It was a learning project. It is not audited for production use. It has known issues documented in KNOWN-ISSUES.md.

Final Note
Orbit is not a great to-do app. It is, however, a complete full-stack application that demonstrates a range of engineering patterns — from intent abstraction to choreography engines to offline-first sync — that most personal projects never touch.

If you are reading this as a prospective employer or collaborator: the code quality reflects the seriousness of the effort. The five specification documents, the six ADRs, the accessibility layer, and the tests are the parts worth looking at. The app is not the artifact. The rigor is.

If you are reading this as a future version of the author: use this project as a reference, not a template. It's proof that you can finish hard things. The next thing should be smaller, faster, and more honest about its purpose.

— Nisar Uddin, September 2026
