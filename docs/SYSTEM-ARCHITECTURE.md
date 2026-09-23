**Orbit — A Personal Immersive 3D To-Do Environment**

**SYSTEM ARCHITECTURE**

**Ultimate Final Specification**

**Document Version:** 2.0 — Final Architecture  
**Status:** Final — Master System Blueprint  
**Project:** Orbit  
**Owner:** Sole architect, sole operator, sole user  
**Architecture Model:** Local-first, single-owner, service-backed PWA  
**Primary Experience:** Immersive 3D spatial productivity environment  
**Companion Documents:**

- PRD.md — Product definition and product intent
- TRD.md — Technical requirements and implementation constraints
- UI-UX.md — Visual, interaction, sensory, and behavioral contract
- CHOREOGRAPHY.md — Timing, animation, and synchronized experience timelines
- SYSTEM-ARCHITECTURE.md — System structure and cross-document integration

**0\. DOCUMENT PURPOSE**

**0.1 What This Document Is**

This document is the **architectural backbone of Orbit**.

The PRD defines:

**What Orbit is and why it exists.**

The TRD defines:

**What technical requirements must be satisfied and how the system is built.**

The UI/UX specification defines:

**How Orbit looks, feels, behaves, communicates, and responds.**

The Choreography specification defines:

**When visual, spatial, physical, and auditory events occur.**

This document defines:

**How every one of those systems connects into one coherent machine.**

It defines:

- system boundaries
- architectural layers
- ownership of state
- data authority
- subsystem responsibilities
- communication contracts
- task lifecycle
- synchronization
- persistence
- failure recovery
- rendering boundaries
- choreography boundaries
- security boundaries
- deployment
- observability
- testing
- migration
- backup and recovery
- version compatibility
- long-term maintainability
- architectural invariants
- operational procedures
- future evolution

The purpose is not to make Orbit architecturally complicated.

The purpose is to make Orbit **architecturally understandable**.

**0.2 Architectural Mission**

Orbit must satisfy five architectural goals:

1. **Experience must remain immediate.**
2. **User data must remain durable.**
3. **The system must remain understandable to one person.**
4. **Failure in one subsystem must not unnecessarily destroy the others.**
5. **The architecture must remain replaceable over time.**

The architecture therefore favors:

- explicit contracts over hidden coupling
- local state over unnecessary network dependency
- deterministic transitions over implicit behavior
- small services over distributed complexity
- boring infrastructure beneath an extraordinary experience
- portable data
- recoverability
- observability without surveillance
- progressive enhancement
- graceful degradation

**0.3 The Fundamental Architectural Principle**

**Orbit is an experience-first application built on a reliability-first foundation.**

The architecture must never sacrifice the immediacy of the experience merely because the network is slow.

Likewise, the architecture must never sacrifice data correctness merely because the visual experience is beautiful.

The system therefore separates:

**experience immediacy**

from

**persistence authority**

and connects them through explicit synchronization.

**0.4 Single-User Constraint**

Orbit is intentionally designed for one owner.

This is not an accidental limitation.

It is an architectural advantage.

The system therefore does **not** optimize for:

- multi-tenant scaling
- organizational permissions
- teams
- shared workspaces
- social activity
- collaborative editing
- public profiles
- behavioral analytics
- advertising
- recommendation engines

The architecture instead optimizes for:

- simplicity
- privacy
- reliability
- personal ownership
- portability
- low operating cost
- long-term maintainability

If the product ever becomes multi-user, that is an architectural fork and must not be introduced accidentally.

**0.5 The Three Feelings**

Orbit exists architecturally to support three fundamental feelings:

**Arrival**

The system should feel like entering a place.

**Control**

The system should feel responsive, predictable, and physically understandable.

**Release**

Completing work should feel like letting something go.

Every major architectural decision should be evaluated against these three outcomes.

If a technically elegant solution damages them without a compelling reliability or security reason, it should be reconsidered.

**1\. ARCHITECTURAL AUTHORITY**

**1.1 Source-of-Truth Hierarchy**

When documents disagree, authority follows this order:

1\. Core Product Principles

↓

2\. PRD

↓

3\. System Architecture

↓

4\. TRD

↓

5\. UI/UX

↓

6\. Choreography

↓

7\. Implementation

↓

8\. Library convenience

However, this hierarchy does **not** mean lower documents are unimportant.

It means:

- product intent governs architecture
- architecture governs implementation boundaries
- technical requirements govern implementation constraints
- UI/UX governs experience expression
- choreography governs timing
- implementation follows the resulting contract

**1.2 Conflict Resolution Rule**

When two documents disagree:

1. Identify the conflicting requirement.
2. Determine which architectural or product principle is affected.
3. Resolve the conflict explicitly.
4. Update the affected document.
5. Update implementation in the same change.
6. Record the decision if the conflict was architectural.

There must never be a silent architectural divergence.

**1.3 Code Is Not the Final Authority**

Code is an implementation.

It is not the architecture.

If code disagrees with the architecture:

- either the code is wrong
- or the architecture has intentionally changed

The change must be documented.

**2\. SYSTEM IN ONE SENTENCE**

**Orbit is a local-first single-page PWA that maintains an immediately responsive local task world, synchronizes durable task state through a thin authenticated API, persists canonical data in PostgreSQL, and renders the entire experience as a spatial 3D projection of that state.**

**3\. SYSTEM IN ONE DIAGRAM**

┌──────────────────────────────┐

│ ORBIT USER │

│ │

│ mouse / touch / keyboard │

└──────────────┬───────────────┘

│

▼

┌───────────────────────────────────────────────────────────────────┐

│ EXPERIENCE PLANE │

│ │

│ React Application │

│ │ │

│ ├── UI Shell │

│ ├── Interaction Controller │

│ ├── Camera Controller │

│ ├── Scene Runtime │

│ ├── Choreography Engine │

│ ├── Audio Engine │

│ ├── Accessibility / Semantic Mirror │

│ └── Local Store │

│ │ │

│ ▼ │

│ Sync Layer │

│ │ │

│ IndexedDB Queue │

└────────────────────┼──────────────────────────────────────────────┘

│

│ HTTPS

▼

┌───────────────────────────────────────────────────────────────────┐

│ LOGIC PLANE │

│ │

│ FastAPI │

│ │

│ Authentication Middleware │

│ Authorization │

│ Validation │

│ Domain Services │

│ Recurrence Engine │

│ Idempotency │

│ Import / Export │

│ Error Translation │

│ Operational Logging │

│ │

└────────────────────┬──────────────────────────────────────────────┘

│

│ TLS / PostgreSQL

▼

┌───────────────────────────────────────────────────────────────────┐

│ DATA PLANE │

│ │

│ PostgreSQL │

│ Supabase Auth │

│ Supabase Realtime │

│ Backup Storage │

│ │

│ Tasks │

│ Task Events │

│ Idempotency Records │

│ Operational Records │

└───────────────────────────────────────────────────────────────────┘

**4\. THE THREE PLANES**

**4.1 Plane 1 — Experience Plane**

**Responsibility**

The Experience Plane is responsible for everything the owner directly experiences.

It owns:

- rendering
- input
- camera
- interaction
- local state
- choreography
- sound
- visual feedback
- accessibility presentation
- offline continuity

It does **not** own:

- canonical persistence
- authentication authority
- business-rule authority
- database access
- server secrets

**Technology**

- TypeScript
- React
- Vite
- Three.js
- React Three Fiber
- Drei
- Zustand or equivalent local state
- TanStack Query
- IndexedDB
- Web Audio
- PWA/service worker
- Troika or equivalent SDF text rendering

**4.2 Plane 2 — Logic Plane**

The Logic Plane is the authoritative business-rule layer.

It owns:

- authentication verification
- authorization
- validation
- task lifecycle rules
- recurrence
- idempotency
- persistence orchestration
- import/export
- conflict handling
- API contracts
- operational logging

It must never own:

- UI state
- animation timing
- camera state
- visual appearance
- audio composition

The backend decides **what happened**.

The frontend decides **how that event is experienced**.

**4.3 Plane 3 — Data Plane**

The Data Plane owns durable storage infrastructure.

It provides:

- PostgreSQL
- authentication infrastructure
- realtime transport
- storage
- backups

It does not contain Orbit-specific presentation logic.

**4.4 Plane Dependency Rule**

