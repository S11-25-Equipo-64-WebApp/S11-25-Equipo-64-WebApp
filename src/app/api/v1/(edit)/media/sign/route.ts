import { cloudinary, cData } from "@/lib/cloudinary";
import { logger } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";
import { responseSchema } from "@/schemas/server/response";
import { uploadFolder, isCloudinaryConfigured } from "@/lib/cloudinary";

let configured = isCloudinaryConfigured;

export async function POST(request: NextRequest) {
  if (!configured) {
    const msg = "Cloudinary is not properly setup";
    logger.error(msg);
    return NextResponse.json(
      responseSchema.parse({
        status: 500,
        message: msg,
      }),
      { status: 500 }
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = {
    timestamp,
    folder: uploadFolder,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    cData.api_key
  );

  return NextResponse.json(
    responseSchema.parse({
      status: 200,
      message: "Cloudinary signed upload data",
      data: {
        signature,
        timestamp,
      },
    }),
    { status: 200 }
  );
}
