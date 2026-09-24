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
 *
 * On every drag update, the interaction store computes proximity
 * to the completion zone and updates the zone state machine. This
 * hook emits a PROXIMITY_CHANGED intent after each update, so the
 * future audio system (Chunk 16) can subscribe. No listener
 * responds yet — the intent is a stub that proves the contract.
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

        // The store has now updated zoneProximity. Read it and
        // emit a PROXIMITY_CHANGED intent for the future audio
        // system. The zone's own visual updates happen in the
        // store subscription inside CompletionZone.tsx.
        const state = useInteractionStore.getState();
        const nodeId = state.draggedNodeId;
        if (nodeId) {
          dispatchIntent({
            type: 'PROXIMITY_CHANGED',
            nodeId,
            scalar: state.zoneProximity,
          });
        }
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
