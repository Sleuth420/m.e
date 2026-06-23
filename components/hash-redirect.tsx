'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HASH_REDIRECTS: Record<string, string> = {
  about: '/about',
  services: '/services',
  projects: '/projects',
  contact: '/contact',
};

export function HashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && HASH_REDIRECTS[hash]) {
      router.replace(HASH_REDIRECTS[hash]);
    }
  }, [router]);

  return null;
}
