'use client';

import { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { PCFShadowMap } from 'three';
import { preloadModulePaths } from './switchboard/assets/module-assets';
import { SceneEnvironment } from './switchboard/SceneEnvironment';
import { Switchboard } from './switchboard/Switchboard';
import { useSwitchboardMaterials } from './switchboard/materials';
import { CanvasPointerGate } from './switchboard/scene/CanvasPointerGate';
import { SceneEffects } from './switchboard/scene/SceneEffects';
import { SceneOrbit } from './switchboard/scene/SceneOrbit';

for (const path of preloadModulePaths()) {
  useGLTF.preload(path);
}

interface HeroSceneCanvasProps {
  active?: boolean;
  /** When false, orbit is off and the canvas ignores pointer — page can scroll */
  controlsEnabled?: boolean;
}

function SwitchboardScene({ controlsEnabled }: { controlsEnabled: boolean }) {
  const materials = useSwitchboardMaterials();

  return (
    <>
      <CanvasPointerGate controlsEnabled={controlsEnabled} />
      <SceneEnvironment materials={materials} />
      <Suspense fallback={null}>
        <Switchboard />
      </Suspense>
      <SceneEffects />
      <SceneOrbit enabled={controlsEnabled} />
    </>
  );
}

export default function HeroSceneCanvas({
  active = true,
  controlsEnabled = false,
}: HeroSceneCanvasProps) {
  return (
    <Canvas
      camera={{ position: [1.85, 0.35, 3.85], fov: 36, near: 0.1, far: 50 }}
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'demand'}
      className={`!absolute inset-0 !h-full !w-full !max-w-full ${
        controlsEnabled ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
      style={{
        pointerEvents: controlsEnabled ? 'auto' : 'none',
        touchAction: controlsEnabled ? 'none' : 'pan-y',
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        display: 'block',
      }}
      shadows={{ type: PCFShadowMap }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.shadowMap.type = PCFShadowMap;
        gl.domElement.style.pointerEvents = 'none';
        gl.domElement.style.touchAction = 'pan-y';
        gl.domElement.style.display = 'block';
        gl.domElement.style.width = '100%';
        gl.domElement.style.height = '100%';
      }}
    >
      <SwitchboardScene controlsEnabled={controlsEnabled} />
    </Canvas>
  );
}
