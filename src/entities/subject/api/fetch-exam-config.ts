import { apiRequest } from "@/shared/api";
import type { Localized } from "@/shared/config/language";

import type { ExamConfig, Subject, SubjectKind } from "../model/types";

type SubjectDto = {
  code: string;
  kind: SubjectKind;
  name: Localized;
  short_name: Localized;
  icon: string;
  question_count: number;
  duration_minutes: number;
  max_score: number;
};

type ExamConfigDto = {
  required: SubjectDto[];
  profile: SubjectDto[];
  pairs: [string, string][];
};

function toSubject(dto: SubjectDto): Subject {
  return {
    code: dto.code,
    kind: dto.kind,
    name: dto.name,
    shortName: dto.short_name,
    icon: dto.icon,
    questionCount: dto.question_count,
    durationMinutes: dto.duration_minutes,
    maxScore: dto.max_score,
  };
}

export async function fetchExamConfig(): Promise<ExamConfig> {
  const dto = await apiRequest<ExamConfigDto>("/api/v1/catalog/exam-config/");
  return {
    required: dto.required.map(toSubject),
    profile: dto.profile.map(toSubject),
    pairs: dto.pairs,
  };
}
