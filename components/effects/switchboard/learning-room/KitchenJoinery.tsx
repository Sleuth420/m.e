'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, type ReactNode } from 'react';
import { Group, MathUtils } from 'three';
import { POLYHAVEN } from './room-assets';
import { KITCHEN } from './room-layout';
import { useSizedPbr } from './room-textures';

/** Light oak tint — keeps Poly Haven kitchen wood in the same family as the marble bench. */
export const JOINERY = '#efe6d8';
const JOINERY_IN = '#cbbba6';
const KICK = '#1c1d1f';
const STEEL = '#c5c9ce';

const PANEL = 0.018;
const REVEAL = 0.002;
const STILE = 0.062;
const DOOR_T = 0.018;
const KICK_RECESS = 0.048;
const HANDLE_LEN = 0.152;
const HANDLE_R = 0.006;
const HANDLE_PROJ = 0.03;
const WOOD_TILE = 0.48;

function WoodMat({
  w,
  h,
  grain,
  interior = false,
  panel = false,
}: {
  w: number;
  h: number;
  grain: 'v' | 'h';
  interior?: boolean;
  panel?: boolean;
}) {
  const maps = useSizedPbr(
    POLYHAVEN.oakVeneer,
    [Math.max(0.04, w), Math.max(0.04, h)],
    WOOD_TILE,
    grain === 'h' ? Math.PI / 2 : 0,
  );
  const tint = interior ? JOINERY_IN : panel ? '#e4d7c6' : JOINERY;
  return (
    <meshStandardMaterial
      map={maps.map}
      normalMap={maps.normalMap}
      roughnessMap={maps.roughnessMap}
      color={tint}
      roughness={1}
      metalness={0.02}
      envMapIntensity={interior ? 0.7 : panel ? 0.95 : 1.08}
      normalScale={[0.22, 0.22]}
    />
  );
}

function SteelMat() {
  return <meshStandardMaterial color={STEEL} roughness={0.28} metalness={0.92} envMapIntensity={1.65} />;
}

function Box({
  w,
  h,
  d,
  position,
  interior,
  panel,
  grain = 'v',
  uvW,
  uvH,
}: {
  w: number;
  h: number;
  d: number;
  position: [number, number, number];
  interior?: boolean;
  panel?: boolean;
  grain?: 'v' | 'h';
  uvW?: number;
  uvH?: number;
}) {
  const u = uvW ?? w;
  const v = uvH ?? h;
  if (w < 0.004 || h < 0.004 || d < 0.004) return null;
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <WoodMat w={u} h={v} grain={grain} interior={interior} panel={panel} />
    </mesh>
  );
}

