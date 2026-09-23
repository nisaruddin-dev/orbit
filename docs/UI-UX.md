**UI/UX DESIGN DOCUMENT**

**Orbit — A Personal Immersive 3D To-Do Environment**

**Document Version:** 3.0 — Ultimate Experience Specification  
**Status:** Master Design Authority  
**Priority:** **Highest — Primary Experience Document**  
**Owner:** Sole designer, sole developer, sole user  
**Companion Documents:** PRD.md, TRD.md, CHOREOGRAPHY.md  
**Last Updated:** 2026

**0\. DOCUMENT AUTHORITY**

**0.1 Purpose**

This document is the **master sensory, visual, interaction, motion, audio, responsive, accessibility, and experiential contract** for Orbit.

The PRD defines:

**What Orbit is and why it exists.**

The TRD defines:

**How Orbit is technically built.**

The Choreography document defines:

**Exact animation timelines and sequencing.**

This document defines:

**What Orbit must feel like at every moment.**

It is therefore not merely a style guide.

It is not merely a component library.

It is not merely a visual specification.

It is the **experience constitution of Orbit**.

If an implementation is technically correct but feels wrong, this document wins.

If an implementation looks beautiful but violates interaction principles, this document wins.

If a feature is impressive but makes Orbit feel like a conventional productivity application, this document wins.

**1\. THE EXPERIENCE NORTH STAR**

**1.1 The Core Idea**

**Orbit turns loose ends into physical objects, gives them a place to exist, and makes completion feel like letting go.**

The owner should not feel as though they are opening a productivity dashboard.

They should feel as though they are **arriving somewhere**.

The application should behave less like software and more like a quiet physical environment.

**2\. THE THREE FEELINGS**

Every experience in Orbit exists to create three feelings:

**2.1 Arrival**

**"I have entered a place."**

Created through:

- gradual scene reveal
- atmospheric depth
- ambient sound
- stable spatial memory
- slow camera behavior
- absence of clutter
- no dashboard-style header
- no immediate task statistics
- no intrusive notifications

**2.2 Control**

**"I can move and shape this place."**

Created through:

- direct manipulation
- physical dragging
- spatial placement
- predictable movement
- immediate response
- editable task objects
- camera focus
- keyboard and touch equivalents
- meaningful object behavior

**2.3 Release**

**"I have let go of something."**

Created through:

- physical completion
- momentum
- magnetic completion zone
- particle dissolution
- sound resolution
- Aurora integration
- spatial rebalancing
- calm settling afterward

**2.4 Experience Rule**

Every major feature must strengthen at least one of these feelings.

A major feature that weakens all three should not exist.

**3\. THE EXPERIENCE ARC**

Every Orbit session follows this emotional progression:

| **Phase**   | **Target Feeling** | **Visual State**                   | **Interaction State**   |
| ----------- | ------------------ | ---------------------------------- | ----------------------- |
| Arrival     | Presence           | Scene emerges                      | Input gradually enabled |
| Orientation | Understanding      | Rings establish hierarchy          | Passive exploration     |
| Selection   | Intention          | One object gains emphasis          | Hover/focus             |
| Action      | Control            | Scene reacts physically            | Manipulation            |
| Release     | Relief             | Object leaves the system           | Completion              |
| Settle      | Closure            | Environment returns to equilibrium | Undo available          |
| Departure   | Peace              | Scene remains quiet                | No guilt mechanism      |

The application must never rush the owner through these states.

**4\. THE THREE DESIGN LAWS**

**LAW I — PHYSICALITY**

Nothing important should behave like a checkbox.

Objects should have:

- mass
- momentum
- position
- proximity
- inertia
- response
- consequence

A task should feel like an object.

**LAW II — THE CHAIN**

Primary actions should propagate through the environment.

A major interaction should ideally contain:

1. **Primary reaction**
2. **Secondary reaction**
3. **Ambient reaction**

Example:

**Complete task**

→ task dissolves  
→ neighboring nodes rebalance  
→ Aurora reacts  
→ light changes  
→ sound resolves

The world should acknowledge what happened.

**LAW III — CALM**

Orbit must never become an alarm system.

Therefore:

- no aggressive red
- no flashing warnings
- no guilt language
- no streak pressure
- no attention-grabbing notification badges
- no excessive motion
- no visual shouting
- no unnecessary urgency

Urgency can exist semantically.

It must not become anxiety.

**5\. THE ORBIT VISUAL IDENTITY**

**5.1 Art Direction**

Orbit is:

**Twilight + cinematic + tactile + atmospheric + restrained + futuristic + human.**

It is not:

- cyberpunk
- neon
- sci-fi dashboard
- fantasy RPG
- space simulator
- glassmorphism showcase
- corporate SaaS
- game HUD

The aesthetic target is a **quiet cinematic environment**.

**6\. VISUAL HIERARCHY**

At any moment, the viewer should subconsciously understand:

**Level 1 — Where am I?**

The environment.

**Level 2 — What is important?**

The active task and relevant ring.

**Level 3 — What can I interact with?**

The focused object.

**Level 4 — What just happened?**

Secondary reactions.

**Level 5 — What can wait?**

Ambient information.

Nothing at Level 5 should visually compete with Level 2.

**7\. THE WORLD**

**7.1 Spatial Composition**

Orbit consists of:

AURORA

completed history

○

SOMEDAY RING

radius 10

WEEK RING

radius 7

TODAY RING

radius 4

CORE

"now"

The Core is the conceptual center.

The rings represent temporal proximity.

The Aurora represents release and history.

**8\. THE CORE**

**8.1 Visual**

The Core is:

- radius: approximately 0.4 world units
- matte
- softly emissive
- warm off-white
- extremely subtle pulse
- never flashy

It represents:

**Now.**

**8.2 Core Behavior**

The Core:

- anchors the camera
- acts as the origin for task creation
- responds subtly to major environmental events
- participates in completion feedback
- remains visually stable

The Core is **not a button**.

It must never look clickable.

**8.3 Core Idle Animation**

Cycle:

0.9 emissive

↓

1.1 emissive

↓

0.9 emissive

Duration:

**4 seconds**

Easing:

breathe

The pulse should be felt more than consciously noticed.

**9\. ORBIT RINGS**

**9.1 Ring System**

| **Ring** | **Radius** | **Semantic Meaning** |
| -------- | ---------- | -------------------- |
| Today    | 4          | Current attention    |
| Week     | 7          | Near future          |
| Someday  | 10         | Low-pressure future  |

**9.2 Ring Personality**

**Today**

- brightest
- most visually present
- slightly faster rotation

**Week**

- cooler
- dimmer
- slower

**Someday**

- restrained
- low contrast
- almost atmospheric

**9.3 Ring Behavior**

Rings should never dominate the scene.

They exist to provide:

**spatial orientation, not decoration.**

Their motion must remain below the viewer's attention threshold.

**10\. AURORA**

**10.1 Purpose**

The Aurora represents:

**Things that have already been released.**

It is not:

- a graph
- a statistics panel
- a progress chart
- a leaderboard
- a productivity metric

**10.2 Visual Character**

The Aurora is:

- diffuse
- mint-toned
- translucent
- slow
- atmospheric
- particle-based
- spatially distant

**10.3 Completion Relationship**

A completed task should visually travel:

Task

↓

Completion Zone

↓

Dissolution

↓

Particles

↓

Outer Space

↓

Aurora

This makes completion feel like a transformation rather than deletion.

**11\. THE VOID**

The environment is not black.

It is a twilight atmosphere.

**Gradient**

| **Region**        | **Color** |
| ----------------- | --------- |
| Upper sky         | #1B1E2B   |
| Mid/horizon       | #2A2F45   |
| Lower environment | #1E2233   |
| Extreme depth     | #0E0F16   |

The darkest colors should appear only where depth requires them.

**12\. DEPTH SYSTEM**

Orbit should communicate depth through several overlapping mechanisms:

1. Scale
2. Atmospheric fog
3. Contrast
4. Bloom
5. Depth of field
6. Occlusion
7. Motion parallax
8. Particle density
9. Lighting falloff
10. Spatial audio

No single technique should carry the entire sense of depth.

**13\. COLOR SYSTEM**

**13.1 Core Palette**

\--bg-void: #0E0F16;

\--bg-sky-top: #1B1E2B;

