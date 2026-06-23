export {};

declare global {
  interface Window {
    triggerKonami?: () => void;
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}
