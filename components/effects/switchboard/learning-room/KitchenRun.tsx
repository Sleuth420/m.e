'use client';

import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Box3, Group, MathUtils, Mesh, MeshStandardMaterial, Object3D, Quaternion, Vector3 } from 'three';
import { onInteractiveClick, onInteractiveEnter, onInteractiveLeave } from '../interaction';
import { FittedGltf } from './FittedGltf';
import {
  JoineryBay,
  JoineryEndPanel,
  JoineryFascia,
  JoineryFridgeHousing,
  JoineryKick,
  JoineryOvenDrawer,
  JoineryPacker,
  JoinerySubtop,
} from './KitchenJoinery';
import { POLYHAVEN, ROOM_GLB } from './room-assets';
import { useRepeatingPbr } from './room-textures';
import { loadKeptGltf } from './useKeptGltf';
import { WallSwitch } from './WallSwitch';
import { FIXTURES, HEIGHTS, KITCHEN, KITCHEN_BAYS, type KitchenInteractId } from './room-layout';

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
const FACE = KITCHEN.benchDepth;
/** Center of overlay doors (hinge on FACE, 36 mm thick). */
const FRONT = FACE + 0.018;
const SINK_CUT = { w: 0.76, d: 0.46, cz: 0.3 } as const;
/** Built-in oven is 595 mm; leftover under the bench is an oak drawer + 16 mm rail. */
const RAIL_H = 0.016;
const OVEN_H = 0.595;
const OVEN_DRAWER_H = KITCHEN.benchH - KITCHEN.kickH - RAIL_H - OVEN_H;
const DW_H = KITCHEN.benchH - KITCHEN.kickH - RAIL_H;
const FILL = 0.018;
const PACK = 0.007;
const HOUSING_H = KITCHEN.upperY + KITCHEN.upperH;
/** Native French-door is 960×1818; width-fit into the 18 mm scribes, ~40 mm bulkhead left. */
const FRIDGE_H = HOUSING_H - 0.04;

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
  hide,
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
  hide?: RegExp;
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
      hide={hide}
      onReady={(root) => {
        pivot.current = hingeParts(root, doorMatch, extraMatch);
      }}
    />
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

  const fridgeW = fridge.w - FILL * 2;
  const fridgeLeft = fridge.x + FILL;
  const fridgeMid = fridgeLeft + fridgeW / 2;
  const ovenY = KITCHEN.kickH + OVEN_DRAWER_H;
  const gableDepth = KITCHEN.benchDepth + 0.018;
  const kickEnd = fridge.x;
  const ovenPackH = OVEN_H + RAIL_H;

  return (
    <group>
      <JoineryKick x={sink.x} w={kickEnd - sink.x} returns={false} />
      <JoineryEndPanel x={sink.x - FILL} w={FILL} h={KITCHEN.benchH} depth={gableDepth} />
      <JoineryEndPanel
        x={sink.x - FILL}
        w={FILL}
        y={KITCHEN.upperY}
        h={KITCHEN.upperH}
        depth={KITCHEN.upperDepth + 0.018}
      />
      <BenchRun startX={KITCHEN.startX} endX={joineryEnd} sinkX={FIXTURES.sink.x} />
      <JoinerySubtop x={KITCHEN.startX} w={joineryEnd - KITCHEN.startX} />
      <TiledSplash x={KITCHEN.startX} w={joineryEnd - KITCHEN.startX} />

      <JoineryBay
        x={sink.x}
        w={sink.w}
        y={0}
        h={KITCHEN.benchH}
        depth={KITCHEN.benchDepth}
        open={!!openById['sink-base']}
        kind="base"
      />
      <JoineryBay
        x={cabA.x}
        w={cabA.w}
        y={0}
        h={KITCHEN.benchH}
        depth={KITCHEN.benchDepth}
        open={drawersOpen}
        kind="base"
        drawers
      />
      <JoineryBay
        x={cabL.x}
        w={cabL.w}
        y={0}
        h={KITCHEN.benchH}
        depth={KITCHEN.benchDepth}
        open={!!openById['cabL-base']}
        kind="base"
      />
      <JoineryBay
        x={cabR.x}
        w={cabR.w}
        y={0}
        h={KITCHEN.benchH}
        depth={KITCHEN.benchDepth}
        open={!!openById['cabR-base']}
        kind="base"
      />

      <JoineryBay
        x={sink.x}
        w={sink.w}
        y={KITCHEN.upperY}
        h={KITCHEN.upperH}
        depth={KITCHEN.upperDepth}
        open={!!openById['sink-upper']}
        kind="upper"
      />
      <JoineryBay
        x={cabA.x}
        w={cabA.w}
        y={KITCHEN.upperY}
        h={KITCHEN.upperH}
        depth={KITCHEN.upperDepth}
        open={!!openById['cabA-upper']}
        kind="upper"
      />
      <JoineryBay
        x={cabL.x}
        w={cabL.w}
        y={KITCHEN.upperY}
        h={KITCHEN.upperH}
        depth={KITCHEN.upperDepth}
        open={!!openById['cabL-upper']}
        kind="upper"
      />
      <JoineryBay
        x={dw.x}
        w={dw.w}
        y={KITCHEN.upperY}
        h={KITCHEN.upperH}
        depth={KITCHEN.upperDepth}
        open={!!openById['dw-upper']}
        kind="upper"
      />
      <JoineryBay
        x={cabR.x}
        w={cabR.w}
        y={KITCHEN.upperY}
        h={KITCHEN.upperH}
        depth={KITCHEN.upperDepth}
        open={!!openById['cabR-upper']}
        kind="upper"
      />

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
        maxSize={[0.58, 0.06, 0.52]}
        position={[FIXTURES.cooktop.x, benchTop, FIXTURES.cooktop.z]}
        align="bottom"
        fit="width"
        envIntensity={1.35}
      />
      <JoineryOvenDrawer x={cook.x} w={cook.w} y={KITCHEN.kickH} h={OVEN_DRAWER_H} />
      <JoineryPacker x={cook.x} y={ovenY} h={ovenPackH} depth={FACE} />
      <JoineryPacker x={cook.x + cook.w - PACK} y={ovenY} h={ovenPackH} depth={FACE} />
      <HingedAppliance
        url={ROOM_GLB.oven}
        maxSize={[cook.w - PACK * 2 - 0.004, OVEN_H, 0.72]}
        position={[FIXTURES.oven.x, ovenY, FRONT]}
        rotation={[0, -Math.PI / 2, 0]}
        align="bottom"
        pin="front"
        preScale={0.001}
        fit="contain"
        envIntensity={1.4}
        open={ovenOpen}
        doorMatch={/glass/i}
        openAngle={1.15}
      />
      <JoineryFascia x={cook.x + PACK} w={cook.w - PACK * 2} y={KITCHEN.benchH - RAIL_H} h={RAIL_H} />
      <FittedGltf
        url={ROOM_GLB.hood}
        maxSize={[cook.w, KITCHEN.upperH + 0.02, KITCHEN.upperDepth + 0.22]}
        position={[FIXTURES.rangehood.x, KITCHEN.upperY, KITCHEN.upperDepth + 0.018]}
        align="bottom"
        pin="front"
        fit="width"
        envIntensity={1.5}
      />
      <JoineryPacker x={dw.x} y={KITCHEN.kickH} h={DW_H + RAIL_H} depth={FACE} />
      <JoineryPacker x={dw.x + dw.w - PACK} y={KITCHEN.kickH} h={DW_H + RAIL_H} depth={FACE} />
      <FittedGltf
        url={ROOM_GLB.dishwasher}
        maxSize={[dw.w - PACK * 2 - 0.004, DW_H - 0.004, 0.85]}
        position={[dw.x + dw.w / 2, KITCHEN.kickH + 0.002, FRONT]}
        align="bottom"
        pin="front"
        fit="contain"
        envIntensity={1.5}
      />
      <JoineryFascia x={dw.x + PACK} w={dw.w - PACK * 2} y={KITCHEN.benchH - RAIL_H} h={RAIL_H} />
      <JoineryFridgeHousing
        x={fridge.x}
        w={fridge.w}
        h={HOUSING_H}
        openingX={fridgeLeft}
        openingW={fridgeW}
        openingH={FRIDGE_H}
        depth={gableDepth}
      />
      <FittedGltf
        url={ROOM_GLB.fridge}
        maxSize={[fridgeW - 0.008, FRIDGE_H, 0.9]}
        position={[fridgeMid, 0, FRONT]}
        align="bottom"
        pin="front"
        fit="width"
        envIntensity={1.4}
      />
      <FittedGltf
        url={ROOM_GLB.toaster}
        maxSize={[0.26, 0.17, 0.15]}
        position={[toasterX, benchY + 0.042, 0.34]}
        envIntensity={1.15}
      />

      <Hit onToggle={onToggleSink} size={[0.55, 0.24, 0.4]} position={[FIXTURES.sink.x, benchY + 0.12, 0.55]} />
      <Hit onToggle={onToggleBoil} size={[0.56, 0.1, 0.48]} position={[cookX, benchY + 0.08, benchZ]} />
      <Hit onToggle={() => onToggle('oven')} size={[cook.w - 0.04, OVEN_H, 0.22]} position={[FIXTURES.oven.x, ovenY + OVEN_H / 2, 0.58]} />
      <Hit onToggle={() => onToggle('dishwasher')} size={[dw.w - 0.04, DW_H, 0.2]} position={[FIXTURES.dishwasher.x, KITCHEN.kickH + DW_H / 2, 0.58]} />
      <Hit onToggle={onToggleFridge} size={[fridgeW, FRIDGE_H, 0.22]} position={[fridgeMid, FRIDGE_H / 2, 0.64]} />
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
          position={[FIXTURES.oven.x, ovenY + 0.08, 0.42]}
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
loadKeptGltf(ROOM_GLB.dishwasher);
loadKeptGltf(ROOM_GLB.hood);
loadKeptGltf(ROOM_GLB.pot);
loadKeptGltf(ROOM_GLB.roast);
