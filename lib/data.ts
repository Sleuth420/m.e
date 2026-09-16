import type { LucideIcon } from 'lucide-react';
import { Code, Shield, Microchip, Wrench } from 'lucide-react';
import { operatedSiteProjects } from './operated-sites';
import { PROJECT_IMAGE_PLACEHOLDER } from '@/lib/site';

export interface ProjectLink {
  type: 'github' | 'external';
  label: string;
  url: string;
  nofollow?: boolean;
}

export type ProjectCategory = 'web' | 'electrical' | 'iot';

export interface Project {
  title: string;
  description: string;
  image: string;
  links: ProjectLink[];
  technologies: string[];
  category: ProjectCategory;
}

export const projects: Project[] = [
  {
    title: 'Electrician Management App',
    description:
      'A job management app for electricians with quotes, tasks and site calculations. Built with Vue, Nuxt and a Django backend.',
    image: PROJECT_IMAGE_PLACEHOLDER,
    links: [
      {
        type: 'external',
        label: 'Visit Site',
        url: 'https://electricianapp.com.au',
        nofollow: true,
      },
    ],
    technologies: [
      'Vue.js',
      'Nuxt.js',
      'Tailwind CSS',
      'Django',
      'Python',
      'PostgreSQL',
      'Stripe',
      'Clerk',
      'Cloudflare',
      'Sentry',
      'AWS',
      'Nginx',
      'Docker',
    ],
    category: 'web',
  },
  {
    title: 'Reaching Out In The Inner West',
    description:
      'A WordPress website for a Melbourne non-profit, bringing together donation information, event schedules and ways to volunteer.',
    image: PROJECT_IMAGE_PLACEHOLDER,
    links: [
      {
        type: 'external',
        label: 'Visit Site',
        url: 'https://reachingoutintheinnerwestofmelbourne.com.au',
      },
    ],
    technologies: ['WordPress', 'Elementor'],
    category: 'web',
  },
  {
    title: 'GlazeyJewellery.com',
    description:
      'A Shopify store for a jewellery brand, with product browsing and checkout designed for mobile and desktop.',
    image: PROJECT_IMAGE_PLACEHOLDER,
    links: [{ type: 'external', label: 'Visit Site', url: 'https://glazeyjewellery.com' }],
    technologies: ['Shopify'],
    category: 'web',
  },
  {
    title: 'Electrovision Australia',
    description:
      'A WordPress website for an electrical contractor, with service information and forms for quote requests.',
    image: PROJECT_IMAGE_PLACEHOLDER,
    links: [
      { type: 'external', label: 'Visit Site', url: 'https://electrovisionaustralia.com.au' },
    ],
    technologies: ['WordPress'],
    category: 'web',
  },
  {
    title: 'Perri Electrics',
    description:
      'A local Melbourne electrician’s website highlighting their safety audits, service areas, and status as an authorised installer.',
    image: PROJECT_IMAGE_PLACEHOLDER,
    links: [{ type: 'external', label: 'Visit Site', url: 'https://perrielectrics.com' }],
    technologies: ['WordPress', 'Elementor'],
    category: 'web',
  },
  {
    title: 'Wedding & RSVP Website',
    description:
      'A private wedding website where guests can view event details and RSVP, and the organisers can track attendance.',
    image: PROJECT_IMAGE_PLACEHOLDER,
    links: [{ type: 'external', label: 'Private Project', url: '#' }],
    technologies: ['WordPress'],
    category: 'web',
  },
  {
    title: 'Max Trans Portable Homes',
    description:
      'A WordPress website for a portable homes business, with product specifications, a gallery and enquiry forms.',
    image: PROJECT_IMAGE_PLACEHOLDER,
    links: [
      { type: 'external', label: 'Visit Site', url: 'https://maxtrans.com.au', nofollow: true },
    ],
    technologies: ['WordPress', 'Elementor'],
    category: 'web',
  },
  {
    title: 'ZegaMame Pokedex',
    description:
      'Pokédex UI on custom embedded Linux hardware: search, filters, and detail views in Python/Tkinter.',
    image: PROJECT_IMAGE_PLACEHOLDER,
    links: [
      { type: 'github', label: 'Code', url: 'https://github.com/Sleuth420/Python-Tkinter-Pokedex' },
    ],
    technologies: ['Python', 'Tkinter', 'Linux', 'Embedded Systems', 'GPIO'],
    category: 'iot',
  },
  {
    title: 'Perfect Circle',
    description:
      'A browser game that scores how closely a hand-drawn shape matches a circle, with feedback as you play.',
    image: PROJECT_IMAGE_PLACEHOLDER,
    links: [
      { type: 'external', label: 'Visit Site', url: 'https://sleuth420.github.io/perfect-circle/' },
    ],
    technologies: ['JavaScript', 'Canvas', 'HTML/CSS'],
    category: 'web',
  },
  {
    title: 'Grow-y',
    description:
      'A gardening app in development for tracking plants, organising care reminders and following growth over time.',
    image: PROJECT_IMAGE_PLACEHOLDER,
    links: [{ type: 'external', label: 'In Progress', url: 'https://growy.xyz' }],
    technologies: ['React', 'Tailwind CSS', 'JavaScript', 'Vercel'],
    category: 'web',
  },
  ...operatedSiteProjects(),
];

