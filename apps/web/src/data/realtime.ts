/**
 * @module data/realtime
 *
 * Subscribes to changes on the tasks table via Supabase Realtime.
 *
 * The subscription treats Realtime as a **signal**, not as a data
 * source. When a change arrives, it invalidates the tasks query,
 * which refetches the full list from the API. This is the "signal,
 * not payload" pattern from System Architecture §21.
 *
 * Why not use the payload directly?
 *
 *   1. RLS applies to Realtime payloads separately from the API.
 *      Enabling one does not enable the other.
 *   2. The API is authoritative. The payload might be missing
 *      fields, or the shape might differ across versions.
 *   3. Refetching is cheap when the dataset is small, and it
 *      guarantees the local state matches the server exactly.
 *
 * Source: System Architecture §21 (Realtime Architecture),
 * §24 (Realtime Synchronization).
 */

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { supabase } from './supabase';
import { tasksQueryKey } from './queries';

/**
 * Subscribe to changes on the tasks table. On any event,
 * invalidate the tasks query. The query refetches.
 *
 * The subscription is scoped to the current session's JWT so
 * that RLS is respected. If the session changes (sign in, sign
 * out, token refresh), the subscription is recreated.
 */
export function useRealtimeTasks(): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | null = null;

    const start = async () => {
      // Read the current session. The token is required for
      // RLS-scoped Realtime.
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        // Not signed in. Nothing to subscribe to.
        return;
      }

      // Push the JWT to Realtime so it applies RLS.
      // This is required because Realtime runs in a separate
      // channel and does not automatically inherit the auth
      // context of the Supabase client.
      await supabase.realtime.setAuth(token);

      const channel = supabase
        .channel('tasks-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tasks',
          },
          () => {
            // Signal, not payload. Invalidate and refetch.
            void queryClient.invalidateQueries({
              queryKey: tasksQueryKey,
            });
          },
        )
        .subscribe();

      if (cancelled) {
        // Component unmounted while we were setting up.
        void supabase.removeChannel(channel);
        return;
      }

      unsubscribe = () => {
        void supabase.removeChannel(channel);
      };
    };

    void start();

    return () => {
      cancelled = true;
      if (unsubscribe) unsubscribe();
    };
  }, [queryClient]);
}
