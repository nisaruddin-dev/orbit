/**
 * Orbit — Root application component.
 */

import { Canvas } from '@react-three/fiber';

import { CameraRig, useCameraKeyboard } from '@/camera';
import { CAMERA, ENVIRONMENT } from '@/design';
import { InteractionHandler } from '@/input';
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

const MOCK_NODES = [
  { id: 'task-1', angle: 0, radius: 4, priority: 2 as const, title: 'Review PR feedback' },
  { id: 'task-2', angle: Math.PI / 2, radius: 4, priority: 1 as const, title: 'Team standup' },
  { id: 'task-3', angle: Math.PI / 4, radius: 7, priority: 1 as const, title: 'Write design doc' },
  { id: 'task-4', angle: Math.PI, radius: 7, priority: 0 as const, title: 'Refactor auth module' },
  { id: 'task-5', angle: (3 * Math.PI) / 4, radius: 10, priority: 0 as const, title: 'Learn Rust' },
] as const;

export default function App() {
  useCameraKeyboard();

  return (
    <div className="app" style={{ background: ENVIRONMENT.skyTop }}>
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

        {MOCK_NODES.map((node) => {
          const x = Math.cos(node.angle) * node.radius;
          const z = Math.sin(node.angle) * node.radius;
          return (
            <TaskNode
              key={node.id}
              id={node.id}
              priority={node.priority}
              position={[x, 0, z]}
              title={node.title}
            />
          );
        })}

        <Dust />
        <PostProcessing />
      </Canvas>
    </div>
  );
}
