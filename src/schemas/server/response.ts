import { z } from "zod";

// response schema

export const responseSchema = z.object({
  status: z.number().int().min(200).max(599),
  message: z.string().optional(),
  data: z.any().nullable().optional(),
});

export type Response = z.infer<typeof responseSchema>;

// response interface

export interface serverResponse {
  status: number;
  message: string | null;
  data?: any;
}
