# 🗺️ Endpoints por Ruta

Este documento lista todas las rutas de la aplicación, las páginas correspondientes y los endpoints a los que se hacen consultas desde cada página.

**Leyenda métodos HTTP:**  
🟢 GET · 🔵 POST · 🟠 PUT · 🔴 DELETE · ⚪ Sin endpoint

---

## 📣 Marketing & Publico

### `/`

**Página:** `src/app/(marketing)/page.tsx`  
**Componente:** `MarketingLandingPage`

**Endpoints:**

- ⚪ Ninguno (página estática)

---

### `/about`

**Página:** `src/app/(marketing)/about/page.tsx`  
**Componente:** `AboutMissionPage`

**Endpoints:**

- ⚪ Ninguno (página estática)

---

## 🔐 Autenticación

### `/signup`

**Página:** `src/app/(auth)/signup/page.tsx`  
**Componente:** `AuthSignupPage`

**Endpoints:**

- 🔵 `POST /auth/signup` - Registrar nuevo usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/auth/signup`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/auth/signup`
- 🔵 `POST /auth/login` (Supabase Auth) - Auto-login después del registro
  - **URL Completa:** `https://{projectId}.supabase.co/auth/v1/token?grant_type=password`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/auth/v1/token?grant_type=password`
- 🟢 `GET /auth/user` - Obtener datos del usuario (desde AuthContext)
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/auth/user`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/auth/user`

---

### `/login`

**Página:** `src/app/(auth)/login/page.tsx`  
**Componente:** `AuthLoginPage`

**Endpoints:**

- 🔵 `POST /auth/login` (Supabase Auth) - Iniciar sesión
  - **URL Completa:** `https://{projectId}.supabase.co/auth/v1/token?grant_type=password`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/auth/v1/token?grant_type=password`
- 🟢 `GET /auth/user` - Obtener datos del usuario (desde AuthContext)
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/auth/user`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/auth/user`

---

### `/forgot-password`

**Página:** `src/app/(auth)/forgot-password/page.tsx`  
**Componente:** `AuthForgotPasswordPage`

**Endpoints:**

- ⚪ Ninguno (página estática, funcionalidad no implementada)

---

## 📊 Dashboard

### `/dashboard/projects`

**Página:** `src/app/(dashboard)/dashboard/projects/page.tsx`  
**Componente:** `DashboardProjectsListPage`

**Endpoints:**

- 🟢 `GET /projects` - Listar proyectos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects`
- 🔴 `DELETE /projects/{projectId}` - Eliminar proyecto
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`

---

### `/dashboard/projects/new`

**Página:** `src/app/(dashboard)/dashboard/projects/new/page.tsx`  
**Componente:** `ProjectCreatePage`

**Endpoints:**

- 🔵 `POST /projects` - Crear nuevo proyecto
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects`

---

### `/dashboard/help`

**Página:** `src/app/(dashboard)/dashboard/help/page.tsx`  
**Componente:** `DashboardHelpPage`

**Endpoints:**

- ⚪ Ninguno (página estática para ayuda y sugerencias, funcionalidad de envío no implementada)

---

## 🧙 Gestión de Proyectos

### `/dashboard/projects/:projectId`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/page.tsx`

**Endpoints:**

- ⚪ Ninguno (redirige a `/dashboard/projects/:projectId/testimonials`)

---

### `/dashboard/projects/:projectId/testimonials`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/testimonials/page.tsx`  
**Componente:** `ProjectTestimonialsPage`

**Endpoints:**

- 🟢 `GET /projects/{projectId}/testimonials` - Listar testimonios del proyecto
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/testimonials`
- 🔴 `DELETE /projects/{projectId}/testimonials/{testimonialId}` - Eliminar testimonio
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials/{testimonialId}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/testimonials/test_ejemplo123`
- 🔵 `POST /projects/{projectId}/testimonials/{testimonialId}/approve` - Aprobar/publicar testimonio
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials/{testimonialId}/approve`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/testimonials/test_ejemplo123/approve`
- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`

---

### `/dashboard/projects/:projectId/testimonials/:testimonialId`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/testimonials/:testimonialId/page.tsx`  
**Componente:** `TestimonialEditPage`

**Endpoints:**

- 🟢 `GET /projects/{projectId}/testimonials/{testimonialId}` - Obtener testimonio específico
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials/{testimonialId}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/testimonials/test_ejemplo123`
- 🟠 `PUT /projects/{projectId}/testimonials/{testimonialId}` - Actualizar testimonio
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials/{testimonialId}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/testimonials/test_ejemplo123`
- 🔵 `POST /projects/{projectId}/testimonials/{testimonialId}/approve` - Cambiar estado de aprobación
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials/{testimonialId}/approve`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/testimonials/test_ejemplo123/approve`
- 🔵 `POST /api/cloudinary/upload` - Subir foto de avatar (si se sube imagen)
  - **URL Completa:** `/api/cloudinary/upload` (relativa) o `https://tu-dominio.com/api/cloudinary/upload` (absoluta)
  - **Ejemplo:** `https://tu-dominio.com/api/cloudinary/upload`
- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`

---

### `/dashboard/projects/:projectId/import-testimonials`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/import-testimonials/page.tsx`  
**Componente:** `ProjectImportSourcePage`

**Endpoints:**

- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`
- ⚪ Ningún otro endpoint (página de selección de tipo)

---

### `/dashboard/projects/:projectId/import-testimonials/text`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/import-testimonials/text/page.tsx`  
**Componente:** `ProjectImportFromTextPage`

**Endpoints:**

- 🔵 `POST /projects/{projectId}/testimonials` - Crear testimonio de texto
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/testimonials`
- 🔵 `POST /api/cloudinary/upload` - Subir foto de avatar (si se sube imagen)
  - **URL Completa:** `/api/cloudinary/upload` (relativa) o `https://tu-dominio.com/api/cloudinary/upload` (absoluta)
  - **Ejemplo:** `https://tu-dominio.com/api/cloudinary/upload`
- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`

---

### `/dashboard/projects/:projectId/import-testimonials/image`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/import-testimonials/image/page.tsx`  
**Componente:** `ProjectImportFromImagePage`

**Endpoints:**

- 🔵 `POST /projects/{projectId}/testimonials` - Crear testimonio de imagen
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/testimonials`
- 🔵 `POST /api/cloudinary/upload` - Subir imagen del testimonio
  - **URL Completa:** `/api/cloudinary/upload` (relativa) o `https://tu-dominio.com/api/cloudinary/upload` (absoluta)
  - **Ejemplo:** `https://tu-dominio.com/api/cloudinary/upload`
- 🔵 `POST /api/cloudinary/upload` - Subir foto de avatar (si se sube imagen)
  - **URL Completa:** `/api/cloudinary/upload` (relativa) o `https://tu-dominio.com/api/cloudinary/upload` (absoluta)
  - **Ejemplo:** `https://tu-dominio.com/api/cloudinary/upload`
- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`

---

### `/dashboard/projects/:projectId/import-testimonials/video`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/import-testimonials/video/page.tsx`  
**Componente:** `ProjectImportFromVideoPage`

**Endpoints:**

- 🔵 `POST /projects/{projectId}/testimonials` - Crear testimonio de video
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/testimonials`
- 🔵 `POST /api/cloudinary/upload` - Subir foto de avatar (si se sube imagen)
  - **URL Completa:** `/api/cloudinary/upload` (relativa) o `https://tu-dominio.com/api/cloudinary/upload` (absoluta)
  - **Ejemplo:** `https://tu-dominio.com/api/cloudinary/upload`
- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`

---

### `/dashboard/projects/:projectId/capture-forms`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/capture-forms/page.tsx`  
**Componente:** `ProjectCaptureFormsListPage`

**Endpoints:**

- 🟢 `GET /projects/{projectId}/capture-forms` - Listar formularios de captura
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/capture-forms`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/capture-forms`
- 🔴 `DELETE /projects/{projectId}/capture-forms/{formId}` - Eliminar formulario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/capture-forms/{formId}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/capture-forms/form_ejemplo123`
- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`

---

### `/dashboard/projects/:projectId/capture-forms/new`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/capture-forms/new/page.tsx`  
**Componente:** `CaptureFormNewPage`

**Endpoints:**

- 🔵 `POST /projects/{projectId}/capture-forms` - Crear nuevo formulario de captura
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/capture-forms`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/capture-forms`
- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`

---

### `/dashboard/projects/:projectId/capture-forms/:formId/edit`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/capture-forms/:formId/edit/page.tsx`  
**Componente:** `ProjectCaptureFormEditPage`

**Endpoints:**

- 🟢 `GET /projects/{projectId}/capture-forms/{formId}` - Obtener formulario específico (no implementado en el código actual, usa valores por defecto)
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/capture-forms/{formId}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/capture-forms/form_ejemplo123`
- 🔵 `POST /projects/{projectId}/capture-forms` - Crear formulario (si es nuevo)
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/capture-forms`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/capture-forms`
- 🟠 `PUT /projects/{projectId}/capture-forms/{formId}` - Actualizar formulario existente
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/capture-forms/{formId}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/capture-forms/form_ejemplo123`
- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`

---

### `/dashboard/projects/:projectId/embeds`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/embeds/page.tsx`  
**Componente:** `ProjectEmbedsListPage`

**Endpoints:**

- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`
- ⚪ Ningún otro endpoint (página informativa que genera código de embed)

---

### `/dashboard/projects/:projectId/api`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/api/page.tsx`  
**Componente:** `ProjectAPIPage`

**Endpoints:**

- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`
- ⚪ Ningún otro endpoint (página informativa que muestra ejemplos de código)

---

### `/dashboard/projects/:projectId/editors`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/editors/page.tsx`  
**Componente:** `ProjectEditorsManagementPage`

**Endpoints:**

- 🟢 `GET /projects/{projectId}/editors` - Listar editores del proyecto
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/editors`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/editors`
- 🔵 `POST /projects/{projectId}/editors` - Agregar editor al proyecto
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/editors`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/editors`
- 🔴 `DELETE /projects/{projectId}/editors/{editorId}` - Eliminar editor del proyecto
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/editors/{editorId}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/editors/editor_ejemplo123`
- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`

