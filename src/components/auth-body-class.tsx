"use client"

import { useEffect } from "react"

export function AuthBodyClass() {
  useEffect(() => {
    const className = "auth-layout"
    document.body.classList.add(className)

    return () => {
      document.body.classList.remove(className)
    }
  }, [])

  return null
}
