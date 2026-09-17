'use client';

import { usePathname } from 'next/navigation';
import { AvailableForWorkPopup } from '@/components/ui/available-for-work-popup';

export function SitePopups() {
  const pathname = usePathname();

  if (pathname === '/' || pathname === '/contact') return null;

  return <AvailableForWorkPopup />;
}
