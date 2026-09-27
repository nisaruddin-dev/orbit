/**
 * @module lib/placement
 *
 * Chooses where a new task lands on a ring.
 *
 * Source: System Architecture §15 (Spatial Placement).
 */

import type { Task } from '@orbit/shared';

const TWO_PI = Math.PI * 2;

export function findPlacementAngle(
  tasks: Task[],
  ring: 'today' | 'week' | 'someday',
): number {
  const onRing = tasks
    .filter((t) => t.ring === ring && t.status !== 'archived')
    .map((t) => t.orbitAngle)
    .filter((a): a is number => a !== null)
    .map((a) => ((a % TWO_PI) + TWO_PI) % TWO_PI)
    .sort((a, b) => a - b);

  if (onRing.length === 0) return 0;

  const first = onRing[0];
  if (first === undefined) return 0;
  if (onRing.length === 1) return (first + Math.PI) % TWO_PI;

  let bestGap = 0;
  let bestAngle = 0;

  for (let i = 0; i < onRing.length; i++) {
    const current = onRing[i];
    const next = onRing[(i + 1) % onRing.length];
    if (current === undefined || next === undefined) continue;

    const gap =
      i === onRing.length - 1
        ? TWO_PI - current + next
        : next - current;

    if (gap > bestGap) {
      bestGap = gap;
      bestAngle = (current + gap / 2) % TWO_PI;
    }
  }
  return bestAngle;
}

export const RING_RADIUS: Record<'today' | 'week' | 'someday', number> = {
  today: 4,
  week: 7,
  someday: 10,
};
