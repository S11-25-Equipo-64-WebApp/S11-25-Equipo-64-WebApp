"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/branding/Logo";
import { Button } from "@/components/ui/Button";
import { ModeToggle } from "@/components/ui/mode-toggle";

const navigation = [
  { label: "Cómo funciona", href: "#features" },
  { label: "Implementación", href: "#cta" },
  { label: "Acerca", href: "/about" },
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
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
            Equipo 64 · Testimonial CMS
          </span>
        </div>
        <nav
          aria-label="Primary"
          className="hidden items-center gap-3 text-sm font-medium text-muted-foreground md:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-foreground transition hover:bg-primary/10 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <ModeToggle />
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition hover:text-primary"
            >
              Iniciar sesión
            </Link>
            <Button asChild size="sm" className="shadow-sm shadow-primary/15">
              <Link href="/signup">Crear cuenta</Link>
            </Button>
          </div>
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
          <div className="md:hidden">
            <ModeToggle />
          </div>
        </div>
      </div>
      {isOpen ? (
        <div className="md:hidden">
          <div
            id={menuId}
            className="mx-4 mb-4 rounded-2xl border border-border bg-background/95 p-4 shadow-lg backdrop-blur transition duration-150 ease-out"
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
            <div className="mt-4 flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href="/signup">Crear cuenta</Link>
              </Button>
              <Button asChild variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                <Link href="/login">Iniciar sesión</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
