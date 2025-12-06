import { NextRequest, NextResponse } from "next/server";

import { EntryStatus } from "@/lib/constants/entry-status";

type MockEntry = {
  id: string;
  title: string;
  status: EntryStatus;
  updatedAt: string;
};

const baseEntry: Omit<MockEntry, "updatedAt"> = {
  id: "entry-123",
  title: "Placeholder entry",
  status: EntryStatus.DRAFT,
};

function buildMockEntry(overrides: Partial<MockEntry> = {}): MockEntry {
  return {
    ...baseEntry,
    ...overrides,
    updatedAt: new Date().toISOString(),
  };
}

function normalizePayload(payload: unknown): Partial<MockEntry> {
  if (!payload || typeof payload !== "object") {
    return {};
  }

  const { id, title, status } = payload as Record<string, unknown>;

  const normalizedStatus: EntryStatus | undefined =
    status === EntryStatus.DRAFT || status === EntryStatus.PUBLISHED
      ? status
      : undefined;

  return {
    id: typeof id === "string" ? id : undefined,
    title: typeof title === "string" ? title : undefined,
    status: normalizedStatus,
  };
}

async function readBody(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function GET() {
  return NextResponse.json({
    message: "Mock entry retrieved",
    entry: buildMockEntry(),
  });
}

export async function POST(request: NextRequest) {
  const body = await readBody(request);
  const payload = normalizePayload(body);

  return NextResponse.json(
    {
      message: "Mock entry created (placeholder)",
      received: body ?? {},
      entry: buildMockEntry({
        ...payload,
        id: payload.id ?? "entry-new",
        title: payload.title ?? "New mock entry",
        status: payload.status as EntryStatus,
      }),
    },
    { status: 201 }
  );
}

export async function PUT(request: NextRequest) {
  const body = await readBody(request);
  const payload = normalizePayload(body);

  return NextResponse.json({
    message: "Mock entry updated (placeholder)",
    received: body ?? {},
    entry: buildMockEntry({
      ...payload,
      id: payload.id ?? baseEntry.id,
    }),
  });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idFromQuery = searchParams.get("id");

  return NextResponse.json({
    message: "Mock entry deleted (placeholder)",
    id: idFromQuery ?? baseEntry.id,
    note: "No data was changed; this endpoint is a mock.",
  });
}
