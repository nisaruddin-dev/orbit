ORBIT
Ultimate Technical Requirements Document
Project: Orbit — A Personal Immersive 3D To-Do Environment
Document Type: Technical Requirements Document (TRD)
Document Version: 2.0 — Ultimate Master Specification
Status: Engineering Master Specification
Product Authority: Orbit PRD v2.0
Primary User: Single owner
Primary Platform: Web / PWA
Architecture Style: Local-first immersive client + authenticated backend + persistent relational data
Deployment Goal: Sustainable low-cost personal deployment
Language: TypeScript frontend + Python backend
Last Updated: 2026
________________________________________
0. DOCUMENT PURPOSE
This document defines the technical system required to implement Orbit according to the product vision established in the Orbit PRD.
The PRD answers:
What is Orbit supposed to be?
This TRD answers:
How must Orbit be engineered so that it actually becomes that thing?
The TRD therefore must never contradict the PRD.
Where a technical decision conflicts with the intended experience, the technical implementation must be reconsidered.
Where the PRD leaves implementation details open, this document establishes a practical engineering baseline.
________________________________________
1. SOURCE OF TRUTH HIERARCHY
When requirements conflict, use this hierarchy:
1.	Core product principles
2.	Orbit PRD
3.	This TRD
4.	UI/UX specification
5.	Choreography specification
6.	Implementation details
7.	Library-specific conveniences
A library, framework, architecture pattern, or implementation shortcut must never override the product experience.
________________________________________
2. CORE TECHNICAL OBJECTIVE
Orbit must be engineered as:
A persistent, local-first spatial environment in which task state, visual state, physical interaction, and temporal state remain synchronized without making the user think about the underlying machinery.
The technical architecture must therefore preserve five properties:
2.1 Spatial persistence
A task remembers where it belongs.
2.2 Immediate interaction
User actions feel local and instantaneous.
2.3 Reliable persistence
Important data survives reloads, crashes, offline periods, and device changes.
2.4 Deterministic synchronization
Multiple open devices converge on the same state.
2.5 Visual continuity
Data changes should enter the world through animation rather than appearing as abrupt database updates.
________________________________________
3. ARCHITECTURAL PHILOSOPHY
Orbit should use a local-first architecture.
The local application is the user's immediate reality.
The server is the persistence and synchronization authority.
The rendering system is a projection of application state.
Conceptually:
                    ┌──────────────────────────┐
                    │       Orbit Server       │
                    │                          │
                    │ Auth                     │
                    │ API                      │
                    │ PostgreSQL               │
                    │ Realtime                 │
                    └────────────┬─────────────┘
                                 │
                         sync / mutations
                                 │
                    ┌────────────▼─────────────┐
                    │     Local Application    │
                    │                          │
                    │ IndexedDB                │
                    │ Local mutation queue      │
                    │ Zustand scene state       │
                    │ TanStack Query cache      │
                    └────────────┬─────────────┘
                                 │
                       derived render state
                                 │
                    ┌────────────▼─────────────┐
                    │      Orbit World         │
                    │                          │
                    │ Three.js / R3F            │
                    │ Camera                   │
                    │ Nodes                    │
                    │ Rings                    │
                    │ Particles                │
                    │ Choreography             │
                    │ Audio                    │
                    └──────────────────────────┘
The renderer must never become the database.
The database must never dictate animation.
The UI must never directly mutate server data without passing through the application state/mutation layer.
________________________________________
4. NON-NEGOTIABLE ENGINEERING PRINCIPLES
T-001 — Local-first interaction
A user action must first update the local state.
Do not make a drag wait for an HTTP response.
________________________________________
T-002 — Server persistence
Every durable mutation must eventually reach the backend.
________________________________________
T-003 — Deterministic synchronization
The same set of operations must produce the same final state.
________________________________________
T-004 — No silent data loss
No expected failure may silently discard user-created data.
________________________________________
T-005 — Rendering is derived state
The 3D scene reflects application state.
It does not own the canonical task data.
________________________________________
T-006 — Choreography is separate from persistence
An animation can be running while the underlying task state has already been committed.
The visual timeline and data lifecycle must therefore be decoupled.
________________________________________
T-007 — Reversible destructive actions
Completion and archive operations must support short-window recovery.
________________________________________
T-008 — Progressive degradation
If:
•	WebGL performance is poor,
•	motion is reduced,
•	audio is unavailable,
•	network connectivity disappears,
Orbit should degrade gracefully instead of becoming unusable.
________________________________________
T-009 — Minimal infrastructure
Do not introduce infrastructure simply because it is fashionable.
Every service must justify its maintenance cost.
________________________________________
T-010 — No technical feature creep
No backend service, database table, analytics pipeline, or framework dependency should exist without a concrete purpose.
________________________________________
5. SYSTEM ARCHITECTURE
5.1 Major Components
Orbit consists of:
Client
•	React
•	TypeScript
•	Vite
•	React Three Fiber
•	Three.js
•	Zustand
•	TanStack Query
•	IndexedDB
•	PWA service worker
•	Web Audio
•	accessibility layer
API
•	FastAPI
•	Pydantic
•	authentication middleware
•	task service
•	synchronization service
•	export/import service
Database
•	PostgreSQL
•	Supabase Auth
•	Supabase Realtime where useful
Infrastructure
•	static frontend hosting
•	lightweight Python backend
•	managed PostgreSQL
________________________________________
6. FRONTEND TECHNOLOGY STACK
Layer	Technology	Technical Role
Language	TypeScript	Application language
UI	React	Application composition
Build	Vite	Development/build pipeline
3D	Three.js	Rendering engine
3D React integration	React Three Fiber	Declarative scene composition
3D helpers	Drei	Common R3F utilities
State	Zustand	Local application/scene state
Server state	TanStack Query	Fetching/cache/mutation lifecycle
Local persistence	IndexedDB	Offline durable cache
3D text	Troika	SDF text rendering
Audio	Web Audio API / Howler where useful	Ambient and interaction sound
Styling	CSS / Tailwind where useful	Minimal 2D surfaces
PWA	Vite-compatible PWA tooling	Install/offline shell
Important architectural rule
Do not use both Framer Motion and React Spring simply because both are available.
Use:
•	a 3D-compatible animation system for 3D state,
•	a DOM animation system only where genuine 2D UI requires it.
Avoid unnecessary animation-library duplication.
________________________________________
7. BACKEND TECHNOLOGY STACK
Layer	Technology
Language	Python
Framework	FastAPI
Validation	Pydantic
ORM	SQLAlchemy
Migrations	Alembic
Authentication	Supabase Auth
Database	PostgreSQL
Realtime	Supabase Realtime / equivalent
API protocol	HTTPS JSON
Serialization	JSON
The exact runtime patch versions should be pinned in the project lock/configuration files rather than permanently hardcoded in this document.
________________________________________
8. AUTHENTICATION ARCHITECTURE
T-100
Orbit must use real authentication.
A hardcoded frontend passphrase is explicitly rejected as a production authentication mechanism.
Preferred flow
User
 ↓
