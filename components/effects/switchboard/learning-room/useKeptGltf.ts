'use client';

import { use } from 'react';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

const cache = new Map<string, GLTF>();
const pending = new Map<string, Promise<GLTF>>();

export function loadKeptGltf(url: string): Promise<GLTF> {
  const hit = cache.get(url);
  if (hit) return Promise.resolve(hit);
  const inflight = pending.get(url);
  if (inflight) return inflight;
  const promise = new Promise<GLTF>((resolve, reject) => {
    const loader = new GLTFLoader();
    // Strip query so relative texture paths resolve next to the asset file.
    const clean = url.split('?')[0] ?? url;
    const slash = clean.lastIndexOf('/');
    if (slash >= 0) loader.setResourcePath(clean.slice(0, slash + 1));
    loader.load(
      url,
      (gltf) => {
        cache.set(url, gltf);
        pending.delete(url);
        resolve(gltf);
      },
      undefined,
      (err) => {
        pending.delete(url);
        reject(err);
      }
    );
  });
  pending.set(url, promise);
  return promise;
}

export function useKeptGltf(url: string): GLTF {
  const hit = cache.get(url);
  if (hit) return hit;
  return use(loadKeptGltf(url));
}
