/**
 * @module choreography/zone
 *
 * The completion zone's choreographies. These are data — the
 * engine interprets them. Values are read from tokens where
 * practical, but the keyframe values here are normalized
 * (0..1 for opacity, etc.) and the zone component applies them
 * to its own material properties.
 *
 * Four choreographies:
 *   zone.appear    — the zone fades in when a drag begins
 *   zone.pulse     — the zone breathes while idle-visible
 *   zone.recover   — the zone fades out after a release outside
 *   node.springBack — a node returns to its pre-drag position
 */

import type { Choreography } from './types';

export const ZONE_CHOREOGRAPHIES: Choreography[] = [
  {
    name: 'zone.appear',
    duration: 0.3,
    interruptible: true,
    tracks: [
      {
        target: 'zone',
        property: 'opacity',
        keyframes: [
          { t: 0.0, value: 0.0, easing: 'linear' },
          { t: 1.0, value: 0.6, easing: 'settle' },
        ],
      },
      {
        target: 'zone',
        property: 'scale',
        keyframes: [
          { t: 0.0, value: 0.8, easing: 'linear' },
          { t: 1.0, value: 1.0, easing: 'overshoot' },
        ],
      },
    ],
  },
  {
    name: 'zone.pulse',
    duration: 1.4,
    interruptible: true,
    tracks: [
      {
        target: 'zone',
        property: 'emissive',
        keyframes: [
          { t: 0.0, value: 0.4, easing: 'breathe' },
          { t: 0.5, value: 0.8, easing: 'breathe' },
          { t: 1.0, value: 0.4, easing: 'linear' },
        ],
      },
    ],
  },
  {
    name: 'zone.recover',
    duration: 0.4,
    interruptible: true,
    tracks: [
      {
        target: 'zone',
        property: 'opacity',
        keyframes: [
          { t: 0.0, value: 0.6, easing: 'linear' },
          { t: 1.0, value: 0.0, easing: 'dissolve' },
        ],
      },
      {
        target: 'zone',
        property: 'scale',
        keyframes: [
          { t: 0.0, value: 1.0, easing: 'linear' },
          { t: 1.0, value: 0.85, easing: 'settle' },
        ],
      },
    ],
  },
  {
    name: 'node.springBack',
    duration: 0.6,
    interruptible: true,
    tracks: [
      {
        target: 'node',
        property: 'progress',
        keyframes: [
          { t: 0.0, value: 0.0, easing: 'linear' },
          { t: 1.0, value: 1.0, easing: 'overshoot' },
        ],
      },
    ],
  },
];
