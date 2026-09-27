/**
 * @module input/InteractionHandler
 *
 * Listens for interaction intents and routes them. Renders
 * nothing — it is a pure logic component.
 *
 * Routes each intent to the appropriate store action, mutation,
 * or camera transition. The mutations are optimistic; the store
 * is updated before the API call and rolled back on failure.
 *
 * New in 8d-1:
 *   - COMPLETE_NODE  → useCompleteTask mutation
 *   - ARCHIVE_NODE   → useArchiveTask mutation
 *   - OPEN_EDITOR    → openEditor store action
 *
 * Source: System Architecture §30 (Interaction Intents),
 * §51 (Input Actions).
 */

import { useCallback } from 'react';

import { useArchiveTask, useCompleteTask } from '@/data/mutations';
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

  const completeTaskMutation = useCompleteTask();
  const archiveTaskMutation = useArchiveTask();

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
        case 'OPEN_EDITOR': {
          openEditor(intent.nodeId);
          break;
        }
        case 'COMPLETE_NODE': {
          completeTaskMutation.mutate(intent.nodeId);
          break;
        }
        case 'ARCHIVE_NODE': {
          archiveTaskMutation.mutate(intent.nodeId);
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
      completeTaskMutation,
      archiveTaskMutation,
    ],
  );

  useIntents(handler);

  return null;
}
