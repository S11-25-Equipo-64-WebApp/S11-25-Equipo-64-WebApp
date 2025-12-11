import { beforeEach, describe, expect, test } from "bun:test";

import {
  approveEntry,
  createEntry,
  getEntryEtag,
  listEntries,
  resetEntries,
  updateEntry,
} from "@/app/api/v1/_data/entries";
import { MediaSource } from "@/lib/constants/media-sources";
import { EntryStatus } from "@/lib/enums/entry-status";

describe("entry data store", () => {
  beforeEach(() => {
    resetEntries();
  });

  test("public listing excludes drafts", () => {
    const entries = listEntries({ includeDrafts: false, org: "default" });
    expect(entries.every((entry) => entry.status !== EntryStatus.DRAFT)).toBe(true);
  });

  test("includeDrafts returns both approved and drafts for editors", () => {
    const entries = listEntries({ includeDrafts: true, org: "default" });
    const statuses = new Set(entries.map((entry) => entry.status));
    expect(statuses.has(EntryStatus.APPROVED)).toBe(true);
    expect(statuses.has(EntryStatus.DRAFT)).toBe(true);
  });

  test("creating an entry starts in draft and enforces unique slug", () => {
    const first = createEntry({
      title: "Caso de prueba",
      author: "Tester",
      mediaSource: MediaSource.NONE,
      org: "default",
    });
    expect(first.ok).toBe(true);
    if (first.ok) {
      expect(first.entry.status).toBe(EntryStatus.DRAFT);
    }

    const conflict = createEntry({
      title: "Caso de prueba",
      author: "Otro",
      mediaSource: MediaSource.NONE,
      org: "default",
    });
    expect(conflict.ok).toBe(false);
    if (!conflict.ok) {
      expect(conflict.error).toBe("conflict");
    }
  });

  test("updating forces draft and requires matching ETag", () => {
    const target = listEntries({ includeDrafts: true, org: "default" })[0];
    const etag = getEntryEtag(target);

    const updated = updateEntry(
      target.slug,
      target.org,
      { summary: "Actualizado", author: "Editora" },
      etag
    );

    expect(updated.ok).toBe(true);
    if (updated.ok) {
      expect(updated.entry.status).toBe(EntryStatus.DRAFT);
      expect(updated.entry.summary).toBe("Actualizado");
    }

    const stale = updateEntry(
      target.slug,
      target.org,
      { title: "Cambio tardio" },
      etag
    );
    expect(stale.ok).toBe(false);
    if (!stale.ok) {
      expect(stale.error).toBe("precondition_failed");
    }
  });

  test("approving toggles status and honors ETag", () => {
    const draft = listEntries({ includeDrafts: true, org: "default" }).find(
      (entry) => entry.status === EntryStatus.DRAFT
    );
    expect(draft).toBeTruthy();
    if (!draft) return;

    const etag = getEntryEtag(draft);
    const approved = approveEntry(draft.slug, draft.org, true, etag);
    expect(approved.ok).toBe(true);
    if (approved.ok) {
      expect(approved.entry.status).toBe(EntryStatus.APPROVED);
    }

    const stale = approveEntry(draft.slug, draft.org, false, etag);
    expect(stale.ok).toBe(false);
    if (!stale.ok) {
      expect(stale.error).toBe("precondition_failed");
    }
  });
});
