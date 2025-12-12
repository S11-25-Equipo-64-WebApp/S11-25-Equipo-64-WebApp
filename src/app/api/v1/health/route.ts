import { NextResponse } from "next/server";

import { withErrorLogging } from "@/app/api/helpers/with-error-logging";

const isDev = process.env.NODE_ENV !== "production";

export const GET = withErrorLogging(() => {
  if (!isDev) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: "ok",
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}, "GET /api/v1/health");
