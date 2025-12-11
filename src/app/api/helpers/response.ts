import { NextResponse } from "next/server";

export interface ServerResponse {
  status: number;
  message: string | null;
  data?: unknown;
  code?: string;
  issues?: unknown;
}

export function jsonResponse(
  status: number,
  message: string,
  data: unknown = null,
  options?: { code?: string; issues?: unknown }
) {
  const body: ServerResponse = {
    status,
    message,
    data,
    code: options?.code,
    issues: options?.issues,
  };
  return NextResponse.json(body, { status });
}

export function validationError(message: string, issues: unknown) {
  return jsonResponse(400, message, null, { issues });
}

export function unauthorized(message = "Missing or invalid API key") {
  return jsonResponse(401, message);
}

export function forbidden(message = "Insufficient permissions") {
  return jsonResponse(403, message);
}

export function notFound(message = "Entry not found") {
  return jsonResponse(404, message);
}

export function conflict(message = "Entry slug already exists", issues?: unknown) {
  return jsonResponse(409, message, null, { issues });
}
