"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Search, CornerDownLeft, ArrowUp, ArrowDown } from "lucide-react"
import { PUBLIC_NAV, isDropdown } from "@/constants/nav"
import { cn } from "@/lib/utils"

type Command = { label: string; href: string; group: string }

/** Flatten the primary nav (incl. dropdown children) + homepage section jumps. */
function buildCommands(): Command[] {
  const fromNav: Command[] = PUBLIC_NAV.flatMap((item) =>
    isDropdown(item)
      ? item.children.map((c) => ({ label: c.label, href: c.href, group: item.label }))
      : [{ label: item.label, href: item.href, group: "Pages" }]
  )
  const actions: Command[] = [
    { label: "Join the Movement", href: "/join", group: "Actions" },
    { label: "Sign in", href: "/login", group: "Actions" },
    { label: "Contact us", href: "/contact", group: "Actions" },
  ]
  // De-duplicate by href+label.
  const seen = new Set<string>()
  return [...fromNav, ...actions].filter((c) => {
    const key = c.href + c.label
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

type Ctx = { open: () => void; close: () => void; toggle: () => void; isOpen: boolean }
const CommandPaletteContext = createContext<Ctx | null>(null)

export function useCommandPalette(): Ctx {
  const ctx = useContext(CommandPaletteContext)
  if (ctx) return ctx
  return { open: () => {}, close: () => {}, toggle: () => {}, isOpen: false }
}

export default function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((v) => !v), [])

  const commands = useMemo(buildCommands, [])
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q)
    )
  }, [commands, query])

  // Global ⌘K / Ctrl+K listener.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [toggle])

  // Reset + focus when opening; lock body scroll while open.
  useEffect(() => {
    if (!isOpen) return
    setQuery("")
    setActive(0)
    const id = window.setTimeout(() => inputRef.current?.focus(), 20)
    document.body.style.overflow = "hidden"
    return () => {
      window.clearTimeout(id)
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Keep the highlighted row valid as results shrink.
  useEffect(() => {
    setActive((a) => Math.min(a, Math.max(0, results.length - 1)))
  }, [results.length])

  const go = useCallback(
    (cmd: Command | undefined) => {
      if (!cmd) return
      close()
      router.push(cmd.href)
    },
    [close, router]
  )

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault()
      close()
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive((a) => (a + 1) % Math.max(1, results.length))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((a) => (a - 1 + results.length) % Math.max(1, results.length))
    } else if (e.key === "Enter") {
      e.preventDefault()
      go(results[active])
    }
  }

  return (
    <CommandPaletteContext.Provider value={{ open, close, toggle, isOpen }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-start justify-center bg-canopy-900/80 p-4 pt-[12vh] backdrop-blur-sm"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="w-full max-w-xl overflow-hidden rounded-2xl border border-canopy/10 bg-white shadow-card-hover dark:border-white/10 dark:bg-canopy-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 border-b border-canopy/10 px-4 dark:border-white/10">
                <Search size={18} className="shrink-0 text-ink/40 dark:text-paper/40" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKey}
                  placeholder="Search pages and actions…"
                  className="h-14 w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink/40 dark:text-paper dark:placeholder:text-paper/40"
                  aria-label="Search"
                />
              </div>

              <ul className="max-h-[50vh] overflow-y-auto p-2">
                {results.length === 0 && (
                  <li className="px-3 py-6 text-center text-sm text-ink/50 dark:text-paper/50">
                    No matches for “{query}”
                  </li>
                )}
                {results.map((c, i) => (
                  <li key={c.href + c.label}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(c)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                        i === active
                          ? "bg-canopy text-paper"
                          : "text-ink/80 hover:bg-canopy-50 dark:text-paper/80 dark:hover:bg-white/5"
                      )}
                    >
                      <span className="font-medium">{c.label}</span>
                      <span
                        className={cn(
                          "text-xs",
                          i === active ? "text-paper/70" : "text-ink/40 dark:text-paper/40"
                        )}
                      >
                        {c.group}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-4 border-t border-canopy/10 px-4 py-2.5 text-[11px] text-ink/45 dark:border-white/10 dark:text-paper/45">
                <span className="inline-flex items-center gap-1">
                  <ArrowUp size={12} />
                  <ArrowDown size={12} /> navigate
                </span>
                <span className="inline-flex items-center gap-1">
                  <CornerDownLeft size={12} /> open
                </span>
                <span className="ml-auto inline-flex items-center gap-1">esc to close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </CommandPaletteContext.Provider>
  )
}
