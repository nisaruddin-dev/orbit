/* eslint-disable react-hooks/immutability */
/**
 * @module scene/DissolveParticles
 *
 * The particle burst emitted when a node dissolves. Mounted once
 * in the Canvas. Reads the completing node's position and the
 * completion choreography's `particles.progress` track, and
 * animates ~240 instanced particles from the node's center
 * outward, then fades them out.
 *
 * The component is inert when no node is completing. When a
 * completion begins, it seeds particle directions from the
 * current node position, then plays the dissolve.
 *
 * Particle count and drift are per UI/UX §116: approximately
 * 240 dissolve particles, drifting outward and upward.
 */

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Color,
  Matrix4,
  MeshBasicMaterial,
  Vector3,
} from 'three';
import type { InstancedMesh } from 'three';

import { ACCENT } from '@/design';
import { subscribe } from '@/choreography';
import { useInteractionStore } from '@/state/interaction';

/** Number of dissolve particles. UI/UX §116. */
const PARTICLE_COUNT = 240;

/** Maximum outward drift distance, in world units. */
const MAX_DRIFT = 2.4;

/** Base particle radius. */
const PARTICLE_RADIUS = 0.03;

/** How much the particles drift upward as they go out. */
const UPWARD_BIAS = 0.6;

export function DissolveParticles() {
  const meshRef = useRef<InstancedMesh>(null);

  const completingNodeId = useInteractionStore((s) => s.completingNodeId);
  const nodeSettledPositions = useInteractionStore(
    (s) => s.nodeSettledPositions,
  );
  const tasks = useInteractionStore((s) => s.nodePositions);

  const particleColor = useMemo(() => new Color(ACCENT.done), []);

  const material = useMemo(
    () =>
      new MeshBasicMaterial({
        color: particleColor,
        transparent: true,
        opacity: 0.0,
        depthWrite: false,
      }),
    [particleColor],
  );

  // Progress of the dissolve, 0..1, from the choreography.
  const progressRef = useRef(0.0);

  // Per-particle direction vectors, seeded once per dissolve.
  const directions = useMemo(() => {
    const arr: Vector3[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Random unit vector with an upward bias so particles tend
      // to drift up and out.
      const x = Math.random() * 2 - 1;
      const y = Math.random() * 2 - 1 + UPWARD_BIAS;
      const z = Math.random() * 2 - 1;
      const v = new Vector3(x, y, z);
      if (v.lengthSq() < 0.0001) v.set(0, 1, 0);
      v.normalize();
      arr.push(v);
    }
    return arr;
  }, []);

  // Random per-particle scale, so the burst does not look uniform.
  const scales = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr.push(0.6 + Math.random() * 0.8);
    }
    return arr;
  }, []);

  // Scratch objects reused each frame to avoid GC pressure.
  const scratchMatrix = useMemo(() => new Matrix4(), []);
  const scratchPosition = useMemo(() => new Vector3(), []);
  const scratchScale = useMemo(() => new Vector3(), []);

  // The world position where the dissolve began. Captured once
  // when completingNodeId changes.
  const originRef = useRef<[number, number, number] | null>(null);

  useEffect(() => {
    if (!completingNodeId) {
      originRef.current = null;
      progressRef.current = 0;
      return;
    }
    const pos = nodeSettledPositions[completingNodeId];
    if (pos) {
      originRef.current = pos;
    } else {
      const fallback = tasks[completingNodeId];
      if (fallback) originRef.current = fallback;
    }
  }, [completingNodeId, nodeSettledPositions, tasks]);

  // Subscribe to the dissolve's particles.progress track.
  useEffect(() => {
    const unsubscribe = subscribe(
      (_target, property, value) => {
        if (property === 'progress') progressRef.current = value;
      },
      { filter: { target: 'particles' } },
    );
    return () => {
      unsubscribe();
    };
  }, []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const origin = originRef.current;

    // Inactive: hide the mesh and skip all work.
    if (!origin || !completingNodeId) {
      material.opacity = 0;
      mesh.visible = false;
      return;
    }

    const progress = progressRef.current;

    // Fade in over the first 15% of the dissolve, out over the
    // last 40%.
    let opacity: number;
    if (progress < 0.15) {
      opacity = progress / 0.15;
    } else if (progress > 0.6) {
      opacity = Math.max(0, (1 - progress) / 0.4);
    } else {
      opacity = 1.0;
    }

    material.opacity = opacity * 0.9;

    // Distance each particle has travelled. Ease-out so particles
    // burst quickly then slow.
    const driftEase = 1 - Math.pow(1 - progress, 2.5);
    const driftDistance = driftEase * MAX_DRIFT;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const dir = directions[i];
      const s = scales[i];
      if (!dir || s === undefined) continue;

      scratchPosition.set(
        origin[0] + dir.x * driftDistance,
        origin[1] + dir.y * driftDistance,
        origin[2] + dir.z * driftDistance,
      );

      // Particles start at full size and shrink toward the end.
      const sizeScale = s * (1 - progress * 0.7);
      scratchScale.setScalar(sizeScale);

      scratchMatrix.compose(
        scratchPosition,
        // No rotation — particles are tiny spheres.
        mesh.quaternion,
        scratchScale,
      );

      mesh.setMatrixAt(i, scratchMatrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    mesh.visible = material.opacity > 0.01;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, PARTICLE_COUNT]}
      material={material}
      frustumCulled={false}
      visible={false}
    >
      <sphereGeometry args={[PARTICLE_RADIUS, 6, 4]} />
    </instancedMesh>
  );
}
