/**
 * @module input/useIntent
 *
 * A hook for subscribing to and dispatching interaction intents.
 *
 * Components that *produce* intents call `dispatch(intent)`.
 * Components that *consume* intents subscribe via `useIntents`.
 *
 * In practice, this is a thin wrapper around a global event
 * dispatcher. It decouples input producers (mouse handlers, keyboard
 * handlers) from input consumers (selection logic, drag logic).
 */

import { useEffect } from 'react';

import type { InteractionIntent, IntentListener } from './intents';

/**
 * Global set of active listeners. Every component that subscribes
 * to intents is added here.
 */
const listeners = new Set<IntentListener>();

/**
 * Dispatch an intent to all active listeners.
 */
export function dispatchIntent(intent: InteractionIntent): void {
  for (const listener of listeners) {
    listener(intent);
  }
}

/**
 * Subscribe to all intents. Callback fires for every intent.
 */
export function useIntents(listener: IntentListener): void {
  useEffect(() => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, [listener]);
}
