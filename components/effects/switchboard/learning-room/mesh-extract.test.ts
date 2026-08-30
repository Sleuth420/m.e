import { BufferAttribute, BufferGeometry } from 'three';
import { describe, expect, it } from 'vitest';
import { extractTriangles, extractTrianglesAll } from './mesh-extract';

function twoTris(): BufferGeometry {
  const geom = new BufferGeometry();
  geom.setAttribute(
    'position',
    new BufferAttribute(
      new Float32Array([
        0, 0, 0, 1, 0, 0, 0, 1, 0,
        0, 0, 2, 1, 0, 2, 0, 1, 2,
      ]),
      3
    )
  );
  return geom;
}

describe('extractTriangles', () => {
  it('keeps a triangle by centroid', () => {
    const kept = extractTriangles(twoTris(), (_x, _y, z) => z > 1);
    expect(kept.getAttribute('position')?.count).toBe(3);
    expect(kept.getAttribute('position')?.getZ(0)).toBe(2);
  });
});

describe('extractTrianglesAll', () => {
  it('drops spanning triangles that only partly pass the cut', () => {
    const geom = new BufferGeometry();
    geom.setAttribute(
      'position',
      new BufferAttribute(
        new Float32Array([
          0, 0, 0, 1, 0, 25, 0, 1, 25,
          0, 0, 26, 1, 0, 26, 0, 1, 26,
        ]),
        3
      )
    );
    const door = extractTrianglesAll(geom, (_x, _y, z) => z > 19);
    expect(door.getAttribute('position')?.count).toBe(3);
    expect(door.getAttribute('position')?.getZ(0)).toBe(26);
  });
});