\--bg-sky-mid: #2A2F45;

\--bg-sky-low: #1E2233;

\--floor: #232738;

**13.2 Accent Palette**

\--accent-active: #7BD3EA;

\--accent-focus: #9B8CFF;

\--accent-done: #7FE7C4;

\--accent-urgent: #F2A67E;

\--accent-dormant: #5C6178;

**13.3 Meaning**

| **Color** | **Meaning**                 |
| --------- | --------------------------- |
| Cyan      | Present / active            |
| Violet    | Focus / important           |
| Mint      | Completed / released        |
| Amber     | Attention / error / urgency |
| Slate     | Dormant                     |

**13.4 Color Laws**

1. No pure red.
2. No pure black.
3. No pure white.
4. No saturated rainbow palette.
5. No more than three dominant accents in one frame.
6. Color must never be the sole carrier of meaning.
7. Brightness must remain restrained.

**14\. TYPOGRAPHY**

**14.1 Font Roles**

| **Role**  | **Font**       |
| --------- | -------------- |
| Display   | Fraunces       |
| Interface | Inter          |
| Numeric   | JetBrains Mono |

**14.2 Typography Philosophy**

Typography should feel:

- quiet
- precise
- human
- spatial
- lightweight

Avoid:

- oversized UI typography
- excessive bold
- aggressive labels
- all-caps interfaces

**14.3 Weight Rules**

Maximum:

**600**

Preferred:

- 400 body
- 500 interactive
- 300–400 display

**15\. TASK NODE SYSTEM**

The task node is the most important reusable visual object.

It must be instantly recognizable as:

**a thing that exists in space.**

**15.1 Node Anatomy**

LABEL

│

▼

┌─────────────┐

│ Orbital Ring│

│ ┌───────┐ │

│ │ Shell │ │

│ │ ┌───┐ │ │

│ │ │Core│ │ │

│ │ └───┘ │ │

│ └───────┘ │

└─────────────┘

**15.2 Layers**

**Layer 1 — Core**

Represents:

the task itself.

**Layer 2 — Shell**

Represents:

task state.

**Layer 3 — Orbital Ring**

Represents:

temporal/priority energy.

**Layer 4 — Label**

Represents:

human-readable identity.

**16\. TASK NODE STATES**

The visual state machine is:

Dormant

↓

Idle

↓

Hovered

↓

Focused

↓

In Progress

↓

Completing

↓

Completed

These states must transition rather than snap.

**17\. STATE VISUAL LANGUAGE**

| **State**   | **Scale** | **Shell**        | **Motion** | **Attention** |
| ----------- | --------- | ---------------- | ---------- | ------------- |
| Dormant     | 1.0       | almost invisible | minimal    | low           |
| Idle        | 1.0       | subtle           | gentle bob | neutral       |
| Hovered     | 1.06      | stronger         | active     | elevated      |
| Focused     | 2.0       | strong           | restrained | dominant      |
| In Progress | 1.05      | pulsing          | slow       | active        |
| Completing  | dynamic   | full             | energetic  | maximum       |
| Completed   | fading    | fading           | outward    | release       |

**18\. NODE IDLE BEHAVIOR**

No nodes should bob synchronously.

Each node receives:

- unique phase
- slightly different period
- small amplitude variation

Example:

Node A: 3.4s

Node B: 4.7s

Node C: 5.2s

Node D: 3.9s

The result should feel organic rather than mechanically synchronized.

**19\. NODE LABELS**

Labels are intentionally restrained.

Default:

hidden

Hover/focus:

visible

Label behavior:

- fade in
- billboard toward camera
- remain readable
- never rotate with the node
- truncate intelligently
- avoid collision with neighboring labels

Maximum default display:

**40 characters**

**20\. SMART LABEL PLACEMENT**

The label system should avoid:

- overlapping other labels
- crossing the Core
- clipping through objects
- extending outside the visible composition

If a collision occurs:

1. attempt vertical offset
2. attempt lateral offset
3. reduce label opacity slightly
4. shorten displayed text
5. never move the actual task node merely to accommodate text

**21\. PRIORITY SYSTEM**

Priority is:

0 → dormant

1 → normal

2 → important

3 → urgent

Priority should affect:

- subtle shell intensity
- orbital ring behavior
- emissive strength
- visual presence

Priority should **not** create:

- giant warning icons
- red states
- flashing
- alarm sounds
- aggressive animation

**22\. TEMPORAL MEANING**

The rings represent time.

The visual language should therefore make:

closer = more immediate

and:

farther = more distant

without requiring the owner to read labels.

**23\. SPATIAL MEMORY**

Task positions are part of the experience.

A task should return to approximately the same place after:

- reload
- logout/login
- device synchronization
- browser restart

The environment should feel like it remembers the owner.

**24\. EMPTY STATE**

The empty Orbit state is extremely important.

When there are no tasks:

The scene should **not** display:

"No tasks found."

Instead:

- Core remains visible
- rings remain faint
- Aurora remains absent
- atmosphere continues
- a subtle seed affordance may emerge after a short period

Optional contextual text:

**"Begin with one thing."**

This should appear only if the owner has never created a task.

After the owner has previously used Orbit, the scene should simply remain quiet.

**25\. FIRST-RUN EXPERIENCE**

The first session should not become a tutorial slideshow.

Instead:

**Step 1**

Scene appears.

**Step 2**

Core establishes itself.

**Step 3**

A seed quietly emerges.

**Step 4**

The environment demonstrates:

drag outward → place → name

**Step 5**

The owner takes over.

The tutorial should disappear permanently after successful first creation.

**26\. LOADING EXPERIENCE**

There should never be:

"Loading..."

in the center of the screen.

Instead:

1. background appears
2. Core fades in
3. rings emerge
4. atmosphere settles
5. tasks materialize gradually
6. scene reaches stable state

The owner should experience:

**arrival**

rather than waiting.

**27\. NETWORK STATE**

Offline status must not become an intrusive banner.

Use a tiny environmental signal:

- slightly cooler atmosphere
- small corner indicator
- subtle pulse

When reconnecting:

- indicator warms
- queued changes resolve
- no modal
- no interruption

**28\. ERROR EXPERIENCE**

Errors should feel like:

**the world gently resisting an action**

not:

**the software has failed dramatically.**

**28.1 Error Visual**

Use:

- amber
- soft pulse
- short message
- restrained sound

Example:

**"That change couldn't settle."**

Not:

ERROR 500  
REQUEST FAILED

Technical details belong in diagnostics, not the primary experience.

**29\. SERVER REJECTION**

If an optimistic action fails:

Owner action

↓

Immediate visual response

↓

Server rejection

↓

Node pauses

↓

Anticipation motion

↓

Returns to valid state

↓

Quiet explanation

Never teleport the node back.

**30\. OFFLINE EXPERIENCE**

Offline mode should feel almost identical to online mode.

The owner should still be able to:

- create tasks
- edit tasks
- move tasks
- complete tasks
- archive tasks

The difference should be:

synchronization is deferred.

Not:

the application is broken.

**31\. CAMERA PHILOSOPHY**

The camera is not merely a technical camera.

It is a **character**.

It should feel:

- intentional
- cinematic
- stable
- curious
- gentle

**32\. CAMERA STATES**

| **State** | **Purpose**          |
| --------- | -------------------- |
| Orbit     | Main environment     |
| Focus     | Single task          |
| Timeline  | Temporal exploration |
| Aurora    | Completed history    |

No unrestricted free-fly camera by default.

**33\. ORBIT CAMERA**

Default:

Position ≈ (0, 6, 12)

Target ≈ (0, 0, 0)

FOV ≈ 45°

The owner should immediately understand the entire environment.

**34\. FOCUS CAMERA**

Focus should feel like:

stepping closer to something meaningful.

Not:

opening another screen.

The world remains visible in the background.

**35\. CAMERA TRANSITIONS**

Transitions should use curved trajectories.

Never:

A ─────────────── B

Prefer:

A

\\

\\

C

\\

\\

B

This gives camera movement physical character.

**36\. CAMERA MOTION RULES**

Camera must:

- never roll
- never shake
- avoid sudden acceleration
- preserve horizon stability
- maintain subject framing
- respect reduced-motion settings

**37\. CAMERA INTERRUPTION**

Normal transitions may complete naturally.

However, interaction priority must remain with the owner.

