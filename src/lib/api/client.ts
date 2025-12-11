import createClient from "openapi-fetch";

import type { components, paths } from "@/lib/schema";

export type Entry = components["schemas"]["Entry"];
export type EntryStatus = components["schemas"]["EntryStatus"];
export type MediaSource = components["schemas"]["MediaSource"];
export type CreateEntryInput = components["schemas"]["CreateEntryInput"];
export type UpdateEntryInput = components["schemas"]["UpdateEntryInput"];
export type ApproveEntryInput = components["schemas"]["ApproveEntryInput"];
export type UserProfile = components["schemas"]["UserProfile"];
export type MediaSignature = components["schemas"]["MediaSignature"];
export type CloudinaryDestroyResult = components["schemas"]["CloudinaryDestroyResult"];
export type ErrorResponse = components["schemas"]["ErrorResponse"];

export type ApiError = {
  status: number;
  message: string;
  code?: string;
  issues?: ErrorResponse["issues"];
};

export type ApiResult<T> = {
  data?: T;
  etag?: string;
  response?: Response;
  error?: ApiError;
};

export type AuthHeaders = {
  apiKey?: string | null;
  bearerToken?: string | null;
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string) {
  return slugPattern.test(slug);
}

function trimEmpty<T extends Record<string, unknown>>(value: T) {
  const output: Record<string, unknown> = {};

  Object.entries(value).forEach(([key, val]) => {
    if (val === undefined || val === null || val === "") return;
    output[key] = val;
  });

  return output as Partial<T>;
}

export class ApiClient {
  private client;
  private etags = new Map<string, string>();
  private readonly baseUrl: string;

  constructor(baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "") {
    this.baseUrl = baseUrl;
    this.client = createClient<paths>({
      baseUrl: baseUrl || undefined,
    });
  }

  getBaseUrl() {
    return this.baseUrl || "/";
  }

  getCachedEtag(slug: string) {
    return this.etags.get(slug);
  }

  clearEtag(slug: string) {
    this.etags.delete(slug);
  }

  private rememberEtag(slug: string | null, response?: Response) {
    if (!slug || !response) return;
    const etag = response.headers.get("etag");
    if (etag) {
      this.etags.set(slug, etag);
    }
  }

  private buildHeaders(auth?: AuthHeaders, ifMatch?: string) {
    const headers: Record<string, string> = {};
    if (auth?.apiKey) headers["x-api-key"] = auth.apiKey;
    if (auth?.bearerToken) headers.Authorization = `Bearer ${auth.bearerToken}`;
    if (ifMatch) headers["If-Match"] = ifMatch;
    return headers;
  }

  private buildError(
    payload: { response?: Response; data?: ErrorResponse },
    fallback = "Ocurrió un error inesperado"
  ): ApiError {
    const { response, data } = payload;
    return {
      status: response?.status ?? 0,
      message: (data?.message ?? response?.statusText ?? fallback) ?? fallback,
      code: data?.code,
      issues: data?.issues,
    };
  }

  async validateKey(apiKey: string): Promise<ApiResult<UserProfile>> {
    try {
      const { data, error, response } = await this.client.POST("/api/v1/auth/validate", {
        headers: this.buildHeaders({ apiKey }),
      });

      if (error) {
        return { error: this.buildError({ response, data: error }, "API key inválida"), response };
      }

      return { data: data?.data, response };
    } catch {
      return {
        error: this.buildError({ response: undefined, data: undefined }, "No se pudo validar la API key"),
      };
    }
  }

  async listEntries({
    auth,
    filters = {},
    org,
  }: {
    auth?: AuthHeaders;
    filters?: {
      includeDrafts?: boolean;
      status?: "approved" | "draft";
      tag?: string;
      author?: string;
      sort?: "date_desc" | "date_asc";
    };
    org?: string;
  }): Promise<ApiResult<Entry[]>> {
    try {
      const { data, error, response } = await this.client.GET("/api/v1/entries", {
        params: { query: trimEmpty({ ...filters, org }) },
        headers: this.buildHeaders(auth),
      });

      if (error) {
        return {
          error: this.buildError({ response, data: error }, "No se pudieron cargar los testimonios"),
          response,
        };
      }

      return { data: data?.data ?? [], response };
    } catch {
      return {
        error: this.buildError({ response: undefined, data: undefined }, "No se pudieron cargar los testimonios"),
      };
    }
  }

