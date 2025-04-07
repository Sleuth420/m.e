import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, trackEvent } from '../posthog';

export const usePostHog = () => {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return {
    trackEvent,
  };
}; 