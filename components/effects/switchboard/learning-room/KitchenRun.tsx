'use client';

import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Box3, Group, MathUtils, Mesh, MeshStandardMaterial, Object3D, Quaternion, Vector3 } from 'three';
import { onInteractiveClick, onInteractiveEnter, onInteractiveLeave } from '../interaction';
import { FittedGltf, findNamed } from './FittedGltf';
import { POLYHAVEN, ROOM_GLB } from './room-assets';
import { useRepeatingPbr } from './room-textures';
import { loadKeptGltf } from './useKeptGltf';
import { WallSwitch } from './WallSwitch';
import { FIXTURES, HEIGHTS, KITCHEN, KITCHEN_BAYS, type KitchenInteractId } from './room-layout';

const doorCol = '#cfc8bc';
const kickCol = '#5c5854';

function Hit({
  onToggle,
  size,
  position = [0, 0, 0],
  enabled = true,
}: {
  onToggle: () => void;
  size: [number, number, number];
  position?: [number, number, number];
  enabled?: boolean;
}) {
  if (!enabled) return null;

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

const BENCH_T = 0.04;
const BENCH_Y = KITCHEN.benchH + BENCH_T / 2;
const BASE_H = KITCHEN.benchH - KITCHEN.kickH;
const FACE = KITCHEN.benchDepth;
/** Center of overlay doors (hinge on FACE, 36 mm thick). */
const FRONT = FACE + 0.018;
const SINK_CUT = { w: 0.76, d: 0.46, cz: 0.3 } as const;
/** White fascia above oven / dishwasher — appliance body sits on kicker below this line. */
const APPLIANCE_FILL_Y = 0.68;
const APPLIANCE_BODY_H = APPLIANCE_FILL_Y - KITCHEN.kickH;
const FASCIA_H = KITCHEN.benchH - APPLIANCE_FILL_Y;

function Kick({ x, w }: { x: number; w: number }) {
  const depth = FRONT - 0.002;
  return (
    <mesh position={[x + w / 2, KITCHEN.kickH / 2, depth / 2]} castShadow receiveShadow>
      <boxGeometry args={[w - 0.002, KITCHEN.kickH, depth]} />
      <meshStandardMaterial color={kickCol} roughness={0.88} />
    </mesh>
  );
}

function FrontFill({ x, w, y, h }: { x: number; w: number; y: number; h: number }) {
  if (h < 0.008) return null;
  const depth = FRONT + 0.018;
  return (
    <mesh position={[x + w / 2, y + h / 2, depth / 2]} castShadow receiveShadow>
      <boxGeometry args={[w - 0.002, h, depth]} />
      <meshStandardMaterial color={doorCol} roughness={0.48} />
    </mesh>
  );
}

function BenchSlab({
  x0,
  x1,
  z0,
  z1,
  maps,
}: {
  x0: number;
  x1: number;
  z0: number;
  z1: number;
  maps: ReturnType<typeof useRepeatingPbr>;
}) {
  const w = x1 - x0;
  const d = z1 - z0;
  if (w < 0.01 || d < 0.01) return null;
  return (
    <mesh position={[(x0 + x1) / 2, BENCH_Y, (z0 + z1) / 2]} castShadow receiveShadow>
      <boxGeometry args={[w, BENCH_T, d]} />
      <meshStandardMaterial
        map={maps.map}
        normalMap={maps.normalMap}
        roughnessMap={maps.roughnessMap}
        roughness={1}
        metalness={0.08}
        envMapIntensity={1.15}
      />
    </mesh>
  );
}

/** Benchtop with a sink cutout so the bowls sit in the bench, not on it. */
function BenchRun({ startX, endX, sinkX }: { startX: number; endX: number; sinkX: number }) {
  const maps = useRepeatingPbr(POLYHAVEN.marble, [2.6, 0.55]);
  const zMin = -0.01;
  const zMax = KITCHEN.benchDepth + 0.01;
  const cutL = sinkX - SINK_CUT.w / 2;
  const cutR = sinkX + SINK_CUT.w / 2;
  const cutBack = SINK_CUT.cz - SINK_CUT.d / 2;
  const cutFront = SINK_CUT.cz + SINK_CUT.d / 2;
  return (
    <group>
      <BenchSlab maps={maps} x0={startX - 0.006} x1={cutL} z0={zMin} z1={zMax} />
      <BenchSlab maps={maps} x0={cutR} x1={endX + 0.006} z0={zMin} z1={zMax} />
      <BenchSlab maps={maps} x0={cutL} x1={cutR} z0={zMin} z1={cutBack} />
      <BenchSlab maps={maps} x0={cutL} x1={cutR} z0={cutFront} z1={zMax} />
    </group>
  );
}

function TiledSplash({ x, w, h = 0.42 }: { x: number; w: number; h?: number }) {
  const maps = useRepeatingPbr(POLYHAVEN.tiles, [Math.max(4, w / 0.42), Math.max(1.6, h / 0.14)]);
  return (
    <mesh position={[x + w / 2, KITCHEN.benchH + 0.04 + h / 2, 0.008]} receiveShadow>
      <boxGeometry args={[w, h, 0.012]} />
      <meshStandardMaterial
        map={maps.map}
        normalMap={maps.normalMap}
        roughnessMap={maps.roughnessMap}
        roughness={1}
        metalness={0.04}
        envMapIntensity={1.1}
      />
    </mesh>
  );
}

/** Poly Haven two-door cabinet — one unit per bay, doors actually swing. */
function DoorCabinet({
  x,
  w,
  y,
  h,
  depth,
  open,
}: {
  x: number;
  w: number;
  y: number;
  h: number;
  depth: number;
  open: boolean;
}) {
  const left = useRef<Object3D | null>(null);
  const right = useRef<Object3D | null>(null);
  useFrame((_, delta) => {
    if (left.current) {
      left.current.rotation.y = MathUtils.damp(left.current.rotation.y, open ? 1.15 : 0, 8, delta);
    }
    if (right.current) {
      right.current.rotation.y = MathUtils.damp(
        right.current.rotation.y,
        open ? Math.PI - 1.15 : Math.PI,
        8,
        delta,
      );
    }
  });
  return (
    <FittedGltf
      url={ROOM_GLB.cabinetDoors}
      maxSize={[w - 0.008, h, depth]}
      position={[x + w / 2, y, depth / 2]}
      align="bottom"
      pin="center"
      fit="stretch"
      envIntensity={1.2}
      onReady={(root) => {
        left.current = findNamed(root, /door_l/i);
        right.current = findNamed(root, /door_r/i);
        if (right.current && !open) right.current.rotation.y = Math.PI;
      }}
    />
  );
}

/** 4-drawer base. Benchtop/kick stay ours so the run lines up. */
function DrawerBay({ x, w, open }: { x: number; w: number; open: boolean }) {
  const slide = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!slide.current) return;
    slide.current.position.z = MathUtils.damp(slide.current.position.z, open ? 0.22 : 0, 8, delta);
  });
  return (
    <group ref={slide}>
      <FittedGltf
        url={ROOM_GLB.cabinetDrawers}
        maxSize={[w - 0.004, KITCHEN.benchH, FACE]}
        position={[x + w / 2, 0, FACE / 2]}
        align="bottom"
        pin="center"
        fit="stretch"
        hide={/benchtop|kick|stand/i}
        envIntensity={1.25}
      />
    </group>
  );
}

