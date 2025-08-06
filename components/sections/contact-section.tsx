'use client';

import { motion } from 'framer-motion';
import { ContactCard } from '@/components/ui/contact-card';
import { SecureContactForm } from '@/components/ui/secure-contact-form';
import { SectionHeading } from '@/components/ui/section-heading';
import { SectionBackground } from '@/components/ui/section-background';
import { contactInfo } from '@/lib/data';
import { staggerContainer } from '@/lib/animations';
import { useState } from 'react';
import { usePostHog } from '@/lib/hooks/usePostHog';

export default function ContactSection() {
  const { trackEvent } = usePostHog();

  const handleEmailClick = () => {
    trackEvent('email_clicked', {
      email: contactInfo.email,
      source: 'contact_section',
      timestamp: new Date().toISOString(),
    });
  };

  const handleFormSuccess = () => {
    trackEvent('contact_form_submitted', {
      source: 'contact_section',
      timestamp: new Date().toISOString(),
    });
  };

  const handleFormError = (error: string) => {
    trackEvent('contact_form_error', {
      error,
      source: 'contact_section',
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <section id="contact" className="w-full py-16 pb-0 md:py-24 md:pb-0 lg:py-32 lg:pb-0 relative">
      <SectionBackground variant="diagonal">
        <div className="container mx-auto">
          <SectionHeading
            badge="Contact"
            title="Get in Touch"
            description="Whether you need a developer, an electrician, or someone who understands both worlds, I'm here to help."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mx-auto grid gap-6 sm:gap-8 mt-12 md:grid-cols-2"
          >
            <ContactCard
              title="Email Me"
              content={contactInfo.email}
              icon="Mail"
              actionLabel="Send Email"
              actionUrl={`mailto:${contactInfo.email}`}
              onClick={handleEmailClick}
            />

            <SecureContactForm onSuccess={handleFormSuccess} onError={handleFormError} />
          </motion.div>
        </div>
      </SectionBackground>
    </section>
  );
}
