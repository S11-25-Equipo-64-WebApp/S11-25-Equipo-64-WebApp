import { NextRequest } from "next/server";

import { ApiRole, ApiUser, requireAuth } from "@/app/api/helpers/auth";
import { jsonResponse } from "@/app/api/helpers/response";
import { logger } from "@/lib/logger";

export function withAuth<
  T extends (
    req: NextRequest,
    ctx?: Record<string, unknown> & { user?: ApiUser }
  ) => Promise<Response> | Response
>(handler: T, allowedRoles?: ApiRole[]) {
  return async (req: NextRequest, ctx?: Record<string, unknown>) => {
    const auth = await requireAuth(req, allowedRoles);
    if (auth.error) return auth.error;

    try {
      return await handler(req, { ...(ctx ?? {}), user: auth.user });
    } catch (error) {
      logger.error(
        {
          err: error,
          method: req.method,
          path: req.nextUrl.pathname,
        },
        "Unhandled API error"
      );
      return jsonResponse(500, "Internal server error");
    }
  };
}
