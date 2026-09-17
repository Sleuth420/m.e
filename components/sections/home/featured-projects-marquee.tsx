'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { projects } from '@/lib/data';
import { Button } from '@/components/ui/button';

const featured = projects.slice(0, 6);

function MarqueeProjectTeaser({ project }: { project: (typeof featured)[number] }) {
  const href = project.links[0]?.url ?? '/projects';
  const isExternal = href.startsWith('http');
  const rel = isExternal
    ? project.links[0]?.nofollow
      ? 'noopener noreferrer nofollow'
      : 'noopener noreferrer'
    : undefined;

  return (
    <Link
      href={href}
      {...(isExternal ? { target: '_blank', rel } : {})}
      className="min-w-0 rounded-xl border border-border/50 bg-card/80 p-5 sm:p-6 chrome-border transition-colors hover:border-primary/40"
    >
      <h3 className="font-display font-semibold text-foreground mb-2 text-balance">
        {project.title}
        {isExternal && <span className="sr-only"> (opens in a new tab)</span>}
      </h3>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {project.technologies.slice(0, 3).map((tech) => (
          <span key={tech} className="brand-chip text-xs">
            {tech}
          </span>
        ))}
      </div>
    </Link>
  );
}

export default function FeaturedProjectsMarquee() {
  return (
    <section className="overflow-x-clip py-16 sm:py-20 md:py-28 border-y border-border/50 bg-surface-1/50">
      <div className="container mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="display-md font-display font-bold gradient-text">Selected projects</h2>
        </div>
        <Button variant="outline" className="chrome-border w-full sm:w-fit min-h-11" asChild>
          <Link href="/projects">
            View all projects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="container grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((project) => (
          <MarqueeProjectTeaser key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}
