/**
 * @module choreography/types
 *
 * The contract for choreographies. A choreography is a named,
 * timed animation with one or more tracks. Each track animates
 * a single numeric property of a single target.
 *
 * Choreographies are data, not code. The engine interprets them.
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
 * The target is a string key the caller provides when playing the
 * choreography. For example, a zone might be played with
 * `play('zone.appear', { target: 'zone' })`, and a track with
 * `target: 'zone'` and `property: 'opacity'` would animate the
 * caller's `zone.opacity` value.
 */
export interface ChoreographyTrack {
  target: string;
  property: string;
  keyframes: Keyframe[];
}

/**
 * A choreography.
 *   name                 — unique identifier for lookup
 *   duration             — total duration in seconds
 *   tracks               — one or more tracks
 *   interruptible        — whether another choreography may cancel this one
 *   reducedMotionVariant — optional name of a replacement choreography
 *                          to play instead when reduced motion is active
 */
export interface Choreography {
  name: string;
  duration: number;
  tracks: ChoreographyTrack[];
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
