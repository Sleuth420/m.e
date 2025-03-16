"use client"

import Link from "next/link"
import { ExternalLink, Github, Code2, Store, Zap, Heart, Database, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface ProjectLink {
  type: "github" | "external"
  label: string
  url: string
}

interface Project {
  title: string
  description: string
  image: string
  links: ProjectLink[]
}

interface ProjectCardProps {
  project: Project
  index: number
}

const getProjectIcon = (title: string) => {
  if (title.toLowerCase().includes("electrician")) return Zap
  if (title.toLowerCase().includes("glazey")) return Store
  if (title.toLowerCase().includes("electrovision")) return Code2
  if (title.toLowerCase().includes("reaching out")) return Heart
  if (title.toLowerCase().includes("pokedex")) return Database
  if (title.toLowerCase().includes("cybersecurity")) return Shield
  return Code2
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  }

  const ProjectIcon = getProjectIcon(project.title)

  return (
    <motion.div
      variants={item}
      className="group relative flex flex-col overflow-hidden rounded-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-lg shadow-emerald-100/20 dark:shadow-emerald-900/10 transition-all duration-500 hover:-translate-y-2 border border-slate-200 dark:border-slate-700"
    >
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-emerald-400 to-emerald-600 dark:from-emerald-600 dark:to-emerald-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ProjectIcon className="w-12 h-12 text-white/90" strokeWidth={1.5} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-slate-900"></div>
      </div>
      <div className="flex flex-col flex-grow p-6 -mt-8 relative">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{project.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 flex-grow">{project.description}</p>
        <div className="flex gap-2">
          {project.links.map((link, i) =>
            link.type === "github" ? (
              <Button key={i} variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700" asChild>
                <Link href={link.url} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            ) : (
              <Button key={i} variant="outline" size="sm" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-950/30" asChild>
                <Link href={link.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            ),
          )}
        </div>
      </div>
    </motion.div>
  )
}

