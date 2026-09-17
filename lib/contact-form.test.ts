import { describe, expect, it } from 'vitest';
import { emptyContactFormData, mapSubmissionError, validateContactStep } from './contact-form';

describe('contact form validation', () => {
  it('validates only the active step while details are incomplete', () => {
    const data = { ...emptyContactFormData, project_type: 'electrical' };
    expect(validateContactStep(data, 0)).toBeNull();
    expect(validateContactStep(data, 1)).toBe('Name is required');
    expect(validateContactStep({ ...data, name: 'Ricky' }, 1)).toBe('Email is required');
  });

  it('accepts pasted email whitespace but rejects malformed addresses', () => {
    const data = { ...emptyContactFormData, name: 'Ricky', email: ' hello@example.com ' };
    expect(validateContactStep(data, 1)).toBeNull();
    expect(validateContactStep({ ...data, email: 'hello @example.com' }, 1)).toBe(
      'Please enter a valid email'
    );
  });

  it('does not count padding as message content', () => {
    expect(validateContactStep({ ...emptyContactFormData, message: '     short     ' }, 2)).toBe(
      'Message must be at least 10 characters'
    );
    expect(
      validateContactStep({ ...emptyContactFormData, message: 'Please call about my job.' }, 2)
    ).toBeNull();
  });

  it('explains failed delivery when spam protection is unavailable', () => {
    expect(mapSubmissionError(new Error('reCAPTCHA site key is not configured'))).toContain(
      'has not been sent'
    );
    expect(mapSubmissionError(new Error('reCAPTCHA script failed to load'))).toContain(
      'has not been sent'
    );
  });
});