Normal dependency direction:

Experience

↓

Logic

↓

Data

Never:

Experience → Database business tables

Never:

Database → Experience behavior

Never:

Backend → camera / animation / UI state

**5\. BOUNDED DIRECT DATA-PLANE ACCESS**

The browser may communicate directly with Supabase only for infrastructure capabilities that are explicitly approved.

**Allowed**

- authentication
- realtime subscription transport

**Forbidden**

- direct task writes
- direct task business reads
- direct mutation of protected records
- exposing service-role credentials
- client-side bypass of API business rules

Realtime is a **signal**, not the canonical task source.

The canonical business data remains available through the API.

**6\. CORE SUBSYSTEMS**

Orbit consists of the following primary subsystems:

| **#** | **Subsystem**       | **Responsibility**                   |
| ----- | ------------------- | ------------------------------------ |
| 1     | Scene Runtime       | Render the world                     |
| 2     | Interaction System  | Translate human input into intent    |
| 3     | Camera System       | Manage spatial viewpoint             |
| 4     | Choreography Engine | Execute timed experience sequences   |
| 5     | Audio Engine        | Provide synchronized sound           |
| 6     | Local Store         | Immediate application state          |
| 7     | Persistence Adapter | IndexedDB durability                 |
| 8     | Sync Layer          | Server synchronization               |
| 9     | API Service         | Business authority                   |
| 10    | Domain Services     | Task rules                           |
| 11    | Persistence Layer   | Database access                      |
| 12    | Realtime Adapter    | Cross-device change notification     |
| 13    | Accessibility Layer | Semantic and alternative interaction |
| 14    | Observability Layer | Health and diagnostics               |
| 15    | Configuration Layer | Runtime configuration                |

No subsystem may silently assume another subsystem's internal state.

**7\. DOMAIN BOUNDARIES**

**7.1 Domain Core**

The domain core contains rules that define Orbit's actual task system.

Examples:

- task lifecycle
- completion
- restoration
- recurrence
- archive
- validation
- task classification

It must remain independent of:

- React
- Three.js
- CSS
- audio
- browser APIs

**7.2 Experience Domain**

The experience domain translates domain state into:

- spatial placement
- visual state
- animation
- sound
- camera behavior
- interaction feedback

The experience domain may interpret state.

It may not redefine business truth.

**7.3 Infrastructure Domain**

Infrastructure includes:

- API transport
- IndexedDB
- PostgreSQL
- Supabase
- authentication
- realtime
- service worker
- deployment

Infrastructure must remain replaceable.

**8\. CANONICAL STATE MODEL**

Orbit has several kinds of state.

They must never be confused.

| **State**              | **Authority**                     | **Lifetime**       |
| ---------------------- | --------------------------------- | ------------------ |
| Task domain state      | Server/database                   | Durable            |
| Local task projection  | Local Store                       | Session + offline  |
| Pending mutation       | IndexedDB                         | Until synchronized |
| Scene state            | Renderer                          | Runtime            |
| Camera state           | Camera controller                 | Runtime            |
| Choreography state     | Animation engine                  | Temporary          |
| Audio state            | Audio engine                      | Runtime            |
| UI panel state         | UI layer                          | Runtime            |
| Authentication session | Auth provider                     | Session            |
| Preferences            | Local persistence / configuration | Durable            |
| Network state          | Browser/runtime                   | Ephemeral          |

**9\. STATE AUTHORITY RULE**

For any piece of information, exactly one layer is authoritative.

Examples:

**Task title**

Server task

↓

Local projection

↓

3D label

**Node position**

Persisted spatial memory

↓

Local scene projection

↓

Rendered node

**Current camera interpolation**

Camera controller

↓

Three.js camera

**Completion animation**

Choreography engine

↓

Renderer

The database must never know that a particle is halfway through a dissolve.

**10\. TASK ENTITY**

The canonical task contains:

interface Task {

id: string;

userId: string;

title: string;

notes: string;

ring: 'today' | 'week' | 'someday';

priority: 0 | 1 | 2 | 3;

status:

| 'idle'

| 'in_progress'

| 'completed'

| 'archived';

dueAt: string | null;

recurrence:

| 'daily'

| 'weekly'

| 'monthly'

| null;

createdAt: string;

updatedAt: string;

completedAt: string | null;

archivedAt: string | null;

orbitAngle: number | null;

orbitRadius: number | null;

}

The architecture must not create duplicate competing task models.

Frontend types should derive from the canonical contract wherever practical.

**11\. TASK STATE MACHINE**

┌─────────────┐

│ idle │

└──────┬──────┘

│

begin / edit

│

▼

┌─────────────┐

│ in_progress │

└──────┬──────┘

│

complete

│

▼

┌─────────────┐

│ completed │

└──────┬──────┘

│

archive / TTL

│

▼

┌─────────────┐

│ archived │

└─────────────┘

restore:

completed ───────────────► idle

archived ───────────────► idle

Every transition must have:

- trigger
- validation
- domain effect
- local effect
- server effect
- visual response
- audio response where appropriate
- failure behavior
- recovery behavior

**12\. STATE INVARIANTS**

These are architectural laws.

1. Completed tasks have a completion timestamp.
2. Archived tasks have an archive timestamp.
3. Active tasks are not simultaneously archived.
4. Recurring tasks require a valid due time.
5. Priority remains within its defined range.
6. Ring remains one of the supported rings.
7. Task title remains within length constraints.
8. Server timestamps are authoritative.
9. Client-generated identity must remain stable during optimistic creation.
10. A completion operation cannot create duplicate recurrence children.
11. An archived task cannot silently reappear as active.
12. Renderer state cannot mutate canonical domain state without passing through an interaction/domain pathway.

**13\. TASK CREATION PIPELINE**

User intent

↓

Input validation

↓

Create intent

↓

Client UUID generated

↓

Local optimistic task

↓

Seeding choreography

↓

Node enters scene

↓

Mutation queued

↓

API validation

↓

Database transaction

↓

Canonical response

↓

Local reconciliation

↓

Stable scene continues

Important:

The owner must never wait for the network to see the task appear.

**14\. TASK COMPLETION PIPELINE**

Completion is a domain operation and an experience event.

User grabs task

↓

Interaction validates gesture

↓

Completion intent

↓

Local state becomes completed

↓

Completion choreography starts

↓

Task moves toward completion zone

↓

Visual release

↓

Aurora projection

↓

Mutation queued

↓

Server completion

↓

Recurrence generated if applicable

↓

Canonical response

↓

Local reconciliation

The visual choreography must not wait for server latency.

**15\. RECURRENCE ARCHITECTURE**

Recurrence belongs to the backend domain layer because it changes durable state.

The frontend may predict the visual result but cannot authoritatively create recurrence children.

**Completion transaction**

BEGIN

update original task → completed

IF recurring:

calculate next due date

create next task

create completion event

create recurrence event

COMMIT

If any part fails:

ROLLBACK

No half-completed recurrence state is permitted.

**16\. IDEMPOTENCY**

Every mutation that can be retried must be safely retryable.

The client generates:

idempotencyKey

The server stores:

key

user

requestHash

response

createdAt

Same key + same request:

return original response

Same key + different request:

409 CONFLICT

This protects against:

- double-clicks
- network retries
- reconnect retries
- browser refreshes
- duplicate form submission
- service worker replay

**17\. LOCAL-FIRST ARCHITECTURE**

The local application must remain functional during temporary network failure.

**Normal mode**

Input

↓

Local state

↓

Scene

↓

Sync

↓

Server

**Offline mode**

Input

↓

Local state

↓

Scene

↓

IndexedDB queue

**Reconnection**

IndexedDB queue

↓

FIFO mutation replay

↓

Server

↓

Canonical response

↓

Local reconciliation

**18\. OFFLINE GUARANTEE**

Offline must not mean:

"The application is broken."

It means:

"Persistence synchronization is temporarily delayed."

The experience should continue whenever sufficient local data exists.

The UI should communicate degradation subtly rather than turning the application into an error dashboard.

**19\. OFFLINE QUEUE**

interface PendingMutation {

id: string;

idempotencyKey: string;

method:

| 'POST'

| 'PATCH'

| 'DELETE';

path: string;

body: unknown;

createdAt: number;

attempts: number;

lastError?: string;

}

Queue rules:

