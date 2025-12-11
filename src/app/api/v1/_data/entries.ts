if (typeof process !== "undefined" && process.env.NODE_ENV !== "test") {
  await import("server-only");
}

import { randomUUID } from "crypto";

import { MediaSource } from "@/lib/constants/media-sources";
import { EntryStatus } from "@/lib/enums/entry-status";
import { buildSeedEntries } from "@/app/api/v1/_data/seeds";

export interface EntryRecord {
  id: string;
  title: string;
  content?: string;
  mediaUrl?: string;
  mediaSource: MediaSource;
  summary?: string;
  date: string;
  tags?: string[];
  author: string;
  status: EntryStatus;
  slug: string;
  org: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEntryPayload {
  title: string;
  content?: string;
  mediaUrl?: string;
  mediaSource: MediaSource;
  summary?: string;
  date?: string;
  tags?: string[];
  author: string;
  slug?: string;
  org?: string;
}

export interface UpdateEntryPayload {
  title?: string;
  content?: string;
  mediaUrl?: string;
  mediaSource?: MediaSource;
  summary?: string;
  date?: string;
  tags?: string[];
  author?: string;
  status?: EntryStatus;
}

export interface ListEntriesOptions {
  includeDrafts: boolean;
  status?: EntryStatus;
  tag?: string;
  author?: string;
  sort?: "date_desc" | "date_asc";
  org?: string;
}

export type EntryMutationError = "not_found" | "conflict" | "precondition_failed";
export type EntryMutationResult =
  | { ok: true; entry: EntryRecord }
  | { ok: false; error: EntryMutationError };

const entries: EntryRecord[] = buildSeedEntries();

function slugify(value: string) {
  const base = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base || "entry";
}

function isSlugTaken(slug: string, org: string, excludeId?: string) {
  return entries.some(
    (entry) =>
      entry.org === org && entry.slug === slug && (!excludeId || entry.id !== excludeId)
  );
}

function cloneEntry(entry: EntryRecord): EntryRecord {
  return {
    ...entry,
    tags: entry.tags ? [...entry.tags] : undefined,
  };
}

function normalizeEtag(etag?: string | null) {
  if (!etag) return undefined;
  return etag.replace(/^W\//, "").replace(/^"+|"+$/g, "");
}

export function getEntryEtag(entry: EntryRecord) {
  return `"${entry.updatedAt}"`;
}

export function listEntries(options: ListEntriesOptions) {
  const org = options.org ?? "default";
  const sortOrder = options.sort ?? "date_desc";

  let filtered = entries.filter((entry) => {
    if (entry.org !== org) return false;
    if (!options.includeDrafts && entry.status === EntryStatus.DRAFT) return false;
    if (options.status && entry.status !== options.status) return false;
    if (options.tag && !(entry.tags ?? []).includes(options.tag)) return false;
    if (options.author && entry.author !== options.author) return false;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    const aDate = new Date(a.date).getTime();
    const bDate = new Date(b.date).getTime();
    return sortOrder === "date_asc" ? aDate - bDate : bDate - aDate;
  });

  return filtered.map(cloneEntry);
}

export function resetEntries(seed?: EntryRecord[]) {
  entries.splice(0, entries.length, ...(seed ?? buildSeedEntries()));
  return listEntries({ includeDrafts: true, org: "default" });
}

export function findEntryBySlug(slug: string, org = "default") {
  const entry = entries.find((item) => item.slug === slug && item.org === org);
  return entry ? cloneEntry(entry) : undefined;
}

export function createEntry(payload: CreateEntryPayload): EntryMutationResult {
  const baseSlug = slugify(payload.slug ?? payload.title);
  const org = payload.org ?? "default";

  if (isSlugTaken(baseSlug, org)) {
    return { ok: false, error: "conflict" };
  }

  const nowIso = new Date().toISOString();

  const entry: EntryRecord = {
    id: randomUUID(),
    title: payload.title,
    content: payload.content,
    mediaUrl: payload.mediaUrl,
    mediaSource: payload.mediaSource,
    summary: payload.summary,
    date: payload.date ?? nowIso,
    tags: payload.tags,
    author: payload.author,
    status: EntryStatus.DRAFT,
    slug: baseSlug,
    org,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  entries.unshift(entry);
  return { ok: true, entry: cloneEntry(entry) };
}

export function updateEntry(
  slug: string,
  org: string,
  payload: UpdateEntryPayload,
  expectedEtag?: string | null
): EntryMutationResult {
  const entry = entries.find((item) => item.slug === slug && item.org === org);
  if (!entry) return { ok: false, error: "not_found" };

  const normalizedEtag = normalizeEtag(expectedEtag);
  if (normalizedEtag && normalizedEtag !== entry.updatedAt) {
    return { ok: false, error: "precondition_failed" };
  }

  const nowIso = new Date().toISOString();
  const nextSlug = payload.title !== undefined ? slugify(payload.title) : entry.slug;

  if (nextSlug !== entry.slug && isSlugTaken(nextSlug, entry.org, entry.id)) {
    return { ok: false, error: "conflict" };
  }

  if (payload.title !== undefined) {
    entry.title = payload.title;
    entry.slug = nextSlug;
  }
  if (payload.content !== undefined) entry.content = payload.content;
  if (payload.mediaUrl !== undefined) entry.mediaUrl = payload.mediaUrl;
  if (payload.mediaSource !== undefined) entry.mediaSource = payload.mediaSource;
  if (payload.summary !== undefined) entry.summary = payload.summary;
  if (payload.date !== undefined) entry.date = payload.date;
  if (payload.tags !== undefined) entry.tags = payload.tags;
  if (payload.author !== undefined) entry.author = payload.author;

  entry.status = EntryStatus.DRAFT;
  entry.updatedAt = nowIso;

  return { ok: true, entry: cloneEntry(entry) };
}

export function approveEntry(
  slug: string,
  org: string,
  approve: boolean,
  expectedEtag?: string | null
): EntryMutationResult {
  const entry = entries.find((item) => item.slug === slug && item.org === org);
  if (!entry) return { ok: false, error: "not_found" };

  const normalizedEtag = normalizeEtag(expectedEtag);
  if (normalizedEtag && normalizedEtag !== entry.updatedAt) {
    return { ok: false, error: "precondition_failed" };
  }

  entry.status = approve ? EntryStatus.APPROVED : EntryStatus.DRAFT;
  entry.updatedAt = new Date().toISOString();

  return { ok: true, entry: cloneEntry(entry) };
}
