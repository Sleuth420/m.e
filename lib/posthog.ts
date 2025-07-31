import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug();
    },
    capture_pageview: false, // We'll handle this manually
  });
}

export const posthogClient = posthog;

export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined') {
    posthogClient.capture('$pageview', {
      $current_url: window.location.href,
      path,
    });
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  if (typeof window !== 'undefined') {
    posthogClient.capture(eventName, properties);
  }
}; 