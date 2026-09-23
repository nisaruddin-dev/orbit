/**
 * @module camera/states
 *
 * Camera state definitions. Four states, no more.
 *
 * Each state describes:
 *   - the target position of the camera
 *   - the point the camera looks at
 *   - the field of view
 *
 * Transitions between states interpolate position, target, and FOV
 * over a fixed duration with cinematic easing.
 */

/**
 * The four camera states. Never any other count.
 */
export type CameraState = 'orbit' | 'focus' | 'timeline' | 'aurora';

/**
 * A camera pose: position + look-at target + FOV.
 */
export interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

/**
 * The four canonical poses.
 *
 * These are baseline values. When Focus is triggered by a specific
 * task, the position and target will be recomputed relative to that
 * task's world position.
 */
export const CAMERA_POSES: Record<CameraState, CameraPose> = {
  orbit: {
    position: [0, 6, 12],
    target: [0, 2, 0],
    fov: 45,
  },
  focus: {
    // Position is relative — will be recomputed per focus target.
    // These are baseline values for when nothing is focused.
    position: [0, 2.5, 4.5],
    target: [0, 2, 0],
    fov: 35,
  },
  timeline: {
    position: [0, 1.5, 8],
    target: [0, 1, 0],
    fov: 50,
  },
  aurora: {
    position: [0, 3, 20],
    target: [0, 2, 0],
    fov: 40,
  },
};

/**
 * Default transition duration per state change, in seconds.
 * Values from UI/UX §36.
 */
export const TRANSITION_DURATION: Record<CameraState, number> = {
  orbit: 1.2,
  focus: 1.2,
  timeline: 1.4,
  aurora: 1.6,
};
