/**
 * @module ui/EditPanel
 *
 * The in-world edit panel. An HTML overlay positioned over the 3D
 * scene, tracking the focused node's screen position.
 *
 * The panel has two parts:
 *   - `EditPanelTracker` runs INSIDE the Canvas. It projects the
 *     focused node's world position to screen coordinates every
 *     frame and writes them to the editing store.
 *   - `EditPanel` runs OUTSIDE the Canvas. It reads the screen
 *     position from the store and renders the HTML panel.
 *
 * Fields:
 *   7.5c-2: title
 *   7.5c-3a: notes
 *   7.5c-3b: priority, ring (this task)
 *   7.5c-3c: due date, recurrence
 *
 * Autosave:
 *   - text fields: on blur, after 800ms of no typing, on Esc
 *   - choice fields: immediately on click
 *
 * Ring movement (the node physically moving to the new ring) is
 * deferred to a later task. This task only writes the value.
 *
 * Esc closes the panel. Any pending value is saved first.
 *
 * Source: UI/UX §53–§55, §92, §125, TRD §121–§122.
 */

import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { Camera } from 'three';

import { ACCENT } from '@/design';
import { useEditingStore } from '@/state/editing';
import { useInteractionStore } from '@/state/interaction';
import { useTaskStore } from '@/state/tasks';
import { dispatchIntent } from '@/input';
import type { TaskPriority, TaskRing } from '@orbit/shared';

const AUTOSAVE_DEBOUNCE_MS = 800;
const PANEL_OFFSET_X = 40;
const PANEL_WIDTH = 320;

/** Priority values in display order. */
const PRIORITY_VALUES: TaskPriority[] = [0, 1, 2, 3];

/** Priority colors, matching TaskNode. */
const PRIORITY_COLORS: Record<TaskPriority, string> = {
  0: ACCENT.dormant,
  1: ACCENT.active,
  2: ACCENT.focus,
  3: ACCENT.urgent,
};

/** Priority labels for accessibility. */
const PRIORITY_LABELS: Record<TaskPriority, string> = {
  0: 'Dormant',
  1: 'Normal',
  2: 'Important',
  3: 'High attention',
};

/** Ring values in display order. */
const RING_VALUES: TaskRing[] = ['today', 'week', 'someday'];

/** Ring labels. */
const RING_LABELS: Record<TaskRing, string> = {
  today: 'Today',
  week: 'This Week',
  someday: 'Someday',
};

/**
 * Projects a world position to screen coordinates.
 */
function worldToScreen(
  world: [number, number, number],
  camera: Camera,
  width: number,
  height: number,
): [number, number] | null {
  const v = new Vector3(world[0], world[1], world[2]);
  v.project(camera);
  if (v.z > 1) return null;
  const x = (v.x + 1) * 0.5 * width;
  const y = (-v.y + 1) * 0.5 * height;
  return [x, y];
}

/**
 * Inside-Canvas tracker.
 */
export function EditPanelTracker() {
  const editingNodeId = useEditingStore((s) => s.editingNodeId);
  const setScreenPos = useEditingStore((s) => s.setScreenPos);
  const nodeSettledPositions = useInteractionStore(
    (s) => s.nodeSettledPositions,
  );
  const { camera, size } = useThree();

  useFrame(() => {
    if (!editingNodeId) return;
    const world = nodeSettledPositions[editingNodeId];
    if (!world) return;
    const projected = worldToScreen(world, camera, size.width, size.height);
    setScreenPos(projected);
  });

  return null;
}

interface EditPanelInnerProps {
  taskId: string;
  initialTitle: string;
  initialNotes: string;
}