Supabase Auth
 ↓
Authenticated session
 ↓
JWT
 ↓
Orbit frontend
 ↓
FastAPI
 ↓
JWT verification
 ↓
User identity
 ↓
Authorized database operation
________________________________________
T-101 — Authentication requirements
The system must:
•	authenticate the owner,
•	maintain session state,
•	refresh tokens securely,
•	reject expired/invalid tokens,
•	associate all task data with the authenticated owner ID.
________________________________________
T-102 — Frontend security
The frontend may contain public configuration such as:
•	Supabase project URL,
•	public client key.
It must never contain:
•	database passwords,
•	service-role keys,
•	backend secrets,
•	signing secrets,
•	private API credentials.
________________________________________
9. BACKEND AUTHORIZATION
Every request must resolve the authenticated user identity from the verified token.
The client must never be trusted to specify an arbitrary owner ID.
Bad:
PATCH /tasks/123
body: { user_id: "some-other-user" }
Good:
PATCH /tasks/123
Authorization: Bearer <verified-token>
The backend derives the user from authentication.
________________________________________
10. DATABASE AUTHORIZATION
All persistent task data must be protected using database-level authorization policies where supported.
At minimum:
authenticated user
        ↓
owns task
        ↓
can read/write task
The application must not rely exclusively on frontend filtering.
________________________________________
11. DATABASE MODEL
The task model must support the complete PRD state.
11.1 Tasks
create table tasks (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    title text not null
        check (char_length(title) between 1 and 200),

    notes text not null default '',

    ring text not null
        check (ring in ('today', 'week', 'someday')),

    priority smallint not null default 1
        check (priority between 0 and 3),

    status text not null default 'idle'
        check (
            status in (
                'idle',
                'in_progress',
                'completed',
                'archived'
            )
        ),

    due_at timestamptz,

    recurrence_type text
        check (
            recurrence_type is null
            or recurrence_type in (
                'daily',
                'weekly',
                'monthly'
            )
        ),

    recurrence_interval integer
        check (
            recurrence_interval is null
            or recurrence_interval >= 1
        ),

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now(),

    completed_at timestamptz,

    archived_at timestamptz,

    orbit_angle double precision,

    orbit_radius double precision,

    orbit_height double precision,

    version bigint not null default 1
);
________________________________________
12. WHY THE DATA MODEL IS DIFFERENT FROM THE VISUAL MODEL
The database must not store arbitrary rendering details.
For example:
"glowIntensity"
"particleColor"
"cameraScale"
should not normally become database fields.
Those values belong to rendering logic.
The database stores semantic state.
The renderer derives visual state from it.
Example:
priority = 3
        ↓
visual system
        ↓
higher attention motion
+ stronger accent
+ appropriate ring behavior
This keeps the data model stable even if the visual design changes.
________________________________________
13. TASK EVENT MODEL
Orbit requires reliable synchronization.
A lightweight mutation/event record should therefore be supported.
create table task_events (
    id bigserial primary key,

    task_id uuid not null
        references tasks(id)
        on delete cascade,

    user_id uuid not null,

    mutation_id uuid not null unique,

    event_type text not null,

    payload jsonb not null,

    created_at timestamptz not null default now()
);

create index task_events_user_created_idx
on task_events (user_id, created_at desc);
mutation_id provides idempotency.
If a request is retried, the server must not accidentally apply the same logical mutation twice.
________________________________________
14. SPATIAL DATA MODEL
Each task must preserve:
orbit
angle
radius
height
Conceptually:
type SpatialPosition = {
    ring: "today" | "week" | "someday";
    angle: number;
    radius: number;
    height: number;
};
The renderer converts this to world coordinates.
Example:
x = cos(angle) × radius
z = sin(angle) × radius
y = height
The exact coordinate system may differ, but the semantic representation must remain stable.
________________________________________
15. SPATIAL PLACEMENT SYSTEM
When a task has no stored location:
1.	determine its ring,
2.	inspect existing positions,
3.	find an appropriate angular gap,
4.	assign an angle,
5.	assign ring radius,
6.	persist the result.
The algorithm should avoid placing multiple tasks directly on top of each other.
The same task must not randomly relocate every session.
________________________________________
16. TASK STATE MACHINE
Task lifecycle:
                 ┌──────────────┐
                 │    IDLE      │
                 └──────┬───────┘
                        │
              user interaction
                        │
                        ▼
                 ┌──────────────┐
                 │ IN_PROGRESS  │
                 └──────┬───────┘
                        │
                  complete
                        │
                        ▼
                 ┌──────────────┐
                 │  COMPLETING  │
                 └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │  COMPLETED   │
                 └──────────────┘

IDLE ───────────────► ARCHIVED
          archive

ARCHIVED ───────────► IDLE
          restore
Visual states such as:
•	hovered,
•	focused,
should remain interaction states, not persistent database states.
This prevents the database from being polluted with transient rendering information.
________________________________________
17. CLIENT STATE ARCHITECTURE
Separate state into distinct responsibilities.
17.1 Server state
Owned by:
TanStack Query
Contains:
•	fetched tasks,
•	remote data,
•	mutation state,
•	cache state.
________________________________________
17.2 Scene state
Owned by:
Zustand
Contains:
•	active camera mode,
•	selected task,
•	focused task,
•	current interaction,
•	completion zone visibility,
•	audio preference,
•	reduced-motion state,
•	UI mode.
________________________________________
17.3 Persistent local state
Owned by:
IndexedDB
Contains:
•	last known task snapshot,
•	pending mutations,
•	synchronization metadata.
________________________________________
17.4 Ephemeral render state
Owned by the rendering layer.
Examples:
•	interpolation progress,
•	particle positions,
•	animation progress,
•	shader values,
•	temporary velocity.
This state must not be persisted.
________________________________________
18. DATA FLOW
Normal mutation:
User action
   ↓
Interaction controller
   ↓
Local mutation
   ↓
Zustand / Query cache update
   ↓
3D scene reacts immediately
   ↓
Mutation enters local queue
   ↓
API request
   ↓
Server validates
   ↓
Database transaction
   ↓
Realtime event
   ↓
