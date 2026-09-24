/**
 * @module shared/task
 *
 * The canonical Task interface. This is the single source of truth
 * for what a task looks like across the entire Orbit codebase —
 * frontend, backend, mock data, and future persistence.
 *
 * Anywhere a task is represented, it must conform to this shape.
 * If a component needs a subset of fields, it uses Pick<Task, ...>.
 * If it needs derived values, it computes them at the boundary.
 *
 * Derived from System Architecture §10.
 */

/** The three orbital categories a task can belong to. */
export type TaskRing = 'today' | 'week' | 'someday';

/** Priority levels. 0 = dormant, 3 = high attention. */
export type TaskPriority = 0 | 1 | 2 | 3;

/** Lifecycle status. This is durable state, not visual state. */
export type TaskStatus = 'idle' | 'in_progress' | 'completed' | 'archived';

/** Recurrence patterns supported in V1. */
export type TaskRecurrence = 'daily' | 'weekly' | 'monthly';

/**
 * A task. The canonical shape.
 *
 * Fields are grouped by purpose:
 *   - Identity: id, userId
 *   - Content: title, notes
 *   - Classification: ring, priority
 *   - Lifecycle: status, dueAt, recurrence
 *   - Timestamps: createdAt, updatedAt, completedAt, archivedAt
 *   - Spatial memory: orbitAngle, orbitRadius
 */
export interface Task {
  // Identity
  id: string;
  userId: string;

  // Content
  title: string;
  notes: string;

  // Classification
  ring: TaskRing;
  priority: TaskPriority;

  // Lifecycle
  status: TaskStatus;
  dueAt: string | null;
  recurrence: TaskRecurrence | null;

  // Timestamps (ISO 8601 strings; UTC on the server)
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  archivedAt: string | null;

  // Spatial memory
  orbitAngle: number | null;
  orbitRadius: number | null;
}