- FIFO
- durable in IndexedDB
- retryable
- idempotent
- observable internally
- never silently discarded unless explicitly classified unrecoverable

If queue capacity is reached, the system must prioritize preserving the newest user actions and surface a recoverable warning rather than silently deleting work.

**20\. CONFLICT RESOLUTION**

Default conflict policy:

server timestamp

↓

updated_at

↓

deterministic winner

However, lifecycle transitions receive higher semantic priority where necessary.

For example:

completed

must not casually be overwritten by a stale edit from another device.

Conflict resolution must therefore distinguish:

- ordinary field conflict
- lifecycle conflict
- deletion/archive conflict
- recurrence conflict

The conflict engine must be deterministic.

The same inputs must produce the same result.

**21\. REALTIME ARCHITECTURE**

Realtime exists to reduce synchronization latency.

It does not replace the API.

Database change

↓

Realtime signal

↓

Affected client

↓

Invalidate cache

↓

GET canonical task

↓

Reconcile local state

↓

Spring into new state

This prevents:

- stale row assumptions
- duplicated business logic
- inconsistent partial payloads
- direct data-plane authority leaking into the frontend

**22\. RENDERER ARCHITECTURE**

The renderer is a projection engine.

It receives application state and transforms it into:

- geometry
- materials
- lighting
- particles
- labels
- camera position
- animation

The renderer must not become the application's database.

**23\. REACT / R3F BOUNDARY**

React owns:

- application composition
- UI structure
- panels
- forms
- accessibility
- lifecycle of high-level components

R3F/Three.js owns:

- 3D scene
- meshes
- materials
- lights
- camera
- render-loop animation

Per-frame animation should use refs or dedicated runtime state rather than causing React reconciliation every frame.

**24\. SCENE GRAPH**

The scene should be organized conceptually as:

Scene

├── Environment

│ ├── Background

│ ├── Fog

│ ├── Ambient Atmosphere

│ └── Lighting Rig

│

├── World

│ ├── Core

│ ├── Today Ring

│ ├── Week Ring

│ ├── Someday Ring

│ ├── Task Nodes

│ └── Aurora

│

├── Interaction

│ ├── Completion Zone

│ ├── Focus Target

│ └── Invisible Interaction Geometry

│

└── Effects

├── Particles

├── Trails

├── Dissolve Effects

└── Ambient Effects

The scene graph must remain predictable.

**25\. WORLD / UI SEPARATION**

Orbit has two simultaneous interfaces:

**World Interface**

The immersive 3D environment.

**Interface Layer**

Forms, panels, menus, controls, accessibility surfaces, and utility UI.

Neither should unnecessarily dominate the other.

The UI should support the world.

The world should communicate state without requiring the UI for every action.

**26\. CAMERA ARCHITECTURE**

The camera is a state machine.

Possible states include:

ORBIT

FOCUS_TASK

EDIT_TASK

TIMELINE

AURORA

TRANSITION

RECOVERY

Each state defines:

- target
- distance
- orientation
- controls
- interpolation
- interruption rules

**27\. CAMERA TRANSITIONS**

Camera motion must be:

- authored
- interruptible
- deterministic
- cancellable
- context-aware

A new camera request must never create competing tweens on the same camera properties.

There must be one camera authority.

**28\. CAMERA INTERRUPTION RULE**

If the owner interrupts a transition:

current camera transform

↓

new destination

↓

new transition

Never:

old tween continues

-

new tween starts

-

third tween modifies same property

The result must never become accumulated animation state.

**29\. INPUT ARCHITECTURE**

All input should pass through an abstraction layer.

Mouse

Touch

Keyboard

Pen

Assistive technology

↓

Input abstraction

↓

Interaction intent

↓

Domain / scene action

This prevents the product from becoming mouse-dependent.

**30\. INTERACTION INTENTS**

Examples:

type InteractionIntent =

| { type: 'select-task'; taskId: string }

| { type: 'begin-drag'; taskId: string }

| { type: 'move-task'; taskId: string; position: Vector3 }

| { type: 'complete-task'; taskId: string }

| { type: 'restore-task'; taskId: string }

| { type: 'open-editor'; taskId: string }

| { type: 'create-task' }

| { type: 'focus-task'; taskId: string };

Raw pointer coordinates should not become business commands.

**31\. INTERACTION PRIORITY**

When multiple interactive elements overlap:

1\. Active drag

2\. Focused task

3\. Completion target

4\. Task node

5\. World navigation

6\. Background

Only one interaction controller may own the pointer gesture at a time.

**32\. DRAG ARCHITECTURE**

Dragging is a temporary interaction state.

idle

↓

pointer-down

↓

candidate

↓

dragging

↓

completion-zone candidate

↓

release

↓

complete / return

The system must distinguish:

- click
- drag
- accidental movement
- touch scroll
- intentional completion

**33\. COMPLETION ZONE**

The completion zone is not merely a button.

It is an interaction destination.

It should have:

- stable spatial identity
- discoverable affordance
- proximity response
- magnetic attraction
- release confirmation
- synchronized visual feedback
- synchronized sound
- graceful cancellation

The completion zone must never become visually aggressive.

**34\. CHOREOGRAPHY ENGINE**

Choreography is separated from application state.

Application state says:

"Task completed."

Choreography says:

"This is how that completion is experienced."

A choreography may contain tracks such as:

position

rotation

scale

opacity

emissive intensity

particle emission

camera

audio cue

UI response

**35\. CHOREOGRAPHY CONTRACT**

interface Choreography {

name: string;

duration: number;

tracks: ChoreographyTrack\[\];

interruptible: boolean;

reducedMotionVariant?: string;

}

The engine must support:

- play
- cancel
- pause where required
- complete
- interruption
- reduced-motion substitution
- lifecycle cleanup

**36\. CHOREOGRAPHY MUST NOT OWN DOMAIN TRUTH**

Incorrect:

animation finished

→ therefore task is completed

Correct:

task completion accepted

→ choreography begins

The animation visualizes the state transition.

It does not create the state transition.

**37\. COMPLETION TIMELINE**

The canonical completion baseline remains:

0.0s Reach

0.3s Grab

0.6s Drag

1.5s Release

1.8s Dissolve begins

2.8s Dissolve completes

4.0s World settles

The exact values remain configurable through the choreography specification.

Architecture only guarantees that the timing engine can express and synchronize them.

**38\. AUDIO ARCHITECTURE**

Audio is a companion layer.

It must never become a separate notification system.

Audio events should originate from meaningful experience events:

task seeded

task selected

drag begins

completion proximity

completion release

dissolve

restore

error

Audio can be disabled independently.

**39\. AUDIO SYNCHRONIZATION**

Visual and audio systems must share event timestamps or choreography markers where synchronization matters.

Do not implement:

visual animation

-

independent setTimeout audio

Prefer:

choreography marker

├── visual track

└── audio cue

This keeps the experience synchronized.

**40\. ACCESSIBILITY ARCHITECTURE**

Accessibility is a parallel interface, not an afterthought.

The semantic layer must expose:

- task names
- status
- priority
- ring
- due date
- actions
- completion
- restore
- editing
- navigation

The 3D world remains the primary visual experience.

The semantic interface provides equivalent access to meaning and action.

**41\. SEMANTIC MIRROR**

Where a 3D interaction cannot be made equivalently accessible, provide a semantic alternative.

Example:

3D:

Grab task → drag to Core → release

Semantic:

Focus task → activate "Complete"

The semantic alternative must not be treated as a lesser version.

It must perform the same domain operation.

**42\. REDUCED MOTION**

When reduced motion is enabled:

- camera transitions shorten
- large particle bursts disappear
- unnecessary oscillation stops
- drag effects simplify
- dissolve becomes a restrained fade
- UI remains understandable
- completion still feels meaningful

Reduced motion must change presentation, not functionality.

**43\. DATA PERSISTENCE LAYERS**

Orbit has three persistence levels:

**Level 1 — Runtime**

Fastest.

Lost on reload.

**Level 2 — Local durable**

IndexedDB.

Survives:

- reload
- temporary offline periods
- browser restart

**Level 3 — Remote durable**

PostgreSQL.

Survives:

- device loss
- browser loss
- local storage loss

**44\. PERSISTENCE RULE**

A successful user action should never be considered safely persisted merely because the UI changed.

The system should distinguish:

