'use client';

import { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows, OrbitControls, Sparkles } from '@react-three/drei';
import { PCFShadowMap, TOUCH } from 'three';
import { SceneEnvironment } from './switchboard/SceneEnvironment';
import { Switchboard } from './switchboard/Switchboard';
import { useSwitchboardMaterials } from './switchboard/materials';

interface HeroSceneCanvasProps {
  active?: boolean;
  /** When false, orbit is off and the canvas ignores pointer — page can scroll */
  controlsEnabled?: boolean;
}

/** Keep the raw <canvas> in sync — parent pointer-events:none does NOT block the canvas element. */
function CanvasPointerGate({ controlsEnabled }: { controlsEnabled: boolean }) {
  const { gl } = useThree();

  useEffect(() => {
    const el = gl.domElement;
    el.style.pointerEvents = controlsEnabled ? 'auto' : 'none';
    el.style.touchAction = controlsEnabled ? 'none' : 'pan-y';
    return () => {
      el.style.pointerEvents = 'none';
      el.style.touchAction = 'pan-y';
    };
  }, [gl, controlsEnabled]);

  return null;
}

function Scene({ controlsEnabled }: { controlsEnabled: boolean }) {
  const materials = useSwitchboardMaterials();
  return (
    <>
      <CanvasPointerGate controlsEnabled={controlsEnabled} />
      <SceneEnvironment materials={materials} />
      <Switchboard />

      <ContactShadows
        position={[0.05, -2.05, 0.15]}
        opacity={0.55}
        scale={12}
        blur={2.4}
        far={6}
        color="#0c0a09"
      />

      <Sparkles
        count={42}
        scale={[5.2, 3.6, 3.2]}
        size={2.2}
        speed={0.26}
        opacity={0.38}
        color="#f97316"
        position={[0.1, -0.1, 0.55]}
      />
      <Sparkles
        count={22}
        scale={[4.0, 2.6, 2.4]}
        size={1.5}
        speed={0.14}
        opacity={0.2}
        color="#fdba74"
        position={[0.35, 0.15, 0.75]}
      />

      {controlsEnabled && (
        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          enableZoom
          enableRotate
          zoomToCursor={false}
          touches={{ ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN }}
          minDistance={3.2}
          maxDistance={7.5}
          minPolarAngle={Math.PI * 0.28}
          maxPolarAngle={Math.PI * 0.62}
          minAzimuthAngle={-Math.PI * 0.45}
          maxAzimuthAngle={Math.PI * 0.38}
          target={[0.05, -0.12, 0.05]}
        />
      )}
    </>
  );
}

export default function HeroSceneCanvas({
  active = true,
  controlsEnabled = false,
}: HeroSceneCanvasProps) {
  return (
    <Canvas
      camera={{ position: [3.15, 0.55, 5.6], fov: 36, near: 0.1, far: 50 }}
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
      <Scene controlsEnabled={controlsEnabled} />
    </Canvas>
  );
}
