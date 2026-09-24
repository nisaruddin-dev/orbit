/**
 * @module input/InteractionHandler
 *
 * Listens for interaction intents and updates the interaction store.
 * Renders nothing — it's a pure logic component.
 *
 * On END_DRAG, this handler reads the current zone state and
 * decides whether the release was inside the zone, near the zone,
 * or never approached. The decision is stored in the interaction
 * store for TaskNode to read.
 */

import { useCallback } from 'react';

import { useInteractionStore } from '@/state/interaction';
import type { ZoneState } from '@/state/interaction';

import type { InteractionIntent } from './intents';
import { useDrag } from './useDrag';
import { useIntents } from './useIntent';

/**
 * Given the zone state at the moment of release, decide what the
 * release means.
 *
 *   valid-release           → enter-completing (Task 9 stops here;
 *                             7.6 will run the dissolve)
 *   near / approaching      → spring-back
 *   available / hidden      → commit (free placement)
 *   completing / recovery   → commit (defensive; shouldn't happen)
 */
function decideRelease(zoneState: ZoneState): 'commit' | 'spring-back' | 'enter-completing' {
  if (zoneState === 'valid-release') return 'enter-completing';
  if (zoneState === 'near' || zoneState === 'approaching') return 'spring-back';
  return 'commit';
}

/**
 * The intent handler. Mount once, inside the Canvas.
 */
export function InteractionHandler() {
  const selectNode = useInteractionStore((s) => s.selectNode);
  const deselectNode = useInteractionStore((s) => s.deselectNode);
  const hoverNode = useInteractionStore((s) => s.hoverNode);
  const unhoverNode = useInteractionStore((s) => s.unhoverNode);
  const beginDrag = useInteractionStore((s) => s.beginDrag);
  const updateDrag = useInteractionStore((s) => s.updateDrag);
  const endDrag = useInteractionStore((s) => s.endDrag);

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
    ],
  );

  useIntents(handler);

  return null;
}
