import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { HeroGlow } from "@/components/marketing/HeroGlow";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { GlowButton } from "@/components/marketing/GlowButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Roles listos", value: "Admin · Editor" },
  { label: "Embeds", value: "Copy & paste" },
  { label: "Medios", value: "Texto · Imagen · Video" },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <HeroGlow className="rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-secondary/10 to-background shadow-xl dark:bg-gradient-to-br dark:from-primary/20 dark:via-secondary/10 dark:to-background">
        <div className="absolute inset-0 opacity-70">
          <div className="absolute -left-24 top-12 h-48 w-48 rounded-full bg-primary/25 blur-3xl dark:bg-primary/30" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-secondary/20 blur-3xl dark:bg-secondary/25" />
        </div>
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-16 text-center sm:py-20">
          <div className="space-y-4">
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              Marketing inspirado en rel
            </Badge>
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
          <div className="grid w-full gap-4 sm:grid-cols-3">
            {stats.map((item) => (
              <Card key={item.label} className="bg-card/90">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium uppercase tracking-wide text-primary">
                    {item.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-base font-semibold text-foreground">{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </HeroGlow>

      <FeaturesSection />

      <section
        id="cta"
        className="overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-primary/15 via-primary/10 to-secondary/15 p-8 shadow-lg sm:p-12"
      >
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <Badge
              variant="outline"
              className="w-fit border-primary/30 bg-primary/10 text-xs font-semibold uppercase tracking-wide text-primary"
            >
              Inspirado en rel, listo para tu equipo
            </Badge>
            <h3 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
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
    </div>
  );
}
