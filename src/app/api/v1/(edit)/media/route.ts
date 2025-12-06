// POST /api/v1/media/
// signed upload to cloudinary
// return the public id

import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { readBody } from "@/lib/utils/read-body";
import { normalizePayload } from "@/lib/utils/normalize-payload";
