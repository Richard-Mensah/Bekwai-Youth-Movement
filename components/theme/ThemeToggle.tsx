"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme/ThemeProvider"
import { cn } from "@/lib/utils"

/** Sun/moon toggle for the canopy-night dark theme. */
export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid an icon-mismatch flash: render a neutral placeholder until mounted.
  useEffect(() => setMounted(true), [])

  const isDark = theme === "dark"

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full text-canopy transition-colors hover:bg-canopy-50 dark:text-paper dark:hover:bg-white/10",
        className
      )}
    >
      {mounted && isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
