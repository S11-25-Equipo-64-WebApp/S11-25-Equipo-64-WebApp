"use client";

import Link from "next/link";

import { ModeToggle } from "@/components/ui/mode-toggle";

const navigation = [
  { label: "Inicio", href: "/" },
  { label: "Testimonios", href: "/testimonials" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Docs", href: "/docs" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-4 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-foreground transition hover:text-primary"
          >
            Testimonial CMS
          </Link>
          <span className="text-muted-foreground"> · Equipo 64 </span>
        </div>
        <nav aria-label="Primary" className="hidden items-center gap-4 text-sm text-muted-foreground md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1 font-medium text-foreground transition hover:bg-primary/10 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
