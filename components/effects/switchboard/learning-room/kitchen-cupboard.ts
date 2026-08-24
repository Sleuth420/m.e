import {
  Box3,
  BufferAttribute,
  BufferGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Quaternion,
  Vector3,
} from 'three';

/** Closed 1100 mm two-door base from the modular kitchen kit (no sink, no glass). */
export const CUPBOARD_BASE_KEEP =
  /Cabinet_Back_B\.005|Cabinet_Side_B\.010|Cabinet_Side_B\.011|Cabinet_Shelf_A\.009|Cabinet_Shelf_A\.010|Cabinet_FrontA\.005|Cabinet_Handle\.013|Cabinet_Handle\.014/;

/** Door leaves + handles only, so wall cupboards don't inherit the base kick gap. */
export const CUPBOARD_UPPER_KEEP = /Cabinet_FrontA\.005|Cabinet_Handle\.013|Cabinet_Handle\.014/;

const JOINERY = '#cfc8bc';
const JOINERY_INNER = '#b9b1a6';
const HANDLE = '#c5c9ce';

function findNamed(root: Object3D, match: RegExp): Object3D | null {
  let found: Object3D | null = null;
  root.traverse((obj) => {
    if (found || !obj.name) return;
    if (match.test(obj.name)) found = obj;
  });
  return found;
}

export function keepNamed(root: Object3D, keep: RegExp) {
  const keepSet = new Set<Object3D>();
  root.traverse((obj) => {
    if (!obj.name || !keep.test(obj.name)) return;
    let climb: Object3D | null = obj;
    while (climb) {
      keepSet.add(climb);
      climb = climb.parent;
    }
    obj.traverse((child) => keepSet.add(child));
  });
  root.traverse((obj) => {
    if (obj !== root && !keepSet.has(obj)) obj.visible = false;
  });
}

export function pruneHidden(root: Object3D) {
  const drop: Object3D[] = [];
  root.traverse((obj) => {
    if (obj !== root && !obj.visible) drop.push(obj);
  });
  for (const obj of drop) obj.parent?.remove(obj);
}

function firstMesh(root: Object3D): Mesh | null {
  let found: Mesh | null = null;
  root.traverse((obj) => {
    if (found) return;
    const mesh = obj as Mesh;
    if (mesh.isMesh) found = mesh;
  });
  return found;
}

function extractTriangles(geometry: BufferGeometry, keepCentroid: (x: number) => boolean): BufferGeometry {
  const src = geometry.index ? geometry.toNonIndexed() : geometry.clone();
  const pos = src.getAttribute('position');
  if (!pos) return new BufferGeometry();
  const keep: number[] = [];
  for (let i = 0; i < pos.count; i += 3) {
    const cx = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3;
    if (keepCentroid(cx)) keep.push(i, i + 1, i + 2);
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

function paintKitchenJoinery(root: Object3D) {
  root.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;
    const label = `${mesh.name} ${mesh.parent?.name ?? ''}`;
    const handle = /handle/i.test(label);
    const src = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    const mat = (src as MeshStandardMaterial).clone();
    mat.map = null;
    mat.normalMap = null;
    mat.roughnessMap = null;
    mat.metalnessMap = null;
    mat.aoMap = null;
    mat.emissiveMap = null;
    mat.transparent = false;
    mat.opacity = 1;
    if (handle) {
      mat.color.set(HANDLE);
      mat.metalness = 0.88;
      mat.roughness = 0.22;
      mat.envMapIntensity = 1.45;
    } else {
      const inner = /shelf|back|side/i.test(label);
      mat.color.set(inner ? JOINERY_INNER : JOINERY);
      mat.metalness = 0.04;
      mat.roughness = inner ? 0.62 : 0.48;
      mat.envMapIntensity = 1.15;
    }
    mat.needsUpdate = true;
    mesh.material = mat;
  });
}

function worldHinge(parts: Object3D[], side: 'left' | 'right'): Vector3 {
  const box = new Box3();
  for (const part of parts) box.expandByObject(part);
  return new Vector3(side === 'left' ? box.min.x : box.max.x, box.min.y, box.max.z);
}

function hingeGroup(parts: Object3D[], name: string, side: 'left' | 'right'): Group | null {
  if (!parts.length) return null;
  const host = parts[0]!.parent;
  if (!host) return null;
  const pivot = new Group();
  pivot.name = name;
  host.add(pivot);
  const local = worldHinge(parts, side);
  host.worldToLocal(local);
  pivot.position.copy(local);
  const q = new Quaternion();
  host.getWorldQuaternion(q).invert();
  pivot.quaternion.copy(q);
  const inner = new Group();
  inner.name = `${name}-leaf`;
  pivot.add(inner);
  pivot.updateWorldMatrix(true, false);
  inner.updateWorldMatrix(true, false);
  for (const part of parts) inner.attach(part);
  return pivot;
}

function splitShakerDoors(root: Object3D) {
  if (findNamed(root, /^door_l$/)) return;
  const front = findNamed(root, /^Cabinet_FrontA\.005$/);
  if (!front) return;
  const mesh = firstMesh(front);
  if (!mesh) return;

  const pos = mesh.geometry.getAttribute('position');
  if (!pos) return;
  let minX = Infinity;
  let maxX = -Infinity;
  for (let i = 0; i < pos.count; i++) {
    minX = Math.min(minX, pos.getX(i));
    maxX = Math.max(maxX, pos.getX(i));
  }
  const mid = (minX + maxX) / 2;
  const leftGeom = extractTriangles(mesh.geometry, (x) => x <= mid);
  const rightGeom = extractTriangles(mesh.geometry, (x) => x > mid);

  const leftMesh = new Mesh(leftGeom, mesh.material);
  leftMesh.name = 'door_l_mesh';
  leftMesh.castShadow = true;
  leftMesh.receiveShadow = true;
  const rightMesh = new Mesh(rightGeom, mesh.material);
  rightMesh.name = 'door_r_mesh';
  rightMesh.castShadow = true;
  rightMesh.receiveShadow = true;

  const parent = mesh.parent ?? front;
  parent.add(leftMesh);
  parent.add(rightMesh);
  leftMesh.position.copy(mesh.position);
  leftMesh.quaternion.copy(mesh.quaternion);
  leftMesh.scale.copy(mesh.scale);
  rightMesh.position.copy(mesh.position);
  rightMesh.quaternion.copy(mesh.quaternion);
  rightMesh.scale.copy(mesh.scale);
  parent.remove(mesh);

  const leftHandle = findNamed(root, /^Cabinet_Handle\.013$/);
  const rightHandle = findNamed(root, /^Cabinet_Handle\.014$/);
  const leftParts = [leftMesh, leftHandle].filter(Boolean) as Object3D[];
  const rightParts = [rightMesh, rightHandle].filter(Boolean) as Object3D[];
  hingeGroup(leftParts, 'door_l', 'left');
  hingeGroup(rightParts, 'door_r', 'right');
}

export function prepareKitchenCupboard(root: Object3D) {
  paintKitchenJoinery(root);
  splitShakerDoors(root);
}
