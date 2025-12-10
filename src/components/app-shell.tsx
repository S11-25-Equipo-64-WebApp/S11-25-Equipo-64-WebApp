"use client"

import { ReactNode } from "react"
import { useSelectedLayoutSegments } from "next/navigation"

import { SiteFooter } from "@/components/ui/site-footer"
import { SiteHeader } from "@/components/ui/site-header"

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const segments = useSelectedLayoutSegments()
  const isAuthRoute = segments[0] === "(auth)"

  return (
    <div className="flex min-h-screen flex-col">
      {!isAuthRoute && <SiteHeader />}
      <main
        className={`flex-1 ${isAuthRoute ? "px-0 py-0" : "px-4 py-10"} transition-colors`}
      >
        <div
          className={`mx-auto flex w-full flex-col gap-6 ${
            isAuthRoute ? "max-w-full" : "max-w-6xl"
          }`}
        >
          {children}
        </div>
      </main>
      {!isAuthRoute && <SiteFooter />}
    </div>
  )
}