Therefore:

- Esc may interrupt
- accessibility navigation may override
- emergency viewport recovery may interrupt
- destructive state transitions may temporarily lock conflicting inputs

No interaction should ever make the owner feel trapped.

**38\. MOUSE INTERACTION**

**Hover**

Hover is not merely a CSS highlight.

It triggers:

- slight scale
- shell activation
- label reveal
- subtle sound
- local environmental emphasis

**Click**

Single click:

select/focus depending on current state.

Double click:

enter Focus.

**Drag**

Dragging must feel continuous.

There should be:

- velocity
- spring
- inertia
- proximity influence
- magnetic zones

No snapping unless the interaction is intentionally settling.

**39\. COMPLETION ZONE**

The completion zone is the central ritual of Orbit.

It appears when the owner grabs a task.

It should feel as though the environment is saying:

**"You can let this go here."**

**40\. COMPLETION ZONE STATES**

**Hidden**

No visual presence.

**Appearing**

Soft emergence.

**Available**

Low glow.

**Approaching**

Magnetic particles activate.

**Near**

Glow intensifies.

**Valid release**

Maximum visual readiness.

**Completion**

Consumes task.

**Recovery**

Returns to hidden.

**41\. COMPLETION MAGNETISM**

Magnetism should increase continuously with distance.

Conceptually:

far away

↓

weak attraction

↓

moderate attraction

↓

strong attraction

↓

center pull

Never:

teleport node to target.

**42\. COMPLETION CHOREOGRAPHY**

The six-phase sequence remains canonical:

1. Reach
2. Grab
3. Drag
4. Release
5. Dissolve
6. Settle

But every phase should also contain:

- visual track
- physical track
- sound track
- environmental track
- accessibility equivalent

**43\. COMPLETION — REACH**

When the pointer approaches:

- node grows subtly
- shell activates
- label emerges
- soft audio appears
- local scene contrast increases

Response should feel immediate.

**44\. COMPLETION — GRAB**

On grab:

- node detaches naturally
- orbital momentum dissipates
- node follows pointer
- scene slightly de-emphasizes other objects
- completion zone emerges

No UI panel should appear.

**45\. COMPLETION — DRAG**

The task should feel alive.

It should:

- follow the pointer
- retain slight inertia
- respond to velocity
- create a subtle trail
- interact with completion-zone magnetism

**46\. COMPLETION — RELEASE**

Correct release:

physical continuation.

Incorrect release:

forgiving return.

The failure state should never feel punitive.

**47\. COMPLETION — DISSOLVE**

The node becomes:

solid

↓

glowing

↓

fracturing

↓

particles

↓

light

↓

Aurora

The dissolution is the emotional climax.

**48\. COMPLETION — SETTLE**

The world returns to equilibrium.

Neighboring tasks gently redistribute.

The Core settles.

The Aurora receives the released energy.

The sound resolves.

The owner receives a brief confirmation.

Then:

silence.

**49\. SETTLE MESSAGE**

The message must remain secondary.

Example:

**1 released**

Optional:

**3 remaining today**

Never:

YOU COMPLETED 1 TASK!!!

Never use:

- badges
- celebratory confetti
- score
- streak
- achievement popup

**50\. CREATION — THE SEED**

Task creation begins with a seed.

The seed is:

**possibility before commitment.**

It emerges from the Core.

**51\. SEED EXPERIENCE**

Core

↓

Seed emerges

↓

Seed becomes draggable

↓

Owner chooses location

↓

Seed settles

↓

Title appears

↓

Task becomes real

This should feel fundamentally different from:

click + form + submit.

**52\. TASK EDITING**

Editing must remain inside the world.

The Focus experience should feel like:

interacting with the object itself.

Not:

opening a separate application panel.

**53\. EDIT PANEL**

The panel may use:

- frosted glass
- translucent geometry
- soft depth
- spatial positioning

Fields:

- title
- notes
- due date
- priority
- ring
- recurrence

**54\. EDIT PANEL RULES**

No:

- giant modal
- page navigation
- blocking overlay
- traditional dashboard form
- Save button

Use:

autosave + visual confirmation.

**55\. EDITING FEEDBACK**

When a value changes:

**Title**

Label changes.

**Priority**

Node material changes.

**Ring**

Node physically transitions.

**Due date**

Orbital behavior adjusts.

**Recurrence**

Recurring identity becomes visually apparent.

The interface should show the consequence of the change.

**56\. DELETION / ARCHIVING**

Deleting a task should never feel like throwing data into a trash can.

The preferred semantic action is:

**release it from the active world.**

Archived tasks become:

distant ghosts.

**57\. ARCHIVED VISUALIZATION**

Archived objects may appear in Aurora as:

- wireframe
- low opacity
- low contrast
- distant
- non-dominant

They remain recoverable.

**58\. UNDO**

Undo is a safety net, not a permanent toolbar.

The current action gets:

one temporary undo affordance.

Duration:

**5 seconds**

It should disappear naturally.

**59\. UNDO VISUAL**

The undo affordance is:

- small
- translucent
- frosted
- spatial
- non-blocking

It must never compete with the scene.

**60\. TOUCH EXPERIENCE**

Mobile must not be treated as:

desktop but smaller.

It is a different physical interaction environment.

**61\. MOBILE PRINCIPLES**

Touch requires:

- larger targets
- stronger feedback
- fewer simultaneous controls
- less precision
- clearer gesture states
- more forgiving physics

**62\. TOUCH TARGETS**

Interactive objects should maintain a generous invisible interaction radius even if the visible object is small.

The visible design can remain elegant.

The hitbox can be larger.

**63\. MOBILE GESTURES**

| **Gesture**             | **Result** |
| ----------------------- | ---------- |
| Tap                     | Focus      |
| Long press              | Edit       |
| Drag                    | Move       |
| Drag to completion zone | Complete   |
| Drag outward            | Archive    |
| Pinch                   | Zoom       |
| Swipe down              | Exit Focus |
| Pull from top           | Create     |

Gestures must never conflict with platform navigation.

**64\. MOBILE COMPLETION**

The completion zone must adapt to thumb reach.

It should remain:

- large
- visually obvious
- physically forgiving

The owner should not need pixel-level accuracy.

**65\. RESPONSIVE COMPOSITION**

Responsive design should change:

- camera framing
- node scale
- label density
- effect quality
- interaction tolerance

It should **not** destroy the visual identity.

**66\. DEVICE TIERS**

**Tier A — High-end desktop**

Full experience:

- DOF
- bloom
- atmospheric particles
- Aurora
- high-quality shadows
- full material complexity

**Tier B — Standard laptop/tablet**

Reduced:

- particles
- post-processing
- shadow resolution

**Tier C — Mobile**

Prioritize:

- clarity
- interaction
- atmosphere
- bloom

Reduce:

- DOF
- grain
- expensive shadows
- excessive particles

**Tier D — Low-performance fallback**

Preserve:

- Core
- rings
- nodes
- essential motion
- task interaction

Remove:

- expensive effects
- decorative particles
- advanced post-processing

The experience should become simpler, not broken.

**67\. POST-PROCESSING**

Default desktop stack:

1. Tone mapping
2. Bloom
3. Depth of field
4. Vignette
5. Film grain
6. extremely subtle chromatic aberration

**68\. POST-PROCESSING RULE**

Effects should support:

**atmosphere**

not:

**look how many effects we can render.**

If the effect becomes noticeable before the environment becomes noticeable, reduce it.

**69\. FILM GRAIN**

Film grain should be:

- extremely subtle
- animated
- non-distracting

It exists to remove sterile digital perfection.

It must never look like a filter.

**70\. GLASS**

Frosted glass should be used sparingly.

Appropriate:

- Edit panel
- Undo
- Settle message
- contextual temporary surfaces

Inappropriate:

- every control
- every label
- every object
- entire screen overlays

Glass must remain special.

**71\. MATERIAL SYSTEM**

**Matte ceramic**

Primary task material.

**Emissive gel**

State communication.

**Frosted glass**

Temporary interface.

**Wireframe ghost**

Archive state.

**Brushed metal**

Rare environmental detail.

**Particles**

Transitions and history.

**72\. MATERIAL RULE**

No material should look:

- plastic
- overly glossy
- chrome-heavy
- synthetic in a cheap way

Orbit should feel tactile.