Other devices update
________________________________________
19. OPTIMISTIC MUTATIONS
Every major interactive mutation should be optimistic.
Examples:
•	create,
•	move,
•	edit,
•	complete,
•	archive,
•	restore.
The UI must not wait for the server before showing the result.
________________________________________
20. MUTATION QUEUE
The offline queue should be stored durably in IndexedDB.
Conceptual model:
type PendingMutation = {
    mutationId: string;
    taskId?: string;
    type:
        | "create"
        | "update"
        | "complete"
        | "archive"
        | "restore";
    payload: unknown;
    createdAt: number;
    retryCount: number;
};
________________________________________
21. OFFLINE OPERATION
When offline:
1.	user performs action,
2.	local state updates,
3.	mutation is written to IndexedDB,
4.	scene behaves normally,
5.	mutation remains pending,
6.	network returns,
7.	queue flush begins,
8.	server acknowledges mutation,
9.	local mutation is marked synchronized.
The user should not need to understand any of this.
________________________________________
22. NETWORK FAILURE
If a request fails:
Temporary failure
Retry automatically.
Authentication failure
Refresh session.
Validation failure
Rollback the mutation and provide subtle feedback.
Conflict
Resolve deterministically.
Unknown server failure
Preserve local work and retry safely.
Never:
request failed → delete local state
________________________________________
23. CONFLICT RESOLUTION
Orbit is single-user, but it is still multi-device.
Example:
Laptop: edits task
Phone: edits same task
The system must not rely on "whichever request arrives last" without a defined rule.
Use a deterministic version strategy.
Recommended baseline:
task.version
+
mutation_id
+
server-side transaction ordering
A mutation that targets an outdated version should be:
•	merged where safe,
•	rejected and reconciled,
•	or resolved using the defined conflict policy.
________________________________________
24. REALTIME SYNCHRONIZATION
Realtime should communicate state changes, not animation commands.
Bad:
server → "play dissolve animation"
Good:
server → task status changed to completed
The local client then decides how that state transition should visually appear.
This ensures:
•	different devices remain consistent,
•	animations can be device-specific,
•	reduced-motion mode remains possible,
•	slow devices do not need server-controlled animation timing.
________________________________________
25. REMOTE TASK ARRIVAL
When another device creates a task:
realtime event
      ↓
cache update
      ↓
task enters scene
      ↓
derive spatial position
      ↓
soft materialization animation
      ↓
settle into orbit
The task must not simply pop into existence.
________________________________________
26. API DESIGN
The API should remain small.
Tasks
GET    /api/v1/tasks
POST   /api/v1/tasks
GET    /api/v1/tasks/{id}
PATCH  /api/v1/tasks/{id}

POST   /api/v1/tasks/{id}/complete
POST   /api/v1/tasks/{id}/restore
POST   /api/v1/tasks/{id}/archive
Data
GET    /api/v1/export
POST   /api/v1/import
Health
GET    /api/v1/health
________________________________________
27. API VERSIONING
All API endpoints should be versioned:
/api/v1/...
This makes future migration possible without immediately breaking the frontend.
________________________________________
28. API RESPONSE MODEL
Responses should use predictable envelopes where appropriate.
Example:
{
  "data": {
    "id": "..."
  }
}
Errors:
{
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Task could not be found.",
    "request_id": "..."
  }
}
Do not expose stack traces to the client.
________________________________________
29. IDEMPOTENCY
Mutating requests should carry a client-generated mutation ID.
Example:
Idempotency-Key: <uuid>
If the same mutation is retried:
first request → applied
second request → recognized as duplicate
This is particularly important for offline retry.
________________________________________
30. DATABASE TRANSACTIONS
The following operations must be atomic:
Complete task
update task status
+
completed timestamp
+
event record
+
recurrence generation if applicable
Archive task
update archive state
+
archive timestamp
+
event
Restore
restore task
+
clear appropriate archive/completion state
+
event
No partial mutation should leave the database in an inconsistent state.
________________________________________
31. RECURRENCE ENGINE
The recurrence engine must be deterministic.
For a task:
daily
weekly
monthly
completion creates the next occurrence according to the recurrence rule.
The system must prevent duplicate future tasks if:
•	the request retries,
•	the device reconnects,
•	realtime duplicates an event.
Use a deterministic recurrence identity or mutation transaction.
________________________________________
32. COMPLETION ARCHITECTURE
Completion is Orbit's most important technical interaction.
It must be treated as a coordinated system rather than one animation function.
Architecture:
CompletionController
│
├── Interaction
│   ├── grab
│   ├── drag
│   └── release
│
├── Visual
│   ├── completion zone
│   ├── node transformation
│   ├── particle dissolve
│   └── environment response
│
├── Audio
│   └── completion chime
│
├── Persistence
│   └── task completion mutation
│
└── Recovery
    └── undo transaction
________________________________________
33. COMPLETION TIMELINE
Baseline choreography:
0.0s ───── Reach
0.3s ───── Grab
0.6s ───── Drag
1.5s ───── Release
1.8s ───── Dissolve
2.8s ───── Dissolve complete
4.0s ───── Settle
These are baseline timings.
The implementation must preserve the emotional rhythm even if exact timings change during tuning.
________________________________________
34. COMPLETION DATA TIMING
The visual choreography and persistence should not be tightly coupled to the network.
Recommended:
User releases into completion zone
        ↓
Local state → completing
        ↓
Completion mutation queued immediately
        ↓
Visual dissolve plays
        ↓
Server persistence occurs independently
        ↓
Final state → completed
If the server fails:
•	local task remains recoverable,
•	retry occurs,
•	the user is not punished by a sudden visual rollback unless necessary.
________________________________________
35. COMPLETION UNDO
Undo must preserve:
•	task ID,
•	title,
•	notes,
•	ring,
•	spatial position,
•	due date,
•	recurrence configuration,
•	priority.
Undo should create a compensating mutation rather than trying to erase history blindly.
________________________________________
36. ARCHIVE / DELETE ARCHITECTURE
Orbit uses soft deletion.
The conceptual operation is:
active
  ↓
archived
not:
active
  ↓
destroyed
Permanent deletion is a separate owner-level data operation.
________________________________________
37. AURORA ARCHITECTURE
Aurora is derived from completion history.
It should not require permanently storing a massive particle history.
Database stores semantic completion information.
Renderer derives:
completion history
        ↓
aurora geometry
        ↓
particle positions
        ↓
visual intensity
This keeps storage small.
________________________________________
38. AURORA RETENTION
Baseline visualization horizon:
7 days
Historical completion data may remain in the database beyond this period unless the owner explicitly deletes it.
The 7-day limit applies to the default visualization, not necessarily data retention.
________________________________________
39. RENDERING ARCHITECTURE
The Three.js scene should be organized into layers.
Scene
│
├── Environment
│   ├── Sky
│   ├── Fog
│   ├── Floor
│   └── Lighting
│
├── World
│   ├── Core
│   ├── Rings
│   ├── Tasks
│   └── Aurora
│
├── Effects
│   ├── Dust
│   ├── Dissolve particles
│   └── Completion zone
│
└── Camera
________________________________________
40. RENDER LOOP RULES
The render loop must not:
•	perform network requests,
•	write directly to the database,
•	trigger React state updates every frame,
•	allocate unnecessary objects continuously.
The render loop is for:
•	animation,
•	interpolation,
•	shader updates,
•	camera movement,
•	particle simulation.
________________________________________
41. REACT / R3F BOUNDARY
React should manage:
•	scene composition,
•	object lifecycle,
•	declarative configuration,
•	task mapping.
Frame-by-frame animation should use references and frame-loop techniques where appropriate.
Avoid:
useState(position)
setPosition(...)
every frame.
Prefer mutable render references for continuous motion.
________________________________________
42. INSTANCING
Use instanced rendering for:
•	dust,
•	dissolve particles,
•	repeated decorative geometry,
•	Aurora particles.
Do not create hundreds of independent React/Three objects when the geometry is identical.
________________________________________
43. PARTICLE SYSTEM
Particle systems must:
•	reuse geometry,
•	reuse materials,
•	use typed arrays or efficient buffers where appropriate,
•	avoid unnecessary garbage collection,
•	support reduced-motion mode.
________________________________________
44. TASK NODE LOD
Task rendering complexity should vary by camera distance.
LOD 0 — Near
•	core,
•	shell,
•	ring,
•	label,
•	detailed effects.
LOD 1 — Medium
•	core,
•	simplified shell,
•	ring.
LOD 2 — Far
•	simplified luminous node.
LOD 3 — Very far
•	minimal representation.
________________________________________
45. TASK LABEL SYSTEM
Use SDF text.
Labels should:
•	billboard toward camera,
•	truncate visually,
•	preserve full text in semantic state,
•	avoid excessive permanent visibility.
Text geometry must not be regenerated unnecessarily.
________________________________________
46. CAMERA ARCHITECTURE
The camera must use an explicit state machine.
type CameraMode =
    | "orbit"
    | "focus"
    | "timeline"
    | "aurora";
