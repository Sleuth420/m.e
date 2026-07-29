/**
 * Generates DIN RCBO + main-isolator GLB shells (Clipsal MAX9-inspired stepped form).
 * Deep back body + molded front face step. Accents are flush insets, not proud boxes.
 * Blue accents (not brand green). No trademarked logos.
 * Run: node scripts/generate-switchboard-models.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Scene,
  TorusGeometry,
} from 'three';
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
const OUT = join(__dirname, '..', 'public', 'models', 'switchboard');

const MAT = {
  body: () =>
    new MeshStandardMaterial({
      color: '#e8e8ea',
      roughness: 0.62,
      metalness: 0.04,
      name: 'body',
    }),
  bodyMid: () =>
    new MeshStandardMaterial({
      color: '#dedee2',
      roughness: 0.58,
      metalness: 0.05,
      name: 'bodyMid',
    }),
  plasticDark: () =>
    new MeshStandardMaterial({
      color: '#2a2a30',
      roughness: 0.45,
      metalness: 0.08,
      name: 'plasticDark',
    }),
  screw: () =>
    new MeshStandardMaterial({
      color: '#8a8a92',
      roughness: 0.22,
      metalness: 0.92,
      name: 'screw',
    }),
  well: () =>
    new MeshStandardMaterial({
      // Terminal screw holes stay dark
      color: '#2a2a30',
      roughness: 0.6,
      metalness: 0.05,
      name: 'well',
    }),
  cavity: () =>
    new MeshStandardMaterial({
      // Toggle cavity floor — must stay light or it rings the lever in black
      color: '#c8c8cc',
      roughness: 0.55,
      metalness: 0.04,
      name: 'cavity',
    }),
  accentBlue: () =>
    new MeshStandardMaterial({
      color: '#1e4a8c',
      roughness: 0.48,
      metalness: 0.08,
      name: 'accentBlue',
    }),
  accentRed: () =>
    new MeshStandardMaterial({
      color: '#9b1c1c',
      roughness: 0.42,
      metalness: 0.1,
      name: 'accentRed',
    }),
  yellow: () =>
    new MeshStandardMaterial({
      color: '#eab308',
      roughness: 0.5,
      metalness: 0.05,
      name: 'yellow',
    }),
  window: () =>
    new MeshStandardMaterial({
      color: '#1e4a8c',
      roughness: 0.35,
      metalness: 0.1,
      name: 'window',
    }),
};

function box(mat, w, h, d, x = 0, y = 0, z = 0) {
  const mesh = new Mesh(new BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function cyl(mat, rTop, rBot, h, x, y, z, rx = 0, ry = 0, rz = 0, seg = 14) {
  const mesh = new Mesh(new CylinderGeometry(rTop, rBot, h, seg), mat);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  mesh.castShadow = true;
  return mesh;
}

/** Soft vertical corners on a slab so edges read molded, not Lego. */
function softCorners(root, mat, w, h, d, r = 0.008) {
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      root.add(
        cyl(mat, r, r, h - r * 2, sx * (w / 2 - r), 0, sz * (d / 2 - r), 0, 0, 0, 14)
      );
    }
  }
  // Soften front/back horizontal edges with small cylinders along width
  for (const sz of [-1, 1]) {
    for (const sy of [-1, 1]) {
      root.add(
        cyl(
          mat,
          r * 0.7,
          r * 0.7,
          w - r * 2,
          0,
          sy * (h / 2 - r * 0.7),
          sz * (d / 2 - r * 0.7),
          0,
          0,
          Math.PI / 2,
          12
        )
      );
    }
  }
}

/** Front-face screw access — tightens the clamp for the end-face cable mouth. */
function screwAccess(root, mats, x, y, z, r = 0.0155) {
  const g = new Group();
  g.name = 'screwAccess';
  g.position.set(x, y, z);
  const rim = new Mesh(new TorusGeometry(r, 0.0025, 8, 16), mats.bodyMid);
  rim.rotation.x = Math.PI / 2;
  g.add(rim);
  g.add(cyl(mats.well, r * 0.9, r * 0.82, 0.028, 0, 0, -0.012, Math.PI / 2, 0, 0, 14));
  g.add(cyl(mats.screw, r * 0.5, r * 0.5, 0.005, 0, 0, -0.004, Math.PI / 2, 0, 0, 12));
  g.add(box(mats.well, r * 0.65, 0.0018, 0.0035, 0, 0, -0.001));
  g.add(box(mats.well, 0.0018, r * 0.65, 0.0035, 0, 0, -0.001));
  root.add(g);
}

/**
 * Cable / comb entry on the TOP or BOTTOM face (not the front).
 * openingUp: true = mouth on top face (line in), false = bottom face (line out).
 */
