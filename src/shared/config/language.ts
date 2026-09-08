export const LANGUAGES = ["kk", "ru"] as const;

export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = "ru";

export const UI_LANGUAGE: Language = "ru";

export const LANGUAGE_NATIVE_NAMES: Record<Language, string> = {
  kk: "Қазақ тілі",
  ru: "Русский язык",
};

export type Localized = Record<Language, string>;
