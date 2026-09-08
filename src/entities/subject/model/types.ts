import type { Localized } from "@/shared/config/language";

export type SubjectKind = "required" | "profile";

export type Subject = {
  code: string;
  kind: SubjectKind;
  name: Localized;
  shortName: Localized;
  icon: string;
  questionCount: number;
  durationMinutes: number;
  maxScore: number;
};

export type SubjectPair = readonly [string, string];

export type ExamConfig = {
  required: Subject[];
  profile: Subject[];
  pairs: SubjectPair[];
};
