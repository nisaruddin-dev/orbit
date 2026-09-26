/**
 * Orbit — Application entry point.
 *
 * Mounts the React tree inside a TanStack Query provider, and
 * installs the reduced-motion media query listener.
 *
 * StrictMode is temporarily removed because
 * @react-three/postprocessing's EffectComposer is not
 * StrictMode-safe in React 19.
 */

import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App.tsx';
import { usePreferenceStore } from '@/state/preferenceStore';

import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found in index.html');
}

// Reduced-motion listener.
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
usePreferenceStore
  .getState()
  .setPrefersReducedMotion(motionQuery.matches);
motionQuery.addEventListener('change', (event) => {
  usePreferenceStore.getState().setPrefersReducedMotion(event.matches);
});

// The QueryClient. One per app instance.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Do not retry on 4xx errors (auth, not found, validation).
      // Retry on network errors, up to twice.
      retry: (failureCount, error) => {
        // Only retry on network failures or 5xx responses. Do not
        // retry 4xx, which indicate a problem the client cannot
        // resolve by trying again.
        const status = (error as { status?: unknown }).status;
        if (typeof status === 'number' && status >= 400 && status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      // Data is considered fresh for 30 seconds. Realtime and
      // explicit invalidation handle the rest.
      staleTime: 30_000,
    },
  },
});

createRoot(rootElement).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
