/**
 * @module input/useKeyboardNavigation
 *
 * Global keyboard listeners for node navigation.
 *
 * Shortcuts:
 *   Tab         → next node
 *   Shift+Tab   → previous node
 *   Arrow Up    → nearest node above
 *   Arrow Down  → nearest node below
 *   Arrow Left  → nearest node to the left
 *   Arrow Right → nearest node to the right
 *   Enter       → focus the selected node
 *   Escape      → deselect
 *
 * Disabled when the user is typing in a text input.
 */

import { useEffect } from 'react';

import { useCameraStore } from '@/state/camera';
import { useInteractionStore } from '@/state/interaction';

import { dispatchIntent } from './useIntent';

/**
 * Returns true if the currently focused element is a text input.
 */
function isTextInputFocused(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea') return true;
  if ((el as HTMLElement).isContentEditable) return true;
  return false;
}

/**
 * Installs the keyboard navigation listeners. Call once, at the
 * top level of the app.
 */
export function useKeyboardNavigation(): void {
  const selectNext = useInteractionStore((s) => s.selectNext);
  const selectPrevious = useInteractionStore((s) => s.selectPrevious);
  const selectInDirection = useInteractionStore((s) => s.selectInDirection);
  const deselectNode = useInteractionStore((s) => s.deselectNode);
  const selectedNodeId = useInteractionStore((s) => s.selectedNodeId);
  const setCameraState = useCameraStore((s) => s.setState);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isTextInputFocused()) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key) {
        case 'Tab':
          e.preventDefault();
          if (e.shiftKey) {
            selectPrevious();
          } else {
            selectNext();
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          selectInDirection('up');
          break;

        case 'ArrowDown':
          e.preventDefault();
          selectInDirection('down');
          break;

        case 'ArrowLeft':
          e.preventDefault();
          selectInDirection('left');
          break;

        case 'ArrowRight':
          e.preventDefault();
          selectInDirection('right');
          break;

        case 'Enter':
          if (selectedNodeId) {
            e.preventDefault();
            dispatchIntent({ type: 'FOCUS_NODE', nodeId: selectedNodeId });
            // For now, focus means "switch the camera to focus state".
            // In later sub-steps, this will also open the edit panel.
            setCameraState('focus');
          }
          break;

        case 'Escape':
          e.preventDefault();
          deselectNode();
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [
    selectNext,
    selectPrevious,
    selectInDirection,
    deselectNode,
    selectedNodeId,
    setCameraState,
  ]);
}