Applied locally

Queued

Sent

Accepted by server

Canonicalized

This status may remain mostly invisible to the owner, but it must exist internally.

**45\. SERVER RESPONSE RECONCILIATION**

When the server responds:

local optimistic task

↓

canonical server task

↓

merge

↓

preserve visual continuity

If no meaningful visual correction is necessary, the renderer should not visibly jump.

**46\. VISUAL CONTINUITY RULE**

Data synchronization must not unnecessarily destroy visual continuity.

If a task's server response changes:

- timestamp
- version
- server metadata

the node should remain spatially stable.

If its actual spatial identity changes, transition smoothly.

**47\. ERROR ARCHITECTURE**

Errors are categorized into:

User Error

Network Error

Authentication Error

Authorization Error

Validation Error

Conflict

Persistence Error

Rendering Error

Infrastructure Error

Unknown Error

Each class has a defined response.

**48\. ERROR PRINCIPLE**

Orbit must never expose raw technical failures as the primary user experience.

Bad:

AxiosError: ECONNREFUSED

Better:

"Changes will sync when the connection returns."

Technical details remain available to diagnostics.

**49\. ERROR SEVERITY**

**Level 0 — Invisible recovery**

Example:

- temporary realtime disconnect

**Level 1 — Ambient feedback**

Example:

- offline state

**Level 2 — Soft notification**

Example:

- server rejected a mutation

**Level 3 — Blocking recovery**

Example:

- authentication expired and cannot refresh

**Level 4 — Emergency fallback**

Example:

- WebGL unavailable

The architecture should always use the lowest appropriate severity.

**50\. WEBGL FAILURE**

If WebGL is unavailable:

3D experience

↓

feature detection

↓

2D semantic Orbit

The user should still be able to:

- view tasks
- create tasks
- edit tasks
- complete tasks
- restore tasks
- archive tasks

The 3D layer is the primary experience, not the sole data-access mechanism.

**51\. WEBGL CONTEXT LOSS**

On context loss:

1. stop unsafe rendering operations
2. preserve local application state
3. attempt context restoration
4. rebuild transient GPU resources
5. resume rendering
6. fall back to semantic mode if restoration fails

Task data must never depend on GPU memory.

**52\. SERVICE WORKER ARCHITECTURE**

The service worker should cache:

- application shell
- versioned static assets
- explicitly approved offline resources

It must not blindly cache mutable API responses as if they were canonical.

Cache invalidation must be versioned.

**53\. VERSIONING**

Orbit has several independent versions:

Application version

API version

Database schema version

Data export version

Choreography version

UI token version

These must not be conflated.

**54\. API VERSIONING**

Current API may use:

/api/v1/...

Breaking changes require a new version.

Non-breaking additions may remain within the existing version.

Clients should reject incompatible major versions rather than silently misinterpret responses.

**55\. DATABASE MIGRATION RULES**

Every migration must be:

- explicit
- versioned
- tested
- reversible where practical
- backed up before destructive changes

Migration process:

backup

↓

migration validation

↓

staging/test data

↓

migration

↓

health check

↓

application verification

**56\. IMPORT / EXPORT CONTRACT**

Orbit data must remain portable.

Export should contain:

- schema version
- export timestamp
- tasks
- required metadata
- optional event history where supported

Example:

{

"format": "orbit-export",

"version": 1,

"exportedAt": "2026-01-01T00:00:00Z",

"tasks": \[\]

}

Import must validate the complete payload before mutating production data.

**57\. IMPORT SAFETY**

Never perform:

read one row

insert it

read next row

...

without transaction protection.

Prefer:

validate entire document

↓

begin transaction

↓

apply changes

↓

commit

If validation fails:

zero production changes

**58\. BACKUP ARCHITECTURE**

Orbit maintains:

**Automatic backup**

Scheduled database/data export.

**Manual export**

Owner-triggered portable export.

**Recovery test**

Periodic restoration test.

A backup that has never been restored is only an assumption.

**59\. RECOVERY OBJECTIVES**

The system should target:

**Normal application failure**

Recovery:

seconds

**API outage**

Local work continues.

**Database outage**

Local work continues where cached data exists.

**Database loss**

Restore from backup.

**Infrastructure provider loss**

Move portable components to replacement infrastructure.

The architecture should avoid irreversible provider lock-in.

**60\. SECURITY MODEL**

Security is layered.

Browser

↓

HTTPS

↓

Authentication

↓

Authorization

↓

API validation

↓

Business rules

↓

Scoped database queries

↓

RLS

↓

Encrypted storage

No single security control is considered sufficient.

**61\. AUTHENTICATION**

Authentication proves:

"Who is this?"

Authorization proves:

"What may this identity access?"

These must remain separate concepts.

The API must never trust a client-provided user ID.

The authenticated identity is authoritative.

**62\. AUTHORIZATION**

Every business request must resolve the authenticated owner.

Conceptually:

JWT

↓

authenticated subject

↓

authorized owner

↓

database scope

The client must not be able to request:

user_id = someone_else

and have that identity accepted.

**63\. SECRETS**

Never place server secrets in:

- frontend source
- Git
- browser storage
- public configuration
- client bundles

Only genuinely public configuration may reach the browser.

**64\. CONTENT SECURITY**

The frontend should minimize attack surface through:

- strict CSP
- no unnecessary third-party scripts
- no arbitrary HTML injection
- no unsafe eval
- sanitized user content
- dependency minimization
- HTTPS

**65\. PRIVACY ARCHITECTURE**

Orbit should not collect unnecessary personal data.

No architectural requirement exists for:

- behavioral tracking
- advertising
- session recording
- third-party profiling
- task-content analytics
- social graphs

The system should know what it needs to operate and nothing more.

**66\. OBSERVABILITY**

Observability must answer:

Is Orbit working?

without becoming another product the owner has to manage.

Core signals:

- API health
- database connectivity
- synchronization failure
- backup success
- migration status
- client fatal errors
- queue failure

No unnecessary analytics platform is required.

**67\. STRUCTURED LOGGING**

Backend logs should contain operational metadata such as:

{

"timestamp": "...",

"level": "info",

"requestId": "...",

"method": "POST",

"path": "/api/v1/tasks",

"status": 201,

"durationMs": 42,

"event": "task_created"

}

Avoid storing:

- task titles
- notes
- email addresses
- private task content
- unnecessary identifiers

**68\. FRONTEND DIAGNOSTICS**

Production diagnostics should be minimal.

Development may expose:

- render timings
- active choreography
- local queue length
- API latency
- scene statistics
- WebGL capabilities

These diagnostics must not alter production behavior.

**69\. PERFORMANCE ARCHITECTURE**

Performance is an architectural concern, not an optimization phase.

Target experience:

- approximately 60 FPS on capable devices
- perceptually immediate interaction
- minimal React rerendering during animation
- bounded particle count
- bounded geometry complexity
- controlled draw calls
- predictable memory usage

**70\. RENDER PERFORMANCE RULES**

Avoid:

- unnecessary per-frame allocations
- React state updates every frame
- duplicated materials
- unnecessary geometry
- uncontrolled particle growth
- expensive post-processing on low-tier devices
- full-scene rebuilds for one task change

Prefer:

- instancing
- shared materials
- object pooling
- refs
- LOD
- frustum culling
- controlled effects
- lazy loading

**71\. DEVICE TIERS**

Orbit should classify runtime capability approximately as:

**Tier A — Full**

Desktop / capable GPU.

**Tier B — Balanced**

Typical laptop / modern tablet.

**Tier C — Constrained**

Mobile / integrated low-power hardware.

**Tier D — Fallback**

WebGL unavailable or unreliable.

The experience should remain recognizable across all tiers.

**72\. ADAPTIVE QUALITY**

Quality may adapt through:

- particle count
- shadow quality
- post-processing
- bloom intensity
- environment complexity
- LOD
- animation detail

Do not adapt away core interaction semantics.

A lower-tier device still gets Orbit.

It simply receives a lighter rendering expression.

**73\. MEMORY MANAGEMENT**

Transient visual effects must have explicit lifetimes.

Every effect must have:

create

activate

update

deactivate

dispose

No particle or temporary object may remain indefinitely because a choreography was interrupted.

**74\. CHOREOGRAPHY CLEANUP**

When a choreography ends or is cancelled:

