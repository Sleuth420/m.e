'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { MathUtils, type Mesh, type MeshStandardMaterial, type Object3D } from 'three';
import { MODULE_TARGET, type ModuleKind } from '../assets/module-assets';
import { useModuleGltf } from '../assets/useModuleGltf';

type Props = {
  kind: ModuleKind;
  highlighted?: boolean;
  onPointerOver?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut?: () => void;
  onPointerUp?: (e: ThreeEvent<PointerEvent>) => void;
};

function setShellEmissive(root: Object3D | null, intensity: number) {
  if (!root) return;
  root.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of mats) {
      if (mat && 'emissiveIntensity' in mat) {
        const std = mat as MeshStandardMaterial;
        if (!std.emissive.getHex()) std.emissive.set('#c4a574');
        std.emissiveIntensity = intensity;
      }
    }
  });
}

/**
 * Static DIN module shell from GLB, plus an invisible hit box for hover.
 * Interactive rocker / TEST / face maps are overlaid by the parent.
 */
export function ModuleShell({ kind, highlighted = false, onPointerOver, onPointerOut, onPointerUp }: Props) {
  const template = useModuleGltf(kind);
  const rootRef = useRef<Object3D>(null);
  const hitRef = useRef<Mesh>(null);
  const emissive = useRef(0);

  const instance = useMemo(() => {
    const cloned: Object3D = template.clone(true);
    cloned.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = false;
      mesh.receiveShadow = true;
      // Clone materials so per-instance emissive doesn't leak across poles
      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((m) => m.clone());
      } else if (mesh.material) {
        mesh.material = mesh.material.clone();
      }
    });
    return cloned;
  }, [template]);

  useFrame((_, delta) => {
    const target = highlighted ? 0.1 : 0;
    emissive.current = MathUtils.damp(emissive.current, target, 10, delta);
    setShellEmissive(rootRef.current, emissive.current);
  });

  const size = MODULE_TARGET[kind];

  return (
    <group ref={rootRef}>
      <primitive object={instance} />
      <mesh
        ref={hitRef}
        renderOrder={4}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onPointerUp={onPointerUp}
      >
        <boxGeometry args={[size.width * 1.2, size.height * 1.08, size.depth * 1.08]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