Each mode defines:
•	target,
•	position,
•	distance,
•	orientation,
•	projection parameters,
•	transition behavior.
________________________________________
47. CAMERA TRANSITIONS
Transitions should be centrally controlled.
Do not implement separate arbitrary camera animations inside every component.
Use:
CameraController
    ↓
transitionTo(mode)
    ↓
calculate target
    ↓
animate
    ↓
settle
________________________________________
48. CAMERA INTERRUPTION
If the user interrupts a transition:
•	current camera position becomes the new starting point,
•	the new transition begins from there.
Never snap back to the previous target first.
________________________________________
49. MOBILE CAMERA
Mobile requires different framing.
The camera must adapt based on:
•	viewport aspect ratio,
•	device pixel ratio,
•	task density,
•	touch interaction.
Do not simply scale desktop coordinates.
________________________________________
50. INPUT ARCHITECTURE
Input should be abstracted.
PointerInput
TouchInput
KeyboardInput
        ↓
InteractionController
        ↓
Semantic action
        ↓
Application state
This prevents desktop and mobile logic from becoming separate implementations of the same concept.
________________________________________
51. INPUT ACTIONS
Semantic actions include:
CREATE_TASK
SELECT_TASK
FOCUS_TASK
BEGIN_DRAG
UPDATE_DRAG
RELEASE_TASK
COMPLETE_TASK
ARCHIVE_TASK
UNDO
EDIT_TASK
CHANGE_VIEW
The rendering system should respond to these semantic actions.
________________________________________
52. DRAGGING SYSTEM
Dragging should operate in world space.
The system must:
1.	identify selected object,
2.	calculate interaction plane,
3.	map pointer movement to world coordinates,
4.	update local position,
5.	calculate target zone,
6.	provide proximity feedback,
7.	commit semantic action on release.
Avoid arbitrary screen-coordinate hacks.
________________________________________
53. COMPLETION ZONE DETECTION
Use geometric proximity.
Conceptually:
distance(taskPosition, completionZone)
If below threshold:
isValidDrop = true
The visual system can then intensify attraction.
________________________________________
54. ARCHIVE ZONE DETECTION
Similarly:
distance(taskPosition, outerBoundary)
or equivalent spatial rule.
The same interaction engine should support both completion and archive destinations.
________________________________________
55. AUDIO ARCHITECTURE
Audio should be event-driven.
Application Event
       ↓
Audio Controller
       ↓
Sound definition
       ↓
Web Audio
Examples:
TASK_GRABBED
TASK_RELEASED
TASK_COMPLETED
TASK_ARCHIVED
TASK_RESTORED
VIEW_CHANGED
Not every event must produce a sound.
Sound density should remain low.
________________________________________
56. AUDIO AUTOPLAY
Browsers may prevent automatic audio playback.
Therefore:
initial load
    ↓
audio suspended
    ↓
first valid user interaction
    ↓
audio context initialized
    ↓
ambient begins
No fake autoplay hacks.
________________________________________
57. AUDIO ACCESSIBILITY
Sound must never be the only indication of a state change.
For meaningful events, equivalent visual/semantic feedback must exist.
________________________________________
58. REDUCED MOTION ARCHITECTURE
When reduced motion is active:
Disable or reduce:
•	camera drift,
•	ring rotation,
•	particle motion,
•	large transitions,
•	dissolve effects.
Replace with:
•	fades,
•	subtle state changes,
•	immediate but readable transitions.
________________________________________
59. ACCESSIBLE SEMANTIC MIRROR
The 3D scene must have an equivalent semantic DOM model.
Example:
<section aria-label="Orbit tasks">
    <article>
        <h2>Study Linear Algebra</h2>
        <p>Today · High attention</p>
        <button>Focus</button>
        <button>Complete</button>
        <button>Archive</button>
    </article>
</section>
This is not a replacement for the 3D world.
It is its functional accessibility counterpart.
________________________________________
60. KEYBOARD ARCHITECTURE
Keyboard navigation must use semantic selection.
Example:
Tab
 ↓
task selection
 ↓
Arrow keys
 ↓
move selection
 ↓
Enter
 ↓
focus
Text editing must temporarily capture relevant keys.
For example:
Typing in title field
        ↓
"N" must type "n"
not create a new task
________________________________________
61. ACCESSIBILITY PRIORITY
Priority cannot rely only on hue.
Use multiple signals:
•	geometry,
•	ring behavior,
•	subtle scale,
•	motion,
•	label semantics.
________________________________________
62. PERFORMANCE BUDGET
Baseline targets:
Metric	Target
Frame rate	~60 FPS where hardware permits
Draw calls	≤ 80 target
Visible triangles	≤ 250k target
Active particles	≤ 2,000 target
Initial usable experience	~3s target
Gzipped JS	~1.5MB target
Interaction latency	Perceptually immediate
These are engineering budgets, not laws that override usability.
Measured profiling takes precedence over arbitrary optimization.
________________________________________
63. DEVICE PERFORMANCE TIERS
Orbit should classify devices approximately as:
Tier A
Modern desktop / laptop.
Full visual quality.
Tier B
Modern mobile.
Reduced effects where necessary.
Tier C
Lower-performance device.
Aggressive LOD and effect reduction.
The application should remain functional in all supported tiers.
________________________________________
64. DEVICE PIXEL RATIO
Do not blindly render at maximum device pixel ratio.
Use a controlled cap where necessary.
Example:
effectivePixelRatio =
min(devicePixelRatio, configuredMaximum)
This prevents high-DPI mobile GPUs from rendering excessive pixels.
________________________________________
65. POST-PROCESSING
Post-processing must be treated as optional.
Potential effects:
•	bloom,
•	depth of field,
•	film grain.
If these materially damage mobile performance:
reduce or disable them.
The visual identity must survive without expensive effects.
________________________________________
66. MEMORY MANAGEMENT
The application must avoid:
•	creating new geometries every frame,
•	creating new materials repeatedly,
•	unnecessary texture duplication,
•	unbounded particle arrays,
•	detached event listeners,
•	abandoned animation timelines.
Every dynamically created resource must have a defined lifecycle.
________________________________________
67. ERROR BOUNDARIES
React application errors should be contained.
Recommended boundaries:
Application
├── Scene boundary
├── Data boundary
├── Audio boundary
└── UI boundary
A non-critical audio failure must not crash the task system.
A visual effect failure must not destroy task data.
________________________________________
68. OFFLINE CACHE STRATEGY
Cache:
•	application shell,
•	static assets,
•	fonts where permitted,
•	last known task data.
Do not cache private API responses indiscriminately in a public service-worker cache.
Private data must use appropriate local storage mechanisms and lifecycle rules.
________________________________________
69. SERVICE WORKER RESPONSIBILITIES
The service worker should handle:
•	app shell caching,
•	static asset caching,
•	update lifecycle.
It should not become the primary task database.
Task data belongs in IndexedDB.
________________________________________
70. APPLICATION STARTUP
Startup sequence:
1. Load application shell
2. Initialize local database
3. Restore local task snapshot
4. Render environment
5. Render cached tasks
6. Initialize authentication
7. Check connectivity
8. Synchronize
9. Reconcile remote state
10. Settle scene
The user should see the world before waiting for remote data whenever cached state exists.
________________________________________
71. FIRST-RUN STARTUP
If no local state exists:
Environment
 ↓
