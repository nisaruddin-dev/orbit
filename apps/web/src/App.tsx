/**
 * Orbit — Root application component.
 *
 * Mounts the 3D Canvas with the twilight environment, four-light
 * rig, ambient dust particles, camera rig, Core, rings, and one
 * mock task node (for verification).
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
          toneMapping: 4, // ACESFilmicToneMapping
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

        {/* Mock task node for verification. Positioned on the
            Today ring at angle 0 (positive X axis). */}
        <TaskNode priority={1} position={[4, 0, 0]} />

        <Dust />
      </Canvas>
    </div>
  );
}
