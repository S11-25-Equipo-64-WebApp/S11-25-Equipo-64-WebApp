import { beforeEach, describe, expect, test } from "bun:test";
import React from "react";
import ReactDOMServer from "react-dom/server";

import OrgEntriesPage from "@/app/[org]/all/page";
import EntryPage from "@/app/[org]/entry/[slug]/page";
import { resetEntries, type EntryRecord } from "@/app/api/v1/_data/entries";
import { MediaSource } from "@/lib/constants/media-sources";
import { EntryStatus } from "@/lib/enums/entry-status";

function makeEntry(overrides: Partial<EntryRecord>): EntryRecord {
  const nowIso = new Date().toISOString();

  return {
    id: overrides.id ?? "1",
    title: overrides.title ?? "Titulo",
    content: overrides.content,
    mediaUrl: overrides.mediaUrl,
    mediaSource: overrides.mediaSource ?? MediaSource.NONE,
    summary: overrides.summary,
    date: overrides.date ?? nowIso,
    tags: overrides.tags,
    author: overrides.author ?? "Autora",
    status: overrides.status ?? EntryStatus.APPROVED,
    slug: overrides.slug ?? "titulo",
    org: overrides.org ?? "default",
    createdAt: overrides.createdAt ?? nowIso,
    updatedAt: overrides.updatedAt ?? nowIso,
  };
}

describe("SSG pages", () => {
  beforeEach(() => {
    resetEntries([]);
  });

  test("Org entries page renders published entries only", async () => {
    resetEntries([
      makeEntry({ id: "1", title: "Publicado", slug: "pub", status: EntryStatus.APPROVED }),
      makeEntry({ id: "2", title: "Borrador", slug: "draft", status: EntryStatus.DRAFT }),
    ]);

    const element = await OrgEntriesPage({ params: { org: "default" } });
    const html = ReactDOMServer.renderToString(element as React.ReactElement);

    expect(html).toContain("Publicado");
    expect(html).not.toContain("Borrador"); // drafts filtered by API
  });

  test("Entry page renders content", async () => {
    resetEntries([
      makeEntry({
        id: "1",
        title: "Detalle",
        slug: "detalle",
        author: "Autora",
        status: EntryStatus.APPROVED,
      }),
    ]);

    const element = await EntryPage({ params: { org: "default", slug: "detalle" } });
    const html = ReactDOMServer.renderToString(element as React.ReactElement);

    expect(html).toContain("Detalle");
    expect(html).toContain("Autora");
  });

  test("Entry page shows not found message when API returns 404", async () => {
    resetEntries([makeEntry({ id: "1", title: "Otro", slug: "otro", status: EntryStatus.APPROVED })]);

    const element = await EntryPage({ params: { org: "default", slug: "missing" } });
    const html = ReactDOMServer.renderToString(element as React.ReactElement);

    expect(html).toContain("Entrada no encontrada");
  });
});
