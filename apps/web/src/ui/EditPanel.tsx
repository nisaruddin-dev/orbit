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
 * The store is the bridge. No component reads R3F context from
 * both sides.
 *
 * In 7.5c-2, only the title field is editable. Notes, priority,
 * ring, due date, and recurrence come in 7.5c-3 and later.
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
 * Props for the inner panel content. The `key` prop on this
 * component is the task ID, which forces a fresh mount when the
 * focused task changes — avoiding the setState-in-effect anti-pattern.
 */
interface EditPanelInnerProps {
  taskId: string;
  initialTitle: string;
}

function EditPanelInner({ taskId, initialTitle }: EditPanelInnerProps) {
  const screenPos = useEditingStore((s) => s.screenPos);
  const closeEditor = useEditingStore((s) => s.closeEditor);
  const updateTask = useTaskStore((s) => s.updateTask);

  const [titleDraft, setTitleDraft] = useState<string>(initialTitle);
  const debounceRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input on mount.
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleBlur = () => {
    if (titleDraft !== initialTitle) {
      updateTask(taskId, 'title', titleDraft);
    }
  };

  const handleChange = (value: string) => {
    setTitleDraft(value);
    if (debounceRef.current !== null) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      updateTask(taskId, 'title', value);
      debounceRef.current = null;
    }, AUTOSAVE_DEBOUNCE_MS);
  };

  // Esc closes the panel and flushes any pending save.
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (titleDraft !== initialTitle) {
          updateTask(taskId, 'title', titleDraft);
        }
        closeEditor();
        dispatchIntent({ type: 'CANCEL' });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [taskId, titleDraft, initialTitle, updateTask, closeEditor]);

  // Cleanup debounce on unmount.
  useEffect(() => {
    return () => {
      if (debounceRef.current !== null) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, []);

  if (!screenPos) return null;

  const [nodeX, nodeY] = screenPos;
  const flip = nodeX + PANEL_OFFSET_X + PANEL_WIDTH > window.innerWidth;
  const panelX = flip
    ? nodeX - PANEL_OFFSET_X - PANEL_WIDTH
    : nodeX + PANEL_OFFSET_X;
  const panelY = nodeY - 40;

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
            handleChange(e.target.value);
          }}
          onBlur={handleBlur}
          maxLength={200}
        />
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
    />
  );
}