- animation handles released
- temporary objects removed
- audio handles released
- event listeners removed
- timers cancelled
- references cleared

Interrupted animation must be treated as a normal lifecycle path.

**75\. COMPONENT ARCHITECTURE**

Recommended frontend structure:

src/

├── app/

│ ├── App.tsx

│ ├── routes/

│ └── providers/

│

├── domain/

│ ├── task/

│ ├── recurrence/

│ ├── lifecycle/

│ └── validation/

│

├── experience/

│ ├── scene/

│ ├── camera/

│ ├── interaction/

│ ├── choreography/

│ ├── audio/

│ └── effects/

│

├── ui/

│ ├── panels/

│ ├── forms/

│ ├── menus/

│ ├── overlays/

│ └── accessibility/

│

├── state/

│ ├── localStore/

│ ├── sync/

│ ├── preferences/

│ └── session/

│

├── infrastructure/

│ ├── api/

│ ├── auth/

│ ├── persistence/

│ ├── realtime/

│ └── serviceWorker/

│

├── shared/

│ ├── types/

│ ├── constants/

│ ├── utilities/

│ └── contracts/

│

└── tests/

**76\. BACKEND STRUCTURE**

backend/

├── app/

│ ├── main.py

│ ├── api/

│ ├── auth/

│ ├── domain/

│ │ ├── tasks/

│ │ ├── recurrence/

│ │ └── lifecycle/

│ ├── services/

│ ├── repositories/

│ ├── models/

│ ├── schemas/

│ ├── infrastructure/

│ ├── jobs/

│ └── observability/

│

├── migrations/

├── tests/

├── Dockerfile

└── pyproject.toml

**77\. DOMAIN / INFRASTRUCTURE RULE**

Domain logic must not directly import:

- FastAPI request objects
- SQLAlchemy session details
- React
- Three.js
- browser APIs

Infrastructure adapts external systems to domain contracts.

**78\. API CONTRACT**

Canonical API:

GET /api/v1/health

GET /api/v1/tasks

POST /api/v1/tasks

GET /api/v1/tasks/{id}

PATCH /api/v1/tasks/{id}

POST /api/v1/tasks/{id}/complete

POST /api/v1/tasks/{id}/restore

DELETE /api/v1/tasks/{id}

GET /api/v1/events

GET /api/v1/export

POST /api/v1/import

Every protected endpoint requires authenticated authorization.

**79\. API RESPONSE MODEL**

Successful responses should be predictable.

Errors should use one structure:

{

"error": {

"code": "VALIDATION_ERROR",

"message": "Title must be between 1 and 200 characters.",

"request_id": "01..."

}

}

The client should branch on stable error codes, not human-readable message strings.

**80\. HTTP SEMANTICS**

Use HTTP semantics consistently.

GET read

POST command/create

PATCH partial update

DELETE removal/archive command

The API should not create hidden side effects unrelated to the endpoint's documented purpose.

**81\. TRANSACTION RULE**

Any operation that changes multiple durable records must be atomic.

Examples:

**Recurring completion**

task update

-

new recurrence

-

events

**Import**

all task changes

-

associated metadata

Either the complete operation succeeds or none of it does.

**82\. DATABASE INDEXING**

Indexes must exist because a query pattern requires them.

Expected patterns:

- active tasks by owner
- tasks by ring
- tasks by status
- tasks by due time
- task by primary key
- events by owner/time

Do not create speculative indexes without evidence.

**83\. DATA RETENTION**

Default model:

| **Data**            | **Policy**                                 |
| ------------------- | ------------------------------------------ |
| Active tasks        | Retain                                     |
| Archived tasks      | Retain                                     |
| Completed tasks     | Retain according to product archive policy |
| Task events         | Time-limited retention                     |
| Idempotency records | Short retention                            |
| Operational logs    | Limited retention                          |
| Backups             | Rolling retention                          |

No user-created task should disappear merely because a visual representation faded.

**84\. AURORA ARCHITECTURE**

Aurora is a **derived visualization**.

It represents completed work.

It is not a second task database.

completed task

↓

completedAt

↓

Aurora projection

↓

7-day visual horizon

↓

fade

The fading visual must never delete the underlying task.

**85\. ARCHIVE ARCHITECTURE**

Archive is durable lifecycle state.

Aurora disappearance is visual.

These are different concepts.

Aurora fade ≠ task deletion

A task can disappear visually from Aurora while remaining archived permanently.

**86\. SPATIAL MEMORY**

Spatial properties are persistent only where product behavior requires them.

Current spatial memory:

orbitAngle

orbitRadius

Spatial memory must remain subordinate to usability.

The system must be able to re-layout tasks if necessary without corrupting task identity.

**87\. DETERMINISTIC LAYOUT**

When a task lacks spatial memory:

task identity

-

ring

-

existing spatial occupancy

-

stable layout seed

should produce a repeatable initial position.

Randomness must not cause tasks to jump unpredictably between sessions.

**88\. RANDOMNESS RULE**

Randomness is allowed for:

- particle variation
- subtle ambient motion
- non-semantic visual noise

Randomness is not allowed for:

- task identity
- task lifecycle
- business logic
- persistence
- synchronization
- reproducible spatial placement

**89\. CONFIGURATION ARCHITECTURE**

Configuration is divided into:

**Build-time**

- API URL
- public Supabase configuration
- feature flags

**Runtime**

- quality tier
- reduced motion
- audio enabled
- UI preferences

**Server secret configuration**

- database credentials
- service role keys
- JWT verification secrets

Secrets never cross into the public bundle.

**90\. FEATURE FLAGS**

Feature flags should be used sparingly.

Appropriate:

- experimental renderer
- new choreography
- fallback implementation
- migration compatibility

Inappropriate:

- permanent architecture hidden behind dozens of flags

Once a feature is stable, remove the flag.

**91\. FAILURE ISOLATION**

Subsystem failures should remain localized.

**Audio fails**

Tasks still work.

**WebGL fails**

2D fallback works.

**Realtime fails**

API polling works.

**API fails**

Local-first mode works.

**Database fails**

Local work queues.

**Camera fails**

Task semantic UI remains available.

No decorative subsystem may become a single point of failure for core task management.

**92\. GRACEFUL DEGRADATION MATRIX**

| **Failure**           | **Primary Experience** | **Fallback**          |
| --------------------- | ---------------------- | --------------------- |
| Audio unavailable     | 3D silent              | Full task interaction |
| Realtime unavailable  | Local + API            | Polling               |
| API unavailable       | Local-first            | Queue                 |
| Database unavailable  | Local-first            | Queue                 |
| WebGL unavailable     | 2D                     | Semantic interface    |
| GPU context lost      | Recovery               | 2D                    |
| Reduced motion        | Simplified world       | Full semantics        |
| Low performance       | Reduced visual quality | Full functionality    |
| Auth expired          | Existing session       | Refresh/login         |
| IndexedDB unavailable | Memory state           | Session-only warning  |

**93\. TESTING STRATEGY**

Testing is divided into:

Unit

Integration

Contract

Domain

Persistence

Synchronization

Rendering

Interaction

Accessibility

Performance

End-to-end

Recovery

**94\. DOMAIN TESTS**

Test:

- state transitions
- recurrence
- validation
- archive
- restore
- completion
- idempotency
- conflict resolution

These tests must not require a browser.

**95\. SYNC TESTS**

Test:

- offline creation
- offline editing
- reconnect
- duplicate request
- server rejection
- conflict
- stale realtime event
- out-of-order realtime event
- queue replay
- partial network failure

**96\. CHOREOGRAPHY TESTS**

Test:

- correct sequence
- cancellation
- interruption
- reduced motion
- cleanup
- simultaneous audio cue
- multiple completion attempts
- duplicate trigger prevention

**97\. VISUAL REGRESSION**

Important visual states should have deterministic snapshots or reference scenes where practical.

Examples:

- initial world
- one task
- many tasks
- selected task
- completion
- Aurora
- mobile
- reduced motion
- fallback mode

Visual tests should validate intent, not merely pixel identity.

**98\. ACCESSIBILITY TESTS**

Validate:

- keyboard navigation
- focus visibility
- semantic task representation
- screen reader labels
- completion without drag
- editing without 3D
- reduced motion
- sufficient contrast
- touch target sizing
- focus restoration

**99\. PERFORMANCE TESTS**

