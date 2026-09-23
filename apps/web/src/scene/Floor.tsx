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

import { ENVIRONMENT, SPATIAL } from '@/design';

/**
 * The floor plane. Large enough that its edges are lost in fog.
 */
export function Floor() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, SPATIAL.floorY, 0]}
      receiveShadow
    >
      {/* Large circle — round edges feel more natural than a square */}
      <circleGeometry args={[200, 64]} />
      <meshStandardMaterial
        color={ENVIRONMENT.floor}
        roughness={0.5}
        metalness={0.05}
        side={2}
      />
    </mesh>
  );
}
