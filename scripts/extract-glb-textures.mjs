import { readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

function pad4(n) {
  return (4 - (n % 4)) % 4;
}

function extract(glbPath) {
  const buf = readFileSync(glbPath);
  const jsonLen = buf.readUInt32LE(12);
  const jsonStart = 20;
  const json = JSON.parse(buf.subarray(jsonStart, jsonStart + jsonLen).toString('utf8'));
  const jsonPad = pad4(jsonLen);
  const binHeader = jsonStart + jsonLen + jsonPad;
  if (binHeader + 8 > buf.length) {
    console.log('no bin', glbPath);
    return;
  }
  const binLen = buf.readUInt32LE(binHeader);
  const bin = buf.subarray(binHeader + 8, binHeader + 8 + binLen);
  const stem = basename(glbPath, '.glb');
  const dir = dirname(glbPath);
  let changed = 0;
  for (let i = 0; i < (json.images ?? []).length; i++) {
    const img = json.images[i];
    if (img.uri || img.bufferView == null) continue;
    const bv = json.bufferViews[img.bufferView];
    const start = bv.byteOffset || 0;
    const bytes = Buffer.from(bin.subarray(start, start + bv.byteLength));
    const ext = (img.mimeType || '').includes('png') ? 'png' : 'jpg';
    const name = `${stem}-${i}.${ext}`;
    writeFileSync(join(dir, name), bytes);
    img.uri = name;
    delete img.bufferView;
    changed += 1;
  }
  if (!changed) {
    console.log('no embedded images', glbPath);
    return;
  }
  const jsonBytes = Buffer.from(JSON.stringify(json));
  const jsonPadBuf = Buffer.alloc(pad4(jsonBytes.length), 0x20);
  const jsonPadded = Buffer.concat([jsonBytes, jsonPadBuf]);
  const binPad = Buffer.alloc(pad4(bin.length));
  const binPadded = Buffer.concat([bin, binPad]);
  const out = Buffer.alloc(12 + 8 + jsonPadded.length + 8 + binPadded.length);
  out.writeUInt32LE(0x46546c67, 0);
  out.writeUInt32LE(2, 4);
  out.writeUInt32LE(out.length, 8);
  out.writeUInt32LE(jsonPadded.length, 12);
  out.writeUInt32LE(0x4e4f534a, 16);
  jsonPadded.copy(out, 20);
  const binAt = 20 + jsonPadded.length;
  out.writeUInt32LE(binPadded.length, binAt);
  out.writeUInt32LE(0x004e4942, binAt + 4);
  binPadded.copy(out, binAt + 8);
  writeFileSync(glbPath, out);
  console.log('extracted', changed, 'textures from', stem);
}

const files = process.argv.slice(2);
if (!files.length) {
  console.error('usage: node scripts/extract-glb-textures.mjs <file.glb>...');
  process.exit(1);
}
for (const f of files) extract(f);
