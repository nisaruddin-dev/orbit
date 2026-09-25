/**
 * @module state/editing
 *
 * Editing state. Tracks which task's edit panel is open and where
 * on screen the panel should appear.
 *
 * The screen position is written by `EditPanelTracker` (inside the
 * Canvas) every frame, and read by `EditPanel` (outside the
 * Canvas) every render. The store is the bridge between the 3D
 * projection and the DOM.
 *
 * Source: TRD §121, UI/UX §53.
 */

import { create } from 'zustand';

interface EditingStore {
  /** The task ID whose edit panel is open, or null. */
  editingNodeId: string | null;

  /**
   * The focused node's screen position in CSS pixels, written by
   * the inside-Canvas tracker. Null when no panel is open or the
   * node is behind the camera.
   */
  screenPos: [number, number] | null;

  openEditor: (taskId: string) => void;
  closeEditor: () => void;
  setScreenPos: (pos: [number, number] | null) => void;
}

export const useEditingStore = create<EditingStore>((set) => ({
  editingNodeId: null,
  screenPos: null,
  openEditor: (taskId) => {
    set({ editingNodeId: taskId });
  },
  closeEditor: () => {
    set({ editingNodeId: null, screenPos: null });
  },
  setScreenPos: (pos) => {
    set({ screenPos: pos });
  },
}));