Performance budgets should be checked before release.

Monitor:

- FPS
- frame time
- JS execution
- memory
- draw calls
- triangles
- particle count
- initial load
- interaction latency

**100\. END-TO-END TEST**

The most important automated journey:

open Orbit

↓

authenticate

↓

load world

↓

create task

↓

edit task

↓

move / interact

↓

complete task

↓

verify Aurora

↓

restore task

↓

archive task

↓

reload

↓

verify persistence

**101\. RECOVERY TEST**

At least periodically:

create known test dataset

↓

export

↓

destroy test environment/state

↓

import

↓

verify

Recovery is a product capability, not merely an infrastructure task.

**102\. DEPLOYMENT PIPELINE**

commit

↓

lint

↓

typecheck

↓

unit tests

↓

integration tests

↓

build

↓

artifact validation

↓

preview deployment

↓

smoke tests

↓

production deployment

↓

health check

Backend additionally:

migration validation

↓

migration

↓

health check

**103\. DEPLOYMENT SAFETY**

Production deployment must not proceed if:

- build fails
- typecheck fails
- critical tests fail
- migration is invalid
- health endpoint fails
- required configuration is missing

**104\. ROLLBACK**

Rollback must be possible independently for:

**Frontend**

Previous static deployment.

**Backend**

Previous container image.

**Database**

Migration rollback where safe or restore procedure.

Frontend and backend versions should remain compatible during deployment transitions.

**105\. COMPATIBILITY WINDOW**

When introducing an API change:

old frontend

-

new backend

must remain safe for the deployment window whenever practical.

Avoid requiring frontend and backend to update simultaneously unless the change is intentionally versioned.

**106\. DEVELOPMENT ENVIRONMENTS**

**Local**

Used for development.

**Preview**

Used for visual and integration validation.

**Production**

Contains real owner data.

Destructive testing must never use production data.

**107\. TEST DATA**

Use unmistakable test identifiers:

\[TEST\]

Never rely on memory to distinguish test data from real tasks.

**108\. OPERATIONAL RUNBOOK**

The owner should be able to answer:

**"Is the backend alive?"**

Check:

/api/v1/health

**"Are tasks synchronized?"**

Check:

- pending queue
- API response
- realtime status

**"Is the database healthy?"**

Check database connection and service status.

**"Did the backup run?"**

Check backup record.

**"Can I recover?"**

Perform import/export verification.

**109\. MAINTENANCE PHILOSOPHY**

Orbit should require maintenance only when maintenance has value.

Avoid:

- unnecessary dependencies
- unnecessary services
- unnecessary dashboards
- unnecessary telemetry
- unnecessary background jobs
- unnecessary abstractions

Every dependency should answer:

"What does this save us that we could not reasonably maintain ourselves?"

**110\. DEPENDENCY POLICY**

A dependency should have:

- clear purpose
- maintained upstream
- acceptable bundle/runtime cost
- acceptable security profile
- replaceability

Do not add a package simply because it makes a small task convenient.

**111\. LONGEVITY ARCHITECTURE**

Orbit should remain portable if:

- Vercel disappears
- Fly.io disappears
- Supabase disappears
- Three.js changes
- React changes
- browser APIs evolve

The core portable assets are:

source code

database schema

migration history

export format

Dockerfile

documentation

**112\. PROVIDER ABSTRACTION**

Do not abstract every provider.

Abstract only where replacement is realistically expected.

Good candidates:

Database repository

Authentication adapter

Realtime adapter

Storage adapter

Email/auth delivery adapter

Bad candidates:

Generic universal hosting abstraction

Generic universal UI framework

Generic universal renderer abstraction

Avoid architecture for hypothetical futures.

**113\. DATA PORTABILITY**

The owner must never become permanently dependent on a SaaS provider to understand their own data.

Export must remain:

- documented
- structured
- portable
- human-inspectable
- versioned

**114\. ARCHITECTURAL ANTI-PATTERNS**

The following are prohibited.

**Direct frontend database mutation**

No.

**Business logic inside React components**

No.

**Animation determines task truth**

No.

**Backend controls visual timing**

No.

**Multiple camera controllers**

No.

**Multiple competing animation systems**

No.

**Server round-trip required before local interaction**

No.

**Silent data loss**

No.

**Hardcoded production secrets**

No.

**User ID trusted from request body**

No.

**Unbounded particle creation**

No.

**Production logging of private task content**

No.

**Third-party analytics without explicit architectural approval**

No.

**A dashboard replacing the world**

No.

**115\. THE "NO MAGIC" RULE**

Important behavior must have an identifiable owner.

If a task disappears, there must be a reason.

If a task moves, there must be a reason.

If a sound plays, there must be a reason.

If a camera moves, there must be a reason.

If data changes, there must be a reason.

Hidden side effects are architectural debt.

**116\. THE "ONE OWNER" RULE**

Every major state category has one owner.

Examples:

Task truth → Domain/API

Local task projection → Local Store

Camera → Camera Controller

Animation → Choreography Engine

Audio → Audio Engine

Rendering → Scene Runtime

Persistence queue → Sync Layer

Database → PostgreSQL

Authentication → Auth provider

If two systems appear to own the same state, the boundary is wrong.

**117\. THE "ONE WAY IN" RULE**

User intent enters the system through defined interaction pathways.

Input

↓

Intent

↓

Domain / local mutation

↓

Persistence

↓

Projection

Avoid arbitrary mutation of state from unrelated components.

**118\. THE "ONE WAY OUT" RULE**

Canonical state flows toward presentation:

Database

↓

API

↓

Sync

↓

Local Store

↓

Experience

↓

Renderer

The renderer does not invent canonical state.

**119\. EVENT ARCHITECTURE**

Use explicit semantic events.

Examples:

TASK_CREATED

TASK_SELECTED

TASK_EDITED

TASK_DRAG_STARTED

TASK_COMPLETION_APPROACHED

TASK_COMPLETED

TASK_RESTORED

TASK_ARCHIVED

SYNC_STARTED

SYNC_SUCCEEDED

SYNC_FAILED

OFFLINE_ENTERED

ONLINE_RESTORED

Events are useful for coordination.

They must not become a hidden second database.

**120\. EVENT VS COMMAND**

A **command** asks the system to do something.

CompleteTask(taskId)

An **event** states that something happened.

TaskCompleted(taskId)

The architecture must distinguish them.

**121\. COMMAND OWNERSHIP**

Commands should be processed by the appropriate owner.

Example:

CompleteTask

↓

Task Domain

↓

canonical state change

↓

TaskCompleted event

↓

Choreography / Audio / UI react

This avoids animation or UI components becoming accidental business controllers.

**122\. EVENT DELIVERY**

Experience events may be:

- synchronous
- queued
- frame-driven
- asynchronous

But domain events that affect durable state must be committed reliably.

**123\. TEMPORAL ARCHITECTURE**

Orbit has two notions of time:

**Domain time**

Real timestamps:

- createdAt
- dueAt
- completedAt
- archivedAt

**Experience time**

Animation time:

- 0.3 seconds
- 1.8 seconds
- transition duration
- easing

These must never be mixed.

**124\. CLOCK RULE**

Server timestamps are authoritative for durable events.

The client may use local time for:

- UI anticipation
- countdown presentation
- choreography
- temporary scheduling

but must reconcile with server time where correctness matters.

**125\. TIMEZONE RULE**

Persist canonical timestamps in UTC.

Convert to local presentation time only at the experience boundary.

Recurrence must use clearly defined calendar semantics.

**126\. TASK IDENTITY**

Task identity must survive:

- optimistic creation
- server reconciliation
- browser reload
- synchronization
- export/import
- recurrence

Client-generated UUIDs are permitted when they remain stable through reconciliation.

**127\. RECURRENCE IDENTITY**

A recurring child task is a new task.

It should retain lineage through metadata or event history.

Conceptually:

parent task

↓

completion

↓

child task

The child must not overwrite the parent's identity.

**128\. ARCHIVAL IDENTITY**

Archive is soft lifecycle state.

Hard deletion, if ever introduced, must be:

- explicit
- deliberate
- recoverability-aware
- separate from ordinary archive behavior

The default product model should prefer preservation.

**129\. USER EXPERIENCE / ARCHITECTURE BRIDGE**

Architecture must expose the information the UI/UX system needs without exposing implementation details.

