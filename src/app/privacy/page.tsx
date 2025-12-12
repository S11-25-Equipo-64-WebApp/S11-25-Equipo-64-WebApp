export default function PrivacyPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Legal</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Política de privacidad
        </h1>
        <p className="text-sm text-muted-foreground">
          Cómo manejamos la información de los testimonios, tus credenciales y las métricas básicas
          del dashboard.
        </p>
      </header>

      <section className="space-y-3 rounded-2xl border border-border bg-card/70 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Datos que procesamos</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            Metadatos de testimonios (título, resumen, tags, autor, estado). Los borradores se
            mantienen privados para editores y admins.
          </li>
          <li>Logs técnicos mínimos para depurar errores (sin contenido sensible).</li>
          <li>
            Tokens de sesión y API keys para autenticar peticiones. Se almacenan solo en cliente
            (localStorage) durante el MVP.
          </li>
        </ul>
      </section>

      <section className="space-y-3 rounded-2xl border border-border bg-card/70 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Tus controles</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            Puedes revocar una API key desde el panel de administración (pendiente de implementación
            en este MVP).
          </li>
          <li>Solicita exportar o eliminar datos de testimonios a tu administrador de la org.</li>
          <li>
            El dashboard ofrece modo claro/oscuro y recuerda tu rol preferido solo en tu navegador.
          </li>
        </ul>
      </section>

      <section className="space-y-3 rounded-2xl border border-border bg-card/70 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Almacenamiento de media</h2>
        <p className="text-sm text-muted-foreground">
          En desarrollo, si no configuras Cloudinary, las firmas y destrucción de assets funcionan
          con mocks. En producción, al configurar Cloudinary, las firmas son reales y los assets se
          almacenan/eliminan según tu política de acceso por rol.
        </p>
      </section>
    </div>
  );
}
