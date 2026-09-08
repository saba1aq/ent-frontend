import type { AttemptResults, QuestionResult, SectionResult } from "@/entities/attempt";

export type ReviewNavigation = {
  section: SectionResult | undefined;
  previousId: number | null;
  nextId: number | null;
};

export function buildReviewNavigation(results: AttemptResults, questionId: number): ReviewNavigation {
  const flat: Array<QuestionResult & { section: SectionResult }> = results.sections.flatMap((section) =>
    section.answers.map((answer) => ({ ...answer, section })),
  );
  const index = flat.findIndex((item) => item.id === questionId);

  return {
    section: index >= 0 ? flat[index].section : undefined,
    previousId: index > 0 ? flat[index - 1].id : null,
    nextId: index >= 0 && index < flat.length - 1 ? flat[index + 1].id : null,
  };
}
