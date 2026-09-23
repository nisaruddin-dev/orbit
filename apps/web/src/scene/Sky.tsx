/**
 * @module scene/Sky
 *
 * Vertical gradient sky, rendered as a large inverted sphere with
 * a custom shader material.
 *
 * The gradient is defined in environment tokens:
 *   skyTop   → upper horizon
 *   skyMid   → the middle band
 *   skyLow   → lower horizon
 *
 * The gradient uses the sphere's *local* Y position (not normalized
 * world position) to avoid pole artifacts near the top and bottom
 * of the sphere.
 */

import { useMemo } from 'react';
import { BackSide, Color, ShaderMaterial } from 'three';

import { ENVIRONMENT } from '@/design';

const SPHERE_RADIUS = 500;

const VERTEX_SHADER = /* glsl */ `
  varying vec3 vLocalPosition;

  void main() {
    vLocalPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 topColor;
  uniform vec3 midColor;
  uniform vec3 lowColor;
  uniform float midPoint;
  uniform float exponent;
  uniform float radius;

  varying vec3 vLocalPosition;

  void main() {
    // Local Y ranges from -radius (bottom) to +radius (top).
    // Remap to [0, 1].
    float t = (vLocalPosition.y / radius + 1.0) * 0.5;

    // Three-stop gradient: low → mid → top
    vec3 color;
    if (t < midPoint) {
      float local = t / midPoint;
      color = mix(lowColor, midColor, pow(local, exponent));
    } else {
      float local = (t - midPoint) / (1.0 - midPoint);
      color = mix(midColor, topColor, pow(local, exponent));
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function Sky() {
  const material = useMemo(() => {
    return new ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        topColor: { value: new Color(ENVIRONMENT.skyTop) },
        midColor: { value: new Color(ENVIRONMENT.skyMid) },
        lowColor: { value: new Color(ENVIRONMENT.skyLow) },
        midPoint: { value: 0.5 },
        exponent: { value: 1.2 },
        radius: { value: SPHERE_RADIUS },
      },
      side: BackSide,
      depthWrite: false,
      fog: false,
    });
  }, []);

  return (
    <mesh material={material}>
      <sphereGeometry args={[SPHERE_RADIUS, 64, 32]} />
    </mesh>
  );
}
