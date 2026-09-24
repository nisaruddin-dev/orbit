/**
 * Orbit — Root application component.
 */

import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ChoreographyTicker } from '@/choreography';

import { CameraRig, useCameraKeyboard } from '@/camera';
import { CAMERA } from '@/design';
import { InteractionHandler, useKeyboardNavigation } from '@/input';
import {
  Core,
  Dust,
  Floor,
  Fog,
  Lighting,
  PostProcessing,
  Rings,
  Sky,
  TaskNode,
} from '@/scene';
import { useInteractionStore } from '@/state/interaction';
import type { Task } from '@orbit/shared';

/**
 * Mock tasks for development. These conform to the canonical
 * Task interface. They will be replaced by real data from the
 * backend in Part 8.
 */
const NOW = new Date().toISOString();

const MOCK_TASKS: Task[] = [
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

export default function App() {
  useCameraKeyboard();
  useKeyboardNavigation();

  const setNodeList = useInteractionStore((s) => s.setNodeList);

  // Register the node list once. Positions are derived from the
  // same math the render loop uses.
  useEffect(() => {
    const ids = MOCK_TASKS.map((t) => t.id);
    const positions: Record<string, [number, number, number]> = {};
    for (const task of MOCK_TASKS) {
      if (task.orbitAngle === null || task.orbitRadius === null) continue;
      positions[task.id] = [
        Math.cos(task.orbitAngle) * task.orbitRadius,
        0,
        Math.sin(task.orbitAngle) * task.orbitRadius,
      ];
    }
    setNodeList(ids, positions);
  }, [setNodeList]);

  return (
    <div className="app">
      <Canvas
        camera={{
          position: [CAMERA.orbit.x, CAMERA.orbit.y, CAMERA.orbit.z],
          fov: CAMERA.fov,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          toneMapping: 4,
          toneMappingExposure: 1.1,
        }}
      >
        <CameraRig />
        <InteractionHandler />

        <Sky />
        <Fog />
        <Lighting />

        <Floor />
        <Core />
        <Rings />

        {MOCK_TASKS.map((task) => {
          if (task.orbitAngle === null || task.orbitRadius === null) return null;
          const x = Math.cos(task.orbitAngle) * task.orbitRadius;
          const z = Math.sin(task.orbitAngle) * task.orbitRadius;
          return (
            <TaskNode
              key={task.id}
              id={task.id}
              priority={task.priority}
              position={[x, 0, z]}
              title={task.title}
            />
          );
        })}

        <Dust />
        <PostProcessing />
	<ChoreographyTicker />
      </Canvas>
    </div>
  );
}
