import { z } from "zod";

export const deleteMediaBodySchema = z.object({
  public_id: z.string().min(1).describe("Cloudinary public_id"), // example: {"public_id": "cld-sample-5"}
});

export type deleteMediaBodyValidator = z.infer<typeof deleteMediaBodySchema>;
