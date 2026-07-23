'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sparkles } from '@react-three/drei';
import { PCFShadowMap } from 'three';
import { SceneEnvironment } from './switchboard/SceneEnvironment';
import { Switchboard } from './switchboard/Switchboard';
import { useSwitchboardMaterials } from './switchboard/materials';

interface HeroSceneCanvasProps {
  active?: boolean;
  /** When false, orbit is off and the canvas ignores pointer — page can scroll */
  controlsEnabled?: boolean;
}

function Scene({ controlsEnabled }: { controlsEnabled: boolean }) {
  const materials = useSwitchboardMaterials();
  return (
    <>
      <SceneEnvironment materials={materials} />
      <Switchboard />

      {/* Workshop dust + a cooler secondary mote layer */}
      <Sparkles
        count={36}
        scale={[4.8, 3.4, 2.6]}
        size={2.4}
        speed={0.28}
        opacity={0.4}
        color="#f97316"
        position={[0.1, -0.1, 0.4]}
      />
      <Sparkles
        count={18}
        scale={[3.6, 2.4, 1.8]}
        size={1.6}
        speed={0.15}
        opacity={0.22}
        color="#fdba74"
        position={[0.4, 0.2, 0.55]}
      />

      <OrbitControls
        makeDefault
        enabled={controlsEnabled}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        enableZoom={controlsEnabled}
        enableRotate={controlsEnabled}
        zoomToCursor={false}
        minDistance={3.0}
        maxDistance={7.0}
        minPolarAngle={Math.PI * 0.3}
        maxPolarAngle={Math.PI * 0.58}
        minAzimuthAngle={-Math.PI * 0.4}
        maxAzimuthAngle={Math.PI * 0.32}
        target={[0.05, -0.15, 0.1]}
      />
    </>
  );
}

export default function HeroSceneCanvas({
  active = true,
  controlsEnabled = false,
}: HeroSceneCanvasProps) {
  return (
    <Canvas
      camera={{ position: [2.6, 0.35, 5.2], fov: 34, near: 0.1, far: 40 }}
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'demand'}
      className={`!absolute inset-0 h-full w-full ${controlsEnabled ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
      shadows={{ type: PCFShadowMap }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.shadowMap.type = PCFShadowMap;
      }}
    >
      <Scene controlsEnabled={controlsEnabled} />
    </Canvas>
  );
}
