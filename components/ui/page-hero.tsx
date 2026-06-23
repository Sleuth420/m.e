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
        'relative overflow-hidden border-b border-border/50 bg-surface-0 py-16 sm:py-20 md:py-28 lg:py-32',
        className
      )}
    >
      <div className="absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="absolute inset-0 retro-grid opacity-60" aria-hidden />
      <div className="container relative z-10">
        {badge && (
          <span className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {badge}
          </span>
        )}
        <h1 className="display-lg font-display font-bold tracking-tight gradient-text glow-text max-w-4xl text-balance">
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
