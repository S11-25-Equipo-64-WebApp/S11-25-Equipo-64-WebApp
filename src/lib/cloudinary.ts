// src/lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

const configured = (() => {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return cloudinary;
})();

export { configured as cloudinary };
