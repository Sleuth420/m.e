import type { Metadata } from 'next';
import type { LucideIcon } from 'lucide-react';
import { Building, Heart, Zap } from 'lucide-react';
import { PageHero } from '@/components/ui/page-hero';
import { DepthCard } from '@/components/ui/depth-card';
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
      'My background is in electrical work for homes, commercial fit-outs and industrial sites across Melbourne.',
  },
  {
    year: 'Business Experience',
    title: 'Past Business Owner',
    description:
      'Running a trade business gave me firsthand experience with quoting, scheduling, customer enquiries and the work that happens between jobs.',
  },
  {
    year: 'Today',
    title: 'Full-Stack Developer & Electrician',
    description:
      'I now work across electrical installations, websites, web apps and connected hardware, using both backgrounds to solve practical problems.',
  },
];

const cards: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
}[] = [
  {
    icon: Zap,
    title: 'Trade and technical experience',
    subtitle: 'A-Grade Electrician & Full-Stack Developer',
    description:
      'I bring an A-Grade electrical licence and hands-on development experience to projects that involve buildings, software or both.',
  },
  {
    icon: Building,
    title: 'An understanding of small business',
    subtitle: 'Past Business Owner',
    description:
      'A website or app needs to fit the way you work. I ask about your customers and day-to-day tasks before recommending features.',
  },
  {
    icon: Heart,
    title: 'Clear communication',
    subtitle: 'Scope, progress and handover',
    description:
      'I explain the options, agree on the scope and keep you involved as the work progresses. You know what is being done and what comes next.',
  },
];

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Ricky - OakCodeAndTechSolutions',
  description: 'A-Grade licensed electrician and full-stack developer in Melbourne.',
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
        title="Hi, I’m Ricky"
        description="I’m an A-Grade electrician and web developer based in Melbourne, working under the name OakCodeAndTechSolutions."
      />

      <section className="py-16 md:py-24">
        <div className="container max-w-4xl text-center">
          <h2 className="display-md font-display font-bold gradient-text mb-8">
            Electrical work and software, with a practical focus
          </h2>
          <p className="text-lg text-muted-foreground text-body">
            <span className="font-semibold text-primary">OakCodeAndTechSolutions</span> is where I
            bring my electrical and development work together. I help with installations and
            repairs, build websites for businesses, and create software for tasks such as quoting
            and job management. You can work with me on one service or a project that needs both.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-surface-1/50 border-y border-border/50">
        <div className="container">
          <h2 className="display-md font-display font-bold text-center mb-12 gradient-text">
            My background
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
          <h2 className="display-md font-display font-bold text-center mb-12">How I work</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <DepthCard key={card.title} className="p-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg">{card.title}</h3>
                  <p className="text-sm text-primary mt-1">{card.subtitle}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{card.description}</p>
                </DepthCard>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-surface-1/50 border-t border-border/50">
        <div className="container">
          <h2 className="display-md font-display font-bold text-center mb-12">
            Skills & Expertise
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill) => {
              const Icon = skill.icon;
              return (
                <DepthCard key={skill.title} className="p-6 text-center">
                  <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2.5 mx-auto">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold">{skill.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground">{skill.description}</p>
                </DepthCard>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-3xl text-center">
          <blockquote className="neumorphic rounded-2xl p-8 md:p-10">
            <p className="text-lg md:text-xl text-muted-foreground font-medium italic">
              My aim is to make the job easier to understand, carry out the agreed work and leave
              you with something you can use and maintain.
            </p>
          </blockquote>
        </div>
      </section>
    </>
  );
}
