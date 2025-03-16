"use client"
import { motion } from "framer-motion"
import { ProjectCard } from "@/components/ui/project-card"

export default function ProjectsSection() {
  const projects = [
    {
      title: "Electrician Management App",
      description:
        "A Vue.js + Django REST full-stack application for electricians to manage jobs, streamline on-site calculations and repetitive day-to-day tasks.",
      image: "/placeholder.svg?height=400&width=600",
      links: [{ type: "github" as const, label: "In Progress", url: "#" }],
    },
    {
      title: "Glazey.com",
      description:
        "Collaborated on this Shopify-based jewellery online store, implementing custom features and optimizing the checkout process.",
      image: "/placeholder.svg?height=400&width=600",
      links: [{ type: "external" as const, label: "Visit Site", url: "https://glazeyjewellery.com" }],
    },
    {
      title: "Electrovision Australia",
      description:
        "Developed a website for this electrical contracting business, showcasing services and enabling online quote requests.",
      image: "/placeholder.svg?height=400&width=600",
      links: [{ type: "external" as const, label: "Visit Site", url: "#" }],
    },
    {
      title: "Reaching Out In The Inner West",
      description:
        "WordPress website for a Melbourne-based non-profit organization, featuring donation integration and event management.",
      image: "/placeholder.svg?height=400&width=600",
      links: [{ type: "external" as const, label: "Visit Site", url: "https://reachingoutintheinnerwestofmelbourne.com.au" }],
    },
    {
      title: "ZegaMame Pokedex",
      description:
        "Python-Tkinter Pokedex application built on a ZegaMame board with custom Linux ROM, showcasing embedded systems skills and a passion for retro gaming.",
      image: "/placeholder.svg?height=400&width=600",
      links: [{ type: "github" as const, label: "Code", url: "https://github.com/Sleuth420/Python-Tkinter-Pokedex" }],
    },
    // {
    //   title: "Cybersecurity Resources",
    //   description:
    //     "A collection of cybersecurity tools, articles, and resources I've developed to help others learn about security best practices.",
    //   image: "/placeholder.svg?height=400&width=600",
    //   links: [{ type: "github" as const, label: "Repository", url: "#" }],
    // },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <section id="projects" className="container py-16 md:py-24 lg:py-32 relative">
      {/* Modern gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-slate-950/10 dark:bg-slate-950/90" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-500/10 dark:from-emerald-500/20 dark:via-transparent dark:to-emerald-500/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(16,185,129,0.15),transparent)] dark:bg-[radial-gradient(circle_800px_at_100%_200px,rgba(16,185,129,0.3),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_0%_800px,rgba(16,185,129,0.15),transparent)] dark:bg-[radial-gradient(circle_800px_at_0%_800px,rgba(16,185,129,0.3),transparent)]" />
      </div>

      {/* Animated grid pattern */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(16, 185, 129, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }}
      />

      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200"
        >
          My Work
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold gradient-text"
        >
          Projects
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 mb-8"
        >
          Here are some of the projects I've worked on that showcase my diverse skill set.
        </motion.p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto grid justify-center gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8 max-w-7xl"
      >
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} index={index} />
        ))}
      </motion.div>
    </section>
  )
}

