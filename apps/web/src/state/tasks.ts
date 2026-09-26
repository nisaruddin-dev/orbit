/**
 * @module state/tasks
 *
 * Task store. A local cache of the tasks returned by the API.
 *
 * The store is populated by useTasks (in data/queries.ts), which
 * fetches from the backend and calls setTasks. Components read
 * from the store.
 *
 * The store is the cache. The API is the source of truth.
 * Mutations that write to the API are handled in 8b-5; this
 * store is read-mostly for now.
 *
 * Source: System Architecture §9 (State Authority Rule),
 * §17.1 (Server state).
 */

import { create } from 'zustand';

import type { Task } from '@orbit/shared';

interface TaskStore {
  tasks: Task[];

  /**
   * Replace the entire task list. Called by useTasks when the
   * query resolves, and later by realtime reconciliation.
   */
  setTasks: (tasks: Task[]) => void;

  /**
   * Update a single field on a single task. Writes updatedAt
   * automatically. Returns the updated task, or null if the ID
   * was not found.
   *
   * In 8b-5, this will be backed by an API mutation. For now it
   * only updates the local cache.
   */
  updateTask: <K extends keyof Task>(
    taskId: string,
    field: K,
    value: Task[K],
  ) => Task | null;

  /**
   * Get a task by ID.
   */
  getTask: (taskId: string) => Task | undefined;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  // Start empty. The query populates this.
  tasks: [],

  setTasks: (tasks) => {
    set({ tasks });
  },

  updateTask: (taskId, field, value) => {
    const existing = get().tasks;
    const index = existing.findIndex((task) => task.id === taskId);
    if (index === -1) return null;

    const current = existing[index];
    if (!current) return null;

    const updated: Task = {
      ...current,
      [field]: value,
      updatedAt: new Date().toISOString(),
    };

    const next = existing.slice();
    next[index] = updated;
    set({ tasks: next });

    return updated;
  },

  getTask: (taskId) => {
    return get().tasks.find((t) => t.id === taskId);
  },
}));
