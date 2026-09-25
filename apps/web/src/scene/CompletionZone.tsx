/**
 * @module scene/CompletionZone
 *
 * The completion zone — where a task is released. Not a button.
 * An interaction destination.
 *
 * Reads the eight-state zone machine from the interaction store
 * and plays the appropriate choreography.
 *
 * During `completing`, the completion choreography's `zone.*`
 * tracks drive the zone's appearance. The zone no longer hard-
 * codes those values.
 *
 * Reduced motion (UI/UX §90): static glow, no pulse.
 */

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color } from 'three';
import type { Mesh, MeshStandardMaterial } from 'three';

import { ACCENT, SPATIAL } from '@/design';
import { play, subscribe, isPlaying, cancel } from '@/choreography';
import { useInteractionStore } from '@/state/interaction';
import { usePreferenceStore } from '@/state/preferenceStore';

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
    const unsubscribe = subscribe(
      (_target, property, value) => {
        if (property === 'opacity') opacityRef.current = value;
        if (property === 'emissive') emissiveRef.current = value;
        if (property === 'scale') scaleRef.current = value;
      },
      { filter: { target: 'zone' } },
    );
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
      // The completion choreography drives zone.* tracks from here.
      // Cancel the idle loops so they do not fight it.
      cancel('zone.appear');
      cancel('zone.pulse');
      cancel('zone.recover');
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
      cancel('zone.pulse');
      emissiveRef.current = 0.6;
    }
  }, [zoneState, setZoneState, reducedMotion]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const material = mesh.material as MeshStandardMaterial;

    // Proximity boost applies to idle states. During completing,
    // the choreography's emissive is authoritative, so skip the
    // boost.
    const proximityBoost = zoneState === 'completing' ? 0 : zoneProximity * 0.6;
    const finalEmissive = Math.min(
      1.6,
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