---

## 📝 Formularios & Embeds Públicos

### `/cf/:formId`

**Página:** `src/app/(public-forms)/cf/:formId/page.tsx`  
**Componente:** `PublicCaptureFormPage`

**Endpoints:**

- 🟢 `GET /public/capture-forms/{formId}` - Obtener formulario público (no implementado, usa configuración mock)
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/public/capture-forms/{formId}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/public/capture-forms/form_ejemplo123`
- 🔵 `POST /public/capture-forms/{formId}/responses` - Enviar respuesta del formulario (no implementado completamente)
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/public/capture-forms/{formId}/responses`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/public/capture-forms/form_ejemplo123/responses`
- 🔵 `POST /api/cloudinary/upload` - Subir foto de avatar (si se sube imagen)
  - **URL Completa:** `/api/cloudinary/upload` (relativa) o `https://tu-dominio.com/api/cloudinary/upload` (absoluta)
  - **Ejemplo:** `https://tu-dominio.com/api/cloudinary/upload`

---

### `/embed`

**Página:** `src/app/(marketing)/embed/page.tsx`  
**Componente:** `EmbedPage`

**Endpoints:**

- 🟢 `GET /public/projects/{projectId}/testimonials` - Obtener testimonios aprobados para mostrar en el embed
  - **URL Completa:** `https://ejemplo-dominio.com/api/projects/{projectId_path}/testimonials`
  - **Ejemplo:** `https://ejemplo-dominio.com/api/projects/proj_ejemplo123/testimonials?status=approved&limit=20`

---

## 🧩 Hooks y Contextos

### `useProject` Hook

**Archivo:** `src/hooks/useProject.ts`

**Endpoints:**

- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`

---

### `AuthContext`

**Archivo:** `src/features/auth/context/AuthContext.tsx`

**Endpoints:**

- 🟢 `GET /auth/user` - Obtener datos del usuario autenticado
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/auth/user`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/auth/user`
- 🔵 `POST /auth/signup` - Registrar nuevo usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/auth/signup`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/auth/signup`
- 🔵 `POST /auth/login` (Supabase Auth) - Iniciar sesión
  - **URL Completa:** `https://{projectId}.supabase.co/auth/v1/token?grant_type=password`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/auth/v1/token?grant_type=password`
- 🔵 `POST /auth/logout` (Supabase Auth) - Cerrar sesión
  - **URL Completa:** `https://{projectId}.supabase.co/auth/v1/logout`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/auth/v1/logout`

---

## ⚙️ API Routes (Next.js)

### `/api/cloudinary/upload`

**Archivo:** `src/app/api/cloudinary/upload/route.ts`

**Endpoints:**

- 🔵 `POST /api/cloudinary/upload` - Endpoint interno de Next.js para subir archivos a Cloudinary
  - **URL Completa:** `/api/cloudinary/upload` (relativa) o `https://tu-dominio.com/api/cloudinary/upload` (absoluta)
  - **Ejemplo:** `https://tu-dominio.com/api/cloudinary/upload`

---

### `/api/cloudinary/delete`

**Archivo:** `src/app/api/cloudinary/delete/route.ts`

**Endpoints:**

- 🔵 `POST /api/cloudinary/delete` - Endpoint interno de Next.js para eliminar archivos de Cloudinary
  - **URL Completa:** `/api/cloudinary/delete` (relativa) o `https://tu-dominio.com/api/cloudinary/delete` (absoluta)
  - **Ejemplo:** `https://tu-dominio.com/api/cloudinary/delete`

---

## 🗒️ Notas

1. **Variables en las URLs:**

   - `{SUPABASE_EDGE_FUNCTION_URL}` = `https://{projectId}.supabase.co/functions/v1/{edgeFunctionName}`
   - `{projectId}` = ID del proyecto Supabase (ej: `ejemplo-proyecto-id`)
   - `{edgeFunctionName}` = Nombre de la Edge Function (ej: `ejemplo-edge-function`)
   - `{projectId_path}` = ID del proyecto en la base de datos (ej: `proj_ejemplo123`)
   - Ejemplo completo: `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function`

2. **Autenticación:** La mayoría de los endpoints requieren un token de acceso (`access_token`) almacenado en `localStorage` y enviado en el header `Authorization: Bearer {token}`.

3. **Hooks compartidos:** Los hooks `useProject` y `useAuth` se utilizan en múltiples páginas, por lo que los endpoints que llaman aparecen en varias rutas.

4. **Cloudinary:** Las subidas de imágenes se realizan a través de la API route de Next.js `/api/cloudinary/upload`, que internamente llama a la API de Cloudinary.

5. **Supabase Auth:** Algunos endpoints de autenticación se llaman directamente a Supabase Auth (como login y logout), mientras que otros pasan por la Edge Function del backend.

6. **Endpoints públicos:** Los endpoints públicos (`/public/*`) no requieren autenticación pero pueden requerir una API key del proyecto.

7. **API Pública:** Los endpoints de la API pública utilizan la URL base: `https://ejemplo-dominio.com/api`
