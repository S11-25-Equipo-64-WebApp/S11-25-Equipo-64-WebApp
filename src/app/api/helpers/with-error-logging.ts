import { NextRequest } from "next/server";

import { jsonResponse } from "@/app/api/helpers/response";
import { logger } from "@/lib/logger";

function getRequestMetadata(args: unknown[], routeHint?: string) {
  const first = args[0];
  const request = first && typeof first === "object" ? (first as Partial<NextRequest>) : null;

  const path =
    request && "nextUrl" in request && request.nextUrl
      ? request.nextUrl.pathname
      : routeHint;

  const method = request && "method" in request ? request.method : undefined;

  return { method, path };
}

export function withErrorLogging(
  handler: (req: NextRequest) => Promise<Response> | Response,
  routeHint?: string
): (req: NextRequest) => Promise<Response>;
export function withErrorLogging<C>(
  handler: (req: NextRequest, ctx: C) => Promise<Response> | Response,
  routeHint?: string
): (req: NextRequest, ctx: C) => Promise<Response>;
export function withErrorLogging(
  handler: (...args: any[]) => Promise<Response> | Response,
  routeHint?: string
) {
  return async (...args: any[]): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      const { method, path } = getRequestMetadata(args, routeHint);
      logger.error({ err: error, method, path }, "Unhandled API error");
      return jsonResponse(500, "Internal server error");
    }
  };
}
