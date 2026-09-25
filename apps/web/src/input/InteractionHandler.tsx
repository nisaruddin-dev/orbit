/**
 * @module input/InteractionHandler
 *
 * Listens for interaction intents and updates the interaction and
 * camera stores. Renders nothing — it's a pure logic component.
 *
 * On END_DRAG, reads the current zone state and decides whether
 * the release was inside the zone, near the zone, or never
 * approached. On FOCUS_NODE, reads the node's settled position
 * and moves the camera to it. On CANCEL, returns the camera to
 * orbit and clears the focus target.
 */

import { useCallback } from 'react';

import { useInteractionStore } from '@/state/interaction';
import { useCameraStore } from '@/state/camera';
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
          if (settled) {
            setFocusTarget(settled);
            setCameraState('focus');
          }
          break;
        }
        case 'CANCEL': {
          setFocusTarget(null);
          setCameraState('orbit');
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
    ],
  );

  useIntents(handler);

  return null;
}
