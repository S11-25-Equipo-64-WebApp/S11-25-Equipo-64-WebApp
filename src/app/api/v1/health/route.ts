import { NextResponse } from "next/server";

const isDev = process.env.NODE_ENV === "development";

export function GET() {
  if (!isDev) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: "ok",
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}
