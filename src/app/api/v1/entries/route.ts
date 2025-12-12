import { NextRequest } from "next/server";
import { z } from "zod";

import { getRequestAuth, hasEditorAccess } from "@/app/api/helpers/auth";
import { conflict, forbidden, jsonResponse, unauthorized, validationError } from "@/app/api/helpers/response";
import {
  CreateEntryPayload,
  createEntry,
  getEntryEtag,
  listEntries,
} from "@/app/api/v1/_data/entries";
import {
  createEntryDb,
  isEntriesDbEnabled,
  listEntriesDb,
} from "@/app/api/v1/_data/entries-db";
import { MediaSource } from "@/lib/constants/media-sources";
import { EntryStatus } from "@/lib/enums/entry-status";
import { withAuth } from "@/app/api/helpers/with-auth";

const mediaSourceSchema = z.union([
  z.literal(MediaSource.NONE),
  z.literal(MediaSource.CLOUDINARY_IMAGE),
  z.literal(MediaSource.CLOUDINARY_VIDEO),
  z.literal(MediaSource.YOUTUBE_VIDEO),
]);

const createEntrySchema: z.ZodType<CreateEntryPayload> = z.object({
  title: z.string().max(200),
  content: z.string().max(5000).optional(),
  mediaUrl: z.string().url().optional(),
  mediaSource: mediaSourceSchema,
  summary: z.string().max(280).optional(),
  date: z.string().datetime().optional(),
  tags: z
    .array(z.string().max(50))
    .max(10)
    .refine((arr) => new Set(arr).size === arr.length, {
      message: "Tags must be unique",
      path: ["tags"],
    })
    .optional(),
  author: z.string().max(120),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  org: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const includeDraftsParam = searchParams.get("includeDrafts");
  const statusParam = searchParams.get("status");
  const tag = searchParams.get("tag") ?? undefined;
  const author = searchParams.get("author") ?? undefined;
  const sortParam = searchParams.get("sort") ?? undefined;
  const org = searchParams.get("org") ?? "default";

  const { user, role } = await getRequestAuth(request);

  const wantsDrafts =
    includeDraftsParam === "true" ||
    includeDraftsParam === "1" ||
    includeDraftsParam === "yes";

  let status: EntryStatus | undefined;
  if (statusParam) {
    if (statusParam === EntryStatus.DRAFT || statusParam === EntryStatus.APPROVED) {
      status = statusParam as EntryStatus;
    } else {
      return validationError("Invalid status filter", [
        { path: ["status"], message: "Accepted values: approved | draft" },
      ]);
    }
  }

  let sort: "date_desc" | "date_asc" | undefined;
  if (sortParam) {
    if (sortParam === "date_desc" || sortParam === "date_asc") {
      sort = sortParam;
    } else {
      return validationError("Invalid sort value", [
        { path: ["sort"], message: "Accepted values: date_desc | date_asc" },
      ]);
    }
  }

  const requiresDraftAccess = wantsDrafts || status === EntryStatus.DRAFT;

  if (requiresDraftAccess) {
    if (!user) {
      return unauthorized("Draft entries require valid credentials (API key or bearer)");
    }

    if (!hasEditorAccess(role)) {
      return forbidden("Draft entries require editor or admin role");
    }
  }

  const includeDrafts =
    hasEditorAccess(role) && (wantsDrafts || status === EntryStatus.DRAFT);

  const data = isEntriesDbEnabled()
    ? await listEntriesDb({
        includeDrafts,
        status,
        tag,
        author,
        sort,
        org,
      })
    : listEntries({
        includeDrafts,
        status,
        tag,
        author,
        sort,
        org,
      });

  const response = jsonResponse(200, "Entries retrieved", data);

  if (!includeDrafts) {
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );
  }

  return response;
}

export const POST = withAuth(
  async (request: NextRequest, context?: { user?: { org?: string } }) => {
    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return validationError("Invalid JSON body", [
        { path: ["body"], message: "Body must be valid JSON" },
      ]);
    }

    const body = createEntrySchema.safeParse(json);

    if (!body.success) {
      return validationError("Invalid request body", body.error.issues);
    }

    const result = isEntriesDbEnabled()
      ? await createEntryDb({ ...body.data, org: context?.user?.org ?? "default" })
      : createEntry({ ...body.data, org: context?.user?.org ?? "default" });

    if (!result.ok) {
      return conflict("Slug already exists", [
        { path: ["slug"], message: "Slug must be unique" },
      ]);
    }

    const response = jsonResponse(201, "Entry created (draft)", result.entry);
    response.headers.set("ETag", getEntryEtag(result.entry));
    return response;
  },
  ["editor", "admin"]
);
