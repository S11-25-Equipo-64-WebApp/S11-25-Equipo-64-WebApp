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