Example:

UI needs:

task.status

task.priority

task.ring

task.dueAt

UI does not need:

SQLAlchemy session

JWT verification result

database connection

**130\. CHOREOGRAPHY / ARCHITECTURE BRIDGE**

Architecture provides:

semantic event

Choreography provides:

visual timeline

Example:

TaskCompleted

↓

completion choreography

↓

reach → grab → drag → release → dissolve → settle

This is the official bridge between system truth and experience.

**131\. UI / ARCHITECTURE BRIDGE**

The UI may request:

create task

edit task

complete task

restore task

archive task

focus task

It should not directly construct:

SQL

HTTP authentication headers

database mutations

**132\. ACCESSIBILITY / ARCHITECTURE BRIDGE**

Accessibility actions enter the same command pathways as 3D actions.

Therefore:

3D Complete

┐

├── CompleteTask

│

Semantic Complete

┘

Both produce the same canonical state.

**133\. RESPONSIVE ARCHITECTURE**

The architecture must not assume desktop dimensions.

The renderer should expose adaptive composition.

Desktop:

large world

wide orbital spacing

secondary UI

Mobile:

focused world

closer camera

larger targets

simplified effects

stronger semantic UI support

The domain remains identical.

Only presentation changes.

**134\. TOUCH ARCHITECTURE**

Touch must distinguish:

- tap
- long press
- drag
- camera gesture
- scrolling
- two-finger navigation

Task manipulation must not accidentally fight page scrolling or camera movement.

**135\. INPUT DEVICE ABSTRACTION**

All device-specific input must resolve into common intents.

mouse drag

touch drag

keyboard action

screen-reader action

↓

CompleteTask

The domain must not care how the intent originated.

**136\. SETTINGS ARCHITECTURE**

Preferences should include only settings that materially affect experience or operation.

Potential categories:

- audio
- reduced motion
- rendering quality
- accessibility
- interface preferences
- synchronization diagnostics
- export/import

Settings should not become a conventional configuration dashboard.

**137\. UI PANELS**

Panels are temporary support structures.

They should:

- open with purpose
- close predictably
- preserve world context
- avoid covering unnecessary world space
- maintain focus
- restore focus on close

**138\. MODAL RULE**

Use a modal only when:

- an action requires focused attention
- accidental continuation would be dangerous
- a complete context switch is necessary

Do not use modals for ordinary task operations that can happen naturally in-world.

**139\. NOTIFICATION ARCHITECTURE**

Notifications should be rare.

Preferred hierarchy:

visual state

↓

motion

↓

sound

↓

subtle toast

↓

blocking message

Do not reverse this hierarchy.

**140\. CONTENT ARCHITECTURE**

Task content is user-owned data.

The system should not:

- rewrite task meaning
- generate motivational language unnecessarily
- judge task difficulty
- shame incomplete work
- invent urgency

Orbit is an environment, not a motivational coach.

**141\. PERFORMANCE / EXPERIENCE CONTRACT**

Performance is not merely a technical metric.

If an interaction feels delayed, the experience has failed even if the backend response is technically correct.

Therefore:

**Perceived responsiveness is an architectural requirement.**

**142\. LATENCY HIDING**

Where safe:

user intent

↓

optimistic local change

↓

visual response

↓

network operation

Do not expose normal network latency as part of the interaction ritual.

**143\. SERVER LATENCY POLICY**

Server latency should affect:

- synchronization state

but should not unnecessarily affect:

- click feedback
- selection
- drag
- camera response
- immediate visual confirmation

**144\. DATA CORRECTNESS OVERRIDES VISUAL CONTINUITY**

There is one important exception.

If canonical server state rejects a local assumption, the system must eventually correct itself.

The correction should be:

- visually graceful
- understandable
- recoverable

but it must not preserve an incorrect state merely because it looks better.

**145\. ARCHITECTURAL TELEMETRY BOUNDARY**

No analytics should be required for Orbit to function.

Operational telemetry exists for:

- reliability
- security
- debugging
- recovery

It must not become behavioral surveillance.

**146\. BUILD ARTIFACTS**

A production release consists of:

frontend static bundle

service worker

backend container

database migrations

configuration manifest

version metadata

Every release must be traceable to a source commit.

**147\. RELEASE VERSION**

Every deployment should expose a version identifier.

Example:

Orbit 2.0.0

commit: abc123

schema: 17

This dramatically simplifies debugging.

**148\. HEALTH CONTRACT**

Health endpoint should distinguish:

application healthy

database healthy

dependencies healthy

Example conceptual response:

{

"status": "ok",

"version": "2.0.0",

"database": "ok",

"timestamp": "..."

}

Do not expose sensitive infrastructure details.

**149\. BACKGROUND JOB ARCHITECTURE**

Jobs must be:

- deterministic
- idempotent
- observable
- retryable

Typical jobs:

backup

archive

purge idempotency records

purge old events

database size check

maintenance

A job running twice must not corrupt data.

**150\. JOB FAILURE**

A failed job must:

1. log failure
2. preserve existing data
3. retry where appropriate
4. avoid duplicate effects
5. remain recoverable manually

**151\. BACKUP VALIDATION**

Backup completion should mean:

export created

-

checksum generated

-

storage upload succeeded

-

metadata recorded

Not merely:

cron ran

**152\. DISASTER RECOVERY**

Recovery sequence:

identify failure

↓

protect remaining data

↓

obtain verified backup

↓

restore infrastructure

↓

restore schema

↓

restore data

↓

verify invariants

↓

restart application

↓

reconcile clients

**153\. DATA INTEGRITY CHECKS**

Periodic integrity validation should verify:

- invalid statuses
- impossible timestamps
- orphaned recurrence relationships
- duplicate identity
- malformed events
- broken references
- impossible lifecycle combinations

**154\. ARCHITECTURAL HEALTH**

Orbit's architecture should periodically be reviewed against:

- unused dependencies
- unnecessary abstractions
- duplicated state
- undocumented behavior
- stale documentation
- broken migration assumptions
- provider lock-in
- security changes

**155\. CHANGE MANAGEMENT**

A change is classified as:

**Cosmetic**

Does not alter architecture.

**Behavioral**

Changes user experience.

**Domain**

Changes task semantics.

**Contract**

Changes subsystem communication.

**Data**

Changes schema or persistence.

**Architectural**

Changes ownership or system boundaries.

The larger the classification, the more documents must be updated.

**156\. ARCHITECTURAL DECISION RECORDS**

For major architectural decisions, record:

Decision

Context

Options considered

Chosen approach

Reason

Trade-offs

Consequences

Date

This prevents future-you from re-litigating decisions without context.

**157\. WHAT MUST REMAIN STABLE**

The following are architectural pillars:

1. Single-owner model
2. Local-first interaction
3. Durable server persistence
4. Clear plane boundaries
5. Explicit state ownership
6. Domain-driven lifecycle
7. Choreography separate from truth
8. Renderer separate from persistence
9. Recoverable data
10. Portable architecture
11. Privacy-first operation
12. Graceful degradation
13. Accessibility equivalence
14. Long-term maintainability

**158\. WHAT MAY CHANGE**

These may change without changing Orbit's identity:

- hosting provider
- database provider
- exact framework versions
- rendering optimizations
- audio implementation
- shader implementation
- CSS strategy
- deployment tooling
- specific libraries
- infrastructure topology

provided the architectural contracts remain intact.

**159\. WHAT MUST NOT CHANGE CASUALLY**

These require explicit architectural review:

- source-of-truth model
- task lifecycle
- synchronization model
- data ownership
- authentication boundary
- database schema semantics
- completion semantics
- accessibility equivalence
- offline guarantees
- recovery guarantees

**160\. THE MASTER DATA FLOW**

The complete normal flow is:

HUMAN INTENT

│

▼

INPUT ABSTRACTION

│

▼

INTERACTION SYSTEM

│

▼

COMMAND / INTENT

│

┌───────────┴───────────┐

▼ ▼

LOCAL DOMAIN CHOREOGRAPHY

│ │

▼ ▼

LOCAL STORE EXPERIENCE

│

▼

INDEXEDDB STATE

│

▼

SYNC QUEUE

│

▼

API SERVICE

│

▼

DOMAIN SERVICE

│

▼

TRANSACTION

│

┌─────┴─────┐

▼ ▼

