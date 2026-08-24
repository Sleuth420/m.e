'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CIRCUITS } from './circuit-data';

export type TripReason = 'test' | 'shock' | null;

function initialRcboState(): Record<string, boolean> {
  return Object.fromEntries(CIRCUITS.map((c) => [c.id, true]));
}

/** Board interaction state; separate from 3D composition. */
export function useSwitchboardState() {
  const [mainOn, setMainOn] = useState(true);
  const [rcboOn, setRcboOn] = useState<Record<string, boolean>>(initialRcboState);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tripFlashId, setTripFlashId] = useState<string | null>(null);
  const [tripReason, setTripReason] = useState<TripReason>(null);
  const [coverOpen, setCoverOpen] = useState(false);
  const [coverPromptOpen, setCoverPromptOpen] = useState(false);
  const [shockActive, setShockActive] = useState(false);
  const [shockCircuitId, setShockCircuitId] = useState<string | null>(null);

  const toggleMain = useCallback(() => {
    setMainOn((v) => !v);
  }, []);

  const toggleRcbo = useCallback((id: string) => {
    setRcboOn((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  }, []);

  const tripRcbo = useCallback((id: string, reason: TripReason = 'test') => {
    setRcboOn((prev) => ({ ...prev, [id]: false }));
    setTripFlashId(id);
    setTripReason(reason);
  }, []);

  const requestCoverOpen = useCallback(() => {
    if (coverOpen) return;
    setCoverPromptOpen(true);
  }, [coverOpen]);

  const confirmCoverOpen = useCallback(() => {
    setCoverOpen(true);
    setCoverPromptOpen(false);
  }, []);

  const denyCoverOpen = useCallback(() => {
    setCoverPromptOpen(false);
  }, []);

  const closeCover = useCallback(() => {
    setCoverOpen(false);
  }, []);

  const shockOnWire = useCallback(
    (circuitId: string) => {
      if (shockActive) return;
      tripRcbo(circuitId, 'shock');
      setShockCircuitId(circuitId);
      setShockActive(true);
      window.dispatchEvent(new CustomEvent('switchboard-shock'));
    },
    [shockActive, tripRcbo]
  );

  const shockOnMains = useCallback(() => {
    if (shockActive || !mainOn) return;
    setMainOn(false);
    setTripReason('shock');
    setShockCircuitId('main');
    setShockActive(true);
    window.dispatchEvent(new CustomEvent('switchboard-shock'));
  }, [mainOn, shockActive]);

  useEffect(() => {
    if (!tripFlashId) return;
    const t = window.setTimeout(() => {
      setTripFlashId(null);
      if (tripReason === 'test') setTripReason(null);
    }, 420);
    return () => window.clearTimeout(t);
  }, [tripFlashId, tripReason]);

  useEffect(() => {
    if (!shockActive) return;
    const t = window.setTimeout(() => {
      setShockActive(false);
      setShockCircuitId(null);
      setTripReason(null);
    }, 2200);
    return () => window.clearTimeout(t);
  }, [shockActive]);

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
    tripReason,
    coverOpen,
    coverPromptOpen,
    shockActive,
    shockCircuitId,
    toggleMain,
    toggleRcbo,
    tripRcbo,
    liveById,
    flashCircuit,
    requestCoverOpen,
    confirmCoverOpen,
    denyCoverOpen,
    closeCover,
    shockOnWire,
    shockOnMains,
  };
}
