'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSwitchboard } from '../SwitchboardContext';
import { useGameInput } from './GameInputContext';

/** Keep expensive shadows static while walking; adapt resolution to actual frame time. */
export function ScenePerformance() {
  const { gl, setDpr, invalidate } = useThree();
  const rendererRef = useRef(gl);
  const { play, wiringView, setLowDetail } = useGameInput();
  const { coverOpen } = useSwitchboard();
  const sample = useRef({ elapsed: 0, frames: 0, slowWindows: 0, reduced: false });

  useEffect(() => {
    rendererRef.current.shadowMap.autoUpdate = false;
    rendererRef.current.shadowMap.needsUpdate = true;
    invalidate();
    // Refresh again after hinged doors settle, not on every camera frame.
    const settled = window.setTimeout(() => {
      rendererRef.current.shadowMap.needsUpdate = true;
      invalidate();
    }, 650);
    return () => window.clearTimeout(settled);
  }, [gl, invalidate, play, wiringView, coverOpen]);

  useFrame((_, delta) => {
    const s = sample.current;
    if (s.reduced) return;
    s.elapsed += delta;
    s.frames++;
    if (s.elapsed < 3) return;
    if (s.frames / s.elapsed < 24) s.slowWindows++;
    else s.slowWindows = 0;
    s.elapsed = 0;
    s.frames = 0;
    // Ignore a single compilation/loading window. Don't oscillate quality.
    if (s.slowWindows >= 2) {
      s.reduced = true;
      setLowDetail(true);
      setDpr(0.75);
      rendererRef.current.shadowMap.enabled = false;
      invalidate();
    }
  });
  return null;
}
