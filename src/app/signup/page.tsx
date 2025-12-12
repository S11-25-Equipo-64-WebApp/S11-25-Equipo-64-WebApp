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
import { getSupabaseClient } from "@/lib/supabase-client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("editor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setError(null);

    if (!supabase) {
      setError("Configura NEXT_PUBLIC_SUPABASE_URL/ANON_KEY para registrar usuarios.");
      return;
    }

    setLoading(true);
    const { error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || undefined,
          role: role === "admin" ? "admin" : "editor",
        },
      },
    });
    setLoading(false);

    if (supabaseError) {
      setError(supabaseError.message);
      return;
    }

    setStatus("Cuenta creada. Revisa tu correo si la verificación está habilitada.");
    setFullName("");
    setEmail("");
    setPassword("");
    setTimeout(() => router.push("/login"), 400);
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Registro</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Crea tu cuenta de Testimonial CMS
        </h1>
        <p className="text-sm text-muted-foreground">
          Mantén la experiencia minimalista: editores crean y editan en draft; admins aprueban.
          También puedes generar API keys para scripts o integraciones.
        </p>
      </header>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Datos básicos</CardTitle>
          <CardDescription>
            Empezamos con un solo workspace global. Completa tus datos y asigna un rol inicial;
            siempre podrás escalar a admin más tarde.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full-name">Nombre completo</Label>
                <Input
                  id="full-name"
                  name="full-name"
                  type="text"
                  placeholder="Ana Editora"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol deseado</Label>
                <Input
                  id="role"
                  name="role"
                  type="text"
                  placeholder="editor o admin"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                />
              </div>
            </div>
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
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creando..." : "Crear cuenta"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Al continuar aceptas nuestras{" "}
              <Link href="/terms-of-service" className="font-medium text-primary hover:underline">
                Condiciones del servicio
              </Link>{" "}
              y{" "}
              <Link href="/privacy" className="font-medium text-primary hover:underline">
                política de privacidad
              </Link>
              .
            </p>
            {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
            {status ? (
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-300">{status}</p>
            ) : null}
            {!supabase && (
              <p className="text-xs text-muted-foreground">
                Supabase no está configurado. Puedes continuar usando API keys mock para probar el
                dashboard.
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>¿Solo quieres probar la API?</CardTitle>
          <CardDescription>
            Usa las API keys mock incluidas en <code>.env.example</code> para testear el dashboard,
            o revisa el archivo <code>openapi.yaml</code> si prefieres usar cURL.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
          <span>USER_API_KEY: acceso público (solo entradas aprobadas).</span>
          <span>EDITOR_API_KEY: crea y edita borradores.</span>
          <span>ADMIN_API_KEY: aprueba o revierte publicaciones.</span>
        </CardContent>
      </Card>
    </div>
  );
}
