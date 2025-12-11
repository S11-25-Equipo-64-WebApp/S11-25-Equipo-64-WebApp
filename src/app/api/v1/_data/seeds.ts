import { randomUUID } from "crypto";

import { MediaSource } from "@/lib/constants/media-sources";
import { EntryStatus } from "@/lib/enums/entry-status";

type SeedEntry = {
  title: string;
  summary: string;
  content?: string;
  mediaUrl?: string;
  mediaSource?: MediaSource;
  date: string;
  tags?: string[];
  author: string;
  status: EntryStatus;
  slug: string;
  org?: string;
};

const now = new Date();

const seedEntries: SeedEntry[] = [
  {
    title: "Lanzamiento del CMS",
    summary: "Entrada publicada para usuarios publicos.",
    content: "Primer testimonio cargado como ejemplo del flujo publicado para el sitio.",
    mediaSource: MediaSource.NONE,
    date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    tags: ["launch", "demo"],
    author: "Equipo Editorial",
    status: EntryStatus.APPROVED,
    slug: "lanzamiento-del-cms",
    org: "default",
  },
  {
    title: "Borrador de caso de exito",
    summary: "Borrador pendiente de revision.",
    content: "Ejemplo de entrada en progreso. Solo visible con API key de editor/admin.",
    mediaSource: MediaSource.NONE,
    date: now.toISOString(),
    tags: ["draft", "wip"],
    author: "Ana Editora",
    status: EntryStatus.DRAFT,
    slug: "borrador-de-caso-de-exito",
    org: "default",
  },
];

export function buildSeedEntries() {
  return seedEntries.map((seed) => {
    const createdAt = seed.status === EntryStatus.APPROVED ? seed.date : now.toISOString();
    return {
      id: randomUUID(),
      title: seed.title,
      summary: seed.summary,
      content: seed.content,
      mediaUrl: seed.mediaUrl,
      mediaSource: seed.mediaSource ?? MediaSource.NONE,
      date: seed.date,
      tags: seed.tags,
      author: seed.author,
      status: seed.status,
      slug: seed.slug,
      org: seed.org ?? "default",
      createdAt,
      updatedAt: createdAt,
    };
  });
}
