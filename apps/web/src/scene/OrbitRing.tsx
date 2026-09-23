/**
 * @module scene/OrbitRing
 *
 * A single orbital ring. Three of these exist in the world —
 * one for Today, one for This Week, one for Someday.
 *
 * Rings are thin toruses. They rotate slowly. They are never
 * labeled. Their meaning is conveyed by radius and brightness.
 *
 * The ring is deliberately subtle. It exists to provide spatial
 * orientation, not decoration.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, MeshStandardMaterial } from 'three';
import type { Mesh } from 'three';

interface OrbitRingProps {
  /** Distance from the Core. */
  radius: number;
  /** Rotation speed in radians per second. */
  rotationSpeed: number;
  /** Base color of the ring. */
  color: string;
  /** Emissive intensity (brightness). */
  emissiveIntensity: number;
}

/**
 * A single ring. The torus geometry is already flat on the XZ
 * plane by default, so no rotation is needed on mount — we only
 * rotate around Y to animate.
 */
export function OrbitRing({
  radius,
  rotationSpeed,
  color,
  emissiveIntensity,
}: OrbitRingProps) {
  const meshRef = useRef<Mesh>(null);

  // Create the material once. Memoized so it's not recreated.
  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color(color),
        emissive: new Color(color),
        emissiveIntensity,
        roughness: 0.4,
        metalness: 0.6,
        transparent: true,
        opacity: 0.9,
      }),
    [color, emissiveIntensity],
  );

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.rotation.z += rotationSpeed * delta;
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[Math.PI / 2, 0, 0]}
      material={material}
    >
      <torusGeometry args={[radius, 0.01, 8, 128]} />
    </mesh>
  );
}
