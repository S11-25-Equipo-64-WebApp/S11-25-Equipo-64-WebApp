"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";

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

export default function ForgotPasswordPage() {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setError(null);

    if (!supabase) {
      setError("Configura NEXT_PUBLIC_SUPABASE_URL/ANON_KEY para enviar el enlace de recuperación.");
      return;
    }

    setLoading(true);
    const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    setLoading(false);

    if (supabaseError) {
      setError(supabaseError.message);
      return;
    }

    setStatus("Enviamos un enlace si la cuenta existe. Revisa tu correo.");
    setEmail("");
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Recuperación</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Recuperar contraseña
        </h1>
        <p className="text-sm text-muted-foreground">
          Te enviaremos un enlace temporal para que vuelvas a entrar al dashboard y retomar tus
          borradores o aprobaciones pendientes.
        </p>
      </header>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Enviar enlace</CardTitle>
          <CardDescription>
            Ingresa el correo asociado a tu cuenta. Si usas la API key para acceder, no necesitas
            este flujo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar instrucciones"}
            </Button>
            <div className="text-sm text-muted-foreground">
              ¿Ya recordaste tu clave?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Volver al login
              </Link>
              .
            </div>
            {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
            {status ? (
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-300">{status}</p>
            ) : null}
            {!supabase && (
              <p className="text-xs text-muted-foreground">
                Supabase no está configurado. Puedes seguir usando las API keys mock en el dashboard.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
