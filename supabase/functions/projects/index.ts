// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js";

type FormData = {
  form_name: string;
  description?: string;
  form_config?: Record<string, unknown>;
  is_active?: boolean;
  counter: number;
};

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// Helper function for consistent JSON responses
const json = <T>(data: T, status = 200, headers: Record<string, string> = {}): Response => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 
      'Content-Type': 'application/json',
      ...headers 
    },
  });
};

// Helper function for error responses
const errorResponse = (message: string, status = 400, errors?: Record<string, string[]>) => {
  return json({ error: message, ...(errors && { errors }) }, status);
};

// Validate form data
const validateFormData = (data: unknown): { valid: boolean; data?: FormData; errors?: Record<string, string[]> } => {
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: { _: ['Invalid request body'] } };
  }

  const formData = data as Record<string, unknown>;
  const errors: Record<string, string[]> = {};

  if (!formData.form_name || typeof formData.form_name !== 'string') {
    errors.form_name = ['Form name is required and must be a string'];
  }

  if (formData.form_config && (typeof formData.form_config !== 'object' || Array.isArray(formData.form_config))) {
    errors.form_config = ['Form config must be an object'];
  }


  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      form_name: formData.form_name as string,
      description: formData.description as string || '',
      form_config: formData.form_config as Record<string, unknown> || {},
      is_active: formData.is_active as boolean || false,
      counter: formData.counter as number || 0,
    },
  };
};

// Helper function to parse and validate form ID
const parseFormId = (id: string | null) => {
  if (!id) return null;
  const idNum = Number(id);
  return isNaN(idNum) ? null : idNum;
};

// Handle GET /projects/:projectId/capture-forms
const handleGetForms = async (projectId: string, formId: string | null) => {
  try {

   if (formId) {

      const { data, error } = await supabase
        .from("capture-forms")
        .select("*")
        .eq('id', formId)
        .eq('project_id', projectId)
        .single();

      if (error) throw error;
      if (!data) return errorResponse('Form not found', 404);
      
      return json(data);
    }

    const { data: forms, error: listError } = await supabase
      .from("capture-forms")
      .select("*")
      .eq('project_id', projectId);

    if (listError) throw listError;
    return json(forms || []);
  } catch (error) {
    console.error('Error in GET /capture-forms:', error);
    return errorResponse('Failed to fetch forms');
  }
};

// Handle POST /projects/:projectId/capture-forms
const handleCreateForm = async (req: Request, projectId: string) => {
  try {
    const body = await req.json();
    const { valid, data: formData, errors } = validateFormData(body);

    if (!valid || !formData) {
      return errorResponse('Validation failed', 422, errors);
    }

    const { data, error } = await supabase
      .from("capture-forms")
      .insert({
        ...formData,
        project_id: projectId
      })
      .select()
      .single();

    if (error) throw error;
    return json(data, 201);
  } catch (error) {
    console.error('Error in POST /capture-forms:', error);
    return errorResponse('Failed to create form');
  }
};

// Handle PATCH /projects/:projectId/capture-forms/:formId
const handleUpdateForm = async (req: Request, projectId: string, formId: string) => {
  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from("capture-forms")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', formId)
      .eq('project_id', projectId)
      .select()
      .single();

    if (error) throw error;
    if (!data) return errorResponse('Form not found', 404);
    
    return json(data);
  } catch (error) {
    console.error('Error in PATCH /capture-forms:', error);
    return errorResponse('Failed to update form');
  }
};

// Handle DELETE /projects/:projectId/capture-forms/:formId
const handleDeleteForm = async (projectId: string, formId: string) => {
  try {
    const { error } = await supabase
      .from("capture-forms")
      .delete()
      .eq('id', formId)
      .eq('project_id', projectId);

    if (error) throw error;
    return json({ success: true, message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /capture-forms:', error);
    return errorResponse('Failed to delete form');
  }
};

// Main request handler
Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const method = req.method;
  
  // Extract path parts after /functions/v1/
  const pathname = url.pathname.replace("/functions/v1/", "");
  const parts = pathname.split("/").filter(Boolean);
  console.log('Path parts:', parts);
  // Expected path format: projects/:projectId/capture-forms[/:formId]
  const projectId = parts[1] || null;
  
  const formId = parts[3] || null; // formId is now the 4th part
  console.log('Project ID:', projectId);
  console.log('Form ID:', formId);

  try {
    // Validate project ID for all routes
    if (!projectId) {
      return errorResponse('Project ID is required', 400);
    }

    switch (method) {
      case 'GET':
        // GET /projects/:projectId/capture-forms
        // or GET /projects/:projectId/capture-forms/:formId
        return await handleGetForms(projectId, formId);
      
      case 'POST':
        // POST /projects/:projectId/capture-forms
        if (formId) return errorResponse('Invalid endpoint', 404);
        return await handleCreateForm(req, projectId);
      
      case 'PATCH':
        // PATCH /projects/:projectId/capture-forms/:formId
        if (!formId) return errorResponse('Form ID is required', 400);
        return await handleUpdateForm(req, projectId, formId);
      
      case 'DELETE':
        // DELETE /projects/:projectId/capture-forms/:formId
        if (!formId) return errorResponse('Form ID is required', 400);
        return await handleDeleteForm(projectId, formId);
      
      default:
        return errorResponse('Method not allowed', 405, {
          _: [`Method ${method} not allowed for this endpoint`]
        });
    }
  } catch (error) {
    console.error('Unhandled error:', error);
    return errorResponse('Internal server error', 500);
  }
});

/* To invoke locally:
  1. Run `supabase functions serve projects --no-verify-jwt --debug`
  2. Make a request to `http://localhost:54321/functions/v1/projects/1/capture-forms`
*/

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/projects' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
