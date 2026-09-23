/**
 * Orbit — Root application component.
 *
 * Mounts the 3D Canvas with the twilight environment, four-light
 * rig, ambient dust particles, camera rig, Core, rings, mock task
 * nodes, and post-processing.
 */

import { Canvas } from '@react-three/fiber';

import { CameraRig } from '@/camera';
import { CAMERA, ENVIRONMENT } from '@/design';
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

/**
 * Mock task data for verification.
 */
const MOCK_NODES = [
  { angle: 0, radius: 4, priority: 2 as const, title: 'Review PR feedback' },
  { angle: Math.PI / 2, radius: 4, priority: 1 as const, title: 'Team standup' },
  { angle: Math.PI / 4, radius: 7, priority: 1 as const, title: 'Write design doc' },
  { angle: Math.PI, radius: 7, priority: 0 as const, title: 'Refactor auth module' },
  { angle: (3 * Math.PI) / 4, radius: 10, priority: 0 as const, title: 'Learn Rust' },
] as const;

export default function App() {
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
        <CameraRig target={[0, 2, 0]} />

        <Sky />
        <Fog />
        <Lighting />

        <Floor />
        <Core />
        <Rings />

        {MOCK_NODES.map((node, index) => {
          const x = Math.cos(node.angle) * node.radius;
          const z = Math.sin(node.angle) * node.radius;
          return (
            <TaskNode
              key={index}
              priority={node.priority}
              position={[x, 0, z]}
              title={node.title}
            />
          );
        })}

        <Dust />

        {/* Post-processing must be the LAST child of the Canvas.
            It processes the complete scene. */}
        <PostProcessing />
      </Canvas>
    </div>
  );
}
