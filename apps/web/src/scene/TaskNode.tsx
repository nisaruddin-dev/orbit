/* eslint-disable react-hooks/immutability */
/**
 * @module scene/TaskNode
 *
 * A single task rendered as a 3D object.
 *
 * Four layers: Core (sphere), Shell (wireframe), Ring (torus),
 * Label (SDF text).
 *
 * The node's settled position is owned by the interaction store.
 * TaskNode reads it from the store and writes to it on commit and
 * enter-completing.
 *
 * Double-clicking a node dispatches FOCUS_NODE, which the
 * InteractionHandler routes to the camera store. The camera moves
 * to the node; the edit panel is a later task (7.5c).
 *
 * All per-frame position motion happens imperatively in useFrame,
 * via the group ref.
 */

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, MeshStandardMaterial, MeshBasicMaterial, Vector3 } from 'three';
import { Billboard, Text } from '@react-three/drei';
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
  const setNodeSettledPosition = useInteractionStore(
    (s) => s.setNodeSettledPosition,
  );

  const settledPosition = useInteractionStore(
    (s) => s.nodeSettledPositions[id] ?? position,
  );

  const currentPositionRef = useRef(new Vector3(...position));

  const springRef = useRef<{
    from: [number, number, number];
    elapsed: number;
    duration: number;
  } | null>(null);

  const springTargetRef = useRef<[number, number, number] | null>(null);

  const lastDragPositionRef = useRef<[number, number, number] | null>(null);
  const wasDraggedRef = useRef(false);

  useEffect(() => {
    if (isDragged && dragPosition) {
      lastDragPositionRef.current = dragPosition;
    }
  }, [isDragged, dragPosition]);

  useEffect(() => {
    if (wasDraggedRef.current && !isDragged) {
      const decision = releaseDecision;
      const lastPos = lastDragPositionRef.current;

      if (decision === 'commit' && lastPos) {
        setNodeSettledPosition(id, lastPos);
      } else if (decision === 'spring-back' && lastPos) {
        springTargetRef.current = settledPosition;
        springRef.current = {
          from: lastPos,
          elapsed: 0,
          duration: 0.6,
        };
      } else if (decision === 'enter-completing') {
        if (lastPos) setNodeSettledPosition(id, lastPos);
      }

      lastDragPositionRef.current = null;
      clearReleaseDecision();
    }
    wasDraggedRef.current = isDragged;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isDragged,
    releaseDecision,
    clearReleaseDecision,
    id,
    setNodeSettledPosition,
  ]);

  const coreColor = useMemo(
    () => new Color(PRIORITY_COLORS[priority]),
    [priority],
  );

  const coreMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: coreColor,
        roughness: 0.8,
        metalness: 0.0,
        emissive: coreColor,
        emissiveIntensity: 0.15,
      }),
    [coreColor],
  );

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

  useFrame((_state, delta) => {
    let targetX: number;
    let targetY: number;
    let targetZ: number;

    if (isDragged && dragPosition) {
      targetX = dragPosition[0];
      targetY = dragPosition[1];
      targetZ = dragPosition[2];
    } else if (springRef.current && springTargetRef.current) {
      const spring = springRef.current;
      const target = springTargetRef.current;
      spring.elapsed += delta;
      const t = Math.min(spring.elapsed / spring.duration, 1.0);

      const c1 = 1.70158;
      const c3 = c1 + 1;
      const eased = 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);

      targetX = spring.from[0] + (target[0] - spring.from[0]) * eased;
      targetY = spring.from[1] + (target[1] - spring.from[1]) * eased;
      targetZ = spring.from[2] + (target[2] - spring.from[2]) * eased;

      if (spring.elapsed >= spring.duration) {
        springRef.current = null;
        springTargetRef.current = null;
      }
    } else {
      targetX = settledPosition[0];
      targetY = settledPosition[1];
      targetZ = settledPosition[2];
    }

    currentPositionRef.current.set(targetX, targetY, targetZ);

    const group = groupRef.current;
    if (group) {
      group.position.set(targetX, targetY, targetZ);
    }

    const ring = ringRef.current;
    if (ring) {
      const speed = isDragged ? 0.8 : isSelected ? 0.4 : 0.1;
      ring.rotation.z += speed * delta;
    }

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

  const handleDoubleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    dispatchIntent({ type: 'FOCUS_NODE', nodeId: id });
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
        onDoubleClick={handleDoubleClick}
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

      <Billboard position={[0, SPATIAL.nodeShellRadius + 0.15, 0]}>
        <Text
          fontSize={0.12}
          color="#E8EAF2"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.008}
          outlineColor="#0E0F16"
          maxWidth={3}
        >
          {title}
        </Text>
      </Billboard>
    </group>
  );
}
