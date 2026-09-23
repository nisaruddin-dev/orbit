/**
 * Orbit — Root application component.
 *
 * Mounts the 3D Canvas with the twilight environment.
 *
 * Temporary: two placeholder lights will be replaced by the
 * four-light rig in Sub-step 5.7.
 */

import { useFrame, useThree } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';

import { CAMERA, ENVIRONMENT } from '@/design';
import { Fog, Floor, Sky } from '@/scene';

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
      >
        <FixedLookAt target={[0, 2, 0]} />

        <Sky />
        <Fog />

        {/* Temporary lights — replaced by the four-light rig in 5.7 */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} />
        <directionalLight
          position={[-5, 4, -5]}
          intensity={0.5}
          color="#8AA0FF"
        />

        <Floor />
      </Canvas>
    </div>
  );
}
