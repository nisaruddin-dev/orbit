/**
 * @module scene/Aurora
 *
 * The Aurora — a faint ribbon of particles at radius 15 that
 * represents completed work.
 *
 * Only visible when there are completed tasks in the last 7 days.
 * Brightness is proportional to the count. It is memory, not a
 * score. It does not display numbers, does not compare today to
 * yesterday, and does not reward the user for streaks.
 *
 * Particles are arranged in a ring, not a sphere. The ring has
 * slight vertical and radial variation so it reads as a ribbon
 * rather than a line.
 *
 * Source: PRD F-105, §8.5, UI/UX §10 (Aurora), TRD §37
 * (Aurora Architecture).
 */

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, Matrix4, Vector3 } from 'three';
import type { InstancedMesh } from 'three';

import { ACCENT, IDLE, SPATIAL } from '@/design';
import { useTaskStore } from '@/state/tasks';

/** How many particles compose the ribbon. */
const AURORA_PARTICLE_COUNT = 300;

/** Vertical thickness of the ribbon, in world units. */
const RIBBON_THICKNESS = 1.2;

/** Radial variation of the ribbon, in world units. */
const RIBBON_RADIAL_VARIATION = 0.8;

/** Base drift speed. Very slow. */
const DRIFT_SPEED = 0.02;

/** Base opacity when the Aurora is at full strength. */
const BASE_OPACITY = 0.35;

/** Days after which a completion no longer contributes. */
const VISIBLE_HORIZON_DAYS = 7;

interface ParticleSeed {
  /** Angle around the ring. */
  angle: number;
  /** Vertical offset from the ring plane. */
  y: number;
  /** Radial offset added to the base radius. */
  radialOffset: number;
  /** Phase for the drift. */
  phase: number;
  /** Speed multiplier. */
  speed: number;
}

/**
 * Generates the ring layout. Called once.
 */
function generateSeeds(count: number): ParticleSeed[] {
  const seeds: ParticleSeed[] = [];
  for (let i = 0; i < count; i++) {
    // Spread particles evenly around the ring, with a slight
    // jitter so they do not form a perfect line.
    const baseAngle = (i / count) * Math.PI * 2;
    const angle = baseAngle + (Math.random() - 0.5) * 0.15;

    seeds.push({
      angle,
      y: (Math.random() - 0.5) * RIBBON_THICKNESS,
      radialOffset: (Math.random() - 0.5) * RIBBON_RADIAL_VARIATION,
      phase: Math.random() * Math.PI * 2,
      speed: 0.7 + Math.random() * 0.6,
    });
  }
  return seeds;
}

/**
 * Counts the number of completions in the last 7 days.
 * Returns 0 if none.
 */
function countRecentCompletions(
  tasks: { status: string; completedAt: string | null }[],
): number {
  const horizon = Date.now() - VISIBLE_HORIZON_DAYS * 24 * 60 * 60 * 1000;
  let count = 0;
  for (const task of tasks) {
    if (task.status !== 'completed') continue;
    if (!task.completedAt) continue;
    const t = Date.parse(task.completedAt);
    if (!Number.isNaN(t) && t >= horizon) {
      count += 1;
    }
  }
  return count;
}

/**
 * The Aurora ribbon.
 */
export function Aurora() {
  const meshRef = useRef<InstancedMesh>(null);

  const seeds = useMemo(
    () => generateSeeds(AURORA_PARTICLE_COUNT),
    [],
  );

  const tasks = useTaskStore((s) => s.tasks);
  const recentCount = useMemo(
    () => countRecentCompletions(tasks),
    [tasks],
  );

  // Target opacity: 0 when no recent completions, up to
  // BASE_OPACITY as the count approaches 20. Softly clamped so
  // the ribbon does not become a beacon.
  const targetOpacity = Math.min(
    BASE_OPACITY,
    (recentCount / 20) * BASE_OPACITY,
  );

  const opacityRef = useRef(0);

  const scratchMatrix = useMemo(() => new Matrix4(), []);
  const scratchPosition = useMemo(() => new Vector3(), []);
  const auroraColor = useMemo(() => new Color(ACCENT.done), []);

  // When the count changes, ease the opacity toward the target.
  useEffect(() => {
    opacityRef.current = targetOpacity;
  }, [targetOpacity]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const t = state.clock.elapsedTime;

    // Drift: a slow rotation of the whole ribbon.
    const drift =
      Math.sin((t * Math.PI * 2) / IDLE.auroraDriftPeriod) *
      IDLE.auroraDriftAmount;

    for (let i = 0; i < seeds.length; i++) {
      const seed = seeds[i];
      if (!seed) continue;

      const angle =
        seed.angle + drift * 0.1 + Math.sin(t * DRIFT_SPEED * seed.speed + seed.phase) * 0.05;
      const radius = SPATIAL.auroraRadius + seed.radialOffset;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y =
        seed.y +
        Math.sin(t * DRIFT_SPEED * seed.speed + seed.phase) * 0.15;

      scratchPosition.set(x, y, z);
      scratchMatrix.makeTranslation(
        scratchPosition.x,
        scratchPosition.y,
        scratchPosition.z,
      );

      mesh.setMatrixAt(i, scratchMatrix);
    }

    mesh.instanceMatrix.needsUpdate = true;

    // Update opacity on the material.
    const material = mesh.material;
    if (Array.isArray(material)) return;
    material.opacity = opacityRef.current;

    // Hide the mesh entirely when opacity is effectively 0.
    mesh.visible = opacityRef.current > 0.01;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, AURORA_PARTICLE_COUNT]}
      frustumCulled={false}
      visible={false}
    >
      <sphereGeometry args={[0.06, 6, 4]} />
      <meshBasicMaterial
        color={auroraColor}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
