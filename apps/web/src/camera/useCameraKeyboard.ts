/**
 * @module camera/useCameraKeyboard
 *
 * Listens for keyboard shortcuts and updates the camera state.
 *
 * Shortcuts (per UI/UX §88):
 *   O → Orbit (default view)
 *   F → Focus
 *   T → Timeline
 *   A → Aurora
 *   Esc → return to Orbit
 *
 * Note: single-key shortcuts are disabled when a text input is
 * focused, so typing in a task title doesn't trigger camera changes.
 */

import { useEffect } from 'react';

import { useCameraStore } from '@/state/camera';
import type { CameraState } from './states';

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
 * Hook that installs global keyboard listeners for camera state.
 * Call once, at the top level of the app.
 */
export function useCameraKeyboard(): void {
  const setState = useCameraStore((s) => s.setState);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isTextInputFocused()) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      let next: CameraState | null = null;

      switch (e.key) {
        case 'o':
        case 'O':
          next = 'orbit';
          break;
        case 'f':
        case 'F':
          next = 'focus';
          break;
        case 't':
        case 'T':
          next = 'timeline';
          break;
        case 'a':
        case 'A':
          next = 'aurora';
          break;
        case 'Escape':
          next = 'orbit';
          break;
        default:
          return;
      }

      e.preventDefault();
      setState(next);
    };

    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [setState]);
}
