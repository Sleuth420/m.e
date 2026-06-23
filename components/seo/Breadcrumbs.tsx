import Link from 'next/link';
import Script from 'next/script';
import { ChevronRight } from 'lucide-react';
import { BASE_URL } from '@/lib/site';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  const displayName = (name: string) => {
    const short = name.split('|')[0]?.trim();
    return short && short.length < 60 ? short : name;
  };

  return (
    <>
      <Script
        id="breadcrumbs-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav
        aria-label="Breadcrumb"
        className="container py-4 border-b border-border/40 bg-surface-1/30"
      >
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const label = displayName(item.name);

            return (
              <li key={item.url} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden />
                )}
                {isLast ? (
                  <span className="font-medium text-foreground line-clamp-1" aria-current="page">
                    {label}
                  </span>
                ) : (
                  <Link
                    href={item.url.replace(BASE_URL, '') || '/'}
                    className="hover:text-primary transition-colors line-clamp-1"
                  >
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
