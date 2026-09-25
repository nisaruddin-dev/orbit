/**
 * Orbit — Application entry point.
 *
 * Mounts the React tree and installs the reduced-motion media
 * query listener. The listener writes to the preference store
 * so any component can read the current preference.
 *
 * StrictMode is temporarily removed because @react-three/postprocessing's
 * EffectComposer is not StrictMode-safe in React 19. It will be
 * restored when the library fixes the issue upstream.
 */

import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import { usePreferenceStore } from '@/state/preferenceStore';

import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found in index.html');
}

// Install the reduced-motion listener before rendering.
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
usePreferenceStore
  .getState()
  .setPrefersReducedMotion(motionQuery.matches);
motionQuery.addEventListener('change', (event) => {
  usePreferenceStore.getState().setPrefersReducedMotion(event.matches);
});

createRoot(rootElement).render(<App />);
