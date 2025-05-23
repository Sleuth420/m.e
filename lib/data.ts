import { type IconName } from '@/components/ui/icon-selector';

export interface ProjectLink {
  type: 'github' | 'external';
  label: string;
  url: string;
}

export interface Project {
  title: string;
  description: string;
  image: string;
  links: ProjectLink[];
}

export const projects: Project[] = [
  {
    title: 'Electrician Management App',
    description:
      'A Vue.js + Django REST full-stack application for electricians consisting of feature based tools to manage jobs, streamline on-site calculations and repetitive day-to-day tasks. Complete with Stripe integration and secure practices such as OTP and 2fa',
    image: '/placeholder.svg?height=400&width=600',
    links: [{ type: 'external', label: 'In Progress', url: 'https://ohmsweetohm.xyz' }],
  },
  {
    title: 'Reaching Out In The Inner West',
    description:
      'WordPress website for a Melbourne-based non-profit organization, featuring donation integration and event management.',
    image: '/placeholder.svg?height=400&width=600',
    links: [
      {
        type: 'external',
        label: 'Visit Site',
        url: 'https://reachingoutintheinnerwestofmelbourne.com.au',
      },
    ],
  },
  {
    title: 'GlazeyJewellery.com',
    description:
      'Collaborated on this Shopify-based jewellery online store, implementing custom features and optimizing the checkout process. Design by others',
    image: '/placeholder.svg?height=400&width=600',
    links: [{ type: 'external', label: 'Visit Site', url: 'https://glazeyjewellery.com' }],
  },
  {
    title: 'Electrovision Australia',
    description:
      'Developed a website for this electrical contracting business, showcasing services and enabling online quote requests.',
    image: '/placeholder.svg?height=400&width=600',
    links: [{ type: 'external', label: 'Visit Site', url: '#' }],
  },
  {
    title: 'ZegaMame Pokedex',
    description:
      'Python-Tkinter Pokedex application built on a ZegaMame board with custom Linux ROM, showcasing embedded systems skills and a passion for retro gaming.',
    image: '/placeholder.svg?height=400&width=600',
    links: [
      { type: 'github', label: 'Code', url: 'https://github.com/Sleuth420/Python-Tkinter-Pokedex' },
    ],
  },
  {
    title: 'Perfect Circle',
    description: 'A Simple game written by AI using React and Next.js',
    image: '/placeholder.svg?height=400&width=600',
    links: [{ type: 'external', label: 'Visit Site', url: 'https://sleuth420.github.io/perfect-circle/' }],
  },
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
    description: 'Licensed Electrician, Industrial Systems, Smart Home Integration',
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
