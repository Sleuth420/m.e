'use client';

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';

export const COARSE_POINTER_QUERY = '(pointer: coarse), (max-width: 768px)';

export function useMediaQuery(query: string, ssrDefault = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => ssrDefault
  );
}

/** Coarse pointer or a phone-width viewport — shared by HUD, stick, and the room. */
export function useCoarsePointer() {
  const coarse = useMediaQuery(COARSE_POINTER_QUERY);
  const coarseRef = useRef(coarse);
  useLayoutEffect(() => {
    coarseRef.current = coarse;
  }, [coarse]);
  return { coarse, coarseRef };
}

export function useScrollPosition() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isScrolled;
}

export function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
