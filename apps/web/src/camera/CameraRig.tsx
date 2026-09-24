/**
 * @module camera/CameraRig
 *
 * Camera control. Reads the current camera state from the store
 * and interpolates the camera toward the target pose every frame.
 *
 * Transitions follow a Catmull-Rom spline path. The spline arcs
 * outward from a computed control point, so the camera swings
 * through space instead of sliding in a straight line.
 *
 * Adds subtle micro-drift on top of the interpolated position so
 * the camera is never truly still.
 */

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { PerspectiveCamera } from 'three';

import { catmullRom, computeArcControlPoint } from '@/lib';
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
 * How far to push the arc control point outward from the straight
 * line between start and end. 0 = straight line. 0.15 = moderate arc.
 */
const ARC_OFFSET_FACTOR = 0.15;

/**
 * Cubic ease-in-out matching the `cinematic` easing curve.
 */
function cinematicEase(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * The camera rig. Runs every frame.
 */
export function CameraRig() {
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

  // Spline control points for the current transition.
  // These shape the arc the camera swings through.
  const splineControlA = useRef(new Vector3());
  const splineControlB = useRef(new Vector3());

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
      // Capture the current pose as the transition start.
      // Include the micro-drift so the transition begins from
      // where the camera actually is, not from the drift-free base.
      const omega = 2 * Math.PI * IDLE.cameraDriftFrequency;
      const amp = IDLE.cameraDriftAmplitude;
      const dx = Math.sin(t * omega * FREQ_X + PHASE_X) * amp;
      const dy = Math.sin(t * omega * FREQ_Y + PHASE_Y) * amp;
      const dz = Math.sin(t * omega * FREQ_Z + PHASE_Z) * amp;

      transitionFromPosition.current.set(
        currentPosition.current.x + dx,
        currentPosition.current.y + dy,
        currentPosition.current.z + dz,
      );
      transitionFromTarget.current.copy(currentTarget.current);
      transitionFromFov.current = currentFov.current;
      transitionStartTime.current = t;
      transitionDuration.current = TRANSITION_DURATION[state];

      // Compute spline control points for the arc.
      const startPos = transitionFromPosition.current;
      const endPos = new Vector3(...CAMERA_POSES[state].position);

      // The two "outer" control points shape the curve. Both are
      // positioned along a perpendicular from the midpoint of the
      // straight path, one on each side of the curve's inflection.
      // A single control point at the midpoint already creates a
      // nice arc; two let us shape the entry and exit slightly.
      const controlA = computeArcControlPoint(
        startPos,
        endPos,
        ARC_OFFSET_FACTOR,
      );
      const controlB = computeArcControlPoint(
        startPos,
        endPos,
        ARC_OFFSET_FACTOR,
      );

      splineControlA.current.copy(controlA);
      splineControlB.current.copy(controlB);

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

    // Interpolate the target point and FOV linearly (they don't
    // swing; only the camera position does).
    const targetTargetVec = new Vector3(...targetPose.target);
    currentTarget.current.lerpVectors(
      transitionFromTarget.current,
      targetTargetVec,
      eased,
    );
    currentFov.current =
      transitionFromFov.current +
      (targetPose.fov - transitionFromFov.current) * eased;

    // Sample the camera position along a Catmull-Rom spline.
    // Control points: (start, controlA, end, end)
    // The curve passes through controlA and end, and terminates
    // exactly at endPosition at t=1.0. The duplicated end is
    // standard — it makes the curve tangent at the destination.
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

    // Update FOV if it changed.
    const perspectiveCamera = camera as PerspectiveCamera;
    if (Math.abs(perspectiveCamera.fov - currentFov.current) > 0.01) {
      perspectiveCamera.fov = currentFov.current;
      perspectiveCamera.updateProjectionMatrix();
    }
  });

  return null;
}
