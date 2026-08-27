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
    canvas.width = 512;
    canvas.height = 724;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D context unavailable');

    ctx.fillStyle = '#f3efe6';
    ctx.fillRect(0, 0, 512, 724);

    ctx.fillStyle = '#b91c1c';
    ctx.font = '600 20px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(p.kicker.toUpperCase(), 36, 64);

    ctx.fillStyle = '#1c1917';
    ctx.font = '700 28px "Georgia", "Times New Roman", serif';
    wrapText(ctx, p.title, 36, 112, 440, 36);

    ctx.fillStyle = '#44403c';
    ctx.font = '400 22px "Segoe UI", system-ui, sans-serif';
    wrapText(ctx, p.body, 36, 280, 440, 32);

    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(420, 640, 48, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#b91c1c';
    ctx.font = '700 14px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('LICENSED', 420, 636);
    ctx.fillText('VIC', 420, 656);

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
  const paper = useRepeatingPbr(POLYHAVEN.sitePaper, [1.05, 1.45]);
  return (
    <group position={portrait.position} rotation={[0, Math.PI / 2, portrait.tilt]}>
      <mesh position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[0.21, 0.297]} />
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
        <planeGeometry args={[0.198, 0.282]} />
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
      <mesh position={[0, 0.138, 0.006]} castShadow>
        <boxGeometry args={[0.032, 0.016, 0.007]} />
        <meshStandardMaterial color="#c5c9ce" metalness={0.82} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.152, 0.002]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.003, 0.003, 0.018, 10]} />
        <meshStandardMaterial color="#9aa0a6" metalness={0.7} roughness={0.35} />
      </mesh>
    </group>
  );
}

/** A4 printouts clipped to the frame — they wash on with the lighting circuit. */
export function AboutPortraits({ lightsOn }: { lightsOn: boolean }) {
  return (
    <group>
      {PORTRAITS.map((p) => (
        <SitePaper key={p.kicker} portrait={p} lightsOn={lightsOn} />
      ))}
    </group>
  );
}
