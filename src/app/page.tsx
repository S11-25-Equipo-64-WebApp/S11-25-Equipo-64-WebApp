import type { ElementType } from "react";
import Link from "next/link";
import { ArrowRight, Settings, Share2, Upload, Users } from "lucide-react";

import { Button } from "@/components/ui/Button";

type Feature = {
  title: string;
  description: string;
  icon: ElementType;
  accent: string;
  glow: string;
};

const features: Feature[] = [
  {
    title: "Captura fácil",
    description: "Formularios listos para texto, imagen o video con moderación al instante.",
    icon: Upload,
    accent: "from-[#5b5be8] to-[#7c3aed]",
    glow: "from-[#5b5be8]/20",
  },
  {
    title: "Gestión total",
    description: "Organiza, aprueba y edita desde un panel seguro pensado para marketing.",
    icon: Settings,
    accent: "from-[#a855f7] to-[#c084fc]",
    glow: "from-[#a855f7]/20",
  },
  {
    title: "Trabajo en equipo",
    description: "Roles de Admin y Editor para colaborar sin perder control editorial.",
    icon: Users,
    accent: "from-[#06b6d4] to-[#22d3ee]",
    glow: "from-[#06b6d4]/20",
  },
  {
    title: "Integración simple",
    description: "Embeds responsivos listos para pegar en tu landing en segundos.",
    icon: Share2,
    accent: "from-[#10b981] to-[#34d399]",
    glow: "from-[#10b981]/20",
  },
];

const stats = [
  { label: "Roles listos", value: "Admin · Editor" },
  { label: "Embeds", value: "Copy & paste" },
  { label: "Medios", value: "Texto · Imagen · Video" },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#dbeafe] via-[#f3e8ff] to-[#cffafe] shadow-xl">
        <div className="absolute inset-0 opacity-70">
          <div className="absolute -left-24 top-12 h-48 w-48 rounded-full bg-[#5b5be8]/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#a855f7]/25 blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-16 text-center sm:py-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#2563eb] ring-1 ring-white/70 backdrop-blur">
            Marketing listo para producción
          </div>
          <div className="space-y-4">
            <h1 className="bg-gradient-to-br from-[#0f0f3d] via-[#3b3bc8] to-[#7c3aed] bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
              Recopila y gestiona testimonios con el look & feel de frontend-rel.
            </h1>
            <p className="text-lg text-slate-600 sm:max-w-3xl">
              Plataforma centrada en marketing: captura, modera y comparte pruebas sociales con los
              tokens y componentes de shadcn, sin tocar tu sistema de temas en `globals.css`.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/30 hover:bg-[#2563eb]"
            >
              <Link href="/signup">
                Comenzar ahora
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-[#1e3a8a]/30 text-[#1e3a8a]">
              <Link href="/login">Ver dashboard</Link>
            </Button>
          </div>
          <div className="grid w-full gap-4 text-sm text-slate-600 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm"
              >
                <p className="text-xs font-medium text-[#2563eb]">{item.label}</p>
                <p className="mt-1 text-base font-semibold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="space-y-8">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#2563eb]">
            ¿Cómo funciona?
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Tres pasos simples para mostrar prueba social
          </h2>
          <p className="text-slate-600 sm:mx-auto sm:max-w-2xl">
            Diseñado a partir de la landing de frontend-rel: captura contenido, modera con tu equipo
            y comparte embeds accesibles sin perder consistencia con nuestro sistema de diseño.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${feature.glow} to-transparent opacity-0 transition group-hover:opacity-100`}
                aria-hidden="true"
              />
              <div className="relative space-y-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.accent} text-white shadow-lg shadow-[#1e3a8a]/15`}
                >
                  <feature.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-[#3b82f6] text-white shadow-md shadow-[#3b82f6]/25 hover:bg-[#2563eb]"
          >
            <Link href="/signup">Crear cuenta gratuita</Link>
          </Button>
        </div>
      </section>

      <section
        id="cta"
        className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-[#eff6ff] via-[#e9d5ff] to-[#cffafe] p-8 shadow-lg sm:p-12"
      >
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#2563eb]">
              Implementación rápida
            </p>
            <h3 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Mantén la estética de marketing y el sistema de shadcn.
            </h3>
            <p className="text-slate-600 sm:max-w-2xl">
              Colores, fondos y layout inspirados en frontend-rel, con tokens de `globals.css` intactos
              y componentes reutilizables para futuras páginas.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-[#3b82f6] text-white shadow-md shadow-[#3b82f6]/25 hover:bg-[#2563eb]"
            >
              <Link href="/signup">
                Probar gratis
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/about">Ver misión</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
