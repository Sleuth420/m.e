'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useSwitchboardState } from './useSwitchboardState';

type SwitchboardApi = ReturnType<typeof useSwitchboardState>;

const SwitchboardContext = createContext<SwitchboardApi | null>(null);

export function SwitchboardProvider({ children }: { children: ReactNode }) {
  const state = useSwitchboardState();
  return <SwitchboardContext.Provider value={state}>{children}</SwitchboardContext.Provider>;
}

export function useSwitchboard() {
  const value = useContext(SwitchboardContext);
  if (!value) {
    throw new Error('useSwitchboard must be used inside SwitchboardProvider');
  }
  return value;
}
