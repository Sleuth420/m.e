'use client';

import * as React from 'react';
import { X, Coffee } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface BuyMeCoffeePopupProps {
  className?: string;
  coffeeLink?: string;
}

export function BuyMeCoffeePopup({
  className,
  coffeeLink = 'https://www.buymeacoffee.com',
}: BuyMeCoffeePopupProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isFading, setIsFading] = React.useState(false);

  const dismissPopup = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsFading(false);
      sessionStorage.setItem('coffeePopupDismissed', 'true');
    }, 300);
  };

  React.useEffect(() => {
    const isDismissed = sessionStorage.getItem('coffeePopupDismissed') === 'true';

    const onScroll = () => {
      if (window.scrollY > 600 && !isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    const initialTimer = setTimeout(() => {
      if (!isDismissed && window.scrollY > 600) setIsVisible(true);
    }, 3000);

    let dismissTimer: ReturnType<typeof setTimeout>;
    if (isVisible) {
      dismissTimer = setTimeout(dismissPopup, 30000);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(initialTimer);
      clearTimeout(dismissTimer);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed z-40 p-1 shadow-lg rounded-lg bg-gradient-to-r from-amber-500 to-amber-600',
        'bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 right-4 sm:right-auto sm:max-w-[280px]',
        'animate-fade-in animate-slide-in-from-bottom',
        isFading && 'animate-fade-out',
        className
      )}
    >
      <div className="relative rounded-md bg-background text-foreground p-4 border border-border">
        <button
          type="button"
          onClick={dismissPopup}
          className="absolute right-2 top-2 rounded-full p-2 hover:bg-muted touch-target"
          aria-label="Close popup"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col space-y-3 pr-6">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-amber-500 shrink-0" />
            <h3 className="font-semibold text-foreground">Support My Work</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            If you find my work helpful, consider buying me a coffee.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-white w-full sm:w-auto"
              onClick={() => window.open(coffeeLink, '_blank')}
            >
              Buy Me a Coffee
            </Button>
            <Button size="sm" variant="outline" className="outline-brand w-full sm:w-auto" onClick={dismissPopup}>
              Maybe Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
