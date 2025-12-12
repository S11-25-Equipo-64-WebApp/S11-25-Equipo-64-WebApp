# Testimonial CMS (Equipo 64)

Next.js App Router + Bun. Incluye API REST para testimonios, dashboard con roles (user/editor/admin), y soporte opcional para Supabase + Cloudinary.

## Requisitos

- Bun >= 1.x
- Node.js 20+ (si no usas Bun global)
- Supabase (opcional para auth bearer y persistencia)
- Cloudinary (opcional para uploads firmados)

## Setup rápido

1. Instala deps:

```bash
bun install
```

2. Copia variables de entorno:

```bash
cp .env.example .env.local
```

3. Inicia dev server:

```bash
bun run dev
```

App en `http://localhost:3000`.

## API

El contrato está en `openapi.yaml`.

- `GET /api/v1/entries` (público: solo aprobados)
- `POST /api/v1/entries` (editor/admin)
- `GET /api/v1/entries/{slug}`
- `PATCH /api/v1/entries/{slug}` (If-Match / ETag)
- `POST /api/v1/entries/{slug}/approve` (admin)
- `POST /api/v1/media/sign` y `DELETE /api/v1/media/delete` (Cloudinary real si está configurado, mock si no)

## Persistencia con Supabase (MVP)

Por defecto usamos store en memoria. Para activar DB:

1. Ejecuta `docs/db.sql` en Supabase (SQL editor).
2. Configura en `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `USE_DB=true` (opcional; si no está en `false` se habilita automáticamente con credenciales).

## Cloudinary

Para uploads firmados desde el dashboard:

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- opcional `CLOUDINARY_UPLOAD_FOLDER`

## Scripts

- `bun run seed` genera `data/seeded-entries.json` desde el store en memoria.

## Lint/Test/Build

```bash
bun run lint
bun test
bun run build
```
