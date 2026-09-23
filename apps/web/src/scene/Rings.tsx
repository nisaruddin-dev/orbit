/**
 * @module scene/Rings
 *
 * The three orbital rings — Today, This Week, Someday.
 *
 * Each ring has its own radius, brightness, and rotation speed.
 * The personality of each ring is defined here, not in tokens,
 * because it's about *relative* difference, not absolute values.
 */

import { OrbitRing } from './OrbitRing';
import { ACCENT, IDLE, SPATIAL } from '@/design';

/**
 * Renders all three rings.
 */
export function Rings() {
  return (
    <>
      {/* Today — brightest, most present, fastest rotation */}
      <OrbitRing
        radius={SPATIAL.ringTodayRadius}
        rotationSpeed={IDLE.ringRotationToday}
        color={ACCENT.active}
        emissiveIntensity={0.35}
      />

      {/* This Week — cooler, dimmer, slower */}
      <OrbitRing
        radius={SPATIAL.ringWeekRadius}
        rotationSpeed={IDLE.ringRotationWeek}
        color={ACCENT.focus}
        emissiveIntensity={0.22}
      />

      {/* Someday — restrained, almost atmospheric, slowest */}
      <OrbitRing
        radius={SPATIAL.ringSomedayRadius}
        rotationSpeed={IDLE.ringRotationSomeday}
        color={ACCENT.dormant}
        emissiveIntensity={0.12}
      />
    </>
  );
}
