/**
 * AU wall fittings — C2000-ish sizes, layered so nothing shares a volume.
 * Run: npm run generate:learning-room-models
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  LatheGeometry,
  Mesh,
  MeshStandardMaterial,
  Scene,
  SphereGeometry,
  Vector2,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

class FileReaderPolyfill {
  result = null;
  readyState = 0;
  onload = null;
  onloadend = null;
  onerror = null;
  readAsArrayBuffer(blob) {
    this.readyState = 1;
    Promise.resolve(blob.arrayBuffer())
      .then((buf) => {
        this.result = buf;
        this.readyState = 2;
        const ev = { target: this };
        this.onload?.(ev);
        this.onloadend?.(ev);
      })
      .catch((err) => this.onerror?.(err));
  }
}
globalThis.FileReader = FileReaderPolyfill;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'models', 'learning-room');

const MAT = {
  plate: () => new MeshStandardMaterial({ color: '#f3f1eb', roughness: 0.46, metalness: 0.03, name: 'plate' }),
  bezel: () => new MeshStandardMaterial({ color: '#e6e3db', roughness: 0.5, metalness: 0.04, name: 'bezel' }),
  rocker: () => new MeshStandardMaterial({ color: '#faf8f3', roughness: 0.4, metalness: 0.03, name: 'rocker' }),
  rockerRed: () => new MeshStandardMaterial({ color: '#9b1c1c', roughness: 0.38, metalness: 0.08, name: 'rocker' }),
  well: () => new MeshStandardMaterial({ color: '#1c1c1f', roughness: 0.58, metalness: 0.05, name: 'well' }),
  shutter: () => new MeshStandardMaterial({ color: '#111113', roughness: 0.42, metalness: 0.08, name: 'shutter' }),
  screw: () => new MeshStandardMaterial({ color: '#9aa0a6', roughness: 0.22, metalness: 0.88, name: 'screw' }),
  chrome: () => new MeshStandardMaterial({ color: '#c5c9ce', roughness: 0.18, metalness: 0.92, name: 'chrome' }),
  opal: () =>
    new MeshStandardMaterial({ color: '#f4f0e6', roughness: 0.62, metalness: 0.02, name: 'ShadeMat' }),
};

function add(root, mesh) {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  root.add(mesh);
  return mesh;
}

function roundMesh(mat, w, h, d, r = 0.003, segs = 3) {
  return new Mesh(new RoundedBoxGeometry(w, h, d, segs, r), mat);
}

function boxMesh(mat, w, h, d) {
  return new Mesh(new BoxGeometry(w, h, d), mat);
}

function cylMesh(mat, r, h, seg = 20) {
  return new Mesh(new CylinderGeometry(r, r, h, seg), mat);
}

/** Place a mesh so its back face sits at `z0` and it occupies (z0 .. z0+d). */
function layer(mesh, x, y, z0, d) {
  mesh.position.set(x, y, z0 + d / 2);
  return mesh;
}

function screwCap(root, x, y) {
  const cap = cylMesh(MAT.screw(), 0.0038, 0.002, 14);
  cap.rotation.x = Math.PI / 2;
  cap.position.set(x, y, 0.008);
  add(root, cap);
}

function auSocket(root, ox, oy) {
  add(root, layer(roundMesh(MAT.bezel(), 0.04, 0.048, 0.003, 0.003), ox, oy, 0.007, 0.003));
  add(root, layer(roundMesh(MAT.well(), 0.032, 0.04, 0.002, 0.002), ox, oy, 0.01, 0.002));

  const earth = cylMesh(MAT.shutter(), 0.0032, 0.002, 12);
  earth.rotation.x = Math.PI / 2;
  earth.position.set(ox, oy - 0.011, 0.013);
  add(root, earth);

  for (const [px, rot] of [
    [-0.007, 0.48],
    [0.007, -0.48],
  ]) {
    const slot = boxMesh(MAT.shutter(), 0.01, 0.0028, 0.002);
    slot.position.set(ox + px, oy + 0.01, 0.013);
    slot.rotation.z = rot;
    add(root, slot);
  }
}

function socketSwitch(root, ox, oy) {
  add(root, layer(roundMesh(MAT.bezel(), 0.018, 0.028, 0.003, 0.002), ox, oy, 0.007, 0.003));
  add(root, layer(roundMesh(MAT.rocker(), 0.013, 0.022, 0.004, 0.002), ox, oy, 0.01, 0.004));
}

