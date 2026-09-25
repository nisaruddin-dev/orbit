/**
 * @module camera/CameraRig
 *
 * Camera control. Reads the current camera state from the store
 * and interpolates the camera toward the target pose every frame.
 *
 * The focus state uses `computeFocusPose` with the focused node's
 * world position. Other states use their static CAMERA_POSES entry.
 *
 * Transitions follow a Catmull-Rom spline path with cinematic
 * easing. Micro-drift is added on top of the interpolated position
 * so the camera is never truly still.
 *
 * Both state changes and focus-target changes start a transition
 * from the camera's ACTUAL current position, including drift. The
 * spline is built from that real position to the new pose, so the
 * camera never jumps to a position it was never at.
 */

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { PerspectiveCamera } from 'three';

import { catmullRom, computeArcControlPoint } from '@/lib';
import { IDLE } from '@/design';
import { useCameraStore } from '@/state/camera';

import {
  CAMERA_POSES,
  TRANSITION_DURATION,
  FOCUS_TO_FOCUS_DURATION,
  computeFocusPose,
} from './states';
import type { CameraState, CameraPose } from './states';

const FREQ_X = 1.0;
const FREQ_Y = 1.3;
const FREQ_Z = 0.7;
const PHASE_X = 0.0;
const PHASE_Y = 1.7;
const PHASE_Z = 3.1;

const ARC_OFFSET_FACTOR = 0.15;

function cinematicEase(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function computeDrift(
  t: number,
): { dx: number; dy: number; dz: number } {
  const omega = 2 * Math.PI * IDLE.cameraDriftFrequency;
  const amp = IDLE.cameraDriftAmplitude;
  return {
    dx: Math.sin(t * omega * FREQ_X + PHASE_X) * amp,
    dy: Math.sin(t * omega * FREQ_Y + PHASE_Y) * amp,
    dz: Math.sin(t * omega * FREQ_Z + PHASE_Z) * amp,
  };
}

function resolvePose(
  state: CameraState,
  focusTarget: [number, number, number] | null,
): CameraPose {
  if (state === 'focus' && focusTarget) {
    return computeFocusPose(focusTarget);
  }
  return CAMERA_POSES[state];
}

export function CameraRig() {
  const state = useCameraStore((s) => s.state);
  const focusTarget = useCameraStore((s) => s.focusTarget);

  const currentPosition = useRef(new Vector3());
  const currentTarget = useRef(new Vector3());
  const currentFov = useRef(45);

  const transitionStartTime = useRef<number | null>(null);
  const transitionFromPosition = useRef(new Vector3());
  const transitionFromTarget = useRef(new Vector3());
  const transitionFromFov = useRef(45);
  const transitionDuration = useRef(1.2);

  const splineControlA = useRef(new Vector3());

  const lastStateRef = useRef<CameraState>(state);
  const lastFocusTargetRef = useRef<[number, number, number] | null>(
    focusTarget,
  );

  useEffect(() => {
    const initial = CAMERA_POSES.orbit;
    currentPosition.current.set(...initial.position);
    currentTarget.current.set(...initial.target);
    currentFov.current = initial.fov;
  }, []);

  useFrame((threeState) => {
    const camera = threeState.camera;
    const t = threeState.clock.elapsedTime;

    const stateChanged = lastStateRef.current !== state;
    const focusTargetChanged =
      state === 'focus' &&
      JSON.stringify(lastFocusTargetRef.current) !==
        JSON.stringify(focusTarget);

    if (stateChanged || focusTargetChanged) {
      // Capture the camera's ACTUAL position, including drift.
      // This is where the spline begins.
      const { dx, dy, dz } = computeDrift(t);
      const actualX = currentPosition.current.x + dx;
      const actualY = currentPosition.current.y + dy;
      const actualZ = currentPosition.current.z + dz;

      transitionFromPosition.current.set(actualX, actualY, actualZ);
      transitionFromTarget.current.copy(currentTarget.current);
      transitionFromFov.current = currentFov.current;
      transitionStartTime.current = t;

      // Duration: use the longer focus-to-focus duration when we
      // are moving between focus targets.
      if (focusTargetChanged && !stateChanged) {
        transitionDuration.current = FOCUS_TO_FOCUS_DURATION;
      } else {
        transitionDuration.current = TRANSITION_DURATION[state];
      }

      const endPose = resolvePose(state, focusTarget);
      const startPos = transitionFromPosition.current;
      const endPos = new Vector3(...endPose.position);

      const controlA = computeArcControlPoint(
        startPos,
        endPos,
        ARC_OFFSET_FACTOR,
      );
      splineControlA.current.copy(controlA);

      lastStateRef.current = state;
      lastFocusTargetRef.current = focusTarget;
    }

    const targetPose = resolvePose(state, focusTarget);

    let progress = 1.0;
    if (transitionStartTime.current !== null) {
      const elapsed = t - transitionStartTime.current;
      progress = Math.min(elapsed / transitionDuration.current, 1.0);
      if (progress >= 1.0) {
        transitionStartTime.current = null;
      }
    }

    const eased = cinematicEase(progress);

    const targetTargetVec = new Vector3(...targetPose.target);
    currentTarget.current.lerpVectors(
      transitionFromTarget.current,
      targetTargetVec,
      eased,
    );
    currentFov.current =
      transitionFromFov.current +
      (targetPose.fov - transitionFromFov.current) * eased;

    if (transitionStartTime.current !== null) {
      const endPosition = new Vector3(...targetPose.position);
      const sampled = catmullRom(
        transitionFromPosition.current,
        splineControlA.current,
        endPosition,
        endPosition,
        eased,
      );
      currentPosition.current.copy(sampled);
    } else {
      currentPosition.current.set(...targetPose.position);
    }

    const { dx, dy, dz } = computeDrift(t);

    camera.position.set(
      currentPosition.current.x + dx,
      currentPosition.current.y + dy,
      currentPosition.current.z + dz,
    );
    camera.lookAt(currentTarget.current);

    const perspectiveCamera = camera as PerspectiveCamera;
    if (Math.abs(perspectiveCamera.fov - currentFov.current) > 0.01) {
      perspectiveCamera.fov = currentFov.current;
      perspectiveCamera.updateProjectionMatrix();
    }
  });

  return null;
}
