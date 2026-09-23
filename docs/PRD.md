**ORBIT**

**A Personal Immersive 3D To-Do Environment**

**Document Type:** Product Requirements Document  
**Version:** 2.0 — Ultimate Specification  
**Status:** Master Build Specification  
**Project Type:** Personal, single-user, immersive web application  
**Owner:** The owner / sole user / sole stakeholder  
**Primary Platform:** Web + PWA  
**Primary Experience:** Immersive 3D spatial task management  
**Last Updated:** 2026

**0\. EXECUTIVE SUMMARY**

**0.1 What Orbit Is**

**Orbit is a personal, single-user, immersive 3D to-do environment where tasks exist as physical objects inside a persistent spatial world.**

It is intentionally not a conventional productivity application.

It does not attempt to become a task-management platform, collaboration tool, project-management system, social product, or productivity analytics suite.

Orbit exists for one person.

Its purpose is simple:

**Turn managing tasks from an administrative activity into a calm, spatial, physical experience.**

The owner should not feel like they are opening a spreadsheet containing obligations.

They should feel like they are **arriving somewhere**.

A task is not merely a database row.

It is an object.

Creating a task is not merely filling out a form.

It is **seeding something into the world**.

Completing a task is not merely checking a checkbox.

It is **physically releasing something**.

The application should make the process of managing responsibilities feel meaningful without becoming gamified, manipulative, noisy, or distracting.

**0.2 The Core Experience**

The intended emotional sequence is:

**Open → Arrive → Observe → Choose → Act → Release → Settle**

The user opens Orbit.

The scene appears.

The world is already there.

Tasks occupy meaningful positions in space.

The user chooses what deserves attention.

They physically interact with the task.

The task responds.

When completed, it leaves the active world through a deliberate visual and sonic ritual.

The environment settles again.

Nothing screams for attention.

Nothing tells the user that they are failing.

Nothing tries to keep them inside the application.

**0.3 The Central Product Question**

Every implementation decision should ultimately answer:

**Does this make Orbit feel more like a calm, persistent place where my tasks physically exist?**

If yes, it may belong.

If it improves technical quality without damaging the experience, it belongs.

If it solves a real problem for the owner, it belongs.

If it exists primarily because conventional productivity software normally has the feature, it requires justification.

If it introduces clutter, anxiety, unnecessary complexity, engagement mechanics, or product-like behavior without meaningful benefit, it should be rejected.

**1\. PRODUCT IDENTITY**

**1.1 Product Name**

**Orbit**

The name refers simultaneously to:

- the spatial structure of the application,
- the movement of tasks around the Core,
- the passage of time,
- the relationship between tasks and the owner,
- and the application's central visual metaphor.

**1.2 Product Vision**

**Orbit is a quiet twilight space where my tasks live as physical objects I can move, shape, and release. Opening it feels like arriving somewhere. Completing a task feels like letting go of something.**

**1.3 Design Mantra**

**Calm gravity. Quiet motion. Physical meaning.**

This mantra is not decorative copy.

It is a design constraint.

Every major interaction should embody at least one of these qualities:

**Calm gravity**

The environment feels grounded, intentional, and quiet.

**Quiet motion**

Motion communicates meaning without demanding attention.

**Physical meaning**

Actions should feel like physical interactions with objects rather than abstract interface operations.

**2\. THE PROBLEM**

**2.1 The Owner's Problem**

The owner has used conventional to-do applications and finds their dominant interaction model unsatisfying.

Most traditional systems represent tasks as:

- rows,
- cards,
- checkboxes,
- badges,
- counters,
- lists,
- calendar entries,
- notification streams.

This makes task management feel administrative.

The owner does not primarily need another database of tasks.

The owner wants a **task environment**.

The desired environment should be:

1. Spatially meaningful.
2. Physically interactive.
3. Calm.
4. Beautiful.
5. Persistent.
6. Personal.
7. Accessible across personal devices.
8. Free of manipulative productivity mechanics.

**2.2 Why Conventional Task Interfaces Fail the Desired Experience**

| **Conventional Pattern**     | **Problem for Orbit**                              |
| ---------------------------- | -------------------------------------------------- |
| Rows                         | Flatten tasks into information                     |
| Checkbox completion          | Makes completion feel administrative               |
| Red overdue states           | Creates anxiety                                    |
| Badges                       | Encourage attention to metrics                     |
| Streaks                      | Turn productivity into obligation                  |
| Notification-heavy workflows | Interrupt calm                                     |
| Dense dashboards             | Replace spatial immersion with information density |
| Endless configuration        | Turns the tool itself into work                    |
| Team/workspace concepts      | Solve problems Orbit does not have                 |
| Gamification                 | Conflicts with the desired emotional tone          |

Orbit should not simply place a conventional task manager inside a 3D canvas.

That would preserve the underlying problem while changing the visual surface.

The **interaction model itself must be spatial**.

**3\. PRODUCT OPPORTUNITY**

A browser-based 3D environment can combine:

- persistent spatial positioning,
- physical interaction,
- environmental animation,
- ambient audio,
- visual hierarchy,
- task state,
- temporal progression,
- and tactile-feeling interaction.

This allows Orbit to answer a question conventional task applications generally do not attempt:

**What if my to-do list was a place I could enter?**

**4\. PRODUCT PRINCIPLES**

The following principles are ordered by priority.

**P1 — Sole-User Optimization**

Orbit is optimized for one person.

There is no requirement to support:

- teams,
- organizations,
- collaboration,
- sharing,
- multiple workspaces,
- public profiles,
- social graphs,
- growth,
- monetization,
- customer support,
- or external stakeholders.

The application should be designed around actual owner needs rather than hypothetical market requirements.

**P2 — Experience Is Part of Function**

A feature that technically works but damages the intended experience is not considered successful.

Functional correctness and experiential correctness are both required.

**P3 — Physicality Over Abstraction**

Tasks should behave like objects.

Actions should feel physical.

Creation should feel like placement.

Completion should feel like release.

Deletion should feel like departure.

Navigation should feel spatial.

**P4 — Calm Over Urgency**

Orbit must not manufacture urgency.

There should be:

- no red overdue alarms,
- no guilt counters,
- no streak pressure,
- no productivity scores,
- no aggressive notification system,
- no attention-grabbing badges.

Urgency may exist as information, but it should not be visually weaponized.

**P5 — Spatial Memory**

The world should remember.

If the owner places a task somewhere, that location should remain meaningful.

The environment should not feel like a randomly regenerated visualization every time it opens.

**P6 — Performance Is a Feature**

Immersion is dependent on responsiveness.

A beautiful 3D environment that stutters, freezes, or produces input latency fails its purpose.

Performance budgets therefore belong in the product specification, not merely in engineering notes.

**P7 — Zero Unnecessary Cost**

Orbit should be designed to operate within a sustainable low-cost/free infrastructure where practical.

However:

**Zero cost must never be achieved by sacrificing data integrity, security, or the core experience.**

If a provider changes its free-tier terms, infrastructure may change while the product principles remain.

**P8 — No Dark Patterns**

Orbit must never optimize for:

- session length,
- compulsive use,
- notification engagement,
- streak preservation,
- artificial urgency,
- vanity metrics,
- or retention for its own sake.

The owner should be free to leave.

**P9 — Simplicity Behind Complexity**

The implementation may be sophisticated.

The user experience should not feel complicated.

Orbit should have a small number of concepts that are deeply coherent rather than a large number of loosely connected features.