export interface Skill {
  title: string;
  icon: LucideIcon;
  description: string;
}

export const skills: Skill[] = [
  {
    title: 'Web Development',
    icon: Code,
    description: 'Vue.js, React, Django, WordPress, Shopify, Tailwind CSS, Node.js, Next.js',
  },
  {
    title: 'Cybersecurity',
    icon: Shield,
    description: 'Website security reviews, access controls, backups and secure development',
  },
  {
    title: 'IoT and Embedded Systems',
    icon: Microchip,
    description: 'Arduino, Raspberry Pi, ESP32, Linux',
  },
  {
    title: 'Electrical',
    icon: Wrench,
    description:
      'Fully qualified A-Grade electrician handling residential, commercial, and industrial projects.',
  },
];

export type HomeServiceCategory = 'electrical' | 'web-dev' | 'app-dev' | 'other';

export interface HomeServiceTeaser {
  title: string;
  description: string;
  slug: string;
  category: HomeServiceCategory;
}

/** Curated home teasers pointing at real /services/[slug] pages. */
export const homeServiceTeasers: HomeServiceTeaser[] = [
  {
    title: 'Electrical Services',
    description:
      'Licensed residential, commercial, and industrial electrical work across Melbourne.',
    slug: 'electrician-melbourne',
    category: 'electrical',
  },
  {
    title: 'Custom Websites',
    description: 'Custom websites with layouts and features built around your business.',
    slug: 'web-developer-melbourne',
    category: 'web-dev',
  },
  {
    title: 'WordPress Development',
    description: 'Custom WordPress themes, plugins, and ongoing site management.',
    slug: 'wordpress-developer-melbourne',
    category: 'web-dev',
  },
  {
    title: 'App Development',
    description: 'Custom web apps and tools for quoting, jobs, and client workflows.',
    slug: 'app-development-melbourne',
    category: 'app-dev',
  },
  {
    title: 'IoT & Hardware',
    description: 'Sensors, Raspberry Pi projects and dashboards for connected devices.',
    slug: 'iot-solutions-melbourne',
    category: 'app-dev',
  },
  {
    title: 'CAD Design',
    description: 'Technical drawings and CAD for electrical and product work.',
    slug: 'cad-design-melbourne',
    category: 'other',
  },
];

export interface ContactInfo {
  email: string;
  location: string;
  github: string;
}

/** Internal recipient for EmailJS only - never render in UI or schema. */
export const contactInfo: ContactInfo = {
  email: 'oakcodeandtechsolutions@gmail.com',
  location: 'Melbourne, Australia',
  github: 'https://github.com/Sleuth420',
};
