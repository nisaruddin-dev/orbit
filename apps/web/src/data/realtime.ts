/**
 * @module data/realtime
 *
 * Subscribes to changes on the tasks table via Supabase Realtime.
 *
 * The subscription treats Realtime as a signal, not as a data
 * source. When a change arrives, it invalidates the tasks query,
 * which refetches the full list from the API.
 *
 * Realtime is optional. If the connection fails or the project
 * config does not support it, the query's polling interval
 * handles synchronization instead. This module does not throw.
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
 * invalidate the tasks query.
 */
export function useRealtimeTasks(): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    let cancelled = false;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const start = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        // Not signed in. Polling handles sync.
        return;
      }

      await supabase.realtime.setAuth(token);

      if (cancelled) {
        // The cleanup function ran while we were awaiting
        // setAuth. Do not create the channel.
        return;
      }

      channel = supabase
        .channel('tasks-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tasks',
          },
          () => {
            void queryClient.invalidateQueries({
              queryKey: tasksQueryKey,
            });
          },
        );

      channel.subscribe((status) => {
        console.info('[realtime] status:', status);
      });
    };

    void start();

    return () => {
      cancelled = true;
      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, [queryClient]);
}
