/* eslint-disable react-hooks/immutability */
/**
 * @module scene/Fog
 *
 * Exponential atmospheric fog. Fades distant objects into the sky
 * color, creating depth perception.
 *
 * The fog color matches the sky's horizon color so distant objects
 * dissolve seamlessly into the background.
 *
 * ESLint disable note:
 * Same as Sky.tsx — Three.js's scene object is deliberately mutable.
 */

import { useEffect } from 'react';
import { Color, FogExp2 } from 'three';
import { useThree } from '@react-three/fiber';

import { ENVIRONMENT, SPATIAL } from '@/design';

/**
 * Attaches exponential fog to the scene. Renders nothing itself.
 */
export function Fog() {
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    const fog = new FogExp2(new Color(ENVIRONMENT.skyMid), SPATIAL.fogDensity);
    const previousFog = scene.fog;
    scene.fog = fog;

    return () => {
      scene.fog = previousFog;
      // FogExp2 has no GPU resources to dispose — nothing to clean up.
    };
  }, [scene]);

  return null;
}
