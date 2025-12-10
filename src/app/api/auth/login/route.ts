<<<<<<< HEAD
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
=======
import { supabaseClient } from "@/lib/supabaseclient/supabase";

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ZodTypeAny } from "zod/v3";

export const POST = (loginSchema: ZodTypeAny) => {
  return async (req: NextRequest) => {
    try {
      const body = await req.json();

      if (!body) {
        return NextResponse.json({ error: "Body required" }, { status: 400 });
      }

      loginSchema.parse(body);

      const { email, password } = body;

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      if (!data) {
        return NextResponse.json({
          error: "User with this credentials, doesn't exist",
        });
      }

      const token: string = data.session?.access_token;
      // const refreshToken = data.session?.refresh_token;

      (await cookies()).set("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        //maxAge
      });
    } catch (error) {
      return NextResponse.json({ error: error }, { status: 500 });
    }
  };
};
>>>>>>> feat/auth