POSTGRES EVENTS

│

▼

REALTIME

│

▼

OTHER CLIENTS

│

▼

RECONCILIATION

│

▼

SCENE

**161\. THE MASTER COMPLETION FLOW**

Task selected

↓

Owner begins drag

↓

Interaction controller owns gesture

↓

Completion zone detected

↓

Visual attraction begins

↓

Owner releases

↓

CompleteTask command

↓

Local task → completed

↓

Completion choreography

↓

Audio synchronization

↓

Task enters Aurora

↓

Mutation queue

↓

API

↓

Domain completion

↓

Recurrence transaction if required

↓

Canonical response

↓

Local reconciliation

↓

World settles

**162\. THE MASTER FAILURE FLOW**

Failure detected

↓

Classify failure

↓

Can local operation continue?

│

┌──┴──┐

YES NO

│ │

▼ ▼

Continue Fallback

│ │

▼ ▼

Queue Semantic UI

│ │

└──┬───┘

▼

Recovery detected

↓

Replay / reconcile

↓

Verify canonical state

↓

Return to normal

**163\. THE MASTER OWNERSHIP MAP**

| **Concern**           | **Sole Owner**                   |
| --------------------- | -------------------------------- |
| Task truth            | Domain/API                       |
| Durable persistence   | PostgreSQL                       |
| Local task projection | Local Store                      |
| Offline queue         | Sync Layer                       |
| Server reconciliation | Sync Layer                       |
| Task lifecycle        | Domain Layer                     |
| Recurrence            | Domain Layer                     |
| Rendering             | Scene Runtime                    |
| Camera                | Camera Controller                |
| Animation             | Choreography Engine              |
| Sound                 | Audio Engine                     |
| User input            | Interaction Controller           |
| Accessibility         | Semantic UI Layer                |
| Authentication        | Auth provider + API verification |
| Realtime transport    | Realtime Adapter                 |
| Backups               | Operations layer                 |
| Deployment            | Infrastructure                   |

**164\. DEFINITION OF ARCHITECTURAL DONE**

The architecture is considered implemented when:

**Product**

- All PRD-critical behaviors have an architectural owner.
- All major UI experiences have a state source.
- Completion is represented as a domain operation.
- Orbit's three feelings remain preserved.

**Data**

- Tasks persist correctly.
- Lifecycle invariants are enforced.
- Recurrence is transactional.
- Export/import works.
- Backups work.
- Restore has been tested.

**Synchronization**

- Offline creation works.
- Offline editing works.
- Queue survives reload.
- Retry is idempotent.
- Realtime failure has a fallback.
- Conflicts are deterministic.

**Experience**

- Rendering is independent of network latency.
- Choreography is independent of domain truth.
- Camera ownership is singular.
- Audio is synchronized.
- Reduced motion works.
- Semantic fallback works.

**Security**

- Authentication is real.
- Authorization is server-enforced.
- Secrets remain private.
- RLS is active.
- Logs contain no task content.

**Reliability**

- WebGL fallback exists.
- Offline mode exists.
- API failure is recoverable.
- Database failure is recoverable.
- Backup restoration has been tested.

**Maintainability**

- Documentation matches implementation.
- Migrations are tracked.
- Dependencies are intentional.
- Deployment is reproducible.
- A future developer can understand the architecture.

**165\. FINAL ARCHITECTURAL LAWS**

These are the laws of Orbit.

**Law 1 — Experience First**

The owner should feel the result immediately.

**Law 2 — Data First**

The owner's work must remain durable.

**Law 3 — One Truth**

Canonical domain state has one authority.

**Law 4 — One Owner Per State**

No two systems independently own the same state.

**Law 5 — Animation Is Not Truth**

Animation expresses state; it does not define it.

**Law 6 — Network Is Not the Experience**

Network latency must not unnecessarily interrupt local interaction.

**Law 7 — Failure Must Degrade Gracefully**

A subsystem failure should not destroy unrelated capabilities.

**Law 8 — Privacy Is Structural**

Privacy cannot depend solely on UI promises.

**Law 9 — Accessibility Is Architectural**

Every important operation must have a semantic pathway.

**Law 10 — Recovery Is a Feature**

Backup and restore are part of the product's trust model.

**Law 11 — Complexity Must Earn Its Place**

Every abstraction must justify itself.

**Law 12 — Portability Matters**

The owner's data must remain understandable outside the current provider.

**Law 13 — Documentation Is Part of the System**

Undocumented architecture eventually becomes accidental architecture.

**Law 14 — No Silent Mutation**

Important state changes must have an identifiable cause.

**Law 15 — No Hidden Ownership**

Every important behavior has one clearly responsible subsystem.

**166\. THE FINAL ORBIT ARCHITECTURE**

At the highest level, Orbit is not fundamentally a:

- task database
- 3D renderer
- React application
- FastAPI application
- productivity dashboard
- synchronization service

It is a **coordinated system of state, space, time, and interaction**.

The durable task system provides truth.

The local store provides immediacy.

The synchronization layer provides continuity.

The API provides authority.

The database provides durability.

The renderer provides space.

The interaction system provides agency.

The choreography engine provides time.

The audio engine provides sensory reinforcement.

The accessibility layer provides equivalent access.

The infrastructure provides survival.

Together:

┌───────────────────┐

│ TRUTH │

│ Domain + Database │

└─────────┬─────────┘

│

▼

┌───────────────────┐

│ CONTINUITY │

│ Local + Sync │

└─────────┬─────────┘

│

▼

┌───────────────────┐

│ SPACE │

│ Scene + Camera │

└─────────┬─────────┘

│

▼

┌───────────────────┐

│ TIME │

│ Choreography │

└─────────┬─────────┘

│

▼

┌───────────────────┐

│ AGENCY │

│ Interaction │

└─────────┬─────────┘

│

▼

┌───────────────────┐

│ MEANING │

│ Arrival │

│ Control │

│ Release │

└───────────────────┘

**167\. FINAL SYSTEM CONTRACT**

Orbit is complete architecturally when the following statement is true:

A single owner can enter the application, immediately see a persistent spatial representation of their work, create and manipulate tasks without waiting for the network, experience meaningful visual and auditory feedback, complete work through a physical interaction, continue working during temporary infrastructure failure, synchronize safely when connectivity returns, recover their data from backup if necessary, access the same task semantics without relying on 3D interaction, and leave the system without ever having to understand the machinery underneath it.

The machinery exists.

The owner should simply experience Orbit.

**168\. FINAL DOCUMENT RELATIONSHIP**

The five documents now form one coherent specification:

ORBIT

│

┌───────┴───────┐

│ │

WHY WHAT

│ │

PRD TRD

│ │

└───────┬───────┘

│

SYSTEM CORE

│

SYSTEM ARCHITECTURE

│

┌───────────┴───────────┐

│ │

UI/UX CHOREOGRAPHY

│ │

HOW IT WHEN IT

FEELS HAPPENS

│ │

└───────────┬───────────┘

│

▼

IMPLEMENTATION

The documents are therefore complementary rather than competing.

**169\. FINAL SIGN-OFF**

This document is the **architectural backbone of Orbit**.

It exists to ensure that the extraordinary experience described by the product and UI/UX specifications can be implemented without sacrificing:

- correctness
- durability
- privacy
- accessibility
- performance
- recoverability
- maintainability
- simplicity

The system should remain understandable by one person.

The data should remain owned by one person.

The experience should remain centered around one person.

The architecture should remain replaceable beneath that experience.

And above all:

**The infrastructure must serve the experience, never the other way around.**

Orbit's architecture exists to make three feelings possible:

**Arrival.**

**Control.**

**Release.**

**END OF SYSTEM ARCHITECTURE**

**Complete Orbit Specification Set**

1. **PRD.md** — Product vision, purpose, scope, and requirements.
2. **TRD.md** — Technical requirements, technology, implementation constraints, and engineering standards.
3. **UI-UX.md** — Visual language, interaction design, sensory behavior, accessibility, and interface rules.
4. **CHOREOGRAPHY.md** — Timelines, motion sequences, synchronization, and experiential timing.
5. **SYSTEM-ARCHITECTURE.md** — The master blueprint connecting all systems, state, data, interaction, infrastructure, recovery, and long-term operation.

Together these documents form the complete architectural specification of Orbit.

**The next phase is implementation.**