/* eslint-disable react-hooks/immutability */
/**
 * @module scene/TaskNode
 *
 * A single task rendered as a 3D object.
 *
 * Four layers: Core (sphere), Shell (wireframe), Ring (torus),
 * Label (SDF text).
 *
 * Responds to hover, selection, drag, and release decisions from
 * the interaction store.
 *
 * On drag end, reads `releaseDecision` from the store:
 *   commit           → settle at the drop position
 *   spring-back      → animate back to the pre-drag position
 *   enter-completing → hold in place, awaiting 7.6's dissolve
 *
 * All position updates happen in `useFrame`, imperatively, via
 * the group ref. Position is never read from a ref during render —
 * that would violate React's rules and would not re-render.
 *
 * TECH DEBT (fix in 7.5):
 * This component currently owns its own `settledPosition` state.
 * This violates System Architecture §116 (One Owner per state)
 * and §163 (Interaction Controller owns user input).
 *
 * The refactor: move `settledPosition` to the interaction store.
 * TaskNode will read the position from the store instead of local
 * state. This happens as the first task of Sub-step 7.5.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, MeshStandardMaterial, MeshBasicMaterial, Vector3 } from 'three';
import { Text } from '@react-three/drei';
import type { Group, Mesh } from 'three';
import type { ThreeEvent } from '@react-three/fiber';

import { ACCENT, SPATIAL } from '@/design';
import { dispatchIntent } from '@/input';
import { useInteractionStore } from '@/state/interaction';

type TaskPriority = 0 | 1 | 2 | 3;

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  0: ACCENT.dormant,
  1: ACCENT.active,
  2: ACCENT.focus,
  3: ACCENT.urgent,
};

interface TaskNodeProps {
  id: string;
  priority: TaskPriority;
  position: [number, number, number];
  title: string;
}

/**
 * A single task node.
 */
