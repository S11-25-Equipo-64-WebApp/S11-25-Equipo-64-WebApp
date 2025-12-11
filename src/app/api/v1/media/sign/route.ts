import { jsonResponse } from "@/app/api/helpers/response";
import { withAuth } from "@/app/api/helpers/with-auth";

export const POST = withAuth(async () => {
  const timestamp = Math.floor(Date.now() / 1000);
  // Mock de firma
  const signature = `mock-signature-${timestamp}`;

  return jsonResponse(200, "Signed upload data", {
    signature,
    timestamp,
  });
}, ["editor", "admin"]);
