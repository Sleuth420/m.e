'use client';

import { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { PCFShadowMap } from 'three';
import { preloadModulePaths } from './switchboard/assets/module-assets';
import { SwitchboardProvider } from './switchboard/SwitchboardContext';
import { CanvasPointerGate } from './switchboard/scene/CanvasPointerGate';
import { CoverLicensePrompt } from './switchboard/learning-room/CoverLicensePrompt';
import { GameInputProvider } from './switchboard/learning-room/GameInputContext';
import { LearningHud } from './switchboard/learning-room/LearningHud';
import { LearningScene } from './switchboard/learning-room/LearningScene';
import { MobileControls } from './switchboard/learning-room/MobileControls';
import { ShockOverlay } from './switchboard/learning-room/ShockOverlay';
import { preloadRoomModelPaths } from './switchboard/learning-room/room-assets';
import { loadKeptGltf } from './switchboard/learning-room/useKeptGltf';
import { IDLE_CAMERA } from './switchboard/learning-room/room-layout';

for (const path of preloadModulePaths()) {
  useGLTF.preload(path);
}
for (const path of preloadRoomModelPaths()) {
  void loadKeptGltf(path);
}

interface HeroSceneCanvasProps {
  active?: boolean;
  controlsEnabled?: boolean;
  onExit?: () => void;
}

function LearningCanvasScene({
  controlsEnabled,
  onExit,
}: {
  controlsEnabled: boolean;
  onExit: () => void;
}) {
  return (
    <>
      <CanvasPointerGate controlsEnabled={controlsEnabled} />
      <LearningScene controlsEnabled={controlsEnabled} onExit={onExit} />
    </>
  );
}

export default function HeroSceneCanvas({
  active = true,
  controlsEnabled = false,
  onExit,
}: HeroSceneCanvasProps) {
  return (
    <SwitchboardProvider>
      <GameInputProvider>
        <Canvas
          camera={{
            position: [...IDLE_CAMERA.position],
            fov: 46,
            near: 0.04,
            far: 60,
          }}
          dpr={[1, 1.5]}
          frameloop={active ? 'always' : 'demand'}
          className={`!absolute inset-0 !h-full !w-full !max-w-full ${
            controlsEnabled ? 'cursor-pointer' : ''
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
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          onCreated={({ gl, camera }) => {
            gl.setClearColor(0xb8b8be, 1);
            gl.shadowMap.type = PCFShadowMap;
            gl.domElement.style.pointerEvents = 'none';
            gl.domElement.style.touchAction = 'pan-y';
            gl.domElement.style.display = 'block';
            gl.domElement.style.width = '100%';
            gl.domElement.style.height = '100%';
            camera.lookAt(IDLE_CAMERA.target[0], IDLE_CAMERA.target[1], IDLE_CAMERA.target[2]);
          }}
        >
          <Suspense fallback={null}>
            <LearningCanvasScene
              controlsEnabled={controlsEnabled}
              onExit={onExit ?? (() => undefined)}
            />
          </Suspense>
        </Canvas>
        <LearningHud visible={controlsEnabled} />
        <MobileControls visible={controlsEnabled} />
        <CoverLicensePrompt />
        <ShockOverlay />
      </GameInputProvider>
    </SwitchboardProvider>
  );
}
