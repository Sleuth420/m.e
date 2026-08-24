'use client';

import { useMemo } from 'react';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';

/** Procedural subway tile — teal/grey grout so white GPOs read clearly. */
export function useSubwayTileTexture(repeatX = 10, repeatY = 4) {
  return useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const tile = 64;
    const grout = 5;
    ctx.fillStyle = '#7a8f98';
    ctx.fillRect(0, 0, size, size);

    for (let row = 0; row < size / tile; row++) {
      for (let col = 0; col < size / tile; col++) {
        const offset = row % 2 === 0 ? 0 : tile / 2;
        const x = col * tile + offset;
        const tone = (row + col) % 2 === 0 ? '#4f8a9b' : '#3f7585';
        ctx.fillStyle = tone;
        ctx.fillRect(x + grout / 2, row * tile + grout / 2, tile - grout, tile - grout);
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fillRect(x + grout / 2 + 4, row * tile + grout / 2 + 4, tile - grout - 8, 8);
      }
    }

    const tex = new CanvasTexture(canvas);
    tex.wrapS = RepeatWrapping;
    tex.wrapT = RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    tex.colorSpace = SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [repeatX, repeatY]);
}
