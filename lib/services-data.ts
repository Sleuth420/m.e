import type { Metadata } from 'next';
import { generateSeoMetadata } from '@/components/seo/Seo';

export interface ServicePageData {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  content: {
    heading: string;
    intro: string;
    features: string[];
    benefits: string[];
    cta: string;
  };
  category: 'electrical' | 'web-dev' | 'app-dev' | 'other';
  location?: string;
}

export const servicePages: Record<string, ServicePageData> = {
  // Electrical services
  'electrician-melbourne': {
    slug: 'electrician-melbourne',
    title: 'Licensed Electrician Melbourne | Residential & Commercial Electrical Services',
    description: 'A-Grade licensed electrician in Melbourne. Residential and commercial electrical work, smart home integration, and industrial systems. Licensed electrical services.',
    keywords: ['electrician melbourne', 'licensed electrician melbourne', 'electrical services melbourne', 'electrician near me'],
    content: {
      heading: 'Licensed Electrician Services in Melbourne',
      intro: 'As an A-Grade licensed electrician in Melbourne, I provide professional electrical services for residential and commercial properties, including smart home integration and industrial systems.',
      features: [
        'Residential & Commercial Electrical Work',
        'Smart Home Integration',
        'Commercial Installations',
        'Industrial Systems',
        'Electrical Maintenance',
        'Safety Inspections'
      ],
      benefits: [
        'A-Grade Licensed Electrician',
        'Licensed electrical work',
        'Quality workmanship',
        'Professional service'
      ],
      cta: 'Get a quote for your electrical project.'
    },
    category: 'electrical',
  },
  'emergency-electrician-melbourne': {
    slug: 'emergency-electrician-melbourne',
    title: 'Emergency Electrician Melbourne | 24/7 Emergency Electrical Repairs',
    description: 'Emergency electrician services in Melbourne. Fast response for urgent electrical repairs, power outages, and electrical emergencies.',
    keywords: ['emergency electrician melbourne', '24 hour electrician melbourne', 'urgent electrician melbourne', 'emergency electrical repairs'],
    content: {
      heading: 'Emergency Electrician Services in Melbourne',
      intro: 'Emergency electrical repairs when you need them most. Fast response for urgent electrical issues, power outages, and electrical emergencies in Melbourne.',
      features: [
        'Emergency Repairs',
        'Fast Response Times',
        'Power Outage Repairs',
        'Urgent Electrical Issues',
        'After-Hours Service',
        'Licensed Emergency Work'
      ],
      benefits: [
        'Quick response to emergencies',
        'Licensed professional',
        'Available when you need help',
        'Quality emergency repairs'
      ],
      cta: 'Contact for emergency electrical assistance.'
    },
    category: 'electrical',
  },
  '24-hour-electrician-melbourne': {
    slug: '24-hour-electrician-melbourne',
    title: '24 Hour Electrician Melbourne | Round-the-Clock Electrical Services',
    description: '24-hour electrician services in Melbourne. Available around the clock for electrical work, from emergency repairs to scheduled installations.',
    keywords: ['24 hour electrician melbourne', 'round the clock electrician', 'after hours electrician melbourne', 'weekend electrician melbourne'],
    content: {
      heading: '24-Hour Electrician Services in Melbourne',
      intro: 'Available 24 hours for your electrical needs in Melbourne. From emergency repairs to scheduled installations, professional electrical service when you need it.',
      features: [
        'Available 24/7',
        'Emergency Repairs',
        'Scheduled Installations',
        'After-Hours Service',
        'Weekend Service',
        'Licensed Professional'
      ],
      benefits: [
        'Available whenever you need service',
        'Flexible scheduling',
        'Licensed electrician',
        'Quality work any time'
      ],
      cta: 'Schedule electrical work at a time that suits you.'
    },
    category: 'electrical',
  },
  // Location-specific electrician pages
  'electrician-melbourne-cbd': {
    slug: 'electrician-melbourne-cbd',
    title: 'Electrician Melbourne CBD | Professional Electrical Services in CBD',
    description: 'Licensed electrician serving Melbourne CBD. Professional electrical services for offices, apartments, and commercial properties in the city center.',
    keywords: ['electrician melbourne cbd', 'cbd electrician melbourne', 'city electrician', 'commercial electrician cbd'],
    content: {
      heading: 'Electrician Services in Melbourne CBD',
      intro: 'Serving Melbourne CBD with professional licensed electrical services for commercial and residential properties. Fast response times and expert service in the city center.',
      features: [
        'CBD Service Area',
        'Commercial & Residential',
        'Office Electrical Work',
        'Apartment Electrical Services',
        'Smart Home Integration',
        'Licensed Professional'
      ],
      benefits: [
        'Quick response to CBD locations',
        'Experience with CBD properties',
        'Commercial and residential expertise',
        'Licensed electrician'
      ],
      cta: 'Get professional electrical service in Melbourne CBD.'
    },
    category: 'electrical',
    location: 'Melbourne CBD',
  },
  'electrician-craigieburn': {
    slug: 'electrician-craigieburn',
    title: 'Electrician Craigieburn | Licensed Electrical Services',
    description: 'Professional electrician services in Craigieburn. Licensed electrical work for homes and businesses in the Craigieburn area.',
    keywords: ['electrician craigieburn', 'electrician near craigieburn', 'craigieburn electrical services'],
    content: {
      heading: 'Electrician Services in Craigieburn',
      intro: 'Serving Craigieburn and surrounding areas with professional licensed electrical services. Residential and commercial electrical work with quality guaranteed.',
      features: [
        'Craigieburn Service Area',
        'Residential & Commercial',
        'Smart Home Installation',
        'Electrical Repairs',
        'Safety Inspections',
        'Licensed Work'
      ],
      benefits: [
        'Local Craigieburn service',
        'Fast response times',
        'Licensed and professional',
        'Quality electrical work'
      ],
      cta: 'Contact for electrical services in Craigieburn.'
    },
    category: 'electrical',
    location: 'Craigieburn',
  },
  'electrician-caroline-springs': {
    slug: 'electrician-caroline-springs',
    title: 'Electrician Caroline Springs | Professional Electrical Services',
    description: 'Licensed electrician serving Caroline Springs. Professional electrical services for residential and commercial properties.',
    keywords: ['electrician caroline springs', 'caroline springs electrician', 'electrical services caroline springs'],
    content: {
      heading: 'Electrician Services in Caroline Springs',
      intro: 'Professional electrical services in Caroline Springs. Licensed electrician providing quality electrical work for homes and businesses.',
      features: [
        'Caroline Springs Service',
        'Residential & Commercial',
        'Commercial Installations',
        'Electrical Maintenance',
        'Smart Home Solutions',
        'Licensed Work'
      ],
      benefits: [
        'Local Caroline Springs electrician',
        'Quality workmanship',
        'Licensed professional',
        'Reliable service'
      ],
      cta: 'Get electrical services in Caroline Springs today.'
    },
    category: 'electrical',
    location: 'Caroline Springs',
  },
  'electrician-port-melbourne': {
    slug: 'electrician-port-melbourne',
    title: 'Electrician Port Melbourne | Licensed Electrical Services',
    description: 'Professional electrician in Port Melbourne. Licensed electrical services for residential and commercial properties in Port Melbourne.',
    keywords: ['electrician port melbourne', 'port melbourne electrician', 'electrical services port melbourne'],
    content: {
      heading: 'Electrician Services in Port Melbourne',
      intro: 'Serving Port Melbourne with professional licensed electrical services. Quality electrical work for homes and businesses in the area.',
      features: [
        'Port Melbourne Service',
        'Residential & Commercial',
        'Electrical Repairs',
        'Installations',
        'Maintenance',
        'Licensed Work'
      ],
      benefits: [
        'Local Port Melbourne service',
        'Experienced electrician',
        'Licensed and professional',
        'Quality guaranteed'
      ],
      cta: 'Contact for Port Melbourne electrical services.'
    },
    category: 'electrical',
    location: 'Port Melbourne',
  },
  'electrician-essendon': {
    slug: 'electrician-essendon',
    title: 'Electrician Essendon | Professional Electrical Services',
    description: 'Licensed electrician serving Essendon. Professional electrical services for residential and commercial properties.',
    keywords: ['electrician essendon', 'essendon electrician', 'electrical services essendon'],
    content: {
      heading: 'Electrician Services in Essendon',
      intro: 'Professional electrical services in Essendon. Licensed electrician providing quality electrical work for homes and businesses.',
      features: [
        'Essendon Service Area',
        'Residential & Commercial',
        'Smart Home Integration',
        'Electrical Repairs',
        'Safety Certifications',
        'Licensed Work'
      ],
      benefits: [
        'Local Essendon electrician',
        'Fast response',
        'Licensed professional',
        'Quality service'
      ],
      cta: 'Get electrical services in Essendon.'
    },
    category: 'electrical',
    location: 'Essendon',
  },
  'electrician-st-kilda': {
    slug: 'electrician-st-kilda',
    title: 'Electrician St Kilda | Licensed Electrical Services',
    description: 'Professional electrician in St Kilda. Licensed electrical services for residential and commercial properties.',
    keywords: ['electrician st kilda', 'st kilda electrician', 'electrical services st kilda'],
    content: {
      heading: 'Electrician Services in St Kilda',
      intro: 'Serving St Kilda with professional licensed electrical services. Quality electrical work for homes and businesses.',
      features: [
        'St Kilda Service',
        'Residential & Commercial',
        'Commercial Installations',
        'Electrical Maintenance',
        'Smart Home Solutions',
        'Licensed Work'
      ],
      benefits: [
        'Local St Kilda service',
        'Experienced professional',
        'Licensed and professional',
        'Quality workmanship'
      ],
      cta: 'Contact for St Kilda electrical services.'
    },
    category: 'electrical',
    location: 'St Kilda',
  },
  'electrician-glenroy': {
    slug: 'electrician-glenroy',
    title: 'Electrician Glenroy | Professional Electrical Services',
    description: 'Licensed electrician serving Glenroy. Professional electrical services for residential and commercial properties.',
    keywords: ['electrician glenroy', 'glenroy electrician', 'electrical services glenroy'],
    content: {
      heading: 'Electrician Services in Glenroy',
      intro: 'Professional electrical services in Glenroy. Licensed electrician providing quality electrical work for homes and businesses.',
      features: [
        'Glenroy Service Area',
        'Residential & Commercial',
        'Electrical Repairs',
        'Installations',
        'Maintenance',
        'Licensed Work'
      ],
      benefits: [
        'Local Glenroy electrician',
        'Fast response times',
        'Licensed professional',
        'Quality service'
      ],
      cta: 'Get electrical services in Glenroy today.'
    },
    category: 'electrical',
    location: 'Glenroy',
  },
  'electrician-glen-waverley': {
    slug: 'electrician-glen-waverley',
    title: 'Electrician Glen Waverley | Licensed Electrical Services',
    description: 'Professional electrician in Glen Waverley. Licensed electrical services for residential and commercial properties.',
    keywords: ['electrician glen waverley', 'glen waverley electrician', 'electrical services glen waverley'],
    content: {
      heading: 'Electrician Services in Glen Waverley',
      intro: 'Serving Glen Waverley with professional licensed electrical services. Quality electrical work for homes and businesses.',
      features: [
        'Glen Waverley Service',
        'Residential & Commercial',
        'Smart Home Integration',
        'Electrical Repairs',
        'Safety Inspections',
        'Licensed Work'
      ],
      benefits: [
        'Local Glen Waverley service',
        'Experienced electrician',
        'Licensed and professional',
        'Quality guaranteed'
      ],
      cta: 'Contact for Glen Waverley electrical services.'
    },
    category: 'electrical',
    location: 'Glen Waverley',
  },
  'electrician-south-melbourne': {
    slug: 'electrician-south-melbourne',
    title: 'Electrician South Melbourne | Professional Electrical Services',
    description: 'Licensed electrician serving South Melbourne. Professional electrical services for residential and commercial properties.',
    keywords: ['electrician south melbourne', 'south melbourne electrician', 'electrical services south melbourne'],
    content: {
      heading: 'Electrician Services in South Melbourne',
      intro: 'Professional electrical services in South Melbourne. Licensed electrician providing quality electrical work for homes and businesses.',
      features: [
        'South Melbourne Service',
        'Residential & Commercial',
        'Commercial Installations',
        'Electrical Maintenance',
        'Smart Home Solutions',
        'Licensed Work'
      ],
      benefits: [
        'Local South Melbourne electrician',
        'Fast response',
        'Licensed professional',
        'Quality service'
      ],
      cta: 'Get electrical services in South Melbourne.'
    },
    category: 'electrical',
    location: 'South Melbourne',
  },
  'electrician-western-suburbs': {
    slug: 'electrician-western-suburbs',
    title: 'Electrician Western Suburbs Melbourne | Licensed Electrical Services',
    description: 'Professional electrician serving Melbourne\'s Western Suburbs. Licensed electrical services for residential and commercial properties.',
    keywords: ['electrician western suburbs', 'western suburbs electrician melbourne', 'electrical services western suburbs'],
    content: {
      heading: 'Electrician Services in Melbourne\'s Western Suburbs',
      intro: 'Serving Melbourne\'s Western Suburbs with professional licensed electrical services. Quality electrical work for homes and businesses across the western region.',
      features: [
        'Western Suburbs Service',
        'Residential & Commercial',
        'Electrical Repairs',
        'Installations',
        'Maintenance',
        'Licensed Work'
      ],
      benefits: [
        'Western Suburbs coverage',
        'Local knowledge',
        'Licensed and professional',
        'Quality workmanship'
      ],
      cta: 'Contact for Western Suburbs electrical services.'
    },
    category: 'electrical',
    location: 'Western Suburbs',
  },
  // Web development services
  'wordpress-developer-melbourne': {
    slug: 'wordpress-developer-melbourne',
    title: 'WordPress Developer Melbourne | Custom WordPress Development',
    description: 'Professional WordPress developer in Melbourne. Custom WordPress websites, WooCommerce stores, blogs, and business sites with full customization and optimization.',
    keywords: ['wordpress developer melbourne', 'wordpress development melbourne', 'woocommerce developer melbourne', 'custom wordpress melbourne'],
    content: {
      heading: 'WordPress Developer Services in Melbourne',
      intro: 'Professional WordPress developer in Melbourne specializing in custom WordPress websites, WooCommerce stores, blogs, and business sites with full customization and optimization.',
      features: [
        'Custom WordPress Websites',
        'WooCommerce Stores',
        'Blog Setup',
        'Business Websites',
        'Custom Themes',
        'WooCommerce Integration'
      ],
      benefits: [
        'Full customization and optimization',
        'Custom themes and plugins',
        'WooCommerce e-commerce solutions',
        'Professional WordPress development'
      ],
      cta: 'Get a custom WordPress website for your business.'
    },
    category: 'web-dev',
  },
  'web-developer-melbourne': {
    slug: 'web-developer-melbourne',
    title: 'Web Developer Melbourne | Custom Code Development',
    description: 'Professional web developer in Melbourne. Full-stack custom development with React/Next.js, Vue.js/Django, and modern frameworks.',
    keywords: ['web developer melbourne', 'web development melbourne', 'custom web development', 'website developer melbourne'],
    content: {
      heading: 'Web Developer Services in Melbourne',
      intro: 'Professional web developer in Melbourne specializing in full-stack custom development with complete control and unlimited customization possibilities using React/Next.js, Vue.js/Django, and modern frameworks.',
      features: [
        'Custom Code Development',
        'React/Next.js Development',
        'Vue.js/Django Development',
        'Full Customization',
        'Modern Frameworks',
        'Full-Stack Solutions'
      ],
      benefits: [
        'Complete control and customization',
        'Modern frameworks and technologies',
        'Full-stack development expertise',
        'Unlimited customization possibilities'
      ],
      cta: 'Start your custom web development project today.'
    },
    category: 'web-dev',
  },
  'website-development-melbourne': {
    slug: 'website-development-melbourne',
    title: 'Website Development Melbourne | WordPress & Custom Development',
    description: 'Professional website development services in Melbourne. Custom WordPress websites and full-stack custom development with modern technologies.',
    keywords: ['website development melbourne', 'website design melbourne', 'custom website development', 'business website melbourne'],
    content: {
      heading: 'Website Development Services in Melbourne',
      intro: 'Professional website development in Melbourne. Creating custom WordPress websites and full-stack custom applications using modern technologies like React, Next.js, Vue.js, and Django.',
      features: [
        'WordPress Website Development',
        'Custom Code Development',
        'React/Next.js Development',
        'Vue.js/Django Development',
        'Modern Responsive Design',
        'Full Customization'
      ],
      benefits: [
        'WordPress and custom development options',
        'Modern technologies and frameworks',
        'Fully customized solutions',
        'Professional website development'
      ],
      cta: 'Get a professional website for your business.'
    },
    category: 'web-dev',
  },
  'custom-web-development-melbourne': {
    slug: 'custom-web-development-melbourne',
    title: 'Custom Web Development Melbourne | Full-Stack Development',
    description: 'Custom web development services in Melbourne. Full-stack custom development with React/Next.js, Vue.js/Django, and complete control over your website.',
    keywords: ['custom web development melbourne', 'custom website development', 'tailored web solutions', 'bespoke web development'],
    content: {
      heading: 'Custom Web Development Services in Melbourne',
      intro: 'Custom web development in Melbourne. Building full-stack custom applications with complete control and unlimited customization possibilities using React/Next.js, Vue.js/Django, and modern frameworks.',
      features: [
        'Full-Stack Custom Development',
        'React/Next.js Development',
        'Vue.js/Django Development',
        'Complete Control & Customization',
        'Modern Frameworks',
        'Unlimited Customization'
      ],
      benefits: [
        'Built exactly to your specifications',
        'Complete control over functionality',
        'Modern development technologies',
        'Unlimited customization possibilities'
      ],
      cta: 'Discuss your custom web development needs.'
    },
    category: 'web-dev',
  },
  // App development services - Note: These may not be actual separate services
  'app-developer-melbourne': {
    slug: 'app-developer-melbourne',
    title: 'App Developer Melbourne | Custom Application Development',
    description: 'Professional app developer in Melbourne. Custom web applications and full-stack development using React, Next.js, Vue.js, and Django.',
    keywords: ['app developer melbourne', 'application developer melbourne', 'custom app development', 'web application developer'],
    content: {
      heading: 'App Developer Services in Melbourne',
      intro: 'Professional app developer in Melbourne specializing in custom web applications and full-stack development using modern technologies like React, Next.js, Vue.js, and Django.',
      features: [
        'Custom Web Applications',
        'React/Next.js Development',
        'Vue.js/Django Development',
        'Full-Stack Solutions',
        'Modern Frameworks',
        'Custom Functionality'
      ],
      benefits: [
        'Custom application development',
        'Modern web technologies',
        'Full-stack expertise',
        'Tailored to your needs'
      ],
      cta: 'Start building your custom application today.'
    },
    category: 'app-dev',
  },
  'app-development-melbourne': {
    slug: 'app-development-melbourne',
    title: 'App Development Melbourne | Custom Application Development',
    description: 'Professional app development services in Melbourne. Custom web applications built with React, Next.js, Vue.js, and Django.',
    keywords: ['app development melbourne', 'application development melbourne', 'custom app development', 'web application development'],
    content: {
      heading: 'App Development Services in Melbourne',
      intro: 'Professional app development in Melbourne. Creating custom web applications using modern technologies like React, Next.js, Vue.js, and Django for complete control and customization.',
      features: [
        'Custom Application Development',
        'React/Next.js Development',
        'Vue.js/Django Development',
        'Full-Stack Solutions',
        'Modern Frameworks',
        'Custom Functionality'
      ],
      benefits: [
        'Tailored to your business needs',
        'Modern development practices',
        'Full-stack solutions',
        'Complete customization'
      ],
      cta: 'Get a custom application developed for your business.'
    },
    category: 'app-dev',
  },
  'software-developer-melbourne': {
    slug: 'software-developer-melbourne',
    title: 'Software Developer Melbourne | Custom Software Development',
    description: 'Professional software developer in Melbourne. Custom web applications and full-stack development using modern technologies.',
    keywords: ['software developer melbourne', 'software development melbourne', 'custom software development', 'web application developer'],
    content: {
      heading: 'Software Developer Services in Melbourne',
      intro: 'Professional software developer in Melbourne. Building custom web applications and full-stack solutions using modern technologies like React, Next.js, Vue.js, and Django.',
      features: [
        'Custom Software Development',
        'Web Application Development',
        'React/Next.js Development',
        'Vue.js/Django Development',
        'Full-Stack Solutions',
        'Modern Technologies'
      ],
      benefits: [
        'Solutions tailored to your workflow',
        'Modern development technologies',
        'Full-stack expertise',
        'Custom functionality'
      ],
      cta: 'Discuss your software development requirements.'
    },
    category: 'app-dev',
  },
  // Other services
  'embedded-systems-melbourne': {
    slug: 'embedded-systems-melbourne',
    title: 'Embedded Systems Melbourne | Raspberry Pi & IoT Solutions',
    description: 'Embedded systems development in Melbourne. Custom embedded systems, IoT solutions, Raspberry Pi projects, and hardware integration.',
    keywords: ['embedded systems melbourne', 'raspberry pi melbourne', 'iot solutions melbourne', 'arduino development melbourne'],
    content: {
      heading: 'Embedded Systems Development in Melbourne',
      intro: 'Embedded systems and IoT development in Melbourne. Creating custom embedded systems, IoT solutions, and hardware integration projects using Raspberry Pi and other platforms.',
      features: [
        'Raspberry Pi Projects',
        'IoT Solutions',
        'Hardware Integration',
        'Custom Electronics',
        'Automation Systems',
        'Embedded Systems Development'
      ],
      benefits: [
        'Hardware and software expertise',
        'Custom IoT solutions',
        'Automation capabilities',
        'End-to-end development'
      ],
      cta: 'Start your embedded systems project.'
    },
    category: 'other',
  },
  'iot-solutions-melbourne': {
    slug: 'iot-solutions-melbourne',
    title: 'IoT Solutions Melbourne | Internet of Things Development',
    description: 'IoT solutions development in Melbourne. Custom embedded systems, IoT solutions, and hardware integration projects.',
    keywords: ['iot solutions melbourne', 'internet of things melbourne', 'iot development melbourne', 'smart device integration'],
    content: {
      heading: 'IoT Solutions Development in Melbourne',
      intro: 'IoT solutions development in Melbourne. Creating custom embedded systems, IoT solutions, and hardware integration projects for automation and monitoring.',
      features: [
        'IoT Solutions',
        'Raspberry Pi Projects',
        'Hardware Integration',
        'Custom Electronics',
        'Automation Systems',
        'Smart Device Integration'
      ],
      benefits: [
        'Connected device expertise',
        'Hardware and software integration',
        'Custom IoT solutions',
        'Automation capabilities'
      ],
      cta: 'Explore IoT solutions for your business.'
    },
    category: 'other',
  },
  'digital-marketing-melbourne': {
    slug: 'digital-marketing-melbourne',
    title: 'Digital Marketing Melbourne | Marketing & SEO Services',
    description: 'Digital marketing services in Melbourne. Comprehensive digital marketing, SEO optimization, and content creation services.',
    keywords: ['digital marketing melbourne', 'online marketing melbourne', 'marketing services melbourne', 'business marketing melbourne'],
    content: {
      heading: 'Digital Marketing Services in Melbourne',
      intro: 'Digital marketing services in Melbourne. Comprehensive digital marketing, SEO optimization, and content creation services to help your business grow online.',
      features: [
        'SEO Optimization',
        'Content Writing',
        'Marketing Strategies',
        'Brand Development',
        'Digital Marketing',
        'Content Creation'
      ],
      benefits: [
        'Increased online visibility',
        'Better search engine rankings',
        'Professional marketing strategies',
        'Content creation services'
      ],
      cta: 'Grow your business with digital marketing.'
    },
    category: 'other',
  },
  'seo-services-melbourne': {
    slug: 'seo-services-melbourne',
    title: 'SEO Services Melbourne | Search Engine Optimization',
    description: 'Professional SEO services in Melbourne. SEO optimization to improve your website\'s visibility and rankings in search results.',
    keywords: ['seo services melbourne', 'search engine optimization melbourne', 'seo melbourne', 'website seo melbourne'],
    content: {
      heading: 'SEO Services in Melbourne',
      intro: 'Professional SEO services in Melbourne. SEO optimization to improve your website\'s visibility and rankings in search results, driving more organic traffic.',
      features: [
        'SEO Optimization',
        'Search Engine Optimization',
        'Website SEO',
        'Content Optimization',
        'SEO Strategy',
        'Online Visibility'
      ],
      benefits: [
        'Higher search engine rankings',
        'More organic website traffic',
        'Better online visibility',
        'Professional SEO services'
      ],
      cta: 'Improve your search engine rankings today.'
    },
    category: 'other',
  },
  'cybersecurity-melbourne': {
    slug: 'cybersecurity-melbourne',
    title: 'Cybersecurity Melbourne | Penetration Testing & Security Services',
    description: 'Cybersecurity services in Melbourne. Comprehensive security testing, penetration testing, and vulnerability assessment services.',
    keywords: ['cybersecurity melbourne', 'penetration testing melbourne', 'security testing melbourne', 'security consulting melbourne'],
    content: {
      heading: 'Cybersecurity Services in Melbourne',
      intro: 'Cybersecurity services in Melbourne. Comprehensive security testing and vulnerability assessment services including penetration testing, security audits, and security consulting.',
      features: [
        'Penetration Testing',
        'Security Audits',
        'Vulnerability Testing',
        'Network Security',
        'Security Consulting',
        'Security Testing'
      ],
      benefits: [
        'Protect your business data',
        'Identify security vulnerabilities',
        'Comprehensive security testing',
        'Professional security services'
      ],
      cta: 'Secure your business with professional cybersecurity.'
    },
    category: 'other',
  },
  'cad-design-melbourne': {
    slug: 'cad-design-melbourne',
    title: 'CAD Design Melbourne | Technical Drawings & 3D Modeling',
    description: 'CAD design services in Melbourne. Technical drawings, 3D modeling with Blender, and AI-powered design workflows.',
    keywords: ['cad design melbourne', 'technical drawing melbourne', '3d modeling melbourne', 'cad services melbourne'],
    content: {
      heading: 'CAD Design Services in Melbourne',
      intro: 'CAD design and 3D modeling services in Melbourne. Technical drawings, 3D modeling with Blender, and AI-powered design workflows for your projects.',
      features: [
        'CAD Drawings',
        '3D Modeling',
        'Blender Projects',
        'AI Workflows',
        'Technical Drawings',
        'Design Services'
      ],
      benefits: [
        'Accurate technical drawings',
        'Professional 3D modeling',
        'Blender expertise',
        'AI-powered design workflows'
      ],
      cta: 'Get professional CAD design for your project.'
    },
    category: 'other',
  },
};

export function getAllServiceSlugs(): string[] {
  return Object.keys(servicePages);
}

export function getServicePageData(slug: string): ServicePageData | null {
  return servicePages[slug] || null;
}

export function generateServiceMetadata(slug: string): Metadata | null {
  const data = getServicePageData(slug);
  if (!data) return null;

  const canonicalUrl = `https://www.oakcodeandtechsolutions.com/services/${slug}`;

  return generateSeoMetadata({
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    type: 'website',
    canonical: canonicalUrl,
  });
}
