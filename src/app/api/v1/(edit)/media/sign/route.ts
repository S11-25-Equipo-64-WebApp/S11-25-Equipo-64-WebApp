import { cloudinary, cData } from "@/lib/cloudinary";
import { logger } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";
// import { responseSchema } from "@/schemas/server/response";
import { uploadFolder, isCloudinaryConfigured } from "@/lib/cloudinary";
import { responseSchema, serverResponse } from "@/schemas/server/response";

export async function POST(_request: NextRequest) {
  if (!isCloudinaryConfigured(cData)) {
    const response: serverResponse = {
      status: 500,
      message: "Cloudinary is not properly setup",
      data: null,
    };
    logger.error({ response });

    return NextResponse.json(response, { status: response.status });
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

  const response: serverResponse = {
    status: 200,
    message: "Cloudinary signed upload data",
    data: {
      signature,
      timestamp,
    },
  };

  return NextResponse.json(response, { status: response.status });
}
