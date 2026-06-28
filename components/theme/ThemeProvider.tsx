"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"

export type Theme = "light" | "dark"

type Ctx = {
  theme: Theme
  setTheme: (t: Theme) => void
  toggle: () => void
}

const ThemeContext = createContext<Ctx | null>(null)

export const THEME_STORAGE_KEY = "bym-theme"

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
  root.style.colorScheme = theme
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Start as "light"; the inline no-flash script in <head> has already applied
  // the correct class before paint, so we re-read it after mount to sync state.
  const [theme, setThemeState] = useState<Theme>("light")

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setThemeState(isDark ? "dark" : "light")
  }, [])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    applyTheme(t)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, t)
    } catch {
      // ignore storage failures (private mode etc.)
    }
  }, [])

  const toggle = useCallback(
    () => setTheme(theme === "dark" ? "light" : "dark"),
    [theme, setTheme]
  )

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

/** Access the active theme. Safe to call outside the provider (defaults light). */
export function useTheme(): Ctx {
  const ctx = useContext(ThemeContext)
  if (ctx) return ctx
  return { theme: "light", setTheme: () => {}, toggle: () => {} }
}
