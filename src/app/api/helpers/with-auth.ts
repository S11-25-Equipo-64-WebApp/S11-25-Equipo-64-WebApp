import { NextRequest } from "next/server";

import { ApiRole, ApiUser, requireAuth } from "@/app/api/helpers/auth";

export function withAuth<
  T extends (
    req: NextRequest,
    ctx?: Record<string, unknown> & { user?: ApiUser }
  ) => Promise<Response> | Response
>(handler: T, allowedRoles?: ApiRole[]) {
  return async (req: NextRequest, ctx?: Record<string, unknown>) => {
    const auth = await requireAuth(req, allowedRoles);
    if (auth.error) return auth.error;

    return handler(req, { ...(ctx ?? {}), user: auth.user });
  };
}
