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
 * The pattern for each mutation:
 *   1. onMutate   — snapshot the store, apply the change locally
 *   2. mutationFn — call the API
 *   3. onSuccess  — merge the canonical task into the store
 *   4. onError    — restore the snapshot
 *
 * Source: System Architecture §19 (Optimistic Mutations),
 * TRD §19 (Optimistic Mutations).
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useTaskStore } from '@/state/tasks';
import type { Task } from '@orbit/shared';

import { updateTask as apiUpdateTask, type TaskUpdate } from './api';
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
 * The patch uses snake_case keys that match the API (`due_at`),
 * while the local Task uses camelCase (`dueAt`). This function
 * maps between them for the fields that differ.
 *
 * For fields that share a name (`title`, `notes`, `ring`,
 * `priority`, `recurrence`, `orbit_angle`, `orbit_radius`,
 * `status`), no mapping is needed.
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

/**
 * Update a single task with an optimistic patch.
 *
 * The component passes a partial patch. Only the fields in the
 * patch are sent to the server and applied locally.
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();
  const setTasks = useTaskStore((s) => s.setTasks);

  return useMutation<Task, Error, UpdateTaskVariables, UpdateTaskContext>({
    mutationFn: ({ id, patch }) => apiUpdateTask(id, patch),

    onMutate: ({ id, patch }) => {
      // Snapshot the task list for rollback.
      const previous = useTaskStore.getState().tasks;

      // Apply the patch to the local cache.
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
      // Replace the optimistic version with the canonical one
      // from the server.
      const current = useTaskStore.getState().tasks;
      const index = current.findIndex((t) => t.id === serverTask.id);
      if (index === -1) {
        setTasks([...current, serverTask]);
      } else {
        const next = current.slice();
        next[index] = serverTask;
        setTasks(next);
      }

      // Invalidate so the next fetch is authoritative.
      void queryClient.invalidateQueries({ queryKey: tasksQueryKey });
    },
  });
}

/**
 * Convenience wrapper for updating a single field on a task.
 * Returns the mutation plus an `updateField` helper that
 * constructs the patch for you.
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
