"use client";

import { useCallback, useEffect, useMemo } from "react";

import { type ExamConfig, isPairAllowed, type Subject } from "@/entities/subject";
import { DEFAULT_TEST_LANGUAGE, type Language } from "@/shared/config/language";

import { consumePendingExamSetup, useStoredExamSetup } from "./exam-setup-store";
import { computeExamTotals, PROFILE_SUBJECT_SLOTS } from "./exam-totals";
import type { SubjectAvailability } from "./types";

export function useExamSetup(config: ExamConfig) {
  const [stored, save] = useStoredExamSetup();

  useEffect(() => {
    consumePendingExamSetup();
  }, []);

  const testLanguage = stored?.language ?? DEFAULT_TEST_LANGUAGE;

  const selectedCodes = useMemo(() => {
    const knownCodes = new Set(config.profile.map((subject) => subject.code));
    return (stored?.profileSubjects ?? []).filter((code) => knownCodes.has(code)).slice(0, PROFILE_SUBJECT_SLOTS);
  }, [config.profile, stored]);

  const setTestLanguage = useCallback(
    (language: Language) => save({ language, profileSubjects: selectedCodes }),
    [save, selectedCodes],
  );

  const toggleSubject = useCallback(
    (code: string) => {
      const next = selectedCodes.includes(code)
        ? selectedCodes.filter((selected) => selected !== code)
        : selectedCodes.length >= PROFILE_SUBJECT_SLOTS ||
            (selectedCodes.length === 1 && !isPairAllowed(config.pairs, selectedCodes[0], code))
          ? selectedCodes
          : [...selectedCodes, code];

      if (next !== selectedCodes) {
        save({ language: testLanguage, profileSubjects: next });
      }
    },
    [config.pairs, save, selectedCodes, testLanguage],
  );

  const availability = useMemo(() => {
    const resolve = (code: string): SubjectAvailability => {
      if (selectedCodes.includes(code)) {
        return "selected";
      }
      if (selectedCodes.length >= PROFILE_SUBJECT_SLOTS) {
        return "unavailable";
      }
      if (selectedCodes.length === 1 && !isPairAllowed(config.pairs, selectedCodes[0], code)) {
        return "unavailable";
      }
      return "available";
    };

    return new Map(config.profile.map((subject) => [subject.code, resolve(subject.code)]));
  }, [config.pairs, config.profile, selectedCodes]);

  const selectedSubjects = useMemo(
    () =>
      selectedCodes
        .map((code) => config.profile.find((subject) => subject.code === code))
        .filter((subject): subject is Subject => subject !== undefined),
    [config.profile, selectedCodes],
  );

  const totals = useMemo(() => computeExamTotals(config, selectedSubjects), [config, selectedSubjects]);
  const emptySlotCount = PROFILE_SUBJECT_SLOTS - selectedSubjects.length;

  return {
    testLanguage,
    setTestLanguage,
    requiredSubjects: config.required,
    profileSubjects: config.profile,
    selectedSubjects,
    availability,
    toggleSubject,
    totals,
    emptySlotCount,
    isReady: emptySlotCount === 0,
  };
}
