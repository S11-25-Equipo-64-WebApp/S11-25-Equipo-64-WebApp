import Link from "next/link";
import { ArrowRight, User } from "lucide-react";

import { Button } from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-[#dbeafe] via-[#f3e8ff] to-[#cffafe] p-8 shadow-md sm:p-10">
        <div className="absolute -left-24 top-8 h-40 w-40 rounded-full bg-[#5b5be8]/30 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-[#a855f7]/25 blur-3xl" />
        <div className="relative space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#2563eb]">Acerca de</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Nuestra misión
          </h1>
          <p className="text-lg text-slate-600 sm:max-w-3xl">
            TestimonialCMS nació de la necesidad de gestionar testimonios de forma profesional sin
            sacrificar simplicidad. Queremos que cualquier equipo replique el marketing de la rama{" "}
            <span className="font-semibold text-slate-900">rel</span> de frontend-rel usando
            componentes shadcn y los tokens de nuestro `globals.css`.
          </p>
        </div>
      </section>

      <section className="space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="space-y-4 text-slate-600 sm:text-lg">
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
        </div>

        <div className="flex flex-col gap-6 rounded-2xl border border-dashed border-[#5b5be8]/30 bg-[#dbeafe]/40 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#5b5be8] to-[#7c3aed] text-white shadow-lg shadow-[#5b5be8]/25">
              <User className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Fundador de TestimonialCMS</p>
              <p className="text-sm text-slate-600">Construyendo herramientas para equipos</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
              Diseño de marketing adaptado a shadcn
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-[#eff6ff] via-[#e9d5ff] to-[#cffafe] p-8 shadow-md sm:p-10">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            ¿Listo para empezar?
          </h2>
          <p className="text-slate-600 sm:max-w-2xl">
            Crea tu cuenta gratuita y gestiona testimonios hoy mismo. Roles, embeds y temas listos para
            usar con las variables de `globals.css`.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-[#3b82f6] text-white shadow-md shadow-[#3b82f6]/25 hover:bg-[#2563eb]"
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
              className="border-[#1e3a8a]/30 text-[#1e3a8a]"
            >
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