Core
 ↓
Rings
 ↓
Empty-state invitation
Do not wait for unnecessary backend requests before showing the environment.
________________________________________
72. DATA VALIDATION
Frontend validation improves UX.
Backend validation is authoritative.
Both must validate:
•	title length,
•	ring,
•	priority,
•	dates,
•	recurrence,
•	spatial values.
Never trust client-side validation alone.
________________________________________
73. INPUT SANITIZATION
Task notes and titles are plain text.
Do not render raw HTML from user content.
This reduces:
•	XSS risk,
•	injection complexity,
•	unnecessary parsing.
________________________________________
74. IMPORT SYSTEM
Import must follow:
upload / paste
       ↓
parse
       ↓
schema validate
       ↓
semantic validate
       ↓
preview / confirm
       ↓
transaction
       ↓
persist
A malformed import must never partially destroy existing data.
________________________________________
75. EXPORT SYSTEM
Export must contain sufficient information to reconstruct:
•	tasks,
•	state,
•	spatial positions,
•	recurrence,
•	dates,
•	notes,
•	priorities.
Export should be generated from authoritative application data.
________________________________________
76. BACKUP STRATEGY
A personal application still requires backups.
Recommended:
Primary
Managed PostgreSQL backup capability.
Secondary
Periodic JSON export.
Optional
Encrypted database snapshot in private storage.
The backup system must never expose task contents publicly.
________________________________________
77. LOGGING
Production logging should be minimal and privacy-preserving.
Log:
•	server errors,
•	failed migrations,
•	authentication failures where appropriate,
•	synchronization failures,
•	operational diagnostics.
Do not log:
•	task titles unnecessarily,
•	task notes,
•	private content,
•	behavioral analytics.
________________________________________
78. REQUEST IDs
Each backend request should have a request ID.
This makes debugging possible without collecting personal task data.
________________________________________
79. RATE LIMITING
Even though Orbit is single-user, rate limiting protects against:
•	infinite frontend loops,
•	buggy retry systems,
•	accidental request storms,
•	exposed endpoints.
Rate limits should be generous enough not to interfere with normal synchronization.
________________________________________
80. DATABASE INDEXES
At minimum:
(user_id, status)
(user_id, ring)
(user_id, due_at)
(user_id, updated_at)
Event history:
(user_id, created_at desc)
Indexes should be validated against actual query patterns rather than added indiscriminately.
________________________________________
81. FRONTEND PROJECT STRUCTURE
Recommended:
orbit/
│
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── scene/
│   │   │   ├── camera/
│   │   │   ├── task/
│   │   │   ├── choreography/
│   │   │   ├── input/
│   │   │   ├── audio/
│   │   │   ├── data/
│   │   │   ├── state/
│   │   │   ├── accessibility/
│   │   │   ├── ui/
│   │   │   └── utils/
│   │   ├── public/
│   │   └── index.html
│   │
│   └── api/
│       ├── app/
│       │   ├── main.py
│       │   ├── auth/
│       │   ├── tasks/
│       │   ├── sync/
│       │   ├── export/
│       │   ├── database/
│       │   └── core/
│       └── migrations/
│
├── packages/
│   ├── shared-types/
│   └── validation/
│
├── docs/
│   ├── PRD.md
│   ├── TRD.md
│   ├── UI-UX.md
│   ├── CHOREOGRAPHY.md
│   └── TESTING.md
│
└── README.md
A simpler single-repository structure is acceptable if a monorepo introduces unnecessary complexity.
________________________________________
82. DOMAIN BOUNDARIES
The codebase should have these conceptual domains:
Task Domain
Scene Domain
Camera Domain
Choreography Domain
Persistence Domain
Synchronization Domain
Audio Domain
Accessibility Domain
No domain should become a universal utility dumping ground.
________________________________________
83. SHARED TYPES
Frontend and backend should share semantic contracts where practical.
Example:
type TaskRing =
    | "today"
    | "week"
    | "someday";

type TaskPriority = 0 | 1 | 2 | 3;

type TaskStatus =
    | "idle"
    | "in_progress"
    | "completed"
    | "archived";
