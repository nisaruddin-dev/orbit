/**
 * Orbit — Root application component.
 *
 * Mounts the 3D Canvas with the twilight environment.
 *
 * Temporary: two placeholder lights will be replaced by the
 * four-light rig in Sub-step 5.7.
 */

import { Canvas } from '@react-three/fiber';

import { CAMERA, ENVIRONMENT } from '@/design';
import { Fog, Sky, Floor } from '@/scene';

export default function App() {
  return (
    <div className="app" style={{ background: ENVIRONMENT.skyTop }}>
      <Canvas
        camera={{
          position: [CAMERA.orbit.x, CAMERA.orbit.y, CAMERA.orbit.z],
          fov: CAMERA.fov,
        }}
      >
        <Sky />
        <Fog />

        {/* Temporary lights — replaced by the four-light rig in 5.7 */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 8, 5]} intensity={1.0} />

        <Floor />
      </Canvas>
    </div>
  );
}
