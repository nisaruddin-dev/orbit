/**
 * @module choreography/easings
 *
 * The named easings available to choreographies. These mirror
 * the cubic-bezier curves in UI/UX §77, converted to functions.
 *
 * Each function takes a normalized time t (0..1) and returns the
 * eased value (also 0..1).
 */

import type { EasingName } from './types';

/** Linear. Almost never the right choice, but provided for completeness. */
function linear(t: number): number {
  return t;
}

/**
 * cinematic — cubic-bezier(0.65, 0, 0.35, 1)
 * Used for camera transitions and major environment changes.
 */
function cinematic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * settle — cubic-bezier(0.22, 1, 0.36, 1)
 * Used for elements coming to rest.
 */
function settle(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * overshoot — cubic-bezier(0.34, 1.56, 0.64, 1)
 * Used for spring-backs, pops, and materialization.
 * Overshoots past 1.0 before settling back.
 */
function overshoot(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

/**
 * dissolve — cubic-bezier(0.4, 0, 0.2, 1)
 * Used for fades and material transitions.
 */
function dissolve(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * anticipate — cubic-bezier(0.6, -0.28, 0.735, 0.045)
 * Winds up slightly before moving.
 */
function anticipate(t: number): number {
  const c1 = 3.0;
  return c1 * t * t * t - (c1 - 1) * t * t;
}

/**
 * breathe — cubic-bezier(0.45, 0, 0.55, 1)
 * Symmetric ease-in-out. Used for looping pulses.
 */
function breathe(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/** The easing lookup table. */
export const EASINGS: Record<EasingName, (t: number) => number> = {
  linear,
  cinematic,
  settle,
  overshoot,
  dissolve,
  anticipate,
  breathe,
};
