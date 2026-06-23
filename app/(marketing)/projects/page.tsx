import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHero } from '@/components/ui/page-hero';
import { ProjectsGrid } from './ProjectsGrid';
import { projects } from '@/lib/data';
import { generateSeoMetadata } from '@/components/seo/Seo';
import { BASE_URL } from '@/lib/site';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Projects & Portfolio | Web Development & Electrical Work Melbourne',
  description:
    'Portfolio of web development, WordPress, e-commerce, and electrical projects by OakCodeAndTechSolutions. Melbourne-based dual trade professional.',
  canonical: `${BASE_URL}/projects`,
});

const projectsSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'OakCodeAndTechSolutions Projects',
  description: 'Portfolio of web development and technology projects',
  url: `${BASE_URL}/projects`,
  numberOfItems: projects.length,
  itemListElement: projects.slice(0, 10).map((project, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'CreativeWork',
      name: project.title,
      description: project.description,
    },
  })),
};

export default function ProjectsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsSchema) }}
      />
      <PageHero
        badge="My Work"
        title="Projects"
        description="A selection of web development, e-commerce, directory sites, and technology projects."
      />
      <section className="py-16 md:py-24">
        <div className="container">
          <Suspense fallback={<div className="text-center py-12 text-muted-foreground">Loading projects...</div>}>
            <ProjectsGrid />
          </Suspense>
        </div>
      </section>
    </>
  );
}
