'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Torus } from '@react-three/drei';
import type { Mesh } from 'three';

function AnimatedTorus() {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.15;
    ref.current.rotation.y = state.clock.elapsedTime * 0.25;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <Torus ref={ref} args={[2.2, 0.04, 16, 100]}>
        <MeshDistortMaterial
          color="#f97316"
          emissive="#06b6d4"
          emissiveIntensity={0.3}
          distort={0.25}
          speed={2}
          wireframe
        />
      </Torus>
    </Float>
  );
}

function InnerTorus() {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = -state.clock.elapsedTime * 0.2;
    ref.current.rotation.z = state.clock.elapsedTime * 0.1;
  });

  return (
    <Torus ref={ref} args={[1.4, 0.03, 12, 80]} rotation={[Math.PI / 3, 0, 0]}>
      <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.5} />
    </Torus>
  );
}

interface HeroSceneCanvasProps {
  active?: boolean;
}

export default function HeroSceneCanvas({ active = true }: HeroSceneCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'demand'}
      className="!absolute inset-0"
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#f97316" />
      <pointLight position={[-10, -5, 5]} intensity={0.5} color="#06b6d4" />
      <AnimatedTorus />
      <InnerTorus />
    </Canvas>
  );
}