**5\. ANTI-PRINCIPLES**

Orbit should never become:

- a social network,
- a team productivity suite,
- a project-management platform,
- a gamified habit tracker,
- an analytics dashboard,
- an AI assistant unless explicitly introduced later,
- a notification center,
- a conventional calendar replacement,
- an endless customization system,
- or a "productivity game."

Explicitly prohibited unless the owner deliberately changes the product vision:

- streaks,
- badges,
- points,
- levels,
- XP,
- leaderboards,
- productivity scores,
- public sharing,
- collaboration,
- ads,
- engagement metrics,
- third-party tracking,
- manipulative notifications,
- guilt-oriented copy,
- artificial urgency,
- unnecessary onboarding,
- feature bloat.

**6\. USER DEFINITION**

**6.1 Primary User**

There is exactly one intended user:

**the owner.**

| **Attribute**    | **Requirement**                |
| ---------------- | ------------------------------ |
| Users            | 1                              |
| Account          | Single owner account           |
| Devices          | Personal laptop, phone, tablet |
| Primary language | English                        |
| Sharing          | None                           |
| Collaboration    | None                           |
| Data ownership   | Owner                          |
| Data privacy     | Maximum practical privacy      |
| Analytics        | None                           |
| Support          | Self-maintained                |
| Onboarding       | Minimal or none                |
| Deployment       | Personal                       |

**6.2 User Model**

Orbit does not require conventional personas.

There is no need to create fictional personas such as:

- busy professional,
- student,
- manager,
- entrepreneur,
- team lead.

Those abstractions should not drive requirements.

The owner's actual interaction with the application is the source of truth.

**7\. CORE USER STORIES**

**7.1 Opening**

- I want Orbit to feel like arriving somewhere.
- I want to understand my environment almost immediately.
- I want to see my important tasks without opening menus.
- I do not want to be greeted by dashboards, alerts, or setup flows.

**7.2 Creating**

- I want to create a task by seeding it from the Core.
- I want to place the task into a meaningful orbit.
- I want to name it without leaving the scene.
- I want creation to feel physical rather than administrative.

**7.3 Working**

- I want to identify what matters without scanning a dense list.
- I want to focus on one task without losing the environment.
- I want the spatial arrangement to help me remember where things are.
- I want interaction to remain responsive.

**7.4 Completing**

- I want to physically drag a task into a completion zone.
- I want completion to feel deliberate.
- I want the task to dissolve rather than simply disappear.
- I want the environment to acknowledge completion without shouting about it.

**7.5 Editing**

- I want to edit tasks inside the environment.
- I do not want to be thrown into a conventional form.
- I want edits to save automatically.
- I want to recover from accidental actions.

**7.6 Deleting**

- I want deletion to feel like sending an object away.
- I want accidental deletion to be recoverable.
- I do not want deletion to immediately destroy data.
- Archived tasks should remain recoverable.

**7.7 Cross-Device**

- I want to create something on my phone and see it on my laptop.
- I want the application to synchronize without requiring manual refresh.
- I want to survive temporary network loss.
- I do not want local work to disappear because connectivity failed.

**7.8 Long-Term**

- I want completed work to leave a quiet trace.
- I want the environment to remember where tasks lived.
- I want old tasks to remain recoverable.
- I want the application to remain useful months after creation.

**8\. EXPERIENCE MODEL**

Orbit is built around a small set of spatial concepts.

**8.1 The Core**

The Core is the central luminous object.

It represents:

- origin,
- creation,
- stability,
- the center of the environment.

New tasks originate from the Core.

**8.2 Rings**

Three primary rings organize active tasks.

**Today**

Tasks requiring attention within the current day.

**This Week**

Tasks belonging to the current near-term planning horizon.

**Someday**

Tasks that matter but do not require immediate attention.

The rings are not merely visual categories.

They are the application's primary spatial organization system.

**8.3 Nodes**

Every active task is represented by a **Task Node**.

A node contains:

- core,
- shell,
- orbital ring,
- label,
- state,
- spatial position,
- priority representation.

**8.4 Seeds**

A Seed is a task before it becomes a fully established node.

The Seed represents potential.

The owner pulls it from the Core and places it into the world.

**8.5 Aurora**

Aurora is the visual memory of completed work.

Completed tasks should not simply vanish from the conceptual world.

Their completion contributes to a subtle outer ribbon of particles.

Aurora is not a score.

It is memory.

**9\. CORE EXPERIENCE LOOP**

The fundamental interaction loop is:

**Observe → Select → Manipulate → Receive feedback → Settle**

The system should avoid unnecessary:

**Open menu → select option → confirm → close menu → return**

flows whenever the same action can be expressed naturally in the environment.

**10\. SCOPE**

**10.1 V1 MUST INCLUDE**

**Environment**

- Twilight 3D environment
- Core
- Three active rings
- Ambient particles
- Atmospheric lighting
- Persistent spatial layout

**Tasks**

- Create
- Edit
- Complete
- Delete/archive
- Undo
- Recurrence
- Priority
- Notes
- Due dates
- Persistent positioning

**Views**

- Orbit
- Focus
- Timeline
- Aurora

**Interaction**

- Mouse
- Touch
- Keyboard
- Dragging
- Focus
- Seeding
- Completion choreography

**Data**

- Persistent storage
- Authentication
- Cross-device synchronization
- Offline operation
- Conflict handling
- Export/import

**Experience**

- Ambient sound
- Interaction sounds
- Completion sound
- Reduced motion
- High contrast
- Keyboard accessibility
- Screen-reader representation

**Platform**

- Responsive web
- PWA
- Desktop browser
- Mobile browser
- Tablet browser

**11\. EXPLICITLY OUT OF SCOPE**

Unless the owner deliberately changes the vision:

- Multi-user accounts
- Collaboration
- Shared tasks
- Teams
- Workspaces
- Public profiles
- Social features
- Comments
- Third-party productivity integrations
- Slack integration
- Notion integration
- Calendar synchronization
- Email notifications
- SMS notifications
- Push notifications as a core workflow
- Native iOS app
- Native Android app
- Electron application
- Desktop native application
- AI features
- Task-generated AI suggestions
- Productivity scoring
- Gamification
- Streaks
- Leaderboards
- Ads
- Tracking
- Behavioral analytics
- Engagement analytics
- Complex tagging
- Complex filtering
- Subtask hierarchies
- Attachment management
- Project management
- Team dashboards

**12\. FUTURE IDEAS — NOT COMMITTED**

These ideas are deliberately separated from V1.

Possible future experiments:

- WebXR / VR
- AR
- Voice task creation
- Procedural ambient music
- Daily ritual mode
- Expanded temporal visualization
- Physical device integrations
- Advanced environmental personalization

These are ideas, not requirements.

The existence of this section must never be interpreted as a commitment to build them.

**13\. FUNCTIONAL REQUIREMENTS**

Each requirement uses:

- **P0** — required for the intended product
- **P1** — important enhancement
- **P2** — optional if time and quality permit

A lower-priority feature must never compromise a P0 experience.

**13.1 SCENE SYSTEM — F-100**

**F-101 — Twilight Environment \[P0\]**

The application must render a coherent twilight environment containing:

- gradient sky,
- atmospheric fog,
- reflective floor,
- controlled lighting,
- Core,
- rings,
- particles,
- task nodes.

Baseline palette:

- Sky top: #1B1E2B
- Horizon: #2A2F45
- Floor: #1E2233

The palette should remain calm and avoid pure black or pure white.

