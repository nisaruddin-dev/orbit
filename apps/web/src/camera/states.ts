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
 *
 * The focus state is special: its position and target are computed
 * dynamically from the focused node's world position. The values
 * in CAMERA_POSES.focus are used only when no focus target is set.
 *
 * The baseline focus pose looks at the Core at its center. Earlier
 * versions used target Y = 2, which placed the Core above the frame.
 * The corrected baseline uses Y = 0.
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
 * `focus` uses baseline values here. When a focus target is set,
 * `computeFocusPose` is used instead.
 */
export const CAMERA_POSES: Record<CameraState, CameraPose> = {
  orbit: {
    position: [0, 10, 18],
    target: [0, 0, 0],
    fov: 45,
  },
  focus: {
    // Baseline focus pose: camera in front of the Core at eye
    // level, looking at the Core's center.
    position: [0, 1.2, 4],
    target: [0, 0, 0],
    fov: 40,
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

/**
 * Duration for a focus-to-focus move (one node to another).
 * Longer than a state change, so the camera has time to swing.
 */
export const FOCUS_TO_FOCUS_DURATION = 1.6;

/**
 * Distance from the focused node where the camera sits.
 */
const FOCUS_CAMERA_DISTANCE = 2.8;

/**
 * Vertical offset of the camera above the node's plane.
 */
const FOCUS_CAMERA_HEIGHT = 0.9;

/**
 * Vertical offset of the look-at target above the node center.
 * Slightly above so the node's label is visible.
 */
const FOCUS_TARGET_HEIGHT = 0.35;

/**
 * Compute the focus pose for a given node position.
 *
 * The camera sits outward from the node (further from origin),
 * slightly above it. The camera looks at the node, slightly above
 * its center.
 *
 * If the node is at the origin (unusual), the camera sits in
 * front of the origin along +Z.
 */
export function computeFocusPose(
  nodePosition: [number, number, number],
): CameraPose {
  const [px, py, pz] = nodePosition;

  const radialLength = Math.sqrt(px * px + pz * pz);

  // Outward direction in the XZ plane. If the node is at origin,
  // use +Z as the outward direction.
  let outwardX: number;
  let outwardZ: number;
  if (radialLength < 0.0001) {
    outwardX = 0;
    outwardZ = 1;
  } else {
    outwardX = px / radialLength;
    outwardZ = pz / radialLength;
  }

  const camX = px + outwardX * FOCUS_CAMERA_DISTANCE;
  const camY = py + FOCUS_CAMERA_HEIGHT;
  const camZ = pz + outwardZ * FOCUS_CAMERA_DISTANCE;

  const targetX = px;
  const targetY = py + FOCUS_TARGET_HEIGHT;
  const targetZ = pz;

  return {
    position: [camX, camY, camZ],
    target: [targetX, targetY, targetZ],
    fov: 40,
  };
}
