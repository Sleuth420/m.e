'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IconSelector } from '@/components/ui/icon-selector';
import { itemFadeIn } from '@/lib/animations';

interface FormData {
  name: string;
  email: string;
  message: string;
  project_type: string;
}

interface SecureContactFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function SecureContactForm({ onSuccess, onError }: SecureContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    project_type: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Rate limiting
  const lastSubmissionRef = useRef<number>(0);
  const RATE_LIMIT_MS = 5 * 60 * 1000; // 5 minutes

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Reset status when user starts typing
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.message.trim()) return 'Message is required';
    if (!formData.project_type) return 'Project type is required';
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Please enter a valid email';
    
    // Message length check
    if (formData.message.length < 10) return 'Message must be at least 10 characters';
    
    return null;
  };

  const checkRateLimit = () => {
    const now = Date.now();
    if (now - lastSubmissionRef.current < RATE_LIMIT_MS) {
      const remainingTime = Math.ceil((RATE_LIMIT_MS - (now - lastSubmissionRef.current)) / 1000 / 60);
      return `Please wait ${remainingTime} minutes before submitting again`;
    }
    return null;
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    const rateLimitError = checkRateLimit();
    if (rateLimitError) {
      setErrorMessage(rateLimitError);
      setSubmitStatus('error');
      onError?.(rateLimitError);
      return;
    }

    // Form validation
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      setSubmitStatus('error');
      onError?.(validationError);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Check if reCAPTCHA is available
      if (typeof window === 'undefined') {
        throw new Error('reCAPTCHA can only run in the browser');
      }

      // Debug info
      console.log('reCAPTCHA check:', {
        grecaptcha: !!window.grecaptcha,
        ready: !!window.grecaptcha?.ready,
        siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.substring(0, 10) + '...'
      });

      // Wait for reCAPTCHA to be available
      let attempts = 0;
      const maxAttempts = 20; // Increased from 10
      
      while (!window.grecaptcha && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }

      if (!window.grecaptcha) {
        throw new Error('reCAPTCHA script failed to load. Please check your internet connection and try again.');
      }

      // Execute reCAPTCHA with better error handling
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (!siteKey) {
        throw new Error('reCAPTCHA site key is not configured');
      }

      const token = await new Promise<string>((resolve, reject) => {
        try {
          window.grecaptcha.ready(() => {
            try {
              window.grecaptcha.execute(siteKey, { action: 'contact_form' })
                .then(resolve)
                .catch((error) => {
                  console.error('reCAPTCHA execute error:', error);
                  reject(new Error(`reCAPTCHA execution failed: ${error.message || 'Unknown error'}`));
                });
            } catch (error) {
              console.error('reCAPTCHA ready callback error:', error);
              reject(new Error(`reCAPTCHA ready callback failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
            }
          });
        } catch (error) {
          console.error('reCAPTCHA ready error:', error);
          reject(new Error(`reCAPTCHA ready failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      });

      if (!token) {
        throw new Error('reCAPTCHA verification failed. Please try again.');
      }

      console.log('reCAPTCHA token obtained successfully');
      
      // EmailJS send
      const emailjs = await import('@emailjs/browser');
      
      const templateParams = {
        name: formData.name,
        email: formData.email,
        project_type: formData.project_type,
        message: formData.message,
        time: new Date().toLocaleString(),
        recaptcha_token: token, // Include in email for verification if needed
      };

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      // Success
      setSubmitStatus('success');
      lastSubmissionRef.current = Date.now();
      setFormData({ name: '', email: '', message: '', project_type: '' });
      onSuccess?.();
      
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to send message. Please try again.';
      setErrorMessage(errorMsg);
      setSubmitStatus('error');
      onError?.(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSuccess, onError]);

  return (
    <motion.div variants={itemFadeIn}>
      <Card className="overflow-hidden border-0 shadow-lg shadow-orange-100/30 dark:shadow-orange-900/20 hover:shadow-orange-200/40 dark:hover:shadow-orange-800/30 transition-all duration-300 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm h-full">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col items-center gap-3 sm:gap-4 mb-6 text-center">
            <div className="rounded-full gradient-bg p-3 sm:p-4">
              <IconSelector name="Mail" className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Send Secure Message
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Tell me about your project needs
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                placeholder="Your name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Project Type Field */}
            <div>
              <label htmlFor="project_type" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Project Type *
              </label>
              <select
                id="project_type"
                name="project_type"
                value={formData.project_type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
              >
                <option value="">Select project type</option>
                <option value="website">Website Development</option>
                <option value="custom_app">Custom Application</option>
                <option value="electrical">Electrical Services</option>
                <option value="embedded">Embedded Systems/IoT</option>
                <option value="marketing">Marketing & SEO</option>
                <option value="it_setup">IT & Business Setup</option>
                <option value="security">Cybersecurity</option>
                <option value="design">Design & 3D Modeling</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm resize-vertical"
                placeholder="Tell me about your project..."
              />
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-md">
                <p className="text-sm text-green-700 dark:text-green-300">
                  ✅ Message sent successfully! I'll get back to you soon.
                </p>
              </div>
            )}

            {submitStatus === 'error' && errorMessage && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-md">
                <p className="text-sm text-red-700 dark:text-red-300">
                  ❌ {errorMessage}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full gradient-bg hover:bg-gradient-to-r hover:from-orange-700 hover:to-amber-800 transition-all duration-300 text-sm sm:text-base"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>

            {/* reCAPTCHA Notice */}
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              This form is protected by reCAPTCHA and secured against spam.
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// TypeScript declaration for reCAPTCHA
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}