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
 * The sky is rendered from inside the sphere, so all geometry is
 * behind the camera. It never receives shadows or lights — it IS
 * the light source for the rest of the scene (indirectly).
 */

import { useMemo } from 'react';
import { BackSide, Color, ShaderMaterial } from 'three';

import { ENVIRONMENT } from '@/design';

const VERTEX_SHADER = /* glsl */ `
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 topColor;
  uniform vec3 midColor;
  uniform vec3 lowColor;
  uniform float midPoint;
  uniform float exponent;

  varying vec3 vWorldPosition;

  void main() {
    // Normalize the world Y coordinate of this fragment to [0, 1]
    float h = normalize(vWorldPosition).y;

    // Remap to [0, 1] so we can blend between three colors
    float t = (h + 1.0) * 0.5;

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
        exponent: { value: 1.0 },
      },
      side: BackSide,
      depthWrite: false,
      fog: false,
    });
  }, []);

  return (
    <mesh material={material}>
      <sphereGeometry args={[500, 32, 16]} />
    </mesh>
  );
}
