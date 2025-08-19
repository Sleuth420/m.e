'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap, Code, Microchip, Palette, Shield, Database, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SectionHeading } from '@/components/ui/section-heading';
import { SectionBackground } from '@/components/ui/section-background';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function PricingPage() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-orange-900 dark:from-slate-950 dark:via-slate-900 dark:to-orange-900">
          {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#3b82f6_0%,_transparent_30%,_transparent_100%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_#f97316_0%,_transparent_30%,_transparent_100%)]"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
                         className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6"
          >
            Pricing & Packages
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
                         className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8"
          >
            Transparent pricing for all my services. From simple WordPress sites to complex custom applications, 
            I offer flexible solutions that fit your budget and timeline.
          </motion.p>
          
          {/* Quick Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              { id: 'wordpress', label: 'WordPress', icon: Code },
              { id: 'custom-development', label: 'Custom Development', icon: Code },
              { id: 'electrical', label: 'Electrical', icon: Zap },
              { id: 'other-services', label: 'Other Services', icon: Palette }
            ].map((service) => (
              <Button
                key={service.id}
                variant="outline"
                className="border-orange-400/30 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20 hover:text-orange-200 hover:border-orange-400/40"
                onClick={() => scrollToSection(service.id)}
              >
                <service.icon className="w-4 h-4 mr-2" />
                {service.label}
              </Button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WordPress Development Section */}
      <section id="wordpress" className="py-16 relative">
        <SectionBackground variant="dots">
          <div className="container mx-auto">
            <SectionHeading
              badge="WordPress Development"
              title="WordPress Packages"
              description="Professional WordPress solutions from simple starter sites to complex enterprise applications."
            />

            <div className="grid md:grid-cols-3 gap-8 mt-12 px-4 sm:px-0">
              {/* Simple Starter Package */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative bg-white/90 dark:bg-slate-900/90 rounded-2xl p-8 border border-orange-200/50 dark:border-orange-800/50 shadow-lg"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Simple Starter</h3>
                  <div className="text-4xl font-bold text-orange-600 mb-2">$1,200</div>
                  <p className="text-slate-600 dark:text-slate-400">Perfect for small businesses</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {[
                    'Single page WordPress site',
                    'Basic responsive design',
                    'Contact form',
                    'Basic SEO setup',
                    '1 week delivery',
                    '30 days support'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" asChild>
                  <Link href="/#contact">
                    Get Started
                  </Link>
                </Button>
              </motion.div>

              {/* Medium Business Package */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative bg-white/90 dark:bg-slate-900/90 rounded-2xl p-8 border-2 border-orange-500 shadow-xl scale-105"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Medium Business</h3>
                  <div className="text-4xl font-bold text-orange-600 mb-2">$2,800</div>
                  <p className="text-slate-600 dark:text-slate-400">Ideal for growing businesses</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {[
                    '5-8 page WordPress site',
                    'Custom theme design',
                    'WooCommerce integration',
                    'Advanced SEO optimization',
                    'Contact forms + newsletter',
                    '2-3 weeks delivery',
                    '60 days support'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" asChild>
                  <Link href="/#contact">
                    Get Started
                  </Link>
                </Button>
              </motion.div>

              {/* Large Enterprise Package */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative bg-white/90 dark:bg-slate-900/90 rounded-2xl p-8 border border-orange-200/50 dark:border-orange-800/50 shadow-lg"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Large Enterprise</h3>
                  <div className="text-4xl font-bold text-orange-600 mb-2">$5,500</div>
                  <p className="text-slate-600 dark:text-slate-400">For established businesses</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {[
                    '10+ page WordPress site',
                    'Fully custom theme',
                    'Advanced functionality',
                    'E-commerce integration',
                    'Advanced security features',
                    'Performance optimization',
                    '4-6 weeks delivery',
                    '90 days support'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" asChild>
                  <Link href="/#contact">
                    Get Started
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Custom Solutions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-12"
            >
              <div className="inline-block bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-2xl p-8 border border-orange-200/50 dark:border-orange-800/50">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Custom Solutions</h3>
                <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
                  Need something beyond these packages? Custom WordPress solutions starting from $8,000 AUD.
                </p>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white" asChild>
                  <Link href="/#contact">
                    Request Custom Quote
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </SectionBackground>
      </section>

      {/* Custom Development Section */}
      <section id="custom-development" className="py-16 relative">
        <SectionBackground variant="grid">
          <div className="container mx-auto">
            <SectionHeading
              badge="Custom Development"
              title="Custom Code Solutions"
              description="Full-stack development with modern technologies. Complex projects require custom solutions."
            />

            <div className="grid md:grid-cols-3 gap-8 mt-12 px-4 sm:px-0">
              {/* Small Project */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-8 border border-orange-200/50 dark:border-orange-800/50 shadow-lg"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Small Project</h3>
                  <div className="text-4xl font-bold text-orange-600 mb-2">$120</div>
                  <div className="text-slate-600 dark:text-slate-400">per hour</div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {[
                    'Bug fixes',
                    'Small feature additions',
                    'Code reviews',
                    'Simple integrations',
                    'Quick consultations'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" asChild>
                  <Link href="/#contact">
                    Get Started
                  </Link>
                </Button>
              </motion.div>

              {/* Medium Project */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-8 border-2 border-orange-500 shadow-xl scale-105"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Medium Project</h3>
                  <div className="text-4xl font-bold text-orange-600 mb-2">$140</div>
                  <div className="text-slate-600 dark:text-slate-400">per hour</div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {[
                    'Custom applications',
                    'API development',
                    'Database design',
                    'Complex integrations',
                    'Performance optimization'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" asChild>
                  <Link href="/#contact">
                    Get Started
                  </Link>
                </Button>
              </motion.div>

              {/* Large Project */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-8 border border-orange-200/50 dark:border-orange-800/50 shadow-lg"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Large Project</h3>
                  <div className="text-4xl font-bold text-orange-600 mb-2">$160</div>
                  <div className="text-slate-600 dark:text-slate-400">per hour</div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {[
                    'Full-stack applications',
                    'Enterprise solutions',
                    'Complex systems architecture',
                    'Team lead responsibilities',
                    'Long-term project management'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" asChild>
                  <Link href="/#contact">
                    Get Started
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Project Examples */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 grid md:grid-cols-2 gap-6"
            >
              <div className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-800/50">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Project Examples</h4>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>• E-commerce platforms</li>
                  <li>• Business management systems</li>
                  <li>• Mobile applications</li>
                  <li>• IoT and embedded systems</li>
                </ul>
              </div>
              <div className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-800/50">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Technologies</h4>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>• React/Next.js</li>
                  <li>• Vue.js/Django</li>
                  <li>• Node.js/Python</li>
                  <li>• Database design</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </SectionBackground>
      </section>

      {/* Electrical Services Section */}
      <section id="electrical" className="py-16 relative">
        <SectionBackground variant="diagonal">
          <div className="container mx-auto">
            <SectionHeading
              badge="Electrical Services"
              title="Licensed Electrical Work"
              description="Professional electrical services with transparent pricing. Rates vary based on job complexity and requirements."
            />

            <div className="grid md:grid-cols-2 gap-8 mt-12 px-4 sm:px-0">
              {/* Rate Information */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-8 border border-orange-200/50 dark:border-orange-800/50 shadow-lg"
              >
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">Hourly Rates</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Residential</span>
                    <span className="text-lg font-bold text-orange-600">From $85/hour*</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Commercial</span>
                    <span className="text-lg font-bold text-orange-600">From $95/hour*</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Industrial</span>
                    <span className="text-lg font-bold text-orange-600">From $110/hour*</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Emergency Callouts</span>
                    <span className="text-lg font-bold text-orange-600">From $120/hour*</span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 text-center">
                  *Rates vary based on job complexity, location, and materials required
                </p>
              </motion.div>

              {/* Services & Quote */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-8 border border-orange-200/50 dark:border-orange-800/50 shadow-lg"
              >
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">Services Offered</h3>
                
                <ul className="space-y-3 mb-8">
                  {[
                    'Smart home integration',
                    'Commercial installations',
                    'Industrial systems',
                    'Electrical maintenance',
                    'Safety inspections',
                    'Emergency repairs',
                    'New construction wiring',
                    'Renovation projects'
                  ].map((service) => (
                    <li key={service} className="flex items-center text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {service}
                    </li>
                  ))}
                </ul>

                <div className="text-center">
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Every job is unique. Get a personalized quote for your specific needs.
                  </p>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white" asChild>
                    <Link href="/#contact">
                      Request Electrical Quote
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </SectionBackground>
      </section>

      {/* Other Services Section */}
      <section id="other-services" className="py-16 relative">
        <SectionBackground variant="dots">
          <div className="container mx-auto">
            <SectionHeading
              badge="Additional Services"
              title="Other Professional Services"
              description="Comprehensive solutions beyond web development and electrical work."
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 px-4 sm:px-0">
              {/* Digital Marketing */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-800/50 shadow-lg"
              >
                <div className="text-center mb-4">
                  <Camera className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Digital Marketing</h3>
                  <div className="text-2xl font-bold text-orange-600 mb-2">From $800</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">per month</p>
                </div>
                
                <ul className="space-y-2 mb-6 text-sm text-slate-700 dark:text-slate-300">
                  <li>• SEO optimization</li>
                  <li>• Content creation</li>
                  <li>• Social media management</li>
                  <li>• Marketing strategies</li>
                </ul>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm" asChild>
                  <Link href="/#contact">
                    Get Started
                  </Link>
                </Button>
              </motion.div>

              {/* 3D Design & CAD */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-800/50 shadow-lg"
              >
                <div className="text-center mb-4">
                  <Palette className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">3D Design & CAD</h3>
                  <div className="text-2xl font-bold text-orange-600 mb-2">From $90</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">per hour</p>
                </div>
                
                <ul className="space-y-2 mb-6 text-sm text-slate-700 dark:text-slate-300">
                  <li>• Technical drawings</li>
                  <li>• 3D modeling (Blender)</li>
                  <li>• CAD designs</li>
                  <li>• AI-powered workflows</li>
                </ul>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm" asChild>
                  <Link href="/#contact">
                    Get Started
                  </Link>
                </Button>
              </motion.div>

              {/* Cybersecurity */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-800/50 shadow-lg"
              >
                <div className="text-center mb-4">
                  <Shield className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Cybersecurity</h3>
                  <div className="text-2xl font-bold text-orange-600 mb-2">From $150</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">per hour</p>
                </div>
                
                <ul className="space-y-2 mb-6 text-sm text-slate-700 dark:text-slate-300">
                  <li>• Security audits</li>
                  <li>• Penetration testing</li>
                  <li>• Network security</li>
                  <li>• Security consulting</li>
                </ul>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm" asChild>
                  <Link href="/#contact">
                    Get Started
                  </Link>
                </Button>
              </motion.div>

              {/* IT & Business Setup */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-800/50 shadow-lg"
              >
                <div className="text-center mb-4">
                  <Database className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">IT & Business Setup</h3>
                  <div className="text-2xl font-bold text-orange-600 mb-2">From $120</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">per hour</p>
                </div>
                
                <ul className="space-y-2 mb-6 text-sm text-slate-700 dark:text-slate-300">
                  <li>• Email setup</li>
                  <li>• Domain management</li>
                  <li>• Server configuration</li>
                  <li>• Business systems</li>
                </ul>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm" asChild>
                  <Link href="/#contact">
                    Get Started
                  </Link>
                </Button>
              </motion.div>

              {/* Embedded Systems */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-800/50 shadow-lg"
              >
                <div className="text-center mb-4">
                  <Microchip className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Embedded Systems</h3>
                  <div className="text-2xl font-bold text-orange-600 mb-2">From $100</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">per hour</p>
                </div>
                
                <ul className="space-y-2 mb-6 text-sm text-slate-700 dark:text-slate-300">
                  <li>• IoT solutions</li>
                  <li>• Raspberry Pi projects</li>
                  <li>• Arduino development</li>
                  <li>• Hardware integration</li>
                </ul>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm" asChild>
                  <Link href="/#contact">
                    Get Started
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </SectionBackground>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-3xl p-12 border border-orange-200/50 dark:border-orange-800/50"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
              Whether you need a simple website, custom development, or electrical work, 
              I&apos;m here to help bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-3" asChild>
                <Link href="/#contact" className="flex items-center">
                  Contact Me <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" className="border-orange-400/30 bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 text-lg px-8 py-3" asChild>
                <Link href="/#projects" className="flex items-center">
                  View My Work <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
                         </div>
           </motion.div>
         </div>
       </section>
         </div>
       </main>
       <Footer />
     </div>
   );
 }
