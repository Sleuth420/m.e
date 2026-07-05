import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/page-hero';
import { DepthCard } from '@/components/ui/depth-card';
import { IconSelector, type IconName } from '@/components/ui/icon-selector';
import { skills } from '@/lib/data';
import { generateSeoMetadata } from '@/components/seo/Seo';
import { BASE_URL } from '@/lib/site';

export const metadata: Metadata = generateSeoMetadata({
  title: 'About Ricky | Licensed Electrician & Full-Stack Developer Melbourne',
  description:
    'Meet Ricky: A-Grade electrician and developer at OakCodeAndTechSolutions in Melbourne.',
  canonical: `${BASE_URL}/about`,
});

const timeline = [
  {
    year: 'Trade Foundation',
    title: 'A-Grade Licensed Electrician',
    description:
      'I have spent years building my career as an electrician handling homes, commercial fit-outs, and industrial sites across Melbourne.',
  },
  {
    year: 'Business Experience',
    title: 'Past Business Owner',
    description:
      'Running my own company taught me exactly what small businesses need to succeed in the real world.',
  },
  {
    year: 'Today',
    title: 'Full-Stack Developer & Electrician',
    description:
      'Today, I combine my hands-on electrical background with modern web development to offer a truly unique service.',
  },
];

const cards: {
  icon: IconName;
  title: string;
  subtitle: string;
  description: string;
}[] = [
  {
    icon: 'Zap',
    title: 'Dual Trade Professional',
    subtitle: 'A-Grade Electrician & Full-Stack Developer',
    description:
      'I am fully licensed to handle all your electrical requirements and equally qualified to build your next web application.',
  },
  {
    icon: 'Building',
    title: 'Business Minded',
    subtitle: 'Past Business Owner',
    description:
      'Running my own trade business gave me firsthand experience with the challenges companies face. Now I use those insights to help others grow online.',
  },
  {
    icon: 'Heart',
    title: 'Problem Solver',
    subtitle: 'Customer Focused',
    description:
      'I prefer practical, no-nonsense solutions. I just want to do great work and build lasting relationships with my clients.',
  },
];

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Ricky - OakCodeAndTechSolutions',
  description:
    'A-Grade licensed electrician and full-stack developer in Melbourne.',
  url: `${BASE_URL}/about`,
  mainEntity: { '@id': `${BASE_URL}/#person` },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <PageHero
        badge="Who I Am"
        title="About Me"
        description="I'm the electrician who codes, and the developer who understands what real businesses need."
      />

      <section className="py-16 md:py-24">
        <div className="container max-w-4xl text-center">
          <h2 className="display-md font-display font-bold gradient-text mb-8">
            Bringing traditional trades and modern technology
          </h2>
          <p className="text-lg text-muted-foreground text-body">
            <span className="font-semibold text-primary">OakCodeAndTechSolutions</span> brings
            together residential, commercial, and industrial electrical contracting with web
            development, marketing, and business advisory. I offer practical, straightforward solutions for homes, worksites, and growing businesses.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-surface-1/50 border-y border-border/50">
        <div className="container">
          <h2 className="display-md font-display font-bold text-center mb-12 gradient-text">
            My Journey
          </h2>
          <div className="max-w-3xl mx-auto space-y-8">
            {timeline.map((item, i) => (
              <div key={item.year} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-primary shadow-glow" />
                  {i < timeline.length - 1 && (
                    <div className="w-px flex-1 bg-border mt-2 min-h-[60px]" />
                  )}
                </div>
                <DepthCard className="flex-1 p-6 mb-4">
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">
                    {item.year}
                  </span>
                  <h3 className="font-display font-semibold text-lg mt-1">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </DepthCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="display-md font-display font-bold text-center mb-12">Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {cards.map((card) => (
              <DepthCard key={card.title} className="p-6">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5">
                  <IconSelector name={card.icon} className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg">{card.title}</h3>
                <p className="text-sm text-primary mt-1">{card.subtitle}</p>
                <p className="mt-3 text-sm text-muted-foreground">{card.description}</p>
              </DepthCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-surface-1/50 border-t border-border/50">
        <div className="container">
          <h2 className="display-md font-display font-bold text-center mb-12">Skills & Expertise</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill) => (
              <DepthCard key={skill.title} className="p-6 text-center">
                <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2.5 mx-auto">
                  <IconSelector name={skill.icon} className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold">{skill.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground">{skill.description}</p>
              </DepthCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-3xl text-center">
          <blockquote className="neumorphic rounded-2xl p-8 md:p-10">
            <p className="text-lg md:text-xl text-muted-foreground font-medium italic">
              &ldquo;I don&apos;t just write code or run cables. I want to help businesses get exactly what they need to thrive in a digital world without any of the usual hassle.&rdquo;
            </p>
          </blockquote>
        </div>
      </section>
    </>
  );
}