The backend remains authoritative.
Shared types reduce accidental mismatches.
________________________________________
84. TESTING STRATEGY
Testing must cover both:
Technical correctness
and
Experience-critical behavior.
________________________________________
85. UNIT TESTS
Required:
•	recurrence calculations,
•	spatial coordinate calculations,
•	ring assignment,
•	priority mapping,
•	task state transitions,
•	validation,
•	serialization,
•	mutation generation,
•	conflict resolution.
________________________________________
86. INTEGRATION TESTS
Required:
•	authentication,
•	CRUD,
•	completion,
•	archive,
•	restore,
•	recurrence,
•	export,
•	import,
•	database authorization.
________________________________________
87. SYNC TESTS
Simulate:
Scenario A
Laptop online → create task → phone receives task.
Scenario B
Phone offline → create task → reconnect → server receives task.
Scenario C
Two devices edit same task.
Scenario D
Mutation request retries.
Scenario E
Browser closes during pending synchronization.
Scenario F
Network disappears during completion.
No scenario should produce silent loss.
________________________________________
88. CHOREOGRAPHY TESTS
The completion sequence must be tested independently.
Verify:
•	grab,
•	drag,
•	zone detection,
•	release,
•	dissolve,
•	audio,
•	settle,
•	persistence,
•	undo.
________________________________________
89. VISUAL QA
Visual QA should inspect:
•	lighting,
•	ring visibility,
•	label readability,
•	task density,
•	camera transitions,
•	completion zone,
•	dissolve particles,
•	Aurora,
•	mobile framing.
________________________________________
90. PERFORMANCE QA
Test at:
•	1 task,
•	10 tasks,
•	25 tasks,
•	50 tasks,
•	100 tasks.
Also test:
•	many particles,
•	repeated completions,
•	long sessions,
•	mobile devices,
•	background/foreground transitions.
________________________________________
91. ACCESSIBILITY QA
Verify:
•	keyboard-only operation,
•	reduced motion,
•	high contrast,
•	semantic task list,
•	screen reader interaction,
•	non-color priority differentiation.
________________________________________
92. BROWSER SUPPORT
Target current stable versions of:
•	Chrome
•	Edge
•	Safari
•	Firefox
Mobile:
•	current iOS Safari
•	current Android Chrome
Specific browser versions should be maintained in a tested support matrix rather than frozen indefinitely in the TRD.
Legacy browsers are not required.
________________________________________
93. WEBGL FAILURE
If WebGL is unavailable:
The application should show a calm fallback explaining that the immersive environment cannot be rendered.
Where practical, the semantic task interface should remain available.
Never show a raw WebGL exception.
________________________________________
94. LOW-PERFORMANCE MODE
The system may automatically reduce:
•	particle count,
•	bloom,
•	DOF,
•	film grain,
•	shadow complexity,
•	environment effects.
It must preserve:
•	task visibility,
•	interaction,
•	spatial organization,
•	semantic functionality.
________________________________________
95. PWA ARCHITECTURE
Required:
•	manifest,
•	icons,
•	service worker,
•	install metadata,
•	offline shell,
•	standalone display mode.
The PWA must not claim native capabilities that the browser does not actually provide.
________________________________________
96. DEPLOYMENT ARCHITECTURE
Baseline:
                 Internet
                     │
             ┌───────▼────────┐
             │ Static Frontend│
             │ CDN / Hosting  │
             └───────┬────────┘
                     │ HTTPS
             ┌───────▼────────┐
             │    FastAPI     │
             │    Backend     │
             └───────┬────────┘
                     │
             ┌───────▼────────┐
             │   PostgreSQL   │
             │    Supabase    │
             └────────────────┘
________________________________________
97. INFRASTRUCTURE PRINCIPLE
The original target is low/no recurring cost.
However:
"Free forever" is not a technical guarantee because provider pricing and free-tier policies can change.
Therefore the actual engineering requirement is:
Keep the application inexpensive and portable enough that infrastructure can be replaced without rewriting Orbit.
________________________________________
98. DEPLOYMENT PORTABILITY
The application must avoid unnecessary provider lock-in.
Database:
•	PostgreSQL standard concepts.
Backend:
•	standard FastAPI deployment.
Frontend:
•	static web deployment.
Authentication:
•	isolated behind an auth abstraction where practical.
Realtime:
•	isolated behind a synchronization service.
________________________________________
99. ENVIRONMENT CONFIGURATION
Separate:
development
staging/test
production
Configuration must come from environment variables or deployment configuration.
Never commit secrets.
________________________________________
100. CI/CD
A basic pipeline should verify:
install
 ↓
type check
 ↓
lint
 ↓
unit tests
 ↓
build
 ↓
deployment
Backend:
format
 ↓
lint
 ↓
type check
 ↓
tests
________________________________________
101. DATABASE MIGRATIONS
Every schema change must use a migration.
Never manually modify production schema as the normal workflow.
Migration rules:
•	forward migration,
•	rollback consideration,
•	tested against representative data,
•	documented when destructive.
________________________________________
102. RELEASE STRATEGY
Because Orbit is personal, release management can remain simple.
Recommended:
main
 ↓
verified build
 ↓
production
A staging deployment is useful for major database/auth changes.
________________________________________
103. OBSERVABILITY WITHOUT SURVEILLANCE
Orbit should be observable enough to debug itself without becoming a telemetry system.
Allowed:
•	local development logging,
•	server error logs,
•	private operational logs.
Not allowed:
•	user behavior tracking,
•	session recording,
•	analytics,
•	third-party profiling.
________________________________________
104. TECHNICAL ERROR STATES
Every mutation should have:
idle
pending
success
failure
retrying
The 3D scene can translate these into appropriate visual states.
Do not expose raw technical terminology unless needed.
________________________________________
105. FAILURE VISUAL LANGUAGE
The visual system should remain calm.
Examples:
Synchronizing
Subtle ambient change.
Retry
Soft node pulse.
Rejected mutation
Gentle spring-back.
Authentication expired
Minimal semantic prompt.
Fatal application error
Calm fallback interface.
Avoid:
•	giant red banners,
•	flashing warnings,
•	alarm sounds.
________________________________________
106. DATA CONSISTENCY RULES
The system must guarantee:
1.	every task has one owner;
2.	every active task has a valid ring;
3.	every task ID is unique;
4.	task titles are valid;
5.	priorities remain within defined bounds;
6.	recurrence data is internally valid;
7.	archived tasks cannot accidentally appear as active;
8.	completed tasks have appropriate completion state;
9.	spatial values remain finite;
10.	mutation IDs are unique.
________________________________________
107. SPATIAL DATA VALIDATION
Reject:
NaN
Infinity
negative invalid radius
impossible ring
before persistence.
The renderer must also guard against corrupt coordinates.
________________________________________
108. TIME HANDLING
All server timestamps should be stored in UTC.
The client converts to local time for display.
Due-date calculations must use explicit timezone semantics.
Do not rely on the browser's local timezone for database storage.
________________________________________
109. TASK DATE SEMANTICS
A task's:
created_at
updated_at
due_at
completed_at
archived_at
must have distinct meanings.
Do not overload a single timestamp for multiple concepts.
________________________________________
110. CLOCK SKEW
Client clocks should not be treated as authoritative for server ordering.
Server timestamps should determine persistent ordering where necessary.
Client timestamps may still be used for local queue ordering.
________________________________________
111. RECURRENCE EDGE CASES
The recurrence engine must define behavior for:
•	month-end dates,
•	leap years,
•	missed occurrences,
•	offline completion,
•	duplicate retry,
•	timezone transitions.
For example:
A monthly task scheduled for the 31st should have a defined behavior in months without a 31st.
________________________________________
112. TASK TITLE LIMIT
Recommended:
1–200 characters
Rendering may truncate visually at approximately 40 characters.
The underlying value remains complete.
________________________________________
113. NOTES LIMIT
Notes should have a practical maximum to prevent pathological payload sizes.
Example:
≤ 10,000 characters
The limit may be adjusted if real usage demonstrates a need.
________________________________________
114. API PAYLOAD LIMITS
Backend should enforce reasonable request sizes.
This protects against accidental or malicious oversized requests.
________________________________________
115. SECURITY HEADERS
Production should use appropriate headers such as:
•	HTTPS enforcement,
•	content security policy where compatible,
•	frame restrictions,
•	MIME sniffing protection,
•	referrer policy.
The CSP must be tested carefully because WebGL, fonts, audio, and Supabase connectivity may require explicit sources.
________________________________________
116. DEPENDENCY MANAGEMENT
Dependencies must be:
•	justified,
•	pinned through lockfiles,
•	periodically reviewed,
•	removed when unnecessary.
Do not add a library for a feature that can be implemented trivially without it.
________________________________________
117. ANIMATION DEPENDENCY RULE
A single conceptual animation should have one owner.
For example:
CompletionController
owns completion choreography.
Do not allow:
TaskNode
+ Zustand
+ React Spring
+ Framer Motion
to independently modify the same property.
That creates race conditions.
________________________________________
118. CHOREOGRAPHY STATE MACHINE
Example:
IDLE
 ↓
