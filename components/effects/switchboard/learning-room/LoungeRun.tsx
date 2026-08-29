'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo } from 'react';
import { CanvasTexture, Color, Group, Mesh, MeshStandardMaterial, Object3D, SRGBColorSpace } from 'three';
import { onInteractiveClick, onInteractiveEnter, onInteractiveLeave } from '../interaction';
import { PathWire } from '../wiring/PathWire';
import { DimmerSwitch } from './DimmerSwitch';
import { FittedGltf } from './FittedGltf';
import { POLYHAVEN, ROOM_GLB } from './room-assets';
import { FIXTURES, LOUNGE, ROOM } from './room-layout';
import { useRepeatingPbr } from './room-textures';
import { loadKeptGltf } from './useKeptGltf';

function Hit({
  onToggle,
  size,
  position = [0, 0, 0],
}: {
  onToggle: () => void;
  size: [number, number, number];
  position?: [number, number, number];
}) {
  return (
    <mesh
      position={position}
      onPointerOver={(e) => onInteractiveEnter(e)}
      onPointerOut={() => onInteractiveLeave()}
      onClick={(e) => onInteractiveClick(e, onToggle)}
    >
      <boxGeometry args={size} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

function TvScreen({ on, width, height }: { on: boolean; width: number; height: number }) {
  const map = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 768;
    canvas.height = 432;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D context unavailable');
    const g = ctx.createLinearGradient(0, 0, 768, 432);
    g.addColorStop(0, '#1b3a5c');
    g.addColorStop(0.45, '#2a6a8a');
    g.addColorStop(1, '#0f1720');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 768, 432);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(40, 48, 420, 240);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 28px "Segoe UI", system-ui, sans-serif';
    ctx.fillText('HDMI 1  ·  Lounge', 56, 92);
    ctx.font = '500 18px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Open-plan living  ·  65"', 56, 128);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(56, 168, 8, 8);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '500 16px "Segoe UI", system-ui, sans-serif';
    ctx.fillText('Live', 74, 176);
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, []);

  return (
    <mesh receiveShadow renderOrder={2}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        map={on ? map : null}
        emissive={on ? '#8ecae6' : '#000000'}
        emissiveMap={on ? map : null}
        emissiveIntensity={on ? 0.65 : 0}
        roughness={on ? 0.22 : 0.12}
        metalness={0.04}
        transparent={false}
        depthWrite
        polygonOffset
        polygonOffsetFactor={-2}
        polygonOffsetUnits={-2}
        color={on ? '#ffffff' : '#050506'}
      />
    </mesh>
  );
}

/**
 * Samsung GLB screen in scene-root metres (Sketchfab Rx(-90) already applied).
 * Overlay is a FittedGltf child, so it inherits contain scale / pin / Ry(π).
 */
const TV_SCREEN = { x: 0.13, y: 0.57, z: 0.056, w: 1.42, h: 0.78 };

function LoungeTelevision({ on }: { on: boolean }) {
  const cab = LOUNGE.cab;
  const tv = FIXTURES.tv;
  return (
    <group position={[tv.x, cab.h, ROOM.depth]}>
      <FittedGltf
        url={ROOM_GLB.television}
        maxSize={[LOUNGE.tv.w, LOUNGE.tv.h, LOUNGE.tv.d]}
        position={[0, 0, 0]}
        rotation={[0, Math.PI, 0]}
        align="bottom"
        pin="front"
        fit="contain"
      >
        <group position={[TV_SCREEN.x, TV_SCREEN.y, TV_SCREEN.z]}>
          <TvScreen on={on} width={TV_SCREEN.w} height={TV_SCREEN.h} />
          {on && <pointLight position={[0, 0, 0.18]} intensity={0.55} distance={2.4} color="#9ec9e0" />}
        </group>
      </FittedGltf>
    </group>
  );
}

function Rug() {
  const maps = useRepeatingPbr(POLYHAVEN.dirtyCarpet, [2.2, 1.5]);
  const { x, w, d, z } = LOUNGE.rug;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x + w / 2, 0.01, z + d / 2]} receiveShadow>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial
        map={maps.map}
        normalMap={maps.normalMap}
        roughnessMap={maps.roughnessMap}
        roughness={0.92}
        metalness={0.02}
        envMapIntensity={0.35}
        normalScale={[0.35, 0.35]}
      />
    </mesh>
  );
}

function Couch() {
  const { x, w, d, z } = LOUNGE.couch;
  return (
    <FittedGltf
      url={ROOM_GLB.sofa}
      maxSize={[w, 0.88, d]}
      position={[x + w / 2, 0, z + d / 2]}
      rotation={[0, 0, 0]}
      align="bottom"
      pin="center"
      fit="contain"
    />
  );
}

function CoffeeTable() {
  const { x, w, d, h, z } = LOUNGE.table;
  return (
    <FittedGltf
      url={ROOM_GLB.coffeeTable}
      maxSize={[w, h + 0.02, d]}
      position={[x + w / 2, 0, z + d / 2]}
      rotation={[0, Math.PI / 2, 0]}
      align="bottom"
      pin="center"
      fit="contain"
    />
  );
}

function TvUnit() {
  const { x, w, h, depth } = LOUNGE.cab;
  return (
    <FittedGltf
      url={ROOM_GLB.tvCabinet}
      maxSize={[w, h + 0.02, depth]}
      position={[x + w / 2, 0, ROOM.depth]}
      rotation={[0, Math.PI, 0]}
      align="bottom"
      pin="front"
      fit="contain"
    />
  );
}

