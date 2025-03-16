"use client"

import type React from "react"

import Link from "next/link"
import { Zap } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useState } from "react"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll event to add shadow when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Smooth scroll function for navigation links
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow duration-300 ${isScrolled ? "shadow-md" : ""}`}
    >
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <div className="rounded-full bg-emerald-600 p-1">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="inline-block font-bold gradient-text">Ricky</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link
              href="#about"
              onClick={(e) => scrollToSection(e, "about")}
              className="hidden px-4 py-2 text-sm font-medium transition-colors hover:text-emerald-600 sm:inline-block"
            >
              About
            </Link>
            <Link
              href="#projects"
              onClick={(e) => scrollToSection(e, "projects")}
              className="hidden px-4 py-2 text-sm font-medium transition-colors hover:text-emerald-600 sm:inline-block"
            >
              Projects
            </Link>
            <Link
              href="#contact"
              onClick={(e) => scrollToSection(e, "contact")}
              className="hidden px-4 py-2 text-sm font-medium transition-colors hover:text-emerald-600 sm:inline-block"
            >
              Contact
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}

