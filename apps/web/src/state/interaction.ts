/**
 * @module state/interaction
 *
 * Interaction store. Tracks selection, hover, drag, and the
 * eight-state completion zone.
 *
 * The zone state machine (UI/UX §40) lives here so any system —
 * drag, choreography, audio (later) — can read it.
 *
 * Eight states:
 *   hidden         — no drag in progress
 *   appearing      — drag just started, zone fading in
 *   available      — zone visible, no node nearby
 *   approaching    — node within proximity radius
 *   near           — node close, zone glowing strongly
 *   valid-release  — node within release threshold
 *   completing     — node released inside zone (7.6 handles dissolve)
 *   recovery       — node released outside, zone fading out
 *
 * Release decisions are made in InteractionHandler on END_DRAG.
 * The decision is stored in `releaseDecision` for TaskNode to read.
 *
 * TECH DEBT (fix in 7.5):
 * Node settled position is still owned by TaskNode.tsx. This
 * violates System Architecture §116 (One Owner per state). The
 * refactor moves it here as the first task of 7.5.
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
 * The release decision made when a drag ends. TaskNode reads this
 * to know whether to commit, spring back, or enter completing.
 */
export type ReleaseDecision =
  | 'commit'
  | 'spring-back'
  | 'enter-completing'
  | null;

/** Proximity band thresholds, in world units. */
export const ZONE_BANDS = {
  /** Distance at which the zone leaves `available` and enters `approaching`. */
  approaching: 3.5,
  /** Distance at which the zone leaves `approaching` and enters `near`. */
  near: 2.0,
  /** Distance at which the zone leaves `near` and enters `valid-release`. */
  validRelease: 1.0,
} as const;

/**
 * The completion zone's world position. Must match
 * SPATIAL.completionZonePosition in tokens.ts.
 *
 * Hardcoded here to avoid a circular import between the store
 * and the design tokens.
 */
const ZONE_POSITION: readonly [number, number, number] = [0, -1.5, 3];

interface InteractionStore {
  // Selection
  selectedNodeId: string | null;
  hoveredNodeId: string | null;

  // Dragging
  draggedNodeId: string | null;
  dragPosition: [number, number, number] | null;

  // The release decision. Set by InteractionHandler on END_DRAG,
  // read by TaskNode, cleared when the node has reacted to it.
  releaseDecision: ReleaseDecision;

  // Keyboard navigation
  nodeOrder: string[];
  nodePositions: Record<string, [number, number, number]>;

  // Completion zone
  zoneState: ZoneState;
  zoneProximity: number; // 0.0 (far) to 1.0 (at zone center)

  // Actions — selection
  selectNode: (id: string | null) => void;
  deselectNode: () => void;
  hoverNode: (id: string | null) => void;
  unhoverNode: () => void;

  // Actions — dragging
  beginDrag: (id: string) => void;
  updateDrag: (worldPosition: [number, number, number]) => void;
  /**
   * End a drag. The decision is passed in by the caller
   * (InteractionHandler), which has already read the zone state.
   */
  endDrag: (decision: Exclude<ReleaseDecision, null>) => void;

  /**
   * Clear the release decision once TaskNode has reacted to it.
   */
  clearReleaseDecision: () => void;

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

  // Actions — zone
  setZoneState: (state: ZoneState) => void;
  setZoneProximity: (value: number) => void;
}

/**
 * Compute the zone state from a distance.
 */
function stateFromDistance(distance: number): ZoneState {
  if (distance < ZONE_BANDS.validRelease) return 'valid-release';
  if (distance < ZONE_BANDS.near) return 'near';
  if (distance < ZONE_BANDS.approaching) return 'approaching';
  return 'available';
}

/**
 * Compute the distance from a world position to the zone.
 */
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
  nodeOrder: [],
  nodePositions: {},
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
    set({
      draggedNodeId: null,
      dragPosition: null,
      releaseDecision: decision,
      zoneState: decision === 'enter-completing' ? 'completing' : 'recovery',
      zoneProximity: 0,
    });
  },
  clearReleaseDecision: () => {
    set({ releaseDecision: null });
  },

  // Keyboard navigation
  setNodeList: (ids, positions) => {
    set({ nodeOrder: ids, nodePositions: positions });
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

  // Zone
  setZoneState: (state) => {
    set({ zoneState: state });
  },
  setZoneProximity: (value) => {
    set({ zoneProximity: value });
  },
}));
