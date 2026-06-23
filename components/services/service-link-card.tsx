import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DepthCard } from '@/components/ui/depth-card';

interface ServiceLinkCardProps {
  href: string;
  title: string;
  description: string;
}

export function ServiceLinkCard({ href, title, description }: ServiceLinkCardProps) {
  return (
    <Link href={href} className="block h-full group">
      <DepthCard className="h-full p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <ArrowRight className="h-4 w-4 flex-shrink-0 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </DepthCard>
    </Link>
  );
}
