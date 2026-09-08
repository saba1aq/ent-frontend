import { ApiError, apiRequest } from "./http";
import { clearTokens, readTokens, type TokenPair, writeTokens } from "./token-storage";

type AuthorizedOptions = Omit<Parameters<typeof apiRequest>[1], "token">;

let refreshing: Promise<TokenPair | null> | null = null;

export class NotAuthenticatedError extends ApiError {
  constructor() {
    super(401, "not_authenticated", "Требуется вход", null);
    this.name = "NotAuthenticatedError";
  }
}

async function refreshTokens(): Promise<TokenPair | null> {
  const tokens = readTokens();
  if (!tokens) {
    return null;
  }
  try {
    const pair = await apiRequest<TokenPair>("/api/v1/auth/token/refresh/", {
      method: "POST",
      body: { refresh: tokens.refresh },
    });
    writeTokens(pair);
    return pair;
  } catch {
    clearTokens();
    return null;
  }
}

function refreshOnce(): Promise<TokenPair | null> {
  refreshing ??= refreshTokens().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

export async function authorizedRequest<T>(path: string, options: AuthorizedOptions = {}): Promise<T> {
  const tokens = readTokens();
  if (!tokens) {
    throw new NotAuthenticatedError();
  }

  try {
    return await apiRequest<T>(path, { ...options, token: tokens.access });
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) {
      throw error;
    }
    const fresh = await refreshOnce();
    if (!fresh) {
      throw new NotAuthenticatedError();
    }
    return apiRequest<T>(path, { ...options, token: fresh.access });
  }
}
