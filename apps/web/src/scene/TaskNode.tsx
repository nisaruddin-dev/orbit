/* eslint-disable react-hooks/immutability */
/**
 * @module scene/TaskNode
 *
 * A single task rendered as a 3D object.
 *
 * Four layers: Core (sphere), Shell (wireframe), Ring (torus),
 * Label (SDF text).
 *
 * Responds to hover, selection, and drag state from the interaction
 * store. When a drag ends, the node remembers its final position
 * locally so it stays where it was dropped.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, MeshStandardMaterial, MeshBasicMaterial } from 'three';
import { Text } from '@react-three/drei';
import type { Mesh } from 'three';
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
  const ringRef = useRef<Mesh>(null);

  const isSelected = useInteractionStore((s) => s.selectedNodeId === id);
  const isHovered = useInteractionStore((s) => s.hoveredNodeId === id);
  const isDragged = useInteractionStore((s) => s.draggedNodeId === id);
  const dragPosition = useInteractionStore((s) => s.dragPosition);
  const beginDrag = useInteractionStore((s) => s.beginDrag);

  // Local settled position. Updated when a drag ends.
  const [settledPosition, setSettledPosition] = useState<
    [number, number, number]
  >(position);

  // Track the last drag position observed while dragging.
  const lastDragPositionRef = useRef<[number, number, number] | null>(null);

  // Track whether the node was being dragged on the previous render.
  const wasDraggedRef = useRef(false);

  // Capture the live drag position while dragging.
  useEffect(() => {
    if (isDragged && dragPosition) {
      lastDragPositionRef.current = dragPosition;
    }
  }, [isDragged, dragPosition]);

  // On drag end, commit the last drag position.
  useEffect(() => {
    if (wasDraggedRef.current && !isDragged) {
      const lastPos = lastDragPositionRef.current;
      if (lastPos) {
        setSettledPosition(lastPos);
      }
      lastDragPositionRef.current = null;
    }
    wasDraggedRef.current = isDragged;
  }, [isDragged]);

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
      emissiveIntensity: 0.0,
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

  useFrame((_state, delta) => {
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
    const delta2 = targetGlow - currentGlow;
    const step = Math.sign(delta2) * Math.min(Math.abs(delta2), 4 * delta);
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

  // Rendered position: live drag position while dragging, otherwise
  // the settled position.
  const renderedPosition: [number, number, number] =
    isDragged && dragPosition ? dragPosition : settledPosition;

  return (
    <group position={renderedPosition}>
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
