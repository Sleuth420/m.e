'use client';

import { RoundedBox, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import {
  CanvasTexture,
  Color,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  SRGBColorSpace,
} from 'three';
import { onInteractiveClick, onInteractiveEnter, onInteractiveLeave } from '../interaction';
import { PathWire } from '../wiring/PathWire';
import { DimmerSwitch } from './DimmerSwitch';
import { FittedGltf } from './FittedGltf';
import { POLYHAVEN, ROOM_GLB } from './room-assets';
import { FIXTURES, LOUNGE, ROOM, type LoungeInteractId } from './room-layout';
import { useRepeatingPbr, useSizedPbr } from './room-textures';
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

const JOINERY = '#f4f2ed';
const JOINERY_IN = '#e2ddd4';
const HANDLE = '#2a2c30';
const KICK = '#3a3d42';
const PANEL = 0.018;
const DOOR_T = 0.018;
const REVEAL = 0.002;
const FABRIC = '#3c4148';
const FABRIC_PIPING = '#2b3036';
const CUSHION = '#454b53';

function Oak({
  w,
  h,
  grain = 'v',
  interior = false,
}: {
  w: number;
  h: number;
  grain?: 'v' | 'h';
  interior?: boolean;
}) {
  const maps = useSizedPbr(
    POLYHAVEN.oakVeneer,
    [Math.max(0.04, w), Math.max(0.04, h)],
    0.48,
    grain === 'h' ? Math.PI / 2 : 0,
  );
  return (
    <meshStandardMaterial
      normalMap={maps.normalMap}
      roughnessMap={maps.roughnessMap}
      color={interior ? JOINERY_IN : JOINERY}
      roughness={interior ? 0.72 : 0.48}
      metalness={0.06}
      envMapIntensity={interior ? 0.5 : 0.9}
      normalScale={[0.08, 0.08]}
    />
  );
}

function Box({
  w,
  h,
  d,
  position,
  grain = 'v',
  interior = false,
}: {
  w: number;
  h: number;
  d: number;
  position: [number, number, number];
  grain?: 'v' | 'h';
  interior?: boolean;
}) {
  if (w < 0.004 || h < 0.004 || d < 0.004) return null;
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <Oak w={grain === 'h' ? w : d} h={h} grain={grain} interior={interior} />
    </mesh>
  );
}

function BarHandle({ position, length }: { position: [number, number, number]; length: number }) {
  const span = length * 0.38;
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.006, 0.006, length, 16]} />
        <meshStandardMaterial color={HANDLE} roughness={0.38} metalness={0.72} />
      </mesh>
      {([-span, span] as const).map((off) => (
        <mesh key={off} position={[off, 0, 0.012]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.0048, 0.0048, 0.024, 12]} />
          <meshStandardMaterial color={HANDLE} roughness={0.38} metalness={0.72} />
        </mesh>
      ))}
    </group>
  );
}

function LoungeDoor({
  x,
  y,
  z,
  w,
  h,
  hinge,
  open,
}: {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  hinge: 'left' | 'right';
  open: boolean;
}) {
  const pivot = useRef<Group>(null);
  const dir = hinge === 'left' ? 1 : -1;
  useFrame((_, delta) => {
    if (!pivot.current) return;
    pivot.current.rotation.y = MathUtils.damp(pivot.current.rotation.y, open ? dir * 1.18 : 0, 8, delta);
  });
  const originX = hinge === 'left' ? x : x + w;
  return (
    <group ref={pivot} position={[originX, y, z]}>
      <group position={[hinge === 'left' ? 0 : -w, 0, 0]}>
        <Box w={w} h={h} d={DOOR_T} position={[w / 2, h / 2, -DOOR_T / 2]} />
        <BarHandle position={[w / 2, h * 0.55, -DOOR_T - 0.03]} length={Math.min(0.16, w * 0.42)} />
      </group>
    </group>
  );
}

function TvScreen({ on }: { on: boolean }) {
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
    <mesh position={[0, 0, -LOUNGE.tv.d / 2 - 0.001]} rotation={[0, Math.PI, 0]} receiveShadow>
      <planeGeometry args={[LOUNGE.tv.w - 0.05, LOUNGE.tv.h - 0.05]} />
      <meshStandardMaterial
        map={map}
        emissive={on ? '#8ecae6' : '#000000'}
        emissiveMap={on ? map : null}
        emissiveIntensity={on ? 0.7 : 0}
        roughness={0.22}
        metalness={0.04}
        color={on ? '#ffffff' : '#09090b'}
      />
    </mesh>
  );
}

function Rug() {
  const maps = useRepeatingPbr(POLYHAVEN.oakVeneer, [2.4, 1.6]);
  const { x, w, d, z } = LOUNGE.rug;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x + w / 2, 0.012, z + d / 2]} receiveShadow>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial
        map={maps.map}
        normalMap={maps.normalMap}
        roughnessMap={maps.roughnessMap}
        color="#5c4638"
        roughness={0.92}
        metalness={0.02}
        envMapIntensity={0.35}
        normalScale={[0.15, 0.15]}
      />
    </mesh>
  );
}

