/**
 * @module scene/CompletionZone
 *
 * The completion zone — where a task is released. Not a button.
 * An interaction destination.
 *
 * At rest, the zone is hidden. When Task 8 wires it to the drag
 * system, it will appear on drag start, pulse as a node approaches,
 * intensify at valid release range, and fade on recovery.
 *
 * This task (7.4b) renders the zone at its world position and
 * plays the pulse loop, so the visual can be tuned. Interactivity
 * arrives in 7.4c (Task 8).
 *
 * Eight-state machine (UI/UX §40), driven by Task 8:
 *   hidden, appearing, available, approaching, near,
 *   valid-release, completing, recovery
 */

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color } from 'three';
import type { Mesh, MeshStandardMaterial } from 'three';

import { ACCENT, SPATIAL } from '@/design';
import { play, subscribe, isPlaying } from '@/choreography';

/**
 * The visible representation of the zone. A torus lying flat on
 * the ground plane.
 */
export function CompletionZone() {
  const meshRef = useRef<Mesh>(null);

  // The zone's color: mint.
  const zoneColor = useMemo(() => new Color(ACCENT.done), []);

  // Local values driven by the choreography engine. These start
  // at their resting values.
  const opacityRef = useRef(0.6);
  const emissiveRef = useRef(0.6);
  const scaleRef = useRef(1.0);

  // Subscribe to the choreography engine. When any zone.* track
  // reports a value, update our local refs.
  useEffect(() => {
    const unsubscribe = subscribe((target, property, value) => {
      if (target !== 'zone') return;
      if (property === 'opacity') opacityRef.current = value;
      if (property === 'emissive') emissiveRef.current = value;
      if (property === 'scale') scaleRef.current = value;
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Play `zone.pulse` on a loop so the visual is alive while we
  // tune it. In Task 8, the drag system will control which
  // choreography plays.
  useEffect(() => {
    void play('zone.pulse');
    const interval = window.setInterval(() => {
      if (!isPlaying('zone.pulse')) {
        void play('zone.pulse');
      }
    }, 100);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  // Apply the choreography values to the mesh and material every
  // frame. The engine's tick updates the refs; this reads them
  // and writes them to the GPU.
  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const material = mesh.material as MeshStandardMaterial;
    material.opacity = opacityRef.current;
    material.emissiveIntensity = emissiveRef.current;
    mesh.scale.setScalar(scaleRef.current);
  });

  return (
    <mesh
      ref={meshRef}
      position={[
        SPATIAL.completionZonePosition[0],
        SPATIAL.completionZonePosition[1],
        SPATIAL.completionZonePosition[2],
      ]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <torusGeometry args={[SPATIAL.completionZoneRadius, 0.08, 16, 64]} />
      <meshStandardMaterial
        color={zoneColor}
        emissive={zoneColor}
        emissiveIntensity={0.6}
        transparent
        opacity={0.6}
        roughness={0.4}
        metalness={0.0}
      />
    </mesh>
  );
}
