export type SubjectAvailability = "selected" | "available" | "unavailable";

export type ExamTotals = {
  questionCount: number;
  maxScore: number;
  durationMinutes: number;
  emptySlotMinutes: number;
};
