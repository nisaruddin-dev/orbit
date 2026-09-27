/**
 * Orbit — Root application component.
 *
 * Gates on auth: if not signed in, show the sign-in screen over
 * a faint version of the scene. If signed in, show the full
 * interactive scene.
 *
 * Renders the Canvas only if WebGL is available. If it is not,
 * shows the semantic mirror as the primary interface instead.
 *
 * The Canvas and the UI overlays are wrapped in separate error
 * boundaries. A failure in one does not take down the other.
 *
 * Source: System Architecture §50 (WebGL Failure),
 * §67 (Error Boundaries), TRD §93.
 */

import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';

import { useAuth } from '@/auth/useAuth';
import { SignInScreen } from '@/auth/SignInScreen';
import { SemanticMirror } from '@/a11y/SemanticMirror';
import { useWebGLSupport } from '@/a11y/useWebGLSupport';
import { ChoreographyTicker } from '@/choreography';
import { CameraRig, useCameraKeyboard } from '@/camera';
import { CAMERA } from '@/design';
import { InteractionHandler, useKeyboardNavigation } from '@/input';
import {
  Aurora,
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
import { useSync } from '@/data/sync';
import { EditPanel, EditPanelTracker } from '@/ui/EditPanel';
import { ErrorBoundary } from '@/ui/ErrorBoundary';
import { AppFallback, SceneFallback } from '@/ui/Fallback';
import { UndoGhost } from '@/ui/UndoGhost';
import { NetworkIndicator } from '@/ui/NetworkIndicator';

import './App.css';

export default function App() {
  const { session, loading } = useAuth();
  const webgl = useWebGLSupport();

  useCameraKeyboard();
  useKeyboardNavigation();
  useSync();

  const tasks = useTaskStore((s) => s.tasks);
  const setNodeList = useInteractionStore((s) => s.setNodeList);
  const pruneNodeSettledPositions = useInteractionStore(
    (s) => s.pruneNodeSettledPositions,
  );

  useTasks();

  useEffect(() => {
    const visible = tasks.filter((t) => t.status !== 'archived');
    const ids = visible.map((t) => t.id);
    const positions: Record<string, [number, number, number]> = {};
    for (const task of visible) {
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

  // If WebGL is unsupported, the mirror becomes the primary
  // interface. The scene is not rendered.
  if (webgl === 'unsupported') {
    return (
      <ErrorBoundary label="app" fallback={<AppFallback />}>
        <div className="app app--fallback">
          <SemanticMirror visible />
          {!loading && !session && <SignInScreen />}
        </div>
      </ErrorBoundary>
    );
  }

  // WebGL supported. Render the full scene with the mirror as
  // the accessible counterpart.
  return (
    <ErrorBoundary label="app" fallback={<AppFallback />}>
      <div className="app">
        <ErrorBoundary label="scene" fallback={<SceneFallback />}>
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
            <Aurora />

            {tasks.map((task) => {
              if (task.status === 'archived') return null;
              if (task.orbitAngle === null || task.orbitRadius === null)
                return null;
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
        </ErrorBoundary>

        <ErrorBoundary label="ui" fallback={null}>
          {!loading && !session && <SignInScreen />}

          <EditPanel />
          <UndoGhost />
          <NetworkIndicator />
        </ErrorBoundary>

        <SemanticMirror />
      </div>
    </ErrorBoundary>
  );
}
