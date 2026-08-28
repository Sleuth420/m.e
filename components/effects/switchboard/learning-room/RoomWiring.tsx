'use client';

import { useMemo } from 'react';
import { MeshStandardMaterial } from 'three';
import type { Vec3 } from '../circuit-data';
import { PathWire } from '../wiring/PathWire';
import {
  BOARD_OPENING,
  FIXTURES,
  HEIGHTS,
  KITCHEN,
  NOGGIN,
  ROOM,
  ROOM_LOADS,
  boardWallStudZs,
  fridgeWallStudXs,
  nogginY,
  worldGland,
} from './room-layout';

function join(...segs: Vec3[][]): Vec3[] {
  const out: Vec3[] = [];
  for (const seg of segs) {
    for (const p of seg) {
      const prev = out[out.length - 1];
      if (!prev || prev[0] !== p[0] || prev[1] !== p[1] || prev[2] !== p[2]) out.push(p);
    }
  }
  return out;
}

type Props = {
  liveById: Record<string, boolean>;
  isolatorOn: boolean;
};

type BoardRun = { y: number; z0: number; z1: number };
type KitchenRun = { y: number; x0: number; x1: number };

function between(a: number, b: number, p: number, pad = 0.03) {
  const lo = Math.min(a, b) + pad;
  const hi = Math.max(a, b) - pad;
  return p > lo && p < hi;
}

const NOGGIN_YS = ROOM.nogginYs;

function openingHitsZ(z: number, pad = 0.02) {
  return z > BOARD_OPENING.z0 - pad && z < BOARD_OPENING.z1 + pad;
}

function openingHitsY(y: number, pad = 0.04) {
  return y > BOARD_OPENING.y0 - pad && y < BOARD_OPENING.y1 + pad;
}

