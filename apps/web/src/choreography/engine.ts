/**
 * @module choreography/engine
 *
 * The choreography engine. Plays named choreographies, ticks them
 * forward each frame, and notifies listeners of track value changes.
 *
 * Supports two kinds of choreographies:
 *   - flat choreographies with a single set of tracks
 *   - sequences of phases that play one after another
 *
 * Listeners are scoped. A listener may subscribe with a filter
 * (by target, by property, or both). The engine only notifies a
 * listener for tracks matching its filter. This avoids flooding
 * every listener with every value every frame.
 *
 * Lifecycle (from System Architecture §74):
 *   create → activate → update → deactivate → dispose
 *   Interrupted animation is a normal lifecycle path.
 */

import { EASINGS } from './easings';
import { ZONE_CHOREOGRAPHIES } from './zone';
import {
  COMPLETION_CHOREOGRAPHY,
  COMPLETION_REDUCED_CHOREOGRAPHY,
} from './completion';
import type {
  Choreography,
  ChoreographyHandle,
  ChoreographyTrack,
  Keyframe,
  ListenerFilter,
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
register(COMPLETION_CHOREOGRAPHY);
register(COMPLETION_REDUCED_CHOREOGRAPHY);

/** A scoped listener entry. */
interface ListenerEntry {
  id: number;
  listener: TrackValueListener;
  filter: ListenerFilter;
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
const listeners = new Map<number, ListenerEntry>();

/** Monotonic counter for handle IDs. */
let nextHandleId = 0;
let nextListenerId = 0;

/**
 * Sample a track's value at a given elapsed time.
 * Returns the current interpolated value between two keyframes.
 */
function sampleTrack(
  keyframes: Keyframe[],
  elapsed: number,
  duration: number,
): number {
  const first = keyframes[0];
  if (!first) return 0;
  if (keyframes.length === 1) return first.value;

  const t = Math.min(elapsed / duration, 1.0);

  let prev = first;
  for (let i = 1; i < keyframes.length; i++) {
    const next = keyframes[i];
    if (!next) continue;
    if (t <= next.t) {
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
 * Notify all listeners whose filter matches the given track.
 * A listener with no filter receives every track.
 */
function notify(
  target: string,
  property: string,
  value: number,
): void {
  for (const entry of listeners.values()) {
    const f = entry.filter;
    if (f.target !== undefined && f.target !== target) continue;
    if (f.property !== undefined && f.property !== property) continue;
    entry.listener(target, property, value);
  }
}

/**
 * Compute the total duration of a choreography, including all
 * sequence phases.
 */
function totalDuration(choreography: Choreography): number {
  if (choreography.sequence && choreography.sequence.length > 0) {
    return choreography.sequence.reduce(
      (sum, phase) => sum + phase.duration,
      0,
    );
  }
  return choreography.duration;
}

/**
 * Given elapsed time and a sequence, return the active phase and
 * the elapsed time within that phase.
 */
function resolvePhase(
  sequence: NonNullable<Choreography['sequence']>,
  elapsed: number,
): { phaseTracks: ChoreographyTrack[]; phaseElapsed: number; phaseDuration: number } | null {
  let remaining = elapsed;
  for (const phase of sequence) {
    if (remaining < phase.duration) {
      return {
        phaseTracks: phase.tracks,
        phaseElapsed: remaining,
        phaseDuration: phase.duration,
      };
    }
    remaining -= phase.duration;
  }
  return null;
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

  const existing = active.get(name);
  if (existing) {
    if (!existing.choreography.interruptible) {
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

  const id = `choreo-${String(nextHandleId)}`;
  nextHandleId += 1;

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
 *
 * If a choreography has a sequence, only the currently active
 * phase's tracks are sampled this frame. Phases that have not
 * started are not sampled. Phases that have finished are not
 * sampled.
 */
export function tick(): void {
  if (active.size === 0) return;

  const now = performance.now() / 1000;
  const finished: ActiveChoreography[] = [];

  for (const instance of active.values()) {
    if (instance.cancelled) continue;

    const elapsed = now - instance.startTime;
    const duration = totalDuration(instance.choreography);

    if (instance.choreography.sequence) {
      const phase = resolvePhase(instance.choreography.sequence, elapsed);
      if (phase) {
        for (const track of phase.phaseTracks) {
          const value = sampleTrack(
            track.keyframes,
            phase.phaseElapsed,
            phase.phaseDuration,
          );
          notify(track.target, track.property, value);
        }
      }
    } else {
      for (const track of instance.choreography.tracks) {
        const value = sampleTrack(track.keyframes, elapsed, duration);
        notify(track.target, track.property, value);
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
 * Subscribe to track value changes. If a filter is provided via
 * the options argument, only values for tracks matching the filter
 * are delivered. Returns an unsubscribe function.
 */
export function subscribe(
  listener: TrackValueListener,
  options?: { filter?: ListenerFilter },
): () => void {
  const id = nextListenerId;
  nextListenerId += 1;
  listeners.set(id, {
    id,
    listener,
    filter: options?.filter ?? {},
  });
  return () => {
    listeners.delete(id);
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
