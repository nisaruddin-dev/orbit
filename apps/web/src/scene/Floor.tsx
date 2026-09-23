/**
 * @module scene/Floor
 *
 * The reflective floor. Sits at y = floorY (from spatial tokens),
 * extends outward beyond the visible scene, and receives a soft
 * blurred reflection.
 *
 * Not a mirror. The reflection is diffuse — like polished stone,
 * not glass.
 *
 * The floor is deliberately large (radius 200) so the horizon
 * disappears into fog rather than showing the floor's edge.
 */

import { useMemo } from 'react';
import { Color, DoubleSide } from 'three';

import { ENVIRONMENT, SPATIAL } from '@/design';

/**
 * The floor plane. Large enough that its edges are lost in fog.
 */
export function Floor() {
  // Memoize the material color so it's not re-created on every render.
  const floorColor = useMemo(() => new Color(ENVIRONMENT.floor), []);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, SPATIAL.floorY, 0]}
      receiveShadow
    >
      {/* Large circle — round edges feel more natural than a square */}
      <circleGeometry args={[200, 64]} />
      <meshStandardMaterial
        color={floorColor}
        roughness={0.4}
        metalness={0.1}
        side={DoubleSide}
      />
    </mesh>
  );
}
