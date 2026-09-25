/**
 * @module scene/ZoneProjection
 *
 * A ground-plane marker showing the completion zone's actual
 * valid-release target. The zone torus sits at y = -1.5 for
 * visual reasons, which makes its center ambiguous from a side
 * camera. This projection sits at y = 0.02 (just above the drag
 * plane) directly below the zone's center, with the radius of
 * the valid-release band. Dropping inside this ring triggers
 * completion.
 *
 * The projection shares the zone's opacity: it is invisible when
 * the zone is hidden, and appears with the zone during a drag.
 *
 * Source: 7.6b usability fix.
 */

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color } from 'three';
import type { Mesh, MeshStandardMaterial } from 'three';

import { ACCENT, SPATIAL } from '@/design';
import { subscribe } from '@/choreography';
import { useInteractionStore } from '@/state/interaction';

/**
 * The radius of the valid-release band. Matches ZONE_BANDS.validRelease.
 * Hardcoded to avoid importing the store module.
 */
const VALID_RELEASE_RADIUS = 1.0;

/** Height above the ground plane so the marker does not z-fight. */
const PROJECTION_Y = 0.02;

export function ZoneProjection() {
  const meshRef = useRef<Mesh>(null);

  const zoneColor = useMemo(() => new Color(ACCENT.done), []);

  const zoneProximity = useInteractionStore((s) => s.zoneProximity);

  const opacityRef = useRef(0.0);

  // Share the zone's opacity. The completion zone writes its
  // `zone.opacity` track; the projection listens for the same.
  useEffect(() => {
    const unsubscribe = subscribe(
      (_target, property, value) => {
        if (property === 'opacity') opacityRef.current = value;
      },
      { filter: { target: 'zone' } },
    );
    return () => {
      unsubscribe();
    };
  }, []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const material = mesh.material as MeshStandardMaterial;

    // During idle, use proximity to boost visibility slightly.
    // The zone's own opacity carries the base value.
    const proximityBoost = zoneProximity * 0.3;
    const finalOpacity = Math.min(1.0, opacityRef.current + proximityBoost);

    material.opacity = finalOpacity;

    mesh.visible = finalOpacity > 0.01;
  });

  return (
    <mesh
      ref={meshRef}
      position={[
        SPATIAL.completionZonePosition[0],
        PROJECTION_Y,
        SPATIAL.completionZonePosition[2],
      ]}
      rotation={[-Math.PI / 2, 0, 0]}
      visible={false}
    >
      <ringGeometry args={[VALID_RELEASE_RADIUS - 0.04, VALID_RELEASE_RADIUS, 64]} />
      <meshBasicMaterial
        color={zoneColor}
        transparent
        opacity={0.0}
        depthWrite={false}
      />
    </mesh>
  );
}
