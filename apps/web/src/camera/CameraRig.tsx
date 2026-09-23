/**
 * @module camera/CameraRig
 *
 * Camera control. Reads the current camera state from the store
 * and interpolates the camera toward the target pose every frame.
 *
 * Adds subtle micro-drift so the camera is never truly still.
 *
 * Interpolation uses a fixed-duration eased approach:
 *   - when the state changes, capture the current pose as the start
 *   - capture the target pose from CAMERA_POSES
 *   - over TRANSITION_DURATION seconds, interpolate start → target
 *   - after the transition, apply micro-drift on top of the target
 *
 * When no transition is in progress, the camera stays at the
 * target pose plus micro-drift.
 */

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

import { IDLE } from '@/design';
import { useCameraStore } from '@/state/camera';

import { CAMERA_POSES, TRANSITION_DURATION } from './states';
import type { CameraState, CameraPose } from './states';

/** Frequencies and phases for the micro-drift sines. */
const FREQ_X = 1.0;
const FREQ_Y = 1.3;
const FREQ_Z = 0.7;
const PHASE_X = 0.0;
const PHASE_Y = 1.7;
const PHASE_Z = 3.1;

/**
 * Cubic ease-in-out matching the `cinematic` easing curve.
 * Approximation of cubic-bezier(0.65, 0, 0.35, 1).
 */
function cinematicEase(t: number): number {
  // Simple cubic ease-in-out. Visually similar to the CSS curve.
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface CameraRigProps {
  /** Reserved for future use. Currently unused. */
  target?: [number, number, number];
}

/**
 * The camera rig. Runs every frame.
 */
export function CameraRig({ target: _target }: CameraRigProps = {}) {
  const state = useCameraStore((s) => s.state);

  // Current interpolated values.
  const currentPosition = useRef(new Vector3());
  const currentTarget = useRef(new Vector3());
  const currentFov = useRef(45);

  // Transition tracking.
  const transitionStartTime = useRef<number | null>(null);
  const transitionFromPosition = useRef(new Vector3());
  const transitionFromTarget = useRef(new Vector3());
  const transitionFromFov = useRef(45);
  const transitionDuration = useRef(1.2);
  const lastStateRef = useRef<CameraState>(state);

  // Initialize the camera on first render.
  useEffect(() => {
    const initial = CAMERA_POSES.orbit;
    currentPosition.current.set(...initial.position);
    currentTarget.current.set(...initial.target);
    currentFov.current = initial.fov;
  }, []);

  useFrame((threeState) => {
    const camera = threeState.camera;
    const t = threeState.clock.elapsedTime;

    // Detect state change.
    if (lastStateRef.current !== state) {
      // Start a new transition.
      transitionFromPosition.current.copy(currentPosition.current);
      transitionFromTarget.current.copy(currentTarget.current);
      transitionFromFov.current = currentFov.current;
      transitionStartTime.current = t;
      transitionDuration.current = TRANSITION_DURATION[state];
      lastStateRef.current = state;
    }

    const targetPose: CameraPose = CAMERA_POSES[state];

    // Compute interpolation progress.
    let progress = 1.0;
    if (transitionStartTime.current !== null) {
      const elapsed = t - transitionStartTime.current;
      progress = Math.min(elapsed / transitionDuration.current, 1.0);

      if (progress >= 1.0) {
        transitionStartTime.current = null;
      }
    }

    const eased = cinematicEase(progress);

    // Interpolate position, target, fov.
    const targetPositionVec = new Vector3(...targetPose.position);
    const targetTargetVec = new Vector3(...targetPose.target);

    currentPosition.current.lerpVectors(
      transitionFromPosition.current,
      targetPositionVec,
      eased,
    );
    currentTarget.current.lerpVectors(
      transitionFromTarget.current,
      targetTargetVec,
      eased,
    );
    currentFov.current =
      transitionFromFov.current +
      (targetPose.fov - transitionFromFov.current) * eased;

    // Apply micro-drift on top of the interpolated position.
    const omega = 2 * Math.PI * IDLE.cameraDriftFrequency;
    const amp = IDLE.cameraDriftAmplitude;
    const dx = Math.sin(t * omega * FREQ_X + PHASE_X) * amp;
    const dy = Math.sin(t * omega * FREQ_Y + PHASE_Y) * amp;
    const dz = Math.sin(t * omega * FREQ_Z + PHASE_Z) * amp;

    camera.position.set(
      currentPosition.current.x + dx,
      currentPosition.current.y + dy,
      currentPosition.current.z + dz,
    );
    camera.lookAt(currentTarget.current);

    // Update FOV only if it changed. R3F handles the projection
    // matrix update when `updateProjectionMatrix` is called.
    if ('fov' in camera && typeof camera.fov === 'number') {
      if (Math.abs(camera.fov - currentFov.current) > 0.01) {
        camera.fov = currentFov.current;
        camera.updateProjectionMatrix();
      }
    }
  });

  return null;
}
