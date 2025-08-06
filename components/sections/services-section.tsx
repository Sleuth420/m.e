'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { SectionHeading } from '@/components/ui/section-heading';
import { SectionBackground } from '@/components/ui/section-background';
import { IconSelector } from '@/components/ui/icon-selector';

export default function ServicesSection() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const serviceCategories = [
    {
      id: 1,
      title: 'Web Development',
      icon: 'Code',
      color: 'from-orange-500 to-amber-500',
      services: [
        {
          name: 'WordPress Sites',
          description: 'Custom WordPress websites, WooCommerce stores, blogs, and business sites with full customization and optimization.',
          features: ['Custom themes', 'WooCommerce integration', 'Blog setup', 'Business websites']
        },
        {
          name: 'Custom Code Development',
          description: 'Full-stack custom development with complete control and unlimited customization possibilities.',
          features: ['React/Next.js', 'Vue.js/Django', 'Full customization', 'Modern frameworks']
        }
      ]
    },
    {
      id: 2,
      title: 'Embedded Systems',
      icon: 'Microchip',
      color: 'from-slate-600 to-slate-800',
      services: [
        {
          name: 'Raspberry Pi Projects',
          description: 'Custom embedded systems, IoT solutions, and hardware integration projects.',
          features: ['IoT solutions', 'Hardware integration', 'Custom electronics', 'Automation systems']
        }
      ]
    },
    {
      id: 3,
      title: 'Electrical Services',
      icon: 'Zap',
      color: 'from-orange-600 to-amber-600',
      services: [
        {
          name: 'Residential & Commercial',
          description: 'Licensed electrical work for homes, businesses, and industrial applications.',
          features: ['Smart home integration', 'Commercial installations', 'Industrial systems', 'Licensed work']
        }
      ]
    },
    {
      id: 4,
      title: 'Digital Marketing',
      icon: 'Camera',
      color: 'from-slate-700 to-slate-900',
      services: [
        {
          name: 'Marketing & SEO',
          description: 'Comprehensive digital marketing, SEO optimization, and content creation services.',
          features: ['SEO optimization', 'Content writing', 'Marketing strategies', 'Brand development']
        }
      ]
    },
    {
      id: 5,
      title: 'IT & Business Setup',
      icon: 'Database',
      color: 'from-orange-500 to-amber-500',
      services: [
        {
          name: 'Business Infrastructure',
          description: 'Complete IT setup including email domains, servers, and business administration systems.',
          features: ['Email setup', 'Domain management', 'Server configuration', 'Business systems']
        }
      ]
    },
    {
      id: 6,
      title: 'Cybersecurity',
      icon: 'Shield',
      color: 'from-slate-600 to-slate-800',
      services: [
        {
          name: 'Penetration Testing',
          description: 'Comprehensive security testing and vulnerability assessment services.',
          features: ['Security audits', 'Vulnerability testing', 'Network security', 'Security consulting']
        }
      ]
    },
    {
      id: 7,
      title: 'Design & 3D',
      icon: 'Palette',
      color: 'from-orange-600 to-amber-600',
      services: [
        {
          name: 'CAD & 3D Modeling',
          description: 'Technical drawings, 3D modeling with Blender, and AI-powered design workflows.',
          features: ['CAD drawings', '3D modeling', 'Blender projects', 'AI workflows']
        }
      ]
    }
  ];

  return (
    <section id="services" className="w-full py-16 pb-0 md:py-24 md:pb-0 lg:py-32 lg:pb-0 relative">
      <SectionBackground variant="dots">
        <div className="container mx-auto">
          <SectionHeading
            badge="What I Offer"
            title="Services"
            description="From web development to electrical work, I provide comprehensive solutions that bridge technology and practical expertise."
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-7xl mt-12"
          >
            {/* Services Grid */}
            <div className="grid gap-6 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
              {serviceCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative group"
                >
                  <motion.div
                    className={`relative overflow-hidden rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 cursor-pointer transition-all duration-500 hover:shadow-xl hover:-translate-y-2 ${
                      activeCard === category.id ? 'ring-2 ring-orange-500/50' : ''
                    }`}
                    onClick={() => setActiveCard(activeCard === category.id ? null : category.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Gradient Header */}
                    <div className={`h-20 bg-gradient-to-r ${category.color} relative overflow-hidden`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconSelector name={category.icon as any} className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-bold text-white">
                          {category.title}
                        </h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="space-y-4">
                        {category.services.map((service, serviceIndex) => (
                          <div key={serviceIndex} className="space-y-3">
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                              {service.name}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                              {service.description}
                            </p>
                            
                            <motion.div
                              initial={false}
                              animate={{ 
                                height: activeCard === category.id ? 'auto' : '0px',
                                opacity: activeCard === category.id ? 1 : 0
                              }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-2">
                                <p className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                                  Key Features:
                                </p>
                                <ul className="space-y-1">
                                  {service.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 flex-shrink-0"></span>
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </motion.div>
                          </div>
                        ))}
                      </div>

                      {/* Click indicator */}
                      <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {activeCard === category.id ? 'Click to hide details' : 'Click to see features'}
                        </span>
                        <motion.div
                          animate={{ rotate: activeCard === category.id ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <IconSelector name="ExternalLink" className="w-4 h-4 text-slate-400" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center mt-16"
            >
              <div className="inline-block bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-2xl p-8 border border-orange-200/50 dark:border-orange-800/50">
                <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  Need a custom solution? I specialize in bridging gaps between different technologies and industries.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </SectionBackground>
    </section>
  );
} 