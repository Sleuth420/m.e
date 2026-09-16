import type { Metadata } from 'next';
import { Github, MapPin } from 'lucide-react';
import { PageHero } from '@/components/ui/page-hero';
import { ContactCard } from '@/components/ui/contact-card';
import { ContactForm } from '@/components/ui/contact-form';
import { contactInfo } from '@/lib/data';
import { generateSeoMetadata } from '@/components/seo/Seo';
import { BASE_URL } from '@/lib/site';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Contact | Licensed Electrician & Web Developer Melbourne',
  description:
    'Contact OakCodeAndTechSolutions for residential, commercial, or industrial electrical work, or web development in Melbourne. Free quotes via the contact form.',
  canonical: `${BASE_URL}/contact`,
});

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact OakCodeAndTechSolutions',
  description: 'Contact page for electrical and web development services in Melbourne',
  url: `${BASE_URL}/contact`,
  mainEntity: { '@id': `${BASE_URL}/#organization` },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <PageHero
        badge="Contact"
        title="Get in Touch"
        description="Tell me what you need help with, your preferred timing and any useful details. For electrical work, include your suburb. For a website or app, include a link if you have one."
      />
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <div className="grid gap-6 sm:grid-cols-2 mb-10">
            <ContactCard
              title="Based in"
              content={contactInfo.location}
              icon={<MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />}
            />
            <ContactCard
              title="GitHub"
              content="Sleuth420"
              icon={<Github className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />}
              actionLabel="View profile"
              actionUrl={contactInfo.github}
            />
          </div>
          <div className="neumorphic rounded-2xl p-6 md:p-10">
            <p className="text-sm text-muted-foreground mb-6">
              I usually reply within 24 to 48 hours. This form is not monitored continuously and is
              not an emergency service. If supporting photos or documents are needed, I’ll arrange
              how to share them after your enquiry.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
