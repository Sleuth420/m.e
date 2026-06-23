'use client';

import * as React from 'react';
import Link from 'next/link';
import { X, BriefcaseBusiness } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface AvailableForWorkPopupProps {
  className?: string;
}

export function AvailableForWorkPopup({ className }: AvailableForWorkPopupProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isFading, setIsFading] = React.useState(false);

  const dismissPopup = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsFading(false);
      sessionStorage.setItem('availablePopupDismissed', 'true');
    }, 300);
  };

  React.useEffect(() => {
    const isDismissed = sessionStorage.getItem('availablePopupDismissed') === 'true';

    const onScroll = () => {
      if (window.scrollY > 400 && !isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    const initialTimer = setTimeout(() => {
      if (!isDismissed && window.scrollY > 400) setIsVisible(true);
    }, 2000);

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
        'fixed z-50 p-1 shadow-lg rounded-lg bg-gradient-to-r from-primary to-amber-500',
        'bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 left-4 sm:left-auto sm:max-w-[320px]',
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
            <BriefcaseBusiness className="h-5 w-5 text-primary shrink-0" />
            <h3 className="font-semibold text-foreground">Now Available for Work</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Open to new opportunities and freelance projects in Melbourne and remotely.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button size="sm" className="gradient-bg text-primary-foreground w-full sm:w-auto" asChild>
              <Link href="/contact">Contact Me</Link>
            </Button>
            <Button size="sm" variant="outline" className="outline-brand w-full sm:w-auto" onClick={dismissPopup}>
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
