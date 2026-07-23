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

export function useMainSwitchFaceTexture() {
  return useMemo(
    () =>
      makeCanvas(128, 512, (ctx) => {
        ctx.fillStyle = '#d4d4d8';
        ctx.fillRect(0, 0, 128, 512);
        ctx.fillStyle = '#18181b';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('MAIN', 64, 48);
        ctx.fillText('63A', 64, 78);
        ctx.font = '14px sans-serif';
        ctx.fillText('240V~', 64, 105);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(16, 130, 96, 6);
        ctx.fillStyle = '#18181b';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('ISOLATOR', 64, 160);
      }),
    []
  );
}

export function useRcboFaceTexture(rating: string) {
  return useMemo(
    () =>
      makeCanvas(128, 512, (ctx) => {
        ctx.fillStyle = '#d4d4d8';
        ctx.fillRect(0, 0, 128, 512);
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(10, 130, 108, 26);
        ctx.fillStyle = '#18181b';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(rating, 64, 52);
        ctx.font = '14px sans-serif';
        ctx.fillText('240V~', 64, 78);
        ctx.fillText('30mA', 64, 100);
        ctx.fillStyle = '#fafafa';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('RCBO', 64, 148);
        ctx.fillStyle = '#18181b';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('TEST', 64, 300);
      }),
    [rating]
  );
}

export function useCircuitLabelTexture(label: string) {
  return useMemo(
    () =>
      makeCanvas(256, 64, (ctx) => {
        ctx.fillStyle = '#15803d';
        ctx.fillRect(0, 0, 256, 64);
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(2, 2, 252, 60);
        ctx.fillStyle = '#fafafa';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const words = label.split(' ');
        if (label.length > 18 && words.length > 2) {
          ctx.font = 'bold 13px sans-serif';
          ctx.fillText(words.slice(0, 2).join(' '), 128, 22);
          ctx.fillText(words.slice(2).join(' '), 128, 42);
        } else {
          ctx.fillText(label, 128, 32);
        }
      }),
    [label]
  );
}

export function useEarthStripeTexture() {
  return useMemo(() => {
    const texture = makeCanvas(64, 64, (ctx) => {
      ctx.fillStyle = '#65a30d';
      ctx.fillRect(0, 0, 64, 64);
      ctx.fillStyle = '#eab308';
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
