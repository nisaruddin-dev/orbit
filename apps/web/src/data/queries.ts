/**
 * @module data/queries
 *
 * TanStack Query hooks for the Orbit API.
 *
 * The first hook is useTasks, which fetches the task list and
 * writes it into the task store.
 *
 * The store is the cache. The query is the fetcher. Components
 * read from the store; the query populates it.
 *
 * Source: System Architecture §17.1 (Server state),
 * §9 (State Authority Rule).
 */

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useTaskStore } from '@/state/tasks';
import { listTasks } from './api';

/**
 * Query key for the tasks list.
 * Centralized so invalidation is consistent.
 */
export const tasksQueryKey = ['tasks'] as const;

/**
 * Fetch the task list and write it into the store.
 */
export function useTasks() {
  const setTasks = useTaskStore((s) => s.setTasks);

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

  // When the query succeeds, write the result into the store.
  useEffect(() => {
    if (query.data) {
      setTasks(query.data);
    }
  }, [query.data, setTasks]);

  return query;
}
