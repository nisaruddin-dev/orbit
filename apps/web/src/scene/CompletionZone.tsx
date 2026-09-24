/**
 * @module scene/CompletionZone
 *
 * The completion zone — where a task is released. Not a button.
 * An interaction destination.
 *
 * Reads the eight-state zone machine from the interaction store
 * and plays the appropriate choreography.
 *
 * In Task 9 (this delivery), a new state `completing` is added:
 * when a node is released inside the zone, the zone plays a
 * one-shot flash and then waits for 7.6 to run the dissolve.
 *
 * The dissolve itself is NOT in this component. 7.6 will own it.
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

  const zoneColor = useMemo(() => new Color(ACCENT.done), []);

  const zoneState = useInteractionStore((s) => s.zoneState);
  const zoneProximity = useInteractionStore((s) => s.zoneProximity);
  const setZoneState = useInteractionStore((s) => s.setZoneState);

  // Values driven by the choreography engine.
  const opacityRef = useRef(0.0);
  const emissiveRef = useRef(0.6);
  const scaleRef = useRef(1.0);

  // Flash intensity during `completing`. Ramps up and stays high.
  const flashRef = useRef(0);

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
      flashRef.current = 0;
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
      // Hold at full intensity. 7.6 will run the dissolve.
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

    // States: available, approaching, near, valid-release
    cancel('zone.appear');
    cancel('zone.recover');
    if (!isPlaying('zone.pulse')) {
      void play('zone.pulse');
    }
  }, [zoneState, setZoneState]);

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
