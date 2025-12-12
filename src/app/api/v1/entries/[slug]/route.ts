import { NextRequest } from "next/server";
import { z } from "zod";

import { getRequestAuth, hasEditorAccess, requireAuth } from "@/app/api/helpers/auth";
import {
  conflict,
  forbidden,
  jsonResponse,
  notFound,
  unauthorized,
  validationError,
} from "@/app/api/helpers/response";
import {
  UpdateEntryPayload,
  findEntryBySlug,
  getEntryEtag,
  updateEntry,
} from "@/app/api/v1/_data/entries";
import {
  findEntryBySlugDb,
  isEntriesDbEnabled,
  updateEntryDb,
} from "@/app/api/v1/_data/entries-db";
import { MediaSource } from "@/lib/constants/media-sources";
import { EntryStatus } from "@/lib/enums/entry-status";

type RouteContext = {
  params: Promise<{ slug: string }> | { slug: string };
};

const mediaSourceSchema = z.union([
  z.literal(MediaSource.NONE),
  z.literal(MediaSource.CLOUDINARY_IMAGE),
  z.literal(MediaSource.CLOUDINARY_VIDEO),
  z.literal(MediaSource.YOUTUBE_VIDEO),
]);

const updateEntrySchema: z.ZodType<UpdateEntryPayload> = z
  .object({
    title: z.string().max(200).optional(),
    content: z.string().max(5000).optional(),
    mediaUrl: z.string().url().optional(),
    mediaSource: mediaSourceSchema.optional(),
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
    author: z.string().max(120).optional(),
    status: z.nativeEnum(EntryStatus).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
    path: ["body"],
  });

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const params = await Promise.resolve(context.params);
  const slug = params.slug ?? request.nextUrl.searchParams.get("slug");
  const org = request.nextUrl.searchParams.get("org") ?? "default";

  if (!slug) {
    return validationError("Slug is required", [
      {
        path: ["slug"],
        message: "Slug path param or ?slug query param is required",
      },
    ]);
  }

  const { user, role } = await getRequestAuth(request);
  const entry = isEntriesDbEnabled()
    ? await findEntryBySlugDb(slug, org)
    : findEntryBySlug(slug, org);

  if (!entry) {
    return notFound();
  }

  const isDraft = entry.status === EntryStatus.DRAFT;

  if (isDraft) {
    if (!user) {
      return unauthorized("Draft entries require valid credentials (API key or bearer)");
    }

    if (!hasEditorAccess(role)) {
      return forbidden("Draft entries require editor or admin role");
    }
  }

  const response = jsonResponse(200, "Entry retrieved", entry);
  response.headers.set("ETag", getEntryEtag(entry));

  if (!isDraft) {
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=120, stale-while-revalidate=600"
    );
  }

  return response;
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const auth = await requireAuth(request, ["editor", "admin"]);
  if (auth.error) return auth.error;

  const params = await Promise.resolve(context.params);
  const slug = params.slug ?? request.nextUrl.searchParams.get("slug");

  if (!slug) {
    return validationError("Slug is required", [
      {
        path: ["slug"],
        message: "Slug path param or ?slug query param is required",
      },
    ]);
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return validationError("Invalid JSON body", [
      { path: ["body"], message: "Body must be valid JSON" },
    ]);
  }

  const body = updateEntrySchema.safeParse(json);

  if (!body.success) {
    return validationError("Invalid request body", body.error.issues);
  }

  const ifMatch = request.headers.get("if-match");

  const result = isEntriesDbEnabled()
    ? await updateEntryDb(slug, auth.user?.org ?? "default", body.data, ifMatch)
    : updateEntry(slug, auth.user?.org ?? "default", body.data, ifMatch);

  if (!result.ok) {
    if (result.error === "conflict") {
      return conflict("Slug already exists", [
        { path: ["slug"], message: "Slug must be unique" },
      ]);
    }

    if (result.error === "precondition_failed") {
      return conflict("ETag does not match current version", [
        {
          path: ["If-Match"],
          message: "Provide the latest ETag to update this entry",
        },
      ]);
    }

    return notFound();
  }

  const response = jsonResponse(200, "Entry updated (draft)", result.entry);
  response.headers.set("ETag", getEntryEtag(result.entry));
  return response;
}
