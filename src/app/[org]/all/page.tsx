import Link from "next/link";

import { EntryStatus } from "@/lib/enums/entry-status";

type Entry = {
  id: string;
  title: string;
  summary?: string;
  content?: string;
  mediaUrl?: string;
  mediaSource: number;
  date: string;
  tags?: string[];
  author: string;
  status: EntryStatus;
  slug: string;
};

type ApiResponse<T> = {
  status: number;
  message: string | null;
  data: T;
};

async function fetchEntries(org: string): Promise<Entry[]> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/v1/entries?org=${org}`, {
    cache: "force-cache",
  });
  if (!res.ok) return [];
  const json = (await res.json()) as ApiResponse<Entry[]>;
  return json.data ?? [];
}

export function generateStaticParams() {
  return [{ org: "default" }];
}

export default async function OrgEntriesPage({
  params,
}: {
  params: { org: string };
}) {
  const entries = await fetchEntries(params.org ?? "default");

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {params.org}
        </p>
        <h1 className="text-3xl font-semibold text-foreground">Testimonios publicados</h1>
        <p className="text-muted-foreground">
          Página SSG usando GET /api/v1/entries (solo publicados sin API key).
        </p>
      </header>

      <div className="grid gap-4">
        {entries.map((entry) => (
          <article
            key={entry.id}
            className="rounded-xl border border-border bg-card/70 p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  <Link href={`/${params.org}/entry/${entry.slug}`}>{entry.title}</Link>
                </h2>
                <p className="text-sm text-muted-foreground">{entry.author}</p>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground">
                {entry.status}
              </span>
            </div>
            {entry.summary ? (
              <p className="mt-2 text-sm text-foreground/90">{entry.summary}</p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-background px-2 py-1">
                {new Date(entry.date).toLocaleDateString()}
              </span>
              {(entry.tags ?? []).map((tag) => (
                <span key={tag} className="rounded-full bg-background px-2 py-1">
                  #{tag}
                </span>
              ))}
            </div>
          </article>
        ))}
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay testimonios publicados aún.</p>
        ) : null}
      </div>
    </section>
  );
}