function EditPanelInner({
  taskId,
  initialTitle,
  initialNotes,
}: EditPanelInnerProps) {
  const screenPos = useEditingStore((s) => s.screenPos);
  const closeEditor = useEditingStore((s) => s.closeEditor);
  const updateTask = useTaskStore((s) => s.updateTask);

  const currentTitle = useTaskStore(
    (s) => s.tasks.find((t) => t.id === taskId)?.title ?? initialTitle,
  );
  const currentNotes = useTaskStore(
    (s) => s.tasks.find((t) => t.id === taskId)?.notes ?? initialNotes,
  );
  const currentPriority = useTaskStore(
    (s) => s.tasks.find((t) => t.id === taskId)?.priority ?? 1,
  );
  const currentRing = useTaskStore(
    (s) => s.tasks.find((t) => t.id === taskId)?.ring ?? 'today',
  );

  const [titleDraft, setTitleDraft] = useState<string>(initialTitle);
  const [notesDraft, setNotesDraft] = useState<string>(initialNotes);

  const titleDebounceRef = useRef<number | null>(null);
  const notesDebounceRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const saveTitle = (value: string) => {
    if (value !== currentTitle) {
      updateTask(taskId, 'title', value);
    }
  };

  const saveNotes = (value: string) => {
    if (value !== currentNotes) {
      updateTask(taskId, 'notes', value);
    }
  };

  const handleTitleChange = (value: string) => {
    setTitleDraft(value);
    if (titleDebounceRef.current !== null) {
      window.clearTimeout(titleDebounceRef.current);
    }
    titleDebounceRef.current = window.setTimeout(() => {
      saveTitle(value);
      titleDebounceRef.current = null;
    }, AUTOSAVE_DEBOUNCE_MS);
  };

  const handleNotesChange = (value: string) => {
    setNotesDraft(value);
    if (notesDebounceRef.current !== null) {
      window.clearTimeout(notesDebounceRef.current);
    }
    notesDebounceRef.current = window.setTimeout(() => {
      saveNotes(value);
      notesDebounceRef.current = null;
    }, AUTOSAVE_DEBOUNCE_MS);
  };

  const handleTitleBlur = () => {
    if (titleDebounceRef.current !== null) {
      window.clearTimeout(titleDebounceRef.current);
      titleDebounceRef.current = null;
    }
    saveTitle(titleDraft);
  };

  const handleNotesBlur = () => {
    if (notesDebounceRef.current !== null) {
      window.clearTimeout(notesDebounceRef.current);
      notesDebounceRef.current = null;
    }
    saveNotes(notesDraft);
  };

  const handlePriorityClick = (value: TaskPriority) => {
    if (value !== currentPriority) {
      updateTask(taskId, 'priority', value);
    }
  };

  const handleRingClick = (value: TaskRing) => {
    if (value !== currentRing) {
      updateTask(taskId, 'ring', value);
    }
  };

  // Esc closes the panel and flushes any pending saves.
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (titleDebounceRef.current !== null) {
          window.clearTimeout(titleDebounceRef.current);
          titleDebounceRef.current = null;
        }
        if (notesDebounceRef.current !== null) {
          window.clearTimeout(notesDebounceRef.current);
          notesDebounceRef.current = null;
        }
        saveTitle(titleDraft);
        saveNotes(notesDraft);
        closeEditor();
        dispatchIntent({ type: 'CANCEL' });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, titleDraft, notesDraft, currentTitle, currentNotes]);

  useEffect(() => {
    return () => {
      if (titleDebounceRef.current !== null) {
        window.clearTimeout(titleDebounceRef.current);
      }
      if (notesDebounceRef.current !== null) {
        window.clearTimeout(notesDebounceRef.current);
      }
    };
  }, []);

  if (!screenPos) return null;

  const [nodeX, nodeY] = screenPos;
  const flip = nodeX + PANEL_OFFSET_X + PANEL_WIDTH > window.innerWidth;
  const panelX = flip
    ? nodeX - PANEL_OFFSET_X - PANEL_WIDTH
    : nodeX + PANEL_OFFSET_X;
  const panelY = nodeY - 60;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${String(panelX)}px`,
        top: `${String(panelY)}px`,
        width: `${String(PANEL_WIDTH)}px`,
        pointerEvents: 'auto',
      }}
    >
      <div className="edit-panel">
        <div className="edit-panel__field">
          <label className="edit-panel__label" htmlFor="edit-panel-title">
            Title
          </label>
          <input
            id="edit-panel-title"
            ref={inputRef}
            className="edit-panel__input"
            type="text"
            value={titleDraft}
            onChange={(e) => {
              handleTitleChange(e.target.value);
            }}
            onBlur={handleTitleBlur}
            maxLength={200}
          />
        </div>

        <div className="edit-panel__field">
          <label className="edit-panel__label" htmlFor="edit-panel-notes">
            Notes
          </label>
          <textarea
            id="edit-panel-notes"
            className="edit-panel__textarea"
            value={notesDraft}
            onChange={(e) => {
              handleNotesChange(e.target.value);
            }}
            onBlur={handleNotesBlur}
            rows={4}
            maxLength={10000}
          />
        </div>

        <div className="edit-panel__field">
          <span className="edit-panel__label">Priority</span>
          <div
            className="edit-panel__swatch-row"
            role="group"
            aria-label="Priority"
          >
            {PRIORITY_VALUES.map((value) => {
              const isActive = value === currentPriority;
              return (
                <button
                  key={value}
                  type="button"
                  className={
                    isActive
                      ? 'edit-panel__swatch edit-panel__swatch--active'
                      : 'edit-panel__swatch'
                  }
                  style={{ backgroundColor: PRIORITY_COLORS[value] }}
                  aria-pressed={isActive}
                  aria-label={PRIORITY_LABELS[value]}
                  title={PRIORITY_LABELS[value]}
                  onClick={() => {
                    handlePriorityClick(value);
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="edit-panel__field">
          <span className="edit-panel__label">Ring</span>
          <div
            className="edit-panel__button-row"
            role="group"
            aria-label="Ring"
          >
            {RING_VALUES.map((value) => {
              const isActive = value === currentRing;
              return (
                <button
                  key={value}
                  type="button"
                  className={
                    isActive
                      ? 'edit-panel__button edit-panel__button--active'
                      : 'edit-panel__button'
                  }
                  aria-pressed={isActive}
                  onClick={() => {
                    handleRingClick(value);
                  }}
                >
                  {RING_LABELS[value]}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Outside-Canvas panel.
 */
export function EditPanel() {
  const editingNodeId = useEditingStore((s) => s.editingNodeId);
  const task = useTaskStore((s) =>
    editingNodeId ? s.tasks.find((t) => t.id === editingNodeId) : undefined,
  );

  if (!editingNodeId || !task) return null;

  return (
    <EditPanelInner
      key={task.id}
      taskId={task.id}
      initialTitle={task.title}
      initialNotes={task.notes}
    />
  );
}
