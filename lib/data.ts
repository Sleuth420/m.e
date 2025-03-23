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
      'A Vue.js + Django REST full-stack application for electricians to manage jobs, streamline on-site calculations and repetitive day-to-day tasks.',
    image: '/placeholder.svg?height=400&width=600',
    links: [{ type: 'github', label: 'In Progress', url: '#' }],
  },
  {
    title: 'GlazeyJewellery.com',
    description:
      'Collaborated on this Shopify-based jewellery online store, implementing custom features and optimizing the checkout process.',
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
    title: 'ZegaMame Pokedex',
    description:
      'Python-Tkinter Pokedex application built on a ZegaMame board with custom Linux ROM, showcasing embedded systems skills and a passion for retro gaming.',
    image: '/placeholder.svg?height=400&width=600',
    links: [
      { type: 'github', label: 'Code', url: 'https://github.com/Sleuth420/Python-Tkinter-Pokedex' },
    ],
  },
];

export interface Skill {
  title: string;
  icon: string;
  description: string;
}

export const skills: Skill[] = [
  {
    title: 'Web Development',
    icon: 'Code',
    description: 'Vue.js, React, Django, WordPress, Shopify',
  },
  {
    title: 'Cybersecurity',
    icon: 'Shield',
    description: 'Network Security, Penetration Testing, Secure Coding',
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
