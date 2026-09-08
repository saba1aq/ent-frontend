import type { Language } from "@/shared/config/language";

export type SessionUser = {
  id: number;
  phone: string;
  firstName: string;
  language: Language;
  dateJoined: string;
};

export type SessionStatus = "unknown" | "anonymous" | "authenticated";

export type VerificationPurpose = "registration" | "password_reset";
