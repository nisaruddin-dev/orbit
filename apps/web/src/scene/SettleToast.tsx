/**
 * @module scene/SettleToast
 *
 * A single line of 3D text that appears above the Core after a
 * task is released. Shows the task's title. Fades in, holds, and
 * fades out with the 5-second undo window.
 *
 * Per UI/UX §49: the message must remain secondary. It names the
 * released task. It does not celebrate. No badges, no counts, no
 * exclamation marks.
 *
 * The toast is billboarded to face the camera at all times.
 */

import { useMemo } from 'react';
import { Billboard, Text } from '@react-three/drei';
import { Color } from 'three';

import { TEXT } from '@/design';
import { useInteractionStore } from '@/state/interaction';
import { useTaskStore } from '@/state/tasks';

/** Height above the Core where the toast floats. */
const TOAST_Y = 2.5;

/** How wide the toast can grow before wrapping. */
const TOAST_MAX_WIDTH = 6;

export function SettleToast() {
  const lastCompleted = useInteractionStore((s) => s.lastCompleted);
  const tasks = useTaskStore((s) => s.tasks);

  const toastColor = useMemo(() => new Color(TEXT.primary), []);

  if (!lastCompleted) return null;

  const task = tasks.find((t) => t.id === lastCompleted.taskId);
  if (!task) return null;

  return (
    <Billboard position={[0, TOAST_Y, 0]}>
      <Text
        fontSize={0.32}
        color={toastColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.008}
        outlineColor="#0E0F16"
        maxWidth={TOAST_MAX_WIDTH}
      >
        {task.title}
      </Text>
    </Billboard>
  );
}