REACH
 ↓
GRAB
 ↓
DRAG
 ↓
RELEASE
 ↓
DISSOLVE
 ↓
SETTLE
 ↓
IDLE
Cancellation:
DRAG → IDLE
Undo:
COMPLETED
 ↓
RESTORING
 ↓
IDLE
The choreography controller must be the authoritative owner of these transitions.
________________________________________
119. CAMERA + CHOREOGRAPHY COORDINATION
Camera transitions and task animations must not fight each other.
Use a coordination layer.
Example:
Focus task
 ↓
CameraController begins transition
 ↓
Task enters focused state
 ↓
Edit panel appears after camera settles
Do not open the panel before the camera reaches a usable position.
________________________________________
120. UI / 3D BOUNDARY
The product vision strongly prefers in-world interaction.
Therefore:
3D
Use for:
•	task nodes,
•	labels,
•	completion zone,
•	edit panel,
•	environmental feedback,
•	primary interaction.
2D HTML
Use where technically superior:
•	authentication,
•	fallback accessibility interface,
•	complex text editing if necessary,
•	browser-native controls,
•	rare system-level actions.
"3D at all costs" is not a technical requirement.
"Preserve immersion" is.
________________________________________
121. TEXT INPUT ARCHITECTURE
Pure 3D text input may become unnecessarily fragile across browsers and mobile devices.
Therefore the implementation may use a visually integrated HTML input positioned over the 3D world if needed.
The user should still perceive it as an in-world interaction.
Technical purity must not override:
•	typing reliability,
•	IME support,
•	mobile keyboard behavior,
•	accessibility.
________________________________________
122. MOBILE TEXT ENTRY
Mobile title editing must correctly support:
•	virtual keyboard,
•	cursor movement,
•	selection,
•	autocorrect,
•	IME,
•	screen resize.
The 3D world should adapt rather than being destroyed by the keyboard.
________________________________________
123. TOUCH TARGETS
Interactive controls must provide sufficient touch area.
Tiny visual controls must not require precise fingertip targeting.
________________________________________
124. GESTURE RULE
Use as few gestures as possible.
Baseline:
Tap → select/focus
Drag → move
Pinch → camera scale/navigation
Avoid gesture combinations that require memorization.
________________________________________
125. SETTINGS
Orbit should have very few settings.
Likely:
•	sound,
•	reduced motion override if necessary,
•	high contrast,
•	visual quality,
•	account/data management.
Settings must not become a configuration dashboard.
________________________________________
126. PRIVACY
No analytics.
No advertising.
No behavioral profiling.
No third-party tracking.
No session recording.
No unnecessary external scripts.
________________________________________
127. THIRD-PARTY SERVICE RULE
Every external service must answer:
1.	Why is it needed?
2.	What data does it receive?
3.	Can Orbit operate without it?
4.	Can it be replaced?
5.	Does it compromise privacy?
6.	Does it introduce recurring cost?
If the answer is weak, remove the dependency.
________________________________________
128. TECHNICAL ACCEPTANCE GATES
A milestone cannot be considered complete merely because the code runs.
It must pass:
Gate A — Functional
Feature works.
Gate B — Visual
Feature looks correct.
Gate C — Interaction
Feature feels coherent.
Gate D — Performance
Feature does not break performance budgets.
Gate E — Persistence
Data remains correct.
Gate F — Recovery
Failure does not silently lose work.
Gate G — Accessibility
Equivalent operation remains possible.
________________________________________
129. DEVELOPMENT PHASES
M0 — Foundation
Deliver:
•	repository,
•	frontend,
•	backend,
•	TypeScript strict mode,
•	linting,
•	formatting,
•	environment configuration,
•	CI basics.
________________________________________
M1 — World
Deliver:
•	twilight environment,
•	Core,
•	rings,
•	fog,
•	floor,
•	lighting,
•	ambient particles.
Technical exit criteria
•	scene renders reliably,
•	no major frame drops,
•	no React render-loop abuse,
•	WebGL failure handled.
________________________________________
130. M2 — CAMERA
Deliver:
•	Orbit,
•	Focus,
•	Timeline,
•	Aurora,
•	camera state machine,
•	transitions.
Exit criteria
Every camera state is reachable and reversible.
________________________________________
131. M3 — TASK RENDERING
Deliver:
•	node geometry,
•	labels,
•	priority representation,
•	LOD,
•	spatial placement,
•	idle motion.
Exit criteria
Mock tasks feel physically present.
________________________________________
132. M4 — COMPLETION
This is the highest technical and experiential priority milestone.
Deliver:
•	drag interaction,
•	completion zone,
•	continuous movement,
•	dissolve,
•	audio,
•	settle,
•	persistence,
•	undo.
Exit criteria
The interaction must feel like Orbit.
If it does not:
stop feature development and iterate.
________________________________________
133. M5 — CREATION
Deliver:
•	Seed,
•	placement,
•	title input,
•	ring assignment,
•	persistence.
________________________________________
134. M6 — BACKEND
Deliver:
•	authentication,
•	PostgreSQL,
•	schema,
•	migrations,
•	API,
•	authorization,
•	CRUD.
________________________________________
135. M7 — LOCAL-FIRST + SYNC
Deliver:
•	IndexedDB,
•	local snapshot,
•	mutation queue,
•	optimistic mutations,
•	realtime,
•	conflict handling,
•	retry.
________________________________________
136. M8 — EDITING
Deliver:
•	Focus mode,
•	edit panel,
•	notes,
•	dates,
•	priority,
•	recurrence.
________________________________________
137. M9 — AUDIO
Deliver:
•	ambient,
•	interaction sounds,
•	completion sound,
•	mute,
•	browser autoplay handling.
________________________________________
138. M10 — ACCESSIBILITY
Deliver:
•	keyboard,
•	reduced motion,
•	contrast,
•	semantic mirror,
•	screen-reader support.
________________________________________
139. M11 — MOBILE
Deliver:
•	touch interaction,
•	responsive camera,
•	mobile text editing,
•	performance tiering.
________________________________________
140. M12 — FINAL POLISH
Deliver:
•	Aurora,
•	visual tuning,
•	performance profiling,
•	memory profiling,
•	error recovery,
•	deployment hardening,
•	backup verification.
________________________________________
141. MILESTONE DEVELOPMENT RULE
After every major milestone:
Use Orbit as a real task application before building the next layer.
Do not judge the system exclusively from code or screenshots.
Real use reveals:
•	friction,
•	visual clutter,
•	confusing interactions,
•	unnecessary features,
•	performance problems,
•	emotional problems.
________________________________________
142. DEFINITION OF TECHNICAL DONE
Orbit is technically complete when:
•	the application can authenticate the owner;
•	the environment loads reliably;
•	task state is persistent;
•	spatial position persists;
•	tasks can be created;
•	tasks can be edited;
•	tasks can be completed;
•	completion is reversible;
•	tasks can be archived;
•	recurrence is deterministic;
•	cross-device synchronization works;
•	offline mutations survive reconnect;
•	conflicts are deterministic;
•	data can be exported;
•	data can be restored;
•	authentication is secure;
•	database authorization is enforced;
•	accessibility has an equivalent functional path;
•	mobile interaction works;
•	performance is acceptable;
•	production errors do not cause silent data loss;
•	backups exist;
•	the deployment can be reproduced.
________________________________________
143. DEFINITION OF PRODUCT-TECHNICAL DONE
Technical completion alone is insufficient.
Orbit is ready only when:
The technical system disappears behind the experience.
The owner should not think:
•	"The realtime system is syncing."
•	"IndexedDB just flushed."
•	"The optimistic mutation succeeded."
•	"The camera state machine transitioned."
They should think:
"I placed something here, and it remembered."
"I finished it, and it left."
"I opened Orbit, and I arrived."
________________________________________
144. TECHNICAL RISKS
Risk	Impact	Mitigation
3D performance	Critical	Instancing, LOD, profiling, device tiers
Completion feels unnatural	Critical	M4 isolated prototype and repeated iteration
Offline conflicts	High	Mutation IDs + deterministic versioning
Mobile interaction complexity	High	Abstract semantic input layer
Accessibility of 3D	High	Semantic HTML mirror
Provider pricing changes	Medium	Portable architecture
WebGL incompatibility	Medium	Graceful fallback
Audio autoplay restrictions	Medium	First-gesture initialization
Too many dependencies	Medium	Dependency review
Scope creep	Critical	PRD/TRD authority hierarchy
Data loss	Critical	Local-first + backups + export
Database inconsistency	High	Transactions + constraints
Animation race conditions	High	Central choreography controllers
Memory leaks	High	Resource lifecycle discipline
________________________________________
145. TECHNICAL ANTI-PATTERNS
The following are explicitly prohibited.
Do not:
•	put Supabase calls directly inside Three.js components;
•	store task truth only in Zustand;
•	store task truth only in the renderer;
•	update React state every animation frame;
•	create new geometries every frame;
•	use hardcoded authentication secrets;
•	trust client-provided user IDs;
•	rely solely on frontend authorization;
•	make completion wait for network response;
•	use server events to dictate exact animation timing;
•	allow multiple systems to control the same animation property;
•	permanently delete tasks for normal archive behavior;
•	build a giant global Zustand store containing everything;
•	add analytics "just temporarily";
•	use red warning states against the product philosophy;
•	add a dependency for a trivial utility;
•	make mobile a scaled-down desktop;
•	treat accessibility as a later patch.
________________________________________
146. ENGINEERING DECISION RULE
When multiple technically valid approaches exist, prefer:
1.	the approach that best preserves the Orbit experience;
2.	the simplest reliable architecture;
3.	the smallest number of dependencies;
4.	the easiest recovery path;
5.	the most portable infrastructure;
6.	the most testable implementation;
7.	the best measured performance.
Do not choose complexity merely because it is technically impressive.
________________________________________
147. REQUIREMENTS TRACEABILITY
Every significant technical component should trace back to a product requirement.
Example:
PRD:
"Tasks remember where they were."

        ↓