  async getEntry(slug: string, auth?: AuthHeaders, org?: string): Promise<ApiResult<Entry>> {
    try {
      const { data, error, response } = await this.client.GET("/api/v1/entries/{slug}", {
        params: { path: { slug }, query: trimEmpty({ org }) },
        headers: this.buildHeaders(auth),
      });

      if (error) {
        return {
          error: this.buildError({ response, data: error }, "No se encontró el testimonio"),
          response,
        };
      }

      this.rememberEtag(slug, response);
      return { data: data?.data, response, etag: this.getCachedEtag(slug) };
    } catch {
      return {
        error: this.buildError({ response: undefined, data: undefined }, "No se encontró el testimonio"),
      };
    }
  }

  async createEntry(
    body: CreateEntryInput,
    auth: AuthHeaders
  ): Promise<ApiResult<Entry>> {
    try {
      const { data, error, response } = await this.client.POST("/api/v1/entries", {
        body,
        headers: this.buildHeaders(auth),
      });

      if (error) {
        return {
          error: this.buildError({ response, data: error }, "No se pudo crear la entrada"),
          response,
        };
      }

      this.rememberEtag(data?.data?.slug ?? null, response);
      return { data: data?.data, response, etag: this.getCachedEtag(data?.data?.slug ?? "") };
    } catch {
      return {
        error: this.buildError({ response: undefined, data: undefined }, "No se pudo crear la entrada"),
      };
    }
  }

  async updateEntry(
    slug: string,
    body: UpdateEntryInput,
    auth: AuthHeaders,
    ifMatch?: string
  ): Promise<ApiResult<Entry>> {
    try {
      const etag = ifMatch ?? this.getCachedEtag(slug);
      const { data, error, response } = await this.client.PATCH("/api/v1/entries/{slug}", {
        params: { path: { slug } },
        body,
        headers: this.buildHeaders(auth, etag),
      });

      if (error) {
        return {
          error: this.buildError({ response, data: error }, "No se pudo actualizar la entrada"),
          response,
        };
      }

      this.rememberEtag(slug, response);
      return { data: data?.data, response, etag: this.getCachedEtag(slug) };
    } catch {
      return {
        error: this.buildError({ response: undefined, data: undefined }, "No se pudo actualizar la entrada"),
      };
    }
  }

  async approveEntry(slug: string, approve: boolean, auth: AuthHeaders): Promise<ApiResult<Entry>> {
    try {
      const { data, error, response } = await this.client.POST("/api/v1/entries/{slug}/approve", {
        params: { path: { slug } },
        body: { approve },
        headers: this.buildHeaders(auth),
      });

      if (error) {
        return {
          error: this.buildError({ response, data: error }, "No se pudo cambiar el estado"),
          response,
        };
      }

      this.rememberEtag(slug, response);
      return { data: data?.data, response, etag: this.getCachedEtag(slug) };
    } catch {
      return {
        error: this.buildError({ response: undefined, data: undefined }, "No se pudo cambiar el estado"),
      };
    }
  }

  async signMedia(auth: AuthHeaders): Promise<ApiResult<MediaSignature>> {
    try {
      const { data, error, response } = await this.client.POST("/api/v1/media/sign", {
        headers: this.buildHeaders(auth),
      });

      if (error) {
        return {
          error: this.buildError({ response, data: error }, "No se pudo generar la firma"),
          response,
        };
      }

      return { data: data?.data, response };
    } catch {
      return {
        error: this.buildError({ response: undefined, data: undefined }, "No se pudo generar la firma"),
      };
    }
  }

  async deleteMedia(publicId: string, auth: AuthHeaders): Promise<ApiResult<CloudinaryDestroyResult>> {
    try {
      const { data, error, response } = await this.client.DELETE("/api/v1/media/delete", {
        body: { public_id: publicId },
        headers: this.buildHeaders(auth),
      });

      if (error) {
        return {
          error: this.buildError({ response, data: error }, "No se pudo eliminar el asset"),
          response,
        };
      }

      return { data: data?.data, response };
    } catch {
      return {
        error: this.buildError({ response: undefined, data: undefined }, "No se pudo eliminar el asset"),
      };
    }
  }
}