**Acceptance Criteria**

- No visible unstyled loading frame.
- No harsh flash during initialization.
- Scene establishes the visual identity immediately.
- Environment remains coherent across desktop and mobile.

**F-102 — Core \[P0\]**

The Core must be:

- central,
- luminous,
- visually stable,
- slightly animated,
- interactive.

Baseline:

- Radius: approximately 0.4
- Emissive material
- Subtle pulse
- Central position

The exact values may be tuned during implementation if the resulting experience improves while preserving the intended scale.

**F-103 — Orbit Rings \[P0\]**

Three concentric rings:

| **Ring** | **Baseline Radius** | **Meaning** |
| -------- | ------------------- | ----------- |
| Today    | 4                   | Immediate   |
| Week     | 7                   | Near-term   |
| Someday  | 10                  | Future      |

Rings should:

- remain visually distinguishable,
- rotate slowly,
- avoid distracting the user,
- provide spatial hierarchy.

**F-104 — Ambient Particles \[P0\]**

The environment contains approximately 200 ambient dust particles.

Requirements:

- instanced rendering,
- slow motion,
- phase variation,
- no obvious looping pattern,
- no individual draw call per particle.

Performance impact should remain negligible.

**F-105 — Aurora \[P1\]**

Aurora is an outer particle ribbon representing completed work.

It should:

- remain subtle,
- appear only when meaningful completion history exists,
- avoid behaving like a numerical score,
- visually reward completion without gamification.

Brightness may correlate with recent completion activity, but the relationship must remain atmospheric rather than quantitative.

**F-106 — Idle Motion \[P0\]**

The world should never feel completely frozen.

Subtle movement may include:

- Core breathing,
- camera micro-drift,
- ring rotation,
- particle movement,
- atmospheric variation.

Motion must remain subordinate to task interaction.

**13.2 TASK REPRESENTATION — F-200**

**F-201 — Task Node \[P0\]**

Each task is represented as a node containing:

1. Core sphere
2. Emissive shell
3. Orbital ring
4. Label

The node must communicate:

- identity,
- priority,
- interaction state,
- spatial importance.

**F-202 — Task State Machine \[P0\]**

The visual state model must be explicit.

**State 1 — Dormant**

Task exists but has minimal visual activity.

**State 2 — Idle**

Normal active task.

**State 3 — Hovered**

Pointer/touch/selection attention is detected.

**State 4 — Focused**

Task is the current focal object.

**State 5 — In Progress**

Task is actively being manipulated.

**State 6 — Completing**

Task is executing its completion choreography.

**State 7 — Completed**

Task has left the active scene and entered completion history.

**State 8 — Archived**

Task has been removed from active use but remains recoverable.

Every transition must have an explicit trigger and visual response.

**F-203 — Task Motion \[P0\]**

Task nodes should subtly bob vertically.

Baseline:

- amplitude: approximately ±0.02
- period: 3–6 seconds
- randomized phase

No two nodes should visibly synchronize.

**F-204 — Labels \[P0\]**

3D labels should:

- use crisp SDF rendering,
- billboard toward the camera,
- remain readable,
- avoid unnecessary permanent visual noise.

Labels may become more prominent on hover/focus.

Default truncation:

- approximately 40 characters.

The underlying task title remains intact.

**F-205 — Spatial Memory \[P0\]**

Every task should store its spatial location.

Minimum persisted values:

- orbit,
- angular position,
- radius,
- optional vertical offset where supported.

If no position exists:

1. determine an appropriate location,
2. avoid collisions,
3. persist it,
4. use the same location thereafter.

**13.3 TASK CREATION — F-300**

**F-301 — Seed Interaction \[P0\]**

The owner can create a task by spawning a Seed from the Core.

Desktop:

- N creates a Seed.

Touch:

- dedicated pull-down / creation gesture.

The Seed:

1. appears at the Core,
2. follows the user's movement,
3. previews its trajectory,
4. snaps meaningfully toward an orbit,
5. transforms into a task node on release.

**F-302 — Inline Title Entry \[P0\]**

After placement:

- the task label becomes editable,
- no conventional modal opens,
- no separate page is required.

Controls:

- Enter → save
- Esc → cancel

The interaction should feel like naming an object in the world.

**F-303 — Ring Assignment \[P0\]**

If released between rings:

- snap to nearest valid ring.

If released at the Core:

- default to Today.

A task must never exist without a valid spatial category.

**F-304 — Creation Failure Recovery \[P0\]**

If task creation fails due to:

- network failure,
- invalid data,
- synchronization conflict,
- unexpected runtime error,

the local interaction must not silently destroy the task.

The system must either:

- preserve the local task as pending,
- retry,
- or clearly restore the interaction state.

**F-305 — Voice Input \[P2\]**

Optional voice input may be supported later.

It must never become a dependency for task creation.

**13.4 TASK COMPLETION — F-400**

Task completion is the **signature interaction of Orbit**.

It receives the highest experiential priority.

**F-401 — Six-Phase Completion Choreography \[P0\]**

The intended sequence is:

**Phase 1 — Reach**

0.0–0.3s

The owner grabs or initiates interaction with the task.

**Phase 2 — Grab**

0.3–0.6s

The node visibly responds to physical manipulation.

**Phase 3 — Drag**

0.6–1.5s

The node travels toward the completion zone.

**Phase 4 — Release**

1.5–1.8s

The node transitions into completion.

**Phase 5 — Dissolve**

1.8–2.8s

The node breaks into particles and leaves the active environment.

**Phase 6 — Settle**

2.8–4.0s

The environment returns to calm.

The timing is a baseline, not an immutable law.

The emotional rhythm is more important than exact milliseconds.

**F-402 — Completion Zone \[P0\]**

When a task is grabbed:

- a completion zone appears near the lower viewport,
- it responds to proximity,
- it emits subtle particles,
- it becomes visually magnetic.

The zone must communicate:

"This is where the task can be released."

It must not feel like a dangerous destructive area.

**F-403 — Continuous Physics \[P0\]**

When released inside the completion zone:

- preserve velocity,
- avoid teleportation,
- avoid hard snapping,
- maintain continuity.

The dissolve should begin from the node's actual release position.

**F-404 — Particle Dissolve \[P0\]**

The task may dissolve into approximately 240 instanced particles.

Particles:

- inherit motion,
- move outward,
- drift upward,
- fade,
- disappear.

Performance must remain stable during the effect.

**F-405 — Completion Sound \[P0\]**

Completion uses a warm, low chime.

Baseline:

- C3
- G3
- C4
- approximately 30ms stagger
- approximately 1.2s decay

Ambient audio should momentarily yield space to the completion sound.

The sound must play exactly once.

**F-406 — Completion Feedback \[P0\]**

After completion, a subtle 3D feedback element may appear.

Example:

\[Task\] released.

Optional remaining-task information may be shown, but it must never become a guilt counter.

Avoid language such as:

- "Only 3 left!"
- "You still have 8!"
- "You're behind!"

The feedback should acknowledge completion rather than create pressure.

**F-407 — Undo \[P0\]**

Completion can be undone for a short window.

Baseline:

**5 seconds**

Undo must:

- restore the task,
- restore prior position,
- restore relevant task state,
- cancel completion consequences where possible,
- visually rematerialize the node.

**13.5 TASK EDITING — F-500**

**F-501 — Focus Mode \[P0\]**

Double-clicking a task enters Focus mode.

Camera:

- moves toward the node,
- uses cinematic interpolation,
- maintains spatial continuity.