/** Stainless D-handle. Vertical on doors, horizontal on drawers. */
function BarHandle({
  position,
  vertical,
  length = HANDLE_LEN,
}: {
  position: [number, number, number];
  vertical: boolean;
  length?: number;
}) {
  const span = length * 0.38;
  return (
    <group position={position}>
      <mesh rotation={vertical ? [0, 0, 0] : [0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[HANDLE_R, HANDLE_R, length, 18]} />
        <SteelMat />
      </mesh>
      {([-span, span] as const).map((off) => (
        <mesh
          key={off}
          position={vertical ? [0, off, -HANDLE_PROJ / 2] : [off, 0, -HANDLE_PROJ / 2]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[HANDLE_R * 0.78, HANDLE_R * 0.78, HANDLE_PROJ, 12]} />
          <SteelMat />
        </mesh>
      ))}
    </group>
  );
}

function ShakerLeaf({ w, h }: { w: number; h: number }) {
  const f = Math.min(STILE, w * 0.28, h * 0.28);
  const inset = 0.006;
  const innerW = w - 2 * f;
  const innerH = h - 2 * f;
  return (
    <group>
      <Box w={f} h={h} d={DOOR_T} position={[f / 2, h / 2, DOOR_T / 2]} grain="v" />
      <Box w={f} h={h} d={DOOR_T} position={[w - f / 2, h / 2, DOOR_T / 2]} grain="v" />
      <Box w={innerW} h={f} d={DOOR_T} position={[w / 2, h - f / 2, DOOR_T / 2]} grain="h" />
      <Box w={innerW} h={f} d={DOOR_T} position={[w / 2, f / 2, DOOR_T / 2]} grain="h" />
      <Box
        w={innerW + 0.001}
        h={innerH + 0.001}
        d={DOOR_T - inset}
        position={[w / 2, h / 2, (DOOR_T - inset) / 2]}
        grain="v"
        panel
      />
    </group>
  );
}

function HingedDoor({
  x,
  y,
  z,
  w,
  h,
  hinge,
  open,
  handle,
}: {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  hinge: 'left' | 'right';
  open: boolean;
  handle: 'left' | 'right';
}) {
  const pivot = useRef<Group>(null);
  const dir = hinge === 'left' ? -1 : 1;
  useFrame((_, delta) => {
    if (!pivot.current) return;
    pivot.current.rotation.y = MathUtils.damp(pivot.current.rotation.y, open ? dir * 1.22 : 0, 8, delta);
  });
  const originX = hinge === 'left' ? x : x + w;
  const inset = 0.036;
  const hx = handle === 'left' ? inset : w - inset;
  return (
    <group ref={pivot} position={[originX, y, z]}>
      <group position={[hinge === 'left' ? 0 : -w, 0, 0]}>
        <ShakerLeaf w={w} h={h} />
        <BarHandle position={[hx, h * 0.5, DOOR_T + HANDLE_PROJ]} vertical />
      </group>
    </group>
  );
}

function Carcass({
  x,
  y,
  w,
  h,
  depth,
  kick = 0,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  depth: number;
  kick?: number;
}) {
  const y0 = y + kick;
  const ih = h - kick;
  const back = PANEL * 0.6;
  const cx = x + w / 2;
  const zMid = depth / 2;
  const innerW = w - 2 * PANEL;
  return (
    <group>
      <Box
        w={PANEL}
        h={ih}
        d={depth}
        position={[x + PANEL / 2, y0 + ih / 2, zMid]}
        grain="v"
        uvW={depth}
        uvH={ih}
      />
      <Box
        w={PANEL}
        h={ih}
        d={depth}
        position={[x + w - PANEL / 2, y0 + ih / 2, zMid]}
        grain="v"
        uvW={depth}
        uvH={ih}
      />
      <Box
        w={innerW}
        h={PANEL}
        d={depth}
        position={[cx, y0 + PANEL / 2, zMid]}
        interior
        grain="h"
        uvW={innerW}
        uvH={depth}
      />
      <Box
        w={innerW}
        h={PANEL}
        d={depth}
        position={[cx, y0 + ih - PANEL / 2, zMid]}
        interior
        grain="h"
        uvW={innerW}
        uvH={depth}
      />
      <Box
        w={innerW}
        h={ih - 2 * PANEL}
        d={back}
        position={[cx, y0 + ih / 2, back / 2]}
        interior
        grain="v"
      />
      <Box
        w={innerW - 0.004}
        h={PANEL * 0.7}
        d={depth - back - 0.04}
        position={[cx, y0 + ih * 0.48, zMid + 0.01]}
        interior
        grain="h"
        uvW={innerW}
        uvH={depth}
      />
    </group>
  );
}

function SlabDrawer({ w, h }: { w: number; h: number }) {
  return <Box w={w} h={h} d={DOOR_T} position={[w / 2, h / 2, DOOR_T / 2]} grain="h" />;
}

function KickMat() {
  return <meshStandardMaterial color={KICK} roughness={0.48} metalness={0.12} envMapIntensity={0.55} />;
}

/** Recessed vinyl plinth — a 16 mm front panel, not a charcoal block filling the void. */
export function JoineryKick({ x, w }: { x: number; w: number }) {
  const t = 0.016;
  const frontZ = KITCHEN.benchDepth + DOOR_T - KICK_RECESS;
  const h = KITCHEN.kickH - 0.003;
  const y = h / 2 + 0.001;
  return (
    <group>
      <mesh position={[x + w / 2, y, frontZ - t / 2]} castShadow receiveShadow>
        <boxGeometry args={[w, h, t]} />
        <KickMat />
      </mesh>
      <mesh position={[x + t / 2, y, (frontZ - t) / 2]} castShadow receiveShadow>
        <boxGeometry args={[t, h, Math.max(0.02, frontZ - t)]} />
        <KickMat />
      </mesh>
      <mesh position={[x + w - t / 2, y, (frontZ - t) / 2]} castShadow receiveShadow>
        <boxGeometry args={[t, h, Math.max(0.02, frontZ - t)]} />
        <KickMat />
      </mesh>
    </group>
  );
}

export function JoineryFascia({
  x,
  w,
  y,
  h,
  depth,
}: {
  x: number;
  w: number;
  y: number;
  h: number;
  depth?: number;
}) {
  if (h < 0.006) return null;
  const d = depth ?? KITCHEN.benchDepth + DOOR_T;
  return (
    <Box w={w - REVEAL} h={h - REVEAL} d={d} position={[x + w / 2, y + h / 2, d / 2]} grain="v" />
  );
}

/** Finished gable / scribe filler, floor to a given height. */
export function JoineryEndPanel({
  x,
  w,
  y = 0,
  h,
  depth,
}: {
  x: number;
  w: number;
  y?: number;
  h: number;
  depth: number;
}) {
  if (w < 0.006 || h < 0.02) return null;
  return (
    <Box
      w={w}
      h={h}
      d={depth}
      position={[x + w / 2, y + h / 2, depth / 2]}
      grain="v"
      uvW={depth}
      uvH={h}
    />
  );
}

/** Single oak drawer under a built-in oven — fills the hole the appliance doesn't. */
export function JoineryOvenDrawer({ x, w, y, h }: { x: number; w: number; y: number; h: number }) {
  const depth = KITCHEN.benchDepth;
  const frontW = w - REVEAL * 2;
  const frontH = h - REVEAL * 2;
  return (
    <group>
      <Box
        w={PANEL}
        h={h}
        d={depth}
        position={[x + PANEL / 2, y + h / 2, depth / 2]}
        uvW={depth}
        uvH={h}
      />
      <Box
        w={PANEL}
        h={h}
        d={depth}
        position={[x + w - PANEL / 2, y + h / 2, depth / 2]}
        uvW={depth}
        uvH={h}
      />
      <Box
        w={w - 2 * PANEL}
        h={PANEL}
        d={depth}
        position={[x + w / 2, y + PANEL / 2, depth / 2]}
        interior
        grain="h"
      />
      <Box
        w={w - 2 * PANEL}
        h={h - PANEL}
        d={PANEL * 0.6}
        position={[x + w / 2, y + PANEL + (h - PANEL) / 2, PANEL * 0.3]}
        interior
      />
      <group position={[x + REVEAL, y + REVEAL, depth]}>
        <SlabDrawer w={frontW} h={frontH} />
        <BarHandle
          position={[frontW / 2, frontH / 2, DOOR_T + HANDLE_PROJ]}
          vertical={false}
          length={Math.min(0.16, frontW * 0.42)}
        />
      </group>
    </group>
  );
}

/** 14 mm oak strip under the marble so the bench isn't floating on a flat hex. */
export function JoinerySubtop({ x, w }: { x: number; w: number }) {
  return (
    <Box
      w={w + 0.01}
      h={0.014}
      d={KITCHEN.benchDepth}
      position={[x + w / 2, KITCHEN.benchH - 0.006, KITCHEN.benchDepth / 2]}
      grain="h"
      uvW={w}
      uvH={KITCHEN.benchDepth}
    />
  );
}

export function JoineryBay({
  x,
  w,
  y,
  h,
  depth,
  open,
  kind,
  drawers = false,
}: {
  x: number;
  w: number;
  y: number;
  h: number;
  depth: number;
  open: boolean;
  kind: 'base' | 'upper';
  drawers?: boolean;
}) {
  const kick = kind === 'base' ? KITCHEN.kickH : 0;
  const doorY = y + kick + REVEAL;
  const doorH = h - kick - REVEAL * 2;
  const doorZ = depth;
  const pair = w >= 0.55 && !drawers;
  const doorW = pair ? (w - REVEAL * 3) / 2 : w - REVEAL * 2;
  const leftX = x + REVEAL;
  const slide = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!slide.current) return;
    slide.current.position.z = MathUtils.damp(slide.current.position.z, open && drawers ? 0.22 : 0, 8, delta);
  });

  let fronts: ReactNode = null;
  if (drawers) {
    const n = 4;
    const gaps = REVEAL * (n + 1);
    const dh = (doorH - gaps) / n;
    fronts = (
      <group ref={slide}>
        {Array.from({ length: n }, (_, i) => {
          const dy = doorY + REVEAL + i * (dh + REVEAL);
          return (
            <group key={i} position={[leftX, dy, doorZ]}>
              <SlabDrawer w={doorW} h={dh} />
              <BarHandle
                position={[doorW / 2, dh / 2, DOOR_T + HANDLE_PROJ]}
                vertical={false}
                length={Math.min(0.14, doorW * 0.42)}
              />
            </group>
          );
        })}
      </group>
    );
  } else if (pair) {
    fronts = (
      <>
        <HingedDoor x={leftX} y={doorY} z={doorZ} w={doorW} h={doorH} hinge="left" handle="right" open={open} />
        <HingedDoor
          x={leftX + doorW + REVEAL}
          y={doorY}
          z={doorZ}
          w={doorW}
          h={doorH}
          hinge="right"
          handle="left"
          open={open}
        />
      </>
    );
  } else {
    fronts = <HingedDoor x={leftX} y={doorY} z={doorZ} w={doorW} h={doorH} hinge="left" handle="right" open={open} />;
  }

  return (
    <group>
      <Carcass x={x} y={y} w={w} h={h} depth={depth - 0.004} kick={kick} />
      {fronts}
    </group>
  );
}