TRD:
SpatialPosition model
        ↓
Database columns
        ↓
Local persistence
        ↓
Synchronization
        ↓
Renderer
        ↓
Visual continuity
If a technical subsystem cannot be connected to a real product requirement, question whether it belongs.
________________________________________
148. REQUIREMENT PRIORITY MODEL
P0
Required for Orbit's identity or data integrity.
P1
Strongly improves the intended experience or robustness.
P2
Useful but safely deferrable.
A P2 feature must never delay or compromise a P0 feature.
________________________________________
149. FINAL ARCHITECTURE
The final conceptual architecture is:
                         ORBIT
                           │
          ┌────────────────┼────────────────┐
          │                │                │
       EXPERIENCE       DATA             PLATFORM
          │                │                │
     ┌────┴────┐      ┌────┴────┐      ┌────┴────┐
     │         │      │         │      │         │
   Scene   Choreography Local   Server  PWA     Hosting
     │         │       Cache     API
     │         │         │        │
     └────┬────┘         │        │
          │              │        │
       Renderer          └──┬─────┘
                            │
                       PostgreSQL
                            │
                         Realtime
And the operational loop is:
                 ┌──────────────┐
                 │     USER     │
                 └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │  INTERACTION │
                 └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │ LOCAL STATE  │
                 └──────┬───────┘
                        │
             ┌──────────┴──────────┐
             │                     │
             ▼                     ▼
       ┌───────────┐         ┌───────────┐
       │ 3D WORLD  │         │ LOCAL DB  │
       └───────────┘         └─────┬─────┘
                                   │
                              sync when able
                                   │
                                   ▼
                             ┌───────────┐
                             │   API     │
                             └─────┬─────┘
                                   │
                                   ▼
                             ┌───────────┐
                             │ POSTGRES  │
                             └─────┬─────┘
                                   │
                              realtime
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
                 LAPTOP                         PHONE
________________________________________
150. FINAL ENGINEERING PRINCIPLE
The most important technical requirement is not:
"Use Three.js."
It is not:
"Use FastAPI."
It is not:
"Use Supabase."
It is not:
"Achieve 60 FPS."
All of those are implementation decisions.
The deepest engineering requirement is:
The architecture must make it possible for Orbit to feel like one persistent world rather than a collection of disconnected screens, requests, database records, and animations.
The owner should be able to:
create → place → leave → return → find → interact → complete → release → remember
without ever feeling the machinery underneath.
________________________________________
151. FINAL TRD CONTRACT
This TRD exists to protect the PRD during implementation.
If engineering pressure creates a choice between:
A. a technically convenient implementation that makes Orbit feel like a normal task application,
and
B. a slightly more deliberate implementation that preserves Orbit's spatial, physical, calm identity,
the architecture should prefer B, provided it remains reliable and maintainable.
Likewise, if a visually impressive technical feature:
•	reduces performance,
•	creates clutter,
•	increases maintenance,
•	harms accessibility,
•	threatens data integrity,
•	or exists merely because it is technically possible,
it should be removed.
The goal is not to build the most complicated 3D task manager.
The goal is to build the most coherent implementation of Orbit.
________________________________________
152. THE ENGINEERING NORTH STAR
The database remembers the task.
The application remembers the interaction.
The renderer remembers the feeling.
The world remembers the place.
And the owner never has to think about the machinery making it happen.
________________________________________
END OF ORBIT — ULTIMATE TECHNICAL REQUIREMENTS DOCUMENT
TRD Version 2.0 — Master Engineering Specification
Product governed by: Orbit PRD v2.0
Primary principle: Calm gravity. Quiet motion. Physical meaning.