Other nodes become visually quieter.

The focused task becomes dominant without completely destroying environmental context.

**F-502 — In-World Edit Panel \[P0\]**

A 3D frosted-glass panel appears near the focused node.

Fields:

- Title
- Notes
- Due date
- Priority
- Ring
- Recurrence

The panel should remain spatially attached to the task.

**F-503 — Autosave \[P0\]**

Changes should save automatically.

Save triggers:

- field blur,
- explicit completion of editing,
- camera exit,
- debounced change persistence.

No conventional Save button is required.

**F-504 — Priority \[P0\]**

Priority should be represented visually.

Priority levels:

- 0 — dormant
- 1 — normal
- 2 — important
- 3 — high attention

Priority should influence:

- accent,
- ring behavior,
- subtle motion.

Priority must never become:

- a red warning,
- an "urgent!" badge,
- a guilt mechanism.

**F-505 — Due Date \[P0\]**

Due dates should influence spatial representation.

The system may use orbital proximity and subtle visual changes rather than defaulting to a conventional calendar grid.

The actual date remains available through editing.

**F-506 — Notes \[P0\]**

Notes support:

- plain text,
- multiline input,
- persistence.

Markdown is not required for V1.

**13.6 TASK DELETION — F-600**

**F-601 — Drag to Sky \[P0\]**

A task may be archived by dragging it beyond the Someday ring.

As it travels outward:

- saturation decreases,
- brightness decreases,
- connection to the active world weakens.

**F-602 — Departure Animation \[P0\]**

On release:

1. node shrinks,
2. node fades,
3. node disappears,
4. a subtle particle trace remains.

The animation should feel like departure, not destruction.

**F-603 — Undo \[P0\]**

Deletion/archive is reversible for the same short undo window.

**F-604 — Soft Delete \[P0\]**

Deletion must not immediately destroy data.

The task enters:

**Archived**

Archived tasks remain recoverable.

**13.7 RECURRING TASKS — F-700**

**F-701 — Basic Recurrence \[P0\]**

Supported patterns:

- none,
- daily,
- weekly,
- monthly.

When a recurring task is completed:

1. the current occurrence enters completion history,
2. the next occurrence is scheduled,
3. the new active task inherits the appropriate spatial identity.

**F-702 — Recurrence Visualization \[P1\]**

Recurring tasks may have a subtle secondary ring.

The distinction should be visible without becoming decorative clutter.

**F-703 — Advanced Recurrence \[P2\]**

Possible future support:

- every N days,
- selected weekdays,
- monthly day-of-month rules.

Only implement if the simpler recurrence model remains clean.

**13.8 VIEWS & NAVIGATION — F-800**

Orbit contains four primary spatial states.

**F-801 — Orbit View \[P0\]**

Default state.

Characteristics:

- all rings visible,
- Core visible,
- broad environmental context,
- tasks spatially distributed.

Baseline camera:

- radius approximately 12,
- downward angle approximately 25°.

**F-802 — Focus View \[P0\]**

Focused state.

Baseline:

- camera radius approximately 2.5,
- focused node enlarged,
- surrounding nodes subdued.

Escape returns to the previous state.

**F-803 — Timeline View \[P0\]**

Timeline converts temporal information into spatial information.

Tasks are arranged chronologically.

The timeline must remain visually consistent with Orbit rather than becoming a conventional calendar UI.

Keyboard:

T

**F-804 — Aurora View \[P0\]**

Aurora View emphasizes completed-task history.

Keyboard:

A

It displays recent completion traces, with a baseline history horizon of seven days.

**F-805 — Cinematic Transitions \[P0\]**

Camera movement must never feel like arbitrary teleportation.

Transitions should use:

- smooth interpolation,
- controlled easing,
- subtle depth-of-field changes where supported,
- restrained bloom,
- optional audio movement.

Baseline duration:

approximately 1.2 seconds.

The transition system must be centralized so that all view changes share consistent behavior.

**F-806 — Keyboard Navigation \[P0\]**

Required baseline shortcuts:

| **Key**    | **Action**            |
| ---------- | --------------------- |
| N          | New task              |
| T          | Timeline              |
| A          | Aurora                |
| Esc        | Exit focus / cancel   |
| Space      | Complete focused task |
| Enter      | Focus selected task   |
| Tab        | Cycle tasks           |
| Arrow keys | Move selection        |
| M          | Toggle sound          |

Shortcuts must not interfere with text editing fields.

**13.9 DATA, SYNC & OFFLINE — F-900**

**F-901 — Persistence \[P0\]**

Tasks must survive:

- reload,
- browser restart,
- device change,
- temporary network loss,
- normal application updates.

**F-902 — Cross-Device Synchronization \[P0\]**

Changes made on one device should propagate to another active device without requiring a manual refresh.

Target:

approximately a few seconds under normal connectivity.

**F-903 — Offline-First Operation \[P0\]**

Orbit must remain usable when temporarily offline.

The application should:

1. load the last known state,
2. permit local mutations,
3. record pending operations,
4. reconnect automatically,
5. synchronize pending operations,
6. reconcile conflicts.

Offline mode should be communicated subtly.

Do not display an aggressive warning banner.

**F-904 — Optimistic Interaction \[P0\]**

User actions should update locally first.

Network latency must not make basic interactions feel slow.

Server synchronization occurs afterward.

**F-905 — Conflict Resolution \[P0\]**

Because Orbit is single-user but may have multiple devices, synchronization conflicts are still possible.

The system should use a deterministic conflict strategy.

For example:

- operation ordering,
- timestamps,
- version numbers,
- mutation IDs.

The exact implementation may vary, but the rule must be deterministic.

A task must never randomly duplicate, disappear, or revert without an explainable state transition.

**F-906 — Export \[P0\]**

The owner must be able to export all task data as machine-readable JSON.

Export should include:

- task identity,
- title,
- notes,
- dates,
- recurrence,
- priority,
- state,
- spatial position,
- relevant metadata.

**F-907 — Import \[P1\]**

A valid Orbit JSON export should be restorable.

Import must validate the data before mutation.

Invalid or partially corrupt imports must not destroy existing data.

**13.10 AUDIO — F-1000**

**F-1001 — Ambient Bed \[P0\]**

Baseline:

- deep low-frequency foundation,
- soft atmospheric pad,
- D-minor tonal center,
- approximately -30dB starting point.

Audio must begin only after browser interaction rules permit playback.

**F-1002 — Interaction Sounds \[P0\]**

Interactions may use subtle synthesized tones.

Frequency range:

approximately 130–440Hz.

Sound should remain:

- soft,
- sparse,
- consistent,
- non-annoying.

Not every micro-interaction needs a sound if doing so creates noise.

**F-1003 — Completion Chime \[P0\]**

Completion receives a distinct sonic identity.

**F-1004 — Sound Toggle \[P0\]**

M toggles audio.

Preference persists locally.

**F-1005 — Sound Captions \[P1\]**

Optional textual indicators may describe meaningful sound events.

Disabled by default.

**13.11 ACCESSIBILITY — F-1100**

Accessibility must not be treated as an afterthought.

The 3D environment is the primary interface, but equivalent semantic access must exist.

**F-1101 — Reduced Motion \[P0\]**

Respect:

prefers-reduced-motion

Changes include:

- disable camera drift,
- simplify particle effects,
- replace complex dissolves with fades,
- reduce transition duration,
- preserve semantic feedback.

