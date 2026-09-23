/**
 * @module camera
 *
 * Camera state machine and transition system.
 *
 * The camera has four states: Orbit, Focus, Timeline, Aurora.
 * Transitions between states interpolate position, target, and FOV
 * over a fixed duration with cinematic easing.
 */

export { CameraRig } from './CameraRig';
export { useCameraKeyboard } from './useCameraKeyboard';
export { CAMERA_POSES, TRANSITION_DURATION } from './states';
export type { CameraState, CameraPose } from './states';
