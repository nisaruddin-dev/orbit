/* eslint-disable react-hooks/immutability */
/**
 * @module scene/Sky
 *
 * Twilight sky gradient. Uses a generated gradient texture applied
 * as the scene background. Simpler and more reliable than a shader
 * sphere, with no pole artifacts.
 *
 * The gradient is defined by three environment tokens:
 *   skyTop   → upper color
 *   skyMid   → middle color (at midPoint)
 *   skyLow   → lower color
 *
 * ESLint disable note:
 * The `react-hooks/immutability` rule assumes all hook values are
 * immutable. Three.js's scene object is deliberately mutable —
 * setting `scene.background` is the only way to change it. This
 * file is the one place where that mutation is legitimate.
 */

import { useEffect, useMemo } from 'react';
import { CanvasTexture, LinearFilter, SRGBColorSpace } from 'three';
import { useThree } from '@react-three/fiber';

import { ENVIRONMENT } from '@/design';

const TEXTURE_HEIGHT = 512;

/**
 * Generates a small gradient texture from the environment tokens.
 * The texture is 1×512 pixels, stretched across the background.
 * Vertical only — no horizontal variation.
 */
function createSkyTexture(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = TEXTURE_HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context for sky texture');
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, TEXTURE_HEIGHT);
  gradient.addColorStop(0.0, ENVIRONMENT.skyTop);
  gradient.addColorStop(0.5, ENVIRONMENT.skyMid);
  gradient.addColorStop(1.0, ENVIRONMENT.skyLow);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1, TEXTURE_HEIGHT);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;

  return texture;
}

/**
 * Sets the R3F scene background to our gradient texture.
 * Renders nothing itself — it manipulates the scene.
 */
export function Sky() {
  const scene = useThree((state) => state.scene);

  const texture = useMemo(() => createSkyTexture(), []);

  useEffect(() => {
    const previousBackground = scene.background;
    scene.background = texture;

    return () => {
      scene.background = previousBackground;
      texture.dispose();
    };
  }, [scene, texture]);

  return null;
}
