'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { IconSelector } from '@/components/ui/icon-selector';
import { itemFadeIn } from '@/lib/animations';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  CONTACT_FORM_STEPS,
  PROJECT_TYPES,
  emptyContactFormData,
  validateContactStep,
  checkSubmissionRateLimit,
  mapSubmissionError,
  submitContactForm,
  type ContactFormData,
} from '@/lib/contact-form';

interface SecureContactFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function SecureContactForm({ onSuccess, onError }: SecureContactFormProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<ContactFormData>(emptyContactFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const lastSubmissionRef = useRef<number>(0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  const handleNext = () => {
    const err = validateContactStep(formData, step);
    if (err) {
      setErrorMessage(err);
      setSubmitStatus('error');
      return;
    }
    setErrorMessage('');
    setSubmitStatus('idle');
    setStep((s) => Math.min(s + 1, CONTACT_FORM_STEPS.length - 1));
  };

  const handleBack = () => {
    setErrorMessage('');
    setSubmitStatus('idle');
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const validationError = validateContactStep(formData, 2);
      if (validationError) {
        setErrorMessage(validationError);
        setSubmitStatus('error');
        onError?.(validationError);
        return;
      }

      const rateLimitError = checkSubmissionRateLimit(lastSubmissionRef.current);
      if (rateLimitError) {
        setErrorMessage(rateLimitError);
        setSubmitStatus('error');
        onError?.(rateLimitError);
        return;
      }

      setIsSubmitting(true);
      setSubmitStatus('idle');

      try {
        await submitContactForm(formData);
        setSubmitStatus('success');
        lastSubmissionRef.current = Date.now();
        setFormData(emptyContactFormData);
        setStep(0);
        onSuccess?.();
      } catch (error) {
        const errorMsg = mapSubmissionError(error);
        setErrorMessage(errorMsg);
        setSubmitStatus('error');
        onError?.(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, onSuccess, onError]
  );

  const inputClass =
    'w-full px-3 py-2.5 border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground text-sm';

  return (
    <motion.div variants={itemFadeIn}>
      <div className="flex flex-col items-center gap-3 mb-8 text-center">
        <div className="rounded-full gradient-bg p-3">
          <IconSelector name="Mail" className="h-5 w-5 text-primary-foreground" />
        </div>
        <h3 className="font-display text-xl font-bold">Send a Message</h3>
      </div>

      <div
        className="mb-8"
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={3}
      >
        <div className="flex justify-between mb-2">
          {CONTACT_FORM_STEPS.map((label, i) => (
            <span
              key={label}
              className={`text-xs font-medium ${i <= step ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {i + 1}. {label}
            </span>
          ))}
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-cyan-accent transition-all duration-300"
            style={{ width: `${((step + 1) / CONTACT_FORM_STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div aria-live="polite" className="sr-only">
          Step {step + 1} of {CONTACT_FORM_STEPS.length}: {CONTACT_FORM_STEPS[step]}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground mb-4">What can I help you with?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROJECT_TYPES.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-center gap-3 p-4 min-h-11 rounded-lg border cursor-pointer transition-colors ${
                      formData.project_type === type.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="project_type"
                      value={type.value}
                      checked={formData.project_type === type.value}
                      onChange={handleInputChange}
                      className="text-primary"
                    />
                    <span className="text-sm font-medium">{type.label}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="urgency" className="block text-sm font-medium mb-1">Urgency</label>
                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                  className={inputClass}
                >
                  <option value="normal">Normal — within a few days</option>
                  <option value="soon">Soon — within 24 hours</option>
                  <option value="emergency">Emergency — electrical urgent</option>
                </select>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className={`${inputClass} resize-vertical`}
                  placeholder="Tell me about your project..."
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {submitStatus === 'success' && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">
              Message sent successfully! I&apos;ll get back to you soon.
            </p>
          </div>
        )}

        {submitStatus === 'error' && errorMessage && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
            <p className="text-sm text-destructive">{errorMessage}</p>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8">
          {step > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="chrome-border min-h-11 w-full sm:w-auto"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
          {step < CONTACT_FORM_STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="flex-1 gradient-bg text-primary-foreground min-h-11"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 gradient-bg text-primary-foreground min-h-11"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Protected by reCAPTCHA. Your information is kept confidential.
        </p>
      </form>
    </motion.div>
  );
}
