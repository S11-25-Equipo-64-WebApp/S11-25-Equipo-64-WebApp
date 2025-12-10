import { NextResponse } from "next/server";

import { registerUser, AuthError } from "@/lib/auth";
import { logger } from "@/lib/logger";

async function parseJson<T>(request: Request): Promise<T | null> {
  try {
    return await request.json();
  } catch (error) {
    logger.warn("Failed to parse signup payload", { error });
    return null;
  }
}

export async function POST(request: Request) {
  const body = await parseJson<Record<string, unknown>>(request);

  if (!body) {
    return NextResponse.json(
      { message: "Solicitud inválida" },
      { status: 400 }
    );
  }

  try {
    const user = registerUser({
      name: String(body.name ?? ""),
      email: String(body.email ?? ""),
      password: String(body.password ?? ""),
    });

    logger.info("Nueva cuenta creada", { email: user.email });

    return NextResponse.json({
      message: "Cuenta creada correctamente.",
      user,
    });
  } catch (error) {
    const isAuthError = error instanceof AuthError;

    logger.warn("Registro fallido", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error interno" },
      { status: isAuthError ? error.status : 500 }
    );
  }
}
