'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Box3, DoubleSide, Group, MathUtils, Mesh, MeshStandardMaterial, Object3D, Quaternion, Vector3 } from 'three';
import { onInteractiveClick, onInteractiveEnter, onInteractiveLeave } from '../interaction';
import { dressKitchenProduct } from './appliance-dress';
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

const BENCH_T = 0.03;
const BENCH_Y = KITCHEN.benchH + BENCH_T / 2;
const FACE = KITCHEN.benchDepth;
/** Center of overlay doors (hinge on FACE, 18 mm thick). */
const FRONT = FACE + 0.018;
/** Marble hole sits under the rim so the cupboard never shows around the bowls. */
const SINK_CUT = { w: 0.72, d: 0.42, cz: 0.3 } as const;
/** Built-in oven is 595 mm; leftover under the bench is an oak drawer + 16 mm rail. */
const RAIL_H = 0.016;
const OVEN_H = 0.595;
const OVEN_DRAWER_H = KITCHEN.benchH - KITCHEN.kickH - RAIL_H - OVEN_H;
const DW_H = KITCHEN.benchH - KITCHEN.kickH - RAIL_H;
const FILL = 0.018;
const PACK = 0.01;
const HOUSING_H = KITCHEN.upperY + KITCHEN.upperH;
const FRIDGE_W = 0.91;
const FRIDGE_H = 1.82;

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
        roughness={0.38}
        metalness={0.06}
        envMapIntensity={1.05}
      />
    </mesh>
  );
}

/** Benchtop with a sink cutout so the bowls sit in the bench, not on it. */
function BenchRun({ startX, endX, sinkX }: { startX: number; endX: number; sinkX: number }) {
  const w = endX - startX;
  const maps = useRepeatingPbr(POLYHAVEN.marbleSlab, [Math.max(1.2, w / 2.1), 0.32]);
  const zMin = 0;
  const zMax = KITCHEN.benchDepth + 0.018;
  const cutL = sinkX - SINK_CUT.w / 2;
  const cutR = sinkX + SINK_CUT.w / 2;
  const cutBack = SINK_CUT.cz - SINK_CUT.d / 2;
  const cutFront = SINK_CUT.cz + SINK_CUT.d / 2;
  const frontT = 0.012;
  return (
    <group>
      <BenchSlab maps={maps} x0={startX - 0.004} x1={cutL} z0={zMin} z1={zMax} />
      <BenchSlab maps={maps} x0={cutR} x1={endX + 0.004} z0={zMin} z1={zMax} />
      <BenchSlab maps={maps} x0={cutL} x1={cutR} z0={zMin} z1={cutBack} />
      <BenchSlab maps={maps} x0={cutL} x1={cutR} z0={cutFront} z1={zMax} />
      <mesh position={[(startX + endX) / 2, BENCH_Y, zMax + frontT / 2]} castShadow receiveShadow>
        <boxGeometry args={[w + 0.008, BENCH_T, frontT]} />
        <meshStandardMaterial
          map={maps.map}
          normalMap={maps.normalMap}
          roughnessMap={maps.roughnessMap}
          roughness={0.38}
          metalness={0.06}
          envMapIntensity={1.05}
        />
      </mesh>
    </group>
  );
}

