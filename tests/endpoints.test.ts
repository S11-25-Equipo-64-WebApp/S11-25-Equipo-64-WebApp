import { beforeEach, describe, expect, test } from "bun:test";

import {
  GET as listEntriesHandler,
  POST as createEntryHandler,
} from "@/app/api/v1/entries/route";
import {
  GET as getEntryHandler,
  PATCH as updateEntryHandler,
} from "@/app/api/v1/entries/[slug]/route";
import { POST as approveEntryHandler } from "@/app/api/v1/entries/[slug]/approve/route";
import { POST as validateAuthHandler } from "@/app/api/v1/auth/validate/route";
import { GET as healthHandler } from "@/app/api/v1/health/route";
import { DELETE as deleteMediaHandler } from "@/app/api/v1/media/delete/route";
import { POST as signMediaHandler } from "@/app/api/v1/media/sign/route";
import {
  createEntry,
  findEntryBySlug,
  getEntryEtag,
  resetEntries,
} from "@/app/api/v1/_data/entries";
import { MediaSource } from "@/lib/constants/media-sources";
import { EntryStatus } from "@/lib/enums/entry-status";

type RequestInitLite = {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
};

function makeRequest(url: string, init: RequestInitLite = {}) {
  const headers = new Headers(init.headers ?? {});
  return {
    method: init.method ?? "GET",
    nextUrl: new URL(url, "http://localhost"),
    headers,
    json: async () => init.body,
  } as {
    method: string;
    nextUrl: URL;
    headers: Headers;
    json: () => Promise<unknown>;
  };
}

const editorHeaders = { "x-api-key": process.env.EDITOR_API_KEY ?? "editor-key" };
const adminHeaders = { "x-api-key": process.env.ADMIN_API_KEY ?? "admin-key" };
const bearerEditor = { Authorization: `Bearer ${process.env.TEST_BEARER_EDITOR ?? "test-editor"}` };
const bearerAdmin = { Authorization: `Bearer ${process.env.TEST_BEARER_ADMIN ?? "test-admin"}` };

async function readJson(res: Response) {
  return (await res.json()) as {
    status: number;
    message: string | null;
    data?: Record<string, unknown> | Record<string, unknown>[] | undefined;
  };
}

