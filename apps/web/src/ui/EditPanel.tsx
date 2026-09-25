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
 *   7.5c-3a: notes (this task)
 *   7.5c-3b: priority, ring
 *   7.5c-3c: due date, recurrence
 *
 * Autosave:
 *   - on input blur
 *   - after 800ms of no typing
 *   - when the panel closes
 *
 * Esc closes the panel. Any pending value is saved first.
 *
 * Source: UI/UX §53–§55, §125, TRD §121–§122.
 */

import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { Camera } from 'three';

import { useEditingStore } from '@/state/editing';
import { useInteractionStore } from '@/state/interaction';
import { useTaskStore } from '@/state/tasks';
import { dispatchIntent } from '@/input';

const AUTOSAVE_DEBOUNCE_MS = 800;
const PANEL_OFFSET_X = 40;
const PANEL_WIDTH = 320;

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
 * Inside-Canvas tracker. Runs every frame, projects the focused
 * node's world position to screen coordinates, and writes them
 * to the editing store.
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

/**
 * Props for the inner panel content.
 */
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

  // Read the live task so we can compare drafts against the
  // current stored value, not a stale prop.
  const currentTitle = useTaskStore(
    (s) => s.tasks.find((t) => t.id === taskId)?.title ?? initialTitle,
  );
  const currentNotes = useTaskStore(
    (s) => s.tasks.find((t) => t.id === taskId)?.notes ?? initialNotes,
  );

  const [titleDraft, setTitleDraft] = useState<string>(initialTitle);
  const [notesDraft, setNotesDraft] = useState<string>(initialNotes);

  const titleDebounceRef = useRef<number | null>(null);
  const notesDebounceRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the title input on mount.
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

  // Cleanup debounces on unmount.
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
      </div>
    </div>
  );
}

/**
 * Outside-Canvas panel. Reads the editing node ID and the task
 * from the stores, then renders the inner panel with a `key` so
 * a task change forces a fresh mount.
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
