/**
 * @module state/interaction
 *
 * Interaction store. Tracks selection, hover, drag, the eight-state
 * completion zone, the settled position of each node, and the node
 * currently running the completion choreography.
 *
 * The settled position is where a node sits when it is not being
 * dragged. It starts at the node's orbit position and is updated
 * when the user drops a node (commit) or releases it into the
 * completion zone (enter-completing).
 *
 * `completingNodeId` is set when a release enters completing, and
 * cleared when the completion choreography finishes. While it is
 * set, the corresponding node is locked from dragging.
 *
 * Owning settled position and completing state here — rather than
 * inside TaskNode — satisfies System Architecture §116 (One Owner
 * per state) and §163 (Interaction Controller owns user input).
 */

import { create } from 'zustand';

/**
 * The eight zone states. See module doc for meanings.
 */
export type ZoneState =
  | 'hidden'
  | 'appearing'
  | 'available'
  | 'approaching'
  | 'near'
  | 'valid-release'
  | 'completing'
  | 'recovery';

/**
 * The release decision made when a drag ends.
 */
export type ReleaseDecision =
  | 'commit'
  | 'spring-back'
  | 'enter-completing'
  | null;

/** Proximity band thresholds, in world units. */
export const ZONE_BANDS = {
  approaching: 3.5,
  near: 2.0,
  validRelease: 1.0,
} as const;

/**
 * The completion zone's world position. Must match
 * SPATIAL.completionZonePosition in tokens.ts.
 */
const ZONE_POSITION: readonly [number, number, number] = [0, -1.5, 3];

interface InteractionStore {
  // Selection
  selectedNodeId: string | null;
  hoveredNodeId: string | null;

  // Dragging
  draggedNodeId: string | null;
  dragPosition: [number, number, number] | null;

  // Release
  releaseDecision: ReleaseDecision;

  // Completion
  completingNodeId: string | null;

  // Keyboard navigation
  nodeOrder: string[];
  nodePositions: Record<string, [number, number, number]>;

  // Settled position per node
  nodeSettledPositions: Record<string, [number, number, number]>;

  // Completion zone
  zoneState: ZoneState;
  zoneProximity: number;

  // Actions — selection
  selectNode: (id: string | null) => void;
  deselectNode: () => void;
  hoverNode: (id: string | null) => void;
  unhoverNode: () => void;

  // Actions — dragging
  beginDrag: (id: string) => void;
  updateDrag: (worldPosition: [number, number, number]) => void;
  endDrag: (decision: Exclude<ReleaseDecision, null>) => void;
  clearReleaseDecision: () => void;

  // Actions — completion
  clearCompletingNode: () => void;

  // Actions — keyboard navigation
  setNodeList: (
    ids: string[],
    positions: Record<string, [number, number, number]>,
  ) => void;
  selectNext: () => void;
  selectPrevious: () => void;
  selectInDirection: (
    direction: 'up' | 'down' | 'left' | 'right',
  ) => void;

  // Actions — settled positions
  setNodeSettledPosition: (
    nodeId: string,
    position: [number, number, number],
  ) => void;

  // Actions — zone
  setZoneState: (state: ZoneState) => void;
  setZoneProximity: (value: number) => void;
}

function stateFromDistance(distance: number): ZoneState {
  if (distance < ZONE_BANDS.validRelease) return 'valid-release';
  if (distance < ZONE_BANDS.near) return 'near';
  if (distance < ZONE_BANDS.approaching) return 'approaching';
  return 'available';
}

