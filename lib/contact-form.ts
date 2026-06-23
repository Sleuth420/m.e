export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  project_type: string;
  urgency: string;
}

export const CONTACT_FORM_STEPS = ['Service', 'Details', 'Message'] as const;

export const PROJECT_TYPES = [
  { value: 'website', label: 'Website Development' },
  { value: 'custom_app', label: 'Custom Application' },
  { value: 'electrical', label: 'Electrical Services' },
  { value: 'embedded', label: 'Embedded Systems / IoT' },
  { value: 'marketing', label: 'Marketing & SEO' },
  { value: 'it_setup', label: 'IT & Business Setup' },
  { value: 'security', label: 'Cybersecurity' },
  { value: 'design', label: 'Design & 3D Modeling' },
  { value: 'other', label: 'Other' },
] as const;

export const RATE_LIMIT_MS = 5 * 60 * 1000;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactStep(data: ContactFormData, stepIndex: number): string | null {
  if (stepIndex === 0 && !data.project_type) {
    return 'Please select a service type';
  }
  if (stepIndex === 1) {
    if (!data.name.trim()) return 'Name is required';
    if (!data.email.trim()) return 'Email is required';
    if (!EMAIL_REGEX.test(data.email)) return 'Please enter a valid email';
  }
  if (stepIndex === 2) {
    if (!data.message.trim()) return 'Message is required';
    if (data.message.length < 10) return 'Message must be at least 10 characters';
  }
  return null;
}

export function checkSubmissionRateLimit(lastSubmissionMs: number): string | null {
  const elapsed = Date.now() - lastSubmissionMs;
  if (elapsed < RATE_LIMIT_MS) {
    const remainingMinutes = Math.ceil((RATE_LIMIT_MS - elapsed) / 1000 / 60);
    return `Please wait ${remainingMinutes} minutes before submitting again`;
  }
  return null;
}

export function mapSubmissionError(error: unknown): string {
  const rawMessage =
    error instanceof Error ? error.message : 'Failed to send message. Please try again.';
  const normalized = rawMessage.toLowerCase();
  if (
    normalized.includes('gmail_api') ||
    normalized.includes('invalid grant') ||
    normalized.includes('oauth') ||
    normalized.includes('access token')
  ) {
    return 'Email service is temporarily unavailable. Please try again in a few minutes.';
  }
  return rawMessage;
}

export async function waitForRecaptcha(maxAttempts = 20, intervalMs = 500): Promise<void> {
  if (typeof window === 'undefined') return;

  let attempts = 0;
  while (!window.grecaptcha && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    attempts++;
  }

  if (!window.grecaptcha) {
    throw new Error('reCAPTCHA script failed to load. Please try again.');
  }
}

export async function getRecaptchaToken(siteKey: string): Promise<string> {
  await waitForRecaptcha();
  const grecaptcha = window.grecaptcha;
  if (!grecaptcha) {
    throw new Error('reCAPTCHA script failed to load. Please try again.');
  }

  return new Promise((resolve, reject) => {
    grecaptcha.ready(() => {
      grecaptcha.execute(siteKey, { action: 'contact_form' }).then(resolve).catch(reject);
    });
  });
}

export async function submitContactForm(data: ContactFormData): Promise<void> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) throw new Error('reCAPTCHA site key is not configured');

  const token = await getRecaptchaToken(siteKey);
  const emailjs = await import('@emailjs/browser');

  await emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
    {
      name: data.name,
      email: data.email,
      project_type: data.project_type,
      message: `[Urgency: ${data.urgency}]\n\n${data.message}`,
      time: new Date().toLocaleString(),
      recaptcha_token: token,
    },
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
  );
}

export const emptyContactFormData: ContactFormData = {
  name: '',
  email: '',
  message: '',
  project_type: '',
  urgency: 'normal',
};
