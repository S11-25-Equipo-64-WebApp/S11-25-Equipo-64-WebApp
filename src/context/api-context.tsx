"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Session } from "@supabase/supabase-js";

import type { ApiError, AuthHeaders, UserProfile } from "@/lib/api/client";
import { ApiClient } from "@/lib/api/client";
import { getSupabaseClient } from "@/lib/supabase-client";

type UserRole = "public" | "editor" | "admin";

type ApiContextValue = {
  apiKey: string | null;
  role: UserRole;
  authMode: "public" | "apiKey" | "supabase";
  profile: UserProfile | null;
  client: ApiClient;
  isValidating: boolean;
  supabaseSession: Session | null;
  supabaseReady: boolean;
  authHeaders: AuthHeaders;
  setApiKey: (key: string | null) => void;
  setRole: (role: UserRole) => void;
  validateKey: () => Promise<{ data?: UserProfile; error?: ApiError }>;
};

const ApiContext = createContext<ApiContextValue | undefined>(undefined);

function safeLocalStorageGet(key: string) {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(
    () => safeLocalStorageGet("dashboard.apiKey") ?? null
  );
  const [rolePreference, setRole] = useState<UserRole>(() => {
    const storedRole = safeLocalStorageGet("dashboard.role");
    if (storedRole === "editor" || storedRole === "admin") return storedRole;
    return "public";
  });
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [supabaseReady, setSupabaseReady] = useState<boolean>(() => !supabase);
  const client = useMemo(() => new ApiClient(), []);

  useEffect(() => {
    let isMounted = true;
    if (!supabase) {
      return;
    }
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!isMounted) return;
        setSupabaseSession(data.session ?? null);
        setSupabaseReady(true);
      })
      .catch(() => setSupabaseReady(true));

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      setSupabaseSession(newSession);
    });

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (apiKey) {
      window.localStorage.setItem("dashboard.apiKey", apiKey);
    } else {
      window.localStorage.removeItem("dashboard.apiKey");
    }
  }, [apiKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("dashboard.role", rolePreference);
  }, [rolePreference]);

  const validateKey = async () => {
    if (!apiKey) {
      return { error: { status: 401, message: "Falta API key" } as ApiError };
    }

    setIsValidating(true);
    const result = await client.validateKey(apiKey);
    setIsValidating(false);

    if (result.data) {
      setProfile(result.data);
      setRole(result.data.role === "admin" ? "admin" : "editor");
    }

    return result;
  };

  const setApiKey = (key: string | null) => {
    const normalized = key?.trim() ? key.trim() : null;
    setApiKeyState(normalized);
    if (!normalized) {
      setProfile(null);
      setRole("public");
    }
  };

  const authHeaders: AuthHeaders = useMemo(
    () => ({
      apiKey: rolePreference !== "public" ? apiKey : null,
      bearerToken: supabaseSession?.access_token ?? null,
    }),
    [apiKey, rolePreference, supabaseSession?.access_token]
  );

  const supabaseRole = useMemo(() => {
    const fromApp = supabaseSession?.user?.app_metadata?.role;
    const fromUser = supabaseSession?.user?.user_metadata?.role;
    if (fromApp === "admin" || fromUser === "admin") return "admin";
    if (fromApp === "editor" || fromUser === "editor") return "editor";
    return null;
  }, [supabaseSession]);

  const role = useMemo<UserRole>(() => {
    if (profile?.role === "admin") return "admin";
    if (profile?.role === "editor") return "editor";
    if (supabaseSession) return (supabaseRole ?? "editor") as UserRole;
    return rolePreference;
  }, [profile?.role, rolePreference, supabaseRole, supabaseSession]);

  const authMode: ApiContextValue["authMode"] = useMemo(() => {
    if (supabaseSession) return "supabase";
    if (authHeaders.apiKey) return "apiKey";
    return "public";
  }, [authHeaders.apiKey, supabaseSession]);

  return (
    <ApiContext.Provider
      value={{
        apiKey,
        role,
        authMode,
        profile,
        client,
        isValidating,
        supabaseSession,
        supabaseReady,
        authHeaders,
        setApiKey,
        setRole,
        validateKey,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}

export function useApiContext() {
  const ctx = useContext(ApiContext);
  if (!ctx) {
    throw new Error("useApiContext must be used within ApiProvider");
  }
  return ctx;
}

export type { UserRole };
