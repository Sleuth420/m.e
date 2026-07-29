'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CIRCUITS } from './circuit-data';

function initialRcboState(): Record<string, boolean> {
  return Object.fromEntries(CIRCUITS.map((c) => [c.id, true]));
}

/** Board interaction state; separate from 3D composition. */
export function useSwitchboardState() {
  const [mainOn, setMainOn] = useState(true);
  const [rcboOn, setRcboOn] = useState<Record<string, boolean>>(initialRcboState);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tripFlashId, setTripFlashId] = useState<string | null>(null);

  const toggleMain = useCallback(() => {
    setMainOn((v) => !v);
  }, []);

  const toggleRcbo = useCallback((id: string) => {
    setRcboOn((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  }, []);

  const tripRcbo = useCallback((id: string) => {
    setRcboOn((prev) => ({ ...prev, [id]: false }));
    setTripFlashId(id);
  }, []);

  useEffect(() => {
    if (!tripFlashId) return;
    const t = window.setTimeout(() => setTripFlashId(null), 420);
    return () => window.clearTimeout(t);
  }, [tripFlashId]);

  const liveById = useMemo(
    () =>
      Object.fromEntries(
        CIRCUITS.map((c) => [c.id, mainOn && (rcboOn[c.id] ?? false)])
      ) as Record<string, boolean>,
    [mainOn, rcboOn]
  );

  const flashCircuit = useMemo(
    () => CIRCUITS.find((c) => c.id === tripFlashId) ?? null,
    [tripFlashId]
  );

  return {
    mainOn,
    rcboOn,
    hovered,
    setHovered,
    tripFlashId,
    toggleMain,
    toggleRcbo,
    tripRcbo,
    liveById,
    flashCircuit,
  };
}
