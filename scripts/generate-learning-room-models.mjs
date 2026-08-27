/**
 * AU wall fittings — C2000-ish sizes in the same white plastic as the
 * Sketchfab Type I GPO. No CC-BY AU rocker switch exists in that class, so
 * these are generated to sit next to `real/gpo-double.glb`.
 * Run: npm run generate:learning-room-models
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BoxGeometry, CylinderGeometry, Group, Mesh, MeshStandardMaterial, Scene } from 'three';
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
  /** Match the Sketchfab Type I GPO plastic (white, rough PC). */
  plate: () => new MeshStandardMaterial({ color: '#ffffff', roughness: 0.76, metalness: 0, name: 'plate' }),
  bezel: () => new MeshStandardMaterial({ color: '#f4f4f4', roughness: 0.72, metalness: 0, name: 'bezel' }),
  rocker: () => new MeshStandardMaterial({ color: '#ffffff', roughness: 0.58, metalness: 0.02, name: 'rocker' }),
  rockerRed: () => new MeshStandardMaterial({ color: '#9b1c1c', roughness: 0.46, metalness: 0.06, name: 'rocker' }),
  well: () => new MeshStandardMaterial({ color: '#1a1a1c', roughness: 0.55, metalness: 0.04, name: 'well' }),
  shutter: () => new MeshStandardMaterial({ color: '#0e0e10', roughness: 0.4, metalness: 0.06, name: 'shutter' }),
  screw: () => new MeshStandardMaterial({ color: '#c5c9ce', roughness: 0.28, metalness: 0.82, name: 'screw' }),
};

function add(root, mesh) {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  root.add(mesh);
  return mesh;
}

function roundMesh(mat, w, h, d, r = 0.003, segs = 4) {
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

function screwCap(root, x, y, z) {
  const well = cylMesh(MAT.bezel(), 0.0046, 0.0012, 16);
  well.rotation.x = Math.PI / 2;
  well.position.set(x, y, z - 0.0004);
  add(root, well);
  const cap = cylMesh(MAT.screw(), 0.003, 0.0014, 16);
  cap.rotation.x = Math.PI / 2;
  cap.position.set(x, y, z + 0.0004);
  add(root, cap);
  const slot = boxMesh(MAT.well(), 0.0034, 0.00055, 0.00055);
  slot.position.set(x, y, z + 0.0012);
  add(root, slot);
}

/** Type I socket — earth below, angled actives, same language as the Sketchfab double. */
function auSocket(root, ox, oy) {
  add(root, layer(roundMesh(MAT.bezel(), 0.046, 0.056, 0.0036, 0.0045, 5), ox, oy, 0.007, 0.0036));
  add(root, layer(roundMesh(MAT.well(), 0.036, 0.046, 0.0026, 0.0028, 4), ox, oy, 0.0104, 0.0026));

  const earthRing = cylMesh(MAT.shutter(), 0.0044, 0.0012, 16);
  earthRing.rotation.x = Math.PI / 2;
  earthRing.position.set(ox, oy - 0.0124, 0.0136);
  add(root, earthRing);
  const earth = cylMesh(MAT.well(), 0.0028, 0.0024, 14);
  earth.rotation.x = Math.PI / 2;
  earth.position.set(ox, oy - 0.0124, 0.014);
  add(root, earth);

  for (const [px, rot] of [
    [-0.0076, 0.54],
    [0.0076, -0.54],
  ]) {
    const slot = boxMesh(MAT.shutter(), 0.0124, 0.0025, 0.0024);
    slot.position.set(ox + px, oy + 0.0112, 0.0138);
    slot.rotation.z = rot;
    add(root, slot);
  }
}

function socketSwitch(root, ox, oy) {
  add(root, layer(roundMesh(MAT.bezel(), 0.02, 0.03, 0.003, 0.0025, 4), ox, oy, 0.007, 0.003));
  add(root, layer(roundMesh(MAT.well(), 0.015, 0.024, 0.0016, 0.0015), ox, oy, 0.01, 0.0016));
  add(root, layer(roundMesh(MAT.rocker(), 0.013, 0.022, 0.0052, 0.002, 4), ox, oy, 0.011, 0.0052));
}

function buildRocker(mat, w, h, d) {
  const group = new Group();
  group.name = 'Rocker';
  const body = roundMesh(mat, w, h, d, 0.0026, 5);
  group.add(body);
  const barrel = roundMesh(mat, w * 0.94, 0.006, d + 0.0018, 0.0016, 4);
  barrel.position.z = 0.0005;
  group.add(barrel);
  const mark = boxMesh(MAT.well(), w * 0.42, 0.0007, 0.00055);
  mark.position.set(0, h * 0.22, d / 2 + 0.00025);
  group.add(mark);
  return group;
}

/** C2000 1-gang plate — 76 × 116 mm, countersunk screws, recessed grid. */
function gangPlate(root, w = 0.076, h = 0.116) {
  add(root, layer(roundMesh(MAT.plate(), w, h, 0.0085, 0.007, 6), 0, 0, 0, 0.0085));
  add(root, layer(roundMesh(MAT.bezel(), w - 0.012, h - 0.012, 0.0014, 0.005, 5), 0, 0, 0.0085, 0.0014));
  screwCap(root, 0, h / 2 - 0.01, 0.0106);
  screwCap(root, 0, -h / 2 + 0.01, 0.0106);
}

function gridAndRocker(root, mat, { y = 0, w = 0.024, h = 0.044, d = 0.008 } = {}) {
  add(root, layer(roundMesh(MAT.bezel(), w + 0.012, h + 0.014, 0.0032, 0.0036, 5), 0, y, 0.0094, 0.0032));
  add(root, layer(roundMesh(MAT.well(), w + 0.005, h + 0.006, 0.0024, 0.0022, 4), 0, y, 0.0122, 0.0024));
  const rocker = buildRocker(mat, w, h, d);
  rocker.position.set(0, y, 0.018);
  root.add(rocker);
}

function buildSwitch() {
  const root = new Group();
  root.name = 'switch';
  gangPlate(root);
  gridAndRocker(root, MAT.rocker());
  return root;
}

function buildIsolator() {
  const root = new Group();
  root.name = 'isolator';
  gangPlate(root);
  gridAndRocker(root, MAT.rockerRed(), { y: 0.006, w: 0.026, h: 0.046, d: 0.009 });
  return root;
}

function buildGpoSingle() {
  const root = new Group();
  root.name = 'gpo-single';
  gangPlate(root);
  auSocket(root, 0, 0.016);
  socketSwitch(root, 0, -0.036);
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
await exportGlb(buildGpoSingle(), 'gpo-single.glb');
await exportGlb(buildSwitch(), 'switch.glb');
await exportGlb(buildIsolator(), 'isolator.glb');
console.log('done');
