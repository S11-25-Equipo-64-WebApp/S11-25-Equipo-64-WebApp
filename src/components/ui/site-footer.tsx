"use client";

import Link from "next/link";

import { Logo } from "@/components/branding/Logo";

const footerNav = [
  {
    title: "Producto",
    links: [
      { label: "Cómo funciona", href: "#features" },
      { label: "Implementación", href: "#cta" },
      { label: "Comenzar", href: "/signup" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Dashboard", href: "/login" },
      { label: "Acerca de", href: "/about" },
    ],
  },
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-linear-to-b from-neutral-900 to-neutral-950 px-4 text-neutral-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4 md:max-w-xl">
            <Logo size="sm" className="text-white" labelClassName="text-white" />
            <p className="text-sm text-neutral-400">
              La plataforma más simple para recopilar, moderar y compartir testimonios con tu
              equipo. Integraciones rápidas, roles claros y una experiencia pensada para marketing.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:gap-10">
            {footerNav.map((section) => (
              <div key={section.title} className="space-y-3">
                <h3 className="text-sm font-semibold text-white">{section.title}</h3>
                <div className="flex flex-col gap-2 text-sm text-neutral-400">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Legal</h3>
              <div className="flex flex-col gap-2 text-sm text-neutral-400">
                <Link href="/privacy" className="transition hover:text-white">
                  Privacidad
                </Link>
                <Link href="/terms-of-service" className="transition hover:text-white">
                  Términos
                </Link>
                <Link href="/docs" className="transition hover:text-white">
                  Documentación
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-neutral-800 pt-6 text-sm text-neutral-400 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} Testimonial CMS · Equipo 64 · Hecho con amor por Davis, Rel, Noemi y Jako</p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
              Listo para producción
            </span>
            <span className="text-xs">Modo oscuro y claro con un clic</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
