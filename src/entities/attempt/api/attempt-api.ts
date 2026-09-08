import { authorizedRequest } from "@/shared/api";
import type { Language } from "@/shared/config/language";
import { camelizeKeys } from "@/shared/lib/camelize";

import type {
  AttemptHistory,
  AttemptOverview,
  AttemptResults,
  AttemptSummary,
  QuestionDetail,
  QuestionReview,
} from "../model/types";

const BASE = "/api/v1/attempts";

export async function listAttempts(): Promise<AttemptSummary[]> {
  return camelizeKeys<AttemptSummary[]>(await authorizedRequest<unknown>(`${BASE}/`));
}

export async function createAttempt(language: Language, profileSubjects: string[]): Promise<AttemptOverview> {
  const dto = await authorizedRequest<unknown>(`${BASE}/`, {
    method: "POST",
    body: { language, profile_subjects: profileSubjects },
  });
  return camelizeKeys<AttemptOverview>(dto);
}

export async function fetchAttempt(attemptId: number | string): Promise<AttemptOverview> {
  return camelizeKeys<AttemptOverview>(await authorizedRequest<unknown>(`${BASE}/${attemptId}/`));
}

export async function fetchQuestion(attemptId: number | string, questionId: number | string): Promise<QuestionDetail> {
  return camelizeKeys<QuestionDetail>(await authorizedRequest<unknown>(`${BASE}/${attemptId}/questions/${questionId}/`));
}

export async function saveAnswer(attemptId: number | string, questionId: number | string, optionIds: number[]) {
  const dto = await authorizedRequest<{ selected_option_ids: number[] }>(
    `${BASE}/${attemptId}/questions/${questionId}/answer/`,
    { method: "PUT", body: { option_ids: optionIds } },
  );
  return dto.selected_option_ids;
}

export async function toggleFlag(attemptId: number | string, questionId: number | string): Promise<boolean> {
  const dto = await authorizedRequest<{ is_flagged: boolean }>(`${BASE}/${attemptId}/questions/${questionId}/flag/`, {
    method: "POST",
  });
  return dto.is_flagged;
}

export async function addTimeSpent(attemptId: number | string, questionId: number | string, seconds: number) {
  const dto = await authorizedRequest<{ time_spent_seconds: number }>(
    `${BASE}/${attemptId}/questions/${questionId}/time/`,
    { method: "POST", body: { seconds } },
  );
  return dto.time_spent_seconds;
}

export async function finishAttempt(attemptId: number | string): Promise<AttemptResults> {
  return camelizeKeys<AttemptResults>(await authorizedRequest<unknown>(`${BASE}/${attemptId}/finish/`, { method: "POST" }));
}

export async function fetchResults(attemptId: number | string): Promise<AttemptResults> {
  return camelizeKeys<AttemptResults>(await authorizedRequest<unknown>(`${BASE}/${attemptId}/results/`));
}

export async function fetchReview(attemptId: number | string, questionId: number | string): Promise<QuestionReview> {
  return camelizeKeys<QuestionReview>(
    await authorizedRequest<unknown>(`${BASE}/${attemptId}/questions/${questionId}/review/`),
  );
}

export const HISTORY_PAGE_SIZE = 10;

export async function fetchAttemptHistory(offset = 0, limit = HISTORY_PAGE_SIZE): Promise<AttemptHistory> {
  const query = new URLSearchParams({ offset: String(offset), limit: String(limit) });
  return camelizeKeys<AttemptHistory>(await authorizedRequest<unknown>(`${BASE}/history/?${query}`));
}
