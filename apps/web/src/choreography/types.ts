/**
 * @module choreography/types
 *
 * The contract for choreographies. A choreography is a named,
 * timed animation with one or more tracks. Each track animates
 * a single numeric property of a single target.
 *
 * Choreographies are data, not code. The engine interprets them.
 *
 * A choreography may be a single phase (a flat set of tracks) or
 * a sequence of phases that play one after another. The completion
 * choreography is a sequence: Reach, Grab, Drag, Release, Dissolve,
 * Settle.
 *
 * Based on System Architecture §35.
 */

/** The named easings available to choreographies. */
export type EasingName =
  | 'linear'
  | 'cinematic'
  | 'settle'
  | 'overshoot'
  | 'dissolve'
  | 'anticipate'
  | 'breathe';

/**
 * A single keyframe.
 *   t     — normalized time, 0.0 to 1.0
 *   value — the target value at that time
 *   easing — the easing used to reach this keyframe from the previous one
 */
export interface Keyframe {
  t: number;
  value: number;
  easing: EasingName;
}

/**
 * A track animates one numeric property of one named target.
 *
 * `target` is a string key that identifies the object being
 * animated. During completion, targets include `node`, `zone`,
 * `camera`, and `particles`.
 *
 * `property` is the property on that target. `node.scale`,
 * `zone.opacity`, `particles.count`.
 */
export interface ChoreographyTrack {
  target: string;
  property: string;
  keyframes: Keyframe[];
}

/**
 * A phase within a sequence. Each phase has a name, its own
 * duration, and its own tracks. Phases play in order.
 */
export interface SequencePhase {
  name: string;
  duration: number;
  tracks: ChoreographyTrack[];
}

/**
 * A choreography.
 *
 * A choreography is either:
 *   - a single phase (tracks only, no sequence), or
 *   - a sequence of phases (sequence populated).
 *
 * The engine plays the sequence in order, one phase after
 * another. The total duration is the sum of the phase durations.
 *
 * `interruptible` — whether another choreography may cancel this.
 * `reducedMotionVariant` — optional name of a replacement
 *   choreography played instead when reduced motion is active.
 */
export interface Choreography {
  name: string;
  duration: number;
  tracks: ChoreographyTrack[];
  sequence?: SequencePhase[];
  interruptible: boolean;
  reducedMotionVariant?: string;
}

/**
 * A handle returned by the engine when a choreography is played.
 * The caller can cancel it, await it, or let it complete naturally.
 */
export interface ChoreographyHandle {
  id: string;
  name: string;
  promise: Promise<void>;
  cancel: () => void;
}

/**
 * A callback invoked by the engine when a track's value changes.
 * The engine calls this every frame while a choreography is playing.
 * The caller is responsible for applying the value wherever it
 * belongs — a React ref, a material property, a store, etc.
 */
export type TrackValueListener = (
  target: string,
  property: string,
  value: number,
) => void;

/**
 * A filter for a scoped listener. If provided, the listener is
 * only called for tracks matching the filter. If null, the listener
 * is called for every track.
 */
export interface ListenerFilter {
  target?: string;
  property?: string;
}

/**
 * Options for subscribing to the engine. The listener receives
 * values only for tracks matching the filter.
 */
export interface SubscribeOptions {
  filter?: ListenerFilter;
}
