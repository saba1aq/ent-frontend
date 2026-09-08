import type { ExamConfig, Subject } from "@/entities/subject";

import type { ExamTotals } from "./types";

export const PROFILE_SUBJECT_SLOTS = 2;

function sumBy(subjects: readonly Subject[], pick: (subject: Subject) => number): number {
  return subjects.reduce((total, subject) => total + pick(subject), 0);
}

export function computeExamTotals(config: ExamConfig, selected: readonly Subject[]): ExamTotals {
  const emptySlotCount = PROFILE_SUBJECT_SLOTS - selected.length;
  const profileLoad = config.profile[0];
  const emptySlotMinutes = profileLoad?.durationMinutes ?? 0;

  return {
    questionCount:
      sumBy(config.required, (s) => s.questionCount) +
      sumBy(selected, (s) => s.questionCount) +
      emptySlotCount * (profileLoad?.questionCount ?? 0),
    maxScore:
      sumBy(config.required, (s) => s.maxScore) +
      sumBy(selected, (s) => s.maxScore) +
      emptySlotCount * (profileLoad?.maxScore ?? 0),
    durationMinutes:
      sumBy(config.required, (s) => s.durationMinutes) +
      sumBy(selected, (s) => s.durationMinutes) +
      emptySlotCount * emptySlotMinutes,
    emptySlotMinutes,
  };
}
