import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ScrollProgress } from '@/components/ui/scroll-progress';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-site-shell className="flex min-h-screen flex-col overflow-x-clip">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-4 focus:py-3 focus:text-foreground"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 overflow-x-clip">
        {children}
      </main>
      <Footer />
    </div>
  );
}
