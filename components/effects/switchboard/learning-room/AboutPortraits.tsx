'use client';

import { useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';

import { FIXTURES } from './room-layout';

type Portrait = {
  kicker: string;
  title: string;
  body: string;
  position: [number, number, number];
};

const PORTRAITS: Portrait[] = [
  {
    kicker: 'Dual Trade',
    title: 'A-Grade Electrician & Full-Stack Developer',
    body: 'Fully licensed for electrical work, and equally at home building the web app that sits next to it.',
    position: [FIXTURES.portrait1.x, FIXTURES.portrait1.y, FIXTURES.portrait1.z],
  },
  {
    kicker: 'Today',
    title: 'Hands-on trade, modern stack',
    body: 'I combine an electrical background with web development — practical solutions for homes, worksites, and growing businesses.',
    position: [FIXTURES.portrait2.x, FIXTURES.portrait2.y, FIXTURES.portrait2.z],
  },
];

function usePortraitTexture(p: Portrait) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D context unavailable');

    ctx.fillStyle = '#111113';
    ctx.fillRect(0, 0, 512, 768);
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(18, 18, 476, 732);

    ctx.fillStyle = '#b91c1c';
    ctx.font = '600 22px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(p.kicker.toUpperCase(), 48, 90);

    ctx.fillStyle = '#18181b';
    ctx.font = '700 32px "Georgia", "Times New Roman", serif';
    wrapText(ctx, p.title, 48, 150, 416, 40);

    ctx.fillStyle = '#3f3f46';
    ctx.font = '400 24px "Segoe UI", system-ui, sans-serif';
    wrapText(ctx, p.body, 48, 340, 416, 34);

    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [p]);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lineH: number
) {
  const words = text.split(' ');
  let line = '';
  let yy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW) {
      ctx.fillText(line, x, yy);
      line = word;
      yy += lineH;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, yy);
}

function PortraitCard({ portrait }: { portrait: Portrait }) {
  const map = usePortraitTexture(portrait);
  return (
    <group position={portrait.position} rotation={[0, Math.PI / 2, 0]}>
      <mesh position={[0, 0, -0.008]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.56, 0.022]} />
        <meshStandardMaterial color="#1c1917" roughness={0.42} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0, 0.004]} receiveShadow>
        <boxGeometry args={[0.372, 0.512, 0.004]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.008]}>
        <planeGeometry args={[0.348, 0.488]} />
        <meshStandardMaterial map={map} roughness={0.62} />
      </mesh>
    </group>
  );
}

/** Framed certificates under the wall lights — always on the plaster, not blank boards. */
export function AboutPortraits({ lightsOn: _lightsOn }: { lightsOn: boolean }) {
  return (
    <group>
      {PORTRAITS.map((p) => (
        <PortraitCard key={p.kicker} portrait={p} />
      ))}
    </group>
  );
}