**F-1102 — Keyboard Access \[P0\]**

Every core task operation must be possible without pointer input.

**F-1103 — High Contrast \[P0\]**

High-contrast mode should:

- increase text contrast,
- reduce bloom,
- reduce decorative effects where necessary,
- preserve semantic distinctions.

**F-1104 — Non-Color Differentiation \[P0\]**

Priority must not rely exclusively on color.

Use combinations of:

- shape,
- ring structure,
- motion,
- size,
- pattern.

**F-1105 — Screen Reader Representation \[P0\]**

The 3D scene should have a semantic HTML representation.

The 3D canvas itself can be hidden from assistive technology where appropriate.

The mirrored semantic interface should expose:

- task titles,
- state,
- priority,
- due date,
- actions,
- completion,
- editing,
- archive/restore.

The user should be able to understand and modify tasks without seeing the 3D scene.

**13.12 PWA & DEPLOYMENT — F-1200**

**F-1201 — Installable PWA \[P0\]**

Provide:

- manifest,
- icons,
- service worker,
- offline shell,
- installation metadata.

The experience should support modern:

- iOS,
- Android,
- Windows,
- macOS,
- Linux browsers.

Exact platform capabilities should follow current browser support rather than being assumed.

**F-1202 — Low-Cost Deployment \[P0\]**

Deployment should prioritize:

- free/low-cost tiers,
- reliability,
- simplicity,
- portability.

Infrastructure choices should not become permanent product dependencies.

**F-1203 — Custom Domain \[P1\]**

Optional personal domain.

**F-1204 — HTTPS \[P0\]**

All network traffic must use HTTPS.

**F-1205 — No Analytics \[P0\]**

Orbit must not include:

- Google Analytics,
- advertising trackers,
- session recording,
- behavioral profiling,
- third-party telemetry.

**14\. NON-FUNCTIONAL REQUIREMENTS**

**14.1 PERFORMANCE**

**NFR-101 \[P0\]**

Target smooth rendering around **60fps** on representative modern devices.

Performance must be evaluated on:

- representative iPhone hardware,
- modern Android,
- modern laptop,
- mid-range desktop.

The requirement is a target, not permission to ignore device-specific limitations.

**NFR-102 \[P0\]**

Target draw calls:

**≤ 80**

unless measured profiling demonstrates a justified exception.

**NFR-103 \[P0\]**

Target geometry:

**≤ 250k visible triangles** in normal Orbit view.

**NFR-104 \[P0\]**

Target active particles:

**≤ 2,000**

using instancing where practical.

**NFR-105 \[P0\]**

Initial meaningful content should appear rapidly on normal broadband/mobile conditions.

**NFR-106 \[P0\]**

Core interaction should become usable within approximately three seconds on a reasonable modern connection.

**NFR-107 \[P1\]**

Target compressed JavaScript bundle:

**< 1.5MB gzipped**

where practical.

If 3D dependencies exceed this, optimize based on measured impact rather than blindly sacrificing functionality.

**NFR-108 \[P1\]**

Target strong Lighthouse performance.

A score around 90+ is desirable, but real interaction performance takes precedence over synthetic score optimization.

**14.2 RELIABILITY**

**NFR-201 \[P0\]**

No expected normal user action should result in silent data loss.

**NFR-202 \[P0\]**

Offline mutations must survive browser refresh where technically practical.

**NFR-203 \[P0\]**

Errors should be observable during development without introducing third-party tracking into production.

**NFR-204 \[P1\]**

Automated database backups should exist where supported by the selected infrastructure.

**14.3 SECURITY**

**NFR-301 \[P0\]**

All authenticated server operations must verify authorization.

**NFR-302 \[P0\]**

Database access must enforce row-level authorization.

**NFR-303 \[P0\]**

No private secrets may be shipped in the frontend.

**NFR-304 \[P0\]**

HTTPS everywhere.

**NFR-305 \[P1\]**

Basic abuse/rate protection should exist even though the application is single-user.

This protects against:

- accidental request loops,
- runaway synchronization,
- malicious access if the endpoint becomes exposed.

**NFR-306 \[P0\]**

Authentication should use a secure mechanism appropriate to the deployment.

A hardcoded frontend passphrase must not be used as a security mechanism.

If a simpler personal-auth mechanism is desired, it must still protect the backend and database properly.

**14.4 PRIVACY**

**NFR-401 \[P0\]**

No third-party analytics.

**NFR-402 \[P0\]**

No selling or sharing of task data.

**NFR-403 \[P0\]**

Minimize third-party dependencies.

**NFR-404 \[P0\]**

Owner can export their data.

**NFR-405 \[P0\]**

Owner can permanently delete their data.

**14.5 MAINTAINABILITY**

**NFR-501 \[P0\]**

TypeScript strict mode.

**NFR-502 \[P0\]**

Avoid any.

Any unavoidable escape hatch must be explicitly documented.

**NFR-503 \[P1\]**

ESLint + Prettier.

**NFR-504 \[P1\]**

Backend models must be typed and validated.

**NFR-505 \[P0\]**

Frontend code should use feature/domain-oriented organization.

**NFR-506 \[P1\]**

Automated tests should cover:

- task state transitions,
- completion,
- undo,
- recurrence,
- persistence,
- synchronization,
- import/export.

**15\. TECHNICAL ARCHITECTURE**

**15.1 Frontend**

Preferred baseline:

| **Layer**    | **Technology**                                   |
| ------------ | ------------------------------------------------ |
| Framework    | React + TypeScript                               |
| Build        | Vite                                             |
| 3D           | Three.js + React Three Fiber                     |
| Helpers      | Drei                                             |
| State        | Zustand                                          |
| Server state | TanStack Query                                   |
| Animation    | React Spring / appropriate R3F animation tooling |
| 3D Text      | Troika                                           |
| Audio        | Web Audio API / Howler where useful              |
| Styling      | Minimal CSS/Tailwind                             |
| PWA          | Vite PWA tooling                                 |

The specific library should remain replaceable if a better implementation is discovered.

The experience is the requirement.

The library is an implementation detail.

**16\. ARCHITECTURAL BOUNDARIES**

The application should be separated into clear domains.

**Scene**

Responsible for:

- Core,
- rings,
- task nodes,
- particles,
- lights,
- environment.

**Choreography**

Responsible for:

- create,
- complete,
- delete,
- camera transitions.

**State**

Responsible for:

- current scene state,
- selected task,
- focused task,
- interaction state.

**Data**

Responsible for:

- queries,
- mutations,
- synchronization,
- persistence.

**Audio**

Responsible for:

- ambient bed,
- interaction sound,
- completion sound.

**Accessibility**

Responsible for:

- semantic task representation,
- keyboard interaction,
- screen-reader behavior.

**UI**

Responsible only for genuinely 2D surfaces.

The 3D scene should not become a dumping ground for unrelated application logic.

**17\. DATA MODEL**

The task model should conceptually include:

Task

├── id

├── owner_id

├── title

├── notes

├── ring

├── priority

├── status

├── due_at

├── recurrence

├── created_at

├── updated_at

├── completed_at

├── archived_at

├── orbit_angle

├── orbit_radius

├── orbit_height

└── version / mutation metadata

**18\. DATABASE MODEL**

A relational database is appropriate.

Baseline conceptual schema:

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

recurrence text

check (

recurrence is null

or recurrence in (

'daily',

'weekly',

'monthly'

)

),

created_at timestamptz not null default now(),

updated_at timestamptz not null default now(),

