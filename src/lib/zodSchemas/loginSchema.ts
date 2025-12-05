import { z } from "zod";

/**
 * Esquema de validación para el login
 * 
 * Validaciones:
 * - Correo: debe tener al menos un carácter antes de la @ y terminar en .com
 * - Contraseña: debe tener una letra mayúscula, minúscula, un número y un carácter especial
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es requerido")
    .email("Formato de correo inválido")
    .refine(
      (email) => {
        // Verificar que tenga al menos un carácter antes de la @
        const parts = email.split("@");
        if (parts.length !== 2) return false;
        if (parts[0].length < 1) return false;
        
        // Verificar que termine en .com
        return email.endsWith(".com");
      },
      {
        message: "El correo debe tener al menos un carácter antes de la @ y terminar en .com",
      }
    ),
  
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .refine(
      (password) => {
        // Verificar que tenga al menos una letra mayúscula
        const hasUpperCase = /[A-Z]/.test(password);
        // Verificar que tenga al menos una letra minúscula
        const hasLowerCase = /[a-z]/.test(password);
        // Verificar que tenga al menos un número
        const hasNumber = /[0-9]/.test(password);
        // Verificar que tenga al menos un carácter especial
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
      },
      {
        message:
          "La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial",
      }
    ),
});

/**
 * Tipo TypeScript inferido del esquema de login
 */
export type LoginSchema = z.infer<typeof loginSchema>;

