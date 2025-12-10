import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { HeroGlow } from "@/components/marketing/HeroGlow";
import { HeroGlowBadge } from "@/components/marketing/HeroGlowBadge";
import { GlowButton } from "@/components/marketing/GlowButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-12">
      <HeroGlow
        className="relative rounded-3xl border border-border bg-gradient-to-br from-sky-100/70 via-sky-50/90 to-slate-50 shadow-xl dark:bg-gradient-to-br dark:from-slate-900/70 dark:via-slate-900/60 dark:to-slate-950"
        hoverGlow
      >
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -left-24 top-12 h-48 w-48 rounded-full bg-sky-100/70 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-16 text-center sm:py-20">
          <HeroGlowBadge className="text-xs font-semibold uppercase tracking-wide">
            Acerca de TestimonialCMS
          </HeroGlowBadge>
          <h1 className="bg-gradient-to-br from-foreground via-primary to-secondary bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
            TestimonialCMS pone tus testimonios en piloto automático
          </h1>
          <p className="text-lg text-muted-foreground sm:max-w-3xl">
            Reunimos clientes, moderamos feedback y publicamos embeds accesibles
            desde un mismo panel. Admins definen permisos, editores ajustan
            textos y QA revisa versiones en segundos. Todo el diseño usa los
            tokens de `globals.css` para mantener cada captura fiel al resto del
            producto.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <GlowButton
              asChild
              size="lg"
              glowColor="primary"
              glowOpacity={0.5}
              glowRadius={440}
              accent="from-primary/30 via-secondary/25 to-transparent"
              className="bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90"
            >
              <Link href="/signup">
                Crear cuenta
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </GlowButton>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-border text-foreground"
            >
              <Link href="/docs">Ver documentación</Link>
            </Button>
          </div>
        </div>
      </HeroGlow>

      <HeroGlow
        className="relative rounded-3xl border border-border bg-gradient-to-br from-slate-50 via-slate-100 to-sky-100 shadow-xl dark:bg-gradient-to-br dark:from-slate-900/70 dark:via-slate-900/60 dark:to-slate-950/80"
        hoverGlow
      >
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -left-20 top-10 h-44 w-44 rounded-full bg-sky-100/60 blur-3xl" />
          <div className="absolute bottom-0 right-8 h-52 w-52 rounded-full bg-primary/20 blur-3xl" />
        </div>
        <section className="relative mx-auto flex max-w-5xl flex-col gap-6 px-6 py-14 text-center sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <div className="space-y-3">
            <HeroGlowBadge className="text-xs font-semibold uppercase tracking-wide">
              Inspirado en teams que necesitan resultados
            </HeroGlowBadge>
            <h3 className="bg-gradient-to-br from-foreground via-primary to-secondary bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
              Roles, embeds y moderación listos para tu equipo
            </h3>
            <p className="text-muted-foreground sm:max-w-2xl">
              Las páginas de marketing, los captadores en vivo y los canales de
              soporte ahora comparten el mismo editor: el contenido llega a
              embeds, landing pages y dashboards con las mismas reglas
              tipográficas. TestimonialCMS ofrece reportes, roles y moderación
              continua para que el storytelling sea veloz y confiable.
            </p>
            <Badge
              variant="outline"
              className="text-xs font-semibold uppercase tracking-wide"
            >
              Producto real · Marketing listo
            </Badge>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <GlowButton
              asChild
              size="lg"
              glowColor="primary"
              glowOpacity={0.45}
              glowRadius={420}
              accent="from-primary/30 via-secondary/25 to-transparent"
              className="bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90"
            >
              <Link href="/signup">
                Probar gratis
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </GlowButton>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-border"
            >
              <Link href="/login">Abrir dashboard</Link>
            </Button>
          </div>
        </section>
      </HeroGlow>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-secondary/5 to-background shadow-md">
          <div className="space-y-4 px-6 py-8 sm:px-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Estrategia
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Testimonios que convierten y fidelizan
            </h2>
            <p className="text-muted-foreground sm:text-lg">
              Exportamos la narrativa de marketing que funcionó con miles de
              historias reales y la aplicamos a contenido genuino. Los
              testimonios se publican con embeds accesibles, moderación
              automática y tonos que respetan a la marca sin sacrificar
              consistencia editorial.
            </p>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-gradient-to-br from-secondary/10 via-primary/5 to-background shadow-md">
          <div className="space-y-4 px-6 py-8 sm:px-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Equipo
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Enfocados en velocidad y confianza
            </h2>
            <p className="text-muted-foreground sm:text-lg">
              Somos un equipo que recoge feedback directo de admins y editores.
              Cada lanzamiento mejora la experiencia de quienes montan embeds,
              crean campañas y necesitan métricas limpias, siempre usando la
              paleta y los tokens que ya dominan sus proyectos.
            </p>
            <Badge
              variant="outline"
              className="text-xs font-semibold uppercase tracking-wide"
            >
              Shadcn · globals.css
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
