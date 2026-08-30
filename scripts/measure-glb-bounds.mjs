import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Box3, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'models', 'learning-room');
const dirs = [join(root, 'real'), join(root, 'kitchen')];

function loadGlb(path) {
  const buf = readFileSync(path);
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.parse(ab, '', resolve, reject);
  });
}

function bounds(scene) {
  const box = new Box3();
  scene.updateWorldMatrix(true, true);
  scene.traverse((obj) => {
    if (obj.isMesh && obj.visible) box.expandByObject(obj);
  });
  const size = box.getSize(new Vector3());
  return {
    x: Number(size.x.toFixed(4)),
    y: Number(size.y.toFixed(4)),
    z: Number(size.z.toFixed(4)),
    minY: Number(box.min.y.toFixed(4)),
    maxY: Number(box.max.y.toFixed(4)),
  };
}

for (const dir of dirs) {
  const files = readdirSync(dir).filter((f) => f.endsWith('.glb')).sort();
  for (const file of files) {
    const path = join(dir, file);
    try {
      const gltf = await loadGlb(path);
      const b = bounds(gltf.scene);
      const guess =
        b.y > 20 ? 'likely-cm' : b.y > 5 ? 'likely-m-huge-or-mm' : b.y < 0.05 ? 'likely-mm-as-m' : 'likely-meters';
      console.log(JSON.stringify({ file: path.replace(root + '\\', '').replace(root + '/', ''), ...b, guess }));
    } catch (err) {
      console.log(JSON.stringify({ file, error: String(err.message || err) }));
    }
  }
}
