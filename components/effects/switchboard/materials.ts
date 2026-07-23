'use client';

import { useMemo } from 'react';
import { MeshStandardMaterial } from 'three';

export function useSwitchboardMaterials() {
  return useMemo(() => {
    const enclosure = new MeshStandardMaterial({
      color: '#f4f4f5',
      roughness: 0.55,
      metalness: 0.05,
    });
    const enclosureInner = new MeshStandardMaterial({
      color: '#e4e4e7',
      roughness: 0.62,
      metalness: 0.02,
    });
    const plasticGrey = new MeshStandardMaterial({
      color: '#d4d4d8',
      roughness: 0.48,
      metalness: 0.08,
    });
    const plasticDark = new MeshStandardMaterial({
      color: '#3f3f46',
      roughness: 0.4,
      metalness: 0.1,
    });
    const plasticRed = new MeshStandardMaterial({
      color: '#dc2626',
      roughness: 0.35,
      metalness: 0.12,
    });
    const plasticBlue = new MeshStandardMaterial({
      color: '#2563eb',
      roughness: 0.45,
      metalness: 0.08,
    });
    const plasticYellow = new MeshStandardMaterial({
      color: '#eab308',
      roughness: 0.5,
      metalness: 0.05,
    });
    const dinRail = new MeshStandardMaterial({
      color: '#a1a1aa',
      roughness: 0.35,
      metalness: 0.85,
    });
    const brass = new MeshStandardMaterial({
      color: '#b45309',
      roughness: 0.28,
      metalness: 0.95,
    });
    const screw = new MeshStandardMaterial({
      color: '#71717a',
      roughness: 0.3,
      metalness: 0.9,
    });
    const wireActive = new MeshStandardMaterial({
      color: '#dc2626',
      roughness: 0.35,
      metalness: 0.05,
    });
    const wireNeutral = new MeshStandardMaterial({
      color: '#18181b',
      roughness: 0.35,
      metalness: 0.05,
    });
    const wireEarth = new MeshStandardMaterial({
      color: '#84cc16',
      roughness: 0.4,
      metalness: 0.05,
    });
    const backboard = new MeshStandardMaterial({
      color: '#57534e',
      roughness: 0.85,
      metalness: 0.02,
    });
    const wall = new MeshStandardMaterial({
      color: '#27272a',
      roughness: 0.92,
      metalness: 0.0,
    });
    const labelGreen = new MeshStandardMaterial({
      color: '#16a34a',
      roughness: 0.55,
      metalness: 0.05,
    });
    const highlight = new MeshStandardMaterial({
      color: '#f97316',
      emissive: '#f97316',
      emissiveIntensity: 0.35,
      roughness: 0.4,
      metalness: 0.1,
    });

    return {
      enclosure,
      enclosureInner,
      plasticGrey,
      plasticDark,
      plasticRed,
      plasticBlue,
      plasticYellow,
      dinRail,
      brass,
      screw,
      wireActive,
      wireNeutral,
      wireEarth,
      backboard,
      wall,
      labelGreen,
      highlight,
    };
  }, []);
}

export type SwitchboardMaterials = ReturnType<typeof useSwitchboardMaterials>;
