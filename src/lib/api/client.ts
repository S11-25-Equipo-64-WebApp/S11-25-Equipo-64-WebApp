import type { components } from "@/lib/schema";

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
  private etags = new Map<string, string>();
  private readonly baseUrl: string;

  constructor(baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "") {
    this.baseUrl = baseUrl;
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

  private buildUrl(
    path: string,
    query?: Record<string, string | number | boolean | undefined>
  ) {
    if (!this.baseUrl) {
      if (!query) return path;
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        params.set(key, String(value));
      });
      const qs = params.toString();
      return qs ? `${path}?${qs}` : path;
    }

    const url = new URL(path, this.baseUrl);
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        url.searchParams.set(key, String(value));
      });
    }
    return url.toString();
  }

  private async request<T>(
    path: string,
    init: RequestInit,
    {
      slugForEtag,
      fallbackMessage,
    }: { slugForEtag?: string | null; fallbackMessage: string }
  ): Promise<ApiResult<T>> {
    let response: Response;
    try {
      response = await fetch(path, init);
    } catch {
      return {
        error: this.buildError(
          { response: undefined, data: undefined },
          fallbackMessage
        ),
      };
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      payload = undefined;
    }

    if (!response.ok) {
      return {
        error: this.buildError(
          { response, data: payload as ErrorResponse },
          fallbackMessage
        ),
        response,
      };
    }

    this.rememberEtag(slugForEtag ?? null, response);

    return {
      data: (payload as { data?: T } | undefined)?.data,
      response,
      etag: slugForEtag ? this.getCachedEtag(slugForEtag) : undefined,
    };
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
    const url = this.buildUrl("/api/v1/auth/validate");
    return this.request<UserProfile>(
      url,
      { method: "POST", headers: this.buildHeaders({ apiKey }) },
      { fallbackMessage: "No se pudo validar la API key" }
    );
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
    const url = this.buildUrl(
      "/api/v1/entries",
      trimEmpty({ ...filters, org }) as Record<
        string,
        string | number | boolean | undefined
      >
    );

    const result = await this.request<Entry[]>(
      url,
      { method: "GET", headers: this.buildHeaders(auth) },
      { fallbackMessage: "No se pudieron cargar los testimonios" }
    );

    if (result.data === undefined && !result.error) {
      return { ...result, data: [] };
    }

    return result;
  }

  async getEntry(slug: string, auth?: AuthHeaders, org?: string): Promise<ApiResult<Entry>> {
    const url = this.buildUrl(
      `/api/v1/entries/${slug}`,
      trimEmpty({ org }) as Record<
        string,
        string | number | boolean | undefined
      >
    );
    return this.request<Entry>(
      url,
      { method: "GET", headers: this.buildHeaders(auth) },
      { slugForEtag: slug, fallbackMessage: "No se encontró el testimonio" }
    );
  }

  async createEntry(
    body: CreateEntryInput,
    auth: AuthHeaders
  ): Promise<ApiResult<Entry>> {
    const url = this.buildUrl("/api/v1/entries");
    const result = await this.request<Entry>(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.buildHeaders(auth),
        },
        body: JSON.stringify(body),
      },
      { fallbackMessage: "No se pudo crear la entrada" }
    );

    const createdSlug = result.data?.slug;
    if (createdSlug && result.response) {
      this.rememberEtag(createdSlug, result.response);
      return { ...result, etag: this.getCachedEtag(createdSlug) };
    }

    return result;
  }

  async updateEntry(
    slug: string,
    body: UpdateEntryInput,
    auth: AuthHeaders,
    ifMatch?: string
  ): Promise<ApiResult<Entry>> {
    const url = this.buildUrl(`/api/v1/entries/${slug}`);
    const etag = ifMatch ?? this.getCachedEtag(slug);
    return this.request<Entry>(
      url,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...this.buildHeaders(auth, etag),
        },
        body: JSON.stringify(body),
      },
      { slugForEtag: slug, fallbackMessage: "No se pudo actualizar la entrada" }
    );
  }

  async approveEntry(slug: string, approve: boolean, auth: AuthHeaders): Promise<ApiResult<Entry>> {
    const url = this.buildUrl(`/api/v1/entries/${slug}/approve`);
    return this.request<Entry>(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.buildHeaders(auth),
        },
        body: JSON.stringify({ approve }),
      },
      { slugForEtag: slug, fallbackMessage: "No se pudo cambiar el estado" }
    );
  }

  async signMedia(auth: AuthHeaders): Promise<ApiResult<MediaSignature>> {
    const url = this.buildUrl("/api/v1/media/sign");
    return this.request<MediaSignature>(
      url,
      { method: "POST", headers: this.buildHeaders(auth) },
      { fallbackMessage: "No se pudo generar la firma" }
    );
  }

  async deleteMedia(publicId: string, auth: AuthHeaders): Promise<ApiResult<CloudinaryDestroyResult>> {
    const url = this.buildUrl("/api/v1/media/delete");
    return this.request<CloudinaryDestroyResult>(
      url,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...this.buildHeaders(auth),
        },
        body: JSON.stringify({ public_id: publicId }),
      },
      { fallbackMessage: "No se pudo eliminar el asset" }
    );
  }
}
