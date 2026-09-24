/**
 * @module choreography/ChoreographyTicker
 *
 * Ticks the choreography engine once per frame. Mounted inside
 * the Canvas. Renders nothing.
 */

import { useFrame } from '@react-three/fiber';

import { tick } from './engine';

export function ChoreographyTicker() {
  useFrame(() => {
    tick();
  });
  return null;
}
