import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

import { forbidden, unauthorized } from "@/app/api/helpers/response";

export type ApiRole = "user" | "editor" | "admin";

export interface ApiUser {
  id: string;
  role: ApiRole;
  org: string;
  email?: string;
  name?: string;
  apiKey?: string;
  provider?: "api-key" | "supabase";
}

const USER_API_KEY = process.env.USER_API_KEY ?? "user-key";
const EDITOR_API_KEY = process.env.EDITOR_API_KEY ?? "editor-key";
const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "admin-key";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TEST_BEARER_EDITOR = process.env.TEST_BEARER_EDITOR ?? "test-editor";
const TEST_BEARER_ADMIN = process.env.TEST_BEARER_ADMIN ?? "test-admin";

const apiUsers: ApiUser[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    role: "user",
    org: "default",
    apiKey: USER_API_KEY,
    name: "API User",
    provider: "api-key",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    role: "editor",
    org: "default",
    apiKey: EDITOR_API_KEY,
    name: "API Editor",
    provider: "api-key",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    role: "admin",
    org: "default",
    apiKey: ADMIN_API_KEY,
    name: "API Admin",
    provider: "api-key",
  },
];

let supabaseAdmin:
  | ReturnType<typeof createClient>
  | null = null;

function getSupabaseAdminClient() {
  if (supabaseAdmin) return supabaseAdmin;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  return supabaseAdmin;
}

function getBearerToken(request: NextRequest) {
  const header = request.headers.get("authorization");
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function normalizeRole(role: unknown): ApiRole {
  if (role === "admin") return "admin";
  if (role === "editor") return "editor";
  return "editor";
}

function resolveTestBearerToken(token: string): ApiUser | null {
  if (process.env.NODE_ENV !== "test") return null;
  if (token === TEST_BEARER_ADMIN) {
    return {
      id: "99999999-9999-9999-9999-999999999999",
      role: "admin",
      org: "default",
      email: "admin@test.local",
      name: "Test Admin",
      provider: "supabase",
    };
  }
  if (token === TEST_BEARER_EDITOR) {
    return {
      id: "88888888-8888-8888-8888-888888888888",
      role: "editor",
      org: "default",
      email: "editor@test.local",
      name: "Test Editor",
      provider: "supabase",
    };
  }
  return null;
}

export function getApiUser(request: NextRequest): ApiUser | null {
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey) return null;
  return apiUsers.find((candidate) => candidate.apiKey === apiKey) ?? null;
}

export async function getSupabaseUser(request: NextRequest): Promise<ApiUser | null> {
  const token = getBearerToken(request);
  if (!token) return null;

  const testUser = resolveTestBearerToken(token);
  if (testUser) return testUser;

  const client = getSupabaseAdminClient();
  if (!client) return null;

  try {
    const { data, error } = await client.auth.getUser(token);
    if (error || !data.user) return null;

    const role = normalizeRole(
      (data.user.app_metadata as { role?: string } | undefined)?.role ??
        (data.user.user_metadata as { role?: string } | undefined)?.role
    );

    const org =
      (data.user.app_metadata as { org?: string } | undefined)?.org ??
      (data.user.user_metadata as { org?: string } | undefined)?.org ??
      "default";

    return {
      id: data.user.id,
      role,
      org,
      email: data.user.email ?? undefined,
      name:
        (data.user.user_metadata as { full_name?: string } | undefined)?.full_name ??
        data.user.email ??
        undefined,
      provider: "supabase",
    };
  } catch {
    return null;
  }
}

export async function getRequestAuth(
  request: NextRequest
): Promise<{ user: ApiUser | null; role: ApiRole | null }> {
  const apiUser = getApiUser(request);
  if (apiUser) {
    return { user: apiUser, role: apiUser.role };
  }

  const supabaseUser = await getSupabaseUser(request);
  if (supabaseUser) {
    return { user: supabaseUser, role: supabaseUser.role };
  }

  return { user: null, role: null };
}

export function hasEditorAccess(role: ApiRole | null) {
  return role === "admin" || role === "editor";
}

export function isAdmin(role: ApiRole | null) {
  return role === "admin";
}

export async function requireAuth(
  request: NextRequest,
  allowedRoles?: ApiRole[]
): Promise<{ user?: ApiUser; error?: Response }> {
  const { user, role } = await getRequestAuth(request);

  if (!user || !role) {
    const hasBearer = Boolean(getBearerToken(request));
    const missing = hasBearer ? "bearer token" : "API key";
    return { error: unauthorized(`Missing or invalid credentials (${missing})`) };
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return { error: forbidden("Insufficient permissions") };
  }

  return { user };
}

export function issueToken() {
  return randomUUID();
}
