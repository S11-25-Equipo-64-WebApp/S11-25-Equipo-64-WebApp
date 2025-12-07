import { v2 as cloudinary } from "cloudinary";
import { logger } from "./logger";

export const uploadFolder =
  process.env.CLOUDINARY_UPLOAD_FOLDER ?? "cms_nocountry";

export interface cloudinaryDataInterface {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

export const cData: cloudinaryDataInterface = {
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
  api_key: process.env.CLOUDINARY_API_KEY ?? "",
  api_secret: process.env.CLOUDINARY_API_SECRET ?? "",
};

export function isCloudinaryConfigured() {
  return Boolean(cData.cloud_name && cData.api_key && cData.api_secret);
}

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: cData.cloud_name,
    api_key: cData.api_key,
    api_secret: cData.api_secret,
    secure: true,
  });
} else {
  logger.warn(
    "Cloudinary credentials are missing. Media endpoints will not work until they are set."
  );
}

export type CloudinaryDestroyResult = Awaited<
  ReturnType<typeof cloudinary.uploader.destroy>
>;

export async function deleteMediaAsset(publicId: string) {
  return cloudinary.uploader.destroy(publicId, { invalidate: true });
}

export { cloudinary };
