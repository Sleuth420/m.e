/** Real CC-BY product models. Sources: public/models/learning-room/CREDITS.md */
export const ROOM_GLB = {
  sconce: '/models/learning-room/sconce.glb?v=21',
  cabinetDrawers: '/models/learning-room/real/cabinet-drawers.glb?v=8',
  /** Modular kitchen cupboard kit — one closed two-door unit per bay. */
  cabinetDoors: '/models/learning-room/real/cabinets-modular.glb?v=2',
  fridge: '/models/learning-room/real/fridge-french.glb?v=8',
  oven: '/models/learning-room/real/oven.glb?v=14',
  cooktop: '/models/learning-room/real/cooktop-lutz.glb?v=11',
  dishwasher: '/models/learning-room/real/dishwasher-phoria.glb?v=17',
  hood: '/models/learning-room/real/hood-wall.glb?v=1',
  toaster: '/models/learning-room/real/toaster.glb?v=7',
  sink: '/models/learning-room/real/sink.glb?v=7',
  tap: '/models/learning-room/real/tap.glb?v=7',
  pot: '/models/learning-room/kitchen/pot.glb?v=1',
  roast: '/models/learning-room/kitchen/roast.glb?v=1',
  /** White double GPO plate — used for every outlet (splash + under-bench). */
  gpoDouble: '/models/learning-room/real/gpo-double.glb?v=8',
  switch: '/models/learning-room/real/switch.glb?v=7',
  /** Poly Haven CC0 pliers — player avatar https://polyhaven.com/a/pliers */
  pliers: '/models/learning-room/real/pliers/pliers.gltf?v=4',
} as const;

/** Poly Haven CC0 materials / HDRI — same source as the pliers. */
export const POLYHAVEN = {
  hdri: '/models/learning-room/polyhaven/hdri/kiara_interior_2k.hdr',
  tiles: {
    diff: '/models/learning-room/polyhaven/textures/tiles/long_white_tiles_diff_2k.jpg',
    nor: '/models/learning-room/polyhaven/textures/tiles/long_white_tiles_nor_gl_2k.jpg',
    arm: '/models/learning-room/polyhaven/textures/tiles/long_white_tiles_arm_2k.jpg',
  },
  marble: {
    diff: '/models/learning-room/polyhaven/textures/marble/marble_01_diff_1k.jpg',
    nor: '/models/learning-room/polyhaven/textures/marble/marble_01_nor_gl_1k.jpg',
    arm: '/models/learning-room/polyhaven/textures/marble/marble_01_arm_1k.jpg',
  },
  laminate: {
    diff: '/models/learning-room/polyhaven/textures/laminate/laminate_floor_02_diff_1k.jpg',
    nor: '/models/learning-room/polyhaven/textures/laminate/laminate_floor_02_nor_gl_1k.jpg',
    arm: '/models/learning-room/polyhaven/textures/laminate/laminate_floor_02_arm_1k.jpg',
  },
} as const;

export function preloadRoomModelPaths(): string[] {
  return Object.values(ROOM_GLB);
}