function buildDolly(w, h, d) {
  const group = new Group();
  group.name = 'Rocker';
  const body = roundMesh(MAT.rocker(), w, h, d, 0.002, 3);
  group.add(body);
  return group;
}

function buildGpo() {
  const root = new Group();
  root.name = 'gpo';
  add(root, layer(roundMesh(MAT.plate(), 0.122, 0.121, 0.007, 0.006, 4), 0, 0, 0, 0.007));
  auSocket(root, -0.028, 0.02);
  auSocket(root, 0.028, 0.02);
  socketSwitch(root, -0.028, -0.034);
  socketSwitch(root, 0.028, -0.034);
  screwCap(root, 0, 0.052);
  screwCap(root, 0, -0.052);
  return root;
}

function buildSwitch() {
  const root = new Group();
  root.name = 'switch';
  add(root, layer(roundMesh(MAT.plate(), 0.077, 0.121, 0.007, 0.006, 4), 0, 0, 0, 0.007));
  add(root, layer(roundMesh(MAT.bezel(), 0.034, 0.056, 0.003, 0.003), 0, 0, 0.007, 0.003));
  const rocker = buildDolly(0.026, 0.046, 0.008);
  rocker.position.set(0, 0, 0.016);
  root.add(rocker);
  screwCap(root, 0, 0.052);
  screwCap(root, 0, -0.052);
  return root;
}

function buildIsolator() {
  const root = new Group();
  root.name = 'isolator';
  add(root, layer(roundMesh(MAT.plate(), 0.077, 0.121, 0.007, 0.006, 4), 0, 0, 0, 0.007));
  add(root, layer(roundMesh(MAT.bezel(), 0.038, 0.06, 0.003, 0.003), 0, 0.008, 0.007, 0.003));
  const rocker = new Group();
  rocker.name = 'Rocker';
  rocker.add(new Mesh(new RoundedBoxGeometry(0.028, 0.05, 0.009, 3, 0.002), MAT.rockerRed()));
  rocker.position.set(0, 0.008, 0.016);
  root.add(rocker);
  screwCap(root, 0, 0.052);
  screwCap(root, 0, -0.052);
  return root;
}

function buildGpoSingle() {
  const root = new Group();
  root.name = 'gpo-single';
  add(root, layer(roundMesh(MAT.plate(), 0.077, 0.121, 0.007, 0.006, 4), 0, 0, 0, 0.007));
  auSocket(root, 0, 0.016);
  socketSwitch(root, 0, -0.036);
  screwCap(root, 0, 0.052);
  screwCap(root, 0, -0.052);
  return root;
}

function buildSconce() {
  const root = new Group();
  root.name = 'sconce';
  add(root, layer(roundMesh(MAT.chrome(), 0.078, 0.078, 0.008, 0.008, 4), 0, 0, 0, 0.008));
  const arm = cylMesh(MAT.chrome(), 0.009, 0.04, 16);
  arm.rotation.x = Math.PI / 2;
  arm.position.set(0, 0, 0.028);
  add(root, arm);

  const shade = new Mesh(
    new LatheGeometry(
      [
        new Vector2(0.018, 0),
        new Vector2(0.05, 0.008),
        new Vector2(0.062, 0.04),
        new Vector2(0.058, 0.09),
        new Vector2(0.03, 0.1),
      ],
      20
    ),
    MAT.opal()
  );
  shade.name = 'Shade';
  shade.rotation.x = Math.PI / 2;
  shade.position.set(0, -0.04, 0.07);
  shade.castShadow = true;
  root.add(shade);

  const bulb = new Mesh(
    new SphereGeometry(0.018, 12, 10),
    new MeshStandardMaterial({ color: '#fff6d8', roughness: 0.35, name: 'bulb' })
  );
  bulb.position.set(0, 0, 0.07);
  root.add(bulb);
  return root;
}

async function exportGlb(root, filename) {
  const scene = new Scene();
  scene.add(root);
  const exporter = new GLTFExporter();
  const data = await exporter.parseAsync(scene, { binary: true });
  writeFileSync(join(OUT, filename), Buffer.from(data));
  console.log(`wrote ${filename} (${data.byteLength} bytes)`);
}

mkdirSync(OUT, { recursive: true });
await exportGlb(buildGpo(), 'gpo.glb');
await exportGlb(buildGpoSingle(), 'gpo-single.glb');
await exportGlb(buildSwitch(), 'switch.glb');
await exportGlb(buildIsolator(), 'isolator.glb');
await exportGlb(buildSconce(), 'sconce.glb');
console.log('done');
