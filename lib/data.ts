import { type IconName } from '@/components/ui/icon-selector';
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
      'Job tracking and on-site tools for electricians: quotes, tasks, and calculations in one Vue/Nuxt app backed by Django.',
    image: PROJECT_IMAGE_PLACEHOLDER,
    links: [
      {
        type: 'external',
        label: 'Visit Site',
        url: 'https://electricianapp.com.au',
        nofollow: true,
      },
    ],
    technologies: ['Vue.js', 'Nuxt.js', "Tailwind CSS", 'Django', 'Python', 'PostgreSQL', 'Stripe', 'Clerk', 'Cloudflare', 'Sentry', 'AWS', 'Nginx', 'Docker'  ],
    category: 'web',
  },
  {
    title: 'Reaching Out In The Inner West',
    description:
      'WordPress site for a Melbourne non-profit: donations, events, and volunteer info for inner-west outreach programs.',
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
      'Shopify store for a jewellery brand: product pages, checkout, and mobile-friendly layout.',
    image: PROJECT_IMAGE_PLACEHOLDER,
    links: [{ type: 'external', label: 'Visit Site', url: 'https://glazeyjewellery.com' }],
    technologies: ['Shopify'],
    category: 'web',
  },
  {
    title: 'Electrovision Australia',
    description:
      'WordPress site for an electrical contractor: services, gallery, and quote requests for residential and commercial clients.',
    image: PROJECT_IMAGE_PLACEHOLDER,
    links: [{ type: 'external', label: 'Visit Site', url: 'https://electrovisionaustralia.com.au' }],
    technologies: ['WordPress'],
    category: 'web',
  },
  {
    title: 'Perri Electrics',
    description:
      'WordPress site for a Melbourne electrician: The Good Guys authorised installer, safety audits, rental checks, and local service areas.',
    image: PROJECT_IMAGE_PLACEHOLDER,
    links: [{ type: 'external', label: 'Visit Site', url: 'https://perrielectrics.com' }],
    technologies: ['WordPress', 'Elementor'],
    category: 'web',
  },
  {
    title: 'Wedding & RSVP Website',
    description:
      'Beautiful wedding website featuring RSVP functionality and tracking, custom login system, and a beautiful design for a memorable celebration.',
    image: PROJECT_IMAGE_PLACEHOLDER,
    links: [{ type: 'external', label: 'Private Project', url: '#' }],
    technologies: ['WordPress'],
    category: 'web',
  },
  {
    title: 'Max Trans Portable Homes',
    description:
      'WordPress site for portable homes: product specs, modular housing gallery, and enquiry forms.',
    image: PROJECT_IMAGE_PLACEHOLDER,
    links: [{ type: 'external', label: 'Visit Site', url: 'https://maxtrans.com.au', nofollow: true }],
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
    description: 'Interactive circle-drawing game featuring precision challenges, multiple difficulty levels, and real-time scoring system for competitive gameplay.',
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
      'Innovative plant tracking web application with real-time growth monitoring, care reminders, and species-specific growing timelines for gardening enthusiasts.',
    image: PROJECT_IMAGE_PLACEHOLDER,
    links: [{ type: 'external', label: 'In Progress', url: 'https://growy.xyz' }],
    technologies: ['React', 'Tailwind CSS', 'JavaScript', 'Vercel'],
    category: 'web',
  },
  ...operatedSiteProjects(),
];

export interface Skill {
  title: string;
  icon: IconName;
  description: string;
}

export const skills: Skill[] = [
  {
    title: 'Web Development',
    icon: 'Code',
    description: 'Vue.js, React, Django, WordPress, Shopify, Tailwind CSS, Node.js, Next.js',
  },
  {
    title: 'Cybersecurity',
    icon: 'Shield',
    description: 'Network Security, Penetration Testing, Secure Coding, OWASP Top 10',
  },
  {
    title: 'IoT and Embedded Systems',
    icon: 'Microchip',
    description: 'Arduino, Raspberry Pi, ESP32, Linux',
  },
  {
    title: 'Electrical',
    icon: 'Wrench',
    description: 'A-Grade licensed electrician in Victoria. Residential, commercial, and light industrial work.',
  },
];

export interface Service {
  title: string;
  icon: IconName;
  description: string;
  category: 'tech' | 'electrical' | 'creative';
}

export const services: Service[] = [
  {
    title: 'Custom Websites',
    icon: 'Code',
    description: 'Modern, responsive websites built with the latest technologies',
    category: 'tech',
  },
  {
    title: 'WordPress Development',
    icon: 'Code',
    description: 'Custom WordPress themes, plugins, and site management',
    category: 'tech',
  },
  {
    title: 'Embedded Systems',
    icon: 'Microchip',
    description: 'IoT solutions, Arduino, Raspberry Pi, and custom electronics',
    category: 'tech',
  },
  {
    title: 'Electrical Services',
    icon: 'Zap',
    description: 'Licensed electrical work, installations, and smart home integration',
    category: 'electrical',
  },
  {
    title: '3D Visuals & CAD',
    icon: 'Palette',
    description: '3D modeling, CAD drawings, and technical visualizations',
    category: 'creative',
  },
  {
    title: 'Marketing & Branding',
    icon: 'Camera',
    description: 'Company branding, product marketing, and visual content',
    category: 'creative',
  },
];

export interface ContactInfo {
  email: string;
  location: string;
  github: string;
}

/** Internal recipient for EmailJS only — never render in UI or schema. */
export const contactInfo: ContactInfo = {
  email: 'oakcodeandtechsolutions@gmail.com',
  location: 'Melbourne, Australia',
  github: 'https://github.com/Sleuth420',
};