function hingeParts(root: Object3D, match: RegExp, extra?: RegExp): Group | null {
  const existing = root.userData.hinge as Group | undefined;
  if (existing) return existing;
  const parts: Object3D[] = [];
  root.traverse((obj) => {
    if (!obj.name) return;
    if (match.test(obj.name) || (extra && extra.test(obj.name))) parts.push(obj);
  });
  if (!parts.length) return null;
  const box = new Box3();
  for (const part of parts) box.expandByObject(part);
  const worldHinge = new Vector3((box.min.x + box.max.x) / 2, box.min.y, box.max.z);
  const host = parts[0]!.parent;
  if (!host) return null;
  const local = worldHinge.clone();
  host.worldToLocal(local);
  const pivot = new Group();
  pivot.name = 'hinge-pivot';
  host.add(pivot);
  pivot.position.copy(local);
  const q = new Quaternion();
  host.getWorldQuaternion(q).invert();
  pivot.quaternion.copy(q);
  const inner = new Group();
  inner.name = 'hinge-inner';
  pivot.add(inner);
  pivot.updateWorldMatrix(true, false);
  inner.updateWorldMatrix(true, false);
  for (const part of parts) inner.attach(part);
  root.userData.hinge = inner;
  return inner;
}

/** Product GLB whose door/glass mesh drops open around the bottom-front edge. */
function HingedAppliance({
  open,
  doorMatch,
  extraMatch,
  openAngle = 1.2,
  url,
  maxSize,
  position,
  rotation,
  align,
  pin,
  fit,
  preScale,
  envIntensity,
}: {
  url: string;
  maxSize: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  align?: 'bottom' | 'center';
  pin?: 'center' | 'min' | 'front';
  fit?: 'contain' | 'width' | 'stretch';
  preScale?: number;
  envIntensity?: number;
  open: boolean;
  doorMatch: RegExp;
  extraMatch?: RegExp;
  openAngle?: number;
}) {
  const pivot = useRef<Group | null>(null);
  useFrame((_, delta) => {
    const g = pivot.current;
    if (!g) return;
    g.rotation.x = MathUtils.damp(g.rotation.x, open ? openAngle : 0, 8, delta);
  });
  return (
    <FittedGltf
      url={url}
      maxSize={maxSize}
      position={position}
      rotation={rotation}
      align={align}
      pin={pin}
      fit={fit}
      preScale={preScale}
      envIntensity={envIntensity}
      onReady={(root) => {
        pivot.current = hingeParts(root, doorMatch, extraMatch);
      }}
    />
  );
}

