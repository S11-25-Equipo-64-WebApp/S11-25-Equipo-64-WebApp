"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { ApiKeyPanel } from "@/components/dashboard/ApiKeyPanel";
import { EntryFilters, type EntryFiltersState } from "@/components/dashboard/EntryFilters";
import { EntryTable } from "@/components/dashboard/EntryTable";
import { ErrorBanner } from "@/components/dashboard/ErrorBanner";
import { EntryStatusBadge } from "@/components/dashboard/EntryStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiContext } from "@/context/api-context";
import type { ApiError, Entry } from "@/lib/api/client";
import { EntryStatus } from "@/lib/enums/entry-status";

export default function DashboardEntriesPage() {
  const { role, client, authHeaders, apiKey } = useApiContext();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [filters, setFilters] = useState<EntryFiltersState>(() => ({
    includeDrafts: role !== "public",
    status: role === "public" ? "approved" : undefined,
    tag: "",
    author: "",
    sort: "date_desc",
  }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [approvingSlug, setApprovingSlug] = useState<string | null>(null);

  const canEdit = useMemo(() => role !== "public", [role]);
  const canApprove = useMemo(() => role === "admin", [role]);
  const hasWriteAuth = useMemo(
    () => Boolean(authHeaders.apiKey || authHeaders.bearerToken),
    [authHeaders.apiKey, authHeaders.bearerToken]
  );

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      includeDrafts: role !== "public",
      status: role === "public" ? "approved" : prev.status,
    }));
  }, [role]);

  useEffect(() => {
    void fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, apiKey]);

  const fetchEntries = async () => {
    setLoading(true);
    setError(null);
    const effectiveFilters: EntryFiltersState = {
      ...filters,
      includeDrafts: role !== "public" && filters.includeDrafts,
      status: role === "public" ? "approved" : filters.status,
    };
    const result = await client.listEntries({
      auth: role === "public" ? undefined : authHeaders,
      filters: effectiveFilters,
    });
    setLoading(false);

    if (result.error) {
      setError(result.error);
      setEntries([]);
      return;
    }

    setEntries(result.data ?? []);
  };

  const handleApprove = async (slug: string, approve: boolean) => {
    if (!hasWriteAuth) {
      setError({ status: 401, message: "Necesitas credenciales (API key o Supabase) para aprobar/revertir" });
      return;
    }
    setApprovingSlug(slug);
    const result = await client.approveEntry(slug, approve, authHeaders);
    setApprovingSlug(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.data) {
      setEntries((prev) => prev.map((item) => (item.slug === slug ? result.data! : item)));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Dashboard de testimonios</h1>
          <p className="text-sm text-muted-foreground">
            Listamos usando GET /entries con filtros del spec. Editor ve drafts, admin puede aprobar.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Rol activo:</span>
            <Badge variant="outline">{role}</Badge>
            <span className="hidden text-muted-foreground sm:inline">
              {canEdit ? "Acciones de edición habilitadas" : "Modo público: solo publicados"}
            </span>
          </div>
        </div>
        <Button asChild disabled={!canEdit}>
          <Link href="/dashboard/entries/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" aria-hidden />
            Nueva entrada
          </Link>
        </Button>
      </div>

      <ApiKeyPanel />

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Entradas recientes</CardTitle>
          <CardDescription>
            Usa filtros de estado, tag, autor y sort. Las respuestas de error siguen el contrato
            serverResponse (message, issues, code).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <EntryFilters
            value={filters}
            onChange={setFilters}
            onApply={() => void fetchEntries()}
            loading={loading}
            role={role}
          />
          {error ? <ErrorBanner error={error} /> : null}
          <EntryTable
            entries={entries}
            role={role}
            onApprove={canApprove ? handleApprove : undefined}
            approvingSlug={approvingSlug}
          />
          {loading ? <p className="text-sm text-muted-foreground">Cargando entradas...</p> : null}
          <div className="text-xs text-muted-foreground">
            Para ver solo publicados, quita la API key o apaga &quot;incluir borradores&quot;.
          </div>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Estados y aprobaciones</CardTitle>
          <CardDescription>
            {"Admin dispara POST /entries/{slug}/approve. Editor no verá estos controles."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <EntryStatusBadge status={EntryStatus.DRAFT} />
            <span>Crear o editar deja el entry en borrador.</span>
          </div>
          <div className="flex items-center gap-2">
            <EntryStatusBadge status={EntryStatus.APPROVED} />
            <span>Solo admin puede aprobar o revertir vía endpoint dedicado.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
