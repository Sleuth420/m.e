"use client"

import type React from "react"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

// Predefined positions for particles to avoid hydration mismatches
const particles = [
  { x: 20, y: 80, scale: 0.6, duration: 25 },
  { x: 80, y: 20, scale: 0.8, duration: 28 },
  { x: 40, y: 60, scale: 0.7, duration: 22 },
  { x: 60, y: 40, scale: 0.9, duration: 24 },
  { x: 10, y: 30, scale: 0.5, duration: 26 },
  { x: 90, y: 70, scale: 0.7, duration: 23 },
  { x: 30, y: 90, scale: 0.8, duration: 27 },
  { x: 70, y: 50, scale: 0.6, duration: 29 },
  { x: 50, y: 10, scale: 0.9, duration: 21 },
  { x: 25, y: 75, scale: 0.7, duration: 25 },
  { x: 75, y: 25, scale: 0.8, duration: 28 },
  { x: 35, y: 65, scale: 0.6, duration: 22 },
  { x: 65, y: 35, scale: 0.9, duration: 24 },
  { x: 15, y: 85, scale: 0.5, duration: 26 },
  { x: 85, y: 15, scale: 0.7, duration: 23 }
]

export default function HeroSection() {
  // Smooth scroll function for CTA buttons
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-900">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1%_1%,_#3b82f6_0%,_transparent_25%,_transparent_100%)] animate-rotate-slow"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_99%_99%,_#10b981_0%,_transparent_25%,_transparent_100%)] animate-rotate-slow-reverse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_99%_1%,_#6366f1_0%,_transparent_25%,_transparent_100%)] animate-rotate-slow"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1%_99%,_#14b8a6_0%,_transparent_25%,_transparent_100%)] animate-rotate-slow-reverse"></div>

      {/* Noise texture */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Geometric shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-emerald-500/10 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]" aria-hidden="true">
          <defs>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M.5 24V.5H24" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth="0" fill="url(#grid)" />
          <svg x="50%" y="-1" className="overflow-visible fill-emerald-500/20">
            <path d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z" strokeWidth="0" />
          </svg>
          <rect width="100%" height="100%" strokeWidth="0" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 -z-10">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-emerald-500/20"
            initial={{ x: `${particle.x}%`, y: `${particle.y}%`, scale: particle.scale }}
            animate={{
              x: [`${particle.x}%`, `${(particle.x + 20) % 100}%`],
              y: [`${particle.y}%`, `${(particle.y + 20) % 100}%`],
              scale: [particle.scale, particle.scale * 1.2, particle.scale],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container relative flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-full bg-emerald-100/10 px-3 py-1 text-sm text-emerald-200 ring-1 ring-emerald-300/20"
        >
          Developer - Electrician - Friend
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl !leading-tight text-white"
        >
          Hi, I'm Ricky
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-[42rem] leading-normal text-slate-300 sm:text-xl sm:leading-8"
        >
          Full-stack developer at{" "}
          <span className="font-semibold text-emerald-400">OakCodeAndTechSolutions</span>,
          combining electrical expertise with modern web development and software engineering.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-4"
        >
          <Button
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            asChild
          >
            <Link href="#projects" onClick={(e) => scrollToSection(e, "projects")}>
              View My Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="border-emerald-400/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200 hover:border-emerald-400/40"
            asChild
          >
            <Link href="#contact" onClick={(e) => scrollToSection(e, "contact")}>
              Contact Me
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

