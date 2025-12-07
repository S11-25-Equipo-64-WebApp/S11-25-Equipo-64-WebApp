import { cloudinary, cData } from "@/lib/cloudinary";
import { logger } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";
import { responseSchema } from "@/schemas/server/response";
import { uploadFolder, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function POST(_request: NextRequest) {
  const configured = isCloudinaryConfigured();

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
    cData.api_secret
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