function cableMouth(root, mats, x, yFace, z, openingUp) {
  const g = new Group();
  g.name = openingUp ? 'cableMouthTop' : 'cableMouthBottom';
  g.position.set(x, yFace, z);

  const mouthW = 0.028;
  const mouthD = 0.032;
  const tunnelH = 0.055;
  const dir = openingUp ? -1 : 1;

  // Flared lip on the end face (readable from a 3/4 board view)
  g.add(box(mats.bodyMid, mouthW + 0.01, 0.006, mouthD + 0.01, 0, 0, 0));
  // Dark rectangular mouth
  g.add(box(mats.well, mouthW, 0.005, mouthD, 0, dir * 0.002, 0));
  // Tunnel into the clamp chamber
  g.add(box(mats.well, mouthW * 0.85, tunnelH, mouthD * 0.85, 0, dir * (tunnelH / 2 + 0.004), 0));
  // Small brass glimpse inside (reads as clamp)
  g.add(box(mats.screw, mouthW * 0.5, 0.004, mouthD * 0.5, 0, dir * 0.02, 0));

  root.add(g);
}

/**
 * Screw on front + aligned cable mouth on the end face (MAX9 cage terminal).
 */
function cageTerminal(root, mats, x, screwY, screwZ, cableY, cableZ, openingUp) {
  screwAccess(root, mats, x, screwY, screwZ);
  cableMouth(root, mats, x, cableY, cableZ, openingUp);
}


/**
 * MAX9-style profile from side refs:
 * - Deep rectangular back body (majority of depth)
 * - Raised front face block for label + switch (molded step)
 * - Top/bottom terminals on the BACK body face (recessed vs front)
 * - Flush insets for accent / warning (no proud cubes)
 */
