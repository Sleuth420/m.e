import { describe, expect, it } from 'vitest';
import { ROOM_GLB, preloadRoomModelPaths } from './room-assets';

describe('preloadRoomModelPaths', () => {
  it('preloads idle fittings without the player avatar or unused cabinets', () => {
    const paths = preloadRoomModelPaths();
    expect(paths).toContain(ROOM_GLB.fridge);
    expect(paths).toContain(ROOM_GLB.sofa);
    expect(paths).not.toContain(ROOM_GLB.pliers);
    expect(paths).not.toContain(ROOM_GLB.cabinetDoors);
    expect(paths).not.toContain(ROOM_GLB.gpoSingle);
  });
});
