import { randomUUID } from "crypto";

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type UserRecord = {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
};

const users = new Map<string, UserRecord>();

export class AuthError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function ensureEmail(value: string | undefined | null) {
  if (!value) {
    throw new AuthError("Debes proporcionar un correo electrónico válido.", 400);
  }

  const trimmed = value.trim();

  if (!EMAIL_PATTERN.test(trimmed)) {
    throw new AuthError("El correo electrónico no tiene el formato correcto.", 400);
  }

  return trimmed;
}

function ensurePassword(value: string | undefined | null) {
  if (!value) {
    throw new AuthError("Debes proporcionar una contraseña.", 400);
  }

  if (value.length < MIN_PASSWORD_LENGTH) {
    throw new AuthError(
      `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`,
      400
    );
  }

  return value;
}

function ensureName(value: string | undefined | null) {
  if (!value) {
    throw new AuthError("Debes proporcionar tu nombre completo.", 400);
  }

  const trimmed = value.trim();

  if (!trimmed) {
    throw new AuthError("El nombre no puede estar vacío.", 400);
  }

  return trimmed;
}

export function registerUser(payload: RegisterPayload): AuthUser {
  const name = ensureName(payload.name);
  const email = normalizeEmail(ensureEmail(payload.email));
  const password = ensurePassword(payload.password);

  if (users.has(email)) {
    throw new AuthError("Ya existe una cuenta con ese correo electrónico.", 409);
  }

  const record: UserRecord = {
    id: randomUUID(),
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  users.set(email, record);

  return { id: record.id, name: record.name, email: record.email };
}

export function authenticateUser(payload: LoginPayload): AuthUser {
  const email = normalizeEmail(ensureEmail(payload.email));
  const password = ensurePassword(payload.password);

  const record = users.get(email);

  if (!record || record.password !== password) {
    throw new AuthError("Correo electrónico o contraseña inválidos.", 401);
  }

  return { id: record.id, name: record.name, email: record.email };
}
