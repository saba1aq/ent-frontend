const STORAGE_KEY = "ent.referral-code";
const QUERY_KEY = "ref";
const MAX_LENGTH = 16;

function normalize(raw: string | null): string {
  if (!raw) {
    return "";
  }
  const cleaned = raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  return cleaned.slice(0, MAX_LENGTH);
}

export function captureReferralCode(): string {
  if (typeof window === "undefined") {
    return "";
  }
  const fromUrl = normalize(new URLSearchParams(window.location.search).get(QUERY_KEY));
  if (!fromUrl) {
    return readReferralCode();
  }
  try {
    window.sessionStorage.setItem(STORAGE_KEY, fromUrl);
  } catch {
    return fromUrl;
  }
  return fromUrl;
}

export function readReferralCode(): string {
  if (typeof window === "undefined") {
    return "";
  }
  try {
    return normalize(window.sessionStorage.getItem(STORAGE_KEY));
  } catch {
    return "";
  }
}

export function clearReferralCode(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
}
