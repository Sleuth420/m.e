import Link from "next/link"
import { Github, Zap } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="flex items-center space-x-2">
            <div className="rounded-full bg-emerald-600 p-1">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="inline-block font-bold gradient-text">Ricky</span>
          </Link>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with ❤️ by{" "}
            <Link href="https://github.com/Sleuth420" target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-4">
              OakCodeAndTechSolutions
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="https://github.com/Sleuth420" target="_blank" rel="noopener noreferrer">
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}

