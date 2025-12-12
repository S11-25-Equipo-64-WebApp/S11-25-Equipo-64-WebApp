import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Legal</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Términos del servicio
        </h1>
        <p className="text-sm text-muted-foreground">
          Resumen del acuerdo para usar el CMS de testimonios. Mantén tus credenciales seguras y
          respeta los flujos de aprobación antes de publicar.
        </p>
      </header>

      <section className="space-y-3 rounded-2xl border border-border bg-card/70 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Uso permitido</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            Puedes crear y editar testimonios en borrador. Solo los administradores pueden aprobar y
            publicar.
          </li>
          <li>
            Cada organización (usamos una global en el MVP) es responsable de los datos cargados y
            de la veracidad de los testimonios.
          </li>
          <li>
            No envíes contenido ofensivo o protegido por derechos de autor sin autorización.
          </li>
        </ul>
      </section>

      <section className="space-y-3 rounded-2xl border border-border bg-card/70 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Credenciales y seguridad</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Guarda tu API key de manera privada. No la compartas en clientes públicos.</li>
          <li>
            En entornos de prueba puedes usar las claves locales por defecto. En producción debes
            solicitar credenciales seguras a tu administrador.
          </li>
          <li>
            Supabase y el dashboard registran eventos básicos para monitoreo. Consulta{" "}
            <Link href="/privacy" className="font-medium text-primary hover:underline">
              la política de privacidad
            </Link>{" "}
            para más detalles.
          </li>
        </ul>
      </section>

      <section className="space-y-3 rounded-2xl border border-border bg-card/70 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Limitaciones</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>No garantizamos disponibilidad ininterrumpida en entornos de prueba.</li>
          <li>
            Las firmas de media usan Cloudinary real cuando está configurado; si no, operan en modo
            mock sin subir archivos.
          </li>
          <li>
            Podemos actualizar estos términos. Te avisaremos a través de cambios en el dashboard o en
            la documentación pública.
          </li>
        </ul>
      </section>
    </div>
  );
}
