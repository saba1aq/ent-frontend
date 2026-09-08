import type { SectionResult } from "@/entities/attempt";

export function firstReviewTarget(section: SectionResult): number | null {
  const wrong = section.answers.find((answer) => answer.status !== "correct");
  return (wrong ?? section.answers[0])?.id ?? null;
}
