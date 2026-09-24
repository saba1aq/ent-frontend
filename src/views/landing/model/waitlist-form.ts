import { isPairAllowed } from "@/entities/subject";
import { LANGUAGES, type Language } from "@/shared/config/language";
import { isPhoneComplete, phoneToE164 } from "@/shared/lib/phone";

import type { ContactKind, WaitlistRequest } from "../api/waitlist-api";
import { PROFILE_PAIRS } from "./profile-subjects";

const TELEGRAM_RE = /^[A-Za-z][A-Za-z0-9_]{4,31}$/;
const PHONE_E164_RE = /^\+77\d{9}$/;
const NAME_MAX_LENGTH = 80;

export type WaitlistDraft = {
  name: string;
  contactKind: ContactKind;
  telegram: string;
  phone: string;
  language: Language;
  subjects: string[];
  undecided: boolean;
  consent: boolean;
};

export type WaitlistErrors = Partial<Record<"name" | "contact" | "subjects" | "consent", string>>;

export function telegramUsername(raw: string): string {
  return raw.trim().replace(/^(https?:\/\/)?t\.me\//, "").replace(/^@/, "");
}

export function validateDraft(draft: WaitlistDraft): WaitlistErrors {
  const errors: WaitlistErrors = {};

  if (draft.name.trim().length < 2 || draft.name.trim().length > NAME_MAX_LENGTH) {
    errors.name = "Как к вам обращаться?";
  }
  if (draft.contactKind === "telegram" && !TELEGRAM_RE.test(telegramUsername(draft.telegram))) {
    errors.contact = "Ник в Telegram — от 5 символов, латиница, цифры и «_».";
  }
  if (draft.contactKind === "phone" && !isPhoneComplete(draft.phone)) {
    errors.contact = "Введите номер полностью — 10 цифр после +7.";
  }
  if (!draft.undecided && draft.subjects.length !== 2) {
    errors.subjects = "Выберите два предмета или отметьте, что ещё не решили.";
  }
  if (!draft.consent) {
    errors.consent = "Без согласия мы не сможем написать вам о запуске.";
  }
  return errors;
}

export function toRequest(draft: WaitlistDraft): WaitlistRequest {
  return {
    name: draft.name.trim(),
    contactKind: draft.contactKind,
    contact: draft.contactKind === "telegram" ? telegramUsername(draft.telegram) : phoneToE164(draft.phone),
    language: draft.language,
    profileSubjects: draft.undecided ? [] : draft.subjects,
    consent: draft.consent,
  };
}

function isValidContact(kind: unknown, contact: unknown): kind is ContactKind {
  if (typeof contact !== "string") {
    return false;
  }
  return (kind === "telegram" && TELEGRAM_RE.test(contact)) || (kind === "phone" && PHONE_E164_RE.test(contact));
}

function isValidSubjects(subjects: unknown): subjects is string[] {
  if (!Array.isArray(subjects)) {
    return false;
  }
  if (subjects.length === 0) {
    return true;
  }
  const [first, second] = subjects;
  return (
    subjects.length === 2 &&
    typeof first === "string" &&
    typeof second === "string" &&
    isPairAllowed(PROFILE_PAIRS, first, second)
  );
}

export function parseWaitlistRequest(body: unknown): WaitlistRequest | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }
  const { name, contactKind, contact, language, profileSubjects, consent } = body as Record<string, unknown>;
  const trimmedName = typeof name === "string" ? name.trim() : "";

  if (
    trimmedName.length < 2 ||
    trimmedName.length > NAME_MAX_LENGTH ||
    !isValidContact(contactKind, contact) ||
    !LANGUAGES.includes(language as Language) ||
    !isValidSubjects(profileSubjects) ||
    consent !== true
  ) {
    return null;
  }
  return {
    name: trimmedName,
    contactKind,
    contact: contact as string,
    language: language as Language,
    profileSubjects,
    consent,
  };
}
