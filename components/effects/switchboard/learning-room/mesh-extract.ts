import { BufferAttribute, BufferGeometry } from 'three';

type KeepTri = (
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number,
  cx: number,
  cy: number,
  cz: number
) => boolean;

/** Keep triangles whose centroid passes `keepCentroid`. */
export function extractTriangles(
  geometry: BufferGeometry,
  keepCentroid: (x: number, y: number, z: number) => boolean
): BufferGeometry {
  return extractTrianglesBy(geometry, (ax, ay, az, bx, by, bz, cx, cy, cz) =>
    keepCentroid((ax + bx + cx) / 3, (ay + by + cy) / 3, (az + bz + cz) / 3)
  );
}

/** Keep triangles only when every vertex passes `keepVertex`. */
export function extractTrianglesAll(
  geometry: BufferGeometry,
  keepVertex: (x: number, y: number, z: number) => boolean
): BufferGeometry {
  return extractTrianglesBy(geometry, (ax, ay, az, bx, by, bz, cx, cy, cz) =>
    keepVertex(ax, ay, az) && keepVertex(bx, by, bz) && keepVertex(cx, cy, cz)
  );
}

export function extractTrianglesBy(geometry: BufferGeometry, keepTri: KeepTri): BufferGeometry {
  const src = geometry.index ? geometry.toNonIndexed() : geometry.clone();
  const pos = src.getAttribute('position');
  if (!pos) return new BufferGeometry();
  const keep: number[] = [];
  for (let i = 0; i < pos.count; i += 3) {
    if (
      keepTri(
        pos.getX(i),
        pos.getY(i),
        pos.getZ(i),
        pos.getX(i + 1),
        pos.getY(i + 1),
        pos.getZ(i + 1),
        pos.getX(i + 2),
        pos.getY(i + 2),
        pos.getZ(i + 2)
      )
    ) {
      keep.push(i, i + 1, i + 2);
    }
  }
  const dst = new BufferGeometry();
  for (const name of Object.keys(src.attributes)) {
    const attr = src.getAttribute(name) as BufferAttribute;
    const itemSize = attr.itemSize;
    const out = new Float32Array(keep.length * itemSize);
    let o = 0;
    for (const i of keep) {
      for (let k = 0; k < itemSize; k++) out[o++] = attr.getComponent(i, k);
    }
    dst.setAttribute(name, new BufferAttribute(out, itemSize));
  }
  dst.computeVertexNormals();
  return dst;
}
