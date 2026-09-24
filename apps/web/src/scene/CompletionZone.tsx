/**
 * @module scene/CompletionZone
 *
 * The completion zone — where a task is released. Not a button.
 * An interaction destination.
 *
 * Reads the eight-state zone machine from the interaction store
 * and plays the appropriate choreography:
 *
 *   hidden        → not rendered
 *   appearing     → zone.appear plays once, then transitions to available
 *   available     → zone.pulse loops at low intensity
 *   approaching   → zone.pulse loops, intensity rises with proximity
 *   near          → zone.pulse loops, intensity high
 *   valid-release → zone.pulse loops, intensity at maximum
 *   completing    → (Task 9 handles the dissolve)
 *   recovery      → zone.recover plays once, then transitions to hidden
 *
 * Emits no intents. Only reads state.
 */

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color } from 'three';
import type { Mesh, MeshStandardMaterial } from 'three';

import { ACCENT, SPATIAL } from '@/design';
import {
  play,
  subscribe,
  isPlaying,
  cancel,
} from '@/choreography';
import { useInteractionStore } from '@/state/interaction';

/**
 * A flat torus representing the zone.
 */
export function CompletionZone() {
  const meshRef = useRef<Mesh>(null);

  // The zone's color: mint.
  const zoneColor = useMemo(() => new Color(ACCENT.done), []);

  // Read the zone state from the store.
  const zoneState = useInteractionStore((s) => s.zoneState);
  const zoneProximity = useInteractionStore((s) => s.zoneProximity);
  const setZoneState = useInteractionStore((s) => s.setZoneState);

  // Values driven by the choreography engine.
  const opacityRef = useRef(0.0);
  const emissiveRef = useRef(0.6);
  const scaleRef = useRef(1.0);

  // Subscribe to the choreography engine.
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

  // Play choreographies based on zone state.
  useEffect(() => {
    if (zoneState === 'hidden') {
      cancel('zone.appear');
      cancel('zone.pulse');
      cancel('zone.recover');
      opacityRef.current = 0;
      return;
    }

    if (zoneState === 'appearing') {
      cancel('zone.pulse');
      cancel('zone.recover');
      void play('zone.appear').promise.then(() => {
        // After appear completes, if we are still in 'appearing',
        // transition to 'available'. Otherwise, the state has
        // already been changed by proximity.
        const current = useInteractionStore.getState().zoneState;
        if (current === 'appearing') {
          setZoneState('available');
        }
      });
      return;
    }

    if (zoneState === 'recovery') {
      cancel('zone.appear');
      cancel('zone.pulse');
      void play('zone.recover').promise.then(() => {
        const current = useInteractionStore.getState().zoneState;
        if (current === 'recovery') {
          setZoneState('hidden');
        }
      });
      return;
    }

    // States: available, approaching, near, valid-release
    cancel('zone.appear');
    cancel('zone.recover');
    if (!isPlaying('zone.pulse')) {
      void play('zone.pulse');
    }
  }, [zoneState, setZoneState]);

  // While pulsing, modulate the emissive based on proximity.
  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const material = mesh.material as MeshStandardMaterial;

    // Base intensity from the choreography (pulse), plus
    // proximity boost. Clamp to a reasonable maximum.
    const proximityBoost = zoneProximity * 0.6;
    const finalEmissive = Math.min(
      1.4,
      emissiveRef.current + proximityBoost,
    );

    material.opacity = opacityRef.current;
    material.emissiveIntensity = finalEmissive;
    mesh.scale.setScalar(scaleRef.current);

    // Hide the mesh entirely when fully transparent. This avoids
    // drawing an invisible object and also avoids the zone casting
    // an invisible glow.
    mesh.visible = opacityRef.current > 0.01;
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
      visible={false}
    >
      <torusGeometry args={[SPATIAL.completionZoneRadius, 0.08, 16, 64]} />
      <meshStandardMaterial
        color={zoneColor}
        emissive={zoneColor}
        emissiveIntensity={0.6}
        transparent
        opacity={0.0}
        roughness={0.4}
        metalness={0.0}
      />
    </mesh>
  );
}
