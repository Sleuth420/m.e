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
      'A complete job tracking and management tool for electricians. Handles quotes, tasks, and site calculations in a custom Vue/Nuxt frontend with a Django backend.',
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
      'A custom WordPress site built for a local Melbourne non-profit. It features easy donation handling, event schedules, and volunteer information.',
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
      'A sleek, mobile-friendly Shopify store I built for a jewellery brand to showcase products and handle secure checkouts.',
    image: PROJECT_IMAGE_PLACEHOLDER,
    links: [{ type: 'external', label: 'Visit Site', url: 'https://glazeyjewellery.com' }],
    technologies: ['Shopify'],
    category: 'web',
  },
  {
    title: 'Electrovision Australia',
    description:
      'A professional WordPress site for an electrical contractor, designed to showcase their services and make it easy for clients to request quotes.',
    image: PROJECT_IMAGE_PLACEHOLDER,
    links: [{ type: 'external', label: 'Visit Site', url: 'https://electrovisionaustralia.com.au' }],
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
      'A custom wedding website with a private login system to help guests RSVP, track attendance, and view event details.',
    image: PROJECT_IMAGE_PLACEHOLDER,
    links: [{ type: 'external', label: 'Private Project', url: '#' }],
    technologies: ['WordPress'],
    category: 'web',
  },
  {
    title: 'Max Trans Portable Homes',
    description:
      'A product-focused WordPress site for a portable homes business, featuring detailed specs, a gallery, and lead-generation forms.',
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
    description:
      'A fun, interactive circle-drawing game with precision challenges and a real-time scoring system built from scratch.',
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
      'A web app for gardening enthusiasts to track plant growth in real-time, get care reminders, and monitor species-specific timelines.',
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
    description: 'Fully qualified A-Grade electrician handling residential, commercial, and industrial projects.',
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
    description: 'Licensed work for homes, commercial sites, and industrial premises. Everything from new installs to maintenance and fault finding.',
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

/** Internal recipient for EmailJS only - never render in UI or schema. */
export const contactInfo: ContactInfo = {
  email: 'oakcodeandtechsolutions@gmail.com',
  location: 'Melbourne, Australia',
  github: 'https://github.com/Sleuth420',
};
