import { API_URL } from "@/shared/config/env";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  token?: string;
  cache?: RequestCache;
  signal?: AbortSignal;
};

type ErrorPayload = {
  detail?: unknown;
  code?: unknown;
  [field: string]: unknown;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | null;
  readonly payload: unknown;

  constructor(status: number, code: string | null, detail: string, payload: unknown) {
    super(detail);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.payload = payload;
  }
}

function readDetail(payload: ErrorPayload | null, status: number): string {
  if (payload && typeof payload.detail === "string") {
    return payload.detail;
  }
  if (payload) {
    const firstField = Object.entries(payload).find(([key]) => key !== "code");
    if (firstField) {
      const [, value] = firstField;
      const message = Array.isArray(value) ? value[0] : value;
      if (typeof message === "string") {
        return message;
      }
    }
  }
  return `Ошибка запроса (${status})`;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: options.cache ?? "no-store",
    signal: options.signal,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json().catch(() => null)) as ErrorPayload | null;

  if (!response.ok) {
    const code = payload && typeof payload.code === "string" ? payload.code : null;
    throw new ApiError(response.status, code, readDetail(payload, response.status), payload);
  }

  return payload as T;
}
