'use client';

import { motion } from 'framer-motion';
import { ServiceCard } from '@/components/ui/service-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { SectionBackground } from '@/components/ui/section-background';
import { services } from '@/lib/data';
import { staggerContainer } from '@/lib/animations';

export default function ServicesSection() {
  const techServices = services.filter(service => service.category === 'tech');
  const electricalServices = services.filter(service => service.category === 'electrical');
  const creativeServices = services.filter(service => service.category === 'creative');

  return (
    <section id="services" className="w-full py-16 pb-0 md:py-24 md:pb-0 lg:py-32 lg:pb-0 relative">
      <SectionBackground variant="dots">
        <div className="container mx-auto">
          <SectionHeading
            badge="What I Offer"
            title="Services"
            description="From web development to electrical work, I provide comprehensive solutions that bridge technology and practical expertise."
          />

          <div className="space-y-12 sm:space-y-16 mt-12">
            {/* Technology Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 gradient-text">Technology Solutions</h3>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="mx-auto grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {techServices.map((service, index) => (
                  <ServiceCard key={index} service={service} />
                ))}
              </motion.div>
            </motion.div>

            {/* Electrical Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 gradient-text">Electrical Services</h3>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="mx-auto grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {electricalServices.map((service, index) => (
                  <ServiceCard key={index} service={service} />
                ))}
              </motion.div>
            </motion.div>

            {/* Creative Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 gradient-text">Creative & Design</h3>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="mx-auto grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {creativeServices.map((service, index) => (
                  <ServiceCard key={index} service={service} />
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </SectionBackground>
    </section>
  );
} 