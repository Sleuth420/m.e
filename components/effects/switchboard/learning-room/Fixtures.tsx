'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo } from 'react';
import { Color, Group, Mesh, MeshStandardMaterial, Object3D } from 'three';
import { FIXTURES } from './room-layout';
import { ROOM_GLB } from './room-assets';
import { WallSwitch } from './WallSwitch';

function cloneScene(source: Object3D): Group {
  const g = source.clone(true) as Group;
  g.traverse((obj) => {
    const mesh = obj as Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((m) => m.clone());
      } else if (mesh.material) {
        mesh.material = (mesh.material as MeshStandardMaterial).clone();
      }
    }
  });
  return g;
}

function setNamedEmissive(root: Object3D, name: string, on: boolean, color = '#fde68a') {
  root.traverse((obj) => {
    if (obj.name !== name) return;
    const mesh = obj as Mesh;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of mats) {
      const m = mat as MeshStandardMaterial;
      if (!m?.emissive) continue;
      m.emissive = new Color(on ? color : '#000000');
      m.emissiveIntensity = on ? 1.4 : 0;
    }
  });
}

type FixtureProps = {
  lightsOn: boolean;
  lightSwitchOn: boolean;
  onToggleSwitch: () => void;
};

/** Board-wall fittings only. Kitchen appliances live in KitchenRun. */
export function Fixtures({ lightsOn, lightSwitchOn, onToggleSwitch }: FixtureProps) {
  const sconceGltf = useGLTF(ROOM_GLB.sconce);

  const sconce1 = useMemo(() => cloneScene(sconceGltf.scene), [sconceGltf.scene]);
  const sconce2 = useMemo(() => cloneScene(sconceGltf.scene), [sconceGltf.scene]);

  useFrame(() => {
    setNamedEmissive(sconce1, 'Shade', lightsOn);
    setNamedEmissive(sconce2, 'Shade', lightsOn);
  });

  const sw = FIXTURES.lightSwitch;
  const l1 = FIXTURES.wallLight1;
  const l2 = FIXTURES.wallLight2;

  return (
    <group>
      <WallSwitch
        position={[sw.x, sw.y, sw.z]}
        wall="board"
        on={lightSwitchOn}
        onToggle={onToggleSwitch}
      />

      <primitive object={sconce1} position={[l1.x, l1.y, l1.z]} rotation={[0, Math.PI / 2, 0]} scale={1.45} />
      <primitive object={sconce2} position={[l2.x, l2.y, l2.z]} rotation={[0, Math.PI / 2, 0]} scale={1.45} />
      {lightsOn && (
        <>
          <pointLight position={[l1.x + 0.28, l1.y, l1.z]} intensity={1.4} distance={5.2} color="#fff4d6" />
          <pointLight position={[l2.x + 0.28, l2.y, l2.z]} intensity={1.4} distance={5.2} color="#fff4d6" />
        </>
      )}
    </group>
  );
}

useGLTF.preload(ROOM_GLB.sconce);
