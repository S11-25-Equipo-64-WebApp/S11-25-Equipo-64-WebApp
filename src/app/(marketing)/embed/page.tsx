import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Code, Palette, Share2, SlidersHorizontal, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/Button";

type SampleTestimonial = {
  name: string;
  role: string;
  quote: string;
  badge: string;
};

type ConfigOption = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const sampleTestimonials: SampleTestimonial[] = [
  {
    name: "Ana Ruiz",
    role: "CMO · SaaS B2B",
    quote: "Centralizamos testimonios de clientes y los compartimos en minutos con el equipo de ventas.",
    badge: "Video",
  },
  {
    name: "Luis Torres",
    role: "Founder · Ecommerce",
    quote: "Los embeds son ligeros, responsivos y no requieren soporte técnico para actualizar el contenido.",
    badge: "Texto",
  },
  {
    name: "Camila Vega",
    role: "Marketing Lead · Fintech",
    quote: "Aprobamos, editamos y publicamos desde un solo panel con roles de Admin y Editor.",
    badge: "Imagen",
  },
];

const configOptions: ConfigOption[] = [
  {
    title: "Tema y colores",
    description: "Usa theme=light|dark para adaptarte al modo del sitio y mantener coherencia visual.",
    icon: Palette,
  },
  {
    title: "Autoplay y navegación",
    description: "Controla animaciones con autoplay=true|false y navigation=true|false.",
    icon: Sparkles,
  },
  {
    title: "Formato flexible",
    description: "Alterna carousel o grid con type=carousel|grid y ajusta columnas con columns=1-4.",
    icon: SlidersHorizontal,
  },
  {
    title: "URLs seguras",
    description: "Embeds preparados para compartir sin exponer credenciales ni datos sensibles.",
    icon: Share2,
  },
];

const embedSnippet = `<iframe
  src="https://app.testimonialcms.com/embed?project=PROJECT_ID&type=carousel&theme=light&autoplay=true&navigation=true"
  loading="lazy"
  style="border:0;width:100%;height:520px;border-radius:12px;"
  allow="autoplay; clipboard-write"
></iframe>`;

export default function Page() {
  return (
    <div className="flex flex-col gap-12">
      <header className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Embeds</p>
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">Incrusta testimonios en tu sitio</h1>
        <p className="text-lg text-muted-foreground">
          Obtén un iframe ajustable con autoplay, navegación y columnas para mostrar prueba social donde la necesites.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/signup">Crear proyecto</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/about">Ver cómo funciona</Link>
          </Button>
        </div>
      </header>

      <section className="rounded-2xl border border-border bg-card/70 p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-foreground">Vista previa en grid</h2>
            <p className="text-sm text-muted-foreground">Listo para colocar en tu landing, blog o página de producto.</p>
          </div>
          <div className="ml-auto hidden items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-semibold text-primary sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Tiempo real
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {sampleTestimonials.map((testimonial) => {
            const initials = testimonial.name
              .split(" ")
              .map((part) => part.charAt(0))
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={testimonial.name}
                className="flex h-full flex-col justify-between gap-4 rounded-xl border border-border bg-background/80 p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {initials}
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                  <span className="ml-auto rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {testimonial.badge}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">{testimonial.quote}</p>

                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                  Curado en el panel de marketing
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-6 shadow-sm dark:bg-primary/10 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Snippet listo para usar</h3>
          <p className="text-sm text-muted-foreground">
            Copia y pega el iframe en tu CMS favorito. Personaliza los parámetros y mantén los testimonios actualizados
            sin tocar código.
          </p>

          <pre className="whitespace-pre-wrap rounded-xl border border-border bg-background/80 p-4 text-sm text-foreground shadow-sm">
            {embedSnippet}
          </pre>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/signup">Crear cuenta gratuita</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard">Abrir dashboard</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Ajustes rápidos</h3>
          <p className="text-sm text-muted-foreground">
            Controla el comportamiento del embed desde la URL sin agregar dependencias adicionales.
          </p>

          <div className="grid gap-3">
            {configOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div key={option.title} className="flex gap-3 rounded-xl border border-border bg-card/70 p-4 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{option.title}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card/80 p-6 text-center shadow-sm">
        <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          <Code className="h-4 w-4" aria-hidden="true" />
          Copia y publica
        </div>
        <p className="text-xl font-semibold text-foreground">Embeds sin esfuerzo para tu equipo de marketing</p>
        <p className="text-sm text-muted-foreground">
          Reutiliza tus testimonios en landing pages, formularios de lead-gen y artículos sin pedir ayuda al equipo de
          desarrollo.
        </p>
      </section>
    </div>
  );
}
