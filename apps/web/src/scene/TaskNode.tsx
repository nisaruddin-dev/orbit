/* eslint-disable react-hooks/immutability */
/**
 * @module scene/TaskNode
 *
 * A single task rendered as a 3D object.
 *
 * Four layers: Core (sphere), Shell (wireframe), Ring (torus),
 * Label (SDF text).
 *
 * When the task is the completing node, the node subscribes to
 * the `completion` choreography's `node.*` tracks and applies
 * them each frame. The choreography's `scale`, `shellOpacity`,
 * `labelOpacity`, and `emissive` values drive the node's visual
 * response. Position is driven by the drag state until release,
 * then by the choreography's settle phase.
 *
 * While a completion is in progress, the node is locked from
 * dragging.
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
import { subscribe, play } from '@/choreography';
import type { TaskRing } from '@orbit/shared';

type TaskPriority = 0 | 1 | 2 | 3;

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  0: ACCENT.dormant,
  1: ACCENT.active,
  2: ACCENT.focus,
  3: ACCENT.urgent,
};

const RING_RADII: Record<TaskRing, number> = {
  today: SPATIAL.ringTodayRadius,
  week: SPATIAL.ringWeekRadius,
  someday: SPATIAL.ringSomedayRadius,
};

const RING_CHANGE_DURATION = 0.8;

function ringChangeEase(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

interface TaskNodeProps {
  id: string;
  priority: TaskPriority;
  position: [number, number, number];
  title: string;
  ring: TaskRing;
}

export function TaskNode({
  id,
  priority,
  position,
  title,
  ring,
}: TaskNodeProps) {
  const groupRef = useRef<Group>(null);
  const ringRef = useRef<Mesh>(null);
  const labelRef = useRef<{ fillOpacity: number } | null>(null);

  const isSelected = useInteractionStore((s) => s.selectedNodeId === id);
  const isHovered = useInteractionStore((s) => s.hoveredNodeId === id);
  const isDragged = useInteractionStore((s) => s.draggedNodeId === id);
  const dragPosition = useInteractionStore((s) => s.dragPosition);
  const releaseDecision = useInteractionStore((s) => s.releaseDecision);
  const isCompleting = useInteractionStore((s) => s.completingNodeId === id);
  const clearCompletingNode = useInteractionStore(
    (s) => s.clearCompletingNode,
  );
  const setLastCompleted = useInteractionStore((s) => s.setLastCompleted);
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

  // Values driven by the completion choreography. Reset to base
  // on mount and on non-completing use.
  const choreographyScaleRef = useRef(1.0);
  const choreographyShellRef = useRef(0.15);
  const choreographyLabelRef = useRef(1.0);
  const choreographyEmissiveRef = useRef(0);

  const currentPositionRef = useRef(new Vector3(...position));

  const springRef = useRef<{
    from: [number, number, number];
    elapsed: number;
    duration: number;
  } | null>(null);
  const springTargetRef = useRef<[number, number, number] | null>(null);

  const ringChangeRef = useRef<{
    fromPosition: [number, number, number];
    toPosition: [number, number, number];
    elapsed: number;
    duration: number;
  } | null>(null);

  const lastDragPositionRef = useRef<[number, number, number] | null>(null);
  const wasDraggedRef = useRef(false);
  const prevRingRef = useRef<TaskRing>(ring);

  useEffect(() => {
    if (isDragged && dragPosition) {
      lastDragPositionRef.current = dragPosition;
    }
  }, [isDragged, dragPosition]);

  // Subscribe to completion choreography's node.* tracks while
  // this node is completing. The subscription is scoped, so we
  // only receive node tracks, not zone or camera tracks.
  useEffect(() => {
    if (!isCompleting) return;

    const unsubscribe = subscribe(
      (_target, property, value) => {
        if (property === 'scale') choreographyScaleRef.current = value;
        if (property === 'shellOpacity')
          choreographyShellRef.current = value;
        if (property === 'labelOpacity')
          choreographyLabelRef.current = value;
        if (property === 'emissive')
          choreographyEmissiveRef.current = value;
      },
      { filter: { target: 'node' } },
    );

    return () => {
      unsubscribe();
    };
  }, [isCompleting]);

  // When the completion choreography starts for this node, play it
  // once and clear the completing state when it finishes.
  useEffect(() => {
    if (!isCompleting) {
      choreographyScaleRef.current = 1.0;
      choreographyShellRef.current = 0.15;
      choreographyLabelRef.current = 1.0;
      choreographyEmissiveRef.current = 0;
      return;
    }

    const handle = play('completion');
    const priorPosition = settledPosition;
    void handle.promise.then(() => {
      // Record the completion for the 5-second undo ghost.
      setLastCompleted({ taskId: id, priorPosition });
      clearCompletingNode();
    });
    // We intentionally do not depend on settledPosition; the
    // prior position is captured at the moment completion begins.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCompleting, clearCompletingNode, id]);

  // Ring change animation.
  useEffect(() => {
    const prevRing = prevRingRef.current;
    if (prevRing === ring) return;

    const newRadius = RING_RADII[ring];
    const currentPos = settledPosition;
    const [cx, cy, cz] = currentPos;
    const currentRadius = Math.sqrt(cx * cx + cz * cz);

    let newX: number;
    let newZ: number;
    if (currentRadius < 0.0001) {
      newX = newRadius;
      newZ = 0;
    } else {
      const scale = newRadius / currentRadius;
      newX = cx * scale;
      newZ = cz * scale;
    }

    const toPosition: [number, number, number] = [newX, cy, newZ];

    ringChangeRef.current = {
      fromPosition: currentPos,
      toPosition,
      elapsed: 0,
      duration: RING_CHANGE_DURATION,
    };

    prevRingRef.current = ring;
  }, [ring, settledPosition]);

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
        // The node stays where it was released. The choreography
        // takes over from here.
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
    } else if (ringChangeRef.current) {
      const anim = ringChangeRef.current;
      anim.elapsed += delta;
      const t = Math.min(anim.elapsed / anim.duration, 1.0);
      const eased = ringChangeEase(t);

      targetX =
        anim.fromPosition[0] +
        (anim.toPosition[0] - anim.fromPosition[0]) * eased;
      targetY =
        anim.fromPosition[1] +
        (anim.toPosition[1] - anim.fromPosition[1]) * eased;
      targetZ =
        anim.fromPosition[2] +
        (anim.toPosition[2] - anim.fromPosition[2]) * eased;

      if (anim.elapsed >= anim.duration) {
        setNodeSettledPosition(id, anim.toPosition);
        ringChangeRef.current = null;
      }
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

    const ringMesh = ringRef.current;
    if (ringMesh) {
      const speed = isDragged ? 0.8 : isSelected ? 0.4 : 0.1;
      ringMesh.rotation.z += speed * delta;
    }

    // Core glow: completion choreography overrides when active.
    let targetGlow: number;
    if (isCompleting) {
      targetGlow = choreographyEmissiveRef.current;
    } else {
      targetGlow = isDragged
        ? 1.5
        : isSelected
          ? 1.0
          : isHovered
            ? 0.3
            : 0.15;
    }
    const currentGlow = coreMaterial.emissiveIntensity;
    const deltaGlow = targetGlow - currentGlow;
    const step = Math.sign(deltaGlow) * Math.min(Math.abs(deltaGlow), 4 * delta);
    coreMaterial.emissiveIntensity = currentGlow + step;

    // Shell opacity: completion choreography overrides when active.
    let targetOpacity: number;
    if (isCompleting) {
      targetOpacity = choreographyShellRef.current;
    } else {
      targetOpacity = isDragged
        ? 0.8
        : isSelected
          ? 0.6
          : isHovered
            ? 0.3
            : 0.15;
    }
    shellMaterial.opacity += (targetOpacity - shellMaterial.opacity) * 0.15;

    // Node scale: completion choreography overrides when active.
    const appliedScale = isCompleting
      ? choreographyScaleRef.current
      : isDragged
        ? 1.2
        : isHovered
          ? 1.05
          : 1.0;
    if (group) {
      group.scale.setScalar(appliedScale);
      group.visible = appliedScale > 0.02;
    }

    // Label opacity. Only write when the value has changed —
    // troika-three-text re-renders its SDF texture on every write,
    // which is expensive. During normal use the value is 1.0 and
    // never changes, so this write is skipped entirely.
    const label = labelRef.current;
    if (label) {
      const targetLabelOpacity = isCompleting
        ? choreographyLabelRef.current
        : 1.0;
      if (Math.abs(label.fillOpacity - targetLabelOpacity) > 0.01) {
        label.fillOpacity = targetLabelOpacity;
      }
    }
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (isCompleting) return;
    dispatchIntent({ type: 'HOVER_NODE', nodeId: id });
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (isCompleting) return;
    dispatchIntent({ type: 'UNHOVER_NODE' });
    document.body.style.cursor = 'default';
  };

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (isCompleting) return;
    dispatchIntent({ type: 'SELECT_NODE', nodeId: id });
    beginDrag(id);
    dispatchIntent({ type: 'BEGIN_DRAG', nodeId: id });
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
  };

  const handleDoubleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (isCompleting) return;
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
          ref={labelRef}
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
