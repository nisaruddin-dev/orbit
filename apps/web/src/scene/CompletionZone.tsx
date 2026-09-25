/**
 * @module scene/CompletionZone
 *
 * The completion zone — where a task is released. Not a button.
 * An interaction destination.
 *
 * Reads the eight-state zone machine from the interaction store
 * and plays the appropriate choreography.
 *
 * Reduced motion (UI/UX §90):
 *   - `zone.appear` plays with a shorter, fade-only variant
 *   - `zone.pulse` does not loop; the zone holds at a static intensity
 *   - `zone.recover` fades quickly
 *
 * The `completing` state holds the zone at maximum intensity until
 * 7.6 runs the dissolve.
 */

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color } from 'three';
import type { Mesh, MeshStandardMaterial } from 'three';

import { ACCENT, SPATIAL } from '@/design';
import { play, subscribe, isPlaying, cancel } from '@/choreography';
import { useInteractionStore } from '@/state/interaction';
import { usePreferenceStore } from '@/state/preferenceStore';

/**
 * A flat torus representing the zone.
 */
export function CompletionZone() {
  const meshRef = useRef<Mesh>(null);

  const zoneColor = useMemo(() => new Color(ACCENT.done), []);

  const zoneState = useInteractionStore((s) => s.zoneState);
  const zoneProximity = useInteractionStore((s) => s.zoneProximity);
  const setZoneState = useInteractionStore((s) => s.setZoneState);
  const reducedMotion = usePreferenceStore((s) => s.prefersReducedMotion);

  const opacityRef = useRef(0.0);
  const emissiveRef = useRef(0.6);
  const scaleRef = useRef(1.0);

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
        const current = useInteractionStore.getState().zoneState;
        if (current === 'appearing') {
          setZoneState('available');
        }
      });
      return;
    }

    if (zoneState === 'completing') {
      cancel('zone.appear');
      cancel('zone.pulse');
      cancel('zone.recover');
      opacityRef.current = 0.8;
      emissiveRef.current = 1.4;
      scaleRef.current = 1.05;
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

    // available, approaching, near, valid-release
    cancel('zone.appear');
    cancel('zone.recover');
    if (!reducedMotion && !isPlaying('zone.pulse')) {
      void play('zone.pulse');
    }
    if (reducedMotion) {
      // Static glow. No pulse.
      cancel('zone.pulse');
      emissiveRef.current = 0.6;
    }
  }, [zoneState, setZoneState, reducedMotion]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const material = mesh.material as MeshStandardMaterial;

    const proximityBoost = zoneProximity * 0.6;
    const finalEmissive = Math.min(
      1.4,
      emissiveRef.current + proximityBoost,
    );

    material.opacity = opacityRef.current;
    material.emissiveIntensity = finalEmissive;
    mesh.scale.setScalar(scaleRef.current);

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