function buildModule({
  name,
  width,
  height,
  depth,
  accentMat,
  includeTest = true,
  includeNeutralMark = true,
  dualTerminals = true,
}) {
  const root = new Group();
  root.name = name;

  const mats = {
    body: MAT.body(),
    bodyMid: MAT.bodyMid(),
    plasticDark: MAT.plasticDark(),
    screw: MAT.screw(),
    well: MAT.well(),
    cavity: MAT.cavity(),
    accent: accentMat(),
    yellow: MAT.yellow(),
    window: MAT.window(),
  };

  // Back body is ~62% of total depth; front face adds the rest (matches side photos)
  const backD = depth * 0.62;
  const frontD = depth * 0.38;
  const backZ = 0; // centered on origin for normalize
  const backFrontZ = backD / 2;
  const faceFrontZ = backFrontZ + frontD;

  // --- Deep back body (full height) ---
  const back = new Group();
  back.name = 'back';
  back.position.set(0, 0, backZ);
  softCorners(back, mats.body, width, height, backD, 0.008);
  back.add(box(mats.body, width - 0.022, height - 0.02, backD - 0.01));
  // Slight top/bottom bevel lips (same material, reads as molded edge not add-on)
  back.add(box(mats.bodyMid, width - 0.02, 0.014, backD * 0.92, 0, height / 2 - 0.01, 0.01));
  back.add(box(mats.bodyMid, width - 0.02, 0.014, backD * 0.92, 0, -height / 2 + 0.01, 0.01));
  root.add(back);

  // Side assembly marks — inset so they never widen the pole bbox
  for (const sx of [-1, 1]) {
    for (const dy of [-0.22, -0.05, 0.12, 0.28]) {
      root.add(
        cyl(
          mats.bodyMid,
          0.004,
          0.004,
          0.002,
          sx * (width / 2 - 0.006),
          dy,
          0.02,
          0,
          0,
          Math.PI / 2,
          8
        )
      );
    }
  }

  // --- Raised front face (label + switch zone), continuous with back ---
  const faceH = height * 0.48;
  const faceY = 0.02;
  const face = new Group();
  face.name = 'face';
  face.position.set(0, faceY, backFrontZ + frontD / 2);
  softCorners(face, mats.body, width - 0.014, faceH, frontD, 0.007);
  face.add(box(mats.body, width - 0.028, faceH - 0.016, frontD - 0.008));
  // Tiny top ledge under label band
  face.add(box(mats.bodyMid, width - 0.03, 0.008, frontD * 0.95, 0, faceH / 2 - 0.01, 0));
  root.add(face);

  const faceFaceZ = faceFrontZ;

  // Top vent slots molded into back-face junction (shallow grooves, not floating bars)
  for (let i = 0; i < 3; i++) {
    root.add(
      box(
        mats.well,
        width - 0.05,
        0.003,
        0.006,
        0,
        height / 2 - 0.04 - i * 0.01,
        backFrontZ - 0.004
      )
    );
  }

  // --- Cage terminals: screws on FRONT step, cables on TOP/BOTTOM faces ---
  // Top = line in, bottom = line out. N left, LINE/load right.
  const screwTopY = height / 2 - 0.085;
  const screwBotY = -height / 2 + 0.085;
  const screwZ = backFrontZ + 0.002;
  // Cable mouths on the end faces, aligned under the screws, mid-back body
  const cableZ = backFrontZ - backD * 0.28;
  const xN = -width * 0.22;
  const xL = width * 0.22;

  if (dualTerminals) {
    cageTerminal(root, mats, xN, screwTopY, screwZ, height / 2, cableZ, true);
    cageTerminal(root, mats, xL, screwTopY, screwZ, height / 2, cableZ, true);
    cageTerminal(root, mats, xN, screwBotY, screwZ, -height / 2, cableZ, false);
    cageTerminal(root, mats, xL, screwBotY, screwZ, -height / 2, cableZ, false);
    if (includeNeutralMark) {
      root.add(box(mats.accent, 0.012, 0.012, 0.0012, -width * 0.38, screwTopY, screwZ + 0.001));
      root.add(box(mats.accent, 0.012, 0.012, 0.0012, -width * 0.38, screwBotY, screwZ + 0.001));
    }
  } else {
    cageTerminal(root, mats, 0, screwTopY, screwZ, height / 2, cableZ, true);
    cageTerminal(root, mats, 0, screwBotY, screwZ, -height / 2, cableZ, false);
  }

  // Shallow label pocket (face print seats here; brand bar lives on the texture)
  root.add(
    box(
      mats.bodyMid,
      width - 0.04,
      faceH * 0.3,
      0.006,
      0,
      faceY + faceH * 0.14,
      faceFaceZ - 0.002
    )
  );

  // No recessed switch pit in the GLB — rocker overlay sits on flush face
  const cavityY = faceY - 0.02;
  root.add(box(mats.body, width - 0.036, 0.12, 0.008, 0, cavityY, faceFaceZ + 0.001));

  if (includeTest) {
    // Large proud TEST button below rocker — unmistakable blue + T
    const testY = cavityY - 0.12;
    root.add(box(mats.bodyMid, width - 0.04, 0.04, 0.014, 0, testY, faceFaceZ + 0.002));
    root.add(box(mats.accent, width - 0.05, 0.032, 0.014, 0, testY, faceFaceZ + 0.012));
    root.add(box(mats.body, 0.028, 0.006, 0.004, 0, testY + 0.008, faceFaceZ + 0.02));
    root.add(box(mats.body, 0.006, 0.018, 0.004, 0, testY - 0.002, faceFaceZ + 0.02));
  }

  // Yellow HV sticker only (no dark square — that read as a black frame near the rocker)
  root.add(
    box(mats.yellow, 0.036, 0.036, 0.0012, -width * 0.26, faceY - faceH * 0.42, faceFaceZ + 0.001)
  );

  // Yellow DIN clip tucked under the BACK (not a front cube)
  const clip = new Group();
  clip.name = 'dinClip';
  clip.position.set(0, -height / 2 + 0.018, -backD / 2 + 0.02);
  clip.add(box(mats.yellow, width * 0.5, 0.016, 0.032));
  clip.add(box(mats.yellow, width * 0.32, 0.02, 0.014, 0, -0.01, 0.012));
  clip.add(cyl(mats.well, 0.005, 0.005, 0.02, 0, -0.006, 0.02, Math.PI / 2, 0, 0, 8));
  root.add(clip);

  // Rear DIN hook (behind back body)
  root.add(box(mats.bodyMid, width * 0.62, 0.018, 0.03, 0, 0.04, -backD / 2 - 0.008));
  root.add(box(mats.bodyMid, width * 0.48, 0.04, 0.014, 0, -0.015, -backD / 2 - 0.004));

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

// Author at exact pole pitch so normalize doesn't leave gaps between modules
const rcbo = buildModule({
  name: 'rcbo',
  width: 0.17,
  height: 0.86,
  depth: 0.52,
  accentMat: MAT.accentBlue,
  includeTest: true,
  includeNeutralMark: true,
  dualTerminals: true,
});
await exportGlb(rcbo, 'rcbo.glb');

const main = buildModule({
  name: 'mainSwitch',
  width: 0.17,
  height: 0.86,
  depth: 0.54,
  accentMat: MAT.accentRed,
  includeTest: false,
  includeNeutralMark: false,
  dualTerminals: false,
});
await exportGlb(main, 'main-switch.glb');

console.log('done');
