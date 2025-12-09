import { ArrowRight, CheckCircle2, LineChart, MessageSquare, ShieldCheck, Sparkles, Workflow } from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Publica sin esfuerzo",
    description:
      "Crea, aprueba y publica testimonios en minutos con flujos guiados y roles claros para tu equipo.",
    icon: <Sparkles className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: "Control y seguridad",
    description:
      "Define permisos, conserva un historial de cambios y mantén la coherencia de marca en cada historia.",
    icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: "Distribución omnicanal",
    description:
      "Publica en tu web, newsletters o redes sociales con bloques personalizables y listos para usar.",
    icon: <Workflow className="h-5 w-5" aria-hidden="true" />,
  },
];

const highlights = [
  {
    title: "Workflows automatizados",
    description: "Recopila, revisa y aprueba testimonios con alertas y recordatorios automáticos.",
    icon: <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />,
  },
  {
    title: "Dashboard accionable",
    description: "Métricas de conversión, engagement y cobertura en un panel listo para presentar.",
    icon: <LineChart className="h-5 w-5 text-primary" aria-hidden="true" />,
  },
  {
    title: "Historias que convierten",
    description: "Plantillas de copy y componentes UI que mantienen la voz de marca y aceleran lanzamientos.",
    icon: <MessageSquare className="h-5 w-5 text-primary" aria-hidden="true" />,
  },
];

const testimonials = [
  {
    name: "María González",
    role: "Head of Marketing, Nimbus",
    quote:
      "Pasamos de perseguir testimonios por correo a tener historias listas para cada campaña. Reducimos un 40% el tiempo de lanzamiento.",
  },
  {
    name: "Luis Andrade",
    role: "CMO, NovaTech",
    quote:
      "El equipo ahora comparte un mismo flujo y la marca se ve impecable en todos los canales. Los resultados hablan solos.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-16 py-6 sm:py-10">
      <section className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-8 sm:p-12 shadow-sm">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-4 py-2 text-sm font-medium text-primary shadow-xs">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
              Plataforma de testimonios lista para crecer
            </div>
            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Marketing que se escribe solo con historias reales
              </h1>
              <p className="text-balance text-lg text-muted-foreground sm:max-w-xl">
                Centraliza testimonios, aprueba rápido y publica en minutos con componentes listos de shadcn/ui. Diseñado para equipos de marketing que necesitan velocidad sin sacrificar la marca.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" className="rounded-full px-6">
                Empezar gratis
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-6">
                Ver demo
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10" />
                <span>Integraciones nativas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10" />
                <span>Soporte en español</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl border border-border bg-background/70 p-6 shadow-lg backdrop-blur">
            <div className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Live preview
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-3">
                <div>
                  <p className="text-sm font-semibold">Historias aprobadas</p>
                  <p className="text-xs text-muted-foreground">Últimos 30 días</p>
                </div>
                <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">+68%</div>
              </div>
              <div className="space-y-3 rounded-xl border border-border bg-background p-4">
                {highlights.map((item) => (
                  <div key={item.title} className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
                    {item.icon}
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">Tiempo de aprobación</p>
                  <p className="text-2xl font-semibold">3 h</p>
                  <p className="text-xs text-primary">-55% vs. último mes</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">Fuentes conectadas</p>
                  <p className="text-2xl font-semibold">12</p>
                  <p className="text-xs text-primary">CMS · CRM · Forms</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-primary">Experiencia para marketing</p>
          <h2 className="text-3xl font-semibold tracking-tight">Un flujo pensado para lanzar historias, no tickets</h2>
          <p className="text-muted-foreground sm:max-w-3xl">
            Conecta formularios, importa reseñas y publica sin depender de producto. Cada componente sigue los estilos por defecto de shadcn/ui para que tu UI sea coherente desde el primer día.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-background p-6 shadow-sm"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                {feature.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
              <div className="mt-auto text-sm font-medium text-primary">Ver cómo funciona →</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-muted/40 p-8 shadow-sm sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-primary">Resultados tangibles</p>
            <h2 className="text-3xl font-semibold tracking-tight">Historias listas para cada campaña en la mitad de tiempo</h2>
            <p className="text-muted-foreground sm:max-w-2xl">
              Reduce ciclos de aprobación y mantén la coherencia visual gracias a tokens compartidos en <code>globals.css</code>. Tu equipo usa los mismos componentes, sin reinventar estilos.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-foreground">
              <div className="flex items-center gap-2 rounded-full bg-background px-4 py-2 shadow-xs">
                <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
                Lanzamientos 2x más rápidos
              </div>
              <div className="flex items-center gap-2 rounded-full bg-background px-4 py-2 shadow-xs">
                <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
                Gobierno de marca integrado
              </div>
            </div>
          </div>
          <div className="space-y-4 rounded-2xl border border-border bg-background p-6 shadow-md">
            <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-muted/40 p-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Impacto en conversión</p>
                <p className="text-xs text-muted-foreground">Promedio campañas con testimonios</p>
              </div>
              <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">+18%</div>
            </div>
            <div className="grid gap-3 text-sm">
              {testimonials.map((item) => (
                <div key={item.name} className="rounded-xl border border-border bg-muted/30 p-4">
                  <p className="text-base font-medium text-foreground">“{item.quote}”</p>
                  <p className="mt-2 text-xs text-muted-foreground">{item.name} · {item.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-background via-primary/5 to-background p-8 shadow-sm sm:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-primary">Listo para tu próximo lanzamiento</p>
            <h2 className="text-3xl font-semibold tracking-tight">Activa un espacio de testimonios en minutos</h2>
            <p className="text-muted-foreground sm:max-w-xl">
              Mantuvimos <code>globals.css</code> intacto para que los colores, bordes y tipografías sigan siendo los mismos. Solo añadimos componentes shadcn/ui listos para producción.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" className="rounded-full px-6">
              Crear mi espacio
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-6">
              Hablar con el equipo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
