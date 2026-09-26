/**
 * Orbit — Root application component.
 *
 * Gates on auth: if not signed in, show the sign-in screen over
 * a faint version of the scene. If signed in, show the full
 * interactive scene.
 *
 * Reads tasks from the task store. Mounts the EditPanelTracker
 * inside the Canvas (for 3D projection) and the EditPanel outside
 * the Canvas (for HTML rendering).
 */

import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';

import { useAuth } from '@/auth/useAuth';
import { SignInScreen } from '@/auth/SignInScreen';
import { ChoreographyTicker } from '@/choreography';
import { CameraRig, useCameraKeyboard } from '@/camera';
import { CAMERA } from '@/design';
import { InteractionHandler, useKeyboardNavigation } from '@/input';
import {
  CompletionZone,
  Core,
  DissolveParticles,
  Dust,
  Floor,
  Fog,
  Lighting,
  PostProcessing,
  Rings,
  SettleToast,
  Sky,
  TaskNode,
  ZoneProjection,
} from '@/scene';
import { useInteractionStore } from '@/state/interaction';
import { useTaskStore } from '@/state/tasks';
import { useTasks } from '@/data/queries';
import { EditPanel, EditPanelTracker } from '@/ui/EditPanel';
import { UndoGhost } from '@/ui/UndoGhost';

import './App.css';

export default function App() {
  const { session, loading } = useAuth();

  useCameraKeyboard();
  useKeyboardNavigation();

  const tasks = useTaskStore((s) => s.tasks);
  useTasks();
  const setNodeList = useInteractionStore((s) => s.setNodeList);
  const pruneNodeSettledPositions = useInteractionStore(
    (s) => s.pruneNodeSettledPositions,
  );

  useEffect(() => {
    const ids = tasks.map((t) => t.id);
    const positions: Record<string, [number, number, number]> = {};
    for (const task of tasks) {
      if (task.orbitAngle === null || task.orbitRadius === null) continue;
      positions[task.id] = [
        Math.cos(task.orbitAngle) * task.orbitRadius,
        0,
        Math.sin(task.orbitAngle) * task.orbitRadius,
      ];
    }
    setNodeList(ids, positions);
    pruneNodeSettledPositions(ids);
  }, [tasks, setNodeList, pruneNodeSettledPositions]);

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

        {tasks.map((task) => {
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
              ring={task.ring}
            />
          );
        })}

        <CompletionZone />
        <ZoneProjection />
        <DissolveParticles />
        <SettleToast />

        <Dust />
        <PostProcessing />
        <ChoreographyTicker />
        <EditPanelTracker />
      </Canvas>

      {!loading && !session && <SignInScreen />}

      <EditPanel />
      <UndoGhost />
    </div>
  );
}
