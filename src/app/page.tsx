import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { HeroGlow } from "@/components/marketing/HeroGlow";
import { HeroGlowBadge } from "@/components/marketing/HeroGlowBadge";
import { HeroStatsGrid } from "@/components/marketing/HeroStatsGrid";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { GlowButton } from "@/components/marketing/GlowButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <HeroGlow
        className="relative rounded-3xl border border-border bg-gradient-to-br from-sky-100/70 via-sky-50/80 to-slate-50 shadow-xl dark:bg-gradient-to-br dark:from-slate-900/70 dark:via-slate-900/60 dark:to-slate-950"
        hoverGlow
      >
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -left-24 top-12 h-48 w-48 rounded-full bg-sky-100/70 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-sky-200/50 blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-16 text-center sm:py-20">
          <div className="space-y-4">
            <HeroGlowBadge className="text-xs font-semibold uppercase tracking-wide">
              Historias reales con brillo auténtico
            </HeroGlowBadge>
            <h1 className="bg-gradient-to-br from-foreground via-primary to-secondary bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
              Recopila y gestiona testimonios.
            </h1>
            <p className="text-lg text-muted-foreground sm:max-w-3xl">
              Plataforma de gestión para equipos que necesitan crear, moderar y compartir testimonios
              en texto, imagen o video. Ideal para Admins y Editores que buscan velocidad y consistencia.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <GlowButton
              asChild
              size="lg"
              glowColor="primary"
              glowOpacity={0.5}
              glowRadius={460}
              accent="from-primary/30 via-secondary/25 to-transparent"
              className="bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90"
            >
              <Link href="/signup">
                Comenzar ahora
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </GlowButton>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-border text-foreground"
            >
              <Link href="/login">Ver dashboard</Link>
            </Button>
          </div>
          <HeroStatsGrid />
        </div>
      </HeroGlow>

      <FeaturesSection />

      <HeroGlow
        className="rounded-3xl border border-border bg-gradient-to-r from-sky-100/70 via-sky-50/80 to-slate-50 shadow-lg"
        hoverGlow
      >
        <section
          id="cta"
          className="relative overflow-hidden rounded-3xl border border-transparent bg-sky-50/60 p-8 sm:p-12 shadow-inner"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-70 blur-3xl"
            style={{
              background: "radial-gradient(circle at 20% top, rgba(224, 249, 255, 0.9), transparent 50%)",
            }}
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <HeroGlowBadge glowColor="#aee5ff" className="text-xs font-semibold uppercase tracking-wide">
                Inspirado en rel, listo para tu equipo
              </HeroGlowBadge>
              <h3 className="bg-gradient-to-br from-foreground via-primary to-secondary bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
                Embeds, roles y moderación en minutos.
              </h3>
              <p className="text-muted-foreground sm:max-w-2xl">
                Diseño y colores inspirados en frontend-rel, montados sobre nuestros tokens de `globals.css`
                y componentes shadcn para un MVP que puedes mostrar hoy.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <GlowButton
                asChild
                size="lg"
                glowColor="accent"
                glowOpacity={0.45}
                glowRadius={440}
                accent="from-accent/40 via-primary/25 to-transparent"
                className="bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90"
              >
                <Link href="/signup">
                  Probar gratis
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </GlowButton>
              <Button asChild size="lg" variant="outline">
                <Link href="/about">Ver misión</Link>
              </Button>
            </div>
          </div>
        </section>
      </HeroGlow>
    </div>
  );
}
