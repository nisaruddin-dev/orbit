/**
 * @module scene/Core
 *
 * The Core — a soft, glowing sphere at the origin.
 *
 * The Core represents "now." It is not a button. It is a reference
 * point. It anchors the camera and acts as the origin for task
 * creation (later chunks).
 *
 * It is deliberately matte. It is deliberately subtle. It should
 * be felt more than noticed.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color } from 'three';
import type { Mesh, MeshStandardMaterial } from 'three';

import { IDLE, SPATIAL } from '@/design';

/**
 * The Core sphere. Pulses its emissive intensity on a 4-second
 * breathe cycle.
 */
export function Core() {
  const meshRef = useRef<Mesh>(null);

  // The Core's base color: warm off-white from the active accent,
  // but pulled toward a neutral cream so it doesn't read as "cyan."
  const coreColor = useMemo(() => new Color('#E8EAF2'), []);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const material = mesh.material as MeshStandardMaterial;
    const t = state.clock.elapsedTime;

    // Compute breathe cycle: a full cycle every `coreBreathPeriod` seconds.
    // sin() oscillates between -1 and 1, so we remap to [min, max].
    const omega = (2 * Math.PI) / IDLE.coreBreathPeriod;
    const sine = Math.sin(t * omega);
    const normalized = (sine + 1) * 0.5; // remap to [0, 1]

    // Emissive intensity oscillates between min and max.
    const intensity =
      IDLE.coreBreathMin + normalized * (IDLE.coreBreathMax - IDLE.coreBreathMin);

    material.emissiveIntensity = intensity;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[SPATIAL.coreRadius, 64, 32]} />
      <meshStandardMaterial
        color={coreColor}
        emissive={coreColor}
        emissiveIntensity={1.0}
        roughness={0.8}
        metalness={0.0}
      />
    </mesh>
  );
}
