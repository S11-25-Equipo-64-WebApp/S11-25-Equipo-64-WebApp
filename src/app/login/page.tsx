"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
import { useApiContext } from "@/context/api-context";
import { getSupabaseClient } from "@/lib/supabase-client";

export default function LoginPage() {
  const router = useRouter();
  const { validateKey, isValidating, supabaseReady } = useApiContext();
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [apiKeyFeedback, setApiKeyFeedback] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [supabaseLoading, setSupabaseLoading] = useState(false);

  const handleSupabaseLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError(null);
    setAuthMessage(null);

    if (!supabase) {
      setAuthError("Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY para usar login.");
      return;
    }

    setSupabaseLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSupabaseLoading(false);

    if (error) {
      setAuthError(error.message);
      return;
    }

    setAuthMessage("Sesión iniciada. Redirigiendo al dashboard…");
    setEmail("");
    setPassword("");
    setTimeout(() => router.push("/dashboard/entries"), 300);
  };

  const handleApiKeyLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiKeyFeedback(null);
    setApiKeyError(null);
    const normalized = apiKey.trim();
    if (!normalized) {
      setApiKeyError("Ingresa una API key válida.");
      return;
    }

    const result = await validateKey(normalized);
    if (result.error) {
      setApiKeyError(result.error.message);
      return;
    }
    setApiKeyFeedback("API key válida. Redirigiendo al dashboard…");
    setTimeout(() => router.push("/dashboard/entries"), 200);
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Acceso seguro
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Iniciar sesión</h1>
        <p className="text-sm text-muted-foreground">
          Usa tus credenciales de Supabase o la API key asociada a tu rol. Los editores entran en
          modo borrador, los administradores pueden aprobar.
        </p>
      </header>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Correo y contraseña</CardTitle>
          <CardDescription>
            Conecta con Supabase (Bearer). Si no está configurado, usa la API key. El rol se lee de
            <code className="ml-1 rounded bg-foreground/10 px-1 py-0.5">app_metadata.role</code> o
            <code className="ml-1 rounded bg-foreground/10 px-1 py-0.5">user_metadata.role</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSupabaseLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@equipo.com"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={supabaseLoading || !supabaseReady || !supabase}
            >
              {supabaseLoading ? "Conectando..." : "Entrar al dashboard"}
            </Button>
            <div className="flex flex-wrap justify-between text-sm text-muted-foreground">
              <Link href="/forgot-password" className="hover:text-primary">
                ¿Olvidaste tu contraseña?
              </Link>
              <Link href="/signup" className="hover:text-primary">
                Crear una cuenta
              </Link>
            </div>
            {authError ? <p className="text-xs font-medium text-destructive">{authError}</p> : null}
            {authMessage ? (
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-300">
                {authMessage}
              </p>
            ) : null}
            {!supabase && (
              <p className="text-xs text-muted-foreground">
                Supabase no está configurado. Usa login por API key mientras tanto.
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Login con API key</CardTitle>
          <CardDescription>
            Para probar rápidamente el cliente, pega la API key de editor o admin. El dashboard la
            guardará de forma local para llamar a los endpoints protegidos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <form className="space-y-3" onSubmit={handleApiKeyLogin}>
            <div className="space-y-2">
              <Label htmlFor="api-key">API key</Label>
              <Input
                id="api-key"
                name="api-key"
                type="text"
                placeholder="editor-key o admin-key"
                autoComplete="off"
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>Roles disponibles:</span>
              <span className="rounded-full bg-muted px-2 py-1 text-foreground">editor</span>
              <span className="rounded-full bg-muted px-2 py-1 text-foreground">admin</span>
              <span className="rounded-full bg-muted px-2 py-1 text-foreground">user</span>
            </div>
            <Button type="submit" disabled={!apiKey || isValidating}>
              {isValidating ? "Validando..." : "Usar API key"}
            </Button>
            {apiKeyError ? (
              <p className="text-xs font-medium text-destructive">{apiKeyError}</p>
            ) : null}
            {apiKeyFeedback ? (
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-300">
                {apiKeyFeedback}
              </p>
            ) : null}
          </form>
          <div className="text-sm text-muted-foreground">
            ¿Nuevo aquí?{" "}
            <Link href="/docs" className="font-medium text-primary hover:underline">
              Revisa la documentación
            </Link>{" "}
            para entender los endpoints y scopes disponibles.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