/** Built-in dishwasher door — stainless drop-down in front of the product tub. */
function DishwasherDoor({ x, w, open }: { x: number; w: number; open: boolean }) {
  const hinge = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!hinge.current) return;
    hinge.current.rotation.x = MathUtils.damp(hinge.current.rotation.x, open ? 1.28 : 0, 8, delta);
  });
  const h = APPLIANCE_BODY_H;
  return (
    <group ref={hinge} position={[x + w / 2, KITCHEN.kickH + 0.01, FRONT + 0.012]}>
      <mesh position={[0, h / 2, 0.012]} castShadow receiveShadow>
        <boxGeometry args={[w - 0.028, h - 0.016, 0.022]} />
        <meshStandardMaterial color="#c5c9ce" metalness={0.84} roughness={0.22} envMapIntensity={1.45} />
      </mesh>
      <mesh position={[0, h * 0.74, 0.026]} castShadow>
        <boxGeometry args={[w - 0.16, 0.016, 0.014]} />
        <meshStandardMaterial color="#9aa0a6" metalness={0.9} roughness={0.16} envMapIntensity={1.5} />
      </mesh>
    </group>
  );
}

function WallGpo({
  position,
  onToggle,
  live = false,
}: {
  position: [number, number, number];
  onToggle?: () => void;
  live?: boolean;
}) {
  return (
    <group position={position}>
      <FittedGltf
        url={ROOM_GLB.gpoDouble}
        maxSize={[0.155, 0.1, 0.032]}
        position={[0, 0, 0.012]}
        rotation={[0, 0, 0]}
        align="center"
        pin="front"
        share
        envIntensity={live ? 1.6 : 1.2}
      />
      {onToggle && <Hit onToggle={onToggle} size={[0.18, 0.12, 0.1]} />}
    </group>
  );
}

function CookIsolator({
  position,
  on,
  onToggle,
}: {
  position: [number, number, number];
  on: boolean;
  onToggle: () => void;
}) {
  return <WallSwitch position={position} wall="kitchen" on={on} onToggle={onToggle} isolator />;
}

