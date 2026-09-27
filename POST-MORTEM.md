# Orbit — Post-Mortem

**Project:** Orbit — A Personal Immersive 3D To-Do Environment
**Timeline:** September 22–27, 2026 (5 days)
**Status:** Paused. Not archived. Runs locally.
**Author:** Nisar Uddin

---

## What I Set Out to Build

A to-do list that feels like a *place* rather than a *list*.

The premise: tasks are loose ends. Loose ends are heavy. If I could turn tasks into physical objects in a persistent spatial world — objects I could move, shape, and physically release — then managing them would feel less like administration and more like a ritual.

The specific design: a twilight 3D environment with a glowing central Core and three concentric rings (Today, This Week, Someday). Each task was a node orbiting on one of those rings. Completing a task meant grabbing it with the mouse, dragging it into a magnetic completion zone, and watching it dissolve into particles that drifted outward into an aurora.

I wrote five specification documents before writing any code. I designed a six-phase animation choreography. I documented twenty design laws and six architectural decision records.

The app was intended to be a place I would open every day.

---

## What I Built

A working full-stack application.

**Frontend:**
- Full 3D world with twilight lighting, fog, and floor
- Pulsing Core with three orbital rings
- Task nodes with four-layer anatomy
- Camera state machine with four states and cinematic transitions
- Post-processing (bloom, vignette, film grain)
- Unified intent-based input layer
- Drag-and-drop with a physics-based completion zone
- Six-phase completion choreography
- In-world editing with autosave
- Reduced-motion variants
- Semantic HTML mirror for screen readers
- WebGL fallback
- Error boundaries at app, scene, and UI levels

**Backend:**
- FastAPI with Pydantic validation
- PostgreSQL schema with Row-Level Security
- JWT authentication via Supabase
- Full CRUD routes
- Alembic migrations
- Event logging
- End-to-end tests

**Sync:**
- Optimistic mutations
- IndexedDB cache
- Offline mutation queue
- Network indicator
- Polling fallback for realtime

The app runs locally. It signs in, reads and writes to Supabase, persists across reloads, and works offline. Every core feature planned for the application is implemented.

---

## The Honest State

I did not deploy it.

I attempted deployment to Render, which requires a credit card for the free tier. I attempted Koyeb, whose free tier was discontinued after the Mistral AI acquisition. Neither was possible without payment. I made the decision to run it locally for now.

I have not yet used it for a full week with real tasks. I built it, verified it works, and stopped.

That is the truth. I do not yet know whether the metaphor survives daily use. I have not tested it.

---

## What Worked

### The completion choreography

The six-phase sequence — Reach, Grab, Drag, Release, Dissolve, Settle — was genuinely satisfying. Particles left the node, drifted outward, and joined an aurora ribbon. A settle toast appeared with the released task's title. An undo ghost appeared for 5 seconds.

It was the one moment in the app that matched the design intent. It felt like *release*.

Why it worked: it had a beginning, a middle, and an end. It was over in 4 seconds. It gave a small visual reward without shouting.

### The intent abstraction

Every input — mouse, keyboard, touch, future screen reader — produced the same `InteractionIntent` objects. Components subscribed to intents. No component read raw events.

This made the codebase coherent. Adding keyboard navigation was small. Adding screen reader support was small. Adding drag was small. Each could have been a rewrite without the intent layer.

### The semantic mirror

Every 3D node had an HTML counterpart in a hidden `<section>`. Screen readers could operate the entire app without seeing the 3D scene. Almost no 3D web app does this.

Because it was built early, it stayed in sync. Deferred accessibility rarely gets built.

### The offline queue

IndexedDB stored pending mutations while offline. On reconnect, the queue flushed in FIFO order. The app worked identically online and offline.

### The choreography engine

A declarative timeline system for animations. Keyframed tracks, easings, lifecycle. It replaced scattered `setTimeout` chains.

Because every animation in the app used it, extending it was clean. When the completion choreography needed sequence phases and scoped listeners, the extension took one file.

---

## What Didn't Work

### Deployment

Not a code problem. A cost problem. Every viable free-tier host either required a credit card, or had removed its free tier, or had been acquired and discontinued the free plan.

**Lesson:** If deployment matters, decide the host before building. Not after.

### The three unresolved bugs

Three bugs were never fully resolved:

1. Realtime updates from Supabase did not reliably invalidate the query cache. Polling at 5-second intervals handled sync instead.
2. New nodes appeared only after a focus event or a poll, not immediately on creation.
3. The unarchive flow was not exposed in the UI. Unarchiving required a console command.

