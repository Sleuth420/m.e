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

/** Portrait device print — canvas aspect matches the face plate (see MODULE_WELLS.face). */
const FACE_W = 384;
const FACE_H = 640;

/** MAX9-style face print: matches body plastic so it reads printed, not a card. */
export function useMainSwitchFaceTexture() {
  return useMemo(
    () =>
      makeCanvas(FACE_W, FACE_H, (ctx) => {
        ctx.fillStyle = '#e8e8ea';
        ctx.fillRect(0, 0, FACE_W, FACE_H);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = '#9b1c1c';
        ctx.fillRect(20, 20, FACE_W - 40, 96);
        ctx.fillStyle = '#fafafa';
        ctx.font = '800 60px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('ISOLATOR', FACE_W / 2, 70);

        ctx.fillStyle = '#18181b';
        ctx.font = '800 176px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('63A', FACE_W / 2, 250);
        ctx.font = '700 58px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('240V~  50Hz', FACE_W / 2, 400);
        ctx.font = '700 50px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('AC-22A', FACE_W / 2, 480);
        ctx.fillStyle = '#52525b';
        ctx.font = '600 38px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('AS/NZS 60947.3', FACE_W / 2, 580);

        paperGrain(ctx, FACE_W, FACE_H, 0.04);
      }),
    []
  );
}

export function useRcboFaceTexture(rating: string) {
  return useMemo(
    () =>
      makeCanvas(FACE_W, FACE_H, (ctx) => {
        ctx.fillStyle = '#e8e8ea';
        ctx.fillRect(0, 0, FACE_W, FACE_H);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = '#1e4a8c';
        ctx.fillRect(20, 20, FACE_W - 40, 96);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 62px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('RCBO', FACE_W / 2, 70);

        ctx.fillStyle = '#18181b';
        ctx.font = '800 176px "Segoe UI", system-ui, sans-serif';
        ctx.fillText(rating, FACE_W / 2, 250);

        ctx.font = '800 96px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('30mA', FACE_W / 2, 400);

        ctx.fillStyle = '#3f3f46';
        ctx.font = '700 46px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('240V~  6kA  Type A', FACE_W / 2, 490);
        ctx.fillStyle = '#52525b';
        ctx.font = '600 38px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('AS/NZS 61009.1', FACE_W / 2, 580);

        paperGrain(ctx, FACE_W, FACE_H, 0.04);
      }),
    [rating]
  );
}

export type LabelStripCell = {
  /** Circuit number (AS/NZS 3000 circuit designation) or "MAIN". */
  id: string;
  lines: string[];
  tone?: 'main' | 'circuit' | 'spare';
};

const STRIP_CELL_W = 320;
const STRIP_CELL_H = 440;

/**
 * One engraved label strip under the pole row — one cell per pole.
 * Landscape canvas so the aspect matches the mesh and the text stays crisp.
 */
export function useLabelStripTexture(cells: LabelStripCell[]) {
  const key = JSON.stringify(cells);
  return useMemo(
    () =>
      makeCanvas(STRIP_CELL_W * cells.length, STRIP_CELL_H, (ctx) => {
        const w = STRIP_CELL_W * cells.length;
        ctx.fillStyle = '#f7f5ef';
        ctx.fillRect(0, 0, w, STRIP_CELL_H);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        cells.forEach((cell, i) => {
          const x0 = i * STRIP_CELL_W;
          const cx = x0 + STRIP_CELL_W / 2;
          const tone = cell.tone ?? 'circuit';
          const badge = tone === 'main' ? '#9b1c1c' : tone === 'spare' ? '#71717a' : '#1e3a5f';

          // Cell divider
          ctx.fillStyle = '#c9c4b8';
          ctx.fillRect(x0, 0, 4, STRIP_CELL_H);

          // Designation badge
          ctx.fillStyle = badge;
          ctx.fillRect(x0 + 26, 24, STRIP_CELL_W - 52, 128);
          ctx.fillStyle = '#fafafa';
          ctx.font = `800 ${cell.id.length > 2 ? 62 : 92}px "Segoe UI", system-ui, sans-serif`;
          ctx.fillText(cell.id, cx, 90);

          // Description lines
          ctx.fillStyle = tone === 'spare' ? '#71717a' : '#18181b';
          const lines = cell.lines.slice(0, 3);
          const size = lines.some((l) => l.length > 8) ? 50 : 60;
          ctx.font = `800 ${size}px "Segoe UI", system-ui, sans-serif`;
          const lineH = size + 14;
          const startY = 236 + ((3 - lines.length) * lineH) / 2;
          lines.forEach((line, li) => ctx.fillText(line, cx, startY + li * lineH));
        });
        ctx.fillStyle = '#c9c4b8';
        ctx.fillRect(w - 4, 0, 4, STRIP_CELL_H);
        ctx.fillRect(0, 0, w, 4);
        ctx.fillRect(0, STRIP_CELL_H - 4, w, 4);
        paperGrain(ctx, w, STRIP_CELL_H, 0.05);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );
}

/** Durable RCD notice required on the switchboard (AS/NZS 3000 Section 2). */
export function useRcdNoticeTexture() {
  return useMemo(
    () =>
      makeCanvas(1024, 256, (ctx) => {
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(0, 0, 1024, 256);
        ctx.strokeStyle = '#18181b';
        ctx.lineWidth = 10;
        ctx.strokeRect(8, 8, 1008, 240);
        ctx.fillStyle = '#18181b';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '800 54px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('RCD PROTECTION FITTED', 512, 58);
        ctx.font = '600 38px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('Press the T button regularly to test.', 512, 130);
        ctx.fillText('If the device does not trip, call a licensed electrician.', 512, 190);
        paperGrain(ctx, 1024, 256, 0.04);
      }),
    []
  );
}

/** Main switch designation plate — AS/NZS 3000 requires it to be marked. */
export function useMainSwitchPlateTexture() {
  return useMemo(
    () =>
      makeCanvas(768, 192, (ctx) => {
        ctx.fillStyle = '#18181b';
        ctx.fillRect(0, 0, 768, 192);
        ctx.fillStyle = '#fafafa';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '800 96px "Segoe UI", system-ui, sans-serif';
        ctx.fillText('MAIN SWITCH', 384, 96);
      }),
    []
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
