import Link from "next/link";
import { User } from "lucide-react";

import { Button } from "@/components/ui/Button";

export function AboutMissionPage() {
  return (
    <div className="flex flex-col gap-12">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Acerca de</p>
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">Nuestra misión</h1>
        <p className="text-lg text-muted-foreground">
          TestimonialCMS nació de una necesidad real: gestionar testimonios de forma profesional sin herramientas
          complicadas o costosas.
        </p>
      </header>

      <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
        <p>
          Después de trabajar con múltiples empresas y ver cómo luchaban por recopilar, organizar y mostrar prueba
          social de manera efectiva, decidimos crear una solución simple pero poderosa.
        </p>
        <p>
          <strong className="text-foreground">Nuestra misión es clara:</strong> proporcionar una plataforma accesible,
          gratuita y fácil de usar que permita a equipos de cualquier tamaño gestionar sus testimonios de forma
          colaborativa.
        </p>
        <p>
          Con roles de <strong className="text-foreground">Admin</strong> y <strong className="text-foreground">Editor</strong>, facilitamos el trabajo en equipo. Los
          administradores tienen control total sobre proyectos y permisos, mientras que los editores pueden enfocarse en
          recopilar y curar el mejor contenido.
        </p>
        <p>
          Creemos que la prueba social es fundamental para construir confianza, y que no debería ser un privilegio de
          empresas con grandes presupuestos. Por eso, TestimonialCMS es <strong className="text-foreground">gratis para siempre</strong>.
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-border bg-muted/40 p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-background shadow-lg">
          <User className="h-7 w-7" aria-hidden="true" />
        </div>
        <div>
          <p className="font-semibold text-foreground">Fundador de TestimonialCMS</p>
          <p className="text-sm text-muted-foreground">Construyendo herramientas para equipos</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center shadow-sm dark:bg-primary/10">
        <h3 className="text-2xl font-semibold text-foreground">¿Listo para comenzar?</h3>
        <p className="text-muted-foreground">
          Crea tu cuenta gratuita y empieza a gestionar testimonios hoy mismo.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/signup">Crear cuenta</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Iniciar sesión</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
