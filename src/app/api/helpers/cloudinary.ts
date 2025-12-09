import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import { serverResponse } from "@/schemas/server/response";

export function handleCloudinary() {
  if (!isCloudinaryConfigured()) {
    const response: serverResponse = {
      status: 500,
      message: "Cloudinary is not properly setup",
      data: null,
    };
    logger.error({ response });
    return NextResponse.json(response, { status: response.status });
  }
}