completed_at timestamptz,

archived_at timestamptz,

orbit_angle real,

orbit_radius real,

orbit_height real,

version bigint not null default 1

);

Indexes:

create index tasks_user_status_idx

on tasks (user_id, status);

create index tasks_user_ring_idx

on tasks (user_id, ring);

create index tasks_user_due_idx

on tasks (user_id, due_at);

**19\. EVENT / MUTATION HISTORY**

A lightweight event table may be used for synchronization and debugging:

create table task_events (

id bigserial primary key,

task_id uuid not null

references tasks(id)

on delete cascade,

user_id uuid not null,

event_type text not null,

payload jsonb not null,

created_at timestamptz not null default now()

);

Events should not become a hidden analytics system.

Their purpose is:

- synchronization,
- recovery,
- debugging,
- deterministic mutation handling.

**20\. API MODEL**

The API should remain intentionally small.

GET /tasks

POST /tasks

GET /tasks/{id}

PATCH /tasks/{id}

POST /tasks/{id}/complete

POST /tasks/{id}/restore

POST /tasks/{id}/archive

POST /tasks/{id}/unarchive

GET /events

GET /export

POST /import

Every protected operation requires authentication.

**21\. FRONTEND STRUCTURE**

Recommended structure:

orbit/

│

├── frontend/

│ ├── src/

│ │

│ ├── scene/

│ │ ├── Core.tsx

│ │ ├── OrbitRing.tsx

│ │ ├── TaskNode.tsx

│ │ ├── CompletionZone.tsx

│ │ ├── Aurora.tsx

│ │ ├── Particles.tsx

│ │ ├── Environment.tsx

│ │ └── Lights.tsx

│ │

│ ├── choreography/

│ │ ├── complete.ts

│ │ ├── create.ts

│ │ ├── delete.ts

│ │ ├── focus.ts

│ │ └── camera.ts

│ │

│ ├── task/

│ │ ├── model.ts

│ │ ├── selectors.ts

│ │ ├── mutations.ts

│ │ └── validation.ts

│ │

│ ├── state/

│ │ ├── sceneStore.ts

│ │ ├── taskStore.ts

│ │ └── preferenceStore.ts

│ │

│ ├── data/

│ │ ├── api.ts

│ │ ├── queries.ts

│ │ ├── mutations.ts

│ │ ├── sync.ts

│ │ └── offlineQueue.ts

│ │

│ ├── camera/

│ │ └── cameraStateMachine.ts

│ │

│ ├── audio/

│ │ ├── ambient.ts

│ │ ├── interaction.ts

│ │ └── completion.ts

│ │

│ ├── ui/

│ │ └── ...

│ │

│ ├── a11y/

│ │ ├── AccessibleTaskList.tsx

│ │ └── keyboard.ts

│ │

│ └── app/

│ ├── App.tsx

│ └── bootstrap.ts

│

├── backend/

│ ├── app/

│ │ ├── main.py

│ │ ├── models.py

│ │ ├── schemas.py

│ │ ├── auth.py

│ │ ├── db.py

│ │ └── routes/

│ │

│ └── migrations/

│

├── docs/

│ ├── PRD.md

│ ├── UI-UX.md

│ ├── CHOREOGRAPHY.md

│ ├── ARCHITECTURE.md

│ └── TESTING.md

│

└── README.md

**22\. DESIGN SYSTEM**

**22.1 Color Philosophy**

Orbit should avoid:

- pure black,
- pure white,
- aggressive red,
- neon overload,
- excessive saturation.

The visual environment should feel:

- twilight,
- atmospheric,
- restrained,
- cinematic,
- slightly mysterious,
- peaceful.

**22.2 Typography**

Baseline:

**Display**

Fraunces or another expressive variable serif.

**Body**

Inter or equivalent neutral sans-serif.

**Numeric / technical**

JetBrains Mono.

Avoid excessive font-weight variation.

Maximum baseline:

**600**

**23\. MOTION SYSTEM**

Orbit's motion should use a small vocabulary.

**cinematic**

Used for:

- camera transitions,
- entering views,
- leaving views.

**settle**

Used when:

- objects return to rest,
- newly created tasks find their position.

**overshoot**

Used for:

- undo,
- materialization,
- spring-back.

**dissolve**

Used for:

- completion,
- departure.

**anticipate**

Used for:

- wind-up before major movement.

Motion should communicate state, not decorate every interaction.

**24\. CHOREOGRAPHY PRINCIPLE**

Every major animation should ideally consist of at least three connected layers:

**Primary**

The main object movement.

**Secondary**

Supporting visual reaction.

**Ambient**

Environmental response.

Example:

Task completion:

**Primary:** task dissolves.

**Secondary:** completion zone contracts.

**Ambient:** nearby particles respond and the ambient sound briefly changes.

This makes the world feel interconnected.

**25\. SPATIAL DESIGN RULES**

**Rule 1**

The Core should remain spatially meaningful.

**Rule 2**

Rings must remain distinguishable.

**Rule 3**

Tasks should not overlap excessively.

**Rule 4**

Important tasks should not become visually indistinguishable from background decoration.

**Rule 5**

Decorative effects must never obscure interaction.

**Rule 6**

Spatial memory must be stable.

**Rule 7**

The environment should have visual hierarchy even when many tasks exist.

**26\. TASK DENSITY**

The application must gracefully handle increasing numbers of tasks.

As density rises:

1. labels reduce,
2. decorative detail reduces,
3. distant nodes simplify,
4. LOD increases,
5. spatial separation is maintained,
6. Focus mode becomes more useful.

The application should not simply render every task at maximum visual complexity.

**27\. LEVEL OF DETAIL**

Task nodes should support multiple LOD states.

**Near**

Full node + ring + label.

**Medium**

Simplified node + ring.

**Far**

Simplified luminous point.

**Extremely far**

Minimal representation.

LOD should be based on:

- camera distance,
- importance,
- focus state.

**28\. MOBILE EXPERIENCE**

Mobile is not merely a shrunken desktop.

Touch interaction must be designed deliberately.

Baseline interactions:

- tap → select/focus,
- drag → manipulate,
- pinch → camera scale/navigation,
- gesture → view transition,
- long press where necessary.

Touch targets must remain large enough for reliable interaction.

Avoid relying on hover.

Any feature that only works through hover must have a touch equivalent.

**29\. DESKTOP EXPERIENCE**

Desktop supports:

- mouse hover,
- drag,
- double-click,
- keyboard shortcuts,
- precise task placement,
- keyboard navigation.

Keyboard interaction should feel first-class rather than an accessibility afterthought.

**30\. RESPONSIVENESS**

Orbit must adapt its scene composition to viewport dimensions.

The application should not simply scale the entire desktop scene down.

Camera framing, task density, labels, and interaction zones should adapt.

**31\. ERROR HANDLING**

Errors must preserve calmness.

Do not use:

- giant red error banners,
- alarming language,
- unnecessary modal dialogs.

Prefer:

- subtle state changes,
- gentle retry indicators,
- reversible actions,
- automatic recovery.

Example:

Instead of:

ERROR! SYNC FAILED!

Prefer a subtle state indicating:

syncing…

and retry automatically.

**32\. EMPTY STATE**

An empty Orbit should still feel intentional.

If no tasks exist:

- Core remains,
- environment remains,
- rings remain,
- atmosphere remains.

A subtle visual invitation may appear:

Seed something.

No tutorial carousel is required.

No onboarding wizard.

No checklist explaining the interface.

