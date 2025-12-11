"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, RefreshCw } from "lucide-react";

import { EntryForm } from "@/components/dashboard/EntryForm";
import { EntryStatusBadge } from "@/components/dashboard/EntryStatusBadge";
import { ErrorBanner } from "@/components/dashboard/ErrorBanner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useApiContext } from "@/context/api-context";
import type { ApiError, Entry } from "@/lib/api/client";
import { EntryStatus } from "@/lib/enums/entry-status";

type Props = {
  params: { slug: string };
};

export default function EntryEditPage({ params }: Props) {
  const { slug } = params;
  const { role, client, authHeaders, apiKey } = useApiContext();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [etag, setEtag] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [approving, setApproving] = useState(false);
  const hasWriteAuth = Boolean(authHeaders.apiKey || authHeaders.bearerToken);

  useEffect(() => {
    void loadEntry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, apiKey]);

  const loadEntry = async () => {
    setLoading(true);
    setError(null);
    const result = await client.getEntry(slug, authHeaders);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      setEntry(null);
      return;
    }

    setEntry(result.data ?? null);
    setEtag(result.etag);
  };

  const handleApprove = async (approve: boolean) => {
    if (!hasWriteAuth) {
      setError({
        status: 401,
        message: "Necesitas API key o sesión Supabase para aprobar/revertir",
      });
      return;
    }
    setApproving(true);
    const result = await client.approveEntry(slug, approve, authHeaders);
    setApproving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.data) {
      setEntry(result.data);
      setEtag(result.etag);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Button asChild variant="ghost">
          <Link href="/dashboard/entries" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Regresar
          </Link>
        </Button>
        {entry ? (
          <Badge variant="outline" className="flex items-center gap-2">
            <EntryStatusBadge status={entry.status as EntryStatus} />
            <span>Slug: {entry.slug}</span>
          </Badge>
        ) : null}
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Editar testimonio</CardTitle>
          <CardDescription>
            GET /entries/{slug} respeta visibilidad según API key. PATCH envía If-Match con el ETag
            obtenido para evitar sobrescrituras simultáneas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? <p className="text-sm text-muted-foreground">Cargando...</p> : null}
          {error ? <ErrorBanner error={error} /> : null}
          {entry ? (
            <EntryForm
              mode="edit"
              role={role}
              entry={entry}
              etag={etag}
              onSaved={(updated, meta) => {
                setEntry(updated);
                setEtag(meta?.etag ?? etag);
              }}
            />
          ) : null}
        </CardContent>
      </Card>

      {entry && role === "admin" ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Publicar o revertir</CardTitle>
            <CardDescription>
              {"Usa POST /entries/{slug}/approve con approve=true para publicar; false revierte a draft."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            <EntryStatusBadge status={entry.status as EntryStatus} />
            <span className="text-sm text-muted-foreground">
              {entry.status === EntryStatus.APPROVED
                ? "Aprobado. Puedes revertir a borrador."
                : "Borrador. Solo admin puede aprobar."}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => void loadEntry()}
                disabled={approving}
              >
                <RefreshCw className="mr-2 h-4 w-4" aria-hidden />
                Refrescar
              </Button>
              <Button
                type="button"
                onClick={() => handleApprove(entry.status !== EntryStatus.APPROVED)}
                disabled={approving}
              >
                <CheckCircle className="mr-2 h-4 w-4" aria-hidden />
                {approving
                  ? "Actualizando..."
                  : entry.status === EntryStatus.APPROVED
                    ? "Revertir a draft"
                    : "Aprobar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
