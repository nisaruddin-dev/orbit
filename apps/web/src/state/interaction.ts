/**
 * @module state/interaction
 *
 * Interaction state. Tracks which node is currently selected,
 * hovered, and being dragged, plus the ordered list of node IDs
 * for keyboard navigation.
 *
 * This is separate from the camera state store because they
 * represent different concerns.
 */

import { create } from 'zustand';

interface InteractionStore {
  /** Currently selected node ID, or null. */
  selectedNodeId: string | null;
  /** Currently hovered node ID, or null. */
  hoveredNodeId: string | null;
  /** Currently dragged node ID, or null. */
  draggedNodeId: string | null;

  /** Live drag position for the dragged node, in world coordinates. */
  dragPosition: [number, number, number] | null;

  /** Offset from node origin to where the drag began. */
  dragOffset: [number, number, number] | null;

  /** Ordered list of node IDs, used for keyboard navigation. */
  nodeOrder: string[];

  /** World positions of each node, keyed by ID. Used for spatial navigation. */
  nodePositions: Record<string, [number, number, number]>;

  selectNode: (nodeId: string) => void;
  deselectNode: () => void;
  hoverNode: (nodeId: string) => void;
  unhoverNode: () => void;
  beginDrag: (nodeId: string) => void;
  setDragOffset: (offset: [number, number, number]) => void;
  updateDrag: (position: [number, number, number]) => void;
  endDrag: () => void;

  /** Register the full set of nodes. Called once when nodes mount. */
  setNodeList: (
    ids: string[],
    positions: Record<string, [number, number, number]>,
  ) => void;

  /** Move selection to the next node in the ordered list. */
  selectNext: () => void;
  /** Move selection to the previous node in the ordered list. */
  selectPrevious: () => void;
  /** Move selection to the nearest node in a given direction. */
  selectInDirection: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export const useInteractionStore = create<InteractionStore>((set, get) => ({
  selectedNodeId: null,
  hoveredNodeId: null,
  draggedNodeId: null,
  dragPosition: null,
  dragOffset: null,
  nodeOrder: [],
  nodePositions: {},

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
    set({ draggedNodeId: nodeId, dragPosition: null, dragOffset: null });
  },
  setDragOffset: (offset) => {
    set({ dragOffset: offset });
  },
  updateDrag: (position) => {
    set({ dragPosition: position });
  },
  endDrag: () => {
    set({ draggedNodeId: null, dragPosition: null, dragOffset: null });
  },
  setNodeList: (ids, positions) => {
    set({ nodeOrder: ids, nodePositions: positions });
  },

  selectNext: () => {
    const { nodeOrder, selectedNodeId } = get();
    if (nodeOrder.length === 0) return;

    if (selectedNodeId === null) {
      // Nothing selected → select the first.
      set({ selectedNodeId: nodeOrder[0] ?? null });
      return;
    }

    const currentIndex = nodeOrder.indexOf(selectedNodeId);
    const nextIndex = (currentIndex + 1) % nodeOrder.length;
    set({ selectedNodeId: nodeOrder[nextIndex] ?? null });
  },

  selectPrevious: () => {
    const { nodeOrder, selectedNodeId } = get();
    if (nodeOrder.length === 0) return;

    if (selectedNodeId === null) {
      // Nothing selected → select the last.
      set({ selectedNodeId: nodeOrder[nodeOrder.length - 1] ?? null });
      return;
    }

    const currentIndex = nodeOrder.indexOf(selectedNodeId);
    const prevIndex = (currentIndex - 1 + nodeOrder.length) % nodeOrder.length;
    set({ selectedNodeId: nodeOrder[prevIndex] ?? null });
  },

  selectInDirection: (direction) => {
    const { nodeOrder, nodePositions, selectedNodeId } = get();
    if (nodeOrder.length === 0) return;

    // If nothing is selected, pick the first.
    if (selectedNodeId === null) {
      set({ selectedNodeId: nodeOrder[0] ?? null });
      return;
    }

    const currentPos = nodePositions[selectedNodeId];
    if (!currentPos) return;

    // Direction vectors in screen-space terms:
    // "up" means the node appears above the current one in the camera view.
    // Since our camera looks down at the scene from above and slightly forward,
    // "up" on screen ≈ negative Z in world space (farther from camera).
    // "down" ≈ positive Z. "left" ≈ negative X. "right" ≈ positive X.
    const directionVectors: Record<
      'up' | 'down' | 'left' | 'right',
      [number, number, number]
    > = {
      up: [0, 0, -1],
      down: [0, 0, 1],
      left: [-1, 0, 0],
      right: [1, 0, 0],
    };

    const [dx, dy, dz] = directionVectors[direction];

    // Find the node that is most "in the direction" of dx,dy,dz
    // from the current position.
    let bestId: string | null = null;
    let bestScore = -Infinity;

    for (const id of nodeOrder) {
      if (id === selectedNodeId) continue;
      const pos = nodePositions[id];
      if (!pos) continue;

      const vx = pos[0] - currentPos[0];
      const vy = pos[1] - currentPos[1];
      const vz = pos[2] - currentPos[2];

      // Dot product with direction vector.
      const dot = vx * dx + vy * dy + vz * dz;

      // Skip nodes that are behind us or perpendicular.
      if (dot <= 0.1) continue;

      // Score: prefer nodes that are mostly in the direction
      // and not too far off-axis.
      const length = Math.sqrt(vx * vx + vy * vy + vz * vz);
      const alignment = dot / length;
      const score = alignment * 2 - length * 0.1;

      if (score > bestScore) {
        bestScore = score;
        bestId = id;
      }
    }

    if (bestId !== null) {
      set({ selectedNodeId: bestId });
    }
  },
}));
