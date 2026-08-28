'use client';

import { useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';

import { POLYHAVEN } from './room-assets';
import { FIXTURES } from './room-layout';
import { useRepeatingPbr } from './room-textures';

type Portrait = {
  kicker: string;
  title: string;
  body: string;
  position: [number, number, number];
  tilt: number;
};

const PORTRAITS: Portrait[] = [
  {
    kicker: 'Dual Trade',
    title: 'A-Grade Electrician & Full-Stack Developer',
    body: 'Fully licensed for electrical work, and equally at home building the web app that sits next to it.',
    position: [FIXTURES.portrait1.x, FIXTURES.portrait1.y, FIXTURES.portrait1.z],
    tilt: -0.035,
  },
  {
    kicker: 'Today',
    title: 'Hands-on trade, modern stack',
    body: 'I combine an electrical background with web development — practical solutions for homes, worksites, and growing businesses.',
    position: [FIXTURES.portrait2.x, FIXTURES.portrait2.y, FIXTURES.portrait2.z],
    tilt: 0.04,
  },
];

function usePortraitTexture(p: Portrait) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1448;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D context unavailable');

    ctx.fillStyle = '#f3efe6';
    ctx.fillRect(0, 0, 1024, 1448);

    ctx.fillStyle = '#b91c1c';
    ctx.font = '600 40px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(p.kicker.toUpperCase(), 64, 120);

    ctx.fillStyle = '#1c1917';
    ctx.font = '700 56px "Georgia", "Times New Roman", serif';
    wrapText(ctx, p.title, 64, 220, 890, 68);

    ctx.fillStyle = '#44403c';
    ctx.font = '400 40px "Segoe UI", system-ui, sans-serif';
    wrapText(ctx, p.body, 64, 520, 890, 56);

    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(840, 1280, 90, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#b91c1c';
    ctx.font = '700 26px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('LICENSED', 840, 1272);
    ctx.fillText('VIC', 840, 1308);

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

function SitePaper({ portrait, lightsOn }: { portrait: Portrait; lightsOn: boolean }) {
  const print = usePortraitTexture(portrait);
  const paper = useRepeatingPbr(POLYHAVEN.sitePaper, [1.4, 2]);
  const w = 0.594;
  const h = 0.841;
  return (
    <group position={portrait.position} rotation={[0, Math.PI / 2, portrait.tilt]}>
      <mesh position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          map={paper.map}
          normalMap={paper.normalMap}
          roughnessMap={paper.roughnessMap}
          color={lightsOn ? '#fffaf2' : '#b4afa6'}
          roughness={0.86}
          metalness={0}
          envMapIntensity={lightsOn ? 0.62 : 0.2}
          normalScale={[0.28, 0.28]}
        />
      </mesh>
      <mesh position={[0, 0, 0.0015]}>
        <planeGeometry args={[w * 0.94, h * 0.95]} />
        <meshStandardMaterial
          map={print}
          transparent
          color={lightsOn ? '#ffffff' : '#a8a49c'}
          roughness={0.78}
          metalness={0}
          envMapIntensity={lightsOn ? 0.55 : 0.18}
          emissive={lightsOn ? '#e8dcc0' : '#000000'}
          emissiveIntensity={lightsOn ? 0.03 : 0}
        />
      </mesh>
      <mesh position={[0, h / 2 - 0.028, 0.01]} castShadow>
        <boxGeometry args={[0.07, 0.032, 0.014]} />
        <meshStandardMaterial color="#c5c9ce" metalness={0.82} roughness={0.28} />
      </mesh>
      <mesh position={[0, h / 2 + 0.01, 0.004]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.006, 0.006, 0.03, 10]} />
        <meshStandardMaterial color="#9aa0a6" metalness={0.7} roughness={0.35} />
      </mesh>
    </group>
  );
}

/** A1 site sheets clipped to the frame — they wash on with the lighting circuit. */
export function AboutPortraits({ lightsOn }: { lightsOn: boolean }) {
  return (
    <group>
      {PORTRAITS.map((p) => (
        <SitePaper key={p.kicker} portrait={p} lightsOn={lightsOn} />
      ))}
    </group>
  );
}
