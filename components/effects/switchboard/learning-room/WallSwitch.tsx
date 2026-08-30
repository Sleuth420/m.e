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
  /** Board wall faces +X (Ry 90). Kitchen splash faces +Z. Lounge wall faces -Z. */
  wall: 'board' | 'kitchen' | 'lounge';
  on: boolean;
  onToggle: () => void;
  /** Cooktop isolator uses a red rocker. */
  isolator?: boolean;
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

function paintRocker(root: Object3D, color: string) {
  let rocker: Object3D | null = null;
  root.traverse((obj) => {
    if (obj.name === 'Rocker') rocker = obj;
  });
  if (!rocker) return;
  (rocker as Object3D).traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of mats) {
      const m = mat as MeshStandardMaterial;
      if (!m?.color) continue;
      m.color.set(color);
      m.roughness = 0.52;
      m.metalness = 0.06;
      m.needsUpdate = true;
    }
  });
}

function useCooktopLabel() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D context unavailable');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 256, 64);
    ctx.fillStyle = '#9b1c1c';
    ctx.font = '700 26px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('COOKTOP', 128, 32);
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, []);
}

/** AU 76×116 C2000-ish plate — generated fitting, not a toy stack of boxes. */
export function WallSwitch({ position, wall, on, onToggle, isolator = false }: Props) {
  const { scene } = useKeptGltf(isolator ? ROOM_GLB.isolator : ROOM_GLB.switch);
  const typeI = useTypeIPlateMaterial();
  const label = useCooktopLabel();
  const root = useMemo(() => {
    const g = cloneFitted(scene);
    paintPlatesFromTypeI(g, typeI);
    if (isolator) paintRocker(g, '#9b1c1c');
    return g;
  }, [scene, isolator, typeI]);
  const rocker = useRef<Object3D>(null);

  useLayoutEffect(() => {
    let found: Object3D | null = null;
    root.traverse((obj) => {
      if (obj.name === 'Rocker') found = obj;
    });
    rocker.current = found;
  }, [root]);

  useFrame((_, delta) => {
    const r = rocker.current;
    if (!r) return;
    r.rotation.x = MathUtils.damp(r.rotation.x, on ? -0.28 : 0.28, 14, delta);
  });

  return (
    <group
      position={position}
      rotation={wall === 'board' ? [0, Math.PI / 2, 0] : wall === 'lounge' ? [0, Math.PI, 0] : [0, 0, 0]}
      onPointerOver={(e) => onInteractiveEnter(e)}
      onPointerOut={() => onInteractiveLeave()}
      onPointerUp={(e) => onInteractiveClick(e, onToggle)}
    >
      <primitive object={root} />
      {isolator && (
        <mesh position={[0, -0.046, 0.0102]} receiveShadow>
          <planeGeometry args={[0.048, 0.011]} />
          <meshStandardMaterial map={label} roughness={0.55} metalness={0.02} />
        </mesh>
      )}
      <mesh>
        <boxGeometry args={[0.22, 0.28, 0.16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

loadKeptGltf(ROOM_GLB.switch);
loadKeptGltf(ROOM_GLB.isolator);
