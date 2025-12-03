"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, MessageSquareQuote, X } from "lucide-react";
import Link from "next/link";

import { ModeToggle } from "@/components/ui/mode-toggle";

const navigation = [
  { label: "Inicio", href: "/" },
  { label: "Testimonios", href: "/testimonials" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Docs", href: "/docs" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const menuId = "mobile-nav";

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeydown);
    }

    return () => window.removeEventListener("keydown", handleKeydown);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-4 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground transition hover:text-primary"
          >
            <MessageSquareQuote className="h-5 w-5" aria-hidden="true" />
            Testimonial CMS
          </Link>
          <span className="text-muted-foreground"> · Equipo 64 </span>
        </div>
        <nav
          aria-label="Primary"
          className="hidden items-center gap-4 text-sm text-muted-foreground md:flex"
        >
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
          <button
            type="button"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-controls={menuId}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            ref={toggleRef}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-primary/10 hover:text-primary md:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <ModeToggle />
        </div>
      </div>
      {isOpen ? (
        <div className="relative md:hidden">
          <div
            id={menuId}
            className="absolute right-4 top-2 w-56 rounded-xl border border-border bg-background/95 p-3 shadow-lg backdrop-blur transition duration-150 ease-out"
          >
            <nav aria-label="Mobile primary" className="flex flex-col gap-2 text-sm font-medium">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-2 text-foreground transition hover:bg-primary/10 hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
