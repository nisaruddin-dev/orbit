/**
 * @module state/network
 *
 * Tracks online/offline status of the browser.
 *
 * Reads `navigator.onLine` on mount, then listens for the
 * `online` and `offline` events. Components and hooks read this
 * to decide whether to attempt the network or queue mutations.
 *
 * Source: System Architecture §18 (Offline Guarantee),
 * §22 (Network Failure).
 */

import { create } from 'zustand';

interface NetworkStore {
  /** True when the browser reports an active connection. */
  online: boolean;

  /** Update the status. Called by the event listeners. */
  setOnline: (value: boolean) => void;
}

export const useNetworkStore = create<NetworkStore>((set) => ({
  online: typeof navigator !== 'undefined' ? navigator.onLine : true,
  setOnline: (value) => {
    set({ online: value });
  },
}));
