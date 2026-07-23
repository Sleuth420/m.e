import { cn } from '@/lib/utils';

interface PageHeroProps {
  badge?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHero({ badge, title, description, children, className }: PageHeroProps) {
  return (
    <section
      className={cn(
        'relative overflow-x-clip border-b border-border/50 bg-surface-0 py-16 sm:py-20 md:py-28 lg:py-32',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="absolute inset-0 retro-grid opacity-60" />
      </div>
      <div className="container relative z-10">
        {badge && (
          <div className="mb-6 sm:mb-8">
            <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {badge}
            </span>
          </div>
        )}
        <h1 className="display-lg font-display font-bold gradient-text glow-text max-w-4xl text-balance">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground text-body">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}
