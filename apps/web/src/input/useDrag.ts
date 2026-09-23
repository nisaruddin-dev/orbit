/**
 * @module input/useDrag
 *
 * Drag handling. When a node is grabbed, this hook tracks the
 * pointer position and converts it to world coordinates on the
 * ground plane (y = 0).
 *
 * The drag lifecycle:
 *   1. pointerdown on a node → BEGIN_DRAG intent → draggedNodeId set
 *   2. pointermove → convert screen coords to world coords → UPDATE_DRAG
 *   3. pointerup → END_DRAG
 *
 * The hook uses R3F's `useThree` to get the camera and raycaster,
 * then projects the pointer onto the y = 0 plane.
 */

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Plane, Vector3 } from 'three';

import { useInteractionStore } from '@/state/interaction';

import { dispatchIntent } from './useIntent';

/**
 * A horizontal plane at y = 0 — the ring level.
 * Drag happens on this plane.
 */
const DRAG_PLANE = new Plane(new Vector3(0, 1, 0), 0);

/**
 * Install drag tracking. Call once, inside the Canvas.
 */
export function useDrag(): void {
  const camera = useThree((s) => s.camera);
  const raycaster = useThree((s) => s.raycaster);
  const pointer = useThree((s) => s.pointer);

  const draggedNodeId = useInteractionStore((s) => s.draggedNodeId);

  useEffect(() => {
    if (!draggedNodeId) return;

    const scratchVector = new Vector3();

    const handlePointerMove = () => {
      // Project the pointer onto the drag plane.
      raycaster.setFromCamera(pointer, camera);
      const intersection = raycaster.ray.intersectPlane(
        DRAG_PLANE,
        scratchVector,
      );

      if (intersection) {
        dispatchIntent({
          type: 'UPDATE_DRAG',
          worldPosition: [intersection.x, 0, intersection.z],
        });
      }
    };

    const handlePointerUp = () => {
      dispatchIntent({ type: 'END_DRAG' });
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggedNodeId, camera, raycaster, pointer]);
}
