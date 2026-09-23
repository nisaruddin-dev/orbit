/**
 * @module scene/Dust
 *
 * Ambient dust motes. 200 instanced particles drifting slowly
 * through the scene.
 *
 * Uses InstancedMesh so all 200 particles render in a single
 * draw call. This is essential for performance.
 *
 * Each particle has:
 *   - a random starting position in a sphere
 *   - a slow independent drift velocity
 *   - a phase offset so no two particles move in sync
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, InstancedMesh, Matrix4, Vector3 } from 'three';

import { PARTICLES } from '@/design';

/** Radius of the sphere that contains all dust. */
const DUST_SPHERE_RADIUS = 20;

/** Base drift speed for particles. Very slow. */
const DRIFT_SPEED = 0.05;

/** How far each particle wanders from its start position. */
const DRIFT_AMPLITUDE = 0.6;

/** Each particle's drift direction (normalized) and phase. */
type ParticleSeed = {
  origin: Vector3;
  direction: Vector3;
  phase: number;
  speed: number;
};

/**
 * Generates random seeds for all particles. Called once.
 */
function generateSeeds(count: number): ParticleSeed[] {
  const seeds: ParticleSeed[] = [];

  for (let i = 0; i < count; i++) {
    // Random point in a sphere (rejection sampling)
    let x = 0;
    let y = 0;
    let z = 0;
    do {
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
      z = Math.random() * 2 - 1;
    } while (x * x + y * y + z * z > 1);

    const origin = new Vector3(
      x * DUST_SPHERE_RADIUS,
      y * DUST_SPHERE_RADIUS,
      z * DUST_SPHERE_RADIUS,
    );

    // Random normalized direction
    const direction = new Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
    ).normalize();

    seeds.push({
      origin,
      direction,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5, // 0.5 to 1.0 multiplier
    });
  }

  return seeds;
}

/**
 * Renders the dust. Reuses a single InstancedMesh.
 */
export function Dust() {
  const meshRef = useRef<InstancedMesh>(null);

  // Generate seeds once. Never changes.
  const seeds = useMemo(
    () => generateSeeds(PARTICLES.ambientDust),
    [],
  );

  // Scratch objects reused every frame (avoid GC pressure).
  const scratchMatrix = useMemo(() => new Matrix4(), []);
  const scratchPosition = useMemo(() => new Vector3(), []);

  // Each frame, update the position of every particle.
  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const t = state.clock.elapsedTime;

    for (let i = 0; i < seeds.length; i++) {
      const seed = seeds[i];
      if (!seed) continue;

      // Sinusoidal drift along the particle's direction.
      // Each particle has its own phase and speed so they never sync.
      const offset =
        Math.sin(t * DRIFT_SPEED * seed.speed + seed.phase) * DRIFT_AMPLITUDE;

      scratchPosition
        .copy(seed.origin)
        .addScaledVector(seed.direction, offset);

      scratchMatrix.makeTranslation(
        scratchPosition.x,
        scratchPosition.y,
        scratchPosition.z,
      );

      mesh.setMatrixAt(i, scratchMatrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, PARTICLES.ambientDust]}
      frustumCulled={false}
    >
      <sphereGeometry args={[0.015, 4, 4]} />
      <meshBasicMaterial
        color={new Color('#E8EAF2')}
        transparent
        opacity={0.25}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
