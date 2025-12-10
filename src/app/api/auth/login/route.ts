import { NextResponse } from "next/server";

import { authenticateUser, AuthError } from "@/lib/auth";
import { logger } from "@/lib/logger";

async function parseJson<T>(request: Request): Promise<T | null> {
  try {
    return await request.json();
  } catch (error) {
    logger.warn("Failed to parse login payload", { error });
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
    const user = authenticateUser({
      email: String(body.email ?? ""),
      password: String(body.password ?? ""),
    });

    logger.info("Usuario autenticado", { email: user.email });

    return NextResponse.json({
      message: "Sesión iniciada correctamente.",
      user,
    });
  } catch (error) {
    const isAuthError = error instanceof AuthError;

    logger.warn("Login fallido", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error interno" },
      { status: isAuthError ? error.status : 500 }
    );
  }
}
