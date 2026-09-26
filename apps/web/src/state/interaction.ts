/**
 * @module state/interaction
 *
 * Interaction store. Tracks selection, hover, drag, the eight-state
 * completion zone, the settled position of each node, the node
 * currently running the completion choreography, and the most
 * recently completed task (for the 5-second undo ghost).
 *
 * `completingNodeId` is set when a release enters completing, and
 * cleared when the completion choreography finishes.
 *
 * `lastCompleted` is set when a completion choreography finishes.
 * The undo ghost reads it, and either restores the task or lets
 * the window expire.
 *
 * Owning these states here — rather than inside components —
 * satisfies System Architecture §116 (One Owner per state).
 */

import { create } from 'zustand';

export type ZoneState =
  | 'hidden'
  | 'appearing'
  | 'available'
  | 'approaching'
  | 'near'
  | 'valid-release'
  | 'completing'
  | 'recovery';

export type ReleaseDecision =
  | 'commit'
  | 'spring-back'
  | 'enter-completing'
  | null;

export const ZONE_BANDS = {
  approaching: 3.5,
  near: 2.0,
  validRelease: 1.0,
} as const;

const ZONE_POSITION: readonly [number, number, number] = [0, -1.5, 3];

/**
 * The most recently completed task's information, used by the
 * undo ghost. Null when no completion is in the undo window.
 */
export interface LastCompleted {
  taskId: string;
  priorPosition: [number, number, number];
}

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
  lastCompleted: LastCompleted | null;

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
  setLastCompleted: (info: LastCompleted) => void;
  clearLastCompleted: () => void;

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

  /**
   * Remove settled positions for any task IDs not in the given
   * list. Called when the task list changes so that stale
   * positions do not accumulate.
   */
  pruneNodeSettledPositions: (activeIds: string[]) => void;

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
  const dz = worldPosition[2] - ZONE_POSITION[2];
  return Math.sqrt(dx * dx + dz * dz);
}

export const useInteractionStore = create<InteractionStore>((set, get) => ({
  selectedNodeId: null,
  hoveredNodeId: null,
  draggedNodeId: null,
  dragPosition: null,
  releaseDecision: null,
  completingNodeId: null,
  lastCompleted: null,
  nodeOrder: [],
  nodePositions: {},
  nodeSettledPositions: {},
  zoneState: 'hidden',
  zoneProximity: 0,

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
  setLastCompleted: (info) => {
    set({ lastCompleted: info });
  },
  clearLastCompleted: () => {
    set({ lastCompleted: null });
  },

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

  setNodeSettledPosition: (nodeId, position) => {
    // Reject non-finite positions. A NaN or null coordinate will
    // propagate into the camera and blank the scene.
    const [x, y, z] = position;
    if (
      !Number.isFinite(x) ||
      !Number.isFinite(y) ||
      !Number.isFinite(z)
    ) {
      return;
    }
    const existing = get().nodeSettledPositions;
    set({
      nodeSettledPositions: {
        ...existing,
        [nodeId]: position,
      },
    });
  },
  pruneNodeSettledPositions: (activeIds) => {
    const existing = get().nodeSettledPositions;
    const active = new Set(activeIds);
    const next: Record<string, [number, number, number]> = {};
    let changed = false;
    for (const [id, pos] of Object.entries(existing)) {
      if (active.has(id)) {
        next[id] = pos;
      } else {
        changed = true;
      }
    }
    if (changed) {
      set({ nodeSettledPositions: next });
    }
  },


  setZoneState: (state) => {
    set({ zoneState: state });
  },
  setZoneProximity: (value) => {
    set({ zoneProximity: value });
  },
}));
