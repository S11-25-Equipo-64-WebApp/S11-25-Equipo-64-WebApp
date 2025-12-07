import { NextRequest, NextResponse } from "next/server";
import { responseSchema } from "@/schemas/server/response";
import {
  CloudinaryDestroyResult,
  deleteMediaAsset,
  isCloudinaryConfigured,
} from "@/lib/cloudinary";
import { logger } from "@/lib/logger";

interface DeleteMediaBody {
  public_id?: string;
}

export async function DELETE(request: NextRequest) {
  const configured = isCloudinaryConfigured();

  if (!configured) {
    const message = "Cloudinary is not properly setup";
    logger.error(message);
    return NextResponse.json(
      responseSchema.parse({
        status: 500,
        message,
      }),
      { status: 500 }
    );
  }

  let body: DeleteMediaBody;
  try {
    body = await request.json();
  } catch (error) {
    logger.error({ err: error }, "Failed to parse delete body");
    return NextResponse.json(
      responseSchema.parse({
        status: 400,
        message: "Invalid JSON body",
      }),
      { status: 400 }
    );
  }

  const publicId = body?.public_id;

  if (!publicId) {
    const message = "Missing Cloudinary public_id";
    return NextResponse.json(
      responseSchema.parse({
        status: 400,
        message,
      }),
      { status: 400 }
    );
  }

  try {
    const result: CloudinaryDestroyResult = await deleteMediaAsset(publicId);

    if (result?.result === "not found") {
      const message = `Media not found for public_id: ${publicId}`;
      return NextResponse.json(
        responseSchema.parse({
          status: 404,
          message,
          data: result,
        }),
        { status: 404 }
      );
    }

    if (result?.result !== "ok") {
      const message = `Cloudinary failed to delete media with public_id: ${publicId}`;
      logger.error({ result }, message);
      return NextResponse.json(
        responseSchema.parse({
          status: 502,
          message,
          data: result,
        }),
        { status: 502 }
      );
    }

    return NextResponse.json(
      responseSchema.parse({
        status: 200,
        message: `Media deleted: ${publicId}`,
        data: result,
      }),
      { status: 200 }
    );
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
