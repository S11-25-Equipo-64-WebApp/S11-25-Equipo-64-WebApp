import { EntryStatus } from "@/lib/enums/entry-status";

import { findEntryBySlugDb, isEntriesDbEnabled } from "@/app/api/v1/_data/entries-db";
import { findEntryBySlug, type EntryRecord } from "@/app/api/v1/_data/entries";

export const revalidate = 60;

async function fetchEntry(org: string, slug: string): Promise<EntryRecord | null> {
  if (isEntriesDbEnabled()) {
    const entry = await findEntryBySlugDb(slug, org);
    if (!entry || entry.status !== EntryStatus.APPROVED) return null;
    return entry;
  }

  const entry = findEntryBySlug(slug, org);
  if (!entry || entry.status !== EntryStatus.APPROVED) return null;
  return entry;
}

export function generateStaticParams() {
  return [{ org: "default", slug: "lanzamiento-del-cms" }];
}

export default async function EntryPage({
  params,
}: {
  params: { org: string; slug: string };
}) {
  const entry = await fetchEntry(params.org ?? "default", params.slug);

  if (!entry) {
    return (
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold">Entrada no encontrada</h1>
        <p className="text-muted-foreground">
          No pudimos encontrar el testimonio solicitado.
        </p>
      </section>
    );
  }

  return (
    <article className="space-y-4 rounded-2xl border border-border bg-card/70 p-6 shadow-sm">
      <div className="space-y-1">
        <p className="text-sm uppercase tracking-wide text-primary">{params.org}</p>
        <h1 className="text-3xl font-semibold text-foreground">{entry.title}</h1>
        <p className="text-sm text-muted-foreground">
          {entry.author} · {new Date(entry.date).toLocaleDateString()}
        </p>
      </div>
      {entry.summary ? (
        <p className="text-lg text-foreground/90">{entry.summary}</p>
      ) : null}
      {entry.content ? (
        <p className="whitespace-pre-wrap text-base text-foreground/90">{entry.content}</p>
      ) : null}
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="rounded-full bg-background px-2 py-1">{entry.status}</span>
        {(entry.tags ?? []).map((tag) => (
          <span key={tag} className="rounded-full bg-background px-2 py-1">
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );
}
