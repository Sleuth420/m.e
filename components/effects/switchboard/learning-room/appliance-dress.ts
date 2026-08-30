import { Mesh, MeshStandardMaterial, Object3D, Texture } from 'three';

function texSrc(tex: Texture): string {
  const img = tex.image as { src?: string } | undefined;
  return img?.src ?? '';
}

/** Magenta / orange Sketchfab fillers that make steel look like a toy. */
function sampleLooksPlaceholder(tex: Texture): boolean {
  const img = tex.image as CanvasImageSource | undefined;
  if (!img || typeof document === 'undefined') return false;
  try {
    const c = document.createElement('canvas');
    c.width = 8;
    c.height = 8;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    if (!ctx) return false;
    ctx.drawImage(img, 0, 0, 8, 8);
    const d = ctx.getImageData(0, 0, 8, 8).data;
    let mag = 0;
    let orange = 0;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i]!;
      const g = d[i + 1]!;
      const b = d[i + 2]!;
      const a = d[i + 3]!;
      if (a < 8) continue;
      n += 1;
      if (r > 200 && b > 200 && g < 90) mag += 1;
      if (r > 200 && g > 60 && g < 180 && b < 50) orange += 1;
    }
    if (n < 4) return false;
    return mag / n > 0.55 || orange / n > 0.55;
  } catch {
    return false;
  }
}

function isPlaceholderTex(tex: Texture | null | undefined): boolean {
  if (!tex) return false;
  const img = tex.image as { width?: number; height?: number } | undefined;
  if (!img) return true;
  const w = img.width ?? 0;
  const h = img.height ?? 0;
  if (w > 0 && h > 0 && (w <= 8 || h <= 8)) return true;
  if (/fridge-french-(1|3|4|5|7|8|10|16)\./i.test(texSrc(tex))) return true;
  return sampleLooksPlaceholder(tex);
}

function stripJunkMaps(mat: MeshStandardMaterial) {
  const keys = [
    'map',
    'normalMap',
    'roughnessMap',
    'metalnessMap',
    'aoMap',
    'emissiveMap',
    'bumpMap',
  ] as const;
  for (const key of keys) {
    const tex = mat[key];
    if (tex && isPlaceholderTex(tex)) {
      mat[key] = null;
    }
  }
}

function dressMat(src: MeshStandardMaterial, label: string): MeshStandardMaterial {
  const mat = src.clone();
  stripJunkMaps(mat);
  const n = label.toLowerCase();

  const glass = /glass|translucent/.test(n);
  const rubber = /rubber|gasket|isolation/.test(n);
  const plastic = /plastic/.test(n) && !/metal|steel|chrome|aluminum|aluminium/.test(n);
  const chrome = /chrome|polished/.test(n);
  const steel =
    /stainless|brushed|steel|aluminum|aluminium|hood_metal|metal_|sink|radiator|body/.test(n) ||
    chrome;
  const paint = /smeg_red|toaster_body|candy_apple|hard_shiny_plastic_red/.test(n);

  if (glass) {
    mat.metalness = 0.08;
    mat.roughness = Math.max(mat.roughness, 0.06);
    if (mat.opacity >= 0.99) mat.opacity = 0.22;
    mat.transparent = true;
    mat.color.set('#d8dee6');
  } else if (rubber) {
    mat.map = null;
    mat.metalness = 0.02;
    mat.roughness = 0.86;
    mat.color.set('#1c1d1f');
  } else if (plastic) {
    mat.metalness = 0.04;
    mat.roughness = Math.max(mat.roughness, 0.42);
    if (!mat.map) mat.color.set('#d9dbe0');
  } else if (paint) {
    mat.metalness = Math.min(mat.metalness, 0.18);
    mat.roughness = Math.max(mat.roughness, 0.28);
  } else if (steel) {
    if (!mat.map) mat.color.set(chrome ? '#dfe3e8' : '#c5c9ce');
    mat.metalness = chrome ? 0.96 : 0.88;
    mat.roughness = chrome ? 0.16 : 0.3;
    if (/radiator/.test(n)) {
      mat.map = null;
      mat.color.set('#8b9096');
      mat.metalness = 0.72;
      mat.roughness = 0.42;
    }
  } else if (mat.roughness < 0.04 && mat.metalness > 0.5) {
    mat.roughness = 0.18;
  } else if (mat.metalness < 0.05 && /metal|hood|oven|gorenje/.test(n)) {
    mat.metalness = 0.82;
    mat.roughness = 0.32;
    if (!mat.map) mat.color.set('#c5c9ce');
  }

  mat.needsUpdate = true;
  return mat;
}

/** Clone + repair product materials. Does not paint over real albedo maps. */
export function dressKitchenProduct(root: Object3D) {
  root.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const next = mats.map((mat) => {
      if (!mat) return mat;
      return dressMat(mat as MeshStandardMaterial, `${mesh.name} ${mat.name ?? ''}`);
    });
    mesh.material = Array.isArray(mesh.material) ? next : next[0]!;
  });
}

/** Black stainless bodies; chrome handles and glass stay. */
export function dressBlackAppliance(root: Object3D) {
  dressKitchenProduct(root);
  root.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of mats) {
      const m = mat as MeshStandardMaterial;
      if (!m?.color) continue;
      const n = `${mesh.name} ${m.name ?? ''}`.toLowerCase();
      if (/handle|chrome|button|dispenser|ice/.test(n) && m.metalness > 0.55) continue;
      if (/glass|translucent/.test(n)) {
        m.color.set('#121316');
        m.roughness = 0.08;
        m.metalness = 0.12;
        m.needsUpdate = true;
        continue;
      }
      if (m.metalness > 0.28 || /steel|body|door|metal|housing|panel|gorenje|hood/.test(n)) {
        m.color.set('#24262b');
        m.metalness = 0.7;
        m.roughness = Math.max(0.28, Math.min(m.roughness, 0.42));
        m.envMapIntensity = 1.15;
        m.needsUpdate = true;
      }
    }
  });
}
