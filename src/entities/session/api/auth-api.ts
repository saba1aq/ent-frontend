import { apiRequest, authorizedRequest, type TokenPair } from "@/shared/api";
import type { Language } from "@/shared/config/language";
import { camelizeKeys } from "@/shared/lib/camelize";

import type { SessionUser, VerificationPurpose } from "../model/types";

type AuthResultDto = TokenPair & { user: unknown };

export type AuthResult = TokenPair & { user: SessionUser };

export type CodeRequestResult = {
  phone: string;
  expiresIn: number;
  resendAfter: number;
  debugCode?: string;
};

export type CodeVerifyResult = {
  verificationToken: string;
  expiresIn: number;
};

function toAuthResult(dto: AuthResultDto): AuthResult {
  return { access: dto.access, refresh: dto.refresh, user: camelizeKeys<SessionUser>(dto.user) };
}

export async function signInRequest(phone: string, password: string): Promise<AuthResult> {
  const dto = await apiRequest<AuthResultDto>("/api/v1/auth/sign-in/", { method: "POST", body: { phone, password } });
  return toAuthResult(dto);
}

export async function requestPhoneCode(phone: string, purpose: VerificationPurpose, language: Language) {
  const dto = await apiRequest<unknown>("/api/v1/auth/phone/request-code/", {
    method: "POST",
    body: { phone, purpose, language },
  });
  return camelizeKeys<CodeRequestResult>(dto);
}

export async function verifyPhoneCode(phone: string, code: string, purpose: VerificationPurpose) {
  const dto = await apiRequest<unknown>("/api/v1/auth/phone/verify-code/", {
    method: "POST",
    body: { phone, code, purpose },
  });
  return camelizeKeys<CodeVerifyResult>(dto);
}

export async function signUpRequest(input: {
  phone: string;
  password: string;
  verificationToken: string;
  language: Language;
  firstName?: string;
  lastName?: string;
  referralCode?: string;
}): Promise<AuthResult> {
  const dto = await apiRequest<AuthResultDto>("/api/v1/auth/sign-up/", {
    method: "POST",
    body: {
      phone: input.phone,
      password: input.password,
      verification_token: input.verificationToken,
      language: input.language,
      first_name: input.firstName ?? "",
      last_name: input.lastName ?? "",
      referral_code: input.referralCode ?? "",
    },
  });
  return toAuthResult(dto);
}

export async function resetPasswordRequest(phone: string, verificationToken: string, newPassword: string) {
  await apiRequest<void>("/api/v1/auth/password/reset/", {
    method: "POST",
    body: { phone, verification_token: verificationToken, new_password: newPassword },
  });
}

export async function fetchMe(): Promise<SessionUser> {
  const dto = await authorizedRequest<unknown>("/api/v1/auth/me/");
  return camelizeKeys<SessionUser>(dto);
}

export async function logoutRequest(refresh: string): Promise<void> {
  await authorizedRequest<void>("/api/v1/auth/logout/", { method: "POST", body: { refresh } });
}
