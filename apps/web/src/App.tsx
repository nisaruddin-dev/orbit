/**
 * Orbit — Root application component.
 *
 * Mounts the 3D Canvas with the twilight environment, four-light
 * rig, and ambient dust particles.
 */

import { Canvas, useFrame, useThree } from '@react-three/fiber';

import { CAMERA, ENVIRONMENT } from '@/design';
import { Dust, Floor, Fog, Lighting, Sky } from '@/scene';

/**
 * Points the camera at a fixed target. Runs every frame so R3F's
 * internal camera updates don't override our intent.
 *
 * Replaced by the full camera state machine in Sub-step 5.9.
 */
function FixedLookAt({ target }: { target: [number, number, number] }) {
  const camera = useThree((state) => state.camera);

  useFrame(() => {
    camera.lookAt(target[0], target[1], target[2]);
  });

  return null;
}

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
        <FixedLookAt target={[0, 2, 0]} />

        <Sky />
        <Fog />
        <Lighting />

        <Floor />
        <Dust />
      </Canvas>
    </div>
  );
}
