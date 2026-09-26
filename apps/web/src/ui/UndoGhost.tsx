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
 * The countdown bar is driven imperatively via a ref, not React
 * state, so no re-renders happen during the countdown.
 *
 * Source: PRD F-407, UI/UX §58–§59.
 */

import { useEffect, useRef } from 'react';

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

  const progressBarRef = useRef<HTMLDivElement>(null);

  // Drive the countdown bar imperatively. No React state, so no
  // re-renders during the 5-second window.
  useEffect(() => {
    if (!lastCompleted) return;

    const start = performance.now();
    let rafId = 0;

    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      const remaining = Math.max(0, 1 - elapsed / UNDO_WINDOW_SECONDS);

      const bar = progressBarRef.current;
      if (bar) {
        bar.style.transform = `scaleX(${String(remaining)})`;
      }

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
      <div ref={progressBarRef} className="undo-ghost__progress" />
    </div>
  );
}
