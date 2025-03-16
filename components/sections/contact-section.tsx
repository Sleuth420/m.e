"use client"

import Link from "next/link"
import { Mail, MapPin, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function ContactSection() {
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
    <section id="contact" className="container py-16 md:py-24 lg:py-32 relative">
      {/* Modern gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-slate-950/10 dark:bg-slate-950/90" />
        <div className="absolute inset-0 bg-gradient-to-bl from-emerald-500/10 via-transparent to-emerald-500/10 dark:from-emerald-500/20 dark:via-transparent dark:to-emerald-500/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_0%,rgba(16,185,129,0.15),transparent)] dark:bg-[radial-gradient(circle_800px_at_50%_0%,rgba(16,185,129,0.3),transparent)]" />
      </div>

      {/* Animated grid pattern */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(16, 185, 129, 0.07) 1px, transparent 1px),
            linear-gradient(-45deg, rgba(16, 185, 129, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
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
          Contact
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold gradient-text"
        >
          Get in Touch
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7"
        >
          Whether you need a developer, an electrician, or someone who understands both worlds, I'm here to help.
        </motion.p>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto grid gap-8 sm:grid-cols-2 md:max-w-[64rem] mt-12"
      >
        <motion.div variants={item}>
          <Card className="overflow-hidden border-0 shadow-lg shadow-emerald-100/30 dark:shadow-emerald-900/20 hover:shadow-emerald-200/40 dark:hover:shadow-emerald-800/30 transition-all duration-300 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm h-full">
            <CardContent className="flex flex-col items-center gap-4 p-6 h-full">
              <div className="rounded-full gradient-bg p-4 mb-2">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Email Me</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">oakcodeandtechsolutions@gmail.com</p>
              <Button
                className="w-full gradient-bg hover:bg-gradient-to-r hover:from-emerald-700 hover:to-green-800 transition-all duration-300 mt-4"
                asChild
              >
                <Link href="mailto:oakcodeandtechsolutions@gmail.com">Send Email</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="overflow-hidden border-0 shadow-lg shadow-emerald-100/30 dark:shadow-emerald-900/20 hover:shadow-emerald-200/40 dark:hover:shadow-emerald-800/30 transition-all duration-300 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm h-full">
            <CardContent className="flex flex-col items-center gap-4 p-6 h-full">
              <div className="rounded-full gradient-bg p-4 mb-2">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Connect</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Melbourne, Australia</p>
              <div className="flex gap-4">
                <Link href="https://github.com/Sleuth420" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  )
}

