"use client"

import { Shield, Wrench, Code } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function AboutSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section id="about" className="container space-y-6 py-8 md:py-12 lg:py-24 relative">
      {/* Modern gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-slate-950/10 dark:bg-slate-950/90" />
        <div className="absolute inset-0 bg-gradient-to-tl from-emerald-500/10 via-transparent to-emerald-500/10 dark:from-emerald-500/20 dark:via-transparent dark:to-emerald-500/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_0%_200px,rgba(16,185,129,0.15),transparent)] dark:bg-[radial-gradient(circle_800px_at_0%_200px,rgba(16,185,129,0.3),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_800px,rgba(16,185,129,0.15),transparent)] dark:bg-[radial-gradient(circle_800px_at_100%_800px,rgba(16,185,129,0.3),transparent)]" />
      </div>

      {/* Animated dot pattern */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `radial-gradient(rgba(16, 185, 129, 0.07) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }}
      />

      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200"
        >
          Who I Am
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold gradient-text"
        >
          About Me
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7"
        >
          I bring a unique blend of skills as both a licensed electrician and a passionate developer. This dual
          expertise allows me to create innovative solutions that bridge the gap between electrical systems and digital
          technologies.
        </motion.p>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3"
      >
        <motion.div variants={item}>
          <Card className="overflow-hidden border-0 shadow-lg shadow-emerald-100/30 dark:shadow-emerald-900/20 hover:shadow-emerald-200/40 dark:hover:shadow-emerald-800/30 transition-all duration-300 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm h-full">
            <CardContent className="flex flex-col items-center justify-center p-6 h-full">
              <div className="mb-4 rounded-full gradient-bg p-4">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Web Development</h3>
              <p className="text-center text-sm text-slate-600 dark:text-slate-300 mt-2">
                Vue.js, React, Django, WordPress, Shopify
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="overflow-hidden border-0 shadow-lg shadow-emerald-100/30 dark:shadow-emerald-900/20 hover:shadow-emerald-200/40 dark:hover:shadow-emerald-800/30 transition-all duration-300 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm h-full">
            <CardContent className="flex flex-col items-center justify-center p-6 h-full">
              <div className="mb-4 rounded-full gradient-bg p-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Cybersecurity</h3>
              <p className="text-center text-sm text-slate-600 dark:text-slate-300 mt-2">
                Network Security, Penetration Testing, Secure Coding
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="overflow-hidden border-0 shadow-lg shadow-emerald-100/30 dark:shadow-emerald-900/20 hover:shadow-emerald-200/40 dark:hover:shadow-emerald-800/30 transition-all duration-300 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm h-full">
            <CardContent className="flex flex-col items-center justify-center p-6 h-full">
              <div className="mb-4 rounded-full gradient-bg p-4">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Electrical</h3>
              <p className="text-center text-sm text-slate-600 dark:text-slate-300 mt-2">
                Licensed Electrician, Industrial Systems, Smart Home Integration
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mx-auto text-center md:max-w-[58rem]"
      >
        <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          My background as an electrician gives me a unique perspective on technology projects, especially those
          involving IoT, embedded systems, and industrial applications.
        </p>
      </motion.div>
    </section>
  )
}