function cloneScene(source: Object3D): Group {
  const g = source.clone(true) as Group;
  g.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (Array.isArray(mesh.material)) mesh.material = mesh.material.map((m) => m.clone());
    else if (mesh.material) mesh.material = (mesh.material as MeshStandardMaterial).clone();
  });
  return g;
}

function setNamedEmissive(root: Object3D, name: string, on: boolean, intensity: number) {
  root.traverse((obj) => {
    if (obj.name !== name) return;
    const mesh = obj as Mesh;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of mats) {
      const m = mat as MeshStandardMaterial;
      if (!m?.emissive) continue;
      m.emissive = new Color(on ? '#fde68a' : '#000000');
      m.emissiveIntensity = on ? intensity : 0;
    }
  });
}

function LoungeSconces({ lightsOn, dimmer }: { lightsOn: boolean; dimmer: number }) {
  const gltf = useGLTF(ROOM_GLB.sconce);
  const a = useMemo(() => cloneScene(gltf.scene), [gltf.scene]);
  const b = useMemo(() => cloneScene(gltf.scene), [gltf.scene]);
  const glow = lightsOn ? 0.7 + dimmer * 1.1 : 0;
  useFrame(() => {
    setNamedEmissive(a, 'Shade', lightsOn, glow);
    setNamedEmissive(b, 'Shade', lightsOn, glow);
  });
  const s1 = FIXTURES.loungeSconce1;
  const s2 = FIXTURES.loungeSconce2;
  const intensity = lightsOn ? 0.45 + dimmer * 1.15 : 0;
  return (
    <group>
      <primitive object={a} position={[s1.x, s1.y, s1.z]} rotation={[0, Math.PI, 0]} scale={1.18} />
      <primitive object={b} position={[s2.x, s2.y, s2.z]} rotation={[0, Math.PI, 0]} scale={1.18} />
      {lightsOn && (
        <>
          <pointLight position={[s1.x, s1.y - 0.02, s1.z - 0.28]} intensity={intensity} distance={5.2} color="#fff4d6" />
          <pointLight position={[s2.x, s2.y - 0.02, s2.z - 0.28]} intensity={intensity} distance={5.2} color="#fff4d6" />
        </>
      )}
    </group>
  );
}

type Props = {
  powerLive: boolean;
  lightLive: boolean;
  dimmer: number;
  tvOn: boolean;
  onCycleDimmer: () => void;
  onToggleTv: () => void;
};

export function LoungeRun({ powerLive, lightLive, dimmer, tvOn, onCycleDimmer, onToggleTv }: Props) {
  const flex = useMemo(
    () => new MeshStandardMaterial({ color: '#1c1d20', roughness: 0.64, metalness: 0.06 }),
    [],
  );
  const lightsOn = lightLive && dimmer > 0.04;
  const screenOn = powerLive && tvOn;
  const cab = LOUNGE.cab;
  const zFront = ROOM.depth - cab.depth;
  const gpo = FIXTURES.loungeGpo;
  const tv = FIXTURES.tv;

  return (
    <group>
      <Rug />
      <Couch />
      <CoffeeTable />
      <TvUnit />
      <LoungeTelevision on={screenOn} />

      <FittedGltf
        url={ROOM_GLB.gpoDouble}
        maxSize={[0.155, 0.1, 0.032]}
        position={[gpo.x, gpo.y, gpo.z]}
        rotation={[0, Math.PI, 0]}
        align="center"
        pin="back"
        share
        envIntensity={powerLive ? 1.15 : 1.05}
      />
      <PathWire
        points={[
          [tv.x + 0.56, cab.h + 0.28, ROOM.depth - 0.08],
          [tv.x + 0.64, cab.h + 0.08, ROOM.depth - 0.05],
          [tv.x + 0.72, cab.h + 0.035, ROOM.depth - 0.042],
          [gpo.x - 0.1, cab.h + 0.032, ROOM.depth - 0.04],
          [gpo.x + 0.01, gpo.y + 0.05, ROOM.depth - 0.028],
          [gpo.x, gpo.y - 0.01, ROOM.depth - 0.016],
        ]}
        radius={0.005}
        material={flex}
        live={powerLive}
        segments={24}
        oval={1}
        soft={false}
      />

      <DimmerSwitch
        position={[FIXTURES.loungeDimmerA.x, FIXTURES.loungeDimmerA.y, FIXTURES.loungeDimmerA.z]}
        wall="board"
        level={dimmer}
        live={lightsOn}
        onCycle={onCycleDimmer}
      />
      <DimmerSwitch
        position={[FIXTURES.loungeDimmerB.x, FIXTURES.loungeDimmerB.y, FIXTURES.loungeDimmerB.z]}
        wall="lounge"
        level={dimmer}
        live={lightsOn}
        onCycle={onCycleDimmer}
      />

      <LoungeSconces lightsOn={lightsOn} dimmer={dimmer} />

      <Hit
        onToggle={onToggleTv}
        size={[LOUNGE.tv.w + 0.06, LOUNGE.tv.h + 0.04, 0.18]}
        position={[tv.x, cab.h + LOUNGE.tv.h / 2, zFront + 0.06]}
      />
      <Hit onToggle={onToggleTv} size={[0.24, 0.18, 0.14]} position={[gpo.x, gpo.y, zFront + 0.05]} />
    </group>
  );
}

loadKeptGltf(ROOM_GLB.gpoDouble);
loadKeptGltf(ROOM_GLB.sconce);
loadKeptGltf(ROOM_GLB.sofa);
loadKeptGltf(ROOM_GLB.coffeeTable);
loadKeptGltf(ROOM_GLB.television);
loadKeptGltf(ROOM_GLB.tvCabinet);
useGLTF.preload(ROOM_GLB.sconce);
