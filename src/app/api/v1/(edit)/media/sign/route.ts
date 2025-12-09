import { cloudinary, cData } from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { uploadFolder} from "@/lib/cloudinary";
import { serverResponse } from "@/schemas/server/response";
import { handleCloudinary } from "@/app/api/helpers/cloudinary";

export async function POST(_request: NextRequest) {

  // case: clodinary is not configured
    const cloudinaryResponse = handleCloudinary();
    if (cloudinaryResponse) {
      return cloudinaryResponse;
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