function TiledSplash({ x, w, h = 0.45 }: { x: number; w: number; h?: number }) {
  const maps = useRepeatingPbr(POLYHAVEN.tiles, [w / 0.62, h / 0.5]);
  return (
    <mesh position={[x + w / 2, KITCHEN.benchH + BENCH_T + h / 2, 0.012]} receiveShadow>
      <boxGeometry args={[w, h, 0.008]} />
      <meshStandardMaterial
        map={maps.map}
        normalMap={maps.normalMap}
        roughnessMap={maps.roughnessMap}
        roughness={0.72}
        metalness={0.02}
        envMapIntensity={0.85}
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
  pinPad,
  fit,
  preScale,
  envIntensity,
  hide,
  prepare,
}: {
  url: string;
  maxSize: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  align?: 'bottom' | 'center';
  pin?: 'center' | 'min' | 'front' | 'back';
  pinPad?: number;
  fit?: 'contain' | 'width' | 'height' | 'stretch';
  preScale?: number;
  envIntensity?: number;
  hide?: RegExp;
  prepare?: (root: Object3D) => void;
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
      pinPad={pinPad}
      fit={fit}
      preScale={preScale}
      envIntensity={envIntensity}
      hide={hide}
      prepare={prepare ?? dressKitchenProduct}
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
        envIntensity={live ? 1.1 : 1}
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
      child.scale.setScalar((0.014 + t * 0.028) / 0.014);
      const mesh = child as Mesh;
      const mat = mesh.material as MeshStandardMaterial;
      if (mat) mat.opacity = 0.28 * (1 - t);
    });
  });
  return (
    <group position={position}>
      <FittedGltf
        url={ROOM_GLB.pot}
        maxSize={[0.22, 0.14, 0.22]}
        position={[0, 0, 0]}
        align="bottom"
        pin="center"
        fit="contain"
        envIntensity={1.2}
      />
      <group ref={steam} visible={boiling}>
        {Array.from({ length: 5 }, (_, i) => (
          <mesh key={i} position={[0, 0.08, 0]}>
            <sphereGeometry args={[0.014, 8, 8]} />
            <meshStandardMaterial color="#eef2f6" transparent opacity={0.22} roughness={1} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Sink GLB is FrontSide and the bowl floors cull when you look down. */
function dressSink(root: Object3D) {
  dressKitchenProduct(root);
  root.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of mats) {
      const m = mat as MeshStandardMaterial;
      if (!m) continue;
      m.side = DoubleSide;
      m.transparent = false;
      m.opacity = 1;
      m.depthWrite = true;
      m.metalness = Math.max(m.metalness, 0.86);
      m.roughness = 0.28;
      if (!m.map) m.color.set('#c8ccd0');
      m.needsUpdate = true;
    }
  });
}

function SteelBasinMat() {
  return (
    <meshStandardMaterial
      color="#c9d0d6"
      metalness={0.92}
      roughness={0.2}
      envMapIntensity={1.2}
      side={DoubleSide}
    />
  );
}

/** Real wells — floor + walls — so looking down never falls through to oak. */
function BasinWell({ x, w, d, depth }: { x: number; w: number; d: number; depth: number }) {
  const t = 0.01;
  const z = SINK_CUT.cz;
  const top = KITCHEN.benchH + BENCH_T - 0.004;
  const floorY = top - depth;
  const midY = floorY + depth / 2;
  return (
    <group>
      <mesh position={[x, floorY + t / 2, z]} receiveShadow>
        <boxGeometry args={[w, t, d]} />
        <SteelBasinMat />
      </mesh>
      <mesh position={[x, midY, z - d / 2 + t / 2]} receiveShadow>
        <boxGeometry args={[w, depth, t]} />
        <SteelBasinMat />
      </mesh>
      <mesh position={[x, midY, z + d / 2 - t / 2]} receiveShadow>
        <boxGeometry args={[w, depth, t]} />
        <SteelBasinMat />
      </mesh>
      <mesh position={[x - w / 2 + t / 2, midY, z]} receiveShadow>
        <boxGeometry args={[t, depth, d]} />
        <SteelBasinMat />
      </mesh>
      <mesh position={[x + w / 2 - t / 2, midY, z]} receiveShadow>
        <boxGeometry args={[t, depth, d]} />
        <SteelBasinMat />
      </mesh>
    </group>
  );
}

function SinkBasins() {
  const cx = FIXTURES.sink.x;
  const floorY = KITCHEN.benchH + BENCH_T - 0.185;
  return (
    <group>
      <mesh position={[cx, floorY, SINK_CUT.cz]} receiveShadow>
        <boxGeometry args={[SINK_CUT.w - 0.03, 0.018, SINK_CUT.d - 0.03]} />
        <SteelBasinMat />
      </mesh>
      <BasinWell x={cx - 0.155} w={0.36} d={0.32} depth={0.17} />
      <BasinWell x={cx + 0.175} w={0.3} d={0.28} depth={0.15} />
    </group>
  );
}

function TapWater({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <mesh position={[x, y + 0.02, z]}>
      <cylinderGeometry args={[0.004, 0.006, 0.22, 8]} />
      <meshStandardMaterial color="#9ec9de" transparent opacity={0.38} roughness={0.08} metalness={0.05} />
    </mesh>
  );
}

function FridgeInterior({ position }: { position: [number, number, number] }) {
  return <pointLight position={position} intensity={0.45} distance={1.4} color="#f3efe6" />;
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

  const fridgeLeft = fridge.x + (fridge.w - FRIDGE_W) / 2;
  const fridgeMid = fridgeLeft + FRIDGE_W / 2;
  const ovenY = KITCHEN.kickH + OVEN_DRAWER_H;
  const gableDepth = KITCHEN.benchDepth + 0.018;
  const kickEnd = fridge.x;

  return (
    <group>
      <JoineryKick x={sink.x - FILL} w={kickEnd - (sink.x - FILL)} returns />
      <JoineryEndPanel x={sink.x - FILL} w={FILL} h={KITCHEN.benchH} depth={gableDepth} />
      <JoineryEndPanel
        x={sink.x - FILL}
        w={FILL}
        y={KITCHEN.upperY}
        h={KITCHEN.upperH}
        depth={KITCHEN.upperDepth + 0.018}
      />
      <BenchRun startX={KITCHEN.startX} endX={joineryEnd} sinkX={FIXTURES.sink.x} />
      <JoinerySubtop
        x={KITCHEN.startX}
        w={joineryEnd - KITCHEN.startX}
        cutX={sink.x}
        cutW={sink.w}
        cutZ0={0}
        cutZ1={KITCHEN.benchDepth}
      />
      <TiledSplash x={KITCHEN.startX} w={joineryEnd - KITCHEN.startX} />

      <JoineryBay
        x={sink.x}
        w={sink.w}
        y={0}
        h={KITCHEN.benchH}
        depth={KITCHEN.benchDepth}
        open={!!openById['sink-base']}
        kind="base"
        openTop
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
        position={[FIXTURES.sink.x, benchTop + 0.003, SINK_CUT.cz]}
        preScale={0.01}
        fit="width"
        align="top"
        prepare={dressSink}
        envIntensity={1}
      />
      <SinkBasins />
      <FittedGltf
        url={ROOM_GLB.tap}
        maxSize={[0.22, 0.32, 0.22]}
        position={[FIXTURES.sink.x, benchTop, 0.16]}
        prepare={dressKitchenProduct}
        envIntensity={1}
      />
      <FittedGltf
        url={ROOM_GLB.cooktop}
        maxSize={[0.58, 0.06, 0.52]}
        position={[FIXTURES.cooktop.x, benchTop, FIXTURES.cooktop.z]}
        align="bottom"
        fit="width"
        envIntensity={1}
      />
      <JoineryOvenDrawer x={cook.x} w={cook.w} y={KITCHEN.kickH} h={OVEN_DRAWER_H} />
      <HingedAppliance
        url={ROOM_GLB.oven}
        maxSize={[cook.w - 0.008, OVEN_H, 0.72]}
        position={[FIXTURES.oven.x, ovenY, FRONT]}
        rotation={[0, -Math.PI / 2, 0]}
        align="bottom"
        pin="front"
        pinPad={0}
        preScale={0.001}
        fit="width"
        envIntensity={1}
        open={ovenOpen}
        doorMatch={/glass/i}
        openAngle={1.15}
      />
      <JoineryPacker x={cook.x} y={ovenY} h={OVEN_H} depth={KITCHEN.benchDepth} />
      <JoineryPacker x={cook.x + cook.w - 0.007} y={ovenY} h={OVEN_H} depth={KITCHEN.benchDepth} />
      <JoineryFascia x={cook.x + PACK} w={cook.w - PACK * 2} y={KITCHEN.benchH - RAIL_H} h={RAIL_H} />
      <mesh position={[FIXTURES.rangehood.x, KITCHEN.upperY + KITCHEN.upperH / 2, 0.046]}>
        <boxGeometry args={[cook.w - 0.04, KITCHEN.upperH - 0.02, 0.068]} />
        <meshStandardMaterial color="#eceae4" roughness={0.94} metalness={0.02} />
      </mesh>
      <FittedGltf
        url={ROOM_GLB.hood}
        maxSize={[cook.w, KITCHEN.upperH + 0.04, KITCHEN.upperDepth + 0.24]}
        position={[FIXTURES.rangehood.x, KITCHEN.upperY, 0.08]}
        align="bottom"
        pin="back"
        fit="width"
        prepare={dressKitchenProduct}
        envIntensity={1}
      />
      <FittedGltf
        url={ROOM_GLB.dishwasher}
        maxSize={[dw.w - 0.01, DW_H - 0.008, 0.58]}
        position={[dw.x + dw.w / 2, KITCHEN.kickH + 0.002, FRONT]}
        align="bottom"
        pin="front"
        pinPad={0.04}
        fit="width"
        envIntensity={1}
      />
      <JoineryFascia x={dw.x + PACK} w={dw.w - PACK * 2} y={KITCHEN.benchH - RAIL_H} h={RAIL_H} />
      <JoineryFridgeHousing
        x={fridge.x}
        w={fridge.w}
        h={HOUSING_H}
        openingX={fridgeLeft}
        openingW={FRIDGE_W}
        openingH={FRIDGE_H}
        depth={gableDepth}
      />
      <FittedGltf
        url={ROOM_GLB.fridge}
        maxSize={[1.02, FRIDGE_H, 0.72]}
        position={[fridgeMid, 0, FRONT]}
        align="bottom"
        pin="front"
        pinPad={0.16}
        fit="height"
        prepare={dressKitchenProduct}
        envIntensity={1}
      />
      <FittedGltf
        url={ROOM_GLB.toaster}
        maxSize={[0.26, 0.17, 0.15]}
        position={[toasterX, benchY + 0.042, 0.34]}
        prepare={dressKitchenProduct}
        envIntensity={1}
      />

      <Hit onToggle={onToggleSink} size={[0.55, 0.24, 0.4]} position={[FIXTURES.sink.x, benchY + 0.12, 0.55]} />
      <Hit onToggle={onToggleBoil} size={[0.56, 0.1, 0.48]} position={[cookX, benchY + 0.08, benchZ]} />
      <Hit onToggle={() => onToggle('oven')} size={[cook.w - 0.04, OVEN_H, 0.22]} position={[FIXTURES.oven.x, ovenY + OVEN_H / 2, 0.58]} />
      <Hit onToggle={() => onToggle('dishwasher')} size={[dw.w - 0.04, DW_H, 0.2]} position={[FIXTURES.dishwasher.x, KITCHEN.kickH + DW_H / 2, 0.58]} />
      <Hit onToggle={onToggleFridge} size={[FRIDGE_W, FRIDGE_H, 0.22]} position={[fridgeMid, FRIDGE_H / 2, 0.64]} />
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

      <CookPot boiling={hobLive && boiling} position={[cookX, benchTop + 0.01, FIXTURES.cooktop.z]} />
      {sinkOn && <TapWater x={FIXTURES.sink.x} y={benchTop + 0.14} z={0.28} />}
      {ovenOpen && ovenLive && (
        <FittedGltf
          url={ROOM_GLB.roast}
          maxSize={[0.2, 0.08, 0.14]}
          position={[FIXTURES.oven.x, ovenY + 0.08, 0.42]}
          align="bottom"
          envIntensity={1}
        />
      )}
      {fridgeOpen && fridgeLive && <FridgeInterior position={[fridgeMid, 1.05, 0.52]} />}
      {toasterPop && (
        <>
          <mesh position={[toasterX - 0.038, benchY + 0.24, 0.34]} castShadow>
            <boxGeometry args={[0.062, 0.08, 0.016]} />
            <meshStandardMaterial color="#c4a06a" roughness={0.88} metalness={0.02} />
          </mesh>
          <mesh position={[toasterX + 0.038, benchY + 0.24, 0.34]} castShadow>
            <boxGeometry args={[0.062, 0.08, 0.016]} />
            <meshStandardMaterial color="#b08958" roughness={0.88} metalness={0.02} />
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
