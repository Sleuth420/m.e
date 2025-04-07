'use client';

import { motion } from 'framer-motion';
import { ContactCard } from '@/components/ui/contact-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { SectionBackground } from '@/components/ui/section-background';
import { QuestionnaireModal } from '@/components/ui/questionnaire-modal';
import { contactInfo } from '@/lib/data';
import { staggerContainer } from '@/lib/animations';
import { useState } from 'react';
import { usePostHog } from '@/lib/hooks/usePostHog';

export default function ContactSection() {
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const { trackEvent } = usePostHog();

  const handleQuestionnaireOpen = () => {
    trackEvent('questionnaire_opened', {
      source: 'contact_section',
      timestamp: new Date().toISOString()
    });
    setIsQuestionnaireOpen(true);
  };

  const handleEmailClick = () => {
    trackEvent('email_clicked', {
      email: contactInfo.email,
      source: 'contact_section',
      timestamp: new Date().toISOString()
    });
  };

  return (
    <section id="contact" className="w-full py-16 pb-0 md:py-24 md:pb-0 lg:py-32 lg:pb-0 relative">
      <SectionBackground variant="diagonal">
        <div className="mx-auto px-4 sm:px-6 md:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
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
            className="mx-auto grid gap-8 sm:grid-cols-2 md:max-w-[64rem] mt-12"
          >
            <ContactCard
              title="Email Me"
              content={contactInfo.email}
              icon="Mail"
              actionLabel="Send Email"
              actionUrl={`mailto:${contactInfo.email}`}
              onClick={handleEmailClick}
            />

            <ContactCard
              title="Service Questionnaire"
              content="Tell me about your project needs"
              icon="Database"
              actionLabel="Fill Questionnaire"
              actionUrl="#"
              onClick={handleQuestionnaireOpen}
            />
          </motion.div>
        </div>
      </SectionBackground>

      <QuestionnaireModal
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
        formUrl="https://docs.google.com/forms/d/e/1FAIpQLScuB908j5bTUTUHTLsTvSWZjIZoSmrULlquicVSaSuPo52DmA/viewform?embedded=true"
      />
    </section>
  );
}
