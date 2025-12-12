if (typeof process !== "undefined" && process.env.NODE_ENV !== "test") {
  await import("server-only");
}

import { randomUUID } from "crypto";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type {
  CreateEntryPayload,
  EntryMutationResult,
  EntryRecord,
  ListEntriesOptions,
  UpdateEntryPayload,
} from "@/app/api/v1/_data/entries";
import { MediaSource } from "@/lib/constants/media-sources";
import { EntryStatus } from "@/lib/enums/entry-status";
import { logger } from "@/lib/logger";

type DbEntry = {
  id: string;
  title: string;
  content: string | null;
  media_url: string | null;
  media_source: number;
  summary: string | null;
  date: string;
  tags: string[] | null;
  author: string;
  status: EntryStatus;
  slug: string;
  org: string;
  created_at: string;
  updated_at: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin: SupabaseClient | null = null;
const dbLogger = logger.child({ scope: "entries-db" });

function getSupabaseAdminClient() {
  if (supabaseAdmin) return supabaseAdmin;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  return supabaseAdmin;
}

export function isEntriesDbEnabled() {
  if (process.env.NODE_ENV === "test") return false;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return false;
  return process.env.USE_DB !== "false";
}

function slugify(value: string) {
  const base = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base || "entry";
}

function normalizeEtag(etag?: string | null) {
  if (!etag) return undefined;
  return etag.replace(/^W\//, "").replace(/^"+|"+$/g, "");
}

function mapDbToEntry(row: DbEntry): EntryRecord {
  return {
    id: row.id,
    title: row.title,
    content: row.content ?? undefined,
    mediaUrl: row.media_url ?? undefined,
    mediaSource: row.media_source as MediaSource,
    summary: row.summary ?? undefined,
    date: row.date,
    tags: row.tags ?? undefined,
    author: row.author,
    status: row.status,
    slug: row.slug,
    org: row.org,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getSupabaseErrorFields(error: unknown) {
  if (!error || typeof error !== "object") return undefined;
  const candidate = error as Partial<{
    message: string;
    details: string;
    hint: string;
    code: string;
  }>;

  return {
    message: candidate.message,
    details: candidate.details,
    hint: candidate.hint,
    code: candidate.code,
  };
}

async function isSlugTaken(slug: string, org: string, excludeId?: string) {
  const client = getSupabaseAdminClient();
  if (!client) return false;
  let query = client.from("entries").select("id").eq("org", org).eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { data, error } = await query.maybeSingle();
  if (error) {
    dbLogger.warn(
      { op: "isSlugTaken", org, slug, excludeId, error: getSupabaseErrorFields(error) },
      "Supabase query failed"
    );
    return false;
  }
  return Boolean(data);
}

export async function listEntriesDb(options: ListEntriesOptions): Promise<EntryRecord[]> {
  const client = getSupabaseAdminClient();
  if (!client) {
    dbLogger.debug({ op: "listEntriesDb" }, "Supabase client unavailable");
    return [];
  }

  const org = options.org ?? "default";
  const sortOrder = options.sort ?? "date_desc";

  const startedAt = Date.now();
  let query = client.from("entries").select("*").eq("org", org);

  if (!options.includeDrafts) {
    query = query.neq("status", EntryStatus.DRAFT);
  }
  if (options.status) {
    query = query.eq("status", options.status);
  }
  if (options.tag) {
    query = query.contains("tags", [options.tag]);
  }
  if (options.author) {
    query = query.eq("author", options.author);
  }

  query = query.order("date", { ascending: sortOrder === "date_asc" });

  const { data, error } = await query;
  if (error || !data) {
    dbLogger.warn(
      {
        op: "listEntriesDb",
        org,
        includeDrafts: options.includeDrafts,
        status: options.status,
        tag: options.tag,
        author: options.author,
        sort: options.sort,
        durationMs: Date.now() - startedAt,
        error: getSupabaseErrorFields(error),
      },
      "Failed to list entries from DB"
    );
    return [];
  }

  dbLogger.debug(
    {
      op: "listEntriesDb",
      org,
      count: (data as DbEntry[]).length,
      durationMs: Date.now() - startedAt,
    },
    "Listed entries from DB"
  );

  return (data as DbEntry[]).map(mapDbToEntry);
}

export async function findEntryBySlugDb(slug: string, org = "default") {
  const client = getSupabaseAdminClient();
  if (!client) {
    dbLogger.debug({ op: "findEntryBySlugDb", org, slug }, "Supabase client unavailable");
    return undefined;
  }

  const startedAt = Date.now();
  const { data, error } = await client
    .from("entries")
    .select("*")
    .eq("slug", slug)
    .eq("org", org)
    .maybeSingle();

  if (error || !data) {
    if (error) {
      dbLogger.warn(
        {
          op: "findEntryBySlugDb",
          org,
          slug,
          durationMs: Date.now() - startedAt,
          error: getSupabaseErrorFields(error),
        },
        "Failed to fetch entry from DB"
      );
    } else {
      dbLogger.debug(
        { op: "findEntryBySlugDb", org, slug, durationMs: Date.now() - startedAt },
        "Entry not found in DB"
      );
    }
    return undefined;
  }

  dbLogger.debug(
    { op: "findEntryBySlugDb", org, slug, id: (data as DbEntry).id, durationMs: Date.now() - startedAt },
    "Fetched entry from DB"
  );
  return mapDbToEntry(data as DbEntry);
}

export async function createEntryDb(payload: CreateEntryPayload): Promise<EntryMutationResult> {
  const client = getSupabaseAdminClient();
  if (!client) {
    dbLogger.warn({ op: "createEntryDb" }, "Supabase client unavailable");
    return { ok: false, error: "conflict" };
  }

  const baseSlug = slugify(payload.slug ?? payload.title);
  const org = payload.org ?? "default";

  if (await isSlugTaken(baseSlug, org)) {
    dbLogger.info({ op: "createEntryDb", org, slug: baseSlug }, "Slug conflict on create");
    return { ok: false, error: "conflict" };
  }

  const nowIso = new Date().toISOString();

  const insertPayload: Partial<DbEntry> = {
    id: randomUUID(),
    title: payload.title,
    content: payload.content ?? null,
    media_url: payload.mediaUrl ?? null,
    media_source: payload.mediaSource,
    summary: payload.summary ?? null,
    date: payload.date ?? nowIso,
    tags: payload.tags ?? null,
    author: payload.author,
    status: EntryStatus.DRAFT,
    slug: baseSlug,
    org,
    created_at: nowIso,
    updated_at: nowIso,
  };

  const startedAt = Date.now();
  const { data, error } = await client
    .from("entries")
    .insert(insertPayload)
    .select("*")
    .single();

  if (error || !data) {
    dbLogger.warn(
      {
        op: "createEntryDb",
        org,
        slug: baseSlug,
        durationMs: Date.now() - startedAt,
        error: getSupabaseErrorFields(error),
      },
      "Failed to create entry in DB"
    );
    return { ok: false, error: "conflict" };
  }

  dbLogger.info(
    {
      op: "createEntryDb",
      org,
      slug: (data as DbEntry).slug,
      id: (data as DbEntry).id,
      durationMs: Date.now() - startedAt,
    },
    "Created entry in DB"
  );
  return { ok: true, entry: mapDbToEntry(data as DbEntry) };
}

export async function updateEntryDb(
  slug: string,
  org: string,
  payload: UpdateEntryPayload,
  expectedEtag?: string | null
): Promise<EntryMutationResult> {
  const client = getSupabaseAdminClient();
  if (!client) {
    dbLogger.warn({ op: "updateEntryDb", org, slug }, "Supabase client unavailable");
    return { ok: false, error: "not_found" };
  }

  const current = await findEntryBySlugDb(slug, org);
  if (!current) return { ok: false, error: "not_found" };

  const normalized = normalizeEtag(expectedEtag);
  if (normalized && normalized !== current.updatedAt) {
    dbLogger.info({ op: "updateEntryDb", org, slug, id: current.id }, "ETag precondition failed");
    return { ok: false, error: "precondition_failed" };
  }

  const nextSlug = payload.title !== undefined ? slugify(payload.title) : current.slug;
  if (nextSlug !== current.slug && (await isSlugTaken(nextSlug, org, current.id))) {
    dbLogger.info(
      { op: "updateEntryDb", org, slug, id: current.id, nextSlug },
      "Slug conflict on update"
    );
    return { ok: false, error: "conflict" };
  }

  const nowIso = new Date().toISOString();
  const updates: Partial<DbEntry> = {
    updated_at: nowIso,
    status: EntryStatus.DRAFT,
  };

  if (payload.title !== undefined) {
    updates.title = payload.title;
    updates.slug = nextSlug;
  }
  if (payload.content !== undefined) updates.content = payload.content ?? null;
  if (payload.mediaUrl !== undefined) updates.media_url = payload.mediaUrl ?? null;
  if (payload.mediaSource !== undefined) updates.media_source = payload.mediaSource;
  if (payload.summary !== undefined) updates.summary = payload.summary ?? null;
  if (payload.date !== undefined) updates.date = payload.date;
  if (payload.tags !== undefined) updates.tags = payload.tags ?? null;
  if (payload.author !== undefined) updates.author = payload.author;

  const startedAt = Date.now();
  const { data, error } = await client
    .from("entries")
    .update(updates)
    .eq("id", current.id)
    .select("*")
    .single();

  if (error || !data) {
    dbLogger.warn(
      {
        op: "updateEntryDb",
        org,
        slug,
        id: current.id,
        durationMs: Date.now() - startedAt,
        error: getSupabaseErrorFields(error),
      },
      "Failed to update entry in DB"
    );
    return { ok: false, error: "not_found" };
  }

  dbLogger.info(
    {
      op: "updateEntryDb",
      org,
      slug: (data as DbEntry).slug,
      id: (data as DbEntry).id,
      durationMs: Date.now() - startedAt,
    },
    "Updated entry in DB"
  );
  return { ok: true, entry: mapDbToEntry(data as DbEntry) };
}

export async function approveEntryDb(
  slug: string,
  org: string,
  approve: boolean,
  expectedEtag?: string | null
): Promise<EntryMutationResult> {
  const client = getSupabaseAdminClient();
  if (!client) {
    dbLogger.warn({ op: "approveEntryDb", org, slug }, "Supabase client unavailable");
    return { ok: false, error: "not_found" };
  }

  const current = await findEntryBySlugDb(slug, org);
  if (!current) return { ok: false, error: "not_found" };

  const normalized = normalizeEtag(expectedEtag);
  if (normalized && normalized !== current.updatedAt) {
    dbLogger.info({ op: "approveEntryDb", org, slug, id: current.id }, "ETag precondition failed");
    return { ok: false, error: "precondition_failed" };
  }

  const nowIso = new Date().toISOString();
  const updates: Partial<DbEntry> = {
    status: approve ? EntryStatus.APPROVED : EntryStatus.DRAFT,
    updated_at: nowIso,
  };

  const startedAt = Date.now();
  const { data, error } = await client
    .from("entries")
    .update(updates)
    .eq("id", current.id)
    .select("*")
    .single();

  if (error || !data) {
    dbLogger.warn(
      {
        op: "approveEntryDb",
        org,
        slug,
        id: current.id,
        approve,
        durationMs: Date.now() - startedAt,
        error: getSupabaseErrorFields(error),
      },
      "Failed to approve entry in DB"
    );
    return { ok: false, error: "not_found" };
  }

  dbLogger.info(
    {
      op: "approveEntryDb",
      org,
      slug: (data as DbEntry).slug,
      id: (data as DbEntry).id,
      approve,
      durationMs: Date.now() - startedAt,
    },
    "Updated approval status in DB"
  );
  return { ok: true, entry: mapDbToEntry(data as DbEntry) };
}