describe("API endpoints", () => {
  beforeEach(() => {
    resetEntries();
  });

  test("GET /entries returns only approved entries for public users", async () => {
    const res = await listEntriesHandler(makeRequest("/api/v1/entries"));
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect((body.data as Array<{ status: EntryStatus }>).every((e) => e.status === EntryStatus.APPROVED)).toBe(
      true
    );
  });

  test("GET /entries includeDrafts requires auth", async () => {
    const resPublic = await listEntriesHandler(
      makeRequest("/api/v1/entries?includeDrafts=true")
    );
    expect(resPublic.status).toBe(401);

    const resEditor = await listEntriesHandler(
      makeRequest("/api/v1/entries?includeDrafts=true", { headers: editorHeaders })
    );
    const body = await readJson(resEditor);
    const statuses = new Set(
      (body.data as Array<{ status: EntryStatus }>).map((e) => e.status)
    );
    expect(statuses.has(EntryStatus.DRAFT)).toBe(true);
    expect(statuses.has(EntryStatus.APPROVED)).toBe(true);

    const resBearer = await listEntriesHandler(
      makeRequest("/api/v1/entries?includeDrafts=true", { headers: bearerEditor })
    );
    const bearerBody = await readJson(resBearer);
    const bearerStatuses = new Set(
      (bearerBody.data as Array<{ status: EntryStatus }>).map((e) => e.status)
    );
    expect(resBearer.status).toBe(200);
    expect(bearerStatuses.has(EntryStatus.DRAFT)).toBe(true);
  });

  test("GET /entries supports filters (status/tag/author/sort/org)", async () => {
    // seed an extra entry with tag/author variations
    createEntry({
      title: "Caso filtrable",
      author: "Filtradora",
      mediaSource: MediaSource.NONE,
      tags: ["filter", "demo"],
      org: "org-b",
    });

    const byAuthor = await listEntriesHandler(
      makeRequest("/api/v1/entries?author=Filtradora&includeDrafts=true", {
        headers: editorHeaders,
      })
    );
    const byAuthorBody = await readJson(byAuthor);
    expect(byAuthor.status).toBe(200);
    expect(
      (byAuthorBody.data as Array<{ author: string }>).every((e) => e.author === "Filtradora")
    ).toBe(true);

    const byTag = await listEntriesHandler(
      makeRequest("/api/v1/entries?tag=filter&includeDrafts=true", {
        headers: editorHeaders,
      })
    );
    const byTagBody = await readJson(byTag);
    expect(byTag.status).toBe(200);
    expect(
      (byTagBody.data as Array<{ tags?: string[] }>).every((e) => (e.tags ?? []).includes("filter"))
    ).toBe(true);

    const byOrg = await listEntriesHandler(
      makeRequest("/api/v1/entries?org=org-b&includeDrafts=true", {
        headers: editorHeaders,
      })
    );
    const byOrgBody = await readJson(byOrg);
    expect(byOrg.status).toBe(200);
    expect((byOrgBody.data as Array<{ org: string }>).every((e) => e.org === "org-b")).toBe(true);

    const sortedAsc = await listEntriesHandler(
      makeRequest("/api/v1/entries?sort=date_asc", {
        headers: editorHeaders,
      })
    );
    const sortedAscBody = await readJson(sortedAsc);
    const dates = (sortedAscBody.data as Array<{ date: string }>).map((e) =>
      new Date(e.date).getTime()
    );
    const isAsc = dates.every((val: number, idx: number, arr: number[]) => idx === 0 || arr[idx - 1] <= val);
    expect(isAsc).toBe(true);
  });

  test("GET /entries/{slug} respects draft visibility", async () => {
    const draftSlug = "borrador-de-caso-de-exito";
    const resNoKey = await getEntryHandler(
      makeRequest(`/api/v1/entries/${draftSlug}`),
      { params: { slug: draftSlug } }
    );
    expect(resNoKey.status).toBe(401);

    const resEditor = await getEntryHandler(
      makeRequest(`/api/v1/entries/${draftSlug}`, { headers: editorHeaders }),
      { params: { slug: draftSlug } }
    );
    expect(resEditor.status).toBe(200);
    const body = await readJson(resEditor);
    expect((body.data as { slug: string }).slug).toBe(draftSlug);
  });

  test("POST /entries requires auth and creates draft", async () => {
    const unauth = await createEntryHandler(
      makeRequest("/api/v1/entries", {
        method: "POST",
        body: {
          title: "No auth",
          author: "Anon",
          mediaSource: MediaSource.NONE,
        },
      })
    );
    expect(unauth.status).toBe(401);

    const res = await createEntryHandler(
      makeRequest("/api/v1/entries", {
        method: "POST",
        headers: editorHeaders,
        body: {
          title: "Nuevo test",
          author: "Editora",
          mediaSource: MediaSource.NONE,
        },
      })
    );
    expect(res.status).toBe(201);
    const body = await readJson(res);
    expect((body.data as { status: EntryStatus }).status).toBe(EntryStatus.DRAFT);

    const resBearer = await createEntryHandler(
      makeRequest("/api/v1/entries", {
        method: "POST",
        headers: bearerEditor,
        body: {
          title: "Nuevo bearer",
          author: "Editora",
          mediaSource: MediaSource.NONE,
        },
      })
    );
    expect(resBearer.status).toBe(201);
  });

  test("POST /entries returns 400 on invalid body", async () => {
    const res = await createEntryHandler(
      makeRequest("/api/v1/entries", {
        method: "POST",
        headers: editorHeaders,
        body: { author: "Editora" }, // missing title/mediaSource
      })
    );
    expect(res.status).toBe(400);
  });

  test("PATCH /entries/{slug} enforces auth and ETag", async () => {
    const created = createEntry({
      title: "Patch target",
      author: "Editora",
      mediaSource: MediaSource.NONE,
      org: "default",
    });
    if (!created.ok) throw new Error("Failed to seed entry for PATCH test");

    const etag = getEntryEtag(created.entry);

    const noAuth = await updateEntryHandler(
      makeRequest(`/api/v1/entries/${created.entry.slug}`, {
        method: "PATCH",
        body: { summary: "fail" },
      }),
      { params: { slug: created.entry.slug } }
    );
    expect(noAuth.status).toBe(401);

    const ok = await updateEntryHandler(
      makeRequest(`/api/v1/entries/${created.entry.slug}`, {
        method: "PATCH",
        headers: { ...editorHeaders, "If-Match": etag },
        body: { summary: "Actualizado via test" },
      }),
      { params: { slug: created.entry.slug } }
    );
    expect(ok.status).toBe(200);
    const body = (await readJson(ok)).data as { summary: string; status: EntryStatus };
    expect(body.summary).toBe("Actualizado via test");
    expect(body.status).toBe(EntryStatus.DRAFT);
  });

  test("PATCH /entries/{slug} returns 409 on slug conflict", async () => {
    const first = createEntry({
      title: "Primero",
      author: "Editora",
      mediaSource: MediaSource.NONE,
      org: "default",
    });
    const second = createEntry({
      title: "Segundo",
      author: "Editora",
      mediaSource: MediaSource.NONE,
      org: "default",
    });
    if (!first.ok || !second.ok) throw new Error("Failed to seed entries for conflict");

    const res = await updateEntryHandler(
      makeRequest(`/api/v1/entries/${second.entry.slug}`, {
        method: "PATCH",
        headers: { ...editorHeaders, "If-Match": getEntryEtag(second.entry) },
        body: { title: first.entry.title },
      }),
      { params: { slug: second.entry.slug } }
    );
    expect(res.status).toBe(409);
  });

  test("POST /entries/{slug}/approve only allows admin", async () => {
    const target = findEntryBySlug("borrador-de-caso-de-exito", "default");
    if (!target) throw new Error("Seed draft missing");
    const etag = getEntryEtag(target);

    const asEditor = await approveEntryHandler(
      makeRequest(`/api/v1/entries/${target.slug}/approve`, {
        method: "POST",
        headers: { ...editorHeaders, "If-Match": etag },
        body: { approve: true },
      }),
      { params: { slug: target.slug } }
    );
    expect(asEditor.status).toBe(403);

    const asAdmin = await approveEntryHandler(
      makeRequest(`/api/v1/entries/${target.slug}/approve`, {
        method: "POST",
        headers: { ...adminHeaders, "If-Match": etag },
        body: { approve: true },
      }),
      { params: { slug: target.slug } }
    );
    expect(asAdmin.status).toBe(200);
    const body = await readJson(asAdmin);
    expect((body.data as { status: EntryStatus }).status).toBe(EntryStatus.APPROVED);

    const asBearerAdmin = await approveEntryHandler(
      makeRequest(`/api/v1/entries/${target.slug}/approve`, {
        method: "POST",
        headers: {
          ...bearerAdmin,
          "If-Match": getEntryEtag((body.data as { updatedAt?: string } | undefined) ?? undefined),
        },
        body: { approve: false },
      }),
      { params: { slug: target.slug } }
    );
    expect(asBearerAdmin.status).toBe(200);
  });

  test("POST /entries/{slug}/approve returns 404 for unknown slug", async () => {
    const res = await approveEntryHandler(
      makeRequest("/api/v1/entries/nope/approve", {
        method: "POST",
        headers: adminHeaders,
        body: { approve: true },
      }),
      { params: { slug: "nope" } }
    );
    expect(res.status).toBe(404);
  });

  test("POST /auth/validate works with API key", async () => {
    const res = await validateAuthHandler(
      makeRequest("/api/v1/auth/validate", { method: "POST", headers: editorHeaders })
    );
    expect(res.status).toBe(200);
    const body = await readJson(res);
    expect(body.data.role).toBe("editor");

    const bearer = await validateAuthHandler(
      makeRequest("/api/v1/auth/validate", { method: "POST", headers: bearerAdmin })
    );
    expect(bearer.status).toBe(200);
    const bearerBody = (await readJson(bearer)).data as { role: string };
    expect(bearerBody.role).toBe("admin");
  });

  test("POST /media/sign and DELETE /media/delete require auth", async () => {
    const noAuthSign = await signMediaHandler(makeRequest("/api/v1/media/sign", { method: "POST" }));
    expect(noAuthSign.status).toBe(401);

    const signed = await signMediaHandler(
      makeRequest("/api/v1/media/sign", { method: "POST", headers: editorHeaders })
    );
    expect(signed.status).toBe(200);

    const deleted = await deleteMediaHandler(
      makeRequest("/api/v1/media/delete", {
        method: "DELETE",
        headers: editorHeaders,
        body: { public_id: "mock-id" },
      })
    );
    expect(deleted.status).toBe(200);

    const notFound = await deleteMediaHandler(
      makeRequest("/api/v1/media/delete", {
        method: "DELETE",
        headers: editorHeaders,
        body: { public_id: "not-found" },
      })
    );
    expect(notFound.status).toBe(404);

    const invalidBody = await deleteMediaHandler(
      makeRequest("/api/v1/media/delete", {
        method: "DELETE",
        headers: editorHeaders,
        body: {},
      })
    );
    expect(invalidBody.status).toBe(400);
  });

  test("GET /health returns OK in non-production", async () => {
    const res = await healthHandler();
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string };
    expect(body.status).toBe("ok");
  });
});
