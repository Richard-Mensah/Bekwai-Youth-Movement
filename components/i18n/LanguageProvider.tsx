"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { I18N, type Lang } from "@/constants/i18n"

type Ctx = {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
  t: (key: string) => string
}

const LanguageContext = createContext<Ctx | null>(null)

const STORAGE_KEY = "bym-lang"

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en")

  // Hydrate the saved preference after mount (avoids SSR/CSR mismatch).
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === "en" || saved === "tw") setLangState(saved)
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      window.localStorage.setItem(STORAGE_KEY, l)
    } catch {
      // ignore storage failures (private mode etc.)
    }
  }, [])

  const toggle = useCallback(
    () => setLang(lang === "en" ? "tw" : "en"),
    [lang, setLang]
  )

  const t = useCallback(
    (key: string) => I18N[lang][key] ?? I18N.en[key] ?? key,
    [lang]
  )

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

/** Access the active language + translator. Safe to call outside the provider
 * (falls back to English) so individual components never crash. */
export function useLanguage(): Ctx {
  const ctx = useContext(LanguageContext)
  if (ctx) return ctx
  return {
    lang: "en",
    setLang: () => {},
    toggle: () => {},
    t: (key: string) => I18N.en[key] ?? key,
  }
}
