import { useMemo } from "react";
import { FunnelIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { UserRole } from "@/context/api-context";

export type EntryFiltersState = {
  includeDrafts: boolean;
  status?: "approved" | "draft";
  tag?: string;
  author?: string;
  sort?: "date_desc" | "date_asc";
};

type Props = {
  value: EntryFiltersState;
  onChange: (next: EntryFiltersState) => void;
  onApply: () => void;
  loading?: boolean;
  role: UserRole;
};

export function EntryFilters({ value, onChange, onApply, loading, role }: Props) {
  const canSeeDrafts = useMemo(() => role !== "public", [role]);

  const update = (patch: Partial<EntryFiltersState>) => {
    onChange({ ...value, ...patch });
  };

  return (
    <Card className="border-dashed">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <FunnelIcon className="h-4 w-4" aria-hidden />
          <span>Filtros según el contrato del listado</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5">
            <Label>Estatus</Label>
            <Select
              value={value.status ?? ""}
              onValueChange={(next) => update({ status: next ? (next as "approved" | "draft") : undefined })}
              disabled={!canSeeDrafts && value.status === "draft"}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={canSeeDrafts ? "Todos" : "Solo aprobados"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="approved">Aprobado</SelectItem>
                <SelectItem value="draft" disabled={!canSeeDrafts}>
                  Borrador (requiere API key)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tag">Tag</Label>
            <Input
              id="tag"
              placeholder="marketing"
              value={value.tag ?? ""}
              onChange={(event) => update({ tag: event.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="author">Autor</Label>
            <Input
              id="author"
              placeholder="Autora o fuente"
              value={value.author ?? ""}
              onChange={(event) => update({ author: event.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Orden</Label>
            <Select
              value={value.sort ?? "date_desc"}
              onValueChange={(next) => update({ sort: next as "date_desc" | "date_asc" })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Fecha descendente</SelectItem>
                <SelectItem value="date_asc">Fecha ascendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-dashed px-3 py-2">
            <div className="space-y-0.5">
              <Label>Incluir borradores</Label>
              <p className="text-xs text-muted-foreground">
                Solo con API key de editor o admin.
              </p>
            </div>
            <Switch
              checked={value.includeDrafts}
              disabled={!canSeeDrafts}
              onCheckedChange={(checked) => update({ includeDrafts: checked })}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" onClick={onApply} disabled={loading}>
            {loading ? "Cargando..." : "Aplicar filtros"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              onChange({
                includeDrafts: canSeeDrafts,
                status: canSeeDrafts ? undefined : "approved",
                tag: "",
                author: "",
                sort: "date_desc",
              })
            }
          >
            Limpiar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
