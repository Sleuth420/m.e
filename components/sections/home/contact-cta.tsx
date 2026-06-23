import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactCta() {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="absolute inset-0 retro-grid opacity-30" aria-hidden />
      <div className="container relative text-center">
        <h2 className="display-lg font-display font-bold gradient-text glow-text max-w-3xl mx-auto">
          Ready to start your project?
        </h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
          Whether you need an electrician, a developer, or both — get in touch for a free consultation.
        </p>
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
          <Button size="lg" className="gradient-bg text-primary-foreground shadow-glow w-full sm:w-auto min-h-11" asChild>
            <Link href="/contact">
              Get in touch
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="chrome-border w-full sm:w-auto min-h-11" asChild>
            <Link href="/pricing">View pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
