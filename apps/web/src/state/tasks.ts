/**
 * @module state/tasks
 *
 * Task store. Holds the current tasks. In 7.5c-1, this replaces
 * the const MOCK_TASKS array that lived in App.tsx. In Part 8,
 * this store will be backed by the API and IndexedDB.
 *
 * The store exposes tasks as a list plus a lookup by ID. Update
 * actions write through both. No optimistic or deferred writes
 * yet — that comes with the sync layer in Part 8.
 *
 * Source: System Architecture §17 (local task projection),
 * PRD F-901 (persistence).
 */

import { create } from 'zustand';

import type { Task } from '@orbit/shared';

const NOW = new Date().toISOString();

/**
 * Initial mock tasks. These conform to the canonical Task
 * interface. They will be replaced by real data from the backend
 * in Part 8.
 */
export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    userId: 'mock-user',
    title: 'Review PR feedback',
    notes: '',
    ring: 'today',
    priority: 2,
    status: 'idle',
    dueAt: null,
    recurrence: null,
    createdAt: NOW,
    updatedAt: NOW,
    completedAt: null,
    archivedAt: null,
    orbitAngle: 0,
    orbitRadius: 4,
  },
  {
    id: 'task-2',
    userId: 'mock-user',
    title: 'Team standup',
    notes: '',
    ring: 'today',
    priority: 1,
    status: 'idle',
    dueAt: null,
    recurrence: null,
    createdAt: NOW,
    updatedAt: NOW,
    completedAt: null,
    archivedAt: null,
    orbitAngle: Math.PI / 2,
    orbitRadius: 4,
  },
  {
    id: 'task-3',
    userId: 'mock-user',
    title: 'Write design doc',
    notes: '',
    ring: 'week',
    priority: 1,
    status: 'idle',
    dueAt: null,
    recurrence: null,
    createdAt: NOW,
    updatedAt: NOW,
    completedAt: null,
    archivedAt: null,
    orbitAngle: Math.PI / 4,
    orbitRadius: 7,
  },
  {
    id: 'task-4',
    userId: 'mock-user',
    title: 'Refactor auth module',
    notes: '',
    ring: 'week',
    priority: 0,
    status: 'idle',
    dueAt: null,
    recurrence: null,
    createdAt: NOW,
    updatedAt: NOW,
    completedAt: null,
    archivedAt: null,
    orbitAngle: Math.PI,
    orbitRadius: 7,
  },
  {
    id: 'task-5',
    userId: 'mock-user',
    title: 'Learn Rust',
    notes: '',
    ring: 'someday',
    priority: 0,
    status: 'idle',
    dueAt: null,
    recurrence: null,
    createdAt: NOW,
    updatedAt: NOW,
    completedAt: null,
    archivedAt: null,
    orbitAngle: (3 * Math.PI) / 4,
    orbitRadius: 10,
  },
];

interface TaskStore {
  tasks: Task[];

  /**
   * Replace the entire task list.
   */
  setTasks: (tasks: Task[]) => void;

  /**
   * Update a single field on a single task. Writes `updatedAt`
   * automatically. Returns the updated task, or null if the ID
   * was not found.
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
  tasks: INITIAL_TASKS,

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
