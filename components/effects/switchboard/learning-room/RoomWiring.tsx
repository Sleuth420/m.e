'use client';

import { useMemo } from 'react';
import { MeshStandardMaterial } from 'three';
import type { Vec3 } from '../circuit-data';
import { PathWire } from '../wiring/PathWire';
import { FIXTURES, HEIGHTS, KITCHEN, ROOM_LOADS, worldGland } from './room-layout';

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

/** In-wall TPS: lighting on the board wall; kitchen circuits on z=0 at staggered heights. */
export function RoomWiring({ liveById, isolatorOn }: Props) {
  const sheath = useMemo(
    () => new MeshStandardMaterial({ color: '#eceae4', roughness: 0.62, metalness: 0.04 }),
    []
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

  const lightingSheath: Vec3[] = [
    lightingGland,
    [lightingGland[0], lightingGland[1] - 0.08, lightingGland[2]],
    [cx, lightingGland[1] - 0.1, lightingGland[2]],
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

  const toKitchen = (gland: Vec3, y: number): Vec3[] => [
    gland,
    [gland[0], gland[1] - 0.04, gland[2]],
    [cx, gland[1] - 0.05, gland[2]],
    [cx, y, gland[2]],
    [cx, y, cz],
    [0.38, y, cz],
  ];

  const powerSheath = join(toKitchen(powerGland, HEIGHTS.splashGpoY), [
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

  const inductionToIsolator = join(toKitchen(inductionGland, HEIGHTS.inductionY), [
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

  const ovenSheath = join(toKitchen(ovenGland, HEIGHTS.ovenY), [
    [0.38, HEIGHTS.ovenY, cz],
    [FIXTURES.oven.x, HEIGHTS.ovenY, cz],
  ]);

  const fridgeSheath = join(toKitchen(fridgeGland, HEIGHTS.splashGpoY), [
    [0.38, HEIGHTS.splashGpoY, cz],
    [FIXTURES.fridgeGpo.x, HEIGHTS.splashGpoY, cz],
  ]);

  return (
    <group>
      <PathWire points={lightingSheath} radius={0.007} material={sheath} live={lightingLive} segments={28} soft={false} />
      <PathWire points={light1Stub} radius={0.006} material={sheath} live={lightingLive} segments={8} soft={false} />
      <PathWire points={light2Stub} radius={0.006} material={sheath} live={lightingLive} segments={8} soft={false} />
      <PathWire points={powerSheath} radius={0.008} material={sheath} live={powerLive} segments={36} soft={false} />
      <PathWire points={hoodTee} radius={0.007} material={sheath} live={powerLive} segments={10} soft={false} />
      <PathWire points={dwDrop} radius={0.007} material={sheath} live={powerLive} segments={10} soft={false} />
      <PathWire points={inductionToIsolator} radius={0.009} material={sheath} live={inductionLive} segments={28} soft={false} />
      <PathWire points={isolatorFeed} radius={0.009} material={sheath} live={hobLive} segments={16} soft={false} />
      <PathWire points={ovenSheath} radius={0.008} material={sheath} live={ovenLive} segments={28} soft={false} />
      <PathWire points={fridgeSheath} radius={0.008} material={sheath} live={fridgeLive} segments={32} soft={false} />

      {/* Sheath stays in the cavity and stops behind the plate — no live cores on the plaster. */}
      <PathWire
        points={[
          [cx, HEIGHTS.switch, sw.z],
          [Math.min(sw.x - 0.006, cx + 0.02), HEIGHTS.switch, sw.z],
        ]}
        radius={0.006}
        material={sheath}
        live={lightingLive}
        segments={6}
        soft={false}
      />
    </group>
  );
}