function Couch() {
  const { x, w, d, z, seatH } = LOUNGE.couch;
  const cx = x + w / 2;
  const cz = z + d / 2;
  const arm = 0.14;
  const back = 0.16;
  return (
    <group>
      <RoundedBox args={[w - 0.04, 0.12, d - 0.08]} radius={0.03} smoothness={3} position={[cx, 0.16, cz]} castShadow>
        <meshStandardMaterial color={FABRIC} roughness={0.86} metalness={0.02} />
      </RoundedBox>
      <RoundedBox
        args={[w - arm * 2 - 0.04, 0.14, d - back - 0.12]}
        radius={0.04}
        smoothness={3}
        position={[cx, seatH, cz + 0.04]}
        castShadow
      >
        <meshStandardMaterial color={CUSHION} roughness={0.88} metalness={0.02} />
      </RoundedBox>
      <RoundedBox
        args={[w - arm * 2 - 0.08, 0.46, back]}
        radius={0.05}
        smoothness={3}
        position={[cx, seatH + 0.28, z + back / 2 + 0.02]}
        castShadow
      >
        <meshStandardMaterial color={FABRIC} roughness={0.84} metalness={0.02} />
      </RoundedBox>
      {([-1, 1] as const).map((side) => (
        <RoundedBox
          key={side}
          args={[arm, 0.52, d - 0.06]}
          radius={0.045}
          smoothness={3}
          position={[cx + side * (w / 2 - arm / 2), 0.38, cz]}
          castShadow
        >
          <meshStandardMaterial color={FABRIC_PIPING} roughness={0.84} metalness={0.02} />
        </RoundedBox>
      ))}
      {[-0.28, 0, 0.28].map((off) => (
        <RoundedBox
          key={off}
          args={[0.62, 0.28, 0.12]}
          radius={0.04}
          smoothness={3}
          position={[cx + off * w * 0.28, seatH + 0.32, z + back + 0.08]}
          castShadow
        >
          <meshStandardMaterial color={CUSHION} roughness={0.9} metalness={0.02} />
        </RoundedBox>
      ))}
      {[
        [x + 0.12, z + 0.1],
        [x + w - 0.12, z + 0.1],
        [x + 0.12, z + d - 0.1],
        [x + w - 0.12, z + d - 0.1],
      ].map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.04, lz]} castShadow>
          <cylinderGeometry args={[0.018, 0.022, 0.08, 10]} />
          <meshStandardMaterial color="#1c1d20" roughness={0.45} metalness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function CoffeeTable() {
  const { x, w, d, h, z } = LOUNGE.table;
  const maps = useSizedPbr(POLYHAVEN.oakVeneer, [w, d], 0.7, 0);
  const cx = x + w / 2;
  const cz = z + d / 2;
  return (
    <group>
      <mesh position={[cx, h - 0.018, cz]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.036, d]} />
        <meshStandardMaterial
          map={maps.map}
          normalMap={maps.normalMap}
          roughnessMap={maps.roughnessMap}
          color="#c4a574"
          roughness={0.42}
          metalness={0.06}
          envMapIntensity={0.85}
        />
      </mesh>
      {[
        [x + 0.07, z + 0.07],
        [x + w - 0.07, z + 0.07],
        [x + 0.07, z + d - 0.07],
        [x + w - 0.07, z + d - 0.07],
      ].map(([lx, lz], i) => (
        <mesh key={i} position={[lx, h / 2 - 0.02, lz]} castShadow>
          <boxGeometry args={[0.04, h - 0.04, 0.04]} />
          <meshStandardMaterial color="#8a6a42" roughness={0.55} metalness={0.04} />
        </mesh>
      ))}
    </group>
  );
}

