import { NextRequest, NextResponse } from "next/server";
import { serverResponse } from "@/schemas/server/response";
import {
  CloudinaryDestroyResult,
  deleteMediaAsset,
} from "@/lib/cloudinary";
import { logger } from "@/lib/logger";
import { deleteMediaBodySchema } from "./validation";
import { handleCloudinary } from "@/app/api/helpers/cloudinary";

export async function DELETE(request: NextRequest) {

  // case: clodinary is not configured
  const cloudinaryResponse = handleCloudinary();
  if (cloudinaryResponse) {
    return cloudinaryResponse;
  }
  const json = await request.json();
  const body = deleteMediaBodySchema.safeParse(json);

  // case: invalid request body
  if (!body.success) {
    const response: serverResponse = {
      status: 400,
      message: "Invalid request body",
      data: body.error.issues,
    };
    logger.error({ response });
    return NextResponse.json(response, { status: response.status });
    
  }

  try {    
    const result: CloudinaryDestroyResult = await deleteMediaAsset(
      body.data.public_id
    )
  
    // case: NOT FOUND
    if (result.result === "not found") {
      const response: serverResponse = {
        status: 404,
        message: "Media asset not found",
        data: null,
      };
      logger.error({ response });
      return NextResponse.json(response, { status: response.status });
    }
  
    // case: DELETED
    const response: serverResponse = {
      status: 200,
      message: "Media asset deleted successfully",
      data: result,
    };
    return NextResponse.json(response, { status: response.status });
  } catch (error) {
    const response: serverResponse = {
      status: 500,
      message: "Internal server error",
      data: error,
    };
    logger.error({ response });
    return NextResponse.json(response, { status: response.status });
  }
}