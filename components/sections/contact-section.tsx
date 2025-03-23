'use client';

import { motion } from 'framer-motion';
import { ContactCard } from '@/components/ui/contact-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { SectionBackground } from '@/components/ui/section-background';
import { contactInfo } from '@/lib/data';
import { staggerContainer } from '@/lib/animations';

export default function ContactSection() {
  return (
    <section id="contact" className="w-full py-16 md:py-24 lg:py-32 relative">
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
            />

            <ContactCard
              title="Connect"
              content={contactInfo.location}
              icon="MapPin"
              actionLabel="GitHub"
              actionUrl={contactInfo.github}
            />
          </motion.div>
        </div>
      </SectionBackground>
    </section>
  );
}
