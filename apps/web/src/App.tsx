/**
 * Orbit — Root application component.
 *
 * Mounts the 3D Canvas with the twilight environment, four-light
 * rig, ambient dust particles, and camera rig.
 */

import { Canvas } from '@react-three/fiber';

import { CameraRig } from '@/camera';
import { CAMERA, ENVIRONMENT } from '@/design';
import { Dust, Floor, Fog, Lighting, Sky } from '@/scene';

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
        <Dust />
      </Canvas>
    </div>
  );
}
