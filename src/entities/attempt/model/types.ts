import type { Language, Localized } from "@/shared/config/language";

export type AttemptStatus = "in_progress" | "finished" | "expired";

export type AnswerStatus = "correct" | "wrong" | "empty";

export type QuestionKind = "single" | "multiple";

export type SubjectBrief = {
  code: string;
  name: Localized;
  shortName: Localized;
};

export type QuestionNav = {
  id: number;
  number: number;
  isAnswered: boolean;
  isFlagged: boolean;
};

export type SectionOverview = {
  id: number;
  order: number;
  subject: SubjectBrief;
  questionCount: number;
  answeredCount: number;
  questions: QuestionNav[];
};

export type AttemptOverview = {
  id: number;
  status: AttemptStatus;
  language: Language;
  startedAt: string;
  deadlineAt: string;
  finishedAt: string | null;
  totalScore: number;
  maxScore: number;
  serverTime: string;
  sections: SectionOverview[];
};

export type AttemptSummary = {
  id: number;
  status: AttemptStatus;
  language: Language;
  startedAt: string;
  deadlineAt: string;
  finishedAt: string | null;
  totalScore: number;
  maxScore: number;
  subjects: string[];
};

export type AnswerOptionPublic = {
  id: number;
  text: string;
};

export type QuestionDetail = {
  id: number;
  number: number;
  sectionId: number;
  kind: QuestionKind;
  text: string;
  isFlagged: boolean;
  timeSpentSeconds: number;
  options: AnswerOptionPublic[];
  selectedOptionIds: number[];
};

export type QuestionResult = {
  id: number;
  number: number;
  status: AnswerStatus;
};

export type SectionResult = {
  id: number;
  order: number;
  subject: SubjectBrief;
  questionCount: number;
  answeredCount: number;
  correctCount: number;
  score: number;
  maxScore: number;
  accuracyPercent: number;
  timeSpentSeconds: number;
  answers: QuestionResult[];
};

export type AttemptResults = {
  id: number;
  status: AttemptStatus;
  language: Language;
  startedAt: string;
  finishedAt: string | null;
  totalScore: number;
  maxScore: number;
  sections: SectionResult[];
};

export type ReviewOption = {
  id: number;
  text: string;
  isCorrect: boolean;
  isSelected: boolean;
};

export type QuestionReview = {
  id: number;
  number: number;
  sectionId: number;
  kind: QuestionKind;
  text: string;
  explanation: string;
  options: ReviewOption[];
  isCorrect: boolean | null;
  score: number;
  maxScore: number;
};

export type AttemptHistoryItem = {
  id: number;
  number: number;
  status: AttemptStatus;
  language: Language;
  startedAt: string;
  finishedAt: string | null;
  totalScore: number;
  maxScore: number;
  questionCount: number;
  correctCount: number;
  accuracyPercent: number;
  timeSpentSeconds: number;
  subjects: SubjectBrief[];
};

export type AttemptHistorySummary = {
  finishedCount: number;
  bestScore: number | null;
  maxScore: number | null;
  averageScore: number | null;
  averageAccuracyPercent: number | null;
  totalTimeSpentSeconds: number;
  activeAttemptId: number | null;
};

export type AttemptHistory = {
  summary: AttemptHistorySummary;
  items: AttemptHistoryItem[];
  totalCount: number;
  offset: number;
  limit: number;
};
