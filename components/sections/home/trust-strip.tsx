import { Shield, MapPin, Award } from 'lucide-react';

const items = [
  {
    icon: Award,
    title: 'A-Grade Licensed',
    description: 'Residential, commercial, and urgent electrical work by appointment.',
  },
  {
    icon: MapPin,
    title: 'Melbourne Wide',
    description: 'Serving CBD, western suburbs, and surrounding areas across Victoria.',
  },
  {
    icon: Shield,
    title: 'Dual Trade Expert',
    description: 'Licensed electrical work plus full-stack web development under one roof.',
  },
];

export default function TrustStrip() {
  return (
    <section className="py-12 sm:py-16 border-y border-border/50 bg-surface-2/30" aria-label="Credentials">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {items.map((item) => (
            <div key={item.title} className="flex gap-4 items-start">
              <div className="rounded-lg bg-primary/10 p-2.5 shrink-0">
                <item.icon className="h-5 w-5 text-primary" aria-hidden />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