The interface should teach through interaction.

**33\. LOADING EXPERIENCE**

Loading should preserve immersion.

Avoid a conventional application loading screen whenever possible.

Preferred sequence:

1. Environment appears,
2. Core stabilizes,
3. rings appear,
4. task data resolves,
5. nodes materialize into their remembered positions.

The user should feel as if the world is becoming present rather than an application loading files.

**34\. DATA INTEGRITY RULES**

The following are absolute:

1. A confirmed task should never silently disappear.
2. Completion must be reversible during the undo window.
3. Archive must not mean permanent destruction.
4. Offline work must not silently vanish.
5. Synchronization must be deterministic.
6. Import must validate before replacing data.
7. Export must represent the complete recoverable task state.
8. Database authorization must protect every user's data boundary, even though only one user is expected.

**35\. SECURITY MODEL**

The fact that Orbit is personal does not justify insecure architecture.

Do not:

- expose database credentials,
- place service-role keys in frontend code,
- trust client-provided user IDs,
- rely on frontend-only authentication,
- disable database authorization.

The single-user nature reduces complexity.

It does not eliminate security requirements.

**36\. ACCESSIBILITY PHILOSOPHY**

Accessibility should not destroy the visual concept.

Instead:

**3D world = primary experiential interface**

**semantic HTML = equivalent functional interface**

The two representations should remain synchronized.

A user who cannot use the 3D environment should still be able to:

- see tasks,
- select tasks,
- edit tasks,
- complete tasks,
- archive tasks,
- restore tasks.

**37\. AUDIO PHILOSOPHY**

Audio is environmental, not notification-driven.

It should create:

- presence,
- weight,
- continuity,
- completion resonance.

Avoid:

- loud alerts,
- repetitive beeps,
- game-like sound effects,
- constant interaction sounds.

Silence is also part of the design.

**38\. SUCCESS CRITERIA**

Orbit does not use conventional product metrics.

Success is evaluated through the owner's experience.

Periodic questions:

1. Does opening Orbit feel calm?
2. Does the environment still feel beautiful?
3. Does completing a task feel meaningful?
4. Does spatial placement remain useful?
5. Does the application remain easy to understand?
6. Does it reduce administrative friction?
7. Does the owner naturally choose it for task management?
8. Has unnecessary complexity accumulated?
9. Is there anything that should be removed?
10. Would the owner willingly continue using it?

The goal is not maximizing usage.

The goal is creating an environment the owner genuinely wants to use.

**39\. ANTI-METRICS**

Orbit must not optimize around:

- daily active users,
- session length,
- retention,
- streak length,
- number of completed tasks,
- notifications opened,
- time spent in application,
- engagement,
- productivity scores.

The absence of these metrics is intentional.

**40\. QUALITY BAR**

A feature is not complete merely because it works.

Every major feature should pass four dimensions:

**Functional**

Does it work?

**Visual**

Does it look correct?

**Physical**

Does the interaction feel coherent?

**Emotional**

Does it preserve Orbit's calm identity?

A feature that passes only the first criterion is incomplete.

**41\. DEVELOPMENT PRIORITY**

The project should be built in the order of **experience risk**, not merely technical dependency.

The most important unknown is:

**Does the central interaction actually feel good?**

Therefore the signature completion choreography must be prototyped early.

**42\. DEVELOPMENT MILESTONES**

**M0 — Technical Foundation**

Deliver:

- repository,
- TypeScript configuration,
- Vite,
- R3F,
- scene bootstrap,
- basic state system,
- development tooling.

Goal:

A stable technical foundation.

**M1 — World**

Deliver:

- twilight environment,
- lighting,
- fog,
- floor,
- Core,
- rings,
- particles.

Goal:

The world already feels like Orbit before tasks exist.

**M2 — Camera System**

Deliver:

- Orbit,
- Focus,
- Timeline,
- Aurora camera states,
- transition system.

Goal:

Spatial navigation feels coherent.

**M3 — Task Nodes**

Deliver:

- nodes,
- labels,
- priority,
- idle motion,
- hover,
- focus,
- spatial placement.

Goal:

Tasks genuinely feel like objects.

**M4 — COMPLETION CHOREOGRAPHY**

This is the highest experiential milestone.

Deliver:

- grab,
- drag,
- completion zone,
- release,
- dissolve,
- particle transition,
- completion sound,
- settle,
- undo.

**Do not rush M4.**

If this interaction feels wrong, stop and improve it.

Do not compensate for a weak central interaction by building more features.

**M5 — Creation**

Deliver:

- Seed,
- drag placement,
- inline naming,
- ring assignment,
- persistence.

**M6 — Data Layer**

Deliver:

- authentication,
- database,
- CRUD,
- validation,
- authorization,
- export/import.

**M7 — Sync & Offline**

Deliver:

- local cache,
- mutation queue,
- realtime synchronization,
- conflict handling,
- reconnect behavior.

**M8 — Editing**

Deliver:

- Focus mode,
- 3D editing panel,
- notes,
- priority,
- due dates,
- recurrence.

**M9 — Audio**

Deliver:

- ambient,
- interactions,
- completion,
- mute,
- preference persistence.

**M10 — Accessibility**

Deliver:

- keyboard,
- reduced motion,
- high contrast,
- non-color priority indicators,
- semantic task mirror,
- screen-reader support.

**M11 — Mobile**

Deliver:

- touch gestures,
- responsive framing,
- touch-safe controls,
- mobile performance optimization.

**M12 — Final Polish**

Deliver:

- Aurora,
- visual refinement,
- spatial collision refinement,
- LOD,
- performance optimization,
- subtle environmental details,
- error recovery,
- final interaction polish.

**43\. MILESTONE RULE**

After each major milestone:

**Use the actual application.**

Do not evaluate it only from code.

Live with it.

Use it for real tasks.

Observe:

- what feels natural,
- what feels annoying,
- what feels unnecessary,
- what breaks immersion,
- what creates friction.

Then improve before continuing.

**44\. TESTING STRATEGY**

Testing should occur at multiple levels.

**Unit Tests**

Test:

- recurrence calculations,
- task state transitions,
- validation,
- serialization,
- import/export,
- conflict resolution.

**Integration Tests**

Test:

- database operations,
- authentication,
- synchronization,
- offline queue,
- restoration.

**Visual Tests**

Check:

- scene composition,
- node states,
- camera transitions,
- completion choreography.

**Performance Tests**

Measure:

- FPS,
- draw calls,
- memory,
- CPU,
- GPU,
- load time,
- interaction latency.

**Real Device Tests**

At minimum test representative:

- iPhone,
- Android,
- laptop,
- desktop browser.

**45\. PERFORMANCE TESTING PRINCIPLE**

Never optimize purely from assumptions.

Measure.

The following should be profiled:

- initial scene,
- many tasks,
- completion effect,
- Aurora,
- mobile rendering,
- camera transitions,
- offline synchronization,
- audio.

The application should degrade gracefully when hardware is weaker.

**46\. RISK REGISTER**