export function distanceToZone(
  worldPosition: readonly [number, number, number],
): number {
  const dx = worldPosition[0] - ZONE_POSITION[0];
  const dy = worldPosition[1] - ZONE_POSITION[1];
  const dz = worldPosition[2] - ZONE_POSITION[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export const useInteractionStore = create<InteractionStore>((set, get) => ({
  // Initial state
  selectedNodeId: null,
  hoveredNodeId: null,
  draggedNodeId: null,
  dragPosition: null,
  releaseDecision: null,
  completingNodeId: null,
  nodeOrder: [],
  nodePositions: {},
  nodeSettledPositions: {},
  zoneState: 'hidden',
  zoneProximity: 0,

  // Selection
  selectNode: (id) => {
    set({ selectedNodeId: id });
  },
  deselectNode: () => {
    set({ selectedNodeId: null });
  },
  hoverNode: (id) => {
    set({ hoveredNodeId: id });
  },
  unhoverNode: () => {
    set({ hoveredNodeId: null });
  },

  // Dragging
  beginDrag: (id) => {
    set({
      draggedNodeId: id,
      selectedNodeId: id,
      releaseDecision: null,
      zoneState: 'appearing',
      zoneProximity: 0,
    });
  },
  updateDrag: (worldPosition) => {
    const state = get();
    const distance = distanceToZone(worldPosition);
    const proximity = Math.max(0, 1 - distance / ZONE_BANDS.approaching);
    const nextState = stateFromDistance(distance);

    if (
      state.zoneState !== nextState ||
      Math.abs(state.zoneProximity - proximity) > 0.02
    ) {
      set({
        dragPosition: worldPosition,
        zoneState: nextState,
        zoneProximity: proximity,
      });
    } else {
      set({ dragPosition: worldPosition });
    }
  },
  endDrag: (decision) => {
    const isCompleting = decision === 'enter-completing';
    set({
      draggedNodeId: null,
      dragPosition: null,
      releaseDecision: decision,
      completingNodeId: isCompleting ? get().selectedNodeId : null,
      zoneState: isCompleting ? 'completing' : 'recovery',
      zoneProximity: 0,
    });
  },
  clearReleaseDecision: () => {
    set({ releaseDecision: null });
  },
  clearCompletingNode: () => {
    set({ completingNodeId: null });
  },

  // Keyboard navigation
  setNodeList: (ids, positions) => {
    const existing = get().nodeSettledPositions;
    const seeded: Record<string, [number, number, number]> = { ...existing };
    for (const id of ids) {
      if (!seeded[id]) {
        const pos = positions[id];
        if (pos) seeded[id] = pos;
      }
    }
    set({
      nodeOrder: ids,
      nodePositions: positions,
      nodeSettledPositions: seeded,
    });
  },
  selectNext: () => {
    const { nodeOrder, selectedNodeId } = get();
    if (nodeOrder.length === 0) return;
    const currentIndex = selectedNodeId
      ? nodeOrder.indexOf(selectedNodeId)
      : -1;
    const nextIndex = (currentIndex + 1) % nodeOrder.length;
    const nextId = nodeOrder[nextIndex];
    if (nextId) set({ selectedNodeId: nextId });
  },
  selectPrevious: () => {
    const { nodeOrder, selectedNodeId } = get();
    if (nodeOrder.length === 0) return;
    const currentIndex = selectedNodeId
      ? nodeOrder.indexOf(selectedNodeId)
      : 0;
    const prevIndex = (currentIndex - 1 + nodeOrder.length) % nodeOrder.length;
    const prevId = nodeOrder[prevIndex];
    if (prevId) set({ selectedNodeId: prevId });
  },
  selectInDirection: (direction) => {
    const { nodeOrder, nodePositions, selectedNodeId } = get();
    if (!selectedNodeId || nodeOrder.length === 0) return;
    const currentPos = nodePositions[selectedNodeId];
    if (!currentPos) return;

    let bestId: string | null = null;
    let bestScore = -Infinity;

    for (const id of nodeOrder) {
      if (id === selectedNodeId) continue;
      const pos = nodePositions[id];
      if (!pos) continue;

      const dx = pos[0] - currentPos[0];
      const dz = pos[2] - currentPos[2];
      const distance = Math.sqrt(dx * dx + dz * dz);
      if (distance === 0) continue;

      let alignment = 0;
      if (direction === 'up') alignment = -dz / distance;
      if (direction === 'down') alignment = dz / distance;
      if (direction === 'left') alignment = -dx / distance;
      if (direction === 'right') alignment = dx / distance;

      if (alignment <= 0) continue;

      const score = alignment - distance * 0.01;
      if (score > bestScore) {
        bestScore = score;
        bestId = id;
      }
    }

    if (bestId) set({ selectedNodeId: bestId });
  },

  // Settled positions
  setNodeSettledPosition: (nodeId, position) => {
    const existing = get().nodeSettledPositions;
    set({
      nodeSettledPositions: {
        ...existing,
        [nodeId]: position,
      },
    });
  },

  // Zone
  setZoneState: (state) => {
    set({ zoneState: state });
  },
  setZoneProximity: (value) => {
    set({ zoneProximity: value });
  },
}));