**73\. LIGHTING SYSTEM**

Four-light philosophy:

1. Key
2. Fill
3. Rim
4. Ambient

The rim light is especially important.

It separates the world from the background and gives Orbit its cinematic identity.

**74\. LIGHTING RESPONSE**

Lighting should react subtly to:

- focus
- completion
- camera transitions
- Aurora activity
- major state changes

But environmental lighting must never become a spectacle.

**75\. MOTION LANGUAGE**

Motion should feel:

**weighted, curved, restrained, intentional.**

Avoid:

- linear movement
- robotic snapping
- excessive bounce
- cartoon physics
- constant parallax

**76\. MOTION HIERARCHY**

**Micro**

0.1–0.2s

For:

- hover
- subtle state changes
- text opacity

**Normal**

0.3–0.8s

For:

- panel transitions
- node reactions
- settling

**Cinematic**

1.0–1.6s

For:

- camera
- major environment transitions

**Ritual**

2–4s

For:

- completion
- release
- major choreography

**77\. EASING LIBRARY**

\--ease-cinematic: cubic-bezier(0.65, 0, 0.35, 1);

\--ease-settle: cubic-bezier(0.22, 1, 0.36, 1);

\--ease-overshoot: cubic-bezier(0.34, 1.56, 0.64, 1);

\--ease-dissolve: cubic-bezier(0.4, 0, 0.2, 1);

\--ease-anticipate: cubic-bezier(0.6, -0.28, 0.735, 0.045);

\--ease-breathe: cubic-bezier(0.45, 0, 0.55, 1);

No arbitrary easing should be introduced without justification.

**78\. SPRING PHYSICS**

Springs should communicate:

- weight
- tension
- release
- settling

They should not communicate:

- cartoon bounce
- toy-like behavior
- excessive elasticity

**79\. CHOREOGRAPHY PRINCIPLE**

Every important choreography should contain:

PRIMARY

↓

SECONDARY

↓

AMBIENT

Where appropriate:

PRIMARY

SECONDARY

AMBIENT

AUDIO

LIGHT

PARTICLE

The environment should feel causally connected.

**80\. SOUND DESIGN**

Sound is a first-class material.

It should communicate:

- proximity
- action
- transition
- completion
- error
- recovery

**81\. SOUND PRINCIPLES**

Sound must be:

- quiet
- warm
- spatial
- tonal
- non-alarming

Avoid:

- notification beeps
- harsh clicks
- arcade sounds
- achievement jingles
- aggressive bass
- repetitive UI sounds

**82\. AMBIENT BED**

Base atmosphere:

- low-frequency sub
- soft tonal pad
- slow modulation
- D-minor foundation

Volume remains extremely low.

The ambient bed should be felt rather than consciously listened to.

**83\. SOUND PALETTE**

| **Event**     | **Character**            |
| ------------- | ------------------------ |
| Hover         | soft harmonic hum        |
| Grab          | low sustained tone       |
| Drag          | subtle rising harmonic   |
| Valid release | ascending resolution     |
| Completion    | warm chord               |
| Archive       | low soft tone            |
| Undo          | reversed/recovering tone |
| Camera        | filtered air movement    |
| Error         | muted amber tone         |
| Creation      | soft emergence tone      |
| Focus         | deep spatial tone        |

**84\. SOUND SILENCE**

Silence is intentionally designed.

After completion:

ambient sound briefly recedes.

The completion chord gets space.

The owner gets a moment.

This pause is part of the experience.

**85\. AUDIO ACCESSIBILITY**

Users must be able to:

- mute sound
- reduce sound volume
- enable sound captions
- use the complete experience without sound

No critical information may exist only in audio.

**86\. ACCESSIBILITY PHILOSOPHY**

Accessibility is not a second interface.

It is:

**another way of inhabiting Orbit.**

**87\. SEMANTIC MIRROR**

The 3D scene should have an equivalent semantic representation.

The mirror must expose:

- task title
- status
- ring
- priority
- due date
- actions
- creation
- editing
- completion
- archive
- undo

The owner should be able to operate Orbit without seeing the 3D scene.

**88\. KEYBOARD SYSTEM**

Core navigation:

N Create

T Timeline

A Aurora

Enter Focus

Space Complete

Esc Exit / dismiss

Tab Next task

Shift+Tab Previous task

M Mute

H High contrast

R Reduced motion

? Help

The keyboard system must remain consistent across the application.

**89\. FOCUS INDICATOR**

Keyboard focus should be visible in the 3D world.

Use:

- soft halo
- subtle shell
- slight brightness
- no flashing outline

The focus state must remain obvious without becoming visually loud.

**90\. REDUCED MOTION**

When reduced motion is active:

- camera transitions shorten
- idle drift disappears
- node bobbing disappears
- particle counts decrease
- dissolve becomes fade
- unnecessary environmental animation stops

The visual hierarchy remains intact.

Reduced motion should feel like:

**a calmer Orbit**

not:

**a broken Orbit.**

**91\. HIGH CONTRAST**

High contrast mode should increase:

- text contrast
- node separation
- focus visibility
- state differentiation

It should reduce:

- grain
- bloom
- subtle atmospheric effects

The visual identity remains recognizable.

**92\. COLOR-INDEPENDENT INFORMATION**

No critical state should rely solely on color.

Priority can additionally use:

- shell count
- shell thickness
- geometry
- intensity
- spatial behavior

Ring identity can additionally use:

- radius
- line thickness
- motion speed
- shape

**93\. SOUND CAPTIONS**

Optional captions can appear for major sound events:

♪ completion

♪ focus

♪ archive

Captions remain subtle.

**94\. SETTINGS EXPERIENCE**

Settings should be intentionally minimal.

Recommended settings:

**Experience**

- Sound
- Sound volume
- Reduced motion
- High contrast
- Sound captions

**Visual**

- Effect quality
- Performance mode

**Data**

- Export
- Import
- Backup information

No unnecessary customization.

**95\. SETTINGS VISUAL LANGUAGE**

Settings should not become a conventional dashboard.

They can appear as:

a quiet floating configuration space

but must remain semantically accessible through HTML.

**96\. HELP EXPERIENCE**

Pressing ? should reveal a compact help layer.

It should explain:

- core gestures
- keyboard shortcuts
- completion
- creation
- focus
- undo

No giant tutorial.

No permanent help sidebar.

**97\. NOTIFICATIONS**

Orbit should avoid conventional notifications.

There should be no:

- browser push reminders
- red notification counters
- persistent task alarms
- guilt messages

Unless explicitly added later as an intentional product decision.

**98\. DATE AND DUE-DATE LANGUAGE**

Avoid:

OVERDUE!!!

Prefer:

Due today

or simply let spatial behavior communicate proximity.

The application should inform without emotionally judging.

**99\. TEMPORAL URGENCY**

Urgency can affect:

- orbital ring speed
- subtle emissive intensity
- node presence
- proximity

It must not affect:

- flashing
- red warnings
- alarms
- aggressive movement

**100\. RECURRENCE VISUALIZATION**

Recurring tasks should have a subtle visual signature.

Potential representation:

- secondary orbit line
- recurring pulse
- paired ring
- repeating particle rhythm

The visual must communicate:

this task returns

without becoming a calendar badge.

**101\. TIMELINE VIEW**

Timeline should not suddenly become a spreadsheet.

It should remain spatial.

Potential structure:

Past ───────── NOW ───────── Future

curved temporal path

Tasks remain objects.

Chronology becomes spatial rather than tabular.

**102\. AURORA VIEW**

Aurora view is the memory space.

It should feel:

- slower
- wider
- quieter
- more atmospheric

The owner should be able to observe completed history without being presented with productivity statistics.

**103\. NO METRIC-FIRST DESIGN**

Orbit should never lead with:

- task counts
- completion percentage
- streak
- productivity score
- time spent
- daily performance

The experience communicates progress spatially.

**104\. MICROCOPY**

Orbit's language should be:

- short
- calm
- human
- non-judgmental
- lowercase/normal case
- never corporate

Prefer:

"Released."

over:

"Task completed successfully!"

Prefer:

"Couldn't settle that change."

over:

"An unexpected error occurred."

Prefer:

"Begin with one thing."

over:

"Create your first task now!"

**105\. FORBIDDEN LANGUAGE**

Avoid:

