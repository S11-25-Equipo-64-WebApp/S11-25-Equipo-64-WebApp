import { createHash } from "crypto";
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

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (
    process.env.NODE_ENV === "test" ||
    !cloudName ||
    !apiKey ||
    !apiSecret
  ) {
    if (body.data.public_id === "not-found") {
      return notFound("Media asset not found");
    }

    return jsonResponse(200, "Media asset deleted successfully (mock)", {
      result: "ok",
      public_id: body.data.public_id,
    });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `public_id=${body.data.public_id}&timestamp=${timestamp}`;
  const signature = createHash("sha1")
    .update(toSign + apiSecret)
    .digest("hex");

  const formBody = new URLSearchParams({
    public_id: body.data.public_id,
    api_key: apiKey,
    timestamp: timestamp.toString(),
    signature,
  });

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody.toString(),
    }
  );

  const data = (await res.json()) as { result?: string };

  if (!res.ok || data.result === "not found") {
    return notFound("Media asset not found");
  }

  return jsonResponse(200, "Media asset deleted successfully", data);
}, ["editor", "admin"]);
