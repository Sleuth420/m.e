'use client';

import { useMemo } from 'react';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';

function makeCanvas(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D context unavailable');
  draw(ctx);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function paperGrain(ctx: CanvasRenderingContext2D, w: number, h: number, alpha = 0.04) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = ((((i * 1103515245 + 12345) >>> 16) & 255) / 255 - 0.5) * 255 * alpha;
    d[i] = Math.max(0, Math.min(255, (d[i] ?? 0) + n));
    d[i + 1] = Math.max(0, Math.min(255, (d[i + 1] ?? 0) + n));
    d[i + 2] = Math.max(0, Math.min(255, (d[i + 2] ?? 0) + n));
  }
  ctx.putImageData(img, 0, 0);
}

/** MAX9-style face print: matches body plastic so it reads printed, not a card. */
export function useMainSwitchFaceTexture() {
  return useMemo(
    () =>
      makeCanvas(256, 256, (ctx) => {
        ctx.fillStyle = '#e8e8ea';
        ctx.fillRect(0, 0, 256, 256);

        ctx.fillStyle = '#9b1c1c';
        ctx.fillRect(20, 16, 216, 28);
        ctx.fillStyle = '#fafafa';
        ctx.font = '700 16px "Segoe UI", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('MAIN', 128, 36);

        ctx.fillStyle = '#27272a';
        ctx.font = '600 14px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('ISOLATOR', 128, 72);
        ctx.font = '700 36px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('63A', 128, 118);
        ctx.font = '500 13px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('240V~  50Hz', 128, 148);
        ctx.font = '400 11px "Segoe UI", system-ui, sans-serif';
        ctx.fillStyle = '#52525b';
        ctx.fillText('AS/NZS 60947.3', 128, 176);

        paperGrain(ctx, 256, 256, 0.04);
      }),
    []
  );
}

export function useRcboFaceTexture(rating: string) {
  return useMemo(
    () =>
      makeCanvas(256, 256, (ctx) => {
        ctx.fillStyle = '#e8e8ea';
        ctx.fillRect(0, 0, 256, 256);

        ctx.fillStyle = '#1e4a8c';
        ctx.fillRect(18, 14, 220, 26);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 14px "Segoe UI", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('RCBO', 128, 33);

        ctx.fillStyle = '#27272a';
        ctx.font = '600 13px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('MAX SERIES', 128, 64);

        ctx.font = '700 34px "Segoe UI", system-ui, sans-serif';
        ctx.fillText(rating, 128, 108);

        ctx.font = '500 12px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('240V~   30mA   6kA', 128, 136);

        ctx.fillStyle = '#52525b';
        ctx.font = '400 10px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('AS/NZS 61009.1  Type A', 128, 168);

        paperGrain(ctx, 256, 256, 0.04);
      }),
    [rating]
  );
}

export function useCircuitLabelTexture(label: string) {
  return useMemo(
    () =>
      makeCanvas(256, 64, (ctx) => {
        ctx.fillStyle = '#1e3a5f';
        ctx.fillRect(0, 0, 256, 64);
        ctx.fillStyle = '#1e4a8c';
        ctx.fillRect(3, 3, 250, 58);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.strokeRect(3, 3, 250, 58);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '600 14px "Segoe UI", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const words = label.split(' ');
        if (label.length > 18 && words.length > 2) {
          ctx.font = '600 12px "Segoe UI", system-ui, sans-serif';
          ctx.fillText(words.slice(0, 2).join(' '), 128, 22);
          ctx.fillText(words.slice(2).join(' '), 128, 42);
        } else {
          ctx.fillText(label, 128, 32);
        }
        paperGrain(ctx, 256, 64, 0.06);
      }),
    [label]
  );
}

export function useEarthStripeTexture() {
  return useMemo(() => {
    const texture = makeCanvas(64, 64, (ctx) => {
      ctx.fillStyle = '#4d7c0f';
      ctx.fillRect(0, 0, 64, 64);
      ctx.fillStyle = '#ca8a04';
      for (let i = -64; i < 128; i += 14) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 28, 0);
        ctx.lineTo(i + 14, 64);
        ctx.lineTo(i - 14, 64);
        ctx.closePath();
        ctx.fill();
      }
    });
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(6, 1);
    return texture;
  }, []);
}