- productivity
- streak
- achievement
- reward
- failure
- overdue!!!
- urgent!!!
- congratulations!!!
- level up
- score
- winning
- losing

unless there is a compelling future design reason.

**106\. MICRO-INTERACTION QUALITY**

Every interaction should answer three questions:

1. **Did Orbit notice me?**
2. **Did Orbit understand what I intended?**
3. **Did Orbit respond appropriately?**

If any answer is unclear, the interaction needs refinement.

**107\. RESPONSE LATENCY**

Visual acknowledgement should happen immediately.

Target:

**<100ms perceived response**

Network confirmation may take longer.

The owner should never wait for the server to see an interaction begin.

**108\. FEEDBACK CHANNELS**

Orbit has six feedback channels:

1. Position
2. Scale
3. Material
4. Light
5. Sound
6. Motion

Not every action needs all six.

Major actions should use several.

**109\. VISUAL RESTRAINT**

A common failure mode is:

adding beautiful things until the scene becomes noisy.

Therefore every new visual element must justify:

- what it communicates
- where it sits in hierarchy
- why it needs to exist
- what it replaces
- what happens if it is removed

**110\. DENSITY MANAGEMENT**

As task count increases:

**1–5 tasks**

Full visual expression.

**6–15 tasks**

Moderate label reduction.

**16–30 tasks**

Stronger LOD.

**31+ tasks**

Aggressive visual simplification.

The world must remain legible.

**111\. TASK COLLISION MANAGEMENT**

Tasks should avoid becoming a tangled cluster.

Placement system should use:

- angular spacing
- radial spacing
- local repulsion
- persistent positions
- gentle rebalancing

Never violently rearrange the entire world.

**112\. SPATIAL STABILITY**

When one task changes:

nearby tasks should not all jump.

Rebalancing must propagate gradually.

The owner should retain spatial memory.

**113\. OBJECT SELECTION**

Only one task should normally be visually dominant.

Selection hierarchy:

Focused

↓

Hovered

↓

Nearby

↓

Everything else

**114\. BACKGROUND BEHAVIOR**

The background must remain alive but quiet.

Ambient motion:

- fog
- dust
- subtle light
- Aurora
- atmospheric gradient

No decorative background animation should compete with task interaction.

**115\. PARTICLE SYSTEM**

Particles serve three purposes:

1. atmosphere
2. transition
3. history

They should never become random glitter.

**116\. PARTICLE DENSITY**

Default:

approximately 200 ambient dust particles.

Completion:

approximately 240 dissolve particles.

Performance tiers may reduce this significantly.

**117\. PARTICLE BEHAVIOR**

Particles should generally:

- drift
- fade
- inherit motion
- respond to gravity-like forces
- remain soft

Avoid:

- fireworks
- explosions
- sparks everywhere

**118\. THE COMPLETION "WOW" PRINCIPLE**

Orbit should have a strong emotional peak.

That peak is:

**completion.**

Therefore the application should remain restrained most of the time.

If everything is cinematic, nothing is cinematic.

**119\. CONTRAST OF STILLNESS**

The strongest motion should happen after periods of calm.

The owner should experience:

quiet

↓

interaction

↓

energy

↓

release

↓

quiet

This contrast makes completion meaningful.

**120\. ENVIRONMENTAL MEMORY**

Orbit should remember more than task data.

It should feel as though the space itself persists.

Examples:

- task positions
- ring arrangement
- familiar visual composition
- Aurora history
- last camera context where appropriate

The owner should gradually develop a mental map of their own Orbit.

**121\. PERSISTENT SPATIAL IDENTITY**

If a task is repeatedly encountered in the same location:

that location becomes meaningful.

This creates a form of spatial memory similar to remembering where an object sits in a room.

This is one of Orbit's strongest differentiators.

**122\. CAMERA COMPOSITION**

The default composition should prioritize:

- Core
- Today ring
- active tasks
- enough negative space
- visible depth

Avoid centering every object mechanically.

**123\. NEGATIVE SPACE**

Negative space is a core design element.

The environment must have room to breathe.

Never fill every region simply because it is available.

**124\. FOCUS COMPOSITION**

When focusing a task:

- task occupies roughly the visual center
- surrounding world remains visible
- unrelated tasks reduce in prominence
- camera creates depth
- editing surface enters naturally

The task becomes important without becoming a separate page.

**125\. EDIT PANEL PLACEMENT**

Panel should appear:

beside the task

not:

over the task.

The task remains the subject.

**126\. INPUT OWNERSHIP**

At any moment, there must be one clear owner of input:

Normal Scene

↓

Dragging

↓

Choreography

↓

Editing

Conflicting interaction systems must never fight for the same pointer.

**127\. INTERACTION LOCKING**

When an action temporarily owns the scene:

- unrelated inputs may be deferred
- valid exits remain available
- accessibility escape remains available
- owner intent must never be lost

**128\. INPUT BUFFERING**

If an interaction is temporarily unavailable:

remember the owner's valid intent where safe.

Never silently discard a meaningful action.

**129\. ERROR RECOVERY**

Every major interaction should have:

- success state
- cancellation state
- invalid state
- recovery state

The owner should always understand where they ended up.

**130\. NO DEAD ENDS**

Orbit should never put the owner into a state where:

"I don't know how to get out."

Every Focus/edit/context state must have:

- Esc
- visible/semantic exit
- predictable gesture
- keyboard equivalent

**131\. ACCESSIBLE PARALLEL EXPERIENCE**

The semantic interface must not be a degraded list of tasks.

It should expose equivalent concepts:

Orbit

├── Today

├── This Week

├── Someday

└── Aurora

The structure of the application remains the same.

Only the presentation differs.

**132\. RESPONSIVE TYPOGRAPHY**

World-space text should scale according to:

- camera distance
- viewport size
- device pixel ratio
- readability threshold

Do not simply multiply every value by screen width.

**133\. SAFE AREAS**

Respect:

env(safe-area-inset-top)

env(safe-area-inset-right)

env(safe-area-inset-bottom)

env(safe-area-inset-left)

Important temporary UI must never sit beneath:

- notches
- browser controls
- home indicators

**134\. ORIENTATION**

Landscape is preferred for desktop/tablet immersion.

Portrait must remain fully functional.

Portrait composition should:

- reduce horizontal spread
- tighten ring framing
- enlarge touch targets
- reduce peripheral decoration

**135\. PORTRAIT CAMERA**

Portrait mode should not simply crop landscape.

It should use a dedicated composition.

Primary axis:

Core → Today → Focused task

**136\. DESKTOP ULTRAWIDE**

Do not stretch the scene indefinitely.

Use excess horizontal space for:

- atmosphere
- depth
- additional orbital composition

not giant empty UI margins.

**137\. VERY SMALL SCREENS**

Below approximately 400px:

- prioritize task readability
- simplify background
- increase node size
- reduce labels
- reduce particle density
- maintain interaction access

**138\. PERFORMANCE-FIRST VISUAL QUALITY**

Visual quality is not:

number of effects.

Visual quality is:

coherent composition + good materials + good motion + stable performance.

A stable 60fps scene with fewer effects is preferable to a beautiful slideshow.

**139\. PERFORMANCE BUDGETS**

Target:

- ~60 FPS
- minimal frame spikes
- ≤80 draw calls where practical
- controlled triangle count
- pooled particles
- limited post-processing
- low garbage creation during interaction

**140\. FRAME-TIME PRINCIPLE**

The visual system must protect interaction responsiveness.

During:

- drag
- focus
- completion
- camera transition

interaction responsiveness has higher priority than decorative effects.

**141\. LOW-POWER MODE**

When device performance drops:

1. reduce particles
2. reduce shadows
3. reduce post-processing
4. reduce Aurora detail
5. reduce ambient effects

Never reduce:

- task interaction
- labels when needed
- keyboard accessibility
- semantic mirror
- core functionality

**142\. DESIGN SYSTEM TOKEN ARCHITECTURE**

All reusable design values must originate from centralized tokens.

Categories:

colors

typography

spacing

motion

physics

materials

lighting

audio

spatial

responsive

accessibility

No random magic values in UI implementation unless locally justified.

**143\. SPATIAL TOKENS**

\--core-radius: 0.4;

\--ring-today-radius: 4;

\--ring-week-radius: 7;

\--ring-someday-radius: 10;

