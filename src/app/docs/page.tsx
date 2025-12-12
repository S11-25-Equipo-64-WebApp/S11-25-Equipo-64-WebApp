export default function DocsPage() {
  const endpoints = [
    { method: "POST", path: "/api/v1/auth/validate", desc: "Valida API key y devuelve perfil/rol." },
    { method: "GET", path: "/api/v1/entries", desc: "Lista entries (aprobados; borradores con API key editor/admin)." },
    { method: "POST", path: "/api/v1/entries", desc: "Crea entry en draft (editor/admin)." },
    { method: "GET", path: "/api/v1/entries/{slug}", desc: "Obtiene entry por slug." },
    { method: "PATCH", path: "/api/v1/entries/{slug}", desc: "Actualiza draft; usa If-Match para control de ETag." },
    { method: "POST", path: "/api/v1/entries/{slug}/approve", desc: "Publica o revierte (admin)." },
    { method: "POST", path: "/api/v1/media/sign", desc: "Firma de upload (editor/admin; real si Cloudinary está configurado, mock si no)." },
    { method: "DELETE", path: "/api/v1/media/delete", desc: "Borra asset por public_id (editor/admin; real si Cloudinary está configurado, mock si no)." },
    { method: "GET", path: "/api/v1/health", desc: "Healthcheck (solo dev)." },
  ];

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">API</p>
        <h1 className="text-3xl font-semibold text-foreground">Documentación rápida</h1>
        <p className="text-muted-foreground">
          Autenticación por API key via header <code className="rounded bg-foreground/10 px-1 py-0.5">x-api-key</code>.
          Usa roles: user (público), editor (crear/editar borradores), admin (aprobar/publicar).
        </p>
      </header>
      <div className="grid gap-3">
        {endpoints.map((ep) => (
          <div key={`${ep.method}-${ep.path}`} className="rounded-xl border border-border bg-card/70 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs uppercase tracking-wide text-primary">
                {ep.method}
              </span>
              <code>{ep.path}</code>
            </div>
            <p className="text-sm text-muted-foreground">{ep.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
