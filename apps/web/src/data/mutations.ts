/**
 * @module data/mutations
 *
 * TanStack Query mutations for the task API.
 *
 * Every mutation is optimistic: the local store is updated first,
 * the API call runs in the background, and the store is rolled
 * back if the server rejects. This is what makes UI changes feel
 * instant even when the network is slow.
 *
 * Source: System Architecture §19 (Optimistic Mutations),
 * TRD §19 (Optimistic Mutations).
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useTaskStore } from '@/state/tasks';
import type { Task } from '@orbit/shared';

import {
  completeTask as apiCompleteTask,
  updateTask as apiUpdateTask,
  type TaskUpdate,
} from './api';
import { tasksQueryKey } from './queries';

/** Variables passed to useUpdateTask. */
export interface UpdateTaskVariables {
  id: string;
  patch: TaskUpdate;
}

/** Snapshot for rollback. */
interface UpdateTaskContext {
  previous: Task[];
}

/**
 * Apply a TaskUpdate patch to a Task in local state.
 *
 * Maps snake_case API fields (due_at) to camelCase local fields
 * (dueAt). Fields that share a name pass through unchanged.
 */
function applyPatchToTask(task: Task, patch: TaskUpdate): Task {
  const next: Task = { ...task };

  if (patch.title !== undefined) next.title = patch.title;
  if (patch.notes !== undefined) next.notes = patch.notes;
  if (patch.ring !== undefined) next.ring = patch.ring;
  if (patch.priority !== undefined) next.priority = patch.priority;
  if (patch.recurrence !== undefined) next.recurrence = patch.recurrence;
  if (patch.status !== undefined) next.status = patch.status;
  if (patch.orbit_angle !== undefined) next.orbitAngle = patch.orbit_angle;
  if (patch.orbit_radius !== undefined) next.orbitRadius = patch.orbit_radius;
  if (patch.due_at !== undefined) next.dueAt = patch.due_at;

  return next;
}

/** Replace a task in the current list with an updated version. */
function replaceTask(current: Task[], updated: Task): Task[] {
  const index = current.findIndex((t) => t.id === updated.id);
  if (index === -1) return [...current, updated];
  const next = current.slice();
  next[index] = updated;
  return next;
}

/**
 * Update a single task with an optimistic patch.
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();
  const setTasks = useTaskStore((s) => s.setTasks);

  return useMutation<Task, Error, UpdateTaskVariables, UpdateTaskContext>({
    mutationFn: ({ id, patch }) => apiUpdateTask(id, patch),

    onMutate: ({ id, patch }) => {
      const previous = useTaskStore.getState().tasks;
      const next = previous.map((task) =>
        task.id === id ? applyPatchToTask(task, patch) : task,
      );
      setTasks(next);
      return { previous };
    },

    onError: (_error, _variables, context) => {
      if (context) {
        setTasks(context.previous);
      }
    },

    onSuccess: (serverTask) => {
      const current = useTaskStore.getState().tasks;
      setTasks(replaceTask(current, serverTask));
      void queryClient.invalidateQueries({ queryKey: tasksQueryKey });
    },
  });
}

/** Snapshot for rollback of the complete mutation. */
interface CompleteTaskContext {
  previous: Task[];
}

/**
 * Mark a task as completed. Optimistically sets status to
 * 'completed' and stamps completed_at.
 */
export function useCompleteTask() {
  const queryClient = useQueryClient();
  const setTasks = useTaskStore((s) => s.setTasks);

  return useMutation<Task, Error, string, CompleteTaskContext>({
    mutationFn: (id) => apiCompleteTask(id),

    onMutate: (id) => {
      const previous = useTaskStore.getState().tasks;
      const now = new Date().toISOString();
      const next = previous.map((task) =>
        task.id === id
          ? { ...task, status: 'completed' as const, completedAt: now }
          : task,
      );
      setTasks(next);
      return { previous };
    },

    onError: (_error, _id, context) => {
      if (context) {
        setTasks(context.previous);
      }
    },

    onSuccess: (serverTask) => {
      const current = useTaskStore.getState().tasks;
      setTasks(replaceTask(current, serverTask));
      void queryClient.invalidateQueries({ queryKey: tasksQueryKey });
    },
  });
}

/**
 * Convenience wrapper for updating a single task with a patch.
 */
export function useUpdateTaskField() {
  const mutation = useUpdateTask();
  return {
    ...mutation,
    updateField: (id: string, patch: TaskUpdate) => {
      mutation.mutate({ id, patch });
    },
  };
}