\--aurora-radius: 15;

\--node-radius: 0.30;

\--node-shell-radius: 0.36;

\--node-ring-radius: 0.45;

**144\. MOTION TOKENS**

\--dur-instant: 0.10s;

\--dur-fast: 0.20s;

\--dur-normal: 0.40s;

\--dur-slow: 0.80s;

\--dur-cinematic: 1.20s;

\--dur-epic: 1.60s;

**145\. Z-ORDER / DEPTH HIERARCHY**

Conceptual priority:

Background

↓

Atmosphere

↓

Aurora

↓

Rings

↓

Tasks

↓

Focused task

↓

Temporary interaction objects

↓

Accessibility/semantic overlays

Nothing should unexpectedly cover the primary interaction.

**146\. TEMPORARY UI**

Temporary interface objects should have:

- entry
- useful lifetime
- exit
- no permanent clutter

Examples:

- completion message
- undo
- sound caption
- mute indicator
- help

**147\. UI LIFETIME**

Every temporary element must answer:

"Why am I still here?"

If the answer is unclear:

remove it.

**148\. VISUAL TRANSITIONS BETWEEN MODES**

Transition:

Orbit

↓

Focus

should feel like:

moving closer.

Transition:

Orbit

↓

Timeline

should feel like:

changing perspective.

Transition:

Orbit

↓

Aurora

should feel like:

looking outward into memory.

**149\. TIMELINE VISUAL LANGUAGE**

Timeline should use:

- curved spatial paths
- chronological depth
- soft temporal markers
- object continuity

Avoid:

- table
- calendar grid
- spreadsheet
- conventional Kanban columns

**150\. AURORA VISUAL LANGUAGE**

Aurora should emphasize:

- distance
- memory
- release
- accumulated atmosphere

It should not emphasize:

- numbers
- performance
- productivity

**151\. COMPLETION HISTORY**

A completed task should leave a subtle trace.

Not a permanent notification.

The trace becomes part of the world.

**152\. DESIGNING FOR REVISIT**

Orbit should still feel beautiful after the hundredth opening.

This requires:

- low repetition
- organic motion variation
- persistent spatial memory
- restrained UI
- no tutorial repetition
- no forced celebration

**153\. ANTI-REPETITION**

Ambient systems may use controlled variation:

- particle phase
- light modulation
- camera micro-drift
- task bob phase
- Aurora movement

But variation must remain within the visual language.

Randomness must never become chaos.

**154\. PERSONALIZATION**

Personalization should be subtle.

Allowed:

- persisted spatial arrangement
- remembered preferences
- sound preference
- motion preference
- performance preference

Avoid:

- theme marketplaces
- cosmetic unlocks
- gamified customization

**155\. BRAND IDENTITY**

Orbit's visual brand is not its logo.

It is:

**twilight + orbit + physical objects + calm motion + release.**

If the logo disappeared, the experience should still be recognizable as Orbit.

**156\. ICONOGRAPHY**

Icons should be:

- minimal
- geometric
- thin
- monochrome or restrained accent
- visually quiet

Avoid:

- emoji
- colorful icon collections
- thick corporate iconography

**157\. CURSOR DESIGN**

Desktop cursor feedback should reinforce physicality.

Possible states:

- default
- interact
- grab
- grabbing
- text
- unavailable

Cursor changes should remain subtle.

**158\. HAPTIC FEEDBACK**

Where supported, optional haptic feedback may reinforce:

- grab
- successful placement
- completion
- invalid release

Haptics must remain subtle.

No vibration spam.

**159\. TOUCH FEEDBACK**

Every meaningful touch interaction should visually acknowledge within approximately:

**100ms**

Possible responses:

- scale
- glow
- movement
- ripple
- material change

**160\. INPUT ACCESSIBILITY**

Every important pointer action needs a non-pointer equivalent.

Example:

Drag to completion

↓

Space while focused

↓

semantic "Complete" action

**161\. COMPLETION WITHOUT DRAG**

Drag remains the signature interaction.

But completion must also be available through:

- keyboard
- accessibility mirror
- mobile accessible action

The ritual is primary.

The underlying capability remains universal.

**162\. SAFETY AGAINST ACCIDENTAL COMPLETION**

Accidental completion must be recoverable.

Use:

- undo
- visual confirmation
- semantic action state

Avoid disruptive confirmation modals for normal use.

**163\. DESTRUCTIVE ACTIONS**

Destructive actions should feel:

- deliberate
- reversible
- quiet

No red dialog.

No:

"ARE YOU SURE?"

unless an action is genuinely irreversible.

**164\. DATA LOSS COMMUNICATION**

If something genuinely cannot be recovered:

- explain clearly
- use calm but unmistakable language
- prioritize clarity over aesthetic minimalism

The calm principle must never compromise critical information.

**165\. IMPORTANT EXCEPTION TO THE CALM LAW**

"Calm" does **not** mean:

hide important failures.

Critical problems may use stronger contrast or clearer wording.

The rule is:

**clarity without alarmism.**

**166\. EMPTY / ERROR / LOADING / OFFLINE STATE FAMILY**

All four states must share the same visual language.

Loading → emerging

Empty → quiet

Offline → slightly altered atmosphere

Error → gentle resistance

This creates a coherent emotional system.

**167\. FIRST SUCCESS MOMENT**

The first completed task is extremely important.

It should introduce:

- completion ritual
- Aurora
- sound
- release
- settle

without explaining it with a tutorial.

The owner should understand it by experiencing it.

**168\. RETURNING USER**

A returning user should immediately recognize:

"This is my space."

Nothing should reset visually without reason.

**169\. DAILY OPENING**

If tasks exist:

- scene appears
- spatial memory restored
- Today ring establishes itself
- active tasks become visible
- environment settles

No forced summary.

**170\. END OF SESSION**

Orbit must not say:

"Great job!"

or:

"See you tomorrow!"

Instead:

the owner simply leaves.

The absence of guilt is itself part of the design.

**171\. THE "PLACE, NOT APP" TEST**

Ask:

If all UI labels disappeared, would the environment still feel like somewhere?

If yes:

good.

If no:

the scene relies too heavily on interface decoration.

**172\. THE "PHYSICALITY" TEST**

Ask:

Could this interaction exist in a physical room?

If yes:

strong Orbit interaction.

If no:

reconsider whether it should be represented as a conventional UI control.

**173\. THE "CALM" TEST**

Ask:

Does this feature make the owner feel pressured?

If yes:

redesign it.

**174\. THE "CHAIN" TEST**

Ask:

Does the environment acknowledge the action?

If no:

add a meaningful secondary or ambient reaction.

**175\. THE "NOT A DASHBOARD" TEST**

Ask:

Could this screenshot be mistaken for a productivity dashboard?

If yes:

the design has drifted.

**176\. THE "100TH SESSION" TEST**

Ask:

Would this still feel pleasant after repeated use?

If no:

reduce novelty and repetition.

**177\. THE "ONE-HANDED" TEST**

On mobile:

Can the most important interaction be completed comfortably with one hand?

If not:

adjust the composition or gesture.

**178\. THE "NO SURPRISE" TEST**

The owner should never wonder:

"Why did that object move?"

Every major movement needs an understandable cause.

**179\. THE "NO TELEPORT" RULE**

Objects should never teleport unless:

- entering the scene for the first time
- recovering from unrecoverable rendering state
- explicitly restored from persistence

Even then, use visual materialization when possible.

**180\. THE "NO SNAP" RULE**

Important physical interactions should settle.

Snap is allowed only when:

- it communicates a clear semantic boundary
- the motion is still physically dressed
- snapping improves usability

**181\. VISUAL QA**

Every major interaction should be reviewed at:

- 60fps
- 30fps
- desktop
- tablet
- phone
- reduced motion
- high contrast
- keyboard-only
- screen reader
- offline
- slow network

**182\. MOTION QA**

Check:

- no accidental jumps
- no sudden acceleration
- no clipping
- no object tunneling
- no conflicting animation tracks
- no camera shake
- no stuck transitions
- no animation dead ends

**183\. AUDIO QA**

Check:

- no overlapping harsh sounds
- no sound spam
- no autoplay violation
- correct mute behavior
- correct volume
- correct captions
- no sound-only functionality

**184\. ACCESSIBILITY QA**

Check:

