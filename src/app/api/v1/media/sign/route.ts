import { createHash } from "crypto";

import { jsonResponse } from "@/app/api/helpers/response";
import { withAuth } from "@/app/api/helpers/with-auth";

export const POST = withAuth(async () => {
  const timestamp = Math.floor(Date.now() / 1000);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER ?? "testimonial-cms";

  if (
    process.env.NODE_ENV === "test" ||
    !cloudName ||
    !apiKey ||
    !apiSecret
  ) {
    const signature = `mock-signature-${timestamp}`;
    return jsonResponse(200, "Signed upload data (mock)", {
      signature,
      timestamp,
      folder,
    });
  }

  const toSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = createHash("sha1")
    .update(toSign + apiSecret)
    .digest("hex");

  return jsonResponse(200, "Signed upload data", {
    signature,
    timestamp,
    folder,
  });
}, ["editor", "admin"]);
