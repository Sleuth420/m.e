'use client';

import * as React from 'react';
import { X, BriefcaseBusiness } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { useSmoothScroll } from '@/lib/hooks';

interface AvailableForWorkPopupProps {
  className?: string;
}

export function AvailableForWorkPopup({ className }: AvailableForWorkPopupProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const scrollToSection = useSmoothScroll();
  
  // Only hide for the current session
  const dismissPopup = () => {
    setIsVisible(false);
    sessionStorage.setItem('availablePopupDismissed', 'true');
  };
  
  // Check if the popup was previously dismissed in this session
  React.useEffect(() => {
    const isDismissed = sessionStorage.getItem('availablePopupDismissed') === 'true';
    if (isDismissed) {
      setIsVisible(false);
    }
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div className={cn(
      "fixed bottom-4 right-4 max-w-[320px] rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 p-1 shadow-lg z-50 animate-fade-in animate-slide-in-from-bottom",
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
            <BriefcaseBusiness className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold">Now Available for Work</h3>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Looking for a skilled developer? I'm currently open to new opportunities and freelance projects.
          </p>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              asChild
            >
              <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>
                Contact Me
              </a>
            </Button>
            <Button size="sm" variant="outline" onClick={dismissPopup}>
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 