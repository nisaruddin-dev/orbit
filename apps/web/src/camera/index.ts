/**
 * @module camera
 *
 * Camera state machine and transition system.
 *
 * The camera has four states: Orbit, Focus, Timeline, Aurora.
 * Transitions between states use Catmull-Rom splines with
 * cinematic easing.
 *
 * Currently implements only the idle camera (Orbit state with
 * micro-drift). The full state machine is a Chunk 6 task.
 */

export { CameraRig } from './CameraRig';
