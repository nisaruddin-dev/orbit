/**
 * @module choreography/engine
 *
 * The choreography engine. Plays named choreographies, ticks them
 * forward each frame, and notifies listeners of track value changes.
 *
 * State machine composition (from the pre-7.4 decisions):
 *
 *   CHOREOGRAPHY STATE (top-level):
 *     IDLE → REACH → GRAB → DRAG → RELEASE → DISSOLVE → SETTLE
 *
 *   DRAG STATE is a sub-state active during REACH/GRAB/DRAG.
 *   ZONE STATE is a sub-state of drag, driven by proximity.
 *
 *   The choreography engine does not know about drag or zone
 *   semantics. It only plays named choreographies and reports
 *   values. The layer above decides which choreography to play.
 *
 * Lifecycle (from System Architecture §74):
 *   create → activate → update → deactivate → dispose
 *   Interrupted animation is a normal lifecycle path.
 */

import { EASINGS } from './easings';
import { ZONE_CHOREOGRAPHIES } from './zone';
import type {
  Choreography,
  ChoreographyHandle,
  Keyframe,
  TrackValueListener,
} from './types';

/** The registered choreographies, keyed by name. */
const registry = new Map<string, Choreography>();

/**
 * Register a choreography. Called once at module load for each
 * built-in choreography.
 */
function register(choreography: Choreography): void {
  registry.set(choreography.name, choreography);
}

// Register the built-in choreographies.
for (const c of ZONE_CHOREOGRAPHIES) {
  register(c);
}

/** An active choreography instance. */
interface ActiveChoreography {
  id: string;
  choreography: Choreography;
  startTime: number;
  resolve: () => void;
  cancelled: boolean;
}

/**
 * The engine state. Module-level, because there is only ever one
 * engine per application.
 */
const active = new Map<string, ActiveChoreography>();
const listeners = new Set<TrackValueListener>();

/** Monotonic counter for handle IDs. */
let nextHandleId = 0;

/**
 * Sample a track's value at a given elapsed time.
 * Returns the current interpolated value between two keyframes.
 */
function sampleTrack(
  keyframes: Keyframe[],
  elapsed: number,
  duration: number,
): number {
  if (keyframes.length === 0) return 0;
  if (keyframes.length === 1) return keyframes[0]!.value;

  const t = Math.min(elapsed / duration, 1.0);

  // Find the segment containing t.
  let prev = keyframes[0]!;
  for (let i = 1; i < keyframes.length; i++) {
    const next = keyframes[i]!;
    if (t <= next.t) {
      // Interpolate between prev and next.
      const segmentLength = next.t - prev.t;
      if (segmentLength <= 0) return next.value;
      const localT = (t - prev.t) / segmentLength;
      const eased = EASINGS[next.easing](localT);
      return prev.value + (next.value - prev.value) * eased;
    }
    prev = next;
  }

  return prev.value;
}

/**
 * Play a choreography by name. Returns a handle that can be used
 * to cancel it or await its completion.
 *
 * If a choreography with the same name is already playing and
 * the existing one is interruptible, it is cancelled first.
 */
export function play(name: string): ChoreographyHandle {
  const choreography = registry.get(name);
  if (!choreography) {
    throw new Error(`Choreography not found: ${name}`);
  }

  // If an instance with this name is playing and interruptible, cancel it.
  const existing = active.get(name);
  if (existing) {
    if (!existing.choreography.interruptible) {
      // Not interruptible — return a handle that resolves immediately.
      return {
        id: existing.id,
        name,
        promise: Promise.resolve(),
        cancel: () => {
          /* no-op */
        },
      };
    }
    existing.cancelled = true;
    existing.resolve();
    active.delete(name);
  }

  const id = `choreo-${nextHandleId++}`;

  let resolveFn: () => void = () => {
    /* replaced below */
  };
  const promise = new Promise<void>((res) => {
    resolveFn = res;
  });

  const instance: ActiveChoreography = {
    id,
    choreography,
    startTime: performance.now() / 1000,
    resolve: resolveFn,
    cancelled: false,
  };

  active.set(name, instance);

  return {
    id,
    name,
    promise,
    cancel: () => {
      cancel(name);
    },
  };
}

/**
 * Cancel a playing choreography by name.
 * If it is already finished, this is a no-op.
 */
export function cancel(name: string): void {
  const instance = active.get(name);
  if (!instance) return;
  instance.cancelled = true;
  instance.resolve();
  active.delete(name);
}

/**
 * Check whether a choreography is currently playing.
 */
export function isPlaying(name: string): boolean {
  return active.has(name);
}

/**
 * Advance all active choreographies. Called once per frame from
 * a component inside the Canvas.
 */
export function tick(): void {
  if (active.size === 0) return;

  const now = performance.now() / 1000;

  // Collect finished instances so we can resolve and remove them
  // after iteration.
  const finished: ActiveChoreography[] = [];

  for (const instance of active.values()) {
    if (instance.cancelled) continue;

    const elapsed = now - instance.startTime;
    const duration = instance.choreography.duration;

    for (const track of instance.choreography.tracks) {
      const value = sampleTrack(track.keyframes, elapsed, duration);
      for (const listener of listeners) {
        listener(track.target, track.property, value);
      }
    }

    if (elapsed >= duration) {
      finished.push(instance);
    }
  }

  for (const instance of finished) {
    instance.resolve();
    active.delete(instance.choreography.name);
  }
}

/**
 * Subscribe to track value changes. Returns an unsubscribe function.
 */
export function subscribe(listener: TrackValueListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Cancel every active choreography. Used on unmount and in tests.
 */
export function cancelAll(): void {
  for (const instance of active.values()) {
    instance.cancelled = true;
    instance.resolve();
  }
  active.clear();
}

/**
 * A convenience for tests: reset the engine to a clean state.
 */
export function resetForTests(): void {
  cancelAll();
  listeners.clear();
}
