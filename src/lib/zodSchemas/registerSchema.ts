import { z } from "zod";

/**
 * Esquema de validación para el registro
 *
 * Validaciones:
 * - Nombre: debe contener mínimo 1 letra
 * - Rol: debe ser admin, visitor o editor
 */
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .refine(
      (name) => {
        // Verificar que contenga al menos una letra
        return /[a-zA-Z]/.test(name);
      },
      {
        message: "El nombre debe contener mínimo 1 letra",
      }
    ),

  role: z.enum(["admin", "visitor", "editor"], {
    message: "El rol debe ser admin, visitor o editor",
  }),
});

/**
 * Tipo TypeScript inferido del esquema de registro
 */
export type RegisterSchema = z.infer<typeof registerSchema>;
