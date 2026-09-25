/**
 * @module state/preferenceStore
 *
 * User preferences. Currently only reduced motion.
 *
 * The reduced-motion preference is initialized from the operating
 * system via `window.matchMedia('(prefers-reduced-motion: reduce)')`.
 * Components read it to decide whether to play motion-heavy
 * behaviors or their reduced variants.
 *
 * Source: UI/UX §90, System Architecture §42.
 */

import { create } from 'zustand';

interface PreferenceStore {
  /** Whether the user prefers reduced motion. */
  prefersReducedMotion: boolean;

  /** Update the preference. Called from the media query listener. */
  setPrefersReducedMotion: (value: boolean) => void;
}

export const usePreferenceStore = create<PreferenceStore>((set) => ({
  prefersReducedMotion: false,
  setPrefersReducedMotion: (value) => {
    set({ prefersReducedMotion: value });
  },
}));
