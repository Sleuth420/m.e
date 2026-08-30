import {
  Box3,
  BoxGeometry,
  BufferGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Quaternion,
  Vector3,
} from 'three';
import { dressBlackAppliance } from './appliance-dress';
import { extractTrianglesAll, extractTrianglesBy } from './mesh-extract';

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
 * Fridge_Brushed is liner + ice dispenser in one skin. Peel the front onto
 * the doors so shelves stay in the carcass.
 */
function peelFridgeDoorSkin(root: Object3D) {
  if (root.getObjectByName('Fridge_Brushed_liner')) return;
  const skins = collectMeshes(root, /Fridge_Brushed/i);
  for (const mesh of skins) {
    const geom = mesh.geometry;
    const pos = geom.getAttribute('position');
    if (!pos) continue;
    /** Door skins start around local Z 19; dispenser sticks out past 26. */
    const cut = 19;
    const doorGeom = extractTrianglesAll(geom, (_x, _y, z) => z > cut);
    const linerGeom = extractTrianglesBy(
      geom,
      (ax, ay, az, bx, by, bz, cx, cy, cz) => !(az > cut && bz > cut && cz > cut)
    );
    if ((doorGeom.getAttribute('position')?.count ?? 0) < 9 || (linerGeom.getAttribute('position')?.count ?? 0) < 9) {
      continue;
    }
    const parent = mesh.parent ?? root;
    const door = copyMesh(mesh, doorGeom, 'Fridge_Brushed_door');
    const liner = copyMesh(mesh, linerGeom, 'Fridge_Brushed_liner');
    const mats = Array.isArray(liner.material) ? liner.material : [liner.material];
    for (const mat of mats) {
      const m = mat as MeshStandardMaterial;
      if (!m?.color) continue;
      m.color.set('#d8dce2');
      m.metalness = 0.12;
      m.roughness = 0.58;
      m.envMapIntensity = 0.7;
      m.needsUpdate = true;
    }
    parent.add(door);
    parent.add(liner);
    parent.remove(mesh);
  }
}

function punchFridgeOpening(root: Object3D) {
  const bodies = collectMeshes(root, /Fridge_Body/i);
  for (const mesh of bodies) {
    const punched = extractTrianglesAll(mesh.geometry, (_x, _y, z) => z <= 18);
    if ((punched.getAttribute('position')?.count ?? 0) < 9) continue;
    mesh.geometry = punched;
  }
}

/**
 * French-door fridge: stainless / plastic / gasket are full-width skins.
 * Split on local X and swing each leaf on the front outer edge.
 */
export function splitFrenchDoors(root: Object3D) {
  if (root.getObjectByName('door_l')) return;
  root.updateWorldMatrix(true, true);
  peelFridgeDoorSkin(root);
  punchFridgeOpening(root);
  const skins = collectMeshes(root, /Fridge_Stainless|Fridge_Plastic|Fridge_Gasket|Fridge_Brushed_door/i);
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
    const leftGeom = extractTrianglesAll(geom, (x) => x <= mid);
    const rightGeom = extractTrianglesAll(geom, (x) => x > mid);
    if ((leftGeom.getAttribute('position')?.count ?? 0) < 3 || (rightGeom.getAttribute('position')?.count ?? 0) < 3) {
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
  const doorGeom = extractTrianglesAll(geom, (_x, _y, z) => z > cut);
  const bodyGeom = extractTrianglesAll(geom, (_x, _y, z) => z <= cut);
  if (doorGeom.getAttribute('position')?.count < 9 || bodyGeom.getAttribute('position')?.count < 9) return;
  const parent = mesh.parent ?? root;
  const door = copyMesh(mesh, doorGeom, 'dw_door');
  const body = copyMesh(mesh, bodyGeom, 'dw_body');
  parent.add(door);
  parent.add(body);
  parent.remove(mesh);
  const box = new Box3().setFromObject(door);
  hingeAt([door], 'door_drop', new Vector3((box.min.x + box.max.x) / 2, box.min.y, box.max.z));
  addDishwasherTub(body);
}

function addDishwasherTub(body: Mesh) {
  const pos = body.geometry.getAttribute('position');
  if (!pos || !body.parent) return;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (let i = 0; i < pos.count; i++) {
    minX = Math.min(minX, pos.getX(i));
    maxX = Math.max(maxX, pos.getX(i));
    minY = Math.min(minY, pos.getY(i));
    maxY = Math.max(maxY, pos.getY(i));
    minZ = Math.min(minZ, pos.getZ(i));
    maxZ = Math.max(maxZ, pos.getZ(i));
  }
  const w = (maxX - minX) * 0.84;
  const h = (maxY - minY) * 0.76;
  const d = Math.max(40, (maxZ - minZ) * 0.7);
  const cx = (minX + maxX) / 2;
  const cy = minY + (maxY - minY) * 0.52;
  const cz = (minZ + maxZ) / 2;
  const enamel = new MeshStandardMaterial({ color: '#2c3036', metalness: 0.18, roughness: 0.64 });
  const tub = new Mesh(new BoxGeometry(w, h, d), enamel);
  tub.name = 'dw_tub';
  tub.position.set(cx, cy, cz);
  body.parent.add(tub);
  const wire = new MeshStandardMaterial({ color: '#b4b8be', metalness: 0.62, roughness: 0.32 });
  for (const t of [0.34, 0.62]) {
    const rack = new Mesh(new BoxGeometry(w * 0.9, 18, d * 0.82), wire);
    rack.name = 'dw_rack';
    rack.position.set(cx, minY + (maxY - minY) * t, cz);
    body.parent.add(rack);
  }
}

export function prepareFrenchFridgeDoors3(root: Object3D) {
  dressBlackAppliance(root);
  splitFrenchDoors(root);
}

export function preparePhoriaDishwasher(root: Object3D) {
  dressBlackAppliance(root);
  splitDishwasherDoor(root);
}

export const prepareFridge = prepareFrenchFridgeDoors3;
export const prepareDishwasher = preparePhoriaDishwasher;
