// import { EntryStatus } from "@/lib/constants/entry-status";
// import { MediaSource } from "@/lib/constants/media-sources";
import { z } from "zod";

export const entrySchema = z.object({
  id: z.uuid(),
  title: z.string().min(1).max(255),
  body: z.string().min(1),
  date: z.coerce.date().min(new Date()),
  media_url: z.union([z.string(), z.null(), z.undefined()]),
  // media_source: MediaSource
  // status: EntryStatus,
});