- keyboard reachability
- focus visibility
- screen-reader equivalence
- reduced motion
- contrast
- color independence
- touch target size
- semantic labels

**185\. RESPONSIVE QA**

Check:

- 320px portrait
- 375px portrait
- 430px portrait
- tablet portrait
- tablet landscape
- 1366px desktop
- 1920px desktop
- ultrawide

The scene must remain intentional at every size.

**186\. PERFORMANCE QA**

Measure:

- FPS
- frame time
- draw calls
- triangles
- GPU memory
- texture memory
- particle count
- shader cost
- interaction latency
- load time

**187\. VISUAL REGRESSION**

Major states should have reference captures:

- initial Orbit
- hover
- focus
- editing
- creation
- completion
- Aurora
- Timeline
- empty
- offline
- error
- reduced motion
- high contrast
- mobile

**188\. DESIGN ACCEPTANCE GATE**

A feature is not visually complete until:

**Visual**

It matches the art direction.

**Interaction**

It responds immediately.

**Motion**

It follows Orbit's motion language.

**Audio**

It follows the sound language where applicable.

**Accessibility**

Equivalent interaction exists.

**Responsive**

It works across device classes.

**Performance**

It stays inside the TRD budget.

**Emotional**

It strengthens Arrival, Control, or Release.

**189\. COMPONENT INVENTORY**

**3D World**

- Scene
- Environment
- Core
- OrbitRing
- TaskNode
- NodeShell
- NodeLabel
- CompletionZone
- Seed
- Aurora
- Particles
- EditPanel3D
- Toast3D
- UndoGhost
- Lights
- CameraRig

**Interaction Systems**

- PointerController
- TouchController
- KeyboardController
- DragController
- FocusController
- SelectionController
- ChoreographyController

**Minimal 2D Layer**

- OfflineIndicator
- SoundCaption
- MuteIndicator
- SemanticMirror
- accessibility live region

No conventional dashboard shell.

**190\. COMPONENT RESPONSIBILITY RULE**

Every component should have one clear responsibility.

Avoid components that simultaneously control:

- task data
- camera
- audio
- animation
- persistence

These systems should communicate through explicit state.

**191\. DESIGN-TO-CODE BOUNDARY**

Design values should become implementation tokens.

Example:

Design:

Today = radius 4

Implementation:

RING_TODAY_RADIUS = 4

Never duplicate the same value in multiple unrelated files.

**192\. EXPERIENCE STATE MACHINE**

At the highest level:

BOOT

↓

ARRIVAL

↓

ORBIT

├── FOCUS

│ └── EDIT

│

├── CREATE

│

├── COMPLETE

│

├── ARCHIVE

│

├── TIMELINE

│

└── AURORA

Every state must have:

- entry
- active behavior
- exit
- interruption rules
- accessibility equivalent

**193\. CHOREOGRAPHY STATE MACHINE**

A choreography should never be represented as scattered timers.

Conceptually:

IDLE

↓

PREPARE

↓

ACTIVE

↓

RESOLVE

↓

SETTLE

↓

COMPLETE

This makes behavior deterministic.

**194\. ANIMATION OWNERSHIP**

Only one system may control a given property at a time.

Example:

The node position cannot simultaneously be controlled by:

- drag physics
- orbit physics
- completion animation
- server sync

There must be an explicit priority.

**195\. ANIMATION PRIORITY**

Recommended:

Emergency recovery

↓

Accessibility override

↓

User interaction

↓

Canonical choreography

↓

Physics settling

↓

Ambient motion

Higher-priority systems temporarily own the property.

**196\. SERVER EVENTS AND VISUAL EVENTS**

Server state must never directly dictate visual animation timing.

Instead:

Server event

↓

Domain state change

↓

Local visual interpretation

↓

Choreography

This preserves visual consistency.

**197\. REALTIME ARRIVAL**

If another device creates a task:

The task should:

1. appear as a subtle seed
2. materialize
3. settle into its stored orbit
4. become part of the environment

It should not suddenly pop into existence.

**198\. REMOTE COMPLETION**

If a task is completed elsewhere:

The local scene should interpret it as:

a release that happened beyond the current interaction.

It may use:

- subtle outward motion
- Aurora activity
- soft sound

without pretending the local user performed the action.

**199\. SYNC VISUAL LANGUAGE**

Synchronization should be nearly invisible.

The owner should experience:

one world across devices.

Not:

a synchronization system.

**200\. ACCESSIBILITY AND AESTHETICS MUST COEXIST**

Accessibility should not be treated as:

"turning off the design."

Instead:

- high contrast gets a deliberate visual treatment
- reduced motion gets deliberate timing
- keyboard focus becomes a spatial state
- semantic mode retains Orbit's conceptual structure

**201\. DESIGN DEGRADATION LADDER**

When resources are limited:

Full experience

↓

Reduced effects

↓

Reduced particles

↓

Reduced shadows

↓

Reduced post-processing

↓

Simplified materials

↓

Core interaction preserved

Never:

beautiful

↓

broken

**202\. THE VISUAL QUALITY PRIORITY STACK**

When tradeoffs are necessary:

1. Interaction clarity
2. Spatial composition
3. Motion quality
4. Task readability
5. Performance
6. Material quality
7. Lighting
8. Particles
9. Decorative effects

Never sacrifice interaction for decoration.

**203\. THE EMOTIONAL QUALITY PRIORITY STACK**

1. Calm
2. Presence
3. Control
4. Physical satisfaction
5. Release
6. Beauty
7. Novelty

Novelty is deliberately last.

**204\. FEATURE INTRODUCTION RULE**

Any future UI/UX feature must answer:

1. What problem does it solve?
2. Which Orbit feeling does it strengthen?
3. What does it replace?
4. Does it add visual noise?
5. Does it add interaction complexity?
6. Does it work on mobile?
7. Does it work with keyboard/accessibility?
8. Does it affect performance?
9. Can the owner remove it?

If the answers are weak:

do not add it.

**205\. FEATURE REMOVAL RULE**

A feature should be removed if it:

- becomes visually noisy
- creates guilt
- adds unnecessary interaction
- exists only because "apps normally have it"
- weakens spatial meaning
- requires too much maintenance
- is rarely useful

Orbit is allowed to become simpler.

**206\. DESIGN REVIEW RITUAL**

Before approving a major feature:

**Pass 1 — Silent observation**

Use it without thinking about implementation.

**Pass 2 — Interaction**

Repeat the interaction several times.

**Pass 3 — Emotional test**

Ask:

How did that feel?

**Pass 4 — Visual test**

Ask:

What drew my eye?

**Pass 5 — Removal test**

Ask:

What happens if I remove this?

**207\. WEEKLY EXPERIENCE REVIEW**

Once per week:

1. Does Orbit still feel calm?
2. Does opening it feel like arriving?
3. Does task manipulation feel physical?
4. Does completion still feel meaningful?
5. Has any interface element become annoying?
6. Is the world becoming visually crowded?
7. Is anything unnecessary?
8. Is anything confusing?
9. Is anything too slow?
10. Is anything too loud?

Fix before adding.

**208\. MONTHLY DESIGN CUT**

Every month ask:

**"What can disappear?"**

The design should become:

clearer

not:

larger.

**209\. THE TWENTY CORE DESIGN LAWS**

These remain the final non-negotiable rules:

1. No flat UI where meaningful 3D is possible.
2. No unnecessary dashboard structures.
3. No animation without purpose.
4. Major animation should form a reaction chain.
5. No red alarm language.
6. No guilt mechanics.
7. No streaks.
8. No badges.
9. No unnecessary metrics.
10. No pure black.
11. No pure white.
12. No excessive saturation.
13. No modal creation workflow.
14. No modal editing workflow unless genuinely required.
15. No permanent clutter.
16. No camera shake.
17. No camera roll.
18. No teleporting during physical interactions.
19. Every destructive action should be recoverable where technically possible.
20. **If it does not feel like a place, it is not Orbit.**

**210\. THE EXPERIENCE CONTRACT**

Orbit must feel:

**When opening:**

**"I have arrived."**

**When seeing tasks:**

**"They have places."**

**When selecting:**

**"I can interact with them."**

**When dragging:**

**"This has weight."**

**When completing:**

**"I can let this go."**

**When the Aurora responds:**

**"It became part of the world."**

**When leaving:**

