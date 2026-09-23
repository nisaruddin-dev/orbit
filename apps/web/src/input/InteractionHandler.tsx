/**
 * @module input/InteractionHandler
 *
 * Listens for interaction intents and updates the interaction store.
 * Renders nothing — it's a pure logic component.
 */

import { useCallback } from 'react';

import { useInteractionStore } from '@/state/interaction';

import type { InteractionIntent } from './intents';
import { useIntents } from './useIntent';

/**
 * The intent handler. Mount once, inside the Canvas.
 */
export function InteractionHandler() {
  const selectNode = useInteractionStore((s) => s.selectNode);
  const deselectNode = useInteractionStore((s) => s.deselectNode);
  const hoverNode = useInteractionStore((s) => s.hoverNode);
  const unhoverNode = useInteractionStore((s) => s.unhoverNode);
  const beginDrag = useInteractionStore((s) => s.beginDrag);
  const endDrag = useInteractionStore((s) => s.endDrag);

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
        case 'END_DRAG':
          endDrag();
          break;
        default:
          break;
      }
    },
    [selectNode, deselectNode, hoverNode, unhoverNode, beginDrag, endDrag],
  );

  useIntents(handler);

  return null;
}
