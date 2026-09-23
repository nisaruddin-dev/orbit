/**
 * @module scene/Lighting
 *
 * The four-light rig. Never five. Never three. Always four.
 *
 * Key    — warm directional from upper-left. Defines form.
 * Fill   — cool hemisphere from below. Softens shadows.
 * Rim    — cyan directional from behind. Separates subjects from background.
 * Ambient — very low slate. Prevents pure black shadows.
 *
 * The rim light is the signature of Orbit's look. It's what makes
 * the scene feel cinematic rather than like a 3D viewport.
 */

import { LIGHTING } from '@/design';

/**
 * Renders the four lights. Never any other count.
 */
export function Lighting() {
  return (
    <>
      {/* Key light — warm, upper-left */}
      <directionalLight
        position={[
          LIGHTING.keyPosition[0],
          LIGHTING.keyPosition[1],
          LIGHTING.keyPosition[2],
        ]}
        intensity={LIGHTING.keyIntensity}
        color={LIGHTING.keyColor}
        castShadow={false}
      />

      {/* Fill light — cool hemisphere from below */}
      <hemisphereLight
        args={[LIGHTING.fillColor, LIGHTING.ambientColor, LIGHTING.fillIntensity]}
      />

      {/* Rim light — cyan, from behind. The signature. */}
      <directionalLight
        position={[
          LIGHTING.rimPosition[0],
          LIGHTING.rimPosition[1],
          LIGHTING.rimPosition[2],
        ]}
        intensity={LIGHTING.rimIntensity}
        color={LIGHTING.rimColor}
        castShadow={false}
      />

      {/* Ambient — slate, very low */}
      <ambientLight
        intensity={LIGHTING.ambientIntensity}
        color={LIGHTING.ambientColor}
      />
    </>
  );
}
