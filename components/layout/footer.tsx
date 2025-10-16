import Link from 'next/link';
import { Github, Zap, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-6 py-8 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="rounded-full bg-orange-600 p-1">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="inline-block font-bold gradient-text">Ricky</span>
          </Link>
          <p className="text-center text-xs sm:text-sm text-muted-foreground md:text-left">
            Built with ❤️ by{' '}
            <Link
              href="https://github.com/Sleuth420"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              OakCodeAndTechSolutions
            </Link>
            .
          </p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            size="sm"
            className="bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm"
            asChild
          >
            <Link
              href="https://www.buymeacoffee.com/oakcodeandtechsolutions"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Coffee className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Buy Me a Coffee</span>
              <span className="sm:hidden">Coffee</span>
            </Link>
          </Button>
          <Link
            href="https://github.com/Sleuth420"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-muted-foreground transition-colors p-2"
          >
            <Github className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </div>
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4">
          <p className="text-center text-xs text-muted-foreground">
            ABN: 48 113 774 962 | Legal Disclosure: In accordance with the Bankruptcy Act 1966, please be advised that the proprietor, Richard (Ricky) Oakley, is an undischarged bankrupt.
          </p>
        </div>
      </div>
    </footer>
  );
}
