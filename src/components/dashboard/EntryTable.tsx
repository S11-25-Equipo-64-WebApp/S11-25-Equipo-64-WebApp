import Link from "next/link";

import { EntryStatusBadge } from "@/components/dashboard/EntryStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UserRole } from "@/context/api-context";
import type { Entry } from "@/lib/api/client";
import { EntryStatus } from "@/lib/enums/entry-status";

type Props = {
  entries: Entry[];
  role: UserRole;
  onApprove?: (slug: string, approve: boolean) => void;
  approvingSlug?: string | null;
};

function formatDate(value?: string) {
  if (!value) return "Sin fecha";
  try {
    return new Intl.DateTimeFormat("es", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function EntryTable({ entries, role, onApprove, approvingSlug }: Props) {
  const canEdit = role !== "public";
  const canApprove = role === "admin" && Boolean(onApprove);

  return (
    <Card className="border-dashed">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="max-w-[240px] whitespace-normal font-medium">
                  <div className="flex flex-col">
                    <Link
                      href={`/dashboard/entries/${entry.slug}`}
                      className="text-foreground hover:text-primary"
                    >
                      {entry.title}
                    </Link>
                    <span className="text-xs text-muted-foreground">/{entry.slug}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <EntryStatusBadge status={entry.status as EntryStatus} />
                </TableCell>
                <TableCell>{entry.author}</TableCell>
                <TableCell>{formatDate(entry.date)}</TableCell>
                <TableCell className="space-x-2">
                  {entry.tags?.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                  {!entry.tags?.length ? <span className="text-xs text-muted-foreground">Sin tags</span> : null}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {canApprove ? (
                      <Button
                        size="sm"
                        variant={entry.status === EntryStatus.APPROVED ? "outline" : "default"}
                        onClick={() => onApprove?.(entry.slug, entry.status !== EntryStatus.APPROVED)}
                        disabled={approvingSlug === entry.slug}
                      >
                        {approvingSlug === entry.slug
                          ? "Actualizando..."
                          : entry.status === EntryStatus.APPROVED
                            ? "Revertir a borrador"
                            : "Aprobar"}
                      </Button>
                    ) : null}
                    {canEdit ? (
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/dashboard/entries/${entry.slug}`}>Editar</Link>
                      </Button>
                    ) : (
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/entries/${entry.slug}`}>Ver</Link>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!entries.length ? (
              <TableRow>
                <TableCell colSpan={6} className="py-6 text-center text-sm text-muted-foreground">
                  No hay resultados con los filtros actuales.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
