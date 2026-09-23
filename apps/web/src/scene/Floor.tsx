/**
 * @module scene/Floor
 *
 * The reflective floor. Sits at y = floorY, extends outward beyond
 * the visible scene, and receives a soft blurred reflection.
 *
 * The floor also handles deselect: clicking empty floor space clears
 * the current selection. Node clicks stopPropagation so they don't
 * reach this handler.
 */

import type { ThreeEvent } from '@react-three/fiber';

import { ENVIRONMENT, SPATIAL } from '@/design';
import { dispatchIntent } from '@/input';

/**
 * The floor plane.
 */
export function Floor() {
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    // Node clicks stopPropagation, so if we receive a click here,
    // it means the user clicked empty space.
    e.stopPropagation();
    dispatchIntent({ type: 'DESELECT_NODE' });
  };

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, SPATIAL.floorY, 0]}
      receiveShadow
      onClick={handleClick}
    >
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
