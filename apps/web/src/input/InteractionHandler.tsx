/**
 * @module input/InteractionHandler
 *
 * Listens for interaction intents and updates the interaction,
 * camera, and editing stores. Renders nothing — it's a pure
 * logic component.
 *
 * On END_DRAG, reads the current zone state and decides whether
 * the release was inside the zone, near the zone, or never
 * approached. On FOCUS_NODE, reads the node's settled position
 * and moves the camera to it, and opens the edit panel for it.
 * On CANCEL, returns the camera to orbit, clears the focus target,
 * and closes the edit panel.
 */

import { useCallback } from 'react';

import { useInteractionStore } from '@/state/interaction';
import { useCameraStore } from '@/state/camera';
import { useEditingStore } from '@/state/editing';
import type { ZoneState } from '@/state/interaction';

import type { InteractionIntent } from './intents';
import { useDrag } from './useDrag';
import { useIntents } from './useIntent';

function decideRelease(
  zoneState: ZoneState,
): 'commit' | 'spring-back' | 'enter-completing' {
  if (zoneState === 'valid-release') return 'enter-completing';
  if (zoneState === 'near' || zoneState === 'approaching') return 'spring-back';
  return 'commit';
}

export function InteractionHandler() {
  const selectNode = useInteractionStore((s) => s.selectNode);
  const deselectNode = useInteractionStore((s) => s.deselectNode);
  const hoverNode = useInteractionStore((s) => s.hoverNode);
  const unhoverNode = useInteractionStore((s) => s.unhoverNode);
  const beginDrag = useInteractionStore((s) => s.beginDrag);
  const updateDrag = useInteractionStore((s) => s.updateDrag);
  const endDrag = useInteractionStore((s) => s.endDrag);

  const setCameraState = useCameraStore((s) => s.setState);
  const setFocusTarget = useCameraStore((s) => s.setFocusTarget);

  const openEditor = useEditingStore((s) => s.openEditor);
  const closeEditor = useEditingStore((s) => s.closeEditor);

  useDrag();

  const handler = useCallback(
    (intent: InteractionIntent) => {
      switch (intent.type) {
        case 'SELECT_NODE':
          selectNode(intent.nodeId);
          break;
        case 'DESELECT_NODE':
          deselectNode();
          break;
        case 'HOVER_NODE':
          hoverNode(intent.nodeId);
          break;
        case 'UNHOVER_NODE':
          unhoverNode();
          break;
        case 'BEGIN_DRAG':
          beginDrag(intent.nodeId);
          break;
        case 'UPDATE_DRAG':
          updateDrag(intent.worldPosition);
          break;
        case 'END_DRAG': {
          const zoneState = useInteractionStore.getState().zoneState;
          const decision = decideRelease(zoneState);
          endDrag(decision);
          break;
        }
        case 'FOCUS_NODE': {
          const settled =
            useInteractionStore.getState().nodeSettledPositions[
              intent.nodeId
            ];
          // Only focus when the settled position is a valid
          // finite array. A NaN or null coordinate would blank
          // the scene.
          if (
            settled &&
            Number.isFinite(settled[0]) &&
            Number.isFinite(settled[1]) &&
            Number.isFinite(settled[2])
          ) {
            setFocusTarget(settled);
            setCameraState('focus');
            openEditor(intent.nodeId);
          }
          break;
        }
        case 'CANCEL': {
          setFocusTarget(null);
          setCameraState('orbit');
          closeEditor();
          break;
        }
        default:
          break;
      }
    },
    [
      selectNode,
      deselectNode,
      hoverNode,
      unhoverNode,
      beginDrag,
      updateDrag,
      endDrag,
      setCameraState,
      setFocusTarget,
      openEditor,
      closeEditor,
    ],
  );

  useIntents(handler);

  return null;
}
