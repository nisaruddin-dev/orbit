/**
 * @module state/interaction
 *
 * Interaction state. Tracks which node is currently selected,
 * hovered, and being dragged.
 *
 * This is separate from the camera state store because they
 * represent different concerns. The camera state is about *where
 * the viewer is looking*. The interaction state is about *what
 * the viewer is doing*.
 */

import { create } from 'zustand';

interface InteractionStore {
  /** Currently selected node ID, or null. */
  selectedNodeId: string | null;
  /** Currently hovered node ID, or null. */
  hoveredNodeId: string | null;
  /** Currently dragged node ID, or null. */
  draggedNodeId: string | null;

  selectNode: (nodeId: string) => void;
  deselectNode: () => void;
  hoverNode: (nodeId: string) => void;
  unhoverNode: () => void;
  beginDrag: (nodeId: string) => void;
  endDrag: () => void;
}

export const useInteractionStore = create<InteractionStore>((set) => ({
  selectedNodeId: null,
  hoveredNodeId: null,
  draggedNodeId: null,

  selectNode: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },
  deselectNode: () => {
    set({ selectedNodeId: null });
  },
  hoverNode: (nodeId) => {
    set({ hoveredNodeId: nodeId });
  },
  unhoverNode: () => {
    set({ hoveredNodeId: null });
  },
  beginDrag: (nodeId) => {
    set({ draggedNodeId: nodeId });
  },
  endDrag: () => {
    set({ draggedNodeId: null });
  },
}));
