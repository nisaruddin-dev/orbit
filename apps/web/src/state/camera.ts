/**
 * @module state/camera
 *
 * Camera state store. Tracks the current camera state and, when
 * focus is active, the world position of the focused target.
 *
 * The camera rig subscribes to this store and interpolates toward
 * the target pose every frame.
 */

import { create } from 'zustand';

import type { CameraState } from '@/camera/states';

interface CameraStore {
  /** The current camera state. Default: orbit. */
  state: CameraState;

  /**
   * When state is 'focus', the world position of the focused node.
   * The camera rig computes the focus pose relative to this point.
   * Null when no focus target has been set (the rig falls back to
   * the baseline focus pose in CAMERA_POSES.focus).
   */
  focusTarget: [number, number, number] | null;

  /** Change the camera state. Triggers a transition in the rig. */
  setState: (state: CameraState) => void;

  /** Set the focus target position. */
  setFocusTarget: (target: [number, number, number] | null) => void;
}

export const useCameraStore = create<CameraStore>((set) => ({
  state: 'orbit',
  focusTarget: null,
  setState: (state) => {
    set({ state });
  },
  setFocusTarget: (target) => {
    set({ focusTarget: target });
  },
}));