function CookPot({ boiling, position }: { boiling: boolean; position: [number, number, number] }) {
  const steam = useRef<Group>(null);
  useFrame(({ clock }) => {
    const g = steam.current;
    if (!g) return;
    g.visible = boiling;
    if (!boiling) return;
    g.children.forEach((child, i) => {
      const t = (clock.elapsedTime * 0.7 + i * 0.22) % 1;
      child.position.y = 0.16 + t * 0.26;
      child.position.x = Math.sin(clock.elapsedTime * 2 + i) * 0.025;
      child.scale.setScalar((0.022 + t * 0.036) / 0.022);
      const mesh = child as Mesh;
      const mat = mesh.material as MeshStandardMaterial;
      if (mat) mat.opacity = 0.55 * (1 - t);
    });
  });
  return (
    <group position={position}>
      <FittedGltf
        url={ROOM_GLB.pot}
        maxSize={[0.22, 0.14, 0.22]}
        position={[0, 0.02, 0]}
        align="bottom"
        pin="center"
        fit="contain"
        envIntensity={1.2}
      />
      <group ref={steam} visible={boiling}>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} position={[0, 0.08, 0]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshStandardMaterial color="#f8fafc" transparent opacity={0.45} roughness={1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function TapWater({ x, y, z }: { x: number; y: number; z: number }) {
  const drops = useRef<Group>(null);
  useFrame(({ clock }) => {
    const g = drops.current;
    if (!g) return;
    g.children.forEach((child, i) => {
      const t = (clock.elapsedTime * 2.8 + i * 0.16) % 1;
      child.position.y = y + 0.18 - t * 0.28;
      child.scale.setScalar(0.65 + t * 0.55);
    });
  });
  return (
    <group>
      <mesh position={[x, y + 0.08, z]}>
        <cylinderGeometry args={[0.007, 0.011, 0.2, 8]} />
        <meshStandardMaterial color="#7dd3fc" transparent opacity={0.55} roughness={0.12} />
      </mesh>
      <group ref={drops}>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh key={i} position={[x, y + 0.18, z]}>
            <sphereGeometry args={[0.011, 8, 8]} />
            <meshStandardMaterial color="#bae6fd" transparent opacity={0.75} roughness={0.15} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function FridgeSurprise({ position }: { position: [number, number, number] }) {
  const spin = useRef<Group>(null);
  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.y += delta * 1.4;
  });
  return (
    <group position={position}>
      <group ref={spin}>
        <mesh position={[0, 0.08, 0]} castShadow>
          <sphereGeometry args={[0.07, 12, 10]} />
          <meshStandardMaterial color="#facc15" roughness={0.4} emissive="#facc15" emissiveIntensity={0.35} />
        </mesh>
      </group>
      <pointLight intensity={0.6} distance={1.6} color="#fde68a" />
      <Html center position={[0, 0.42, 0]} style={{ pointerEvents: 'none', width: 240 }}>
        <p className="rounded-md bg-black/80 px-2 py-1.5 text-center text-[11px] leading-snug text-white">
          Dedicated fridge circuit — a lighting or kitchen-power trip won&apos;t lose the cold stuff.
        </p>
      </Html>
    </group>
  );
}

type KitchenProps = {
  powerLive: boolean;
  fridgeLive: boolean;
  ovenLive: boolean;
  hobLive: boolean;
  isolatorOn: boolean;
  fridgeOpen: boolean;
  toasterPop: boolean;
  sinkOn: boolean;
  boiling: boolean;
  openById: Partial<Record<KitchenInteractId, boolean>>;
  onToggle: (id: KitchenInteractId) => void;
  onToggleFridge: () => void;
  onToggleToaster: () => void;
  onToggleIsolator: () => void;
  onToggleSink: () => void;
  onToggleBoil: () => void;
};

export function KitchenRun({
  powerLive,
  fridgeLive,
  ovenLive,
  hobLive,
  isolatorOn,
  fridgeOpen,
  toasterPop,
  sinkOn,
  boiling,
  openById = {},
  onToggle = () => {},
  onToggleFridge,
  onToggleToaster,
  onToggleIsolator,
  onToggleSink,
  onToggleBoil,
}: KitchenProps) {
  const sink = KITCHEN_BAYS.sink;
  const cabA = KITCHEN_BAYS.cabA;
  const cook = KITCHEN_BAYS.cook;
  const cabL = KITCHEN_BAYS.cabL;
  const dw = KITCHEN_BAYS.dw;
  const cabR = KITCHEN_BAYS.cabR;
  const fridge = KITCHEN_BAYS.fridge;

  const joineryEnd = fridge.x;
  const cookX = FIXTURES.cooktop.x;
  const toasterX = FIXTURES.toaster.x;
  const benchY = KITCHEN.benchH;
  const benchTop = KITCHEN.benchH + BENCH_T;
  const benchZ = 0.32;
  const splashY = KITCHEN.splashGpoY;
  const splashZ = 0.04;
  const hood = FIXTURES.rangehood;

  const ovenOpen = !!openById.oven;
  const dwOpen = !!openById.dishwasher;
  const drawersOpen = !!openById['cabA-base'];

  return (
    <group>
      <Kick x={sink.x} w={sink.w + cabA.w + cook.w} />
      <Kick x={cabL.x} w={cabL.w} />
      <Kick x={dw.x} w={dw.w} />
      <Kick x={cabR.x} w={cabR.w} />
      <BenchRun startX={KITCHEN.startX} endX={joineryEnd} sinkX={FIXTURES.sink.x} />
      <mesh position={[(KITCHEN.startX + joineryEnd) / 2, KITCHEN.benchH - 0.006, KITCHEN.benchDepth / 2]} receiveShadow>
        <boxGeometry args={[joineryEnd - KITCHEN.startX + 0.01, 0.014, KITCHEN.benchDepth]} />
        <meshStandardMaterial color={doorCol} roughness={0.48} />
      </mesh>
      <TiledSplash x={KITCHEN.startX} w={joineryEnd - KITCHEN.startX} />

      <DoorCabinet x={sink.x} w={sink.w} y={KITCHEN.kickH} h={BASE_H + 0.012} depth={KITCHEN.benchDepth} open={!!openById['sink-base']} />
      <DrawerBay x={cabA.x} w={cabA.w} open={drawersOpen} />
      <DoorCabinet x={cabL.x} w={cabL.w} y={KITCHEN.kickH} h={BASE_H + 0.012} depth={KITCHEN.benchDepth} open={!!openById['cabL-base']} />
      <DoorCabinet x={cabR.x} w={cabR.w} y={KITCHEN.kickH} h={BASE_H + 0.012} depth={KITCHEN.benchDepth} open={!!openById['cabR-base']} />

      <DoorCabinet x={sink.x} w={sink.w} y={KITCHEN.upperY} h={KITCHEN.upperH} depth={KITCHEN.upperDepth} open={!!openById['sink-upper']} />
      <DoorCabinet x={cabA.x} w={cabA.w} y={KITCHEN.upperY} h={KITCHEN.upperH} depth={KITCHEN.upperDepth} open={!!openById['cabA-upper']} />
      <DoorCabinet x={cabL.x} w={cabL.w} y={KITCHEN.upperY} h={KITCHEN.upperH} depth={KITCHEN.upperDepth} open={!!openById['cabL-upper']} />
      <DoorCabinet x={dw.x} w={dw.w} y={KITCHEN.upperY} h={KITCHEN.upperH} depth={KITCHEN.upperDepth} open={!!openById['dw-upper']} />
      <DoorCabinet x={cabR.x} w={cabR.w} y={KITCHEN.upperY} h={KITCHEN.upperH} depth={KITCHEN.upperDepth} open={!!openById['cabR-upper']} />

      <FittedGltf
        url={ROOM_GLB.sink}
        maxSize={[0.78, 0.22, 0.48]}
        position={[FIXTURES.sink.x, 0.71, SINK_CUT.cz]}
        preScale={0.01}
        fit="width"
        envIntensity={1.15}
      />
      <FittedGltf
        url={ROOM_GLB.tap}
        maxSize={[0.22, 0.32, 0.22]}
        position={[FIXTURES.sink.x, benchTop, 0.16]}
        envIntensity={1.35}
      />
      <FittedGltf
        url={ROOM_GLB.cooktop}
        maxSize={[0.58, 0.05, 0.52]}
        position={[FIXTURES.cooktop.x, benchY + 0.04, FIXTURES.cooktop.z]}
        fit="width"
        envIntensity={1.35}
      />
      <HingedAppliance
        url={ROOM_GLB.oven}
        maxSize={[cook.w - 0.02, APPLIANCE_BODY_H, FRONT]}
        position={[FIXTURES.oven.x, KITCHEN.kickH, FRONT]}
        rotation={[0, -Math.PI / 2, 0]}
        pin="front"
        preScale={0.001}
        fit="contain"
        envIntensity={1.35}
        open={ovenOpen}
        doorMatch={/glass/i}
        openAngle={1.15}
      />
      <FrontFill x={cook.x} w={cook.w} y={APPLIANCE_FILL_Y} h={FASCIA_H} />
      <FittedGltf
        url={ROOM_GLB.hood}
        maxSize={[cook.w, KITCHEN.upperH + 0.04, 0.5]}
        position={[FIXTURES.rangehood.x, KITCHEN.upperY, 0.26]}
        align="bottom"
        pin="center"
        fit="contain"
        envIntensity={1.45}
      />
      <FittedGltf
        url={ROOM_GLB.dishwasher}
        maxSize={[dw.w - 0.012, APPLIANCE_BODY_H, FACE - 0.04]}
        position={[dw.x + dw.w / 2, KITCHEN.kickH, FRONT - 0.028]}
        align="bottom"
        pin="front"
        fit="contain"
        envIntensity={1.35}
      />
      <DishwasherDoor x={dw.x} w={dw.w} open={dwOpen} />
      <FrontFill x={dw.x} w={dw.w} y={APPLIANCE_FILL_Y} h={FASCIA_H} />
      <FittedGltf
        url={ROOM_GLB.fridge}
        maxSize={[0.8, 1.64, 0.62]}
        position={[FIXTURES.fridge.x, 0, 0.34]}
        envIntensity={1.3}
      />
      <FittedGltf
        url={ROOM_GLB.toaster}
        maxSize={[0.26, 0.17, 0.15]}
        position={[toasterX, benchY + 0.042, 0.34]}
        envIntensity={1.15}
      />

      <Hit onToggle={onToggleSink} size={[0.55, 0.24, 0.4]} position={[FIXTURES.sink.x, benchY + 0.12, 0.55]} />
      <Hit onToggle={onToggleBoil} size={[0.56, 0.1, 0.48]} position={[cookX, benchY + 0.08, benchZ]} />
      <Hit onToggle={() => onToggle('oven')} size={[cook.w - 0.04, 0.55, 0.22]} position={[FIXTURES.oven.x, 0.42, 0.58]} />
      <Hit onToggle={() => onToggle('dishwasher')} size={[dw.w - 0.04, 0.7, 0.2]} position={[FIXTURES.dishwasher.x, 0.42, 0.58]} />
      <Hit onToggle={onToggleFridge} size={[0.72, 1.6, 0.22]} position={[FIXTURES.fridge.x, 0.95, 0.62]} />
      <Hit onToggle={() => onToggle('sink-base')} size={[0.7, 0.55, 0.16]} position={[0.68, 0.42, 0.58]} />
      <Hit onToggle={() => onToggle('cabA-base')} size={[0.4, 0.55, 0.16]} position={[1.3, 0.42, 0.58]} />
      <Hit onToggle={() => onToggle('cabL-base')} size={[0.8, 0.55, 0.16]} position={[2.58, 0.42, 0.58]} />
      <Hit onToggle={() => onToggle('cabR-base')} size={[0.8, 0.55, 0.16]} position={[4.08, 0.42, 0.58]} />
      <Hit onToggle={() => onToggle('sink-upper')} size={[0.7, 0.45, 0.14]} position={[0.68, 1.78, 0.36]} />
      <Hit onToggle={() => onToggle('cabA-upper')} size={[0.4, 0.45, 0.14]} position={[1.3, 1.78, 0.36]} />
      <Hit onToggle={() => onToggle('cabL-upper')} size={[0.8, 0.45, 0.14]} position={[2.58, 1.78, 0.36]} />
      <Hit onToggle={() => onToggle('dw-upper')} size={[0.52, 0.45, 0.14]} position={[3.33, 1.78, 0.36]} />
      <Hit onToggle={() => onToggle('cabR-upper')} size={[0.8, 0.45, 0.14]} position={[4.08, 1.78, 0.36]} />
      <Hit onToggle={onToggleToaster} size={[0.32, 0.22, 0.2]} position={[toasterX, benchY + 0.14, benchZ]} />

      <CookPot boiling={hobLive && boiling} position={[cookX, benchY + 0.1, 0.3]} />
      {sinkOn && <TapWater x={FIXTURES.sink.x} y={benchTop + 0.14} z={0.28} />}
      {ovenOpen && ovenLive && (
        <FittedGltf
          url={ROOM_GLB.roast}
          maxSize={[0.2, 0.08, 0.14]}
          position={[FIXTURES.oven.x, 0.4, 0.42]}
          align="bottom"
          envIntensity={1.1}
        />
      )}
      {fridgeOpen && fridgeLive && <FridgeSurprise position={[FIXTURES.fridge.x, 1.05, 0.72]} />}
      {toasterPop && (
        <>
          <mesh position={[toasterX - 0.04, benchY + 0.26, 0.34]} castShadow>
            <boxGeometry args={[0.07, 0.09, 0.02]} />
            <meshStandardMaterial color="#eab308" roughness={0.7} />
          </mesh>
          <mesh position={[toasterX + 0.04, benchY + 0.26, 0.34]} castShadow>
            <boxGeometry args={[0.07, 0.09, 0.02]} />
            <meshStandardMaterial color="#ca8a04" roughness={0.7} />
          </mesh>
        </>
      )}

      <WallGpo
        position={[FIXTURES.gpoDouble.x, splashY, splashZ]}
        live={powerLive}
        onToggle={powerLive ? onToggleToaster : undefined}
      />
      <WallGpo position={[FIXTURES.gpoSingle.x, splashY, splashZ]} live={powerLive} />
      <WallGpo position={[FIXTURES.dwGpo.x, HEIGHTS.gpo, splashZ]} live={powerLive} />
      <WallGpo position={[FIXTURES.fridgeGpo.x, splashY, splashZ]} live={fridgeLive} />
      <CookIsolator
        position={[FIXTURES.cookIsolator.x, splashY, splashZ]}
        on={isolatorOn}
        onToggle={onToggleIsolator}
      />

      {hobLive && boiling && (
        <pointLight position={[cookX, benchY + 0.18, 0.3]} intensity={0.18} distance={0.5} color="#fdba74" />
      )}
      {powerLive && <pointLight position={[hood.x, 1.48, 0.28]} intensity={0.55} distance={2.2} color="#f4f1ea" />}
      {powerLive && (
        <>
          <pointLight position={[sink.x + sink.w / 2, KITCHEN.upperY - 0.02, 0.22]} intensity={0.28} distance={1.4} color="#f4f1ea" />
          <pointLight position={[cabL.x + cabL.w / 2, KITCHEN.upperY - 0.02, 0.22]} intensity={0.28} distance={1.4} color="#f4f1ea" />
          <pointLight position={[cabR.x + cabR.w / 2, KITCHEN.upperY - 0.02, 0.22]} intensity={0.28} distance={1.4} color="#f4f1ea" />
        </>
      )}
      {powerLive && toasterPop && (
        <pointLight position={[toasterX, benchY + 0.26, 0.34]} intensity={0.35} distance={1.1} color="#fde68a" />
      )}
      {ovenOpen && ovenLive && (
        <pointLight position={[FIXTURES.oven.x, 0.48, 0.4]} intensity={0.35} distance={0.8} color="#fdba74" />
      )}
      {dwOpen && <pointLight position={[dw.x + dw.w / 2, 0.46, 0.42]} intensity={0.22} distance={0.7} color="#e8eef5" />}
    </group>
  );
}

loadKeptGltf(ROOM_GLB.fridge);
loadKeptGltf(ROOM_GLB.oven);
loadKeptGltf(ROOM_GLB.cooktop);
loadKeptGltf(ROOM_GLB.toaster);
loadKeptGltf(ROOM_GLB.sink);
loadKeptGltf(ROOM_GLB.tap);
loadKeptGltf(ROOM_GLB.gpoDouble);
loadKeptGltf(ROOM_GLB.cabinetDrawers);
loadKeptGltf(ROOM_GLB.cabinetDoors);
loadKeptGltf(ROOM_GLB.dishwasher);
loadKeptGltf(ROOM_GLB.hood);
loadKeptGltf(ROOM_GLB.pot);
loadKeptGltf(ROOM_GLB.roast);
