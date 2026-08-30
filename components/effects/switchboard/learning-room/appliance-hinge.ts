import {
  Box3,
  BufferAttribute,
  BufferGeometry,
  Group,
  Mesh,
  Object3D,
  Quaternion,
  Vector3,
} from 'three';
import { dressBlackAppliance } from './appliance-dress';

function extractTriangles(
  geometry: BufferGeometry,
  keepCentroid: (x: number, y: number, z: number) => boolean,
): BufferGeometry {
  const src = geometry.index ? geometry.toNonIndexed() : geometry.clone();
  const pos = src.getAttribute('position');
  if (!pos) return new BufferGeometry();
  const keep: number[] = [];
  for (let i = 0; i < pos.count; i += 3) {
    const cx = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3;
    const cy = (pos.getY(i) + pos.getY(i + 1) + pos.getY(i + 2)) / 3;
    const cz = (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3;
    if (keepCentroid(cx, cy, cz)) keep.push(i, i + 1, i + 2);
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

function copyMesh(source: Mesh, geometry: BufferGeometry, name: string): Mesh {
  const mesh = new Mesh(geometry, source.material);
  mesh.name = name;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.copy(source.position);
  mesh.quaternion.copy(source.quaternion);
  mesh.scale.copy(source.scale);
  return mesh;
}

function hingeAt(
  parts: Object3D[],
  name: string,
  worldHinge: Vector3,
): Group | null {
  if (!parts.length) return null;
  const host = parts[0]!.parent;
  if (!host) return null;
  const local = worldHinge.clone();
  host.worldToLocal(local);
  const pivot = new Group();
  pivot.name = name;
  host.add(pivot);
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

function collectMeshes(root: Object3D, match: RegExp): Mesh[] {
  const meshes: Mesh[] = [];
  root.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;
    const label = `${mesh.name} ${mesh.material && !Array.isArray(mesh.material) ? mesh.material.name : ''}`;
    if (match.test(label)) meshes.push(mesh);
  });
  return meshes;
}

/**
 * French-door fridge: stainless / plastic / gasket are full-width skins.
 * Split on local X and swing each leaf on the front outer edge.
 */
export function splitFrenchDoors(root: Object3D) {
  if (root.getObjectByName('door_l')) return;
  root.updateWorldMatrix(true, true);
  const skins = collectMeshes(root, /Fridge_Stainless|Fridge_Plastic|Fridge_Gasket/i);
  const left: Object3D[] = [];
  const right: Object3D[] = [];

  for (const mesh of skins) {
    const geom = mesh.geometry;
    const pos = geom.getAttribute('position');
    if (!pos) continue;
    let minX = Infinity;
    let maxX = -Infinity;
    for (let i = 0; i < pos.count; i++) {
      minX = Math.min(minX, pos.getX(i));
      maxX = Math.max(maxX, pos.getX(i));
    }
    const mid = (minX + maxX) / 2;
    const leftGeom = extractTriangles(geom, (x) => x <= mid);
    const rightGeom = extractTriangles(geom, (x) => x > mid);
    if ((leftGeom.getAttribute('position')?.count ?? 0) < 9 || (rightGeom.getAttribute('position')?.count ?? 0) < 9) {
      continue;
    }
    const parent = mesh.parent ?? root;
    const leftMesh = copyMesh(mesh, leftGeom, `${mesh.name}_L`);
    const rightMesh = copyMesh(mesh, rightGeom, `${mesh.name}_R`);
    parent.add(leftMesh);
    parent.add(rightMesh);
    parent.remove(mesh);
    left.push(leftMesh);
    right.push(rightMesh);
  }

  const box = new Box3();
  for (const part of left) box.expandByObject(part);
  hingeAt(left, 'door_l', new Vector3(box.min.x, box.min.y, box.max.z));
  box.makeEmpty();
  for (const part of right) box.expandByObject(part);
  hingeAt(right, 'door_r', new Vector3(box.max.x, box.min.y, box.max.z));
}

/**
 * Phoria dishwasher is one mesh. Front ~80 mm (local mm, parent scale 0.001) is the door.
 */
export function splitDishwasherDoor(root: Object3D) {
  if (root.getObjectByName('door_drop')) return;
  root.updateWorldMatrix(true, true);
  const mesh = collectMeshes(root, /Object_4|WDF330/)[0] ?? collectMeshes(root, /.*/)[0];
  if (!mesh) return;
  const geom = mesh.geometry;
  const pos = geom.getAttribute('position');
  if (!pos) return;
  let maxZ = -Infinity;
  for (let i = 0; i < pos.count; i++) maxZ = Math.max(maxZ, pos.getZ(i));
  const cut = maxZ - 80;
  const doorGeom = extractTriangles(geom, (_x, _y, z) => z > cut);
  const bodyGeom = extractTriangles(geom, (_x, _y, z) => z <= cut);
  if (doorGeom.getAttribute('position')?.count < 9 || bodyGeom.getAttribute('position')?.count < 9) return;
  const parent = mesh.parent ?? root;
  const door = copyMesh(mesh, doorGeom, 'dw_door');
  const body = copyMesh(mesh, bodyGeom, 'dw_body');
  parent.add(door);
  parent.add(body);
  parent.remove(mesh);
  const box = new Box3().setFromObject(door);
  hingeAt([door], 'door_drop', new Vector3((box.min.x + box.max.x) / 2, box.min.y, box.max.z));
}

export function prepareFridge(root: Object3D) {
  dressBlackAppliance(root);
  splitFrenchDoors(root);
}

export function prepareDishwasher(root: Object3D) {
  dressBlackAppliance(root);
  splitDishwasherDoor(root);
}
