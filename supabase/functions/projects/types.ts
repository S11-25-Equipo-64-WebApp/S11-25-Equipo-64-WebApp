export interface FormDataInput {
  name: string;
  description?: string;
  // Add other form fields as needed
}

export interface ValidationResult {
  valid: boolean;
  data: FormDataInput | null;
  errors?: Record<string, string>;
}

export type FormInput = {
  name?: unknown;
  description?: unknown;
  [key: string]: unknown;  // Allow other unknown properties
};

