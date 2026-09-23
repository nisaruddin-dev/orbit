/**
 * @module camera/CameraRig
 *
 * Camera control. For now, this handles only the *idle* camera state:
 * pointing at a fixed target and adding subtle micro-drift so the
 * world never feels frozen.
 *
 * The full camera state machine (Orbit, Focus, Timeline, Aurora with
 * cinematic transitions) is a Chunk 6 task and will extend this
 * component.
 *
 * Micro-drift uses three independent sine waves (one per axis) at
 * different frequencies. This produces organic, non-repeating motion
 * without needing an external noise library.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { Camera } from 'three';

import { CAMERA, IDLE } from '@/design';

/** Frequency multipliers per axis so they never sync up. */
const FREQ_X = 1.0;
const FREQ_Y = 1.3;
const FREQ_Z = 0.7;

/** Phase offsets per axis so they don't start at the same value. */
const PHASE_X = 0.0;
const PHASE_Y = 1.7;
const PHASE_Z = 3.1;

interface CameraRigProps {
  /** The point the camera should look at. */
  target: [number, number, number];
}

/**
 * Base camera position (without drift). Comes from tokens.
 */
const BASE_POSITION = new Vector3(
  CAMERA.orbit.x,
  CAMERA.orbit.y,
  CAMERA.orbit.z,
);

/**
 * The camera rig. Runs every frame to update camera position and
 * orientation.
 */
export function CameraRig({ target }: CameraRigProps) {
  const scratchPosition = useRef(new Vector3());

  useFrame((state) => {
    const camera = state.camera as Camera;
    const t = state.clock.elapsedTime;
    const omega = 2 * Math.PI * IDLE.cameraDriftFrequency;
    const amp = IDLE.cameraDriftAmplitude;

    // Three independent sine waves for organic drift.
    const dx = Math.sin(t * omega * FREQ_X + PHASE_X) * amp;
    const dy = Math.sin(t * omega * FREQ_Y + PHASE_Y) * amp;
    const dz = Math.sin(t * omega * FREQ_Z + PHASE_Z) * amp;

    scratchPosition.current.set(
      BASE_POSITION.x + dx,
      BASE_POSITION.y + dy,
      BASE_POSITION.z + dz,
    );

    camera.position.copy(scratchPosition.current);
    camera.lookAt(target[0], target[1], target[2]);
  });

  return null;
}
