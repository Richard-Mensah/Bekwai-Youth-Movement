"use client"

import { Languages } from "lucide-react"
import { LANGUAGES } from "@/constants/i18n"
import { useLanguage } from "@/components/i18n/LanguageProvider"
import { cn } from "@/lib/utils"

/** Compact EN / TW switch. */
export default function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage()
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-canopy/15 bg-white p-0.5 dark:border-white/15 dark:bg-canopy-800",
        className
      )}
      role="group"
      aria-label="Language"
    >
      <Languages size={15} className="ml-1.5 text-ink/45 dark:text-paper/45" aria-hidden />
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
            lang === l.code
              ? "bg-canopy text-white dark:bg-gold-500 dark:text-canopy-900"
              : "text-ink/55 hover:text-canopy dark:text-paper/55 dark:hover:text-paper"
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
