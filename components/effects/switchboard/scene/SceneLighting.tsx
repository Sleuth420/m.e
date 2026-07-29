'use client';

import { Environment } from '@react-three/drei';

const BG = '#141210';

/** Atmosphere + lights only — no geometry. */
export function SceneLighting() {
  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 7.5, 22]} />

      <ambientLight intensity={0.32} />
      <hemisphereLight args={['#44505c', '#1c1917', 0.45]} />

      <directionalLight
        position={[4.2, 6.2, 5.2]}
        intensity={1.55}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={24}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.00025}
        color="#fff7ed"
      />
      <directionalLight position={[-3.8, 2.4, 2.8]} intensity={0.38} color="#cbd5e1" />
      <directionalLight position={[-1.2, 1.8, -3.5]} intensity={0.4} color="#e7e5e4" />
      <pointLight position={[0.15, 2.4, 3.2]} intensity={0.45} color="#f5f0e8" distance={14} decay={2} />
      <pointLight position={[-2.4, 0.4, 1.6]} intensity={0.28} color="#94a3b8" distance={8} decay={2} />

      <Environment preset="warehouse" environmentIntensity={0.38} />
    </>
  );
}
