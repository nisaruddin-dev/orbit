/**
 * Orbit — Root application component.
 *
 * Mounts the 3D Canvas with the twilight environment, four-light
 * rig, ambient dust particles, camera rig, Core, rings, and
 * mock task nodes.
 *
 * Mock nodes will be replaced by real data in a later chunk.
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
  Rings,
  Sky,
  TaskNode,
} from '@/scene';

/**
 * Mock task data for verification.
 *
 * Angles are in radians, measured from +X axis (east).
 * Positions compute as:
 *   x = cos(angle) * radius
 *   z = sin(angle) * radius
 */
const MOCK_NODES = [
  // Today ring (radius 4)
  { angle: 0, radius: 4, priority: 2 as const, title: 'Review PR feedback' },
  { angle: Math.PI / 2, radius: 4, priority: 1 as const, title: 'Team standup' },

  // Week ring (radius 7)
  { angle: Math.PI / 4, radius: 7, priority: 1 as const, title: 'Write design doc' },
  { angle: Math.PI, radius: 7, priority: 0 as const, title: 'Refactor auth module' },

  // Someday ring (radius 10)
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
      </Canvas>
    </div>
  );
}
