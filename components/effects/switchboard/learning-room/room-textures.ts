'use client';

import { useTexture } from '@react-three/drei';
import { useLayoutEffect } from 'react';
import { LinearSRGBColorSpace, RepeatWrapping, SRGBColorSpace, Texture } from 'three';

export type PbrMaps = {
  map: Texture;
  normalMap: Texture;
  roughnessMap: Texture;
};

function prepColor(tex: Texture, repeat: [number, number]) {
  tex.colorSpace = SRGBColorSpace;
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.repeat.set(repeat[0], repeat[1]);
  tex.anisotropy = 8;
  tex.needsUpdate = true;
}

function prepData(tex: Texture, repeat: [number, number]) {
  tex.colorSpace = LinearSRGBColorSpace;
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.repeat.set(repeat[0], repeat[1]);
  tex.anisotropy = 8;
  tex.needsUpdate = true;
}

/** Poly Haven PBR (diff + OpenGL normal + ARM). Roughness is the ARM green channel. */
export function useRepeatingPbr(
  urls: { diff: string; nor: string; arm: string },
  repeat: [number, number],
): PbrMaps {
  const rx = repeat[0];
  const ry = repeat[1];
  const [map, normalMap, roughnessMap] = useTexture([urls.diff, urls.nor, urls.arm]);
  useLayoutEffect(() => {
    prepColor(map, [rx, ry]);
    prepData(normalMap, [rx, ry]);
    prepData(roughnessMap, [rx, ry]);
  }, [map, normalMap, roughnessMap, rx, ry]);
  return { map, normalMap, roughnessMap };
}
