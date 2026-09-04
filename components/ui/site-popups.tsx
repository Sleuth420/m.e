'use client';

import { usePathname } from 'next/navigation';
import { AvailableForWorkPopup } from '@/components/ui/available-for-work-popup';
import { BuyMeCoffeePopup } from '@/components/ui/buy-me-coffee-popup';

export function SitePopups() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  return (
    <>
      <AvailableForWorkPopup />
      <BuyMeCoffeePopup coffeeLink="https://www.buymeacoffee.com/oakcodeandtechsolutions" />
    </>
  );
}
