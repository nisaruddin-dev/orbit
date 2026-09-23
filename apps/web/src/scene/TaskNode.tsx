/**
 * @module scene/TaskNode
 *
 * A single task rendered as a 3D object.
 *
 * Four layers, arranged concentrically:
 *   1. Core  — matte sphere, priority-colored (the task itself)
 *   2. Shell — emissive wireframe sphere (the state)
 *   3. Ring  — thin torus, rotates (deadline/urgency)
 *   4. Label — SDF text (added in Sub-step 6.4)
 *
 * For this sub-step, only one node is rendered at a fixed position.
 * The node is currently static — no interaction, no state changes.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, MeshStandardMaterial, MeshBasicMaterial } from 'three';
import type { Group, Mesh } from 'three';

import { ACCENT, IDLE, SPATIAL } from '@/design';

/**
 * Priority levels for a task, from the PRD.
 */
type TaskPriority = 0 | 1 | 2 | 3;

/**
 * Map of priority → accent color.
 * Priority 3 is the highest attention (amber).
 * Priority 0 is dormant (slate).
 */
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
}

/**
 * A single task node. Currently static — the node does not
 * respond to interaction yet.
 */
export function TaskNode({ priority, position }: TaskNodeProps) {
  const groupRef = useRef<Group>(null);
  const ringRef = useRef<Mesh>(null);

  const coreColor = useMemo(
    () => new Color(PRIORITY_COLORS[priority]),
    [priority],
  );

  // Materials are memoized so they aren't recreated on re-render.
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

  // Rotate the orbital ring slowly. No other motion yet.
  useFrame((_state, delta) => {
    const ring = ringRef.current;
    if (!ring) return;
    ring.rotation.z += 0.1 * delta;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Layer 1: Core — the task itself */}
      <mesh material={coreMaterial}>
        <sphereGeometry args={[SPATIAL.nodeRadius, 32, 16]} />
      </mesh>

      {/* Layer 2: Shell — the state (wireframe) */}
      <mesh material={shellMaterial}>
        <sphereGeometry args={[SPATIAL.nodeShellRadius, 16, 8]} />
      </mesh>

      {/* Layer 3: Orbital ring — deadline/urgency indicator */}
      <mesh
        ref={ringRef}
        rotation={[Math.PI / 2, 0, 0]}
        material={ringMaterial}
      >
        <torusGeometry args={[SPATIAL.nodeRingRadius, 0.008, 8, 64]} />
      </mesh>

      {/* Layer 4: Label — added in Sub-step 6.4 */}
    </group>
  );
}
