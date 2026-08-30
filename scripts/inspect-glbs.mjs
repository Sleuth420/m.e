import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = join(process.cwd(), 'public/models/learning-room/real');
for (const file of readdirSync(dir).filter((f) => f.endsWith('.glb'))) {
  const buf = readFileSync(join(dir, file));
  const jsonLen = buf.readUInt32LE(12);
  const json = JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'));
  const images = json.images?.length ?? 0;
  const meshes = json.meshes?.length ?? 0;
  const nodes = (json.nodes ?? []).map((n) => n.name).filter(Boolean).slice(0, 18);
  const mats = (json.materials ?? []).map((m) => m.name).filter(Boolean).slice(0, 12);
  console.log(JSON.stringify({ file, images, meshes, nodes, mats, sceneNodes: json.scenes?.[0]?.nodes }, null, 0));
}
