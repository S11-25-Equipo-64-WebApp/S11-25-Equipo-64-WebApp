// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Hello from Functions!")

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js";

Deno.serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const method = req.method;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Extract form ID from URL pattern: /functions/v1/capture-forms/[id]
    const pathname = url.pathname.replace("/functions/v1/capture-forms", "");
    const parts = pathname.split("/").filter(Boolean);

    console.log(parts);
    // if (parts[0] !== "projects") {
    //   return json({ error: "Invalid route" }, 404);
    // }

    // const projectId = parts[1];
    // const resource = parts[2];
    const formId = parts[1] ?? null;

    // ---------- GET list ----------
    if (method === "GET") {
      console.log("Getting capture form with ID:", formId);
      const { data, error } = await supabase
        .from("capture_forms")
        .select("*");

      if (error) return json({ error: error.message }, 400);
      return json(data);
    }

    // ---------- POST create ----------
    if (method === "POST") {
      const body = await req.json();

      const { data, error } = await supabase
        .from("capture_forms")
        .insert({
          name: body.name,
          schema: body.schema ?? {},
        })
        .select()
        .single();

      if (error) return json({ error: error.message }, 400);
      return json(data, 201);
    }

    // ---------- GET one ----------
    if (method === "GET") {
      const { data, error } = await supabase
        .from("capture_forms")
        .select("*")
        .single();

      if (error) return json({ error: error.message }, 404);
      return json(data);
    }

    // ---------- PATCH update ----------
    if (method === "PATCH") {
      const body = await req.json();

      if (!formId) return json({ error: "Form ID is required" }, 400);
      
      const { data, error } = await supabase
        .from("capture_forms")
        .update({
          ...body,
          updated_at: new Date().toISOString(),
        })
        .eq('id', formId)
        .select()
        .single();

      if (error) return json({ error: error.message }, 400);
      return json(data);
    }

    // ---------- DELETE ----------
    if (method === "DELETE") {
      if (!formId) return json({ error: "Form ID is required" }, 400);
      
      const { error } = await supabase
        .from("capture_forms")
        .delete()
        .eq('id', formId);

      if (error) return json({ error: error.message }, 400);
      return json({ message: "Form deleted successfully" });
    }

    return json({ error: "Invalid route or method" }, 405);
  } catch (err) {
    console.error(err);
    return json({ error: "Internal server error" }, 500);
  }
});

function json(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/capture-forms' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
