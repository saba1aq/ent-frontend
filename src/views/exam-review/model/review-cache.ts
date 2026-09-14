import { type AttemptResults, fetchResults, fetchReview, type QuestionReview } from "@/entities/attempt";

const resultsRequests = new Map<string, Promise<AttemptResults>>();
const reviewRequests = new Map<string, Promise<QuestionReview>>();
const loadedResults = new Map<string, AttemptResults>();
const loadedReviews = new Map<string, QuestionReview>();

function reviewKey(attemptId: string, questionId: string | number): string {
  return `${attemptId}:${questionId}`;
}

export function peekResults(attemptId: string): AttemptResults | null {
  return loadedResults.get(attemptId) ?? null;
}

export function peekReview(attemptId: string, questionId: string | number): QuestionReview | null {
  return loadedReviews.get(reviewKey(attemptId, questionId)) ?? null;
}

export function loadResults(attemptId: string): Promise<AttemptResults> {
  const pending = resultsRequests.get(attemptId);
  if (pending) {
    return pending;
  }
  const request = fetchResults(attemptId)
    .then((results) => {
      loadedResults.set(attemptId, results);
      return results;
    })
    .catch((error: unknown) => {
      resultsRequests.delete(attemptId);
      throw error;
    });
  resultsRequests.set(attemptId, request);
  return request;
}

export function loadReview(attemptId: string, questionId: string | number): Promise<QuestionReview> {
  const key = reviewKey(attemptId, questionId);
  const pending = reviewRequests.get(key);
  if (pending) {
    return pending;
  }
  const request = fetchReview(attemptId, questionId)
    .then((review) => {
      loadedReviews.set(key, review);
      return review;
    })
    .catch((error: unknown) => {
      reviewRequests.delete(key);
      throw error;
    });
  reviewRequests.set(key, request);
  return request;
}

export function prefetchReview(attemptId: string, questionId: number | null | undefined): void {
  if (questionId === null || questionId === undefined) {
    return;
  }
  void loadReview(attemptId, questionId).catch(() => undefined);
}
