import { trackEvent } from '../posthog';

export const usePostHog = () => {
  return {
    trackEvent,
  };
};
