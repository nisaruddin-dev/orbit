/**
 * @module a11y/useWebGLSupport
 *
 * Detects whether the browser can render WebGL.
 *
 * Returns:
 *   - 'supported' — WebGL context created successfully
 *   - 'unsupported' — WebGL unavailable or context creation failed
 *
 * The test creates a throwaway canvas and tries to get a WebGL2
 * context, then a WebGL1 context. It disposes the canvas
 * immediately so no GPU resources leak.
 *
 * The test runs once, as the initial state of the hook. It is
 * synchronous and safe to call during render on the client. No
 * effect is needed. This avoids React 19's setState-in-effect
 * warning.
 *
 * Source: TRD §93 (WebGL Failure), System Architecture §50
 * (WebGL Failure).
 */

import { useState } from 'react';

export type WebGLSupport = 'supported' | 'unsupported';

/**
 * Test whether a WebGL context can be created.
 * Returns true if it can, false otherwise.
 */
function testWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  if (typeof document === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');

    // Try WebGL2 first.
    const gl2 = canvas.getContext('webgl2');
    if (gl2) {
      const lose = gl2.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
      return true;
    }

    // Fall back to WebGL1.
    // The `webgl` and `experimental-webgl` context IDs return
    // WebGLRenderingContext, but TypeScript's lib.dom typings
    // only infer this for the `webgl` string literal. We test
    // the returned context for the presence of `getExtension`
    // to distinguish it from a 2D context.
    const maybeGl = canvas.getContext('webgl');
    if (maybeGl && 'getExtension' in maybeGl) {
      const lose = maybeGl.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Hook form. Runs the test once, as the initial state.
 */
export function useWebGLSupport(): WebGLSupport {
  const [support] = useState<WebGLSupport>(() =>
    testWebGL() ? 'supported' : 'unsupported',
  );
  return support;
}
