import { NextRequest } from "next/server";
import { z } from "zod";

import {
  conflict,
  jsonResponse,
  notFound,
  validationError,
} from "@/app/api/helpers/response";
import { approveEntry, getEntryEtag } from "@/app/api/v1/_data/entries";
import { withAuth } from "@/app/api/helpers/with-auth";

const approveSchema = z.object({
  approve: z.boolean(),
});

export const POST = withAuth(
  async (
    request: NextRequest,
    context?: { params?: { slug?: string }; user?: { org?: string } }
  ) => {
    const slug =
      context?.params?.slug ?? request.nextUrl.searchParams.get("slug");

    if (!slug) {
      return validationError("Slug is required", [
        {
          path: ["slug"],
          message: "Slug path param or ?slug query param is required",
        },
      ]);
    }

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return validationError("Invalid JSON body", [
        { path: ["body"], message: "Body must be valid JSON" },
      ]);
    }

    const body = approveSchema.safeParse(json);

    if (!body.success) {
      return validationError("Invalid request body", body.error.issues);
    }

    const ifMatch = request.headers.get("if-match");
    const result = approveEntry(
      slug,
      context?.user?.org ?? "default",
      body.data.approve,
      ifMatch
    );

    if (!result.ok) {
      if (result.error === "precondition_failed") {
        return conflict("ETag does not match current version", [
          {
            path: ["If-Match"],
            message: "Provide the latest ETag to approve this entry",
          },
        ]);
      }

      return notFound();
    }

    const response = jsonResponse(
      200,
      body.data.approve ? "Entry approved" : "Entry reverted to draft",
      result.entry
    );
    response.headers.set("ETag", getEntryEtag(result.entry));
    return response;
  },
  ["admin"]
);
