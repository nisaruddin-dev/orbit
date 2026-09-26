/**
 * @module data/queries
 *
 * TanStack Query hooks for the Orbit API.
 *
 * The useTasks hook:
 *   1. Reads the cached task list from IndexedDB and writes it
 *      into the store immediately, so the scene renders with
 *      the last-known tasks even before the network responds.
 *   2. Fetches the fresh list from the API.
 *   3. Writes the fresh list into the store and the cache.
 *
 * The store is the in-memory cache. IndexedDB is the durable
 * cache. The API is the source of truth.
 *
 * Source: System Architecture §17.1 (Server state),
 * §17.3 (Persistent local state), §9 (State Authority Rule).
 */

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useTaskStore } from '@/state/tasks';
import { listTasks } from './api';
import { loadTasksFromCache, saveTasksToCache } from './cache';

/**
 * Query key for the tasks list.
 * Centralized so invalidation is consistent.
 */
export const tasksQueryKey = ['tasks'] as const;

/**
 * Fetch the task list, using IndexedDB as a fast local mirror.
 */
export function useTasks() {
  const setTasks = useTaskStore((s) => s.setTasks);

  // Hydrate the store from the cache before the query runs.
  // This happens once on mount. The query then overwrites the
  // store with fresh data.
  useEffect(() => {
    let cancelled = false;
    void loadTasksFromCache().then((cached) => {
      if (cancelled) return;
      if (cached.length > 0) {
        setTasks(cached);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [setTasks]);

  const query = useQuery({
    queryKey: tasksQueryKey,
    queryFn: listTasks,
    // Keep the previous data while refetching, so the scene
    // does not flicker empty between reloads.
    placeholderData: (previous) => previous,
    // Refetch when the window regains focus. A tab switch
    // should show the latest tasks.
    refetchOnWindowFocus: true,
    // Realtime (8b-7) will push changes; polling is not needed.
    refetchInterval: false,
  });

  // When the query succeeds, update the store and the cache.
  useEffect(() => {
    if (query.data) {
      setTasks(query.data);
      void saveTasksToCache(query.data);
    }
  }, [query.data, setTasks]);

  return query;
}
