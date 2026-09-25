/**
 * @module choreography/completion
 *
 * The completion choreography — the six-phase sequence that runs
 * when a task is released into the completion zone.
 *
 * This file defines the choreography as data. It does not run it.
 * The engine plays it. The components inside the Canvas listen
 * for its track values and apply them.
 *
 * Phases (baseline timings from PRD F-401 / UI-UX §42):
 *   1. Reach          0.0 – 0.3s   node grows, shell activates, label appears
 *   2. Grab           0.3 – 0.6s   node detaches, others dim
 *   3. Drag           0.6 – 1.5s   node follows, zone emerges
 *   4. Release        1.5 – 1.8s   physics handoff, node enters zone
 *   5. Dissolve       1.8 – 2.8s   node shatters into particles
 *   6. Settle         2.8 – 4.0s   world returns to equilibrium
 *
 * The timings are a baseline, not a law. Emotional rhythm matters
 * more than exact milliseconds. They can be tuned without changing
 * any other file.
 *
 * Track values are normalized (0..1 for progress, scale multipliers
 * around 1.0 for size). The consumer applies them to the actual
 * object properties.
 */

import type { Choreography } from './types';

export const COMPLETION_CHOREOGRAPHY: Choreography = {
  name: 'completion',
  // The total duration is computed by the engine from the phases.
  // This field is only used if the engine ever needs a single
  // number without walking the sequence.
  duration: 4.0,
  interruptible: true,
  tracks: [],
  sequence: [
    {
      name: 'reach',
      duration: 0.3,
      tracks: [
        {
          target: 'node',
          property: 'scale',
          keyframes: [
            { t: 0.0, value: 1.0, easing: 'linear' },
            { t: 1.0, value: 1.15, easing: 'settle' },
          ],
        },
        {
          target: 'node',
          property: 'shellOpacity',
          keyframes: [
            { t: 0.0, value: 0.15, easing: 'linear' },
            { t: 1.0, value: 0.5, easing: 'settle' },
          ],
        },
        {
          target: 'node',
          property: 'labelOpacity',
          keyframes: [
            { t: 0.0, value: 0.0, easing: 'linear' },
            { t: 1.0, value: 1.0, easing: 'settle' },
          ],
        },
      ],
    },
    {
      name: 'grab',
      duration: 0.3,
      tracks: [
        {
          target: 'world',
          property: 'dim',
          keyframes: [
            { t: 0.0, value: 0.0, easing: 'linear' },
            { t: 1.0, value: 0.6, easing: 'dissolve' },
          ],
        },
        {
          target: 'node',
          property: 'scale',
          keyframes: [
            { t: 0.0, value: 1.15, easing: 'linear' },
            { t: 1.0, value: 1.2, easing: 'settle' },
          ],
        },
      ],
    },
    {
      name: 'drag',
      duration: 0.9,
      tracks: [
        {
          target: 'zone',
          property: 'opacity',
          keyframes: [
            { t: 0.0, value: 0.0, easing: 'linear' },
            { t: 0.3, value: 0.7, easing: 'settle' },
            { t: 1.0, value: 0.7, easing: 'linear' },
          ],
        },
        {
          target: 'zone',
          property: 'scale',
          keyframes: [
            { t: 0.0, value: 0.9, easing: 'linear' },
            { t: 0.3, value: 1.05, easing: 'overshoot' },
            { t: 1.0, value: 1.0, easing: 'settle' },
          ],
        },
      ],
    },
    {
      name: 'release',
      duration: 0.3,
      tracks: [
        {
          target: 'node',
          property: 'emissive',
          keyframes: [
            { t: 0.0, value: 0.5, easing: 'linear' },
            { t: 1.0, value: 1.5, easing: 'settle' },
          ],
        },
        {
          target: 'zone',
          property: 'emissive',
          keyframes: [
            { t: 0.0, value: 0.7, easing: 'linear' },
            { t: 1.0, value: 1.4, easing: 'settle' },
          ],
        },
      ],
    },
    {
      name: 'dissolve',
      duration: 1.0,
      tracks: [
        {
          target: 'node',
          property: 'scale',
          keyframes: [
            { t: 0.0, value: 1.2, easing: 'linear' },
            { t: 0.6, value: 0.9, easing: 'dissolve' },
            { t: 1.0, value: 0.0, easing: 'dissolve' },
          ],
        },
        {
          target: 'node',
          property: 'emissive',
          keyframes: [
            { t: 0.0, value: 1.5, easing: 'linear' },
            { t: 0.4, value: 3.0, easing: 'linear' },
            { t: 1.0, value: 3.0, easing: 'linear' },
          ],
        },
        {
          target: 'particles',
          property: 'progress',
          keyframes: [
            { t: 0.0, value: 0.0, easing: 'linear' },
            { t: 1.0, value: 1.0, easing: 'dissolve' },
          ],
        },
        {
          target: 'camera',
          property: 'dolly',
          keyframes: [
            { t: 0.0, value: 0.0, easing: 'linear' },
            { t: 0.5, value: -0.03, easing: 'cinematic' },
            { t: 1.0, value: 0.0, easing: 'cinematic' },
          ],
        },
      ],
    },
    {
      name: 'settle',
      duration: 1.2,
      tracks: [
        {
          target: 'world',
          property: 'dim',
          keyframes: [
            { t: 0.0, value: 0.6, easing: 'linear' },
            { t: 1.0, value: 0.0, easing: 'dissolve' },
          ],
        },
        {
          target: 'zone',
          property: 'opacity',
          keyframes: [
            { t: 0.0, value: 0.7, easing: 'linear' },
            { t: 1.0, value: 0.0, easing: 'dissolve' },
          ],
        },
      ],
    },
  ],
};
