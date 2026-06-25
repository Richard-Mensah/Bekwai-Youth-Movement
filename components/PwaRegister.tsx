"use client"

import { useEffect } from "react"

/** Registers the service worker for PWA installability (production only). */
export default function PwaRegister() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return
    }
    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {})
    }
    window.addEventListener("load", onLoad)
    return () => window.removeEventListener("load", onLoad)
  }, [])

  return null
}
