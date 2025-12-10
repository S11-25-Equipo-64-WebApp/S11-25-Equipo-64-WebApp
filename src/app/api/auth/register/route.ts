import { supabaseClient } from "@/lib/supabaseclient/supabase";
import { loginSchema } from "@/lib/zodSchemas/loginSchema";
import { registerSchema } from "@/lib/zodSchemas/registerSchema";

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ZodTypeAny } from "zod/v3";

import { postUser } from "@/lib/repositories/auth/userRepositories";

export const POST = (
  credentialsSchema: ZodTypeAny,
  userDataSchema: ZodTypeAny
) => {
  return async (req: NextRequest) => {
    try {
      const body = await req.json();

      if (!body) {
        return NextResponse.json(
          { error: "Invalid data provided" },
          { status: 400 }
        );
      }

      const { email, password } = body.auth;

      //* Validate email and password.
      credentialsSchema.parse(loginSchema);

      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      if (!data) {
        return NextResponse.json({
          error: "User register failed, try again",
        });
      }

      const token: string | undefined = data.session?.access_token;

      if (!token) {
        return NextResponse.json({ error: "" }, { status: 401 });
      }

      const { name, role } = body.userData;

      //* Validate name and role.
      userDataSchema.parse(registerSchema);

      await postUser(name, role);

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
