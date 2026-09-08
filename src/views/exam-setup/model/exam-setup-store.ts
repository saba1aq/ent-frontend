"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { LANGUAGES, type Language } from "@/shared/config/language";

const STORAGE_KEY = "ent.exam-setup";

export type StoredExamSetup = {
  language: Language;
  profileSubjects: string[];
};

const listeners = new Set<() => void>();
let memoryFallback: string | null = null;

function isLanguage(value: unknown): value is Language {
  return typeof value === "string" && (LANGUAGES as readonly string[]).includes(value);
}

function parse(raw: string | null): StoredExamSetup | null {
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<StoredExamSetup>;
    if (!isLanguage(parsed.language) || !Array.isArray(parsed.profileSubjects)) {
      return null;
    }
    return {
      language: parsed.language,
      profileSubjects: parsed.profileSubjects.filter((code): code is string => typeof code === "string"),
    };
  } catch {
    return null;
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot(): string | null {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) ?? memoryFallback;
  } catch {
    return memoryFallback;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

function write(setup: StoredExamSetup): void {
  const raw = JSON.stringify(setup);
  try {
    window.sessionStorage.setItem(STORAGE_KEY, raw);
  } catch {
    memoryFallback = raw;
  }
  listeners.forEach((listener) => listener());
}

export function useStoredExamSetup(): [StoredExamSetup | null, (setup: StoredExamSetup) => void] {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = useMemo(() => parse(raw), [raw]);
  const save = useCallback((setup: StoredExamSetup) => write(setup), []);
  return [value, save];
}
