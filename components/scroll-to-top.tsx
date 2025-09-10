"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Scroll al top cuando cambie la ruta
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
