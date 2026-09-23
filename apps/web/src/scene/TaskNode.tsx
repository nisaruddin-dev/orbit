/* eslint-disable react-hooks/immutability */
/**
 * @module scene/TaskNode
 *
 * A single task rendered as a 3D object.
 *
 * Four layers: Core (sphere), Shell (wireframe), Ring (torus),
 * Label (SDF text).
 *
 * Responds to hover and selection state from the interaction store.
 * Emits SELECT_NODE, HOVER_NODE, and UNHOVER_NODE intents.
 */

import { useMemo, useRef } from 'react';
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
  /** Unique identifier for this node. */
  id: string;
  /** Priority level (0–3). */
  priority: TaskPriority;
  /** Position in the world. */
  position: [number, number, number];
  /** Task title (shown as label). */
  title: string;
}

/**
 * A single task node.
 */
export function TaskNode({ id, priority, position, title }: TaskNodeProps) {
  const ringRef = useRef<Mesh>(null);

  // Subscribe to interaction state — only this node's own state.
  const isSelected = useInteractionStore((s) => s.selectedNodeId === id);
  const isHovered = useInteractionStore((s) => s.hoveredNodeId === id);

  const coreColor = useMemo(
    () => new Color(PRIORITY_COLORS[priority]),
    [priority],
  );

  // Core material — brightens on hover, glows when selected.
  const coreMaterial = useMemo(() => {
    const material = new MeshStandardMaterial({
      color: coreColor,
      roughness: 0.8,
      metalness: 0.0,
      emissive: coreColor,
      emissiveIntensity: 0.0,
    });
    return material;
  }, [coreColor]);

  // Shell material — wireframe, opacity scales with state.
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

  // Ring material.
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

  // Rotate the ring, and animate core glow based on state.
  useFrame((_state, delta) => {
    const ring = ringRef.current;
    if (ring) {
      ring.rotation.z += 0.1 * delta;
    }

    // Eased glow: 0 (idle), 0.3 (hovered), 1.0 (selected).
    const targetGlow = isSelected ? 1.0 : isHovered ? 0.3 : 0.0;
    const currentGlow = coreMaterial.emissiveIntensity;
    // Move toward target at ~4 units/sec.
    const delta2 = targetGlow - currentGlow;
    const step = Math.sign(delta2) * Math.min(Math.abs(delta2), 4 * delta);
    coreMaterial.emissiveIntensity = currentGlow + step;

    // Shell opacity: 0.15 (idle), 0.3 (hovered), 0.6 (selected).
    const targetOpacity = isSelected ? 0.6 : isHovered ? 0.3 : 0.15;
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
  };

  return (
    <group position={position}>
      {/* Layer 1: Core */}
      <mesh
        material={coreMaterial}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
      >
        <sphereGeometry args={[SPATIAL.nodeRadius, 32, 16]} />
      </mesh>

      {/* Layer 2: Shell */}
      <mesh material={shellMaterial}>
        <sphereGeometry args={[SPATIAL.nodeShellRadius, 16, 8]} />
      </mesh>

      {/* Layer 3: Orbital ring */}
      <mesh
        ref={ringRef}
        rotation={[Math.PI / 2, 0, 0]}
        material={ringMaterial}
      >
        <torusGeometry args={[SPATIAL.nodeRingRadius, 0.008, 8, 64]} />
      </mesh>

      {/* Layer 4: Label */}
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
