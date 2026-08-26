'use client';

import { useTexture } from '@react-three/drei';
import { useLayoutEffect, useMemo } from 'react';
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

/** PBR (diff + OpenGL normal + roughness). Poly Haven ARM uses the green channel as roughness. */
export function useRepeatingPbr(
  urls: { diff: string; nor: string; arm?: string; rough?: string },
  repeat: [number, number],
): PbrMaps {
  const rx = repeat[0];
  const ry = repeat[1];
  const third = urls.arm ?? urls.rough;
  if (!third) throw new Error('PBR maps need arm or rough');
  const [map, normalMap, roughnessMap] = useTexture([urls.diff, urls.nor, third]);
  useLayoutEffect(() => {
    prepColor(map, [rx, ry]);
    prepData(normalMap, [rx, ry]);
    prepData(roughnessMap, [rx, ry]);
  }, [map, normalMap, roughnessMap, rx, ry]);
  return { map, normalMap, roughnessMap };
}

/** Cloned maps so each panel can have its own repeat / grain rotation. */
export function useSizedPbr(
  urls: { diff: string; nor: string; arm?: string; rough?: string },
  size: [number, number],
  tileMeters = 0.2,
  rotation = 0,
): PbrMaps {
  const third = urls.arm ?? urls.rough;
  if (!third) throw new Error('PBR maps need arm or rough');
  const [map, normalMap, roughnessMap] = useTexture([urls.diff, urls.nor, third]);
  const clones = useMemo(
    () => ({
      map: map.clone(),
      normalMap: normalMap.clone(),
      roughnessMap: roughnessMap.clone(),
    }),
    [map, normalMap, roughnessMap],
  );
  const rx = Math.max(0.35, size[0] / tileMeters);
  const ry = Math.max(0.35, size[1] / tileMeters);
  useLayoutEffect(() => {
    prepColor(clones.map, [rx, ry]);
    prepData(clones.normalMap, [rx, ry]);
    prepData(clones.roughnessMap, [rx, ry]);
    for (const tex of [clones.map, clones.normalMap, clones.roughnessMap]) {
      tex.center.set(0.5, 0.5);
      tex.rotation = rotation;
    }
  }, [clones, rx, ry, rotation]);
  useLayoutEffect(
    () => () => {
      clones.map.dispose();
      clones.normalMap.dispose();
      clones.roughnessMap.dispose();
    },
    [clones],
  );
  return clones;
}
