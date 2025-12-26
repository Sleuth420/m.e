import { type IconName } from '@/components/ui/icon-selector';

export interface ProjectLink {
  type: 'github' | 'external';
  label: string;
  url: string;
  nofollow?: boolean;
}

export interface Project {
  title: string;
  description: string;
  image: string;
  links: ProjectLink[];
  technologies: string[];
}

export const projects: Project[] = [
  {
    title: 'Electrician Management App',
    description:
      'A comprehensive management platform for electricians featuring job tracking, on-site calculations, and task automation to streamline daily operations and improve productivity.',
    image: '/placeholder.svg?height=400&width=600',
    links: [{ type: 'external', label: 'In Progress', url: 'https://ohmsweetohm.xyz' }],
    technologies: ['Vue.js', 'Django', 'Python', 'PostgreSQL', 'Stripe', 'Clerk', 'Cloudflare', 'Sentry', 'AWS', 'Nginx', 'Docker'  ],
  },
  {
    title: 'Reaching Out In The Inner West',
    description:
      'Professional website for a Melbourne-based non-profit organization, enabling online donations and event coordination to support community outreach programs.',
    image: '/placeholder.svg?height=400&width=600',
    links: [
      {
        type: 'external',
        label: 'Visit Site',
        url: 'https://reachingoutintheinnerwestofmelbourne.com.au',
      },
    ],
    technologies: ['WordPress', 'Elementor'],
  },
  {
    title: 'GlazeyJewellery.com',
    description:
      'Elegant online jewelry store featuring custom product showcases, streamlined checkout experience, and responsive design for an enhanced shopping experience.',
    image: '/placeholder.svg?height=400&width=600',
    links: [{ type: 'external', label: 'Visit Site', url: 'https://glazeyjewellery.com' }],
    technologies: ['Shopify'],
  },
  {
    title: 'Electrovision Australia',
    description:
      'Professional website for an electrical contracting business, showcasing services, project galleries, and enabling seamless online quote requests for residential and commercial clients.',
    image: '/placeholder.svg?height=400&width=600',
    links: [{ type: 'external', label: 'Visit Site', url: '#' }],
    technologies: ['Wordpress'],
  },
  {
    title: 'Wedding & RSVP Website',
    description:
      'Beautiful wedding website featuring RSVP functionality and tracking, custom login system, and a beautiful design for a memorable celebration.',
    image: '/placeholder.svg?height=400&width=600',
    links: [{ type: 'external', label: 'Private Project', url: '#' }],
    technologies: ['Wordpress'],
  },
  {
    title: 'Dog Grooming Online',
    description:
      'Comprehensive dog directory website for Australia featuring groomer listings, service directories, and location-based search to help pet owners find quality grooming services across the country.',
    image: '/placeholder.svg?height=400&width=600',
    links: [{ type: 'external', label: 'Visit Site', url: 'https://dog-grooming.online' }],
    technologies: ['WordPress', 'Elementor'],
  },
  {
    title: 'Max Trans Portable Homes',
    description:
      'Modern website for a granny flats & portable homes company featuring modular housing showcases, detailed product specifications, and streamlined customer inquiry system.',
    image: '/placeholder.svg?height=400&width=600',
    links: [{ type: 'external', label: 'Visit Site', url: 'https://maxtrans.com.au', nofollow: true }],
    technologies: ['WordPress', 'Elementor'],
  },
  {
    title: 'ZegaMame Pokedex',
    description:
      'Interactive Pokédex application built on custom embedded hardware, featuring a comprehensive database of Pokémon with search, filter, and detailed information display capabilities.',
    image: '/placeholder.svg?height=400&width=600',
    links: [
      { type: 'github', label: 'Code', url: 'https://github.com/Sleuth420/Python-Tkinter-Pokedex' },
    ],
    technologies: ['Python', 'Tkinter', 'Linux', 'Embedded Systems', 'GPIO'],
  },
  {
    title: 'Perfect Circle',
    description: 'Interactive circle-drawing game featuring precision challenges, multiple difficulty levels, and real-time scoring system for competitive gameplay.',
    image: '/placeholder.svg?height=400&width=600',
    links: [
      { type: 'external', label: 'Visit Site', url: 'https://sleuth420.github.io/perfect-circle/' },
    ],
    technologies: ['v0 lol'],
  },
  {
    title: 'Grow-y',
    description:
      'Innovative plant tracking web application with real-time growth monitoring, care reminders, and species-specific growing timelines for gardening enthusiasts.',
    image: '/placeholder.svg?height=400&width=600',
    links: [{ type: 'external', label: 'In Progress', url: 'https://growy.xyz' }],
    technologies: ['React', 'Tailwind CSS', 'JavaScript', 'Vercel'],
  },
  {
    title: 'The Granny Flat Guide',
    description: 'Comprehensive guide and review platform for granny flats, featuring builder directories, design inspiration, cost calculators, and community reviews.',
    image: '/placeholder.svg?height=400&width=600',
    links: [{ type: 'external', label: 'Visit Site', url: 'https://thegrannyflatguide.com' }],
    technologies: ['WordPress', 'Elementor'],
  },
  {
    title: 'Modern Home Tech',
    description: 'Curated affiliate marketing platform showcasing modern home technology products with detailed reviews, buying guides, and product comparison tools.',
    image: '/placeholder.svg?height=400&width=600',
    links: [{ type: 'external', label: 'Visit Site', url: 'https://modernhome.cloud' }],
    technologies: ['WordPress', 'Elementor'],
  }
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
    description: 'A-GradeLicensed Electrician, Industrial Systems, Smart Home Integration, Residential | Commercial | Industrial, ',
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

export const contactInfo: ContactInfo = {
  email: 'oakcodeandtechsolutions@gmail.com',
  location: 'Melbourne, Australia',
  github: 'https://github.com/Sleuth420',
};

export interface SiteMetadata {
  title: string;
  description: string;
  author: string;
  company: string;
}

export const siteMetadata: SiteMetadata = {
  title: 'Ricky - OakCodeAndTechSolutions',
  description: 'Full-stack developer & electrician specializing in modern web technologies',
  author: 'Ricky',
  company: 'OakCodeAndTechSolutions',
};
