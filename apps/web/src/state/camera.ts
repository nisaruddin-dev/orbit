/**
 * @module state/camera
 *
 * Camera state store. Tracks which of the four camera states is
 * currently active.
 *
 * This is a Zustand store so any component can read or set the
 * current state without prop drilling.
 *
 * The camera rig subscribes to this store and interpolates toward
 * the target pose every frame.
 */

import { create } from 'zustand';

import type { CameraState } from '@/camera/states';

interface CameraStore {
  /** The current camera state. Default: orbit. */
  state: CameraState;
  /** Change the camera state. Triggers a transition in the rig. */
  setState: (state: CameraState) => void;
}

export const useCameraStore = create<CameraStore>((set) => ({
  state: 'orbit',
  setState: (state) => set({ state }),
}));
