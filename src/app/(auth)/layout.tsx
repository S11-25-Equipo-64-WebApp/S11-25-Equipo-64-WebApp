import type { Metadata } from "next"

import Image from "next/image"

import { AuthBodyClass } from "@/components/auth-body-class"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Autenticación · Testimonial CMS",
  description: "Inicia sesión o crea una cuenta para acceder al dashboard.",
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <AuthBodyClass />
      <div className="relative min-h-[100svh] w-full">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/random/1920x1080?auto=format&fit=crop&w=1920&q=80&sat=-20"
            alt="Fondo suave para la pantalla de autenticación"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/70 via-slate-100/50 to-slate-50/80 dark:from-slate-950/40 dark:via-slate-950/70 dark:to-slate-950/90" />
        </div>
        <div className="flex min-h-[100svh] w-full items-center justify-center px-4 py-12 sm:px-6">
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="absolute left-4 top-4 rounded-full border border-white/20 bg-background/60 px-3 py-1 text-sm text-foreground shadow-lg shadow-black/30 backdrop-blur-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:left-6 sm:top-6"
          >
            <Link href="/">Volver</Link>
          </Button>
          <div className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-background/70 p-1 backdrop-blur-xl sm:right-6 sm:top-6">
            <ModeToggle />
          </div>
          <div className="w-full max-w-3xl">{children}</div>
        </div>
      </div>
    </>
  )
}
