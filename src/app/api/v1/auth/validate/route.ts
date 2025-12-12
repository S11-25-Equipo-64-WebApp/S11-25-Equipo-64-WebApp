import { NextRequest } from "next/server";

import { requireAuth } from "@/app/api/helpers/auth";
import { jsonResponse } from "@/app/api/helpers/response";
import { withErrorLogging } from "@/app/api/helpers/with-error-logging";

export const POST = withErrorLogging(async (request: NextRequest) => {
  const auth = await requireAuth(request);
  if (auth.error) return auth.error;

  const user = auth.user!;

  return jsonResponse(200, "API key validated", {
    id: user.id,
    email: user.email ?? null,
    role: user.role,
    org: user.org,
  });
}, "POST /api/v1/auth/validate");
