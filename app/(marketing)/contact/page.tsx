import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/page-hero';
import { ContactCard } from '@/components/ui/contact-card';
import { SecureContactForm } from '@/components/ui/secure-contact-form';
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
        description="Whether you need a developer, an electrician, or someone who understands both worlds — use the form below. We do not publish a public email address."
      />
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <div className="grid gap-6 sm:grid-cols-2 mb-10">
            <ContactCard title="Based in" content={contactInfo.location} icon="MapPin" />
            <ContactCard
              title="GitHub"
              content="Sleuth420"
              icon="Github"
              actionLabel="View profile"
              actionUrl={contactInfo.github}
            />
          </div>
          <div className="neumorphic rounded-2xl p-6 md:p-10">
            <p className="text-sm text-muted-foreground mb-6">
              Typical response within 24–48 hours. For electrical emergencies, note urgency in your
              message.
            </p>
            <SecureContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
