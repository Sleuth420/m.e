'use client';

import { useState, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Mail } from 'lucide-react';
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
import { fadeInUp } from '@/lib/animations';

interface ContactFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function ContactForm({ onSuccess, onError }: ContactFormProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<ContactFormData>(emptyContactFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const lastSubmissionRef = useRef<number>(0);
  const submittingRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const focusNextStep = useRef<number | null>(null);
  const errorId = useId();
  const [invalidField, setInvalidField] = useState<string | null>(null);

  const showValidationError = (message: string, currentStep: number) => {
    const field =
      currentStep === 0
        ? 'project_type'
        : currentStep === 2
          ? 'message'
          : !formData.name.trim()
            ? 'name'
            : 'email';
    setInvalidField(field);
    setErrorMessage(message);
    setSubmitStatus('error');
    formRef.current?.querySelector<HTMLElement>(`[name="${field}"]`)?.focus();
  };

  const focusStep = (element: HTMLElement | null, mountedStep: number) => {
    if (!element || focusNextStep.current !== mountedStep) return;
    focusNextStep.current = null;
    element.focus({ preventScroll: true });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setInvalidField(null);
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  const handleNext = () => {
    const err = validateContactStep(formData, step);
    if (err) {
      showValidationError(err, step);
      return;
    }
    setErrorMessage('');
    setSubmitStatus('idle');
    setInvalidField(null);
    focusNextStep.current = step + 1;
    setStep((s) => Math.min(s + 1, CONTACT_FORM_STEPS.length - 1));
  };

  const handleBack = () => {
    setErrorMessage('');
    setSubmitStatus('idle');
    setInvalidField(null);
    focusNextStep.current = step - 1;
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    if (step < CONTACT_FORM_STEPS.length - 1) {
      handleNext();
      return;
    }
    const validationError = validateContactStep(formData, 2);
    if (validationError) {
      showValidationError(validationError, step);
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

    submittingRef.current = true;
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
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full min-h-11 px-3 py-2.5 border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground text-base';

  return (
    <motion.div variants={fadeInUp}>
      <div className="flex flex-col items-center gap-3 mb-8 text-center">
        <div className="rounded-full gradient-bg p-3">
          <Mail className="h-5 w-5 text-primary-foreground" />
        </div>
        <h3 className="font-display text-xl font-bold">Send a Message</h3>
      </div>

      <div
        className="mb-8"
        role="progressbar"
        aria-label="Enquiry progress"
        aria-valuetext={`Step ${step + 1} of 3: ${CONTACT_FORM_STEPS[step]}`}
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

      <form ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
        <fieldset disabled={isSubmitting} className="min-w-0">
          <legend className="sr-only">{CONTACT_FORM_STEPS[step]}</legend>
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
                        ref={(element) => focusStep(element, 0)}
                        type="radio"
                        name="project_type"
                        aria-describedby={invalidField === 'project_type' ? errorId : undefined}
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
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name *
                  </label>
                  <input
                    ref={(element) => focusStep(element, 1)}
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    required
                    aria-invalid={invalidField === 'name'}
                    aria-describedby={invalidField === 'name' ? errorId : undefined}
                    value={formData.name}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    aria-invalid={invalidField === 'email'}
                    aria-describedby={invalidField === 'email' ? errorId : undefined}
                    value={formData.email}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="urgency" className="block text-sm font-medium mb-1">
                    Preferred timing
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    <option value="normal">Flexible — happy to discuss timing</option>
                    <option value="soon">Soon — please confirm availability</option>
                    <option value="emergency">
                      Urgent electrical job — subject to availability
                    </option>
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
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Message *
                  </label>
                  <textarea
                    ref={(element) => focusStep(element, 2)}
                    id="message"
                    name="message"
                    required
                    minLength={10}
                    aria-invalid={invalidField === 'message'}
                    aria-describedby={invalidField === 'message' ? errorId : undefined}
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className={`${inputClass} resize-vertical`}
                    placeholder="What do you need done? Include your suburb or website address and any deadline."
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {submitStatus === 'success' && (
            <div
              role="status"
              className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
            >
              <p className="text-sm text-green-600 dark:text-green-400">
                Thanks, your enquiry has been sent. I’ll reply to the email address you provided.
              </p>
            </div>
          )}

          {submitStatus === 'error' && errorMessage && (
            <div
              id={errorId}
              role="alert"
              className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg"
            >
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
              <Button type="submit" className="flex-1 gradient-bg text-primary-foreground min-h-11">
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
        </fieldset>
      </form>
    </motion.div>
  );
}