export function TaskNode({ id, priority, position, title }: TaskNodeProps) {
  const groupRef = useRef<Group>(null);
  const ringRef = useRef<Mesh>(null);

  const isSelected = useInteractionStore((s) => s.selectedNodeId === id);
  const isHovered = useInteractionStore((s) => s.hoveredNodeId === id);
  const isDragged = useInteractionStore((s) => s.draggedNodeId === id);
  const dragPosition = useInteractionStore((s) => s.dragPosition);
  const releaseDecision = useInteractionStore((s) => s.releaseDecision);
  const clearReleaseDecision = useInteractionStore(
    (s) => s.clearReleaseDecision,
  );
  const beginDrag = useInteractionStore((s) => s.beginDrag);

  // The node's "resting" position — where it sits when not being
  // dragged. Updated on commit or on enter-completing.
  const [settledPosition, setSettledPosition] = useState<
    [number, number, number]
  >(position);

  // The current animated position. This is written to the group
  // ref every frame inside useFrame. Never read during render.
  const currentPositionRef = useRef(new Vector3(...position));

  // Spring-back state. When non-null, the node is animating from
  // `from` to `settledPosition` over `duration` seconds.
  const springRef = useRef<{
    from: [number, number, number];
    elapsed: number;
    duration: number;
  } | null>(null);

  // Track the last drag position observed while dragging, so we
  // know where to spring back from.
  const lastDragPositionRef = useRef<[number, number, number] | null>(null);
  const wasDraggedRef = useRef(false);

  // Capture live drag position.
  useEffect(() => {
    if (isDragged && dragPosition) {
      lastDragPositionRef.current = dragPosition;
    }
  }, [isDragged, dragPosition]);

  // React to release decisions when this node stops being dragged.
  useEffect(() => {
    if (wasDraggedRef.current && !isDragged) {
      const decision = releaseDecision;
      const lastPos = lastDragPositionRef.current;

      if (decision === 'commit' && lastPos) {
        setSettledPosition(lastPos);
      } else if (decision === 'spring-back' && lastPos) {
        springRef.current = {
          from: lastPos,
          elapsed: 0,
          duration: 0.6,
        };
      } else if (decision === 'enter-completing') {
        if (lastPos) setSettledPosition(lastPos);
      }

      lastDragPositionRef.current = null;
      clearReleaseDecision();
    }
    wasDraggedRef.current = isDragged;
  }, [isDragged, releaseDecision, clearReleaseDecision]);

  const coreColor = useMemo(
    () => new Color(PRIORITY_COLORS[priority]),
    [priority],
  );

  const coreMaterial = useMemo(() => {
    return new MeshStandardMaterial({
      color: coreColor,
      roughness: 0.8,
      metalness: 0.0,
      emissive: coreColor,
      emissiveIntensity: 0.15,
    });
  }, [coreColor]);

  const shellMaterial = useMemo(
    () =>
      new MeshBasicMaterial({
        color: coreColor,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      }),
    [coreColor],
  );

  const ringMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: coreColor,
        emissive: coreColor,
        emissiveIntensity: 0.4,
        roughness: 0.4,
        metalness: 0.6,
      }),
    [coreColor],
  );

  // Single useFrame. All per-frame motion happens here, including
  // position. Nothing reads refs during render.
  useFrame((_state, delta) => {
    // 1. Determine the target position for this frame.
    let targetX: number;
    let targetY: number;
    let targetZ: number;

    if (isDragged && dragPosition) {
      targetX = dragPosition[0];
      targetY = dragPosition[1];
      targetZ = dragPosition[2];
    } else if (springRef.current) {
      const spring = springRef.current;
      spring.elapsed += delta;
      const t = Math.min(spring.elapsed / spring.duration, 1.0);

      // Overshoot: cubic-bezier(0.34, 1.56, 0.64, 1)
      const c1 = 1.70158;
      const c3 = c1 + 1;
      const eased = 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);

      targetX = spring.from[0] + (settledPosition[0] - spring.from[0]) * eased;
      targetY = spring.from[1] + (settledPosition[1] - spring.from[1]) * eased;
      targetZ = spring.from[2] + (settledPosition[2] - spring.from[2]) * eased;

      if (spring.elapsed >= spring.duration) {
        springRef.current = null;
      }
    } else {
      targetX = settledPosition[0];
      targetY = settledPosition[1];
      targetZ = settledPosition[2];
    }

    currentPositionRef.current.set(targetX, targetY, targetZ);

    // 2. Apply to the group.
    const group = groupRef.current;
    if (group) {
      group.position.set(targetX, targetY, targetZ);
    }

    // 3. Ring rotation.
    const ring = ringRef.current;
    if (ring) {
      const speed = isDragged ? 0.8 : isSelected ? 0.4 : 0.1;
      ring.rotation.z += speed * delta;
    }

    // 4. Core glow.
    const targetGlow = isDragged
      ? 1.5
      : isSelected
        ? 1.0
        : isHovered
          ? 0.3
          : 0.15;
    const currentGlow = coreMaterial.emissiveIntensity;
    const deltaGlow = targetGlow - currentGlow;
    const step = Math.sign(deltaGlow) * Math.min(Math.abs(deltaGlow), 4 * delta);
    coreMaterial.emissiveIntensity = currentGlow + step;

    // 5. Shell opacity.
    const targetOpacity = isDragged
      ? 0.8
      : isSelected
        ? 0.6
        : isHovered
          ? 0.3
          : 0.15;
    shellMaterial.opacity += (targetOpacity - shellMaterial.opacity) * 0.15;
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    dispatchIntent({ type: 'HOVER_NODE', nodeId: id });
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    dispatchIntent({ type: 'UNHOVER_NODE' });
    document.body.style.cursor = 'default';
  };

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    dispatchIntent({ type: 'SELECT_NODE', nodeId: id });
    beginDrag(id);
    dispatchIntent({ type: 'BEGIN_DRAG', nodeId: id });
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
  };

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
    >
      <mesh
        material={coreMaterial}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        scale={isDragged ? 1.2 : isHovered ? 1.05 : 1.0}
      >
        <sphereGeometry args={[SPATIAL.nodeRadius, 32, 16]} />
      </mesh>

      <mesh material={shellMaterial}>
        <sphereGeometry args={[SPATIAL.nodeShellRadius, 16, 8]} />
      </mesh>

      <mesh
        ref={ringRef}
        rotation={[Math.PI / 2, 0, 0]}
        material={ringMaterial}
      >
        <torusGeometry args={[SPATIAL.nodeRingRadius, 0.008, 8, 64]} />
      </mesh>

      <Text
        position={[0, SPATIAL.nodeShellRadius + 0.15, 0]}
        fontSize={0.12}
        color="#E8EAF2"
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0}
        maxWidth={3}
      >
        {title}
      </Text>
    </group>
  );
}
