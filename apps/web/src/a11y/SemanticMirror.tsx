/**
 * @module a11y/SemanticMirror
 *
 * A semantic HTML mirror of the tasks in the world. Visually
 * hidden. Exposed to screen readers and to keyboard-only users.
 *
 * This is not a lesser interface. Every action available in the
 * 3D world is available here. Both paths go through the same
 * intent system, the same mutations, the same API, the same
 * offline queue.
 *
 * The mirror reads from the task store. It stays in sync because
 * the store is the canonical local projection of the world.
 *
 * Source: PRD F-1105, System Architecture §40–41,
 * TRD §59 (Accessible Semantic Mirror).
 */

import { dispatchIntent } from '@/input';
import { useTaskStore } from '@/state/tasks';

interface SemanticMirrorProps {
  /**
   * Force the mirror to be visible, overriding the default
   * visually-hidden state. Used when WebGL is unavailable and
   * the mirror IS the primary interface.
   */
  visible?: boolean;
}

export function SemanticMirror({ visible = false }: SemanticMirrorProps) {
  const tasks = useTaskStore((s) => s.tasks);

  return (
    <section
      className={visible ? 'semantic-mirror semantic-mirror--visible' : 'semantic-mirror'}
      aria-label="Orbit tasks"
      aria-live="polite"
    >
      {tasks.length === 0 && <p>No tasks yet.</p>}

      {tasks.map((task) => (
        <article key={task.id} className="semantic-mirror__task">
          <h2>{task.title}</h2>
          <p>
            {task.ring === 'today' && 'Today'}
            {task.ring === 'week' && 'This Week'}
            {task.ring === 'someday' && 'Someday'}
            {' · '}
            Priority {task.priority}
            {' · '}
            {task.status}
          </p>
          {task.notes && <p>{task.notes}</p>}
          <div className="semantic-mirror__actions">
            <button
              type="button"
              onClick={() => {
                dispatchIntent({ type: 'FOCUS_NODE', nodeId: task.id });
              }}
            >
              Focus
            </button>
            <button
              type="button"
              disabled={task.status === 'completed'}
              onClick={() => {
                dispatchIntent({ type: 'COMPLETE_NODE', nodeId: task.id });
              }}
            >
              Complete
            </button>
            <button
              type="button"
              disabled={task.status === 'archived'}
              onClick={() => {
                dispatchIntent({ type: 'ARCHIVE_NODE', nodeId: task.id });
              }}
            >
              Archive
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
