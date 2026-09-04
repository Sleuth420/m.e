import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactCta() {
  return (
    <section className="relative overflow-x-clip py-16 sm:py-20 md:py-24">
      <div className="absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="absolute inset-0 retro-grid opacity-30" aria-hidden />
      <div className="container relative text-center">
        <h2 className="display-lg mx-auto max-w-3xl font-display font-bold gradient-text glow-text">
          Need a quote?
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg text-muted-foreground">
          Electrical or digital. Send the job details and I will reply with a price or the next
          questions.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 px-2 sm:mt-10 sm:flex-row sm:gap-4">
          <Button
            size="lg"
            className="gradient-bg min-h-11 w-full text-primary-foreground shadow-glow sm:w-auto"
            asChild
          >
            <Link href="/contact">
              Get a quote
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="chrome-border min-h-11 w-full sm:w-auto" asChild>
            <Link href="/pricing">Pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
