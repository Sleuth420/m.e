import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-lg text-center space-y-6">
          <p className="text-sm font-medium text-primary">404</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold gradient-text">
            Page not found
          </h1>
          <p className="text-muted-foreground">
            That URL does not exist. Try the services hub, pricing page, or contact form instead.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="gradient-bg text-primary-foreground">
              <Link href="/">Home</Link>
            </Button>
            <Button asChild variant="outline" className="chrome-border">
              <Link href="/services">All services</Link>
            </Button>
            <Button asChild variant="outline" className="chrome-border">
              <Link href="/contact">Contact</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