function TvUnit({
  openById,
}: {
  openById: Partial<Record<LoungeInteractId, boolean>>;
}) {
  const { x, w, h, depth, kickH } = LOUNGE.cab;
  const zBack = ROOM.depth - 0.004;
  const zFront = zBack - depth;
  const innerW = w - 2 * PANEL;
  const doorW = (w - REVEAL * 4) / 3;
  const doorH = h - kickH - REVEAL * 2;
  const doorY = kickH + REVEAL;
  const ids: LoungeInteractId[] = ['tv-cab-l', 'tv-cab-m', 'tv-cab-r'];
  const hinges: Array<'left' | 'right'> = ['left', 'left', 'right'];

  return (
    <group>
      <Box w={PANEL} h={h - kickH} d={depth} position={[x + PANEL / 2, kickH + (h - kickH) / 2, zBack - depth / 2]} />
      <Box
        w={PANEL}
        h={h - kickH}
        d={depth}
        position={[x + w - PANEL / 2, kickH + (h - kickH) / 2, zBack - depth / 2]}
      />
      <Box
        w={innerW}
        h={PANEL}
        d={depth}
        position={[x + w / 2, kickH + PANEL / 2, zBack - depth / 2]}
        interior
        grain="h"
      />
      <Box w={innerW} h={PANEL} d={depth} position={[x + w / 2, h - PANEL / 2, zBack - depth / 2]} grain="h" />
      <Box
        w={innerW}
        h={h - kickH - 2 * PANEL}
        d={PANEL * 0.6}
        position={[x + w / 2, kickH + (h - kickH) / 2, zBack - PANEL * 0.3]}
        interior
      />
      <mesh position={[x + w / 2, kickH / 2, zFront + 0.02]} castShadow receiveShadow>
        <boxGeometry args={[w, kickH - 0.004, 0.018]} />
        <meshStandardMaterial color={KICK} roughness={0.38} metalness={0.18} />
      </mesh>
      {ids.map((id, i) => {
        const dx = x + REVEAL + i * (doorW + REVEAL);
        return (
          <LoungeDoor
            key={id}
            x={dx}
            y={doorY}
            z={zFront}
            w={doorW}
            h={doorH}
            hinge={hinges[i]!}
            open={!!openById[id]}
          />
        );
      })}
    </group>
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
          <pointLight position={[s1.x, s1.y, s1.z - 0.28]} intensity={intensity} distance={5.2} color="#fff4d6" />
          <pointLight position={[s2.x, s2.y, s2.z - 0.28]} intensity={intensity} distance={5.2} color="#fff4d6" />
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
  openById: Partial<Record<LoungeInteractId, boolean>>;
  onCycleDimmer: () => void;
  onToggleTv: () => void;
  onToggle: (id: LoungeInteractId) => void;
};

export function LoungeRun({
  powerLive,
  lightLive,
  dimmer,
  tvOn,
  openById,
  onCycleDimmer,
  onToggleTv,
  onToggle,
}: Props) {
  const sheath = useMemo(
    () => new MeshStandardMaterial({ color: '#f3f0e8', roughness: 0.55, metalness: 0.03 }),
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
      <TvUnit openById={openById} />

      <group position={[tv.x, cab.h + 0.06 + LOUNGE.tv.h / 2, zFront + 0.16]}>
        <mesh position={[0, -LOUNGE.tv.h / 2 - 0.028, 0.01]} castShadow>
          <boxGeometry args={[0.28, 0.016, 0.18]} />
          <meshStandardMaterial color="#1a1b1e" roughness={0.4} metalness={0.35} />
        </mesh>
        <mesh position={[0, -LOUNGE.tv.h / 2 - 0.012, 0.01]} castShadow>
          <boxGeometry args={[0.08, 0.028, 0.06]} />
          <meshStandardMaterial color="#111113" roughness={0.32} metalness={0.45} />
        </mesh>
        <mesh castShadow>
          <boxGeometry args={[LOUNGE.tv.w, LOUNGE.tv.h, LOUNGE.tv.d]} />
          <meshStandardMaterial color="#111113" roughness={0.32} metalness={0.45} />
        </mesh>
        <TvScreen on={screenOn} />
        {screenOn && <pointLight position={[0, 0, -0.35]} intensity={0.55} distance={2.4} color="#9ec9e0" />}
      </group>

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
          [tv.x + 0.62, tv.y - 0.12, tv.z + 0.02],
          [tv.x + 0.7, cab.h + 0.02, zFront + 0.12],
          [gpo.x - 0.04, cab.h + 0.02, zFront + 0.18],
          [gpo.x, gpo.y - 0.02, ROOM.depth - 0.04],
        ]}
        radius={0.004}
        material={sheath}
        live={powerLive}
        segments={16}
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
        size={[LOUNGE.tv.w + 0.04, LOUNGE.tv.h - 0.08, 0.14]}
        position={[tv.x, cab.h + 0.1 + LOUNGE.tv.h / 2, zFront + 0.1]}
      />
      <Hit onToggle={onToggleTv} size={[0.24, 0.18, 0.14]} position={[gpo.x, gpo.y, zFront + 0.05]} />
      <Hit
        onToggle={() => onToggle('tv-cab-l')}
        size={[0.92, 0.4, 0.22]}
        position={[cab.x + 0.5, 0.28, zFront - 0.04]}
      />
      <Hit
        onToggle={() => onToggle('tv-cab-m')}
        size={[0.92, 0.4, 0.22]}
        position={[cab.x + cab.w / 2, 0.28, zFront - 0.04]}
      />
      <Hit
        onToggle={() => onToggle('tv-cab-r')}
        size={[0.92, 0.4, 0.22]}
        position={[cab.x + cab.w - 0.5, 0.28, zFront - 0.04]}
      />
    </group>
  );
}

loadKeptGltf(ROOM_GLB.gpoDouble);
loadKeptGltf(ROOM_GLB.sconce);
useGLTF.preload(ROOM_GLB.sconce);
