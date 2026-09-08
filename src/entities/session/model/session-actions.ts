import { clearTokens, readTokens, type TokenScope, writeTokens } from "@/shared/api";
import type { Language } from "@/shared/config/language";

import {
  logoutRequest,
  resetPasswordRequest,
  signInRequest,
  signUpRequest,
} from "../api/auth-api";
import type { SessionUser } from "./types";

export async function signIn(phone: string, password: string, remember: boolean): Promise<SessionUser> {
  const result = await signInRequest(phone, password);
  const scope: TokenScope = remember ? "local" : "session";
  writeTokens({ access: result.access, refresh: result.refresh }, scope);
  return result.user;
}

export async function signUp(input: {
  phone: string;
  password: string;
  verificationToken: string;
  language: Language;
}): Promise<SessionUser> {
  const result = await signUpRequest(input);
  writeTokens({ access: result.access, refresh: result.refresh }, "local");
  return result.user;
}

export async function resetPasswordAndSignIn(phone: string, verificationToken: string, newPassword: string) {
  await resetPasswordRequest(phone, verificationToken, newPassword);
  return signIn(phone, newPassword, false);
}

export async function signOut(): Promise<void> {
  const tokens = readTokens();
  clearTokens();
  if (tokens) {
    await logoutRequest(tokens.refresh).catch(() => undefined);
  }
}
