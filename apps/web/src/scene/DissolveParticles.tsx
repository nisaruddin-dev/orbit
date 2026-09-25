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
 * Random seeding is done once on mount inside an effect, not
 * during render. React 19 forbids calling impure functions
 * (including Math.random) during render.
 */

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, Matrix4, MeshBasicMaterial, Quaternion, Vector3 } from 'three';
import type { InstancedMesh } from 'three';

import { ACCENT } from '@/design';
import { subscribe } from '@/choreography';
import { useInteractionStore } from '@/state/interaction';

const PARTICLE_COUNT = 240;
const MAX_DRIFT = 2.4;
const PARTICLE_RADIUS = 0.03;
const UPWARD_BIAS = 0.6;

export function DissolveParticles() {
  const meshRef = useRef<InstancedMesh>(null);

  const completingNodeId = useInteractionStore((s) => s.completingNodeId);
  const nodeSettledPositions = useInteractionStore(
    (s) => s.nodeSettledPositions,
  );
  const nodePositions = useInteractionStore((s) => s.nodePositions);

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

  // Per-particle direction vectors and scales. Seeded once on
  // mount inside an effect, not during render.
  const directionsRef = useRef<Vector3[]>([]);
  const scalesRef = useRef<number[]>([]);

  // Scratch objects reused each frame.
  const scratchMatrix = useMemo(() => new Matrix4(), []);
  const scratchPosition = useMemo(() => new Vector3(), []);
  const scratchScale = useMemo(() => new Vector3(), []);
  const scratchQuat = useMemo(() => new Quaternion(), []);

  // The world position where the dissolve began.
  const originRef = useRef<[number, number, number] | null>(null);

  // Seed particle data once on mount. Inside an effect so it is
  // not part of render.
  useEffect(() => {
    const dirs: Vector3[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * 2 - 1;
      const y = Math.random() * 2 - 1 + UPWARD_BIAS;
      const z = Math.random() * 2 - 1;
      const v = new Vector3(x, y, z);
      if (v.lengthSq() < 0.0001) v.set(0, 1, 0);
      v.normalize();
      dirs.push(v);
    }
    directionsRef.current = dirs;

    const s: number[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      s.push(0.6 + Math.random() * 0.8);
    }
    scalesRef.current = s;
  }, []);

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
      const fallback = nodePositions[completingNodeId];
      if (fallback) originRef.current = fallback;
    }
  }, [completingNodeId, nodeSettledPositions, nodePositions]);

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

    if (!origin || !completingNodeId) {
      if (material.opacity !== 0) material.opacity = 0;
      if (mesh.visible) mesh.visible = false;
      return;
    }

    const progress = progressRef.current;

    let opacity: number;
    if (progress < 0.15) {
      opacity = progress / 0.15;
    } else if (progress > 0.6) {
      opacity = Math.max(0, (1 - progress) / 0.4);
    } else {
      opacity = 1.0;
    }

    material.opacity = opacity * 0.9;

    const driftEase = 1 - Math.pow(1 - progress, 2.5);
    const driftDistance = driftEase * MAX_DRIFT;

    const directions = directionsRef.current;
    const scales = scalesRef.current;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const dir = directions[i];
      const s = scales[i];
      if (!dir || s === undefined) continue;

      scratchPosition.set(
        origin[0] + dir.x * driftDistance,
        origin[1] + dir.y * driftDistance,
        origin[2] + dir.z * driftDistance,
      );

      const sizeScale = s * (1 - progress * 0.7);
      scratchScale.setScalar(sizeScale);

      scratchMatrix.compose(scratchPosition, scratchQuat, scratchScale);
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
