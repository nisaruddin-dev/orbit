/**
 * @module ui/UndoGhost
 *
 * The 5-second undo affordance that appears after a task is
 * released. An HTML overlay positioned at the bottom of the screen.
 *
 * It appears when `lastCompleted` is set in the interaction store.
 * It auto-dismisses after 5 seconds. Clicking the Undo button
 * restores the task to its prior position and dismisses the ghost.
 *
 * Per UI/UX §58–§59: small, translucent, frosted, spatial,
 * non-blocking. It must never compete with the scene.
 *
 * Source: PRD F-407, UI/UX §58–§59.
 */

import { useEffect, useState } from 'react';

import { useInteractionStore } from '@/state/interaction';
import { useTaskStore } from '@/state/tasks';

/** The undo window, in seconds. UI/UX §58. */
const UNDO_WINDOW_SECONDS = 5;

export function UndoGhost() {
  const lastCompleted = useInteractionStore((s) => s.lastCompleted);
  const clearLastCompleted = useInteractionStore((s) => s.clearLastCompleted);
  const setNodeSettledPosition = useInteractionStore(
    (s) => s.setNodeSettledPosition,
  );
  const tasks = useTaskStore((s) => s.tasks);

  const [progress, setProgress] = useState(1.0);

  // Auto-dismiss after 5 seconds. The progress value drives a
  // visual countdown bar.
  useEffect(() => {
    if (!lastCompleted) {
      setProgress(1.0);
      return;
    }

    const start = performance.now();
    let rafId = 0;

    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      const remaining = Math.max(0, 1 - elapsed / UNDO_WINDOW_SECONDS);
      setProgress(remaining);
      if (remaining > 0) {
        rafId = requestAnimationFrame(tick);
      } else {
        clearLastCompleted();
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [lastCompleted, clearLastCompleted]);

  if (!lastCompleted) return null;

  const task = tasks.find((t) => t.id === lastCompleted.taskId);
  const title = task?.title ?? 'Task';

  const handleUndo = () => {
    // Restore the node to its prior position. In Part 8, this will
    // also restore `status` on the server.
    setNodeSettledPosition(lastCompleted.taskId, lastCompleted.priorPosition);
    clearLastCompleted();
  };

  return (
    <div className="undo-ghost" role="status" aria-live="polite">
      <div className="undo-ghost__content">
        <span className="undo-ghost__title">{title}</span>
        <span className="undo-ghost__meta">released</span>
      </div>
      <button
        type="button"
        className="undo-ghost__button"
        onClick={handleUndo}
      >
        Undo
      </button>
      <div
        className="undo-ghost__progress"
        style={{ transform: `scaleX(${String(progress)})` }}
      />
    </div>
  );
}
