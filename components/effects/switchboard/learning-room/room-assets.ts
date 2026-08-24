/** Real CC-BY product models. Sources: public/models/learning-room/CREDITS.md */
export const ROOM_GLB = {
  sconce: '/models/learning-room/sconce.glb?v=21',
  cabinetDrawers: '/models/learning-room/real/cabinet-drawers.glb?v=8',
  fridge: '/models/learning-room/real/fridge-french.glb?v=8',
  oven: '/models/learning-room/real/oven.glb?v=14',
  cooktop: '/models/learning-room/real/cooktop-lutz.glb?v=11',
  dishwasher: '/models/learning-room/real/dishwasher-phoria.glb?v=17',
  hood: '/models/learning-room/real/hood-wall.glb?v=1',
  toaster: '/models/learning-room/real/toaster.glb?v=7',
  sink: '/models/learning-room/real/sink.glb?v=7',
  tap: '/models/learning-room/real/tap.glb?v=7',
  /** White double GPO plate — used for every outlet (splash + under-bench). */
  gpoDouble: '/models/learning-room/real/gpo-double.glb?v=8',
  switch: '/models/learning-room/real/switch.glb?v=7',
  /** Poly Haven CC0 pliers — player avatar https://polyhaven.com/a/pliers */
  pliers: '/models/learning-room/real/pliers/pliers.gltf?v=4',
} as const;

export function preloadRoomModelPaths(): string[] {
  return Object.values(ROOM_GLB);
}
