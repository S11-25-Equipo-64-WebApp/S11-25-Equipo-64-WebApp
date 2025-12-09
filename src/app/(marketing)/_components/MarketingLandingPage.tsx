import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Settings, Share2, Upload, Users } from "lucide-react";

import { Button } from "@/components/ui/Button";

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
};

const highlights = [
  {
    title: "Admin y Editor",
    description: "Permisos claros para mantener tus testimonios ordenados.",
  },
  {
    title: "Multimedia",
    description: "Texto, imágenes y video sin procesos complicados.",
  },
  {
    title: "Embeds rápidos",
    description: "Comparte prueba social en minutos con iframes responsivos.",
  },
] as const;

const features: Feature[] = [
  {
    title: "Captura fácil",
    description: "Formularios personalizados para texto, imagen y video.",
    icon: Upload,
    accent: "from-primary/40 via-primary/20 to-primary/10",
  },
  {
    title: "Gestión total",
    description: "Organiza, aprueba y edita desde un panel simple.",
    icon: Settings,
    accent: "from-secondary/50 via-primary/20 to-secondary/10",
  },
  {
    title: "Trabajo en equipo",
    description: "Roles de Admin y Editor listos para colaborar.",
    icon: Users,
    accent: "from-emerald-500/40 via-primary/20 to-emerald-200/20",
  },
  {
    title: "Integración simple",
    description: "Embeds listos para compartir en tu sitio.",
    icon: Share2,
    accent: "from-blue-500/30 via-primary/20 to-indigo-400/20",
  },
];

export function MarketingLandingPage() {
  return (
    <div className="flex flex-col gap-16 lg:gap-24">
      <section className="relative isolate -mx-4 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-secondary/20 to-emerald-50 px-6 py-16 shadow-[0_25px_80px_-24px_rgba(0,0,0,0.25)] dark:from-primary/15 dark:via-background/60 dark:to-slate-900 sm:px-10">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute left-[-120px] bottom-[-160px] h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute right-[-100px] top-[-140px] h-72 w-72 rounded-full bg-secondary/40 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground shadow-sm backdrop-blur">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            Suite de marketing para testimonios
          </div>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            Recopila y gestiona testimonios sin complicaciones
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Plataforma de contenido para equipos que necesitan crear, moderar y compartir testimonios con texto,
            imágenes o videos. Diseñada para Admins y Editores.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/signup">
                Comenzar gratis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Conoce la misión</Link>
            </Button>
          </div>

          <div className="grid w-full grid-cols-1 gap-4 rounded-2xl border border-border/80 bg-background/70 p-4 shadow-sm backdrop-blur sm:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-xl bg-muted/50 p-4 text-left shadow-sm">
                <p className="text-sm font-semibold text-primary">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">¿Cómo funciona?</p>
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">Tres pasos simples</h2>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Captura, organiza y comparte sin depender de herramientas complejas.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 transition duration-300 group-hover:opacity-100`}
                />

                <div className="relative flex flex-col gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center shadow-sm dark:bg-primary/10">
          <h3 className="text-2xl font-semibold text-foreground">Embeds listos para tu web</h3>
          <p className="text-lg text-muted-foreground">
            Comparte prueba social en minutos con iframes responsivos y paletas adaptadas al tema.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/embed">Ver embed en vivo</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard">Ir al dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
