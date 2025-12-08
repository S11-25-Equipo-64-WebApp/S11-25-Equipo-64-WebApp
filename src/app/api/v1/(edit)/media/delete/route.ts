import { NextRequest, NextResponse } from "next/server";
import { responseSchema, serverResponse } from "@/schemas/server/response";
import {
  CloudinaryDestroyResult,
  deleteMediaAsset,
  isCloudinaryConfigured,
} from "@/lib/cloudinary";
import { logger } from "@/lib/logger";
import { cData } from "@/lib/cloudinary";

interface DeleteMediaBody {
  public_id?: string;
}

export async function DELETE(request: NextRequest) {
  if (!isCloudinaryConfigured(cData)) {
    const response: serverResponse = {
      status: 500,
      message: "Cloudinary is not properly setup",
      data: null,
    };
    logger.error({ response });
    return NextResponse.json(response, { status: response.status });
  }

  let body: DeleteMediaBody;

  try {
    body = await request.json();
  } catch (error) {
    const response: serverResponse = {
      status: 400,
      message: "Invalid JSON body",
      data: null,
    };
    logger.error({ response });
    return NextResponse.json(response, { status: response.status });
  }

  const publicId = body?.public_id;

  if (!publicId) {
    const response: serverResponse = {
      status: 400,
      message: "Missing Cloudinary public_id",
      data: null,
    };
    logger.error({ response });
    return NextResponse.json(response, { status: response.status });
  }

  try {
    const result: CloudinaryDestroyResult = await deleteMediaAsset(publicId);

    if (result?.result === "not found") {
      const message = `Media not found for public_id: ${publicId}`;
      const response: serverResponse = {
        status: 404,
        message,
        data: result,
      };
      logger.error({ response });
      return NextResponse.json(response, { status: response.status });
    }

    if (result?.result !== "ok") {
      const message = `Cloudinary failed to delete media with public_id: ${publicId}`;
      const response: serverResponse = {
        status: 502,
        message,
        data: result,
      };
      logger.error({ response });
      return NextResponse.json(response, { status: response.status });
    }

    const response: serverResponse = {
      status: 200,
      message: `Media deleted: ${publicId}`,
      data: result,
    };
    logger.error({ response });
    return NextResponse.json(response, { status: response.status });
  } catch (error) {
    logger.error({ err: error, publicId }, "Error deleting Cloudinary media");
    return NextResponse.json(
      responseSchema.parse({
        status: 500,
        message: "Unexpected error deleting media",
      }),
      { status: 500 }
    );
  }
}
