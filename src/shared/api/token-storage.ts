export type TokenPair = {
  access: string;
  refresh: string;
};

export type TokenScope = "local" | "session";

const STORAGE_KEY = "ent.session.tokens";
const listeners = new Set<() => void>();
let memoryTokens: TokenPair | null = null;

function storageFor(scope: TokenScope): Storage | null {
  try {
    return scope === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function readFrom(scope: TokenScope): TokenPair | null {
  const storage = storageFor(scope);
  if (!storage) {
    return null;
  }
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TokenPair) : null;
  } catch {
    return null;
  }
}

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function readTokenScope(): TokenScope | null {
  if (typeof window === "undefined") {
    return null;
  }
  if (readFrom("local")) {
    return "local";
  }
  if (readFrom("session")) {
    return "session";
  }
  return null;
}

export function readTokens(): TokenPair | null {
  if (typeof window === "undefined") {
    return null;
  }
  return readFrom("local") ?? readFrom("session") ?? memoryTokens;
}

export function readTokensRaw(): string | null {
  const tokens = readTokens();
  return tokens ? JSON.stringify(tokens) : null;
}

export function writeTokens(tokens: TokenPair, scope: TokenScope = readTokenScope() ?? "session"): void {
  const target = storageFor(scope);
  const other = storageFor(scope === "local" ? "session" : "local");
  try {
    other?.removeItem(STORAGE_KEY);
    target?.setItem(STORAGE_KEY, JSON.stringify(tokens));
    memoryTokens = target ? null : tokens;
  } catch {
    memoryTokens = tokens;
  }
  notify();
}

export function clearTokens(): void {
  memoryTokens = null;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    memoryTokens = null;
  }
  notify();
}

export function subscribeTokens(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}