**"Nothing is demanding anything from me."**

**211\. FINAL DESIGN DEFINITION**

Orbit is successful when:

**The owner stops thinking about the interface and starts thinking about the space.**

The technology disappears.

The UI disappears.

The productivity metaphor disappears.

What remains is:

**a quiet twilight environment containing the owner's loose ends.**

Tasks have weight.

Time has distance.

Attention has proximity.

Completion has motion.

History has light.

And the application never asks the owner to feel guilty for leaving.

**212\. FINAL EXPERIENCE EQUATION**

Orbit

\=

Spatial Meaning

-

Physical Interaction

-

Cinematic Motion

-

Atmospheric Visuals

-

Quiet Sound

-

Persistent Memory

-

Accessibility

-

Performance

−

Dashboard Clutter

−

Guilt Mechanics

−

Unnecessary UI

**213\. FINAL NORTH STAR**

**Build less interface. Build more world.**

**Make every important action physical.**

**Make every meaningful transition intentional.**

**Let the environment respond without shouting.**

**Protect calm above novelty.**

**Make completion feel like release.**

**Make the space remember.**

**And never let Orbit become a dashboard wearing a 3D skin.**

**214\. DESIGN SIGN-OFF**

This document is the **master UI/UX authority** for Orbit.

The PRD defines the product intent.

The TRD defines the technical reality.

The choreography specification defines exact timelines.

This document governs the final experience created by all three.

If implementation conflicts with this document:

**review the conflict explicitly.**

If a technical limitation requires deviation:

**preserve the experience even if the implementation changes.**

If a new feature weakens the experience:

**remove the feature.**

If the application stops feeling like a place:

**stop adding features and fix the experience.**

The ultimate objective is not to build the most feature-rich to-do application.

It is to build the most coherent expression of the original idea:

**A personal place where loose ends can exist, move, and eventually be released.**

**APPENDIX A — MASTER DESIGN TOKEN SET**

:root {

/\* =========================

ENVIRONMENT

\========================= \*/

\--bg-void: #0E0F16;

\--bg-sky-top: #1B1E2B;

\--bg-sky-mid: #2A2F45;

\--bg-sky-low: #1E2233;

\--floor: #232738;

/\* =========================

ACCENTS

\========================= \*/

\--accent-active: #7BD3EA;

\--accent-focus: #9B8CFF;

\--accent-done: #7FE7C4;

\--accent-urgent: #F2A67E;

\--accent-dormant: #5C6178;

/\* =========================

TEXT

\========================= \*/

\--text-primary: #E8EAF2;

\--text-secondary: #A2A8BD;

\--text-muted: #6B7088;

/\* =========================

GLASS

\========================= \*/

\--glass: rgba(232,234,242,0.06);

\--glass-border: rgba(232,234,242,0.12);

\--glass-highlight: rgba(232,234,242,0.20);

/\* =========================

MOTION

\========================= \*/

\--ease-cinematic: cubic-bezier(0.65, 0, 0.35, 1);

\--ease-settle: cubic-bezier(0.22, 1, 0.36, 1);

\--ease-overshoot: cubic-bezier(0.34, 1.56, 0.64, 1);

\--ease-dissolve: cubic-bezier(0.4, 0, 0.2, 1);

\--ease-anticipate: cubic-bezier(0.6, -0.28, 0.735, 0.045);

\--ease-breathe: cubic-bezier(0.45, 0, 0.55, 1);

\--dur-instant: 0.10s;

\--dur-fast: 0.20s;

\--dur-normal: 0.40s;

\--dur-slow: 0.80s;

\--dur-cinematic: 1.20s;

\--dur-epic: 1.60s;

/\* =========================

SPATIAL

\========================= \*/

\--core-radius: 0.4;

\--ring-today-radius: 4;

\--ring-week-radius: 7;

\--ring-someday-radius: 10;

\--aurora-radius: 15;

\--node-radius: 0.30;

\--node-shell-radius: 0.36;

\--node-ring-radius: 0.45;

\--floor-y: -2;

\--fog-density: 0.04;

/\* =========================

TYPOGRAPHY

\========================= \*/

\--font-display: 'Fraunces', serif;

\--font-body: 'Inter', sans-serif;

\--font-mono: 'JetBrains Mono', monospace;

\--weight-light: 300;

\--weight-regular: 400;

\--weight-medium: 500;

\--weight-semibold: 600;

}

**APPENDIX B — MASTER MOTION VALUES**

| **Interaction** | **Stiffness** | **Damping** | **Mass** |
| --------------- | ------------- | ----------- | -------- |
| Hover scale     | 300           | 20          | 1        |
| Cursor follow   | 150           | 18          | 1        |
| Return to orbit | 120           | 14          | 1.2      |
| Camera follow   | 60            | 20          | 1.5      |
| Panel movement  | 200           | 26          | 1        |
| Orbit rebalance | 80            | 16          | 1        |

**APPENDIX C — MASTER IDLE MOTION**

| **Element**  | **Motion**        | **Period** | **Amplitude** |
| ------------ | ----------------- | ---------- | ------------- |
| Core         | Emissive breathe  | 4s         | 0.9 → 1.1     |
| Nodes        | Y bob             | 3–6s       | ±0.02         |
| Today ring   | Rotation          | slow       | 0.08 rad/s    |
| Week ring    | Rotation          | slow       | 0.05 rad/s    |
| Someday ring | Rotation          | very slow  | 0.02 rad/s    |
| Fog          | Density variation | 12s        | ±5%           |
| Aurora       | Drift             | 20s        | ±0.5          |
| Dust         | Drift             | 30s        | ±0.3          |

**APPENDIX D — MASTER CHOREOGRAPHY INDEX**

| **Choreography** | **Duration** | **Priority** |
| ---------------- | ------------ | ------------ |
| Completion       | 4.0s         | **Critical** |
| Creation         | 2s+          | Critical     |
| Editing          | 3s+          | Critical     |
| Archive          | 2.9s+        | High         |
| Orbit → Focus    | 1.2s         | High         |
| Focus → Orbit    | 1.2s         | High         |
| Orbit → Timeline | 1.4s         | Medium       |
| Orbit → Aurora   | 1.6s         | Medium       |
| Settle           | ~3s          | High         |
| Undo             | 5s lifetime  | High         |
| Error recovery   | ~2s          | High         |

**APPENDIX E — MASTER UI QUALITY CHECKLIST**

Before any UI/UX feature is considered complete:

**Identity**

- Looks unmistakably like Orbit
- Does not resemble a conventional productivity app
- Uses the established material language

**Spatial**

- Respects the world
- Preserves spatial memory
- Does not unnecessarily flatten information

**Motion**

- Uses approved easing
- Has intentional timing
- Does not snap unnecessarily
- Does not conflict with other animation systems

**Sound**

- Sound is purposeful
- Volume is restrained
- Mute works
- No sound-only information

**Accessibility**

- Keyboard equivalent
- Screen-reader equivalent
- Reduced-motion behavior
- Color-independent meaning
- Sufficient contrast

**Responsive**

- Desktop
- Tablet
- Mobile portrait
- Mobile landscape
- Small screen

**Performance**

- No unnecessary draw calls
- No excessive particle generation
- No frame-time spikes
- Low-performance fallback exists

**Emotional**

- Strengthens Arrival, Control, or Release
- Does not create guilt
- Does not introduce unnecessary urgency
- Feels physical
- Feels calm

**APPENDIX F — THE FINAL ORBIT TEST**

Before shipping the application, perform the following test without looking at the source code:

**Open**

Does it feel like entering somewhere?

**Look**

Can I understand the world without reading instructions?

**Touch**

Does the environment respond naturally?

**Move**

Does a task feel like an object?

**Focus**

Does approaching a task feel intentional?

**Edit**

Can I change it without leaving the world?

**Complete**

Does completion feel physically satisfying?

**Wait**

Does the world remain beautiful when nothing is happening?

**Return**

Does the space feel familiar?

**Leave**

Can I leave without the application asking for anything?

If all ten answers are yes:

**Orbit is doing what it was created to do.**

**FINAL STATEMENT**

**Orbit is not a to-do list rendered in 3D.**

**Orbit is a place that happens to contain tasks.**

The distinction is everything.

**End of UI/UX Design Document v3.0 — Ultimate Experience Specification**