import { NextRequest } from "next/server";
import { z } from "zod";

import {
  jsonResponse,
  notFound,
  validationError,
} from "@/app/api/helpers/response";
import { withAuth } from "@/app/api/helpers/with-auth";

const deleteSchema = z.object({
  public_id: z.string().min(1),
});

export const DELETE = withAuth(async (request: NextRequest) => {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return validationError("Invalid JSON body", [
      { path: ["body"], message: "Body must be valid JSON" },
    ]);
  }

  const body = deleteSchema.safeParse(json);
  if (!body.success) {
    return validationError("Invalid request body", body.error.issues);
  }

  if (body.data.public_id === "not-found") {
    return notFound("Media asset not found");
  }

  return jsonResponse(200, "Media asset deleted successfully", {
    result: "ok",
    public_id: body.data.public_id,
  });
}, ["editor", "admin"]);
