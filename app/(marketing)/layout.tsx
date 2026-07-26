import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ScrollProgress } from '@/components/ui/scroll-progress';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <ScrollProgress />
      <Header />
      <main className="flex-1 overflow-x-clip">{children}</main>
      <Footer />
    </div>
  );
}
