import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserRole } from "@/context/api-context";
import { useApiContext } from "@/context/api-context";
import { getSupabaseClient } from "@/lib/supabase-client";

export function ApiKeyPanel() {
  const {
    apiKey,
    role,
    setApiKey,
    setRole,
    validateKey,
    profile,
    client,
    isValidating,
    authMode,
    supabaseSession,
    supabaseReady,
  } = useApiContext();
  const [localKey, setLocalKey] = useState(apiKey ?? "");
  const [feedback, setFeedback] = useState<{ state: "success" | "error"; message: string } | null>(
    null
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [supabaseLoading, setSupabaseLoading] = useState(false);

  const canSelectAdmin = profile?.role === "admin";
  const effectiveRole = useMemo<UserRole>(() => {
    if (profile?.role === "admin") return "admin";
    if (role === "admin" && !canSelectAdmin) return "editor";
    return role;
  }, [canSelectAdmin, profile?.role, role]);

  const saveKey = () => {
    setFeedback(null);
    setApiKey(localKey.trim() || null);
  };

  const clearKey = () => {
    setLocalKey("");
    setFeedback(null);
    setApiKey(null);
  };

  const handleValidate = async () => {
    setFeedback(null);
    const result = await validateKey();
    if (result.error) {
      setFeedback({ state: "error", message: result.error.message });
    } else if (result.data) {
      setFeedback({
        state: "success",
        message: `API key válida. Rol detectado: ${result.data.role}`,
      });
    }
  };

  return (
    <Card className="border-dashed">
      <CardHeader className="flex flex-col gap-2 space-y-0">
        <CardTitle>Autenticación por API key</CardTitle>
        <CardDescription>
          Incluimos la cabecera <code>x-api-key</code> en llamadas de edición. Si no hay key, el modo
          es público y solo listamos testimonios publicados.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="api-key">API key (editor/admin)</Label>
            <Input
              id="api-key"
              type="password"
              value={localKey}
              onChange={(event) => setLocalKey(event.target.value)}
              placeholder="sk_live_xxx"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              Base API: <code>{client.getBaseUrl()}</code>
            </p>
          </div>
          <div className="space-y-2">
            <Label>Rol activo</Label>
            <Select
              value={effectiveRole}
              onValueChange={(value) => setRole(value as UserRole)}
              disabled={!apiKey}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Público (solo publicados)</SelectItem>
                <SelectItem value="editor" disabled={!apiKey}>
                  Editor (puede crear/editar borradores)
                </SelectItem>
                <SelectItem value="admin" disabled={!canSelectAdmin}>
                  Admin (aprueba/revierte)
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Admin requiere una API key con rol admin. Si el backend responde con 403, vuelve a
              Editor.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={saveKey} variant="secondary">
            Guardar key
          </Button>
          <Button type="button" onClick={handleValidate} disabled={!localKey || isValidating}>
            {isValidating ? "Validando..." : "Validar"}
          </Button>
          <Button type="button" variant="outline" onClick={clearKey}>
            Limpiar
          </Button>
        </div>
        {feedback ? (
          <div
            className={
              feedback.state === "success"
                ? "text-xs font-medium text-emerald-600 dark:text-emerald-300"
                : "text-xs font-medium text-destructive"
            }
          >
            {feedback.message}
          </div>
        ) : null}
        <div className="mt-4 space-y-2 rounded-lg border border-dashed p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-medium">Sesión Supabase (Bearer)</p>
              <p className="text-xs text-muted-foreground">
                Si hay sesión activa, el token se envía en <code>Authorization</code> junto a la
                API key (si existe).
              </p>
            </div>
            <ModeBadge mode={authMode} email={supabaseSession?.user?.email} />
          </div>
          {!supabaseReady ? (
            <p className="text-xs text-muted-foreground">Inicializando Supabase...</p>
          ) : supabaseSession?.user ? (
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>Conectado como {supabaseSession.user.email}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={async () => {
                  setSupabaseError(null);
                  setSupabaseLoading(true);
                  const supabaseClient = getSupabaseClient();
                  if (!supabaseClient) {
                    setSupabaseError("Configura NEXT_PUBLIC_SUPABASE_URL/ANON_KEY");
                    setSupabaseLoading(false);
                    return;
                  }
                  await supabaseClient.auth.signOut();
                  setSupabaseLoading(false);
                }}
              >
                Cerrar sesión
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="supabase-email">Email</Label>
                <Input
                  id="supabase-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="editor@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="supabase-password">Password</Label>
                <Input
                  id="supabase-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="•••••••"
                />
              </div>
              <div className="sm:col-span-2 flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={async () => {
                    setSupabaseError(null);
                    const supabaseClient = getSupabaseClient();
                    if (!supabaseClient) {
                      setSupabaseError("Configura NEXT_PUBLIC_SUPABASE_URL/ANON_KEY");
                      return;
                    }
                    setSupabaseLoading(true);
                    const { error: signInError } = await supabaseClient.auth.signInWithPassword({
                      email,
                      password,
                    });
                    setSupabaseLoading(false);
                    if (signInError) {
                      setSupabaseError(signInError.message);
                    } else {
                      setEmail("");
                      setPassword("");
                    }
                  }}
                  disabled={supabaseLoading || !email || !password}
                >
                  {supabaseLoading ? "Conectando..." : "Conectar con Supabase"}
                </Button>
                {supabaseError ? (
                  <span className="text-xs text-destructive">{supabaseError}</span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Usa una cuenta con rol en app_metadata/user_metadata.
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ModeBadge({ mode, email }: { mode: string; email?: string | null }) {
  const variant =
    mode === "supabase"
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-100"
      : mode === "apiKey"
        ? "bg-blue-500/15 text-blue-700 dark:text-blue-100"
        : "bg-muted text-muted-foreground";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${variant}`}>
      {mode === "supabase"
        ? `Supabase ${email ?? ""}`.trim()
        : mode === "apiKey"
          ? "API key"
          : "Público"}
    </span>
  );
}