function CableBores({ boardRuns, kitchenRuns }: { boardRuns: BoardRun[]; kitchenRuns: KitchenRun[] }) {
  const s = ROOM.studSize;
  const cx = HEIGHTS.cavityX;
  const cz = HEIGHTS.cavityZ;
  const hole = 0.012;
  const nogginHalf = NOGGIN.h / 2 + NOGGIN.stagger + 0.02;
  return (
    <group>
      {boardWallStudZs().map((z) => {
        if (z > BOARD_OPENING.z0 - 0.04 && z < BOARD_OPENING.z1 + 0.04) return null;
        return boardRuns.map((run) => {
          if (!between(run.z0, run.z1, z)) return null;
          return (
            <mesh key={`bz-${z}-${run.y}-${run.z0}`} position={[cx, run.y, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[hole, hole, s + 0.01, 8]} />
              <meshStandardMaterial color="#2a261c" roughness={1} />
            </mesh>
          );
        });
      })}
      {NOGGIN_YS.map((ny) =>
        boardWallStudZs()
          .slice(0, -1)
          .map((z) => {
            const mid = z + ROOM.studSpacing / 2;
            const nyStagger = nogginY(ny, boardWallStudZs().indexOf(z));
            if (openingHitsZ(mid) && openingHitsY(ny)) return null;
            return boardRuns.map((run) => {
              if (Math.abs(run.y - nyStagger) > nogginHalf) return null;
              if (!between(run.z0, run.z1, mid, -0.02)) return null;
              return (
                <mesh
                  key={`bn-${ny}-${z}-${run.y}`}
                  position={[cx + s / 2 - NOGGIN.depth / 2, run.y, mid]}
                  rotation={[Math.PI / 2, 0, 0]}
                >
                  <cylinderGeometry args={[hole, hole, ROOM.studSpacing - s + 0.01, 8]} />
                  <meshStandardMaterial color="#2a261c" roughness={1} />
                </mesh>
              );
            });
          }),
      )}
      {fridgeWallStudXs().map((x) =>
        kitchenRuns.map((run) => {
          if (!between(run.x0, run.x1, x)) return null;
          return (
            <mesh key={`fx-${x}-${run.y}-${run.x0}`} position={[x, run.y, cz]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[hole, hole, s + 0.01, 8]} />
              <meshStandardMaterial color="#2a261c" roughness={1} />
            </mesh>
          );
        }),
      )}
      {NOGGIN_YS.map((ny) =>
        fridgeWallStudXs()
          .slice(0, -1)
          .map((x) => {
            const mid = x + ROOM.studSpacing / 2;
            const nyStagger = nogginY(ny, fridgeWallStudXs().indexOf(x));
            return kitchenRuns.map((run) => {
              if (Math.abs(run.y - nyStagger) > nogginHalf) return null;
              if (!between(run.x0, run.x1, mid, -0.02)) return null;
              return (
                <mesh
                  key={`fn-${ny}-${x}-${run.y}`}
                  position={[mid, run.y, cz + s / 2 - NOGGIN.depth / 2]}
                  rotation={[0, 0, Math.PI / 2]}
                >
                  <cylinderGeometry args={[hole, hole, ROOM.studSpacing - s + 0.01, 8]} />
                  <meshStandardMaterial color="#2a261c" roughness={1} />
                </mesh>
              );
            });
          }),
      )}
    </group>
  );
}

const OVAL = 0.36;

/** In-wall TPS: lighting on the board wall; kitchen circuits on z=0 at staggered heights. */
export function RoomWiring({ liveById, isolatorOn }: Props) {
  const sheath = useMemo(
    () => new MeshStandardMaterial({ color: '#f3f0e8', roughness: 0.55, metalness: 0.03 }),
    [],
  );

  const cx = HEIGHTS.cavityX;
  const cz = HEIGHTS.cavityZ;
  const lightingGland = worldGland(ROOM_LOADS.lighting);
  const powerGland = worldGland(ROOM_LOADS.power);
  const fridgeGland = worldGland(ROOM_LOADS.fridge);
  const ovenGland = worldGland(ROOM_LOADS.oven);
  const inductionGland = worldGland(ROOM_LOADS.induction);

  const lightingLive = liveById[ROOM_LOADS.lighting] ?? false;
  const powerLive = liveById[ROOM_LOADS.power] ?? false;
  const fridgeLive = liveById[ROOM_LOADS.fridge] ?? false;
  const ovenLive = liveById[ROOM_LOADS.oven] ?? false;
  const inductionLive = liveById[ROOM_LOADS.induction] ?? false;
  const hobLive = inductionLive && isolatorOn;

  const l1 = FIXTURES.wallLight1;
  const l2 = FIXTURES.wallLight2;
  const sw = FIXTURES.lightSwitch;
  const sconceFaceX = l1.x + 0.028;

  /** Leave the knockout and go straight into the stud bay — no dangling room stubs. */
  const intoCavity = (gland: Vec3, y: number): Vec3[] => [
    gland,
    [cx, gland[1] - 0.006, gland[2]],
    [cx, y, gland[2]],
    [cx, y, cz],
    [0.38, y, cz],
  ];

  const lightingSheath: Vec3[] = [
    lightingGland,
    [cx, lightingGland[1] - 0.006, lightingGland[2]],
    [cx, HEIGHTS.switch, lightingGland[2]],
    [cx, HEIGHTS.switch, sw.z],
    [cx, HEIGHTS.light, sw.z],
    [cx, HEIGHTS.light, l1.z],
    [cx, HEIGHTS.light, l2.z],
  ];

  const light1Stub: Vec3[] = [
    [cx, HEIGHTS.light, l1.z],
    [sconceFaceX, HEIGHTS.light, l1.z],
    [l1.x, HEIGHTS.light, l1.z],
  ];
  const light2Stub: Vec3[] = [
    [cx, HEIGHTS.light, l2.z],
    [sconceFaceX, HEIGHTS.light, l2.z],
    [l2.x, HEIGHTS.light, l2.z],
  ];

  const powerSheath = join(intoCavity(powerGland, HEIGHTS.splashGpoY), [
    [0.38, HEIGHTS.splashGpoY, cz],
    [FIXTURES.rangehood.x, HEIGHTS.splashGpoY, cz],
    [FIXTURES.gpoDouble.x, HEIGHTS.splashGpoY, cz],
    [FIXTURES.dishwasher.x, HEIGHTS.splashGpoY, cz],
    [FIXTURES.gpoSingle.x, HEIGHTS.splashGpoY, cz],
  ]);

  const hoodTee: Vec3[] = [
    [FIXTURES.rangehood.x, HEIGHTS.splashGpoY, cz],
    [FIXTURES.rangehood.x, FIXTURES.rangehood.y, cz],
  ];

  const dwDrop: Vec3[] = [
    [FIXTURES.dishwasher.x, HEIGHTS.splashGpoY, cz],
    [FIXTURES.dwGpo.x, HEIGHTS.gpo, cz],
  ];

  const inductionToIsolator = join(intoCavity(inductionGland, HEIGHTS.inductionY), [
    [0.38, HEIGHTS.inductionY, cz],
    [FIXTURES.cookIsolator.x, HEIGHTS.inductionY, cz],
  ]);

  const isolatorFeed: Vec3[] = [
    [FIXTURES.cookIsolator.x, HEIGHTS.inductionY, cz],
    [FIXTURES.cookIsolator.x, HEIGHTS.splashGpoY, cz],
    [FIXTURES.cookIsolator.x, 0.99, cz],
    [FIXTURES.cooktop.x, 0.99, cz],
    [FIXTURES.cooktop.x, KITCHEN.benchH - 0.02, cz],
  ];

  const ovenSheath = join(intoCavity(ovenGland, HEIGHTS.ovenY), [
    [0.38, HEIGHTS.ovenY, cz],
    [FIXTURES.oven.x, HEIGHTS.ovenY, cz],
  ]);

  const fridgeSheath = join(intoCavity(fridgeGland, HEIGHTS.fridgeY), [
    [0.38, HEIGHTS.fridgeY, cz],
    [FIXTURES.fridgeGpo.x, HEIGHTS.fridgeY, cz],
    [FIXTURES.fridgeGpo.x, HEIGHTS.splashGpoY, cz],
  ]);

  const boardRuns: BoardRun[] = [
    { y: HEIGHTS.switch, z0: lightingGland[2], z1: sw.z },
    { y: HEIGHTS.light, z0: sw.z, z1: l2.z },
    { y: HEIGHTS.splashGpoY, z0: powerGland[2], z1: cz },
    { y: HEIGHTS.fridgeY, z0: fridgeGland[2], z1: cz },
    { y: HEIGHTS.inductionY, z0: inductionGland[2], z1: cz },
    { y: HEIGHTS.ovenY, z0: ovenGland[2], z1: cz },
  ];

  const kitchenRuns: KitchenRun[] = [
    { y: HEIGHTS.splashGpoY, x0: 0.38, x1: FIXTURES.gpoSingle.x },
    { y: HEIGHTS.fridgeY, x0: 0.38, x1: FIXTURES.fridgeGpo.x },
    { y: HEIGHTS.inductionY, x0: 0.38, x1: FIXTURES.cookIsolator.x },
    { y: HEIGHTS.ovenY, x0: 0.38, x1: FIXTURES.oven.x },
    { y: 0.99, x0: FIXTURES.cookIsolator.x, x1: FIXTURES.cooktop.x },
  ];

  const tps = { sag: true, oval: OVAL, soft: false as const };
  const faceStub = (x: number, y: number, top = 0.052): Vec3[] => [
    [x, y, cz],
    [x, y + top + 0.03, cz],
    [x, y + top + 0.02, 0.038],
    [x, y + top + 0.004, 0.042],
    [x, y + top - 0.002, 0.028],
  ];

  return (
    <group>
      <PathWire points={lightingSheath} radius={0.0085} material={sheath} live={lightingLive} segments={48} {...tps} />
      <PathWire points={light1Stub} radius={0.0075} material={sheath} live={lightingLive} segments={10} oval={OVAL} soft={false} />
      <PathWire points={light2Stub} radius={0.0075} material={sheath} live={lightingLive} segments={10} oval={OVAL} soft={false} />
      <PathWire points={powerSheath} radius={0.01} material={sheath} live={powerLive} segments={56} {...tps} />
      <PathWire points={hoodTee} radius={0.009} material={sheath} live={powerLive} segments={12} oval={OVAL} soft={false} />
      <PathWire points={dwDrop} radius={0.009} material={sheath} live={powerLive} segments={12} oval={OVAL} soft={false} />
      <PathWire points={inductionToIsolator} radius={0.011} material={sheath} live={inductionLive} segments={48} {...tps} />
      <PathWire points={isolatorFeed} radius={0.011} material={sheath} live={hobLive} segments={20} oval={OVAL} sag soft={false} />
      <PathWire points={ovenSheath} radius={0.01} material={sheath} live={ovenLive} segments={48} {...tps} />
      <PathWire points={fridgeSheath} radius={0.01} material={sheath} live={fridgeLive} segments={52} {...tps} />

      <PathWire
        points={[
          [cx, HEIGHTS.switch, sw.z],
          [Math.min(sw.x - 0.006, cx + 0.02), HEIGHTS.switch, sw.z],
        ]}
        radius={0.0075}
        material={sheath}
        live={lightingLive}
        segments={6}
        oval={OVAL}
        soft={false}
      />
      <PathWire points={faceStub(FIXTURES.gpoDouble.x, HEIGHTS.splashGpoY, 0.052)} radius={0.008} material={sheath} live={powerLive} segments={8} oval={OVAL} soft={false} />
      <PathWire points={faceStub(FIXTURES.gpoSingle.x, HEIGHTS.splashGpoY, 0.062)} radius={0.0075} material={sheath} live={powerLive} segments={8} oval={OVAL} soft={false} />
      <PathWire points={faceStub(FIXTURES.fridgeGpo.x, HEIGHTS.splashGpoY, 0.062)} radius={0.0075} material={sheath} live={fridgeLive} segments={8} oval={OVAL} soft={false} />
      <PathWire points={faceStub(FIXTURES.cookIsolator.x, HEIGHTS.splashGpoY, 0.055)} radius={0.009} material={sheath} live={hobLive} segments={8} oval={OVAL} soft={false} />
      <PathWire points={faceStub(FIXTURES.dwGpo.x, HEIGHTS.gpo, 0.062)} radius={0.0075} material={sheath} live={powerLive} segments={8} oval={OVAL} soft={false} />
      <CableBores boardRuns={boardRuns} kitchenRuns={kitchenRuns} />
    </group>
  );
}
