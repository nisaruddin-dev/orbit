/**
 * Orbit — Root application component.
 *
 * Mounts the 3D Canvas with the twilight environment.
 */

import { Canvas } from '@react-three/fiber';

import { CAMERA, ENVIRONMENT } from '@/design';
import { Sky } from '@/scene';

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
      </Canvas>
    </div>
  );
}
