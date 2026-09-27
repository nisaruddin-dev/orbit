/**
 * @module data/sync
 *
 * Watches online/offline status and flushes the offline queue
 * when the network returns.
 *
 * Mounted once, at the top of the app. When the browser fires
 * the `online` event, the queue is read and each mutation is
 * replayed in order.
 *
 * Source: System Architecture §19 (Offline Queue),
 * §22 (Network Failure).
 */

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useNetworkStore } from '@/state/network';

import { completeTask, updateTask, type TaskUpdate } from './api';
import { readAll, remove } from './offlineQueue';
import { tasksQueryKey } from './queries';

/**
 * Flush the offline queue. Replays each queued mutation in FIFO
 * order. Successfully replayed entries are removed from the
 * queue. Failed entries stay.
 */
async function flushQueue(
  onComplete: () => void,
): Promise<void> {
  const entries = await readAll();
  if (entries.length === 0) return;

  for (const entry of entries) {
    try {
      if (entry.type === 'update') {
        await updateTask(entry.taskId, entry.payload as TaskUpdate);
      } else {
        await completeTask(entry.taskId);
      }
      await remove(entry.id);
    } catch (err) {
      // If the failure is a network error, stop here. We will
      // try again on the next reconnect. If it is a real HTTP
      // error, remove the entry — retrying will not help.
      const isNetworkError =
        err instanceof Error && err.name === 'ApiNetworkError';
      if (!isNetworkError) {
        await remove(entry.id);
      } else {
        break;
      }
    }
  }

  onComplete();
}

/**
 * Install the sync hook. Mount once, inside App.
 */
export function useSync(): void {
  const queryClient = useQueryClient();
  const online = useNetworkStore((s) => s.online);
  const setOnline = useNetworkStore((s) => s.setOnline);

  // Listen to the browser's online/offline events.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setOnline(true);
    };
    const handleOffline = () => {
      setOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline]);

  // When we come back online, flush the queue and refetch.
  useEffect(() => {
    if (!online) return;

    void flushQueue(() => {
      // After the queue is flushed, refetch so the store
      // reflects whatever the server now has.
      void queryClient.invalidateQueries({ queryKey: tasksQueryKey });
    });
  }, [online, queryClient]);

}