| **Risk**                                                 | **Probability** | **Impact** | **Response**                                        |
| -------------------------------------------------------- | --------------- | ---------- | --------------------------------------------------- |
| Mobile 3D performance is poor                            | Medium          | High       | Profile early; LOD; reduce effects                  |
| Completion choreography feels wrong                      | Medium          | Critical   | Prototype M4 early                                  |
| 3D interaction becomes confusing                         | Medium          | High       | Test with real usage                                |
| Too many tasks create visual clutter                     | High            | High       | Density rules + LOD                                 |
| Offline synchronization becomes complex                  | Medium          | High       | Define deterministic mutation model early           |
| Infrastructure pricing changes                           | Medium          | Medium     | Keep deployment portable                            |
| Scope creep                                              | High            | High       | Protect scope boundaries                            |
| App becomes visually impressive but practically annoying | Medium          | Critical   | Weekly real-use testing                             |
| Accessibility becomes difficult in 3D                    | Medium          | High       | Build semantic mirror from early stages             |
| Audio becomes repetitive                                 | Medium          | Medium     | Keep sound sparse                                   |
| Owner stops using the application                        | Medium          | High       | Improve core experience rather than adding features |
| Development burnout                                      | Medium          | High       | Build incrementally; avoid artificial deadlines     |

**47\. SCOPE CREEP DEFENSE**

Before adding a feature, ask:

**Question 1**

Does this solve a real problem the owner currently has?

**Question 2**

Does it strengthen Orbit's spatial model?

**Question 3**

Does it preserve calmness?

**Question 4**

Can the existing system solve the problem without another feature?

**Question 5**

Will this feature introduce permanent maintenance cost?

**Question 6**

Would I still want this feature if no one else ever saw Orbit?

If the answer to the final question is no, the feature requires very strong justification.

**48\. DESIGN DECISION RULE**

When two technically valid approaches exist, prefer the one that:

1. feels more natural,
2. has fewer concepts,
3. creates less UI clutter,
4. preserves spatial continuity,
5. is easier to reverse,
6. performs better,
7. creates less long-term maintenance.

**49\. WHAT ORBIT SHOULD FEEL LIKE**

Orbit should feel:

- quiet,
- atmospheric,
- physical,
- spatial,
- personal,
- deliberate,
- slightly mysterious,
- beautiful,
- responsive,
- alive.

**50\. WHAT ORBIT SHOULD NEVER FEEL LIKE**

Orbit should never feel like:

- Excel,
- email,
- a corporate dashboard,
- a mobile game,
- a social network,
- a notification center,
- a project-management suite,
- a leaderboard,
- a productivity competition,
- a surveillance system,
- a complicated configuration tool.

**51\. OPEN DECISIONS**

These should be resolved during implementation rather than left ambiguous.

**51.1 Authentication**

Preferred direction:

Use proper authentication backed by the database.

Do not use a frontend hardcoded password.

**51.2 Recurrence**

Recommended semantic model:

When an occurrence is completed:

- mark that occurrence complete,
- create the next occurrence,
- preserve recurrence metadata,
- avoid duplicate generation.

**51.3 Timeline Geometry**

The timeline may initially use a linear spatial representation.

A spiral can be explored only if it improves readability without creating unnecessary complexity.

**51.4 Aurora**

Aurora should be visible in the environment subtly when meaningful completion history exists and should have a dedicated Aurora view for deeper inspection.

**51.5 Undo**

Baseline:

**5 seconds**

This can be adjusted after real-world use.

**51.6 Sound Source**

Prefer synthesized or lightweight audio where it provides sufficient quality.

The objective is not collecting a large audio library.

**51.7 Mobile Gesture Model**

Use the smallest gesture vocabulary that remains discoverable.

Avoid requiring users to memorize complex gestures.

**51.8 Export**

JSON is the canonical export format.

CSV is unnecessary unless a real need appears.

**51.9 Domain**

Domain choice is aesthetic and operational, not a product requirement.

Do not delay the application for domain selection.

**52\. FUTURE EXTENSIONS**

Potential extensions must preserve the existing philosophy.

**WebXR**

If introduced:

The VR environment should deepen the spatial metaphor rather than simply reproduce the desktop UI in VR.

**Voice**

Voice should accelerate creation, not replace the physical nature of task interaction.

**Ritual Mode**

A future ritual mode could provide a short daily review without becoming a productivity report.

**Procedural Audio**

Music could respond subtly to environmental state without turning tasks into game mechanics.

**53\. GLOSSARY**

**Orbit**  
The application and its spatial world.

**Core**  
The luminous center of the environment.

**Ring**  
A spatial task category.

**Today**  
Immediate task horizon.

**Week**  
Near-term task horizon.

**Someday**  
Longer-term task horizon.

**Node**  
A task represented as a physical object.

**Seed**  
A newly created task before placement.

**Aurora**  
The visual memory of completed tasks.

**Choreography**  
A coordinated multi-stage animation sequence.

**Focus**  
The state in which one task becomes the primary object of attention.

**Archive**  
A reversible inactive state for a task.

**Spatial Memory**  
Persistence of a task's location between sessions.

**Settle**  
The final stage of an interaction when the environment returns to equilibrium.

**54\. FINAL PRODUCT PRINCIPLES**

If this document becomes too large, implementation becomes difficult, or a future feature conflicts with an existing requirement, return to these principles.

**1.**

**Orbit is a place, not a list.**

**2.**

**Tasks are objects, not rows.**

**3.**

**Completion is an act, not a checkbox.**

**4.**

**The environment remembers.**

**5.**

**Calmness is a functional requirement.**

**6.**

**Beauty is valuable only when it serves usability.**

**7.**

**Motion must have meaning.**

**8.**

**Complex implementation should produce simple interaction.**

**9.**

**No feature exists merely because other productivity applications have it.**

**10.**

**The owner is the only stakeholder.**

**11.**

**The application must never manipulate the owner into using it.**

**12.**

**Data must remain safe, recoverable, and owned by the owner.**

**13.**

**Performance is part of the experience.**

**14.**

**Accessibility must provide an equivalent functional path.**

**15.**

**When in doubt, remove rather than add.**

**55\. DEFINITION OF DONE**

Orbit is not "done" when every checkbox in this document has been implemented.

Orbit is done when:

- the world loads cleanly,
- the Core feels meaningful,
- tasks feel like objects,
- creating a task feels natural,
- spatial placement remains persistent,
- focusing feels cinematic,
- completion feels physically satisfying,
- deletion feels reversible and gentle,
- synchronization is trustworthy,
- offline use does not lose work,
- the application performs well on the owner's real devices,
- keyboard and accessibility paths work,
- the visual system remains coherent,
- sound enhances rather than distracts,
- there is no unnecessary clutter,
- and the owner genuinely prefers using Orbit rather than returning to a conventional task list.

The final test is not:

"Does every requirement work?"

The final test is:

**"Does Orbit feel like the place it was meant to be?"**

If not, it is not finished.

**56\. OWNER'S PRODUCT CONTRACT**

Orbit exists for the owner.

Therefore:

- The owner may change the requirements.
- The owner may remove features.
- The owner may redesign the world.
- The owner may abandon an implementation approach.
- The owner may replace infrastructure.
- The owner may simplify the application.
- The owner may add something genuinely useful.

This document is a guide, not a prison.

However, any major change should be evaluated against the original vision.

If a proposed feature makes Orbit more like a conventional productivity application and less like a calm spatial environment, its inclusion should require deliberate justification.

**57\. FINAL STATEMENT**

**Orbit is not trying to make the owner work harder.**

**It is trying to make the act of carrying responsibilities feel lighter.**

A task enters the world.

It finds its place.

It waits.

The owner approaches it.

They act.

The task is released.

The world remembers.

Then everything becomes quiet again.

**Calm gravity. Quiet motion. Physical meaning.**

**END OF ORBIT PRD**

**Version 2.0 — Ultimate Master Specification**