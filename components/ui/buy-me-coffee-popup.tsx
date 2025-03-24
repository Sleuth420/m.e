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
  coffeeLink = "https://www.buymeacoffee.com" // Replace with your actual Buy Me a Coffee link
}: BuyMeCoffeePopupProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  
  // Only hide for the current session
  const dismissPopup = () => {
    setIsVisible(false);
    sessionStorage.setItem('coffeePopupDismissed', 'true');
  };
  
  // Check if the popup was previously dismissed in this session
  React.useEffect(() => {
    const isDismissed = sessionStorage.getItem('coffeePopupDismissed') === 'true';
    if (isDismissed) {
      setIsVisible(false);
    }

    // Show this popup with a slight delay after page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div className={cn(
      "fixed bottom-4 left-4 max-w-[280px] rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 p-1 shadow-lg z-50 animate-fade-in animate-slide-in-from-bottom",
      className
    )}>
      <div className="relative rounded-md bg-background p-4">
        <button 
          onClick={dismissPopup}
          className="absolute right-2 top-2 rounded-full p-1 hover:bg-muted"
          aria-label="Close popup"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-amber-500" />
            <h3 className="font-semibold">Support My Work</h3>
          </div>
          
          <p className="text-sm text-muted-foreground">
            If you find my work helpful, consider buying me a coffee to fuel more open-source projects.
          </p>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="bg-amber-500 hover:bg-amber-600"
              onClick={() => window.open(coffeeLink, '_blank')}
            >
              Buy Me a Coffee
            </Button>
            <Button size="sm" variant="outline" onClick={dismissPopup}>
              Maybe Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 