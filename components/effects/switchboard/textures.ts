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
      makeCanvas(512, 512, (ctx) => {
        ctx.fillStyle = '#e8e8ea';
        ctx.fillRect(0, 0, 512, 512);

        ctx.fillStyle = '#9b1c1c';
        ctx.fillRect(28, 28, 456, 64);
        ctx.fillStyle = '#fafafa';
        ctx.textAlign = 'center';
        ctx.font = '800 36px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('MAIN', 256, 72);

        ctx.fillStyle = '#27272a';
        ctx.font = '700 32px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('ISOLATOR', 256, 148);
        ctx.font = '800 84px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('63A', 256, 248);
        ctx.font = '600 28px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('240V~  50Hz', 256, 308);
        ctx.font = '500 22px "Segoe UI", system-ui, sans-serif';
        ctx.fillStyle = '#52525b';
        ctx.fillText('AS/NZS 60947.3', 256, 360);

        paperGrain(ctx, 512, 512, 0.04);
      }),
    []
  );
}

export function useRcboFaceTexture(rating: string, circuitName = '') {
  return useMemo(
    () =>
      makeCanvas(512, 512, (ctx) => {
        ctx.fillStyle = '#e8e8ea';
        ctx.fillRect(0, 0, 512, 512);

        ctx.fillStyle = '#1e4a8c';
        ctx.fillRect(24, 24, 464, 56);
        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'center';
        ctx.font = '800 32px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('RCBO', 256, 64);

        ctx.fillStyle = '#27272a';
        ctx.font = '800 80px "Segoe UI", system-ui, sans-serif';
        ctx.fillText(rating, 256, 176);

        const name = circuitName.trim();
        if (name) {
          ctx.fillStyle = '#1e3a5f';
          const words = name.split(' ');
          if (words.length > 1 && name.length > 10) {
            ctx.font = '800 28px "Segoe UI", system-ui, sans-serif';
            ctx.fillText(words.slice(0, Math.ceil(words.length / 2)).join(' '), 256, 236);
            ctx.fillText(words.slice(Math.ceil(words.length / 2)).join(' '), 256, 272);
          } else {
            ctx.font = '800 32px "Segoe UI", system-ui, sans-serif';
            ctx.fillText(name, 256, 250);
          }
        }

        ctx.fillStyle = '#3f3f46';
        ctx.font = '600 24px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('240V~   30mA   6kA', 256, 330);
        ctx.fillStyle = '#52525b';
        ctx.font = '500 20px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('AS/NZS 61009.1  Type A', 256, 372);

        paperGrain(ctx, 512, 512, 0.04);
      }),
    [rating, circuitName]
  );
}

export function useCircuitLabelTexture(label: string) {
  return useMemo(
    () =>
      makeCanvas(512, 192, (ctx) => {
        ctx.fillStyle = '#f4f1ea';
        ctx.fillRect(0, 0, 512, 192);
        ctx.fillStyle = '#1e3a5f';
        ctx.fillRect(8, 8, 496, 176);
        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const words = label.split(' ');
        if (words.length > 1 && label.length > 10) {
          ctx.font = '800 44px "Segoe UI", system-ui, sans-serif';
          ctx.fillText(words.slice(0, Math.ceil(words.length / 2)).join(' '), 256, 70);
          ctx.fillText(words.slice(Math.ceil(words.length / 2)).join(' '), 256, 126);
        } else {
          ctx.font = '800 52px "Segoe UI", system-ui, sans-serif';
          ctx.fillText(label, 256, 96);
        }
        paperGrain(ctx, 512, 192, 0.06);
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
