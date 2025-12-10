import Link from "next/link";
import { ArrowRight, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <Card className="relative overflow-hidden border border-border bg-gradient-to-br from-primary/15 via-secondary/10 to-background shadow-md">
        <div className="absolute -left-24 top-8 h-40 w-40 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-secondary/20 blur-3xl" />
        <CardHeader className="relative space-y-4 sm:p-10">
          <Badge
            variant="outline"
            className="w-fit border-primary/30 bg-primary/10 text-xs font-semibold uppercase tracking-wide text-primary"
          >
            Acerca de
          </Badge>
          <CardTitle className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Nuestra misión
          </CardTitle>
          <p className="text-lg text-muted-foreground sm:max-w-3xl">
            TestimonialCMS nació de la necesidad de gestionar testimonios de forma profesional sin
            sacrificar simplicidad. Queremos que cualquier equipo replique el marketing de la rama{" "}
            <span className="font-semibold text-foreground">rel</span> de frontend-rel usando
            componentes shadcn y los tokens de nuestro `globals.css`.
          </p>
        </CardHeader>
      </Card>

      <Card className="space-y-8 shadow-sm">
        <CardContent className="space-y-4 text-muted-foreground sm:text-lg sm:p-10">
          <p>
            Después de acompañar a varios equipos vimos cómo la recopilación y publicación de prueba
            social se volvía lenta o inconsistente. Nuestra misión es ofrecer una plataforma accesible
            y gratuita donde Admins y Editores trabajen juntos sin fricción.
          </p>
          <p>
            Los administradores conservan el control total sobre proyectos y permisos, mientras los
            editores se enfocan en curar el mejor contenido. Así mantenemos la velocidad del marketing
            sin comprometer la calidad editorial ni la accesibilidad de los embeds.
          </p>
          <p>
            Creemos que la confianza se construye mostrando evidencia real. Por eso, TestimonialCMS es{" "}
            <strong className="text-slate-900">gratis para siempre</strong> y se integra con el
            sistema de temas que ya estás usando.
          </p>
        </CardContent>

        <CardContent className="pt-0 sm:px-10">
          <div className="flex flex-col gap-6 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#5b5be8] to-[#7c3aed] text-white shadow-lg shadow-[#5b5be8]/25">
                <User className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Fundador de TestimonialCMS</p>
                <p className="text-sm text-muted-foreground">Construyendo herramientas para equipos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="muted" className="bg-background px-4 py-2 text-foreground shadow-sm">
                Diseño de marketing adaptado a shadcn
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border bg-gradient-to-br from-primary/15 via-primary/10 to-secondary/15 shadow-md">
        <CardContent className="space-y-4 p-8 sm:p-10">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            ¿Listo para empezar?
          </h2>
          <p className="text-muted-foreground sm:max-w-2xl">
            Crea tu cuenta gratuita y gestiona testimonios hoy mismo. Roles, embeds y temas listos para
            usar con las variables de `globals.css`.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90"
            >
              <Link href="/signup">
                Crear cuenta
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-border text-foreground"
            >
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
