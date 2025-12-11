"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUp, RefreshCw, UploadCloud } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ErrorBanner } from "@/components/dashboard/ErrorBanner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UserRole } from "@/context/api-context";
import { useApiContext } from "@/context/api-context";
import { MediaSource } from "@/lib/constants/media-sources";
import type {
  ApiError,
  CreateEntryInput,
  Entry,
  MediaSignature,
  UpdateEntryInput,
} from "@/lib/api/client";
import { isValidSlug } from "@/lib/api/client";

const mediaSourceSchema = z.union([
  z.literal(MediaSource.NONE),
  z.literal(MediaSource.CLOUDINARY_IMAGE),
  z.literal(MediaSource.CLOUDINARY_VIDEO),
  z.literal(MediaSource.YOUTUBE_VIDEO),
]);

const entrySchema = z.object({
  title: z.string().min(1, "El título es obligatorio").max(200, "Máximo 200 caracteres"),
  slug: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || isValidSlug(value), {
      message: "Usa solo minúsculas, números y guiones. Ej: caso-exito-equipo",
    }),
  summary: z
    .string()
    .max(280, "Máximo 280 caracteres")
    .optional()
    .or(z.literal("")),
  content: z
    .string()
    .max(5000, "Máximo 5000 caracteres")
    .optional()
    .or(z.literal("")),
  author: z.string().min(1, "El autor es obligatorio").max(120, "Máximo 120 caracteres"),
  date: z.string().optional(),
  tags: z.string().optional(),
  mediaUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  mediaSource: mediaSourceSchema.default(MediaSource.NONE),
});

export type EntryFormValues = z.infer<typeof entrySchema>;

type Props = {
  mode: "create" | "edit";
  role: UserRole;
  entry?: Entry;
  etag?: string;
  onSaved?: (entry: Entry, meta?: { etag?: string }) => void;
};

type UploadState =
  | { status: "idle" }
  | { status: "signing" }
  | { status: "uploading"; fileName: string }
  | { status: "done"; publicId?: string; url?: string }
  | { status: "error"; message: string };

const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toDateInput(value?: string) {
  if (!value) return "";
  try {
    return new Date(value).toISOString().slice(0, 16);
  } catch {
    return value;
  }
}

function sanitizePayload(values: EntryFormValues) {
  const tags = values.tags
    ?.split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 10);

  const base = {
    title: values.title.trim(),
    author: values.author.trim(),
    content: values.content?.trim() || undefined,
    summary: values.summary?.trim() || undefined,
    slug: values.slug?.trim() || undefined,
    mediaUrl: values.mediaUrl?.trim() || undefined,
    mediaSource: values.mediaSource,
    date: values.date ? new Date(values.date).toISOString() : undefined,
    tags: tags && tags.length ? tags : undefined,
  };

  // avoid sending media fields if source is NONE
  if (values.mediaSource === MediaSource.NONE) {
    base.mediaUrl = undefined;
  }

  return base;
}