None were architectural. All were fixable. By the time they surfaced, I was deep into the project and made a decision to document them and move on rather than keep chasing.

They are documented in `KNOWN-ISSUES.md`.

**Lesson:** A bug is not always worth chasing to its root. Documenting a known limitation and moving on is a valid engineering decision. Three bugs were logged; the project continued.

### Documentation longer than code

The five specification documents total roughly 16,000 lines. The code is smaller. For a solo project with no external stakeholders, that ratio was wrong.

The specs were intellectually satisfying. They also locked in decisions I could not validate until I built the thing. Every bug fix became a negotiation between the code and the spec.

**Lesson:** For a solo project, prototype first. Write the spec for the parts that survive contact with the build.

### Verification fatigue

Every sub-step ended with `pnpm lint && pnpm typecheck && pnpm build` and a browser check. This discipline caught hundreds of small errors early. It also exhausted me.

Ten-hour days, five days in a row, produced three days of good work and two days of fatigued work. The fatigued days were when the more subtle bugs were introduced.

**Lesson:** A fixed pace — five or six hours a day, consistently — would have produced a better result than five long days.

---

## What I Would Do Differently

### 1. Prototype the core interaction on day one

Not a full app. Just the completion choreography, in isolation. Use it for an hour. See if it feels good.

That is the highest-risk unknown in the entire design. Everything else is scaffolding around it.

### 2. Write the specs after the prototype, not before

The spec documents are valuable as a *record* of the design. They are less valuable as a *precondition* for the build.

The right order for a solo project:

1. Prototype the riskiest interaction
2. Decide if the metaphor is worth keeping
3. Write the spec for the parts that survive
4. Build the real thing

### 3. Decide the deployment target before writing any code

Deployment cost determined the final state of the project. If deployment matters, choose the host first. If it does not matter, do not spend time on it.

### 4. Cap the daily hours

Five or six hours a day. No exceptions. The bug rate at hour nine is not worth the code it produces.

### 5. Import real tasks sooner

The mock data was never real. Importing ten real to-dos on day two would have exposed real friction earlier.

---

## What I Would Keep

### The intent abstraction

`InteractionIntent` was the single best architectural decision in the project. I will use this pattern in every interactive application I build.

### The choreography engine

Declarative timelines for animations. Roughly 250 lines. Endlessly extendable.

### The Catmull-Rom spline

Camera paths that arc through space instead of sliding. Small code, large effect on how motion feels.

### The semantic mirror

Every 3D app should have one. It is not optional.

### The ADRs

Six architectural decision records. One page each. Each captures *why* a decision was made, not just *what* it was.

### The verification discipline

Every sub-step ended with the checks passing before any commit. This caught hundreds of small errors before they became large ones.

The next project inherits this discipline from day one.

---

## What I Learned

**Technical skills gained:**
WSL, Node, nvm, pnpm, Python, uv, TypeScript strict mode, Three.js, React Three Fiber, Zustand, TanStack Query, Supabase (Postgres, Auth, RLS, Realtime), FastAPI, SQLAlchemy, Alembic, IndexedDB, GitHub Actions, the full Git workflow.

**Higher-order skills gained:**
- Reading error output and diagnosing from behavior, not guesses
- Understanding local-first vs. server-first trade-offs
- Writing specifications before code, and knowing when not to
- Using AI tools to build something complex without losing coherence
- Knowing when a project is finished enough to stop

**The most important lesson:**

Do not chase every bug to its root. Document what you know. Move on. Finish the important parts. Come back later if it matters.

Orbit has three unresolved bugs. It also has a working completion choreography, an offline queue, an accessibility layer, and a backend with real authentication. Those matter more than the three bugs.

---

## Numbers

- **Time invested:** 5 days
- **Commits:** dozens
- **Specification documents:** 5 (~16,000 lines)
- **ADRs:** 6
- **Major bugs fixed:** many
- **Major bugs logged and left:** 3
- **Deployment:** none
- **Daily users:** not yet measured

---

## Final Reflection

The value of this project is not the app. It is the practice.

Five days of full-stack development from nothing to a working application taught me more than any tutorial. The bugs I hit, the decisions I made and reversed, the specs I wrote and then found too ambitious — all of it is now part of how I will build the next thing.

The next thing will be smaller. It will ship faster. It will be evaluated earlier.

I am glad I built Orbit. I am also glad I paused it when I did, instead of forcing it further than it needed to go.

— N.U.
September 2026
