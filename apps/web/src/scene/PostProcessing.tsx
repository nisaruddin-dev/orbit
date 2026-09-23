/**
 * @module scene/PostProcessing
 *
 * The cinematic layer. Applied after the scene is rendered.
 *
 * Effects, in order:
 *   1. Bloom      — soft glow around bright elements
 *   2. Vignette   — subtle corner darkening
 *   3. Noise      — very subtle animated film grain
 *
 * Depth of field is intentionally omitted. It's expensive on
 * mobile and the current focal plane (everything far) doesn't
 * benefit from it yet. We'll add it in Chunk 18 (Polish) when
 * the composition stabilizes.
 *
 * Values come from UI/UX §67.
 */

import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

/**
 * Renders the post-processing effects chain.
 *
 * Must be placed inside the Canvas, as the last child, so it
 * processes the complete scene.
 */
export function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.35}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.6}
        mipmapBlur
      />
      <Vignette
        offset={0.3}
        darkness={0.5}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise
        opacity={0.02}
        blendFunction={BlendFunction.OVERLAY}
      />
    </EffectComposer>
  );
}
