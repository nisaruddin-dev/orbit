/**
 * @module scene/TaskNode
 *
 * A single task rendered as a 3D object.
 *
 * Four layers, arranged concentrically:
 *   1. Core  — matte sphere, priority-colored (the task itself)
 *   2. Shell — emissive wireframe sphere (the state)
 *   3. Ring  — thin torus, rotates (deadline/urgency)
 *   4. Label — SDF text, billboarded, revealed on hover
 *
 * Labels use Troika. They are hidden by default and appear only
 * on hover (per UI/UX §19).
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, MeshStandardMaterial, MeshBasicMaterial } from 'three';
import { Text } from '@react-three/drei';
import type { Group, Mesh } from 'three';

import { ACCENT, SPATIAL } from '@/design';

/**
 * Priority levels for a task, from the PRD.
 */
type TaskPriority = 0 | 1 | 2 | 3;

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  0: ACCENT.dormant,
  1: ACCENT.active,
  2: ACCENT.focus,
  3: ACCENT.urgent,
};

interface TaskNodeProps {
  /** Priority level (0–3). */
  priority: TaskPriority;
  /** Position in the world. */
  position: [number, number, number];
  /** Task title (shown as label on hover). */
  title: string;
}

/**
 * A single task node. Currently static — the node does not
 * respond to interaction except for hover-based label reveal.
 */
export function TaskNode({ priority, position, title }: TaskNodeProps) {
  const groupRef = useRef<Group>(null);
  const ringRef = useRef<Mesh>(null);

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
    const ring = ringRef.current;
    if (!ring) return;
    ring.rotation.z += 0.1 * delta;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Layer 1: Core */}
      <mesh material={coreMaterial}>
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

      {/* Layer 4: Label — visible, small, positioned above the node.
          For Sub-step 6.4 it's always shown so we can verify. In a
          later sub-step it will only appear on hover. */}
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