export function EntryForm({ mode, role, entry, etag, onSaved }: Props) {
  const { client, authHeaders } = useApiContext();
  const [serverError, setServerError] = useState<ApiError | null>(null);
  const [currentEtag, setCurrentEtag] = useState<string | undefined>(etag);
  const [uploadState, setUploadState] = useState<UploadState>({ status: "idle" });
  const [uploadError, setUploadError] = useState<ApiError | null>(null);
  const hasWriteAuth = Boolean(authHeaders.apiKey || authHeaders.bearerToken);

  const form = useForm<EntryFormValues>({
    resolver: zodResolver(entrySchema),
    mode: "onBlur",
    defaultValues: {
      title: entry?.title ?? "",
      slug: entry?.slug ?? "",
      summary: entry?.summary ?? "",
      content: entry?.content ?? "",
      author: entry?.author ?? "",
      date: toDateInput(entry?.date),
      tags: entry?.tags?.join(", ") ?? "",
      mediaSource: entry?.mediaSource ?? MediaSource.NONE,
      mediaUrl: entry?.mediaUrl ?? "",
    },
  });

  useEffect(() => {
    if (etag) {
      setCurrentEtag(etag);
    }
  }, [etag]);

  const submitting = form.formState.isSubmitting;
  const isEditor = role === "editor" || role === "admin";

  const handleSubmit = async (values: EntryFormValues) => {
    setServerError(null);

    if (!hasWriteAuth) {
      setServerError({
        status: 401,
        message: "Necesitas API key o sesión Supabase para enviar cambios",
      });
      return;
    }

    const payload = sanitizePayload(values);

    const result =
      mode === "create"
        ? await client.createEntry(payload as CreateEntryInput, authHeaders)
        : await client.updateEntry(
            entry?.slug ?? values.slug ?? "",
            payload as UpdateEntryInput,
            authHeaders,
            currentEtag
          );

    if (result.error) {
      if (result.error.status === 409) {
        form.setError("slug", { message: "Slug en uso. Ajusta el título o el slug manual." });
      }
      setServerError(result.error);
      return;
    }

    if (result.etag) {
      setCurrentEtag(result.etag);
    }

    if (result.data) {
      onSaved?.(result.data, { etag: result.etag });
      if (mode === "edit") {
        form.reset({
          ...values,
          slug: result.data.slug,
          date: toDateInput(result.data.date),
        });
      } else {
        form.reset({
          ...values,
          slug: result.data.slug,
        });
      }
    }
  };

  const handleUpload = async (file: File, signature: MediaSignature) => {
    if (!cloudinaryConfig.cloudName || !cloudinaryConfig.apiKey) {
      setUploadError({
        status: 400,
        message: "Configura las variables de Cloudinary para subir media.",
      });
      return;
    }

    setUploadError(null);
    setUploadState({ status: "uploading", fileName: file.name });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", cloudinaryConfig.apiKey);
    formData.append("timestamp", signature.timestamp.toString());
    formData.append("signature", signature.signature);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`;
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      setUploadError({
        status: response.status,
        message: data?.error?.message ?? "Error al subir el archivo",
      });
      setUploadState({ status: "error", message: data?.error?.message ?? "Falló la subida" });
      return;
    }

    const secureUrl: string | undefined = data?.secure_url ?? data?.url;
    if (secureUrl) {
      form.setValue("mediaUrl", secureUrl, { shouldDirty: true });
    }
    setUploadState({
      status: "done",
      publicId: data?.public_id,
      url: secureUrl,
    });
  };

  const signAndUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!hasWriteAuth) {
      setUploadError({
        status: 401,
        message: "Necesitas API key o sesión Supabase para firmar uploads.",
      });
      return;
    }

    const source = form.getValues("mediaSource");
    const isImage = source === MediaSource.CLOUDINARY_IMAGE;
    const isVideo = source === MediaSource.CLOUDINARY_VIDEO;
    if (isImage && !file.type.startsWith("image/")) {
      setUploadError({ status: 400, message: "Selecciona un archivo de imagen." });
      return;
    }
    if (isVideo && !file.type.startsWith("video/")) {
      setUploadError({ status: 400, message: "Selecciona un archivo de video." });
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setUploadError({ status: 400, message: "El archivo supera los 25MB permitidos." });
      return;
    }

    setUploadState({ status: "signing" });
    const signature = await client.signMedia(authHeaders);
    if (signature.error || !signature.data) {
      setUploadError(signature.error ?? { status: 500, message: "No se pudo firmar la subida" });
      setUploadState({ status: "error", message: signature.error?.message ?? "Falló la firma" });
      return;
    }

    await handleUpload(file, signature.data);
  };

  const deleteUploadedMedia = async () => {
    const publicId = (uploadState.status === "done" && uploadState.publicId) || undefined;
    if (!publicId || !hasWriteAuth) {
      setUploadError({
        status: 400,
        message: "No hay public_id disponible para eliminar o falta API key.",
      });
      return;
    }
    const result = await client.deleteMedia(publicId, authHeaders);
    if (result.error) {
      setUploadError(result.error);
      return;
    }
    form.setValue("mediaUrl", "", { shouldDirty: true });
    setUploadState({ status: "idle" });
  };

  // eslint-disable-next-line react-hooks/incompatible-library
  const mediaSource = form.watch("mediaSource");

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{mode === "create" ? "Crear entrada" : "Editar entrada"}</CardTitle>
          <CardDescription>
            Valida el slug antes de enviar. Si el backend entrega ETag, lo reenviamos en PATCH con
            <code className="ml-1">If-Match</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Caso de éxito Equipo 64"
                {...form.register("title")}
              />
              {form.formState.errors.title ? (
                <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="slug">Slug</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    form.setValue("slug", slugify(form.getValues("title")), { shouldDirty: true })
                  }
                >
                  Generar
                </Button>
              </div>
              <Input
                id="slug"
                placeholder="caso-exito-equipo"
                {...form.register("slug")}
                aria-invalid={Boolean(form.formState.errors.slug)}
              />
              {form.formState.errors.slug ? (
                <p className="text-xs text-destructive">{form.formState.errors.slug.message}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Patrón requerido: <code>^[a-z0-9]+(?:-[a-z0-9]+)*$</code>
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="author">Autor</Label>
              <Input id="author" placeholder="Equipo 64" {...form.register("author")} />
              {form.formState.errors.author ? (
                <p className="text-xs text-destructive">{form.formState.errors.author.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input type="datetime-local" id="date" {...form.register("date")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Resumen (280 máx)</Label>
            <Textarea id="summary" {...form.register("summary")} />
            {form.formState.errors.summary ? (
              <p className="text-xs text-destructive">{form.formState.errors.summary.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenido (5000 máx)</Label>
            <Textarea id="content" {...form.register("content")} />
            {form.formState.errors.content ? (
              <p className="text-xs text-destructive">{form.formState.errors.content.message}</p>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separados por coma)</Label>
              <Input
                id="tags"
                placeholder="marketing, clientes"
                {...form.register("tags")}
              />
            </div>
            <div className="space-y-2">
              <Label>Origen media</Label>
              <Select
                value={String(mediaSource)}
                onValueChange={(value) =>
                  form.setValue("mediaSource", Number(value) as MediaSource, { shouldDirty: true })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(MediaSource.NONE)}>Sin media</SelectItem>
                  <SelectItem value={String(MediaSource.CLOUDINARY_IMAGE)}>Cloudinary imagen</SelectItem>
                  <SelectItem value={String(MediaSource.CLOUDINARY_VIDEO)}>Cloudinary video</SelectItem>
                  <SelectItem value={String(MediaSource.YOUTUBE_VIDEO)}>YouTube</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Validamos fuente numérica según enum. Cambia según el archivo elegido.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mediaUrl">URL media</Label>
            <Input
              id="mediaUrl"
              placeholder={
                mediaSource === MediaSource.YOUTUBE_VIDEO
                  ? "https://www.youtube.com/watch?v=..."
                  : "https://res.cloudinary.com/..."
              }
              {...form.register("mediaUrl")}
            />
            {form.formState.errors.mediaUrl ? (
              <p className="text-xs text-destructive">{form.formState.errors.mediaUrl.message}</p>
            ) : null}
          </div>

          {mediaSource === MediaSource.CLOUDINARY_IMAGE ||
          mediaSource === MediaSource.CLOUDINARY_VIDEO ? (
            <div className="rounded-lg border border-dashed p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <UploadCloud className="h-4 w-4" aria-hidden />
                <span>Firma y subida a Cloudinary</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Pedimos firma al backend y enviamos If-Match en PATCH para evitar sobrescrituras.
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted/60">
                  <FileUp className="h-4 w-4" aria-hidden />
                  <span>Seleccionar archivo</span>
                  <input
                    type="file"
                    className="hidden"
                    accept={mediaSource === MediaSource.CLOUDINARY_IMAGE ? "image/*" : "video/*"}
                    onChange={signAndUpload}
                  />
                </label>
                {uploadState.status === "uploading" ? (
                  <span className="text-xs text-muted-foreground">
                    Subiendo {uploadState.fileName}...
                  </span>
                ) : null}
                {uploadState.status === "done" && uploadState.url ? (
                  <span className="text-xs text-emerald-600 dark:text-emerald-300">
                    Subida exitosa: {uploadState.url}
                  </span>
                ) : null}
              </div>
              {uploadError ? <ErrorBanner error={uploadError} className="mt-2" /> : null}
              {uploadState.status === "done" && uploadState.publicId ? (
                <div className="mt-2 flex items-center gap-2">
                  <Button type="button" size="sm" variant="ghost" onClick={deleteUploadedMedia}>
                    Borrar de Cloudinary
                  </Button>
                  <span className="text-xs text-muted-foreground">public_id: {uploadState.publicId}</span>
                </div>
              ) : null}
            </div>
          ) : null}

          {currentEtag ? (
            <p className="text-xs text-muted-foreground">
              ETag actual: <code>{currentEtag}</code> (enviado como If-Match en PATCH).
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-wrap justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            {mode === "create"
              ? "Crear siempre guarda como borrador."
              : "Editar vuelve el estado a borrador; publicación via endpoint /approve."}
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={!isEditor || submitting}>
              {submitting ? "Guardando..." : mode === "create" ? "Crear borrador" : "Guardar cambios"}
            </Button>
            {mode === "edit" ? (
              <Button type="button" variant="ghost" onClick={() => form.reset()} disabled={submitting}>
                <RefreshCw className="mr-2 h-4 w-4" aria-hidden />
                Restablecer
              </Button>
            ) : null}
          </div>
        </CardFooter>
      </Card>

      <ErrorBanner error={serverError} />
    </form>
  );
}
