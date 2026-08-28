'use client';

import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { CanvasTexture, Group, MathUtils, Mesh, MeshStandardMaterial, Object3D, SRGBColorSpace } from 'three';
import { onInteractiveClick, onInteractiveEnter, onInteractiveLeave } from '../interaction';
import { ROOM_GLB } from './room-assets';
import { loadKeptGltf, useKeptGltf } from './useKeptGltf';
import { paintPlatesFromTypeI, useTypeIPlateMaterial } from './type-i-plastic';

type Props = {
  position: [number, number, number];
  wall: 'board' | 'kitchen' | 'lounge';
  level: number;
  live: boolean;
  onCycle: () => void;
};

function cloneFitted(source: Object3D): Group {
  const g = source.clone(true) as Group;
  g.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map((m) => m.clone());
    } else if (mesh.material) {
      mesh.material = (mesh.material as MeshStandardMaterial).clone();
    }
  });
  return g;
}

function useDimLabel() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D context unavailable');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 256, 64);
    ctx.fillStyle = '#3f3f46';
    ctx.font = '700 26px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DIM', 128, 32);
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, []);
}

const KNOB_OFF = 0.55;
const KNOB_ON = -1.85;

/** C2000 rotary dimmer — click/Use cycles off, 35%, 70%, 100%. */
export function DimmerSwitch({ position, wall, level, live, onCycle }: Props) {
  const { scene } = useKeptGltf(ROOM_GLB.dimmer);
  const typeI = useTypeIPlateMaterial();
  const label = useDimLabel();
  const root = useMemo(() => {
    const g = cloneFitted(scene);
    paintPlatesFromTypeI(g, typeI);
    return g;
  }, [scene, typeI]);
  const knob = useRef<Object3D>(null);

  useLayoutEffect(() => {
    let found: Object3D | null = null;
    root.traverse((obj) => {
      if (obj.name === 'Knob') found = obj;
    });
    knob.current = found;
  }, [root]);

  useFrame((_, delta) => {
    const k = knob.current;
    if (!k) return;
    const t = MathUtils.clamp(level, 0, 1);
    k.rotation.z = MathUtils.damp(k.rotation.z, MathUtils.lerp(KNOB_OFF, KNOB_ON, t), 14, delta);
  });

  const rot: [number, number, number] =
    wall === 'board' ? [0, Math.PI / 2, 0] : wall === 'lounge' ? [0, Math.PI, 0] : [0, 0, 0];

  return (
    <group
      position={position}
      rotation={rot}
      onPointerOver={(e) => onInteractiveEnter(e)}
      onPointerOut={() => onInteractiveLeave()}
      onClick={(e) => onInteractiveClick(e, onCycle)}
    >
      <primitive object={root} />
      <mesh position={[0, -0.044, 0.0102]} receiveShadow>
        <planeGeometry args={[0.042, 0.011]} />
        <meshStandardMaterial map={label} roughness={0.55} metalness={0.02} />
      </mesh>
      {live && level > 0.04 && (
        <pointLight position={[0, 0.01, 0.04]} intensity={0.08 + level * 0.12} distance={0.35} color="#fde68a" />
      )}
      <mesh>
        <boxGeometry args={[0.22, 0.28, 0.16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

loadKeptGltf(ROOM_GLB.dimmer);
