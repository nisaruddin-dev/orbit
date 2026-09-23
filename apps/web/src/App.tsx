/**
 * Orbit — Root application component.
 *
 * Mounts the 3D Canvas. Sub-step 5.3 uses a placeholder cube to verify
 * that R3F is working. The cube will be removed in Sub-step 5.4 when
 * the sky is added.
 */

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import { ENVIRONMENT, CAMERA } from '@/design';

/**
 * Temporary verification cube. Remove in Sub-step 5.4.
 */
function PlaceholderCube() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#7BD3EA" />
    </mesh>
  );
}

export default function App() {
  return (
    <div className="app" style={{ background: ENVIRONMENT.skyTop }}>
      <Canvas
        camera={{
          position: [CAMERA.orbit.x, CAMERA.orbit.y, CAMERA.orbit.z],
          fov: CAMERA.fov,
        }}
      >
        {/* Temporary light so the cube is visible */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />

        {/* Placeholder cube — remove in Sub-step 5.4 */}
        <PlaceholderCube />

        {/* OrbitControls lets us spin the camera with mouse drag for verification */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}
